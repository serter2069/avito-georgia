import { View, ScrollView, Text, TextInput, TouchableOpacity, ActivityIndicator, RefreshControl, Platform } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'expo-router';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { CitySelector, City } from '../components/common/CitySelector';
import { CategoryIcon, CategoryType } from '../components/common/CategoryIcon';
import { ListingCard, Listing } from '../components/listing/ListingCard';
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
              <Text className="text-white text-base">&#x1F50D;</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* City selector */}
        <CitySelector selected={selectedCity} onSelect={setSelectedCity} />

        {/* Categories */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerClassName="gap-4 px-4 py-3"
        >
          {CATEGORIES.map((cat) => (
            <TouchableOpacity key={cat} onPress={() => handleCategoryPress(cat)}>
              <CategoryIcon category={cat} size="md" />
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* New Listings section */}
        <View className="px-4 mt-2">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-text-primary text-lg font-bold">{t('newListings')}</Text>
            <TouchableOpacity onPress={() => router.push('/listings')}>
              <Text className="text-primary text-sm font-medium">{t('viewAll')}</Text>
            </TouchableOpacity>
          </View>

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
            <View className="gap-3">
              {listings.map((listing) => (
                <ListingCard
                  key={listing.id}
                  listing={listing}
                  onPress={handleListingPress}
                />
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      <Footer />
    </View>
  );
}
