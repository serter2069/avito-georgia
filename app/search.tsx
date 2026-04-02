import { View, ScrollView, Text, TextInput, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useState, useEffect, useCallback } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Header } from '../components/layout/Header';
import { CitySelector, City } from '../components/common/CitySelector';
import { CategoryIcon, CategoryType } from '../components/common/CategoryIcon';
import { ListingCard, Listing } from '../components/listing/ListingCard';
import { api } from '../lib/api';

const CATEGORIES: CategoryType[] = [
  'transport',
  'realEstate',
  'electronics',
  'clothing',
  'furniture',
  'services',
  'jobs',
  'other',
];

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
  city?: { id: string; nameRu: string };
  category?: { id: string; name: string };
  photos?: { id: string; url: string; order: number }[];
}

function mapListing(l: ApiListing): Listing {
  return {
    id: l.id,
    title: l.title,
    price: l.price,
    currency: l.currency,
    imageUrl: l.photos?.[0]?.url,
    city: l.city?.nameRu,
    category: l.category?.name,
    createdAt: l.createdAt,
  };
}

export default function SearchScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useLocalSearchParams<{ q?: string }>();

  const [searchQuery, setSearchQuery] = useState(params.q || '');
  const [selectedCity, setSelectedCity] = useState<City>('all');
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | null>(null);
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [hasSearched, setHasSearched] = useState(false);

  const buildQuery = useCallback((p: number) => {
    const parts: string[] = [];
    if (searchQuery.trim()) parts.push(`q=${encodeURIComponent(searchQuery.trim())}`);
    if (selectedCity !== 'all') parts.push(`city=${selectedCity}`);
    if (selectedCategory) parts.push(`category=${selectedCategory}`);
    if (priceMin) parts.push(`price_min=${priceMin}`);
    if (priceMax) parts.push(`price_max=${priceMax}`);
    parts.push(`page=${p}`);
    parts.push('sort=createdAt_desc');
    return `/listings?${parts.join('&')}`;
  }, [searchQuery, selectedCity, selectedCategory, priceMin, priceMax]);

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
      if (resetPage) {
        setListings(res.data.listings.map(mapListing));
      } else {
        setListings(prev => [...prev, ...res.data!.listings.map(mapListing)]);
      }
      setTotal(res.data.total);
    }

    setHasSearched(true);
    setLoading(false);
    setLoadingMore(false);
  }, [buildQuery, page]);

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
        setListings(prev => [...prev, ...res.data!.listings.map(mapListing)]);
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
    // Will navigate to listing detail when route is ready
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
        <Text className="text-text-muted text-4xl mb-4">&#x1F50D;</Text>
        <Text className="text-text-primary text-base font-semibold mb-1">{t('nothingFound')}</Text>
        <Text className="text-text-muted text-sm text-center">{t('tryDifferentSearch')}</Text>
      </View>
    );
  };

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View className="py-4 items-center">
        <ActivityIndicator size="small" color="#6366f1" />
      </View>
    );
  };

  return (
    <View className="flex-1 bg-dark">
      <Header title={t('search')} />

      {/* Search input */}
      <View className="px-4 pt-3 pb-1">
        <View className="flex-row bg-surface border border-border rounded-lg overflow-hidden">
          <TextInput
            className="flex-1 px-4 py-3 text-text-primary text-base"
            placeholder={t('searchPlaceholder')}
            placeholderTextColor="#64748b"
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
            <Text className="text-white text-base">&#x1F50D;</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Filters toggle */}
      <View className="px-4 py-2 flex-row items-center justify-between">
        <TouchableOpacity
          className={`px-3 py-1.5 rounded-full border ${showFilters ? 'bg-primary border-primary' : 'border-border'}`}
          onPress={() => setShowFilters(!showFilters)}
        >
          <Text className={`text-sm font-medium ${showFilters ? 'text-white' : 'text-text-secondary'}`}>
            {t('filters')}
          </Text>
        </TouchableOpacity>

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
                placeholderTextColor="#64748b"
                value={priceMin}
                onChangeText={setPriceMin}
                keyboardType="numeric"
              />
            </View>
            <View className="flex-1">
              <TextInput
                className="bg-surface border border-border rounded-lg px-3 py-2.5 text-text-primary text-sm"
                placeholder={t('priceTo')}
                placeholderTextColor="#64748b"
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
          <ActivityIndicator size="large" color="#6366f1" />
          <Text className="text-text-muted mt-2 text-sm">{t('loading')}</Text>
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
