import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, useWindowDimensions } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useState, useEffect, useCallback } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ListingCard, Listing } from '../../components/listing/ListingCard';
import { Header } from '../../components/layout/Header';
import { api } from '../../lib/api';
import { useAuthStore } from '../../stores/authStore';
import { colors } from '../../lib/colors';

interface SellerProfile {
  id: string;
  name: string;
  avatarUrl: string | null;
  createdAt: string;
  activeListings: number;
  isPremium?: boolean;
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
  category?: { id: string; name: string; nameKa: string; nameRu: string; nameEn: string; slug: string };
  photos?: { id: string; url: string; order: number }[];
  isPromoted?: boolean;
  isHighlighted?: boolean;
}

interface ListingsResponse {
  listings: ApiListing[];
  total: number;
  page: number;
  limit: number;
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

export default function SellerProfileScreen() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { width } = useWindowDimensions();
  const user = useAuthStore((s) => s.user);

  const containerWidth = Math.min(width, 430);
  const itemWidth = (containerWidth - 32 - 12) / 2;

  const [seller, setSeller] = useState<SellerProfile | null>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [startingDialog, setStartingDialog] = useState(false);
  const [reviewStats, setReviewStats] = useState<{ averageRating: number | null; totalReviews: number } | null>(null);

  // Fetch seller profile
  useEffect(() => {
    if (!id) return;
    let cancelled = false;

    (async () => {
      setLoading(true);
      setError(null);
      const [profileRes, listingsRes, statsRes] = await Promise.all([
        api.get<SellerProfile>(`/users/${id}`),
        api.get<ListingsResponse>(`/listings?userId=${id}&sort=createdAt_desc&page=1`),
        api.get<{ averageRating: number | null; totalReviews: number }>(`/reviews/stats/${id}`),
      ]);

      if (cancelled) return;

      if (profileRes.ok && profileRes.data) {
        setSeller(profileRes.data);
      } else {
        setError(profileRes.error || 'User not found');
      }

      if (listingsRes.ok && listingsRes.data) {
        setListings(listingsRes.data.listings.map((l) => mapListing(l, i18n.language, t)));
        setTotal(listingsRes.data.total);
      }

      if (statsRes.ok && statsRes.data) {
        setReviewStats(statsRes.data);
      }

      setLoading(false);
    })();

    return () => { cancelled = true; };
  }, [id]);

  const handleLoadMore = useCallback(async () => {
    if (loadingMore || listings.length >= total || !id) return;
    const nextPage = page + 1;
    setLoadingMore(true);
    const res = await api.get<ListingsResponse>(`/listings?userId=${id}&sort=createdAt_desc&page=${nextPage}`);
    if (res.ok && res.data) {
      setListings(prev => [...prev, ...res.data!.listings.map((l) => mapListing(l, i18n.language, t))]);
      setPage(nextPage);
    }
    setLoadingMore(false);
  }, [loadingMore, listings.length, total, id, page]);

  const handleListingPress = useCallback((listingId: string) => {
    router.push(`/listings/${listingId}`);
  }, [router]);

  const handleStartDialog = useCallback(async (specialistId: string) => {
    if (!user) {
      router.push('/(auth)');
      return;
    }
    if (startingDialog) return;

    setStartingDialog(true);
    const res = await api.post<{ threadId: string }>('/threads', { otherUserId: specialistId });
    setStartingDialog(false);

    if (res.ok && res.data) {
      router.push(`/dashboard/messages/${res.data.threadId}`);
    }
  }, [user, startingDialog, router]);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' });
  };

  const renderItem = useCallback(({ item }: { item: Listing }) => (
    <View style={{ width: itemWidth, marginBottom: 12 }}>
      <ListingCard listing={item} onPress={handleListingPress} />
    </View>
  ), [itemWidth, handleListingPress]);

  const renderHeader = () => {
    if (!seller) return null;
    return (
      <View className="pb-4">
        {/* Seller info */}
        <View className="px-4 py-6 items-center">
          {/* Avatar */}
          <View className="w-20 h-20 rounded-full bg-primary/30 items-center justify-center mb-3">
            <Text className="text-primary text-3xl font-bold">
              {seller.name.charAt(0).toUpperCase()}
            </Text>
          </View>
          <Text className="text-text-primary text-xl font-bold mb-1">{seller.name}</Text>
          {seller.isPremium === true && (
            <View className="flex-row items-center bg-primary/10 rounded-full px-3 py-1 mb-1">
              <Text style={{ color: colors.brandPrimary, fontSize: 13, fontWeight: '600' }}>✓ {t('verifiedSeller')}</Text>
            </View>
          )}
          <Text className="text-text-muted text-sm">
            {t('memberSince')} {formatDate(seller.createdAt)}
          </Text>
        </View>

        {/* Stats */}
        <View className="mx-4 mb-4 p-4 bg-surface-card rounded-lg border border-border flex-row justify-around">
          <View className="items-center">
            <Text className="text-text-primary text-2xl font-bold">{seller.activeListings}</Text>
            <Text className="text-text-muted text-xs">{t('activeListings')}</Text>
          </View>
          {reviewStats && reviewStats.totalReviews > 0 && (
            <View className="items-center">
              <View className="flex-row items-center gap-1">
                <Text style={{ color: colors.statusWarning, fontSize: 18 }}>★</Text>
                <Text className="text-text-primary text-2xl font-bold">
                  {reviewStats.averageRating?.toFixed(1)}
                </Text>
              </View>
              <Text className="text-text-muted text-xs">
                {reviewStats.totalReviews} {t('reviews')}
              </Text>
            </View>
          )}
        </View>

        {/* Write message button — only shown to other users, not the seller themselves */}
        {user && user.id !== seller.id && (
          <TouchableOpacity
            className="mx-4 mb-4 py-3 bg-primary rounded-lg items-center justify-center"
            onPress={() => handleStartDialog(seller.id)}
            disabled={startingDialog}
            activeOpacity={0.8}
          >
            {startingDialog ? (
              <ActivityIndicator size="small" color={colors.white} />
            ) : (
              <Text className="text-white font-semibold text-base">{t('writeMessage')}</Text>
            )}
          </TouchableOpacity>
        )}

        {/* Active listings header */}
        <View className="px-4 pb-2">
          <Text className="text-text-primary text-lg font-bold">{t('activeListings')}</Text>
        </View>
      </View>
    );
  };

  const renderEmpty = () => {
    if (loading) return null;
    return (
      <View className="py-16 items-center">
        <Text className="text-text-muted text-sm">{t('noActiveListings')}</Text>
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

  if (loading) {
    return (
      <View className="flex-1 bg-dark">
        <Header showBack title={t('sellerProfile')} />
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={colors.brandPrimary} />
        </View>
      </View>
    );
  }

  if (error || !seller) {
    return (
      <View className="flex-1 bg-dark">
        <Header showBack title={t('error')} />
        <View className="flex-1 items-center justify-center px-4">
          <Text className="text-text-muted text-base">{error || 'User not found'}</Text>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-dark">
      <Header showBack title={seller.name} />

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
    </View>
  );
}
