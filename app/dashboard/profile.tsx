import { useEffect, useState } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../store/auth';
import { apiFetch } from '../../lib/api';
import Profile from '../../components/screens/Profile';

function QuickLinks({ isAdmin }: { isAdmin: boolean }) {
  const router = useRouter();
  const links: { label: string; icon: keyof typeof Ionicons.glyphMap; route: string; adminOnly?: boolean }[] = [
    { label: 'Избранное', icon: 'heart-outline', route: '/dashboard/favorites' },
    { label: 'Настройки', icon: 'settings-outline', route: '/dashboard/settings' },
    { label: 'История оплат', icon: 'receipt-outline', route: '/dashboard/payment-history' },
    { label: 'Карта', icon: 'map-outline', route: '/map' },
    { label: 'Админ-панель', icon: 'shield-outline', route: '/admin', adminOnly: true },
  ];

  return (
    <View style={{ paddingHorizontal: 12, gap: 6 }}>
      {links
        .filter(l => !l.adminOnly || isAdmin)
        .map(l => (
          <Pressable
            key={l.route}
            onPress={() => router.push(l.route as any)}
            accessibilityLabel={l.label}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 12,
              backgroundColor: '#FFFFFF',
              borderRadius: 12,
              paddingVertical: 14,
              paddingHorizontal: 16,
              borderWidth: 1,
              borderColor: '#E8E8E8',
            }}
          >
            <Ionicons name={l.icon} size={20} color="#00AA6C" />
            <Text style={{ flex: 1, fontSize: 15, color: '#1A1A1A' }}>{l.label}</Text>
            <Text style={{ fontSize: 18, color: '#9E9E9E' }}>{'\u203A'}</Text>
          </Pressable>
        ))}
    </View>
  );
}

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
      <ScrollView showsVerticalScrollIndicator={false}>
        <Profile
          showBottomNav={false}
          realUser={user}
          listings={listings}
          reviews={reviews}
          onSave={handleSave}
        />
        <QuickLinks isAdmin={user?.role === 'admin'} />
        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}
