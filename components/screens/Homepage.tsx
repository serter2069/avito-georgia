import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, ScrollView, Pressable, useWindowDimensions, ActivityIndicator, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import BottomNav from '../BottomNav';
import ProtoImage from '../proto/ProtoPlaceholderImage';
import Header from '../Header';
import { apiFetch } from '../../lib/api';

const C = {
  green: '#00AA6C', greenBg: '#E8F9F2',
  white: '#FFFFFF',
  text: '#1A1A1A', muted: '#9E9E9E', border: '#E8E8E8',
};

// ─── Category definitions (local icons/colors, mapped by name to API categories) ──
const CATEGORY_META: { id: string; label: string; bg: string; color: string; icon: string }[] = [
  { id: 'all',      label: 'Все',      bg: '#E8F9F2', color: '#00AA6C', icon: 'grid-outline' },
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
      style={{ borderRadius: 10, overflow: 'hidden', borderWidth: 1, borderColor: C.border, backgroundColor: C.white }}
    >
      <View style={{ position: 'relative' }}>
        {photoUrl ? (
          <Image source={{ uri: photoUrl }} style={{ width: '100%', height: 130 }} resizeMode="cover" />
        ) : (
          <ProtoImage seed={colorIdx + 10} width="100%" height={130} />
        )}
        <Pressable onPress={(e) => { e.stopPropagation(); setFav(!fav); }} style={{ position: 'absolute', top: 8, right: 8, width: 28, height: 28, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.9)', alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 14, color: fav ? '#E53935' : C.muted }}>{fav ? '♥' : '♡'}</Text>
        </Pressable>
        {photoCount > 0 && (
          <View style={{ position: 'absolute', bottom: 6, right: 6, backgroundColor: 'rgba(0,0,0,0.52)', borderRadius: 4, paddingHorizontal: 5, paddingVertical: 2 }}>
            <Text style={{ color: '#fff', fontSize: 10, fontWeight: '600' }}>{photoCount} фото</Text>
          </View>
        )}
      </View>
      <View style={{ padding: 10 }}>
        <Text style={{ fontSize: 13, color: C.text, lineHeight: 18 }} numberOfLines={2}>{listing.title}</Text>
        <Text style={{ fontSize: 15, fontWeight: '700', color: C.text, marginTop: 4 }}>{price}</Text>
        <Text style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>{loc}{age ? ` · ${age}` : ''}</Text>
      </View>
    </Pressable>
  );
}

// ─── Main content ─────────────────────────────────────────────────────────────

export function HomepageContent({ loggedIn, showHeader = true, showBottomNav = true }: { loggedIn?: boolean; showHeader?: boolean; showBottomNav?: boolean }) {
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

  // ─── API data ───────────────────────────────────────────────────────────────
  const [listings, setListings] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [apiCategories, setApiCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Debounce timer ref for text inputs
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Fetch cities + categories once on mount
  useEffect(() => {
    apiFetch('/cities').then(r => setCities(r.cities ?? [])).catch(console.error);
    apiFetch('/categories').then(r => setApiCategories(r.categories ?? [])).catch(console.error);
  }, []);

  // Fetch listings when filters change (debounced for text inputs)
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const sortParam = sort === 'date' ? 'createdAt_desc' : sort === 'price_asc' ? 'price_asc' : 'price_desc';
      const params = new URLSearchParams();
      if (categoryId) params.set('categoryId', categoryId);
      if (cityId) params.set('cityId', cityId);
      if (query) params.set('q', query);
      if (priceFrom) params.set('priceMin', priceFrom);
      if (priceTo) params.set('priceMax', priceTo);
      params.set('sort', sortParam);
      params.set('page', '1');
      params.set('limit', '20');
      setLoading(true);
      apiFetch(`/listings?${params.toString()}`)
        .then(r => setListings(r.listings ?? []))
        .catch(console.error)
        .finally(() => setLoading(false));
    }, 400);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [categoryId, cityId, query, priceFrom, priceTo, sort]);

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
    <View style={{ backgroundColor: C.white }}>

      {/* ─── Header ──────────────────────────────────────────────────────────── */}
      {showHeader && <Header loggedIn={loggedIn} search={{ value: query, onChange: setQuery }} />}

      {/* ─── City pills ──────────────────────────────────────────────────────── */}
      <View style={{ borderBottomWidth: 1, borderBottomColor: C.border }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: hPad, paddingVertical: 9, gap: 7 }}>
          {(cities.length > 0 ? cityPills : [{ id: '', name: 'Все города' }, ...DEFAULT_CITIES.slice(1).map(n => ({ id: n, name: n }))]).map((c) => (
            <Pressable
              key={c.id}
              onPress={() => setCityId(c.id)}
              style={{ borderRadius: 20, paddingHorizontal: 13, paddingVertical: 5, backgroundColor: cityId === c.id ? C.green : C.white, borderWidth: 1, borderColor: cityId === c.id ? C.green : C.border }}
            >
              <Text style={{ fontSize: 13, fontWeight: cityId === c.id ? '600' : '400', color: cityId === c.id ? '#fff' : C.text }}>{c.name}</Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {/* ─── Category icons ───────────────────────────────────────────────────── */}
      <View style={{ borderBottomWidth: 1, borderBottomColor: C.border }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: hPad, paddingVertical: 10, gap: 10 }}>
          {CATEGORIES.map((cat) => {
            // Match local meta category to API category by label (case-insensitive)
            const apiCat = apiCategories.find(a => a.name?.toLowerCase() === cat.label.toLowerCase());
            const resolvedId = cat.id === 'all' ? '' : (apiCat?.id ?? cat.id);
            const active = categoryId === resolvedId;
            return (
              <Pressable key={cat.id} onPress={() => setCategoryId(resolvedId)} style={{ alignItems: 'center', gap: 5, minWidth: 52 }}>
                <View style={{ width: 48, height: 48, borderRadius: 13, backgroundColor: active ? cat.color : cat.bg, alignItems: 'center', justifyContent: 'center', borderWidth: active ? 0 : 1, borderColor: C.border }}>
                  <Ionicons name={cat.icon as any} size={22} color={active ? '#fff' : cat.color} />
                </View>
                <Text style={{ fontSize: 10, color: active ? cat.color : C.muted, fontWeight: active ? '700' : '400', textAlign: 'center' }} numberOfLines={1}>
                  {cat.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* ─── Inline filters ───────────────────────────────────────────────────── */}
      <View style={{ borderBottomWidth: 1, borderBottomColor: C.border, paddingHorizontal: hPad, paddingVertical: 10 }}>
        <View style={{ flexDirection: isTablet ? 'row' : 'column', gap: 10, alignItems: isTablet ? 'center' : 'stretch', maxWidth: maxW, alignSelf: isDesktop ? 'center' : undefined, width: '100%' }}>

          {/* Price range */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flex: isTablet ? 0 : undefined }}>
            <Text style={{ fontSize: 13, color: C.muted, flexShrink: 0 }}>Цена ₾</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: C.border, borderRadius: 7, paddingHorizontal: 8, paddingVertical: 5, minWidth: 70 }}>
              <TextInput
                style={{ fontSize: 13, color: C.text, width: 55, borderWidth: 0, backgroundColor: 'transparent', outlineWidth: 0, paddingVertical: 0 } as any}
                placeholder="от"
                placeholderTextColor={C.muted}
                value={priceFrom}
                onChangeText={setPriceFrom}
                keyboardType="numeric"
              />
            </View>
            <Text style={{ color: C.muted, fontSize: 13 }}>—</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: C.border, borderRadius: 7, paddingHorizontal: 8, paddingVertical: 5, minWidth: 70 }}>
              <TextInput
                style={{ fontSize: 13, color: C.text, width: 55, borderWidth: 0, backgroundColor: 'transparent', outlineWidth: 0, paddingVertical: 0 } as any}
                placeholder="до"
                placeholderTextColor={C.muted}
                value={priceTo}
                onChangeText={setPriceTo}
                keyboardType="numeric"
              />
            </View>
          </View>

          {/* Spacer */}
          {isTablet && <View style={{ flex: 1 }} />}

          {/* Sort select */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            {/* Native select — works in Expo web */}
            <View style={{ borderWidth: 1, borderColor: C.border, borderRadius: 7, paddingHorizontal: 8, paddingVertical: 0, backgroundColor: C.white, flexDirection: 'row', alignItems: 'center' }}>
              {/* @ts-ignore — select is valid HTML element in RN web */}
              <select
                value={sort}
                onChange={(e: any) => setSort(e.target.value)}
                style={{
                  fontSize: 13, color: '#1A1A1A', backgroundColor: 'transparent',
                  border: 'none', outline: 'none', paddingTop: 5, paddingBottom: 5,
                  cursor: 'pointer', appearance: 'none', paddingRight: 18,
                }}
              >
                <option value="date">По дате</option>
                <option value="price_asc">Дешевле</option>
                <option value="price_desc">Дороже</option>
              </select>
              <Text style={{ fontSize: 10, color: C.muted, marginLeft: -16, pointerEvents: 'none' as any }}>▾</Text>
            </View>
          </View>
        </View>
      </View>

      {/* ─── Listings grid ────────────────────────────────────────────────────── */}
      <View style={{ paddingHorizontal: hPad, paddingTop: 14, paddingBottom: 20 }}>
        {wrap(
          loading ? (
            <View style={{ alignItems: 'center', paddingVertical: 40 }}>
              <ActivityIndicator size="large" color={C.green} />
            </View>
          ) : listings.length === 0 ? (
            <View style={{ alignItems: 'center', paddingVertical: 40 }}>
              <Text style={{ fontSize: 15, color: C.muted }}>Ничего не найдено</Text>
            </View>
          ) : (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
              {listings.map((l, i) => (
                <View key={l.id ?? i} style={{ width: `${(100 / cols) - (cols === 2 ? 2 : cols === 3 ? 1.5 : 1)}%` as any }}>
                  <ListingCard listing={l} colorIdx={i} />
                </View>
              ))}
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
