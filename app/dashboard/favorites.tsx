import { useState, useEffect, useCallback } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Favorites from '../../components/screens/Favorites';
import { ErrorState } from '../../components/ErrorState';
import { EmptyState } from '../../components/EmptyState';
import { SkeletonBox } from '../../components/SkeletonBox';
import { apiFetch } from '../../lib/api';
import { colors } from '../../lib/theme';

function FavoritesSkeleton() {
  return (
    <View style={{ flex: 1, backgroundColor: colors.surface, padding: 16 }}>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
        {[0, 1, 2, 3].map(i => (
          <View key={i} style={{ width: '47%', borderRadius: 10, overflow: 'hidden', backgroundColor: colors.background }}>
            <SkeletonBox width="100%" height={120} borderRadius={0} />
            <View style={{ padding: 10, gap: 6 }}>
              <SkeletonBox width="90%" height={12} />
              <SkeletonBox width="60%" height={14} />
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

export default function FavoritesPage() {
  const router = useRouter();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const r = await apiFetch('/favorites');
      setItems(r.favorites || []);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleRemove = async (listingId: string) => {
    await apiFetch(`/favorites/${listingId}`, { method: 'DELETE' });
    setItems(prev => prev.filter(f => f.listing.id !== listingId));
  };

  if (loading) return <SafeAreaView edges={['top']} style={{ flex: 1 }}><FavoritesSkeleton /></SafeAreaView>;
  if (error) return <SafeAreaView edges={['top']} style={{ flex: 1 }}><ErrorState message="Не удалось загрузить избранное" onRetry={load} /></SafeAreaView>;
  if (items.length === 0) return (
    <SafeAreaView edges={['top']} style={{ flex: 1 }}>
    <EmptyState
      icon="heart-outline"
      title="Нет избранного"
      subtitle="Нажмите ♡ на объявлении чтобы сохранить его здесь"
      ctaLabel="Смотреть объявления"
      onCta={() => router.push('/' as any)}
    />
    </SafeAreaView>
  );
  return <SafeAreaView edges={['top']} style={{ flex: 1 }}><Favorites showHeader={false} showBottomNav={false} items={items} loading={loading} onRemove={handleRemove} /></SafeAreaView>;
}
