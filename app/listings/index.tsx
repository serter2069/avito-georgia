import { View, Text, TouchableOpacity, FlatList, ActivityIndicator, ScrollView, useWindowDimensions } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useState, useEffect, useCallback } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Header } from '../../components/layout/Header';
import { CitySelector, City } from '../../components/common/CitySelector';
import { ListingCard, Listing } from '../../components/listing/ListingCard';
import { CategoryType } from '../../components/common/CategoryIcon';
import { api } from '../../lib/api';

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

type SortOption = 'createdAt_desc' | 'price_asc' | 'price_desc' | 'views_desc';

const SORT_OPTIONS: { key: SortOption; label: string }[] = [
  { key: 'createdAt_desc', label: 'sortDate' },
  { key: 'price_asc', label: 'sortPriceAsc' },
  { key: 'price_desc', label: 'sortPriceDesc' },
  { key: 'views_desc', label: 'sortViews' },
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
  isPromoted?: boolean;
  isHighlighted?: boolean;
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

export default function ListingsScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useLocalSearchParams<{ category?: string }>();
  const { width } = useWindowDimensions();

  // Max 430px as per root layout, minus padding (16*2) minus gap (12)
  const containerWidth = Math.min(width, 430);
  const itemWidth = (containerWidth - 32 - 12) / 2;

  const [selectedCity, setSelectedCity] = useState<City>('all');
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | null>(
    (params.category as CategoryType) || null
  );
  const [sortBy, setSortBy] = useState<SortOption>('createdAt_desc');
  const [showSort, setShowSort] = useState(false);

  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchListings = useCallback(async (p: number, reset: boolean) => {
    const parts: string[] = [];
    if (selectedCategory) parts.push(`category=${selectedCategory}`);
    if (selectedCity !== 'all') parts.push(`city=${selectedCity}`);
    parts.push(`sort=${sortBy}`);
    parts.push(`page=${p}`);
    const query = `/listings?${parts.join('&')}`;

    if (reset) setLoading(true);
    else setLoadingMore(true);

    const res = await api.get<ListingsResponse>(query);
    if (res.ok && res.data) {
      if (reset) {
        setListings(res.data.listings.map(mapListing));
      } else {
        setListings(prev => [...prev, ...res.data!.listings.map(mapListing)]);
      }
      setTotal(res.data.total);
    }

    setLoading(false);
    setLoadingMore(false);
  }, [selectedCategory, selectedCity, sortBy]);

  // Reset and fetch when filters change
  useEffect(() => {
    setPage(1);
    fetchListings(1, true);
  }, [selectedCategory, selectedCity, sortBy]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleLoadMore = () => {
    if (loadingMore || listings.length >= total) return;
    const nextPage = page + 1;
    setPage(nextPage);
    fetchListings(nextPage, false);
  };

  const handleListingPress = (id: string) => {
    router.push(`/listings/${id}`);
  };

  const renderItem = useCallback(({ item }: { item: Listing }) => (
    <View style={{ width: itemWidth, marginBottom: 12 }}>
      <ListingCard listing={item} onPress={handleListingPress} />
    </View>
  ), [itemWidth]);

  const renderEmpty = () => {
    if (loading) return null;
    return (
      <View className="py-16 items-center">
        <Text className="text-text-muted text-sm">{t('noListings')}</Text>
      </View>
    );
  };

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View className="py-4 items-center">
        <ActivityIndicator size="small" color="#0A7B8A" />
      </View>
    );
  };

  const renderHeader = () => (
    <View>
      {/* City filter */}
      <CitySelector selected={selectedCity} onSelect={setSelectedCity} />

      {/* Category tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="gap-2 px-4 py-2"
      >
        <TouchableOpacity
          className={`px-3 py-1.5 rounded-full border ${
            !selectedCategory ? 'bg-primary border-primary' : 'border-border'
          }`}
          onPress={() => setSelectedCategory(null)}
        >
          <Text className={`text-xs font-medium ${
            !selectedCategory ? 'text-white' : 'text-text-secondary'
          }`}>
            {t('all')}
          </Text>
        </TouchableOpacity>
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

      {/* Sort + count */}
      <View className="px-4 py-2 flex-row items-center justify-between" style={{ zIndex: 100 }}>
        <Text className="text-text-muted text-xs">
          {total} {t('listings').toLowerCase()}
        </Text>

        <View className="relative">
          <TouchableOpacity
            className="flex-row items-center gap-1 px-3 py-1.5 rounded-full border border-border"
            onPress={() => setShowSort(!showSort)}
          >
            <Text className="text-text-secondary text-xs font-medium">
              {t(SORT_OPTIONS.find(s => s.key === sortBy)?.label || 'sortDate')}
            </Text>
            <Text className="text-text-muted text-xs">{showSort ? '\u25B2' : '\u25BC'}</Text>
          </TouchableOpacity>

          {showSort && (
            <View className="absolute top-9 right-0 bg-surface-card border border-border rounded-lg min-w-[140px]" style={{ zIndex: 999, elevation: 10 }}>
              {SORT_OPTIONS.map((opt) => (
                <TouchableOpacity
                  key={opt.key}
                  className={`px-3 py-2.5 ${sortBy === opt.key ? 'bg-primary/20' : ''}`}
                  onPress={() => {
                    setSortBy(opt.key);
                    setShowSort(false);
                  }}
                >
                  <Text className={`text-xs ${sortBy === opt.key ? 'text-primary font-semibold' : 'text-text-secondary'}`}>
                    {t(opt.label)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-dark">
      <Header title={t('listings')} />

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#0A7B8A" />
          <Text className="text-text-muted mt-2 text-sm">{t('loading')}</Text>
        </View>
      ) : (
        <FlatList
          data={listings}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          numColumns={2}
          columnWrapperClassName="px-4 justify-between"
          ListHeaderComponent={renderHeader}
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
