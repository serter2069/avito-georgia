import { useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import SellerProfile from '../../../components/screens/SellerProfile';
import { apiFetch } from '../../../lib/api';

export default function SellerProfilePage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [seller, setSeller] = useState<any>(null);
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    Promise.all([
      apiFetch(`/users/${id}`),
      apiFetch(`/listings?userId=${id}&status=active&limit=20`),
    ])
      .then(([userRes, listingsRes]) => {
        setSeller(userRes.user);
        setListings(listingsRes.listings || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }

  return <SellerProfile seller={seller} listings={listings} />;
}
