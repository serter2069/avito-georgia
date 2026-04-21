import { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../../store/auth';
import { apiFetch } from '../../lib/api';
import Profile from '../../components/screens/Profile';

export default function ProfilePage() {
  const { user, fetchMe } = useAuthStore();
  const [listings, setListings] = useState([]);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetchMe();
  }, []);

  useEffect(() => {
    if (!user) return;
    apiFetch('/listings/my').then((r) => setListings(r.listings ?? [])).catch(() => {});
    // No reviews endpoint yet — will show empty state
    setReviews([]);
  }, [user?.id]);

  const handleSave = async (data: { name: string; phone?: string; city?: string }) => {
    await apiFetch('/users/me', { method: 'PATCH', body: JSON.stringify(data) });
    await fetchMe();
  };

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1 }}>
    <Profile
      showBottomNav={false}
      realUser={user}
      listings={listings}
      reviews={reviews}
      onSave={handleSave}
    />
    </SafeAreaView>
  );
}
