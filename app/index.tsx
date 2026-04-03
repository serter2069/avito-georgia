import { View, ScrollView, Text, TextInput, TouchableOpacity, ActivityIndicator, RefreshControl, Platform } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Header } from '../components/layout/Header';
import { CitySelector, City } from '../components/common/CitySelector';
import { CategoryIcon, CategoryType } from '../components/common/CategoryIcon';
import { ListingCard, Listing } from '../components/listing/ListingCard';
import { api } from '../lib/api';
import { colors } from '../lib/colors';
import { useResponsive } from '../hooks/useResponsive';

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

export default function HomeScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { isMobile, isDesktop, isTablet, listingColumns, sidebarWidth, maxWidth } = useResponsive();
  const [selectedCity, setSelectedCity] = useState<City>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchListings = useCallback(async () => {
    const cityParam = selectedCity !== 'all' ? `&city=${selectedCity}` : '';
    const res = await api.get<ListingsResponse>(`/listings?sort=createdAt_desc&limit=10${cityParam}`);
    if (res.ok && res.data) {
      setListings(res.data.listings.map(mapListing));
    }
  }, [selectedCity]);

  useEffect(() => {
    setLoading(true);
    fetchListings().finally(() => setLoading(false));
  }, [fetchListings]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchListings();
    setRefreshing(false);
  }, [fetchListings]);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleCategoryPress = (cat: CategoryType) => {
    router.push(`/listings?category=${cat}`);
  };

  const handleListingPress = (id: string) => {
    router.push(`/listings/${id}`);
  };

  // Desktop sidebar with categories
  const renderSidebar = () => (
    <View style={{ width: sidebarWidth, paddingRight: 16 }}>
      <Text className="text-text-primary text-base font-bold mb-3">{t('category')}</Text>
      <View className="gap-1">
        {CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat}
            className="flex-row items-center gap-3 px-3 py-2.5 rounded-lg"
            style={{ backgroundColor: '#f5f5f5' }}
            onPress={() => handleCategoryPress(cat)}
          >
            <CategoryIcon category={cat} size="sm" />
            <Text className="text-text-secondary text-sm">{t(cat)}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  // Listings grid that adapts to columns
  const renderListingsGrid = () => {
    if (loading) {
      return (
        <View className="py-12 items-center">
          <ActivityIndicator size="large" color={colors.brandPrimary} />
          <Text className="text-text-muted mt-2 text-sm">{t('loading')}</Text>
        </View>
      );
    }

    if (listings.length === 0) {
      return (
        <View className="py-12 items-center">
          <Text className="text-text-muted text-sm">{t('noListings')}</Text>
        </View>
      );
    }

    // Build rows from listings based on column count
    const cols = isDesktop ? 3 : isTablet ? 2 : 1;
    const rows: Listing[][] = [];
    for (let i = 0; i < listings.length; i += cols) {
      rows.push(listings.slice(i, i + cols));
    }

    return (
      <View className="gap-3">
        {rows.map((row, rowIdx) => (
          <View key={rowIdx} style={{ flexDirection: 'row', gap: 12 }}>
            {row.map((listing) => (
              <View key={listing.id} style={{ flex: 1 }}>
                <ListingCard listing={listing} onPress={handleListingPress} />
              </View>
            ))}
            {/* Fill empty slots to keep equal widths */}
            {row.length < cols && Array.from({ length: cols - row.length }).map((_, i) => (
              <View key={`empty-${i}`} style={{ flex: 1 }} />
            ))}
          </View>
        ))}
      </View>
    );
  };

  return (
    <View className="flex-1 bg-dark">
      <Header />

      <ScrollView
        className="flex-1"
        contentContainerClassName="pb-4"
        refreshControl={
          Platform.OS !== 'web' ? (
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.brandPrimary} />
          ) : undefined
        }
      >
        {/* Search bar */}
        <View className="px-4 pt-3 pb-1">
          <View className="flex-row bg-surface border border-border rounded-lg overflow-hidden">
            <TextInput
              className="flex-1 px-4 py-3 text-text-primary text-base"
              placeholder={t('searchPlaceholder')}
              placeholderTextColor={colors.textMuted}
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearch}
              returnKeyType="search"
            />
            <TouchableOpacity
              className="px-4 items-center justify-center bg-primary"
              onPress={handleSearch}
            >
              <Ionicons name="search" size={20} color="#ffffff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* City selector */}
        <CitySelector selected={selectedCity} onSelect={setSelectedCity} />

        {/* Mobile: horizontal categories */}
        {isMobile && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerClassName="gap-3 px-4 py-2"
          >
            {CATEGORIES.map((cat) => (
              <TouchableOpacity key={cat} onPress={() => handleCategoryPress(cat)}>
                <CategoryIcon category={cat} size="sm" />
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {/* Tablet: categories in 2-row grid */}
        {isTablet && (
          <View className="px-4 py-3">
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={{ width: '18%', minWidth: 60 }}
                  className="items-center"
                  onPress={() => handleCategoryPress(cat)}
                >
                  <CategoryIcon category={cat} size="md" />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Desktop: sidebar + content layout */}
        {isDesktop ? (
          <View className="px-4 mt-2" style={{ flexDirection: 'row' }}>
            {renderSidebar()}
            <View style={{ flex: 1 }}>
              <View className="flex-row items-center justify-between mb-3">
                <Text className="text-text-primary text-lg font-bold">{t('newListings')}</Text>
                <TouchableOpacity onPress={() => router.push('/listings')}>
                  <Text className="text-primary text-sm font-medium">{t('viewAll')}</Text>
                </TouchableOpacity>
              </View>
              {renderListingsGrid()}
            </View>
          </View>
        ) : (
          <View className="px-4 mt-2">
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-text-primary text-lg font-bold">{t('newListings')}</Text>
              <TouchableOpacity onPress={() => router.push('/listings')}>
                <Text className="text-primary text-sm font-medium">{t('viewAll')}</Text>
              </TouchableOpacity>
            </View>
            {renderListingsGrid()}
          </View>
        )}
      </ScrollView>

    </View>
  );
}
