import { View, ScrollView, Text, TextInput, TouchableOpacity, ActivityIndicator, Platform, useWindowDimensions } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Header } from '../components/layout/Header';
import { CategoryIcon, CategoryType } from '../components/common/CategoryIcon';
import { ListingCard, Listing } from '../components/listing/ListingCard';
import { useAuthStore } from '../stores/authStore';
import { api } from '../lib/api';
import { colors } from '../lib/colors';
import Head from 'expo-router/head';

// All categories in display order
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

// Map frontend CategoryType to DB slug (for URL params)
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

// Map DB category slug to i18n key (for mapListing)
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

interface ApiListing {
  id: string;
  title: string;
  price: number | null;
  currency: string;
  createdAt: string;
  city?: { id: string; nameRu: string; nameEn: string; nameKa: string };
  category?: { id: string; name: string; slug: string };
  photos?: { id: string; url: string; order: number }[];
  isPromoted?: boolean;
  isHighlighted?: boolean;
}

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
    category: i18nKey ? t(i18nKey) : l.category?.name,
    createdAt: l.createdAt,
    isPromoted: l.isPromoted ?? false,
    isHighlighted: l.isHighlighted ?? false,
  };
}

export default function HomeScreen() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { user, isReady } = useAuthStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [listings, setListings] = useState<Listing[]>([]);
  const [loadingListings, setLoadingListings] = useState(true);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleCategoryPress = (cat: CategoryType) => {
    router.push(`/listings?category=${CATEGORY_SLUG[cat]}`);
  };

  useEffect(() => {
    let cancelled = false;
    setLoadingListings(true);
    api
      .get<{ listings: ApiListing[] }>('/listings?limit=6&sort=createdAt_desc')
      .then((res) => {
        if (!cancelled && res.data) {
          setListings(res.data.listings.map((l) => mapListing(l, i18n.language, t)));
        }
      })
      .catch(() => {
        // Non-critical — show empty state silently
      })
      .finally(() => {
        if (!cancelled) setLoadingListings(false);
      });
    return () => {
      cancelled = true;
    };
  }, [i18n.language]); // re-map city names when language changes

  // Categories grid: 5 per row — use flexWrap on web, horizontal scroll on native
  const isWeb = Platform.OS === 'web';
  // 2-column listing grid
  const listingGridGap = 8;
  const listingCardWidth = (width - 32 - listingGridGap) / 2;

  return (
    <View className="flex-1 bg-dark">
      {Platform.OS === 'web' && (
        <Head>
          <title>Авито Грузия — объявления в Грузии</title>
          <meta name="description" content="Купить и продать в Грузии. Недвижимость, авто, электроника, работа и многое другое. Бесплатные объявления." />
          <meta property="og:title" content="Авито Грузия — объявления в Грузии" />
          <meta property="og:description" content="Купить и продать в Грузии. Недвижимость, авто, электроника, работа и многое другое. Бесплатные объявления." />
          <meta property="og:type" content="website" />
          <meta property="og:url" content="https://avito-georgia.smartlaunchhub.com/" />
        </Head>
      )}
      <Header />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 24 }}
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
              <Ionicons name="search" size={20} color={colors.white} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Categories grid */}
        <View className="mt-4 px-4">
          <Text className="text-text-primary text-base font-bold mb-3">{t('category')}</Text>
          {isWeb ? (
            // Web: flexWrap 2 rows × 5 columns
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  onPress={() => handleCategoryPress(cat)}
                  activeOpacity={0.7}
                  style={{ width: '18%', minWidth: 56, alignItems: 'center' }}
                >
                  <CategoryIcon category={cat} size="lg" showLabel />
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            // Native: horizontal scroll, 2 rows via chunked layout
            <View style={{ gap: 12 }}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={{ flexDirection: 'row', gap: 16 }}>
                  {CATEGORIES.slice(0, 5).map((cat) => (
                    <TouchableOpacity
                      key={cat}
                      onPress={() => handleCategoryPress(cat)}
                      activeOpacity={0.7}
                      style={{ alignItems: 'center' }}
                    >
                      <CategoryIcon category={cat} size="lg" showLabel />
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={{ flexDirection: 'row', gap: 16 }}>
                  {CATEGORIES.slice(5).map((cat) => (
                    <TouchableOpacity
                      key={cat}
                      onPress={() => handleCategoryPress(cat)}
                      activeOpacity={0.7}
                      style={{ alignItems: 'center' }}
                    >
                      <CategoryIcon category={cat} size="lg" showLabel />
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>
          )}
        </View>

        {/* Recent listings */}
        <View className="mt-5 px-4">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-text-primary text-base font-bold">{t('newListings')}</Text>
            <TouchableOpacity onPress={() => router.push('/listings')}>
              <Text className="text-primary text-sm font-medium">{t('viewAll')}</Text>
            </TouchableOpacity>
          </View>

          {loadingListings ? (
            <View style={{ alignItems: 'center', paddingVertical: 24 }}>
              <ActivityIndicator color={colors.brandPrimary} />
            </View>
          ) : listings.length === 0 ? (
            <Text className="text-text-secondary text-sm text-center py-4">{t('noListings')}</Text>
          ) : (
            // 2-column grid
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: listingGridGap }}>
              {listings.map((listing) => (
                <View key={listing.id} style={{ width: listingCardWidth }}>
                  <ListingCard
                    listing={listing}
                    onPress={(id) => router.push(`/listings/${id}`)}
                  />
                </View>
              ))}
            </View>
          )}
        </View>

        {/* CTA block — rendered only when auth state is hydrated */}
        {isReady && (
          <View className="mt-5 mx-4 rounded-xl bg-surface border border-border p-4">
            {user ? (
              // Authenticated CTA: post a listing
              <View style={{ gap: 8 }}>
                <Text className="text-text-primary text-base font-semibold">{t('postAd')}</Text>
                <Text className="text-text-secondary text-sm">{t('activeListings')}</Text>
                <TouchableOpacity
                  className="bg-primary rounded-lg py-3 items-center mt-1"
                  onPress={() => router.push('/create-listing')}
                  activeOpacity={0.8}
                >
                  <Text className="text-white font-semibold text-sm">{t('postAd')}</Text>
                </TouchableOpacity>
              </View>
            ) : (
              // Guest CTA: register
              <View style={{ gap: 8 }}>
                <Text className="text-text-primary text-base font-semibold">{t('authTitle')}</Text>
                <Text className="text-text-secondary text-sm">{t('authSubtitle')}</Text>
                <TouchableOpacity
                  className="bg-primary rounded-lg py-3 items-center mt-1"
                  onPress={() => router.push('/(auth)')}
                  activeOpacity={0.8}
                >
                  <Text className="text-white font-semibold text-sm">{t('login')}</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
