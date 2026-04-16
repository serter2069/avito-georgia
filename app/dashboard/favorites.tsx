import { useState, useEffect } from 'react';
import Favorites from '../../components/screens/Favorites';
import { apiFetch } from '../../lib/api';

export default function FavoritesPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch('/favorites')
      .then(r => setItems(r.favorites || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleRemove = async (listingId: string) => {
    await apiFetch(`/favorites/${listingId}`, { method: 'DELETE' });
    setItems(prev => prev.filter(f => f.listing.id !== listingId));
  };

  return <Favorites showHeader={false} showBottomNav={false} items={items} loading={loading} onRemove={handleRemove} />;
}
