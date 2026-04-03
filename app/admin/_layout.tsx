import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Slot, useRouter, usePathname } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../stores/authStore';
import { useEffect } from 'react';

const TABS = [
  { key: 'adminDashboard', path: '/admin' },
  { key: 'adminModeration', path: '/admin/moderation' },
  { key: 'adminUsers', path: '/admin/users' },
  { key: 'adminPayments', path: '/admin/payments' },
  { key: 'adminReports', path: '/admin/reports' },
] as const;

export default function AdminLayout() {
  const { t } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    if (user && user.role !== 'admin') {
      router.replace('/');
    }
  }, [user]);

  if (!user || user.role !== 'admin') {
    return (
      <View className="flex-1 bg-white items-center justify-center px-6">
        <Text className="text-error text-xl font-bold mb-2">{t('accessDenied')}</Text>
        <Text className="text-text-secondary text-sm text-center mb-6">{t('accessDeniedMessage')}</Text>
        <TouchableOpacity
          className="bg-primary px-6 py-3 rounded-lg"
          onPress={() => router.replace('/')}
        >
          <Text className="text-white font-semibold">{t('goHome')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      {/* Admin header */}
      <View className="bg-bg-section border-b border-border px-4 py-3 flex-row items-center justify-between">
        <TouchableOpacity onPress={() => router.push('/')}>
          <Text className="text-text-muted text-sm">&larr; {t('home')}</Text>
        </TouchableOpacity>
        <Text className="text-primary text-lg font-bold">{t('adminPanel')}</Text>
        <Text className="text-text-muted text-xs">{user.email}</Text>
      </View>

      {/* Tab navigation */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="bg-bg-section border-b border-border"
        contentContainerClassName="px-2"
      >
        {TABS.map((tab) => {
          const isActive = pathname === tab.path || (tab.path === '/admin' && pathname === '/admin');
          // For index route, exact match. For others, startsWith
          const active = tab.path === '/admin'
            ? pathname === '/admin'
            : pathname.startsWith(tab.path);

          return (
            <TouchableOpacity
              key={tab.key}
              className={`px-4 py-3 mr-1 border-b-2 ${active ? 'border-primary' : 'border-transparent'}`}
              onPress={() => router.push(tab.path as any)}
            >
              <Text className={`text-sm font-medium ${active ? 'text-primary' : 'text-text-secondary'}`}>
                {t(tab.key)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Page content */}
      <View className="flex-1">
        <Slot />
      </View>
    </View>
  );
}
