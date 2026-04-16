import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'expo-router';
import Favorites from '../../components/screens/Favorites';
import { ErrorState } from '../../components/ErrorState';
import { EmptyState } from '../../components/EmptyState';
import { apiFetch } from '../../lib/api';

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

  if (error) return <ErrorState message="Не удалось загрузить избранное" onRetry={load} />;
  if (!loading && items.length === 0) return (
    <EmptyState
      icon="heart-outline"
      title="Нет избранного"
      subtitle="Нажмите ♡ на объявлении чтобы сохранить его здесь"
      ctaLabel="Смотреть объявления"
      onCta={() => router.push('/' as any)}
    />
  );
  return <Favorites showHeader={false} showBottomNav={false} items={items} loading={loading} onRemove={handleRemove} />;
}
