import '../global.css';
import '../lib/i18n';
import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { View, ActivityIndicator, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useAuthStore } from '../stores/authStore';
import { useAuthRefresh } from '../hooks/useAuthRefresh';
import { colors } from '../lib/colors';
import { BottomNav } from '../components/layout/BottomNav';

function useProtectedRoute() {
  const user = useAuthStore((s) => s.user);
  const isReady = useAuthStore((s) => s.isReady);
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!isReady) return;

    const inAuthGroup = segments[0] === '(auth)';
    // Public routes accessible without auth
    const inPublicRoute =
      segments.length === 0 || // home
      segments[0] === 'listings' ||
      segments[0] === 'users' ||
      segments[0] === 'search' ||
      segments[0] === 'promotions' ||
      segments[0] === 'about' ||
      segments[0] === 'terms' ||
      segments[0] === 'privacy' ||
      segments[0] === 'help';
    const inDashboard = segments[0] === 'dashboard' || segments[0] === 'my';

    if (!user && inDashboard) {
      router.replace('/(auth)');
    } else if (user && inAuthGroup) {
      router.replace('/');
    }
  }, [user, isReady, segments]);
}

export default function RootLayout() {
  const hydrate = useAuthStore((s) => s.hydrate);
  const isReady = useAuthStore((s) => s.isReady);

  useEffect(() => {
    hydrate();
  }, []);

  // Proactive token refresh: every 20 min + on tab/app focus (auth.md Level 2)
  useAuthRefresh();
  useProtectedRoute();

  if (!isReady) {
    return (
      <View className="flex-1 bg-dark items-center justify-center" style={{ maxWidth: 430, ...(Platform.OS === 'web' ? { height: '100vh' } as any : {}) }}>
        <ActivityIndicator size="large" color={colors.brandPrimary} />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-dark w-full self-center" style={{ maxWidth: 430, ...(Platform.OS === 'web' ? { height: '100vh' } as any : {}) }}>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.bgPrimary },
          sceneContainerStyle: { backgroundColor: colors.bgPrimary },
        }}
      />
      <BottomNav />
    </View>
  );
}
