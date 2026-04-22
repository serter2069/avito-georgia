import { useState, useEffect, useCallback } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import SellerProfile from '../../../components/screens/SellerProfile';
import { ErrorState } from '../../../components/ErrorState';
import { SkeletonBox } from '../../../components/SkeletonBox';
import { apiFetch } from '../../../lib/api';

function SellerSkeleton() {
  return (
    <View style={{ flex: 1, backgroundColor: '#F5F5F5' }}>
      <View style={{ backgroundColor: '#fff', padding: 20, alignItems: 'center', gap: 12 }}>
        <SkeletonBox width={80} height={80} borderRadius={40} />
        <SkeletonBox width={160} height={18} />
        <SkeletonBox width={120} height={14} />
        <View style={{ flexDirection: 'row', gap: 24, marginTop: 8 }}>
          {[0, 1, 2].map(i => (
            <View key={i} style={{ alignItems: 'center', gap: 4 }}>
              <SkeletonBox width={40} height={16} />
              <SkeletonBox width={50} height={11} />
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

export default function SellerProfilePage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [seller, setSeller] = useState<any>(null);
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<'not_found' | 'other' | null>(null);

  const load = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const [userRes, listingsRes] = await Promise.all([
        apiFetch(`/users/${id}`),
        apiFetch(`/listings?userId=${id}&status=active&limit=20`),
      ]);
      setSeller(userRes.user);
      setListings(listingsRes.listings || []);
    } catch (err: unknown) {
      if ((err as { statusCode?: number })?.statusCode === 404 || (err as { status?: number })?.status === 404) {
        setError('not_found');
      } else {
        setError('other');
      }
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { load(); }, [load]);

  if (loading) return <SafeAreaView edges={['top']} style={{ flex: 1 }}><SellerSkeleton /></SafeAreaView>;

  if (error === 'not_found') return (
    <SafeAreaView edges={['top']} style={{ flex: 1 }}>
      <ErrorState message="Пользователь не найден" onRetry={() => router.back()} />
    </SafeAreaView>
  );

  if (error === 'other') return (
    <SafeAreaView edges={['top']} style={{ flex: 1 }}>
      <ErrorState message="Не удалось загрузить профиль" onRetry={load} />
    </SafeAreaView>
  );

  return <SafeAreaView edges={['top']} style={{ flex: 1 }}><SellerProfile seller={seller} listings={listings} /></SafeAreaView>;
}
