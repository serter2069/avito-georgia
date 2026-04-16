import { useLocalSearchParams } from 'expo-router';
import { useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import ListingDetail from '../../../components/screens/ListingDetail';
import { apiFetch } from '../../../lib/api';
import { useAuthStore } from '../../../store/auth';

export default function ListingDetailPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [listing, setListing] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();

  useEffect(() => {
    if (!id) return;
    apiFetch(`/listings/${id}`)
      .then(r => setListing(r.listing ?? r))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <ActivityIndicator size="large" color="#00AA6C" />
    </View>
  );
  const isOwner = !!user && listing?.userId === user.id;
  return <ListingDetail listing={listing} isOwner={isOwner} />;
}
