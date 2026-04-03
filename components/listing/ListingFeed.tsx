import { View, Text, TouchableOpacity, FlatList, ActivityIndicator, ScrollView, useWindowDimensions } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { CitySelector, City } from '../common/CitySelector';
import { ListingCard, Listing } from './ListingCard';
import { CategoryType } from '../common/CategoryIcon';
import { CategoryFilters, CustomField, FilterValues } from '../filters/CategoryFilters';
import { api } from '../../lib/api';
import { colors } from '../../lib/colors';
import { useResponsive } from '../../hooks/useResponsive';

// All available categories
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

interface ApiCategory {
  id: string;
  name: string;
  slug: string;
  customFields: CustomField[] | null;
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
    isPromoted: l.isPromoted ?? false,
    isHighlighted: l.isHighlighted ?? false,
  };
}

export interface ListingFeedProps {
  initialCategory?: string;
  showFilters?: boolean;
  compact?: boolean;
}

export function ListingFeed({
  initialCategory,
  showFilters: showFiltersProp = true,
  compact = false,
}: ListingFeedProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { isMobile, isTablet, isDesktop, sidebarWidth, maxWidth } = useResponsive();

  // Responsive item width calculation
  const padding = 32; // px-4 * 2
  const gap = 12;
  const availableWidth = Math.min(width, maxWidth) - padding - (isDesktop && !compact ? sidebarWidth + 16 : 0);
  const cols = isDesktop ? 3 : 2;
  const itemWidth = (availableWidth - gap * (cols - 1)) / cols;

  // Limit for compact mode (homepage)
  const compactLimit = 10;

  const [selectedCity, setSelectedCity] = useState<City>('all');
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | null>(
    (initialCategory as CategoryType) || null
  );
  const [sortBy, setSortBy] = useState<SortOption>('createdAt_desc');
  const [showSort, setShowSort] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Category-specific filters from API
  const [customFields, setCustomFields] = useState<CustomField[]>([]);
  const [customFilterValues, setCustomFilterValues] = useState<FilterValues>({});

  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  // Fetch customFields when category changes
  useEffect(() => {
    if (compact) return; // No custom filters in compact mode
    const slug = selectedCategory ? CATEGORY_SLUG[selectedCategory] : undefined;
    if (!slug) {
      setCustomFields([]);
      setCustomFilterValues({});
      return;
    }
    api.get<ApiCategory[]>('/categories').then((res) => {
      if (res.ok && res.data) {
        const cat = res.data.find((c) => c.slug === slug);
        setCustomFields(cat?.customFields || []);
        setCustomFilterValues({});
      }
    });
  }, [selectedCategory, compact]);

  const fetchListings = useCallback(async (p: number, reset: boolean) => {
    const parts: string[] = [];
    if (selectedCategory) parts.push(`category=${CATEGORY_SLUG[selectedCategory]}`);
    if (selectedCity !== 'all') parts.push(`city=${selectedCity}`);
    parts.push(`sort=${sortBy}`);
    if (compact) {
      parts.push(`limit=${compactLimit}`);
    } else {
      parts.push(`page=${p}`);
    }
    if (!compact) {
      Object.entries(customFilterValues).forEach(([key, val]) => {
        if (val) parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(val)}`);
      });
    }
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
  }, [selectedCategory, selectedCity, sortBy, customFilterValues, compact]);

  // Reset and fetch when filters change
  useEffect(() => {
    setPage(1);
    fetchListings(1, true);
  }, [selectedCategory, selectedCity, sortBy, customFilterValues]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleLoadMore = () => {
    if (compact || loadingMore || listings.length >= total) return;
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
  ), [itemWidth]); // eslint-disable-line react-hooks/exhaustive-deps

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
        <ActivityIndicator size="small" color={colors.brandPrimary} />
      </View>
    );
  };

  // Category pills (mobile/tablet)
  const renderCategoryPills = () => (
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
  );

  // Desktop sidebar filters
  const renderDesktopSidebar = () => (
    <View style={{ width: sidebarWidth, paddingRight: 16 }}>
      <Text className="text-text-primary text-base font-bold mb-3">{t('category')}</Text>
      <View className="gap-1 mb-4">
        <TouchableOpacity
          className={`px-3 py-2 rounded-lg ${!selectedCategory ? 'bg-primary' : ''}`}
          onPress={() => setSelectedCategory(null)}
        >
          <Text className={`text-sm font-medium ${!selectedCategory ? 'text-white' : 'text-text-secondary'}`}>
            {t('all')}
          </Text>
        </TouchableOpacity>
        {CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat}
            className={`px-3 py-2 rounded-lg ${selectedCategory === cat ? 'bg-primary' : ''}`}
            onPress={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
          >
            <Text className={`text-sm font-medium ${selectedCategory === cat ? 'text-white' : 'text-text-secondary'}`}>
              {t(cat)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* City filter */}
      <Text className="text-text-primary text-base font-bold mb-2">{t('allCities')}</Text>
      <CitySelector selected={selectedCity} onSelect={setSelectedCity} />

      {/* Category-specific filters */}
      {customFields.length > 0 && (
        <View className="mt-4">
          <CategoryFilters
            customFields={customFields}
            values={customFilterValues}
            onChange={setCustomFilterValues}
          />
        </View>
      )}
    </View>
  );

  // FlatList header with inline filters for mobile/tablet
  const renderHeader = () => (
    <View>
      {/* Mobile/Tablet: inline filters */}
      {!isDesktop && showFiltersProp && (
        <>
          {!compact && (
            <CitySelector selected={selectedCity} onSelect={setSelectedCity} />
          )}

          {renderCategoryPills()}

          {/* Category-specific filters behind Filters button */}
          {!compact && customFields.length > 0 && (
            <View className="px-4 pb-2">
              <TouchableOpacity
                className="flex-row items-center gap-1 px-3 py-1.5 rounded-full border border-border self-start"
                onPress={() => setShowMobileFilters(!showMobileFilters)}
              >
                <Ionicons name="options-outline" size={14} color={colors.textSecondary} />
                <Text className="text-text-secondary text-xs font-medium">{t('filters')}</Text>
                <Ionicons name={showMobileFilters ? 'chevron-up' : 'chevron-down'} size={12} color={colors.textMuted} />
              </TouchableOpacity>
            </View>
          )}
          {showMobileFilters && customFields.length > 0 && (
            <CategoryFilters
              customFields={customFields}
              values={customFilterValues}
              onChange={setCustomFilterValues}
            />
          )}
        </>
      )}

      {/* Sort + count (not in compact mode) */}
      {!compact && (
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
              <Ionicons name={showSort ? 'arrow-up' : 'arrow-down'} size={12} color={colors.textMuted} />
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
      )}
    </View>
  );

  // Compact mode: simple grid wrapped in a View (no FlatList for homepage embedding)
  if (compact) {
    const compactCols = isDesktop ? 3 : isTablet ? 2 : 1;
    const rows: Listing[][] = [];
    for (let i = 0; i < listings.length; i += compactCols) {
      rows.push(listings.slice(i, i + compactCols));
    }

    return (
      <View>
        {/* Category pills in compact mode */}
        {showFiltersProp && renderCategoryPills()}

        {loading ? (
          <View className="py-12 items-center">
            <ActivityIndicator size="large" color={colors.brandPrimary} />
            <Text className="text-text-muted mt-2 text-sm">{t('loading')}</Text>
          </View>
        ) : listings.length === 0 ? (
          <View className="py-12 items-center">
            <Text className="text-text-muted text-sm">{t('noListings')}</Text>
          </View>
        ) : (
          <View className="gap-3 px-4">
            {rows.map((row, rowIdx) => (
              <View key={rowIdx} style={{ flexDirection: 'row', gap: 12 }}>
                {row.map((listing) => (
                  <View key={listing.id} style={{ flex: 1 }}>
                    <ListingCard listing={listing} onPress={handleListingPress} />
                  </View>
                ))}
                {row.length < compactCols && Array.from({ length: compactCols - row.length }).map((_, i) => (
                  <View key={`empty-${i}`} style={{ flex: 1 }} />
                ))}
              </View>
            ))}
          </View>
        )}
      </View>
    );
  }

  // Full mode with FlatList and pagination
  const listContent = (
    <>
      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={colors.brandPrimary} />
          <Text className="text-text-muted mt-2 text-sm">{t('loading')}</Text>
        </View>
      ) : (
        <FlatList
          data={listings}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          numColumns={cols}
          key={`cols-${cols}`}
          columnWrapperClassName="px-4 justify-between"
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={renderEmpty}
          ListFooterComponent={renderFooter}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.3}
          contentContainerClassName="pb-4"
        />
      )}
    </>
  );

  // Desktop: sidebar + content
  if (isDesktop) {
    return (
      <View style={{ flexDirection: 'row', flex: 1, paddingLeft: 16, paddingTop: 12 }}>
        {renderDesktopSidebar()}
        <View style={{ flex: 1 }}>
          {listContent}
        </View>
      </View>
    );
  }

  // Mobile/Tablet: just the list
  return listContent;
}
