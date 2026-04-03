import { Stack, usePathname, useRouter } from 'expo-router';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';

const NAV_ITEMS = [
  { label: 'Сообщения', path: '/dashboard/messages' },
  { label: 'Избранное', path: '/dashboard/favorites' },
  { label: 'Мои объявления', path: '/dashboard/listings' },
  { label: 'Настройки', path: '/dashboard/settings' },
];

function DashboardNav() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ flexDirection: 'row', gap: 8, padding: 16 }}
      style={{ backgroundColor: '#FFFFFF' }}
    >
      {NAV_ITEMS.map((item) => {
        const isActive = pathname.startsWith(item.path);
        return (
          <TouchableOpacity
            key={item.path}
            onPress={() => router.push(item.path as any)}
            style={{
              backgroundColor: isActive ? '#0A7B8A' : '#F2F8FA',
              borderRadius: 20,
              paddingHorizontal: 16,
              paddingVertical: 8,
            }}
          >
            <Text style={{ color: isActive ? '#FFFFFF' : '#0A2840', fontSize: 14, fontWeight: '500' }}>
              {item.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

export default function DashboardLayout() {
  return (
    <View style={{ flex: 1 }}>
      <DashboardNav />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#FFFFFF' } }} />
    </View>
  );
}
