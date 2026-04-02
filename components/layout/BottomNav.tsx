import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter, useSegments } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../stores/authStore';

export function BottomNav() {
  const router = useRouter();
  const segments = useSegments();
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);

  // Don't show on auth pages
  const inAuth = segments[0] === '(auth)';
  if (inAuth) return null;

  const isActive = (path: string) => {
    if (path === '/' && segments.length === 0) return true;
    if (path === '/listings' && segments[0] === 'listings' && segments.length === 1) return true;
    if (path === '/listings/create' && segments[0] === 'listings' && segments[1] === 'create') return true;
    if (path === '/dashboard/profile' && segments[0] === 'dashboard') return true;
    return false;
  };

  const tabs = [
    { label: t('home', 'Home'), icon: '\u2302', size: 20, path: '/' },
    { label: t('listings', 'Listings'), icon: '\u25A6', size: 18, path: '/listings' },
    { label: t('create', 'Create'), icon: '+', size: 26, path: '/listings/create' },
    { label: user ? t('profile', 'Profile') : t('login', 'Login'), icon: '\u2B24', size: 16, path: user ? '/dashboard/profile' : '/(auth)' },
  ];

  return (
    <View className="flex-row border-t border-border bg-surface-card" style={{ paddingBottom: 4 }}>
      {tabs.map((tab) => {
        const active = isActive(tab.path);
        return (
          <TouchableOpacity
            key={tab.path}
            className="flex-1 items-center py-2"
            onPress={() => router.push(tab.path as any)}
          >
            <Text style={{ fontSize: tab.size, lineHeight: tab.size + 4, color: active ? '#0A7B8A' : '#6A8898' }}>
              {tab.icon}
            </Text>
            <Text
              className={`text-xs mt-0.5 ${active ? 'text-primary font-semibold' : 'text-text-muted'}`}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
