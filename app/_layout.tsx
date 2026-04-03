import '../global.css';
import '../lib/i18n';
import { initI18n } from '../lib/i18n';
import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { View, ActivityIndicator, Platform, useWindowDimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useAuthStore } from '../stores/authStore';
import { useAuthRefresh } from '../hooks/useAuthRefresh';
import { colors } from '../lib/colors';

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

/** Returns responsive maxWidth based on screen width */
function useResponsiveMaxWidth() {
  const { width } = useWindowDimensions();
  if (Platform.OS !== 'web') return 430;
  if (width < 768) return 430;
  if (width < 1024) return 700;
  return 1200;
}

export default function RootLayout() {
  const hydrate = useAuthStore((s) => s.hydrate);
  const isReady = useAuthStore((s) => s.isReady);
  const maxWidth = useResponsiveMaxWidth();

  useEffect(() => {
    hydrate();
    initI18n();
  }, []);

  // Proactive token refresh: every 20 min + on tab/app focus (auth.md Level 2)
  useAuthRefresh();
  useProtectedRoute();

  if (!isReady) {
    return (
      <View className="flex-1 bg-dark items-center justify-center" style={{ maxWidth }}>
        <ActivityIndicator size="large" color={colors.brandPrimary} />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-dark w-full self-center" style={{ maxWidth }}>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.bgPrimary },
          sceneContainerStyle: { backgroundColor: colors.bgPrimary },
        }}
      />
    </View>
  );
}
