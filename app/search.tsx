import { View, ScrollView, Text, TextInput, TouchableOpacity, FlatList, ActivityIndicator, Platform } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useState, useEffect, useCallback } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Header } from '../components/layout/Header';
import { CitySelector, City } from '../components/common/CitySelector';
import { CategoryIcon, CategoryType } from '../components/common/CategoryIcon';
import { ListingCard, Listing } from '../components/listing/ListingCard';
import { SearchMap, MapListing } from '../components/map/SearchMap';
import { api } from '../lib/api';
import { colors } from '../lib/colors';

const CATEGORIES: CategoryType[] = [
  'transport',
  'realEstate',
  'electronics',
  'clothing',
  'furniture',
  'services',
  'jobs',
  'kids',
  'pets',
  'hobbies',
];

// Map frontend CategoryType to DB slug
const CATEGORY_SLUG: Record<CategoryType, string> = {
  transport: 'transport',
  realEstate: 'real-estate',
  electronics: 'electronics',
  clothing: 'fashion',
  furniture: 'home-garden',
  services: 'services',
  jobs: 'jobs',
  kids: 'kids',
  pets: 'pets',
  hobbies: 'hobbies',
};

interface ListingsResponse {
  listings: ApiListing[];
  total: number;
  page: number;
  limit: number;
}

interface ApiListing {
  id: string;
  title: string;
  price: number | null;
  currency: string;
  status: string;
  views: number;
  createdAt: string;
  city?: { id: string; nameRu: string; nameEn: string; nameKa: string };
  category?: { id: string; name: string; slug: string };
  photos?: { id: string; url: string; order: number }[];
  isPromoted?: boolean;
  isHighlighted?: boolean;
}

// Map DB category slug to i18n translation key
const SLUG_TO_I18N_KEY: Record<string, string> = {
  transport: 'transport',
  'real-estate': 'realEstate',
  electronics: 'electronics',
  fashion: 'clothing',
  'home-garden': 'furniture',
  services: 'services',
  jobs: 'jobs',
  kids: 'kids',
  pets: 'pets',
  hobbies: 'hobbies',
};

function getCityName(city: ApiListing['city'], lang: string): string | undefined {
  if (!city) return undefined;
  if (lang === 'en') return city.nameEn || city.nameRu;
  if (lang === 'ka') return city.nameKa || city.nameRu;
  return city.nameRu;
}

function mapListing(l: ApiListing, lang: string, t: (key: string) => string): Listing {
  const i18nKey = l.category?.slug ? SLUG_TO_I18N_KEY[l.category.slug] : undefined;
  return {
    id: l.id,
    title: l.title,
    price: l.price,
    currency: l.currency,
    imageUrl: l.photos?.[0]?.url,
    city: getCityName(l.city, lang),
    category: i18nKey ? t(i18nKey) : (l.category?.name),
    createdAt: l.createdAt,
    isPromoted: l.isPromoted ?? false,
    isHighlighted: l.isHighlighted ?? false,
  };
}

export default function SearchScreen() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const params = useLocalSearchParams<{ q?: string }>();

  const [searchQuery, setSearchQuery] = useState(params.q || '');
  const [selectedCity, setSelectedCity] = useState<City>('all');
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | null>(null);
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

  const [listings, setListings] = useState<Listing[]>([]);
  const [mapListings, setMapListings] = useState<MapListing[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [hasSearched, setHasSearched] = useState(false);

  const buildQuery = useCallback((p: number) => {
    const parts: string[] = [];
    if (searchQuery.trim()) parts.push(`q=${encodeURIComponent(searchQuery.trim())}`);
    if (selectedCity !== 'all') parts.push(`city=${selectedCity}`);
    if (selectedCategory) parts.push(`category=${CATEGORY_SLUG[selectedCategory]}`);
    if (priceMin) parts.push(`price_min=${priceMin}`);
    if (priceMax) parts.push(`price_max=${priceMax}`);
    parts.push(`page=${p}`);
    parts.push('sort=createdAt_desc');
    return `/listings?${parts.join('&')}`;
  }, [searchQuery, selectedCity, selectedCategory, priceMin, priceMax]);

  const buildMapQuery = useCallback(() => {
    const parts: string[] = [];
    if (selectedCity !== 'all') parts.push(`city=${selectedCity}`);
    return `/listings/map?${parts.join('&')}`;
  }, [selectedCity]);

  const doSearch = useCallback(async (resetPage = true) => {
    const p = resetPage ? 1 : page;
    if (resetPage) {
      setPage(1);
      setLoading(true);
    } else {
      setLoadingMore(true);
    }

    const res = await api.get<ListingsResponse>(buildQuery(p));
    if (res.ok && res.data) {
      const lang = i18n.language;
      if (resetPage) {
        setListings(res.data.listings.map((l) => mapListing(l, lang, t)));
      } else {
        setListings(prev => [...prev, ...res.data!.listings.map((l) => mapListing(l, lang, t))]);
      }
      setTotal(res.data.total);
    }

    // Fetch map data in parallel (web-only endpoint, no-op on native)
    if (Platform.OS === 'web') {
      const mapRes = await api.get<MapListing[]>(buildMapQuery());
      if (mapRes.ok && mapRes.data) {
        setMapListings(mapRes.data);
      }
    }

    setHasSearched(true);
    setLoading(false);
    setLoadingMore(false);
  }, [buildQuery, buildMapQuery, page]);

  // Auto-search on mount if q param exists
  useEffect(() => {
    if (params.q) {
      doSearch(true);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleLoadMore = () => {
    if (loadingMore || listings.length >= total) return;
    const nextPage = page + 1;
    setPage(nextPage);
    setLoadingMore(true);
    const query = buildQuery(nextPage);
    api.get<ListingsResponse>(query).then(res => {
      if (res.ok && res.data) {
        setListings(prev => [...prev, ...res.data!.listings.map((l) => mapListing(l, i18n.language, t))]);
        setTotal(res.data.total);
      }
      setLoadingMore(false);
    });
  };

  const handleReset = () => {
    setSearchQuery('');
    setSelectedCity('all');
    setSelectedCategory(null);
    setPriceMin('');
    setPriceMax('');
  };

  const handleListingPress = (id: string) => {
    router.push(`/listings/${id}`);
  };

  const renderItem = useCallback(({ item }: { item: Listing }) => (
    <View className="px-4 mb-3">
      <ListingCard listing={item} onPress={handleListingPress} />
    </View>
  ), []);

  const renderEmpty = () => {
    if (!hasSearched) return null;
    return (
      <View className="py-16 items-center px-4">
        <Ionicons name="search" size={48} color={colors.textMuted} style={{ marginBottom: 16 }} />
        <Text className="text-text-primary text-base font-semibold mb-1">{t('nothingFound')}</Text>
        <Text className="text-text-muted text-sm text-center">{t('tryDifferentSearch')}</Text>
      </View>
    );
  };

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View className="py-4 items-center">
        <ActivityIndicator size="small" color={colors.brandPrimary} />
      </View>
    );
  };

  // Map toggle is only useful on web (Leaflet is web-only)
  const showMapToggle = Platform.OS === 'web';

  return (
    <View className="flex-1 bg-dark">
      <Header title={t('search')} />

      {/* Search input */}
      <View className="px-4 pt-3 pb-1">
        <View className="flex-row bg-surface border border-border rounded-lg overflow-hidden">
          <TextInput
            className="flex-1 px-4 py-3 text-text-primary text-base"
            placeholder={t('searchPlaceholder')}
            placeholderTextColor={colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={() => doSearch(true)}
            returnKeyType="search"
            autoFocus
          />
          <TouchableOpacity
            className="px-4 items-center justify-center bg-primary"
            onPress={() => doSearch(true)}
          >
            <Ionicons name="search" size={20} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Filters toggle + view mode toggle */}
      <View className="px-4 py-2 flex-row items-center justify-between">
        <View className="flex-row items-center gap-2">
          <TouchableOpacity
            className={`px-3 py-1.5 rounded-full border ${showFilters ? 'bg-primary border-primary' : 'border-border'}`}
            onPress={() => setShowFilters(!showFilters)}
          >
            <Text className={`text-sm font-medium ${showFilters ? 'text-white' : 'text-text-secondary'}`}>
              {t('filters')}
            </Text>
          </TouchableOpacity>

          {/* List/Map toggle — web only, shown after first search */}
          {showMapToggle && hasSearched && (
            <View className="flex-row border border-border rounded-full overflow-hidden">
              <TouchableOpacity
                className={`px-3 py-1.5 ${viewMode === 'list' ? 'bg-primary' : 'bg-transparent'}`}
                onPress={() => setViewMode('list')}
              >
                <Text className={`text-sm font-medium ${viewMode === 'list' ? 'text-white' : 'text-text-secondary'}`}>
                  {t('listView')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className={`px-3 py-1.5 ${viewMode === 'map' ? 'bg-primary' : 'bg-transparent'}`}
                onPress={() => setViewMode('map')}
              >
                <Text className={`text-sm font-medium ${viewMode === 'map' ? 'text-white' : 'text-text-secondary'}`}>
                  {t('mapView')}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {hasSearched && (
          <Text className="text-text-muted text-xs">
            {total} {t('listings').toLowerCase()}
          </Text>
        )}
      </View>

      {/* Filters panel */}
      {showFilters && (
        <View className="px-4 pb-3 gap-3">
          {/* City */}
          <CitySelector selected={selectedCity} onSelect={setSelectedCity} />

          {/* Category */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerClassName="gap-2"
          >
            {CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat}
                className={`px-3 py-1.5 rounded-full border ${
                  selectedCategory === cat ? 'bg-primary border-primary' : 'border-border'
                }`}
                onPress={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
              >
                <Text className={`text-xs font-medium ${
                  selectedCategory === cat ? 'text-white' : 'text-text-secondary'
                }`}>
                  {t(cat)}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Price range */}
          <View className="flex-row gap-2">
            <View className="flex-1">
              <TextInput
                className="bg-surface border border-border rounded-lg px-3 py-2.5 text-text-primary text-sm"
                placeholder={t('priceFrom')}
                placeholderTextColor={colors.textMuted}
                value={priceMin}
                onChangeText={setPriceMin}
                keyboardType="numeric"
              />
            </View>
            <View className="flex-1">
              <TextInput
                className="bg-surface border border-border rounded-lg px-3 py-2.5 text-text-primary text-sm"
                placeholder={t('priceTo')}
                placeholderTextColor={colors.textMuted}
                value={priceMax}
                onChangeText={setPriceMax}
                keyboardType="numeric"
              />
            </View>
          </View>

          {/* Apply / Reset */}
          <View className="flex-row gap-2">
            <TouchableOpacity
              className="flex-1 bg-primary py-2.5 rounded-lg items-center"
              onPress={() => doSearch(true)}
            >
              <Text className="text-white text-sm font-semibold">{t('apply')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="px-4 py-2.5 rounded-lg border border-border items-center"
              onPress={handleReset}
            >
              <Text className="text-text-secondary text-sm">{t('reset')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Results */}
      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={colors.brandPrimary} />
          <Text className="text-text-muted mt-2 text-sm">{t('loading')}</Text>
        </View>
      ) : viewMode === 'map' && Platform.OS === 'web' ? (
        <View style={{ flex: 1 }}>
          <SearchMap listings={mapListings} onMarkerPress={handleListingPress} />
        </View>
      ) : (
        <FlatList
          data={listings}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          ListEmptyComponent={renderEmpty}
          ListFooterComponent={renderFooter}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.3}
          contentContainerClassName="pb-4"
        />
      )}
    </View>
  );
}
