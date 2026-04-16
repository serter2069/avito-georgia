import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState, useEffect, useCallback } from 'react';
import { View, ActivityIndicator, Pressable, Text } from 'react-native';
import ListingDetail from '../../../components/screens/ListingDetail';
import { ErrorState } from '../../../components/ErrorState';
import { apiFetch } from '../../../lib/api';
import { useAuthStore } from '../../../store/auth';

export default function ListingDetailPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [listing, setListing] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<'not_found' | 'other' | null>(null);
  const { user } = useAuthStore();

  const load = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const r = await apiFetch(`/listings/${id}`);
      setListing(r.listing ?? r);
    } catch (err: any) {
      if (err?.statusCode === 404 || err?.status === 404) {
        setError('not_found');
      } else {
        setError('other');
      }
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { load(); }, [load]);

  if (loading) return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <ActivityIndicator size="large" color="#00AA6C" />
    </View>
  );

  if (error === 'not_found') return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32, gap: 16 }}>
      <Text style={{ fontSize: 18, fontWeight: '700', color: '#1A1A1A', textAlign: 'center' }}>Объявление не найдено</Text>
      <Text style={{ fontSize: 14, color: '#9E9E9E', textAlign: 'center' }}>Возможно, оно было удалено или перемещено</Text>
      <Pressable
        onPress={() => router.back()}
        style={{ backgroundColor: '#00AA6C', borderRadius: 10, paddingHorizontal: 24, paddingVertical: 12 }}
      >
        <Text style={{ color: '#fff', fontWeight: '700', fontSize: 15 }}>Назад</Text>
      </Pressable>
    </View>
  );

  if (error === 'other') return <ErrorState message="Не удалось загрузить объявление" onRetry={load} />;

  const isOwner = !!user && listing?.userId === user.id;
  return <ListingDetail listing={listing} isOwner={isOwner} />;
}
