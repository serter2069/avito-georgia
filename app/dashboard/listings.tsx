import { useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import MyListings from '../../components/screens/MyListings';
import { apiFetch } from '../../lib/api';

export default function MyListingsPage() {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch('/listings/my')
      .then(r => setListings(r.listings || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}><ActivityIndicator /></View>;
  return <MyListings showBottomNav={false} listings={listings} />;
}
