import { useState, useEffect, useCallback } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import MyListings from '../../components/screens/MyListings';
import { ErrorState } from '../../components/ErrorState';
import { EmptyState } from '../../components/EmptyState';
import { SkeletonBox } from '../../components/SkeletonBox';
import { apiFetch } from '../../lib/api';

function ListingSkeleton() {
  return (
    <View style={{ flex: 1, backgroundColor: '#F7F7F7', padding: 16, gap: 12 }}>
      {[0, 1, 2].map(i => (
        <View key={i} style={{ flexDirection: 'row', gap: 12, backgroundColor: '#fff', borderRadius: 12, padding: 14 }}>
          <SkeletonBox width={72} height={72} borderRadius={8} />
          <View style={{ flex: 1, gap: 8, justifyContent: 'center' }}>
            <SkeletonBox width="80%" height={14} />
            <SkeletonBox width="50%" height={14} />
            <SkeletonBox width="40%" height={11} />
          </View>
        </View>
      ))}
    </View>
  );
}

export default function MyListingsPage() {
  const router = useRouter();
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const r = await apiFetch('/listings/my');
      setListings(r.listings || []);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  if (loading) return <SafeAreaView edges={['top']} style={{ flex: 1 }}><ListingSkeleton /></SafeAreaView>;
  if (error) return <SafeAreaView edges={['top']} style={{ flex: 1 }}><ErrorState message="Не удалось загрузить объявления" onRetry={load} /></SafeAreaView>;
  if (listings.length === 0) return (
    <SafeAreaView edges={['top']} style={{ flex: 1 }}>
    <EmptyState
      icon="list-outline"
      title="Нет объявлений"
      subtitle="Подайте первое объявление и начните продавать"
      ctaLabel="Подать объявление"
      onCta={() => router.push('/listings/create' as any)}
    />
    </SafeAreaView>
  );
  return <SafeAreaView edges={['top']} style={{ flex: 1 }}><MyListings showBottomNav={false} listings={listings} /></SafeAreaView>;
}
