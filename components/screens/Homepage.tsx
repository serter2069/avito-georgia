import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, TextInput, ScrollView, Pressable, useWindowDimensions, ActivityIndicator, Image, RefreshControl, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import BottomNav from '../BottomNav';
import ProtoImage from '../proto/ProtoPlaceholderImage';
import Header from '../Header';
import { ErrorState } from '../ErrorState';
import { apiFetch } from '../../lib/api';
import { colors } from '../../lib/theme';

// ─── Category definitions (local icons/colors, mapped by name to API categories) ──
const CATEGORY_META: { id: string; label: string; bg: string; color: string; icon: string }[] = [
  { id: 'all',      label: 'Все',      bg: '#E8F9F2', color: colors.primary, icon: 'grid-outline' },
  { id: 'auto',     label: 'Авто',     bg: '#E3F2FD', color: '#1976D2', icon: 'car-outline' },
  { id: 'realty',   label: 'Жильё',    bg: '#E8F5E9', color: '#388E3C', icon: 'home-outline' },
  { id: 'tech',     label: 'Техника',  bg: '#EDE7F6', color: '#7B1FA2', icon: 'phone-portrait-outline' },
  { id: 'clothes',  label: 'Одежда',   bg: '#FCE4EC', color: '#C2185B', icon: 'shirt-outline' },
  { id: 'home',     label: 'Дом',      bg: '#FFF3E0', color: '#E65100', icon: 'bed-outline' },
  { id: 'jobs',     label: 'Работа',   bg: '#F3E5F5', color: '#6A1B9A', icon: 'briefcase-outline' },
  { id: 'services', label: 'Услуги',   bg: '#E0F2F1', color: '#00695C', icon: 'construct-outline' },
  { id: 'animals',  label: 'Животные', bg: '#FFF8E1', color: '#F57F17', icon: 'paw-outline' },
];

// Static fallback city list shown while API loads
const DEFAULT_CITIES = ['Все города', 'Тбилиси', 'Батуми', 'Кутаиси', 'Рустави', 'Гори', 'Зугдиди'];

function formatAge(createdAt: string): string {
  const diff = Date.now() - new Date(createdAt).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}мин`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}ч`;
  return `${Math.floor(hrs / 24)}д`;
}

function formatPrice(price: number, currency: string, isNegotiable: boolean): string {
  const symbol = currency === 'GEL' ? '₾' : currency === 'USD' ? '$' : currency;
  const formatted = price.toLocaleString('ru-RU');
  return `${symbol}${formatted}${isNegotiable ? ' (торг)' : ''}`;
}


// ─── Listing card ────────────────────────────────────────────────────────────
function ListingCard({ listing, colorIdx }: {
  listing: any; colorIdx: number;
}) {
  const [fav, setFav] = useState(false);
  const router = useRouter();
  const photoUrl = listing.photos?.[0]?.url;
  const photoCount = listing.photos?.length ?? 0;
  const price = formatPrice(listing.price, listing.currency, listing.isNegotiable);
  const age = listing.createdAt ? formatAge(listing.createdAt) : '';
  const loc = listing.city?.name ?? '';

  return (
    <Pressable
      onPress={() => router.push(`/listings/${listing.id}` as any)}
      accessibilityLabel="Открыть объявление"
      style={{ borderRadius: 10, overflow: 'hidden', borderWidth: 1, borderColor: '#E8E8E8', backgroundColor: colors.background }}
    >
      <View style={{ position: 'relative' }}>
        {photoUrl ? (
          <Image source={{ uri: photoUrl }} style={{ width: '100%', height: 130 }} resizeMode="cover" />
        ) : (
          <ProtoImage seed={colorIdx + 10} width="100%" height={130} />
        )}
        <Pressable onPress={(e) => { e.stopPropagation(); setFav(!fav); }} accessibilityLabel="Добавить в избранное" style={{ position: 'absolute', top: 8, right: 8, width: 28, height: 28, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.9)', alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 14, color: fav ? '#E53935' : colors.textSecondary }}>{fav ? '♥' : '♡'}</Text>
        </Pressable>
        {photoCount > 0 && (
          <View style={{ position: 'absolute', bottom: 6, right: 6, backgroundColor: 'rgba(0,0,0,0.52)', borderRadius: 4, paddingHorizontal: 5, paddingVertical: 2 }}>
            <Text style={{ color: '#fff', fontSize: 10, fontWeight: '600' }}>{photoCount} фото</Text>
          </View>
        )}
      </View>
      <View style={{ padding: 10 }}>
        <Text style={{ fontSize: 13, color: colors.text, lineHeight: 18 }} numberOfLines={2}>{listing.title}</Text>
        <Text style={{ fontSize: 15, fontWeight: '700', color: colors.text, marginTop: 4 }}>{price}</Text>
        <Text style={{ fontSize: 11, color: colors.textSecondary, marginTop: 2 }}>{loc}{age ? ` · ${age}` : ''}</Text>
      </View>
    </Pressable>
  );
}

// ─── Main content ─────────────────────────────────────────────────────────────

export function HomepageContent({ loggedIn, showHeader = true, showBottomNav = true, onRefreshStateChange }: { loggedIn?: boolean; showHeader?: boolean; showBottomNav?: boolean; onRefreshStateChange?: (refreshing: boolean, handleRefresh: () => Promise<void>) => void }) {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;
  const isTablet = width >= 640;
  const cols = isDesktop ? 4 : isTablet ? 3 : 2;
  const hPad = isDesktop ? 32 : 16;
  const maxW = isDesktop ? 1280 : undefined;

  // ─── Filter state ───────────────────────────────────────────────────────────
  const [cityId, setCityId] = useState<string>('');
  const [categoryId, setCategoryId] = useState<string>('');
  const [query, setQuery] = useState('');
  const [priceFrom, setPriceFrom] = useState('');
  const [priceTo, setPriceTo] = useState('');
  const [sort, setSort] = useState<'date' | 'price_asc' | 'price_desc'>('date');

  // ─── Autocomplete + history state ──────────────────────────────────────────
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [searchFocused, setSearchFocused] = useState(false);
  const autocompleteRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ─── API data ───────────────────────────────────────────────────────────────
  const [listings, setListings] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [apiCategories, setApiCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [listingsError, setListingsError] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Debounce timer ref for text inputs
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Fetch cities + categories once on mount
  useEffect(() => {
    apiFetch('/cities').then(r => setCities(r.cities ?? [])).catch(console.error);
    apiFetch('/categories').then(r => setApiCategories(r.categories ?? [])).catch(console.error);
  }, []);

  // Load search history from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('search_history');
      if (stored) setSearchHistory(JSON.parse(stored));
    } catch {}
  }, []);

  // Autocomplete fetch when query changes (300ms debounce, min 2 chars)
  useEffect(() => {
    if (autocompleteRef.current) clearTimeout(autocompleteRef.current);
    if (!query || query.length < 2) { setSuggestions([]); return; }
    autocompleteRef.current = setTimeout(async () => {
      try {
        const r = await apiFetch(`/listings/autocomplete?q=${encodeURIComponent(query)}`);
        setSuggestions(r.suggestions ?? []);
      } catch { setSuggestions([]); }
    }, 300);
    return () => { if (autocompleteRef.current) clearTimeout(autocompleteRef.current); };
  }, [query]);

  const saveToHistory = (q: string) => {
    if (!q.trim()) return;
    const updated = [q, ...searchHistory.filter(h => h !== q)].slice(0, 10);
    setSearchHistory(updated);
    try { localStorage.setItem('search_history', JSON.stringify(updated)); } catch {}
  };

  const buildParams = useCallback((pageNum: number) => {
    const sortParam = sort === 'date' ? 'createdAt_desc' : sort === 'price_asc' ? 'price_asc' : 'price_desc';
    const params = new URLSearchParams();
    if (categoryId) params.set('categoryId', categoryId);
    if (cityId) params.set('cityId', cityId);
    if (query) params.set('q', query);
    if (priceFrom) params.set('priceMin', priceFrom);
    if (priceTo) params.set('priceMax', priceTo);
    params.set('sort', sortParam);
    params.set('page', String(pageNum));
    params.set('limit', '20');
    return params;
  }, [categoryId, cityId, query, priceFrom, priceTo, sort]);

  // Fetch listings when filters change (debounced for text inputs) — resets to page 1
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setPage(1);
      setLoading(true);
      setListingsError(false);
      apiFetch(`/listings?${buildParams(1).toString()}`)
        .then(r => {
          const fetched = r.listings ?? [];
          setListings(fetched);
          const total = r.total ?? 0;
          setHasMore(fetched.length < total);
        })
        .catch(() => setListingsError(true))
        .finally(() => setLoading(false));
    }, 400);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [categoryId, cityId, query, priceFrom, priceTo, sort]);

  const loadMore = async () => {
    if (loadingMore || !hasMore) return;
    const nextPage = page + 1;
    setPage(nextPage);
    setLoadingMore(true);
    try {
      const r = await apiFetch(`/listings?${buildParams(nextPage).toString()}`);
      const fetched = r.listings ?? [];
      setListings(prev => {
        const combined = [...prev, ...fetched];
        const total = r.total ?? 0;
        setHasMore(combined.length < total);
        return combined;
      });
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingMore(false);
    }
  };

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    setPage(1);
    try {
      const r = await apiFetch(`/listings?${buildParams(1).toString()}`);
      const fetched = r.listings ?? [];
      setListings(fetched);
      const total = r.total ?? 0;
      setHasMore(fetched.length < total);
    } catch (e) {
      console.error(e);
    } finally {
      setRefreshing(false);
    }
  }, [buildParams]);

  // Notify parent (e.g. ScrollView owner) of refresh state so it can wire RefreshControl
  useEffect(() => {
    onRefreshStateChange?.(refreshing, handleRefresh);
  }, [refreshing, handleRefresh, onRefreshStateChange]);

  // Build city list for pills: "Все города" + API cities
  const cityPills = [{ id: '', name: 'Все города' }, ...cities];

  // Build category tabs: local CATEGORY_META as base, but when API has categories
  // mark selection by API category id. For display we always use local meta list.
  const CATEGORIES = CATEGORY_META;

  const wrap = (children: React.ReactNode) =>
    isDesktop
      ? <View style={{ maxWidth: maxW as any, alignSelf: 'center', width: '100%', paddingHorizontal: hPad }}>{children}</View>
      : <>{children}</>;

  return (
    <View style={{ backgroundColor: colors.background }}>

      {/* ─── Header ──────────────────────────────────────────────────────────── */}
      {showHeader && (
        <Header
          loggedIn={loggedIn}
          search={{
            value: query,
            onChange: setQuery,
            onFocus: () => setSearchFocused(true),
            onBlur: () => setTimeout(() => setSearchFocused(false), 150),
          }}
        />
      )}

      {/* ─── Autocomplete / history dropdown ─────────────────────────────────── */}
      {searchFocused && (query.length >= 2 ? suggestions.length > 0 : searchHistory.length > 0) && (
        <View style={{
          backgroundColor: '#fff',
          borderBottomWidth: 1,
          borderBottomColor: '#E8E8E8',
          paddingVertical: 4,
          zIndex: 100,
        }}>
          {/* History header */}
          {query.length < 2 && searchHistory.length > 0 && (
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 8 }}>
              <Text style={{ fontSize: 12, color: colors.textSecondary, fontWeight: '600' }}>ИСТОРИЯ</Text>
              <Pressable accessibilityLabel="Очистить историю поиска" onPress={() => {
                setSearchHistory([]);
                try { localStorage.removeItem('search_history'); } catch {}
              }}>
                <Text style={{ fontSize: 12, color: colors.primary }}>Очистить</Text>
              </Pressable>
            </View>
          )}
          {(query.length < 2 ? searchHistory : suggestions).map((item, i) => (
            <Pressable
              key={i}
              onPress={() => {
                setQuery(item);
                saveToHistory(item);
                setSearchFocused(false);
                setSuggestions([]);
              }}
              accessibilityLabel={`Искать ${item}`}
              style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, gap: 12 }}
            >
              <Ionicons
                name={query.length < 2 ? 'time-outline' : 'search-outline'}
                size={16}
                color="#9E9E9E"
              />
              <Text style={{ fontSize: 15, color: colors.text, flex: 1 }}>{item}</Text>
              {query.length < 2 && (
                <Pressable accessibilityLabel="Удалить из истории" onPress={(e) => {
                  e.stopPropagation();
                  const updated = searchHistory.filter((_, idx) => idx !== i);
                  setSearchHistory(updated);
                  try { localStorage.setItem('search_history', JSON.stringify(updated)); } catch {}
                }}>
                  <Ionicons name="close" size={16} color="#9E9E9E" />
                </Pressable>
              )}
            </Pressable>
          ))}
        </View>
      )}

      {/* ─── City pills ──────────────────────────────────────────────────────── */}
      <View style={{ borderBottomWidth: 1, borderBottomColor: '#E8E8E8' }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: hPad, paddingVertical: 9, gap: 7 }}>
          {(cities.length > 0 ? cityPills : [{ id: '', name: 'Все города' }, ...DEFAULT_CITIES.slice(1).map(n => ({ id: n, name: n }))]).map((c) => (
            <Pressable
              key={c.id}
              onPress={() => setCityId(c.id)}
              accessibilityLabel={`Выбрать город ${c.name}`}
              style={{ borderRadius: 20, paddingHorizontal: 13, paddingVertical: 5, backgroundColor: cityId === c.id ? colors.primary : colors.background, borderWidth: 1, borderColor: cityId === c.id ? colors.primary : '#E8E8E8' }}
            >
              <Text style={{ fontSize: 13, fontWeight: cityId === c.id ? '600' : '400', color: cityId === c.id ? '#fff' : colors.text }}>{c.name}</Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {/* ─── Category icons ───────────────────────────────────────────────────── */}
      <View style={{ borderBottomWidth: 1, borderBottomColor: '#E8E8E8' }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: hPad, paddingVertical: 10, gap: 10 }}>
          {CATEGORIES.map((cat) => {
            // Match local meta category to API category by label (case-insensitive)
            const apiCat = apiCategories.find(a => a.name?.toLowerCase() === cat.label.toLowerCase());
            const resolvedId = cat.id === 'all' ? '' : (apiCat?.id ?? cat.id);
            const active = categoryId === resolvedId;
            return (
              <Pressable key={cat.id} onPress={() => setCategoryId(resolvedId)} accessibilityLabel={`Выбрать категорию ${cat.label}`} style={{ alignItems: 'center', gap: 5, minWidth: 52 }}>
                <View style={{ width: 48, height: 48, borderRadius: 13, backgroundColor: active ? cat.color : cat.bg, alignItems: 'center', justifyContent: 'center', borderWidth: active ? 0 : 1, borderColor: '#E8E8E8' }}>
                  <Ionicons name={cat.icon as any} size={22} color={active ? '#fff' : cat.color} />
                </View>
                <Text style={{ fontSize: 10, color: active ? cat.color : colors.textSecondary, fontWeight: active ? '700' : '400', textAlign: 'center' }} numberOfLines={1}>
                  {cat.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* ─── Inline filters ───────────────────────────────────────────────────── */}
      <View style={{ borderBottomWidth: 1, borderBottomColor: '#E8E8E8', paddingHorizontal: hPad, paddingVertical: 10 }}>
        <View style={{ flexDirection: isTablet ? 'row' : 'column', gap: 10, alignItems: isTablet ? 'center' : 'stretch', maxWidth: maxW, alignSelf: isDesktop ? 'center' : undefined, width: '100%' }}>

          {/* Price range */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flex: isTablet ? 0 : undefined }}>
            <Text style={{ fontSize: 13, color: colors.textSecondary, flexShrink: 0 }}>Цена ₾</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#E8E8E8', borderRadius: 7, paddingHorizontal: 8, paddingVertical: 5, minWidth: 70 }}>
              <TextInput
                style={{ fontSize: 13, color: colors.text, width: 55, borderWidth: 0, backgroundColor: 'transparent', outlineWidth: 0, paddingVertical: 0 } as any}
                placeholder="от"
                placeholderTextColor={colors.textSecondary}
                value={priceFrom}
                onChangeText={setPriceFrom}
                keyboardType="numeric"
              />
            </View>
            <Text style={{ color: colors.textSecondary, fontSize: 13 }}>—</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#E8E8E8', borderRadius: 7, paddingHorizontal: 8, paddingVertical: 5, minWidth: 70 }}>
              <TextInput
                style={{ fontSize: 13, color: colors.text, width: 55, borderWidth: 0, backgroundColor: 'transparent', outlineWidth: 0, paddingVertical: 0 } as any}
                placeholder="до"
                placeholderTextColor={colors.textSecondary}
                value={priceTo}
                onChangeText={setPriceTo}
                keyboardType="numeric"
              />
            </View>
          </View>

          {/* Spacer */}
          {isTablet && <View style={{ flex: 1 }} />}

          {/* Sort select + Map button */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            {/* Refresh button — web only (native uses pull-to-refresh via RefreshControl) */}
            {Platform.OS === 'web' && (
              <Pressable
                onPress={handleRefresh}
                disabled={refreshing || loading}
                accessibilityLabel="Обновить список объявлений"
                style={{ flexDirection: 'row', alignItems: 'center', gap: 4, borderWidth: 1, borderColor: '#E8E8E8', borderRadius: 7, paddingHorizontal: 10, paddingVertical: 6, backgroundColor: colors.background, opacity: (refreshing || loading) ? 0.5 : 1 }}
              >
                {refreshing ? (
                  <ActivityIndicator size="small" color={colors.primary} />
                ) : (
                  <Ionicons name="refresh-outline" size={16} color={colors.primary} />
                )}
                <Text style={{ fontSize: 13, color: colors.text }}>Обновить</Text>
              </Pressable>
            )}
            {/* Map button */}
            <Pressable
              onPress={() => router.push('/map' as any)}
              accessibilityLabel="Открыть карту"
              style={{ flexDirection: 'row', alignItems: 'center', gap: 4, borderWidth: 1, borderColor: '#E8E8E8', borderRadius: 7, paddingHorizontal: 10, paddingVertical: 6, backgroundColor: colors.background }}
            >
              <Ionicons name="map-outline" size={16} color={colors.primary} />
              <Text style={{ fontSize: 13, color: colors.text }}>Карта</Text>
            </Pressable>
            {/* Native select — works in Expo web */}
            <View style={{ borderWidth: 1, borderColor: '#E8E8E8', borderRadius: 7, paddingHorizontal: 8, paddingVertical: 0, backgroundColor: colors.background, flexDirection: 'row', alignItems: 'center' }}>
              {/* @ts-ignore — select is valid HTML element in RN web */}
              <select
                value={sort}
                onChange={(e: any) => setSort(e.target.value)}
                style={{
                  fontSize: 13, color: colors.text, backgroundColor: 'transparent',
                  border: 'none', outline: 'none', paddingTop: 5, paddingBottom: 5,
                  cursor: 'pointer', appearance: 'none', paddingRight: 18,
                }}
              >
                <option value="date">По дате</option>
                <option value="price_asc">Дешевле</option>
                <option value="price_desc">Дороже</option>
              </select>
              <Text style={{ fontSize: 10, color: colors.textSecondary, marginLeft: -16, pointerEvents: 'none' as any }}>▾</Text>
            </View>
          </View>
        </View>
      </View>

      {/* ─── Listings grid ────────────────────────────────────────────────────── */}
      <View style={{ paddingHorizontal: hPad, paddingTop: 14, paddingBottom: 20 }}>
        {wrap(
          loading ? (
            <View style={{ alignItems: 'center', paddingVertical: 40 }}>
              <ActivityIndicator size="large" color={colors.primary} />
            </View>
          ) : listingsError ? (
            <ErrorState
              message="Не удалось загрузить объявления"
              onRetry={() => {
                setListingsError(false);
                setLoading(true);
                apiFetch(`/listings?${buildParams(1).toString()}`)
                  .then(r => {
                    setListings(r.listings ?? []);
                    setHasMore((r.listings ?? []).length < (r.total ?? 0));
                  })
                  .catch(() => setListingsError(true))
                  .finally(() => setLoading(false));
              }}
            />
          ) : listings.length === 0 ? (
            <View style={{ alignItems: 'center', paddingVertical: 40, gap: 12 }}>
              <Ionicons name="search-outline" size={48} color="#D0D0D0" />
              <Text style={{ fontSize: 15, color: colors.textSecondary }}>Нет объявлений по вашим фильтрам</Text>
              {(categoryId || cityId || query || priceFrom || priceTo) && (
                <Pressable
                  onPress={() => { setCategoryId(''); setCityId(''); setQuery(''); setPriceFrom(''); setPriceTo(''); }}
                  accessibilityLabel="Сбросить фильтры"
                  style={{ backgroundColor: colors.primary, borderRadius: 10, paddingHorizontal: 24, paddingVertical: 12 }}
                >
                  <Text style={{ color: '#fff', fontWeight: '700', fontSize: 15 }}>Сбросить фильтры</Text>
                </Pressable>
              )}
            </View>
          ) : (
            <View>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
                {listings.map((l, i) => (
                  <View key={l.id ?? i} style={{ width: `${(100 / cols) - (cols === 2 ? 2 : cols === 3 ? 1.5 : 1)}%` as any }}>
                    <ListingCard listing={l} colorIdx={i} />
                  </View>
                ))}
              </View>
              {hasMore && !loading && (
                <Pressable
                  onPress={loadMore}
                  disabled={loadingMore}
                  accessibilityLabel="Показать ещё объявления"
                  style={{
                    marginTop: 16,
                    paddingVertical: 14,
                    borderRadius: 10,
                    borderWidth: 1.5,
                    borderColor: colors.primary,
                    alignItems: 'center',
                  }}
                >
                  {loadingMore ? (
                    <ActivityIndicator color={colors.primary} size="small" />
                  ) : (
                    <Text style={{ color: colors.primary, fontWeight: '700', fontSize: 15 }}>Показать ещё</Text>
                  )}
                </Pressable>
              )}
            </View>
          )
        )}
      </View>

      {showBottomNav && !isTablet && <BottomNav active="home" />}
    </View>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════

export default HomepageContent;
