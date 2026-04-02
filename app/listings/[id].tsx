import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Share, Platform } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useState, useEffect, useCallback } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Header } from '../../components/layout/Header';
import { PhotoGallery } from '../../components/listing/PhotoGallery';
import { PriceTag } from '../../components/ui/PriceTag';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { api } from '../../lib/api';
import { useAuthStore } from '../../stores/authStore';
import { colors } from '../../lib/colors';

interface ListingPhoto {
  id: string;
  url: string;
  order: number;
}

interface ListingDetail {
  id: string;
  title: string;
  description: string | null;
  price: number | null;
  currency: string;
  status: string;
  views: number;
  createdAt: string;
  city?: { id: string; nameRu: string; nameEn: string; nameKa: string };
  district?: { id: string; nameRu: string; nameEn: string; nameKa: string } | null;
  category?: { id: string; name: string };
  photos: ListingPhoto[];
  user: { id: string; name: string | null; phone: string | null; createdAt: string };
  isPromoted?: boolean;
}

const STATUS_VARIANTS: Record<string, 'success' | 'warning' | 'error'> = {
  active: 'success',
  sold: 'warning',
  removed: 'error',
};

const STATUS_LABELS: Record<string, string> = {
  active: 'statusActive',
  sold: 'statusSold',
  removed: 'statusRemoved',
};

export default function ListingDetailScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const user = useAuthStore((s) => s.user);

  const [listing, setListing] = useState<ListingDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [contactLoading, setContactLoading] = useState(false);

  // Fetch listing once on mount
  useEffect(() => {
    if (!id) return;
    let cancelled = false;

    (async () => {
      setLoading(true);
      setError(null);
      const res = await api.get<ListingDetail>(`/listings/${id}`);
      if (cancelled) return;
      if (res.ok && res.data) {
        setListing(res.data);
      } else {
        setError(res.error || 'Not found');
      }
      setLoading(false);
    })();

    return () => { cancelled = true; };
  }, [id]);

  // Check if favorited (only for logged-in users)
  useEffect(() => {
    if (!user || !id) return;
    let cancelled = false;

    (async () => {
      const res = await api.get<{ favorites: Array<{ listing: { id: string } }> }>('/favorites?page=1');
      if (cancelled) return;
      if (res.ok && res.data) {
        setIsFavorited(res.data.favorites.some(f => f.listing.id === id));
      }
    })();

    return () => { cancelled = true; };
  }, [user, id]);

  const handleFavorite = useCallback(async () => {
    if (!user) {
      router.push('/(auth)');
      return;
    }
    if (!id || favoriteLoading) return;

    setFavoriteLoading(true);
    if (isFavorited) {
      const res = await api.delete(`/favorites/${id}`);
      if (res.ok) setIsFavorited(false);
    } else {
      const res = await api.post(`/favorites/${id}`);
      if (res.ok) setIsFavorited(true);
    }
    setFavoriteLoading(false);
  }, [user, id, isFavorited, favoriteLoading, router]);

  const handleContactSeller = useCallback(async () => {
    if (!user) {
      router.push('/(auth)');
      return;
    }
    if (!listing?.user?.id || contactLoading) return;

    setContactLoading(true);
    const res = await api.post<{ threadId: string }>('/threads', { otherUserId: listing.user.id });
    setContactLoading(false);

    if (res.ok && res.data) {
      router.push(`/dashboard/messages/${res.data.threadId}`);
    }
  }, [user, listing, contactLoading, router]);

  const handleShare = useCallback(async () => {
    if (!listing) return;
    const url = `https://avito-georgia.smartlaunchhub.com/listings/${listing.id}`;
    if (Platform.OS === 'web') {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(url);
      }
    } else {
      await Share.share({ message: `${listing.title} - ${url}`, url });
    }
  }, [listing]);

  const handleSellerPress = useCallback(() => {
    if (listing?.user?.id) {
      router.push(`/users/${listing.user.id}`);
    }
  }, [listing, router]);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  if (loading) {
    return (
      <View className="flex-1 bg-dark">
        <Header title={t('loading')} />
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={colors.brandPrimary} />
        </View>
      </View>
    );
  }

  if (error || !listing) {
    return (
      <View className="flex-1 bg-dark">
        <Header title={t('error')} />
        <View className="flex-1 items-center justify-center px-4">
          <Text className="text-text-muted text-base mb-4">{error || 'Not found'}</Text>
          <Button title={t('back')} onPress={() => router.back()} variant="ghost" />
        </View>
      </View>
    );
  }

  const photoUrls = listing.photos.map(p => p.url);

  return (
    <View className="flex-1 bg-dark">
      {/* Header with back button */}
      <View className="bg-dark-secondary border-b border-border px-4 py-3 flex-row items-center gap-3">
        <TouchableOpacity onPress={() => router.back()}>
          <Text className="text-primary text-base font-semibold">{t('back')}</Text>
        </TouchableOpacity>
        <Text className="text-text-primary text-lg font-bold flex-1" numberOfLines={1}>
          {listing.title}
        </Text>
        <TouchableOpacity onPress={handleShare}>
          <Text className="text-text-secondary text-sm">{t('share')}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1" contentContainerClassName="pb-24">
        {/* Photo gallery */}
        <PhotoGallery photos={photoUrls} height={300} />

        {/* Status badge */}
        {listing.status !== 'active' && (
          <View className="px-4 pt-3">
            <Badge
              label={t(STATUS_LABELS[listing.status] || 'statusActive')}
              variant={STATUS_VARIANTS[listing.status] || 'success'}
            />
          </View>
        )}

        {/* Price section */}
        <View className="px-4 pt-4 pb-2">
          <PriceTag price={listing.price} currency={listing.currency} size="lg" />
        </View>

        {/* Title */}
        <View className="px-4 pb-2">
          <Text className="text-text-primary text-xl font-bold">{listing.title}</Text>
        </View>

        {/* Location + date + views */}
        <View className="px-4 pb-3 flex-row flex-wrap items-center gap-2">
          {listing.city && (
            <Text className="text-text-secondary text-sm">
              {listing.city.nameRu}
              {listing.district ? `, ${listing.district.nameRu}` : ''}
            </Text>
          )}
          <Text className="text-text-muted text-xs">
            {formatDate(listing.createdAt)}
          </Text>
          <Text className="text-text-muted text-xs">
            {listing.views} {t('views')}
          </Text>
        </View>

        {/* Category */}
        {listing.category && (
          <View className="px-4 pb-3">
            <Badge label={listing.category.name} />
          </View>
        )}

        {/* Description */}
        {listing.description && (
          <View className="px-4 pb-4">
            <Text className="text-text-secondary text-sm font-semibold mb-2">{t('description')}</Text>
            <Text className="text-text-primary text-base leading-6">{listing.description}</Text>
          </View>
        )}

        {/* Seller card */}
        <TouchableOpacity
          className="mx-4 mb-4 p-4 bg-surface-card rounded-lg border border-border"
          onPress={handleSellerPress}
          activeOpacity={0.7}
        >
          <Text className="text-text-muted text-xs mb-2">{t('seller')}</Text>
          <View className="flex-row items-center gap-3">
            {/* Avatar placeholder */}
            <View className="w-12 h-12 rounded-full bg-primary/30 items-center justify-center">
              <Text className="text-primary text-lg font-bold">
                {(listing.user.name || 'U').charAt(0).toUpperCase()}
              </Text>
            </View>
            <View className="flex-1">
              <Text className="text-text-primary text-base font-semibold">
                {listing.user.name || 'User'}
              </Text>
              <Text className="text-text-muted text-xs">
                {t('memberSince')} {formatDate(listing.user.createdAt)}
              </Text>
            </View>
            <Text className="text-text-muted text-lg">&rsaquo;</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>

      {/* Bottom action bar */}
      <View className="absolute bottom-0 left-0 right-0 bg-dark-secondary border-t border-border px-4 py-3 flex-row gap-3">
        {user && listing.user.id === user.id ? (
          // Owner view: promote button
          <View className="flex-1">
            <Button
              title={t('promote')}
              onPress={() => router.push(`/dashboard/listings/${listing.id}/promote`)}
              variant="secondary"
              size="md"
            />
          </View>
        ) : (
          // Non-owner view: favorite + contact
          <>
            <TouchableOpacity
              className={`px-4 py-3 rounded-lg border items-center justify-center ${
                isFavorited ? 'bg-secondary/20 border-secondary' : 'border-border'
              }`}
              onPress={handleFavorite}
              disabled={favoriteLoading}
            >
              {favoriteLoading ? (
                <ActivityIndicator size="small" color={colors.statusWarning} />
              ) : (
                <Text className={`text-sm font-semibold ${isFavorited ? 'text-secondary' : 'text-text-secondary'}`}>
                  {isFavorited ? t('removeFromFavorites') : t('addToFavorites')}
                </Text>
              )}
            </TouchableOpacity>

            <View className="flex-1">
              <Button
                title={contactLoading ? t('loading') : t('contactSeller')}
                onPress={handleContactSeller}
                size="md"
                disabled={contactLoading}
              />
            </View>
          </>
        )}
      </View>
    </View>
  );
}
