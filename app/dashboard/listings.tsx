import { useState, useEffect, useCallback } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import MyListings from '../../components/screens/MyListings';
import { ErrorState } from '../../components/ErrorState';
import { EmptyState } from '../../components/EmptyState';
import { apiFetch } from '../../lib/api';

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

  if (loading) return <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}><ActivityIndicator /></View>;
  if (error) return <ErrorState message="Не удалось загрузить объявления" onRetry={load} />;
  if (listings.length === 0) return (
    <EmptyState
      icon="list-outline"
      title="Нет объявлений"
      subtitle="Подайте первое объявление и начните продавать"
      ctaLabel="Подать объявление"
      onCta={() => router.push('/listings/create' as any)}
    />
  );
  return <MyListings showBottomNav={false} listings={listings} />;
}
