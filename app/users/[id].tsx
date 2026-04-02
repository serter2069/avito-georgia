import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, useWindowDimensions } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useState, useEffect, useCallback } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ListingCard, Listing } from '../../components/listing/ListingCard';
import { api } from '../../lib/api';
import { colors } from '../../lib/colors';

interface SellerProfile {
  id: string;
  name: string;
  avatarUrl: string | null;
  createdAt: string;
  activeListings: number;
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

interface ListingsResponse {
  listings: ApiListing[];
  total: number;
  page: number;
  limit: number;
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

export default function SellerProfileScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { width } = useWindowDimensions();

  const containerWidth = Math.min(width, 430);
  const itemWidth = (containerWidth - 32 - 12) / 2;

  const [seller, setSeller] = useState<SellerProfile | null>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Fetch seller profile
  useEffect(() => {
    if (!id) return;
    let cancelled = false;

    (async () => {
      setLoading(true);
      setError(null);
      const [profileRes, listingsRes] = await Promise.all([
        api.get<SellerProfile>(`/users/${id}`),
        api.get<ListingsResponse>(`/listings?userId=${id}&sort=createdAt_desc&page=1`),
      ]);

      if (cancelled) return;

      if (profileRes.ok && profileRes.data) {
        setSeller(profileRes.data);
      } else {
        setError(profileRes.error || 'User not found');
      }

      if (listingsRes.ok && listingsRes.data) {
        setListings(listingsRes.data.listings.map(mapListing));
        setTotal(listingsRes.data.total);
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
      setListings(prev => [...prev, ...res.data!.listings.map(mapListing)]);
      setPage(nextPage);
    }
    setLoadingMore(false);
  }, [loadingMore, listings.length, total, id, page]);

  const handleListingPress = useCallback((listingId: string) => {
    router.push(`/listings/${listingId}`);
  }, [router]);

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
        </View>

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
        <View className="bg-dark-secondary border-b border-border px-4 py-3 flex-row items-center gap-3">
          <TouchableOpacity onPress={() => router.back()}>
            <Text className="text-primary text-base font-semibold">{t('back')}</Text>
          </TouchableOpacity>
          <Text className="text-text-primary text-lg font-bold">{t('sellerProfile')}</Text>
        </View>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={colors.brandPrimary} />
        </View>
      </View>
    );
  }

  if (error || !seller) {
    return (
      <View className="flex-1 bg-dark">
        <View className="bg-dark-secondary border-b border-border px-4 py-3 flex-row items-center gap-3">
          <TouchableOpacity onPress={() => router.back()}>
            <Text className="text-primary text-base font-semibold">{t('back')}</Text>
          </TouchableOpacity>
          <Text className="text-text-primary text-lg font-bold">{t('error')}</Text>
        </View>
        <View className="flex-1 items-center justify-center px-4">
          <Text className="text-text-muted text-base">{error || 'User not found'}</Text>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-dark">
      {/* Header */}
      <View className="bg-dark-secondary border-b border-border px-4 py-3 flex-row items-center gap-3">
        <TouchableOpacity onPress={() => router.back()}>
          <Text className="text-primary text-base font-semibold">{t('back')}</Text>
        </TouchableOpacity>
        <Text className="text-text-primary text-lg font-bold flex-1" numberOfLines={1}>
          {seller.name}
        </Text>
      </View>

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
