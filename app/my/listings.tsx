import { View, Text, TouchableOpacity, FlatList, ActivityIndicator, Alert, Image } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'expo-router';
import { Header } from '../../components/layout/Header';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { PriceTag } from '../../components/ui/PriceTag';
import { useAuthStore } from '../../stores/authStore';
import { api } from '../../lib/api';
import { colors } from '../../lib/colors';

type StatusTab = 'active' | 'pending_moderation' | 'draft' | 'sold' | 'removed';

interface MyListing {
  id: string;
  title: string;
  price: number | null;
  currency: string;
  status: string;
  views: number;
  createdAt: string;
  expiresAt: string | null;
  city?: { id: string; nameRu: string; nameEn: string; nameKa: string };
  category?: { id: string; name: string };
  photos?: { id: string; url: string; order: number }[];
}

interface MyListingsResponse {
  listings: MyListing[];
  total: number;
  page: number;
  limit: number;
}

const STATUS_BADGE_VARIANT: Record<string, 'success' | 'warning' | 'error' | 'default'> = {
  active: 'success',
  pending_moderation: 'warning',
  draft: 'default',
  sold: 'warning',
  removed: 'error',
  rejected: 'error',
};

export default function MyListingsScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);

  const [tab, setTab] = useState<StatusTab>('active');
  const [listings, setListings] = useState<MyListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      router.replace('/(auth)');
    }
  }, [user]);

  const fetchListings = useCallback(async (p: number, reset: boolean) => {
    if (reset) setLoading(true);
    else setLoadingMore(true);

    const res = await api.get<MyListingsResponse>(`/listings/my?status=${tab}&page=${p}&limit=20`);
    if (res.ok && res.data) {
      if (reset) {
        setListings(res.data.listings);
      } else {
        setListings((prev) => [...prev, ...res.data!.listings]);
      }
      setTotal(res.data.total);
    }

    setLoading(false);
    setLoadingMore(false);
  }, [tab]);

  useEffect(() => {
    setPage(1);
    fetchListings(1, true);
  }, [tab]); // eslint-disable-line react-hooks/exhaustive-deps

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setPage(1);
    await fetchListings(1, true);
    setRefreshing(false);
  }, [fetchListings]);

  const handleLoadMore = () => {
    if (loadingMore || listings.length >= total) return;
    const nextPage = page + 1;
    setPage(nextPage);
    fetchListings(nextPage, false);
  };

  const handleDeactivate = (id: string) => {
    Alert.alert(t('confirmDeactivate'), '', [
      { text: t('cancel'), style: 'cancel' },
      {
        text: t('deactivate'),
        style: 'destructive',
        onPress: async () => {
          const res = await api.patch(`/listings/${id}/status`, { status: 'removed' });
          if (res.ok) {
            setListings((prev) => prev.filter((l) => l.id !== id));
            setTotal((prev) => prev - 1);
          }
        },
      },
    ]);
  };

  const handleRenew = async (id: string) => {
    const res = await api.post(`/listings/${id}/renew`);
    if (res.ok) {
      fetchListings(1, true);
    }
  };

  const handleDelete = (id: string) => {
    Alert.alert(t('confirmDelete'), t('confirmDeleteText'), [
      { text: t('cancel'), style: 'cancel' },
      {
        text: t('deactivate'),
        style: 'destructive',
        onPress: async () => {
          const res = await api.patch(`/listings/${id}/status`, { status: 'removed' });
          if (res.ok) {
            setListings((prev) => prev.filter((l) => l.id !== id));
            setTotal((prev) => prev - 1);
          }
        },
      },
    ]);
  };

  const handlePublishDraft = async (id: string) => {
    const res = await api.patch(`/listings/${id}/status`, { status: 'pending_moderation' });
    if (res.ok) {
      setTab('pending_moderation');
      fetchListings(1, true);
    } else {
      Alert.alert(t('error'), (res as any).error || t('error'));
    }
  };

  const handleWithdrawFromModeration = async (id: string) => {
    const res = await api.patch(`/listings/${id}/status`, { status: 'draft' });
    if (res.ok) {
      setTab('draft');
      fetchListings(1, true);
    } else {
      Alert.alert(t('error'), (res as any).error || t('error'));
    }
  };

  const handleDeleteDraft = (id: string) => {
    Alert.alert(t('confirmDelete'), '', [
      { text: t('cancel'), style: 'cancel' },
      {
        text: t('delete'),
        style: 'destructive',
        onPress: async () => {
          const res = await api.patch(`/listings/${id}/status`, { status: 'removed' });
          if (res.ok) {
            setListings((prev) => prev.filter((l) => l.id !== id));
            setTotal((prev) => prev - 1);
          }
        },
      },
    ]);
  };

  const tabs: { key: StatusTab; label: string }[] = [
    { key: 'active', label: t('active') },
    { key: 'pending_moderation', label: t('pendingModeration') },
    { key: 'draft', label: t('drafts') },
    { key: 'sold', label: t('sold') },
    { key: 'removed', label: t('removed') },
  ];

  const renderItem = ({ item }: { item: MyListing }) => (
    <View className="bg-surface-card border border-border rounded-lg overflow-hidden mb-3 mx-4">
      <View className="flex-row">
        {/* Thumbnail */}
        {item.photos?.[0]?.url ? (
          <Image
            source={{ uri: item.photos[0].url }}
            className="w-24 h-24"
            resizeMode="cover"
          />
        ) : (
          <View className="w-24 h-24 bg-surface items-center justify-center">
            <Text className="text-text-muted text-xs">{t('photos')}</Text>
          </View>
        )}

        {/* Info */}
        <View className="flex-1 p-3 gap-1">
          <Text className="text-text-primary text-sm font-semibold" numberOfLines={2}>
            {item.title}
          </Text>
          <PriceTag price={item.price} currency={item.currency} size="sm" />
          <View className="flex-row items-center gap-2 mt-1">
            <Badge
              label={item.status === 'pending_moderation' ? t('statusPendingModeration') : item.status}
              variant={STATUS_BADGE_VARIANT[item.status] || 'default'}
            />
            <Text className="text-text-muted text-xs">
              {item.views} {t('views')}
            </Text>
          </View>
        </View>
      </View>

      {/* Actions */}
      <View className="flex-row border-t border-border">
        {item.status === 'draft' ? (
          <>
            <TouchableOpacity
              className="flex-1 py-2.5 items-center border-r border-border"
              onPress={() => router.push(`/listings/${item.id}/edit`)}
            >
              <Text className="text-primary text-xs font-medium">{t('continueDraft')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-1 py-2.5 items-center border-r border-border"
              onPress={() => handlePublishDraft(item.id)}
            >
              <Text className="text-success text-xs font-medium">{t('publish')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-1 py-2.5 items-center"
              onPress={() => handleDeleteDraft(item.id)}
            >
              <Text className="text-error text-xs font-medium">{t('delete')}</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity
              className="flex-1 py-2.5 items-center border-r border-border"
              onPress={() => router.push(`/listings/${item.id}/edit`)}
            >
              <Text className="text-primary text-xs font-medium">{t('edit')}</Text>
            </TouchableOpacity>

            {item.status === 'active' && (
              <TouchableOpacity
                className="flex-1 py-2.5 items-center border-r border-border"
                onPress={() => handleDeactivate(item.id)}
              >
                <Text className="text-warning text-xs font-medium">{t('deactivate')}</Text>
              </TouchableOpacity>
            )}

            {item.status === 'active' && (
              <TouchableOpacity
                className="flex-1 py-2.5 items-center border-r border-border"
                onPress={() => handleRenew(item.id)}
              >
                <Text className="text-success text-xs font-medium">{t('renew')}</Text>
              </TouchableOpacity>
            )}

            {item.status === 'active' && (
              <TouchableOpacity
                className="flex-1 py-2.5 items-center border-r border-border"
                onPress={() => router.push(`/dashboard/listings/${item.id}/promote`)}
              >
                <Text className="text-secondary text-xs font-medium">{t('promote')}</Text>
              </TouchableOpacity>
            )}

            {item.status === 'pending_moderation' && (
              <TouchableOpacity
                className="flex-1 py-2.5 items-center border-r border-border"
                onPress={() => handleWithdrawFromModeration(item.id)}
              >
                <Text className="text-warning text-xs font-medium">{t('draft')}</Text>
              </TouchableOpacity>
            )}

            {item.status !== 'active' && (
              <TouchableOpacity
                className="flex-1 py-2.5 items-center"
                onPress={() => handleDelete(item.id)}
              >
                <Text className="text-error text-xs font-medium">{t('delete')}</Text>
              </TouchableOpacity>
            )}
          </>
        )}
      </View>
    </View>
  );

  const renderEmpty = () => {
    if (loading) return null;
    return (
      <View className="py-16 items-center">
        <Text className="text-text-muted text-sm mb-4">{t('noMyListings')}</Text>
        <Button
          title={t('createListing')}
          onPress={() => router.push('/listings/create')}
        />
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

  return (
    <View className="flex-1 bg-dark">
      <Header title={t('myListings')} />

      {/* Tabs */}
      <View className="flex-row border-b border-border">
        {tabs.map((tabItem) => (
          <TouchableOpacity
            key={tabItem.key}
            className={`flex-1 py-3 items-center ${
              tab === tabItem.key ? 'border-b-2 border-primary' : ''
            }`}
            onPress={() => setTab(tabItem.key)}
          >
            <Text
              className={`text-sm font-medium ${
                tab === tabItem.key ? 'text-primary' : 'text-text-secondary'
              }`}
            >
              {tabItem.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

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
          ListEmptyComponent={renderEmpty}
          ListFooterComponent={renderFooter}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.3}
          contentContainerClassName="py-3"
        />
      )}

      {/* FAB Create button */}
      <TouchableOpacity
        className="absolute bottom-6 right-6 w-14 h-14 bg-primary rounded-full items-center justify-center"
        style={{ elevation: 5, shadowColor: colors.brandPrimary, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 4 }}
        onPress={() => router.push('/listings/create')}
      >
        <Text className="text-white text-2xl font-light">+</Text>
      </TouchableOpacity>
    </View>
  );
}
