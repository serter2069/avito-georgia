import { View, Text, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'expo-router';
import { api } from '../../lib/api';
import { colors } from '../../lib/colors';
import { Ionicons } from '@expo/vector-icons';
import { ListingCard, Listing } from '../../components/listing/ListingCard';
import { Badge } from '../../components/ui/Badge';

interface FavoriteListing {
  id: string;
  title: string;
  price: number | null;
  currency: string;
  status: string;
  photos: { url: string }[];
  city?: { id: string; nameRu: string; nameEn: string; nameKa: string };
  category?: { id: string; name: string; slug: string };
}

interface FavoriteItem {
  id: string;
  listingId: string;
  listing: FavoriteListing;
  createdAt: string;
}

interface FavoritesResponse {
  favorites: FavoriteItem[];
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

function getCityName(city: FavoriteListing['city'], lang: string): string | undefined {
  if (!city) return undefined;
  if (lang === 'en') return city.nameEn || city.nameRu;
  if (lang === 'ka') return city.nameKa || city.nameRu;
  return city.nameRu;
}

function mapFavToListing(fav: FavoriteItem, lang: string, t: (key: string) => string): Listing {
  const i18nKey = fav.listing.category?.slug ? SLUG_TO_I18N_KEY[fav.listing.category.slug] : undefined;
  return {
    id: fav.listing.id,
    title: fav.listing.title,
    price: fav.listing.price,
    currency: fav.listing.currency,
    imageUrl: fav.listing.photos?.[0]?.url,
    city: getCityName(fav.listing.city, lang),
    category: i18nKey ? t(i18nKey) : (fav.listing.category?.name),
  };
}

export default function FavoritesScreen() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchFavorites = useCallback(async (p: number) => {
    const res = await api.get<FavoritesResponse>(`/favorites?page=${p}`);
    if (res.ok && res.data) {
      if (p === 1) {
        setFavorites(res.data.favorites);
      } else {
        setFavorites((prev) => [...prev, ...res.data!.favorites]);
      }
      setTotal(res.data.total);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchFavorites(1).finally(() => setLoading(false));
  }, [fetchFavorites]);

  const handleLoadMore = () => {
    if (loadingMore || favorites.length >= total) return;
    setLoadingMore(true);
    const nextPage = page + 1;
    setPage(nextPage);
    fetchFavorites(nextPage).finally(() => setLoadingMore(false));
  };

  const handleListingPress = (id: string) => {
    router.push(`/listings/${id}`);
  };

  const renderItem = ({ item }: { item: FavoriteItem }) => (
    <View className="px-4 mb-3">
      <ListingCard listing={mapFavToListing(item, i18n.language, t)} onPress={handleListingPress} />
    </View>
  );

  return (
    <View className="flex-1 bg-dark">
      {/* Header */}
      <View className="bg-dark-secondary border-b border-border px-4 py-3">
        <Text className="text-text-primary text-lg font-bold">{t('favorites')}</Text>
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={colors.brandPrimary} />
          <Text className="text-text-muted mt-2 text-sm">{t('loading')}</Text>
        </View>
      ) : favorites.length === 0 ? (
        <View className="flex-1 items-center justify-center px-4">
          <Ionicons name="heart-outline" size={48} color={colors.textMuted} style={{ marginBottom: 12 }} />
          <Text className="text-text-primary text-base font-semibold">{t('noFavorites')}</Text>
          <Text className="text-text-muted text-sm mt-1">{t('noFavoritesHint')}</Text>
        </View>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingTop: 12 }}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.3}
          ListFooterComponent={
            loadingMore ? (
              <View className="py-4 items-center">
                <ActivityIndicator size="small" color={colors.brandPrimary} />
              </View>
            ) : null
          }
        />
      )}
    </View>
  );
}
