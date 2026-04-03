import '../global.css';
import '../lib/i18n';
import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useAuthStore } from '../stores/authStore';
import { useAuthRefresh } from '../hooks/useAuthRefresh';
import { colors } from '../lib/colors';
import { useBreakpoint, isDesktop } from '../lib/responsive';
import { Header } from '../components/layout/Header';
import { BottomNav } from '../components/layout/BottomNav';
import { DesktopSidebar } from '../components/layout/DesktopSidebar';

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
  const breakpoint = useBreakpoint();

  useEffect(() => {
    hydrate();
  }, []);

  // Proactive token refresh: every 20 min + on tab/app focus (auth.md Level 2)
  useAuthRefresh();
  useProtectedRoute();

  if (!isReady) {
    return (
      <SafeAreaProvider>
        <View style={{ flex: 1, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" color={colors.brandPrimary} />
        </View>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
        <StatusBar style="dark" />
        <Header />
        {isDesktop(breakpoint) ? (
          <View style={{ flex: 1, flexDirection: 'row' }}>
            <DesktopSidebar />
            <View style={{ flex: 1, maxWidth: 1280 }}>
              <Stack
                screenOptions={{
                  headerShown: false,
                  contentStyle: { backgroundColor: '#FFFFFF' },
                }}
              />
            </View>
          </View>
        ) : (
          <>
            <Stack
              screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: '#FFFFFF' },
              }}
            />
            <BottomNav />
          </>
        )}
      </View>
    </SafeAreaProvider>
  );
}
