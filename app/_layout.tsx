import '../global.css';
import '../lib/i18n';
import { initI18n } from '../lib/i18n';
import { useEffect, useRef } from 'react';
import { Stack, useRouter, useSegments, usePathname } from 'expo-router';
import { View, ActivityIndicator, Platform, useWindowDimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useAuthStore } from '../stores/authStore';
import { useAuthRefresh } from '../hooks/useAuthRefresh';
import { colors } from '../lib/colors';
import { useFonts } from 'expo-font';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import * as SplashScreen from 'expo-splash-screen';

// Prevent splash screen from auto-hiding before fonts are loaded
SplashScreen.preventAutoHideAsync();

// Detect admin mode: admin.* subdomain only
function isAdminDomain(): boolean {
  if (typeof window === 'undefined') return false;
  const { hostname } = window.location;
  return hostname.startsWith('admin.');
}

function useProtectedRoute() {
  const user = useAuthStore((s) => s.user);
  const isReady = useAuthStore((s) => s.isReady);
  const segments = useSegments();
  const router = useRouter();
  const isRedirectingRef = useRef(false);

  useEffect(() => {
    if (!isReady) return;
    if (isRedirectingRef.current) return;

    const inAuthGroup = segments[0] === '(auth)';
    const inOnboarding = segments[0] === 'onboarding';
    // Public routes accessible without auth
    const inPublicRoute =
      segments[0] === undefined || // home (root index)
      segments[0] === 'listings' ||
      segments[0] === 'users' ||
      segments[0] === 'search' ||
      segments[0] === 'promotions' ||
      segments[0] === 'about' ||
      segments[0] === 'terms' ||
      segments[0] === 'privacy' ||
      segments[0] === 'help' ||
      segments[0] === 'proto';
    const inDashboard = segments[0] === 'dashboard' || segments[0] === 'my';

    if (!user && inDashboard) {
      isRedirectingRef.current = true;
      router.replace('/(auth)');
    } else if (!user && inOnboarding) {
      // Unauthenticated users cannot access onboarding
      isRedirectingRef.current = true;
      router.replace('/(auth)');
    } else if (user && inAuthGroup) {
      isRedirectingRef.current = true;
      router.replace('/');
    } else if (user && inOnboarding && user.isOnboarded === true) {
      // Already onboarded users skip the onboarding screen
      isRedirectingRef.current = true;
      router.replace('/');
    } else {
      isRedirectingRef.current = false;
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
  const rawMaxWidth = useResponsiveMaxWidth();
  const segments = useSegments();
  const pathname = usePathname();
  const isProto = segments[0] === 'proto' || pathname.startsWith('/proto');
  const containerStyle = isProto ? {} : { maxWidth: rawMaxWidth };
  const router = useRouter();

  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  useEffect(() => {
    hydrate();
    initI18n();
  }, []);

  // Hide splash screen once fonts are loaded
  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  // On admin subdomain (admin.*): redirect to /admin equivalent if not already there.
  // Both fontsLoaded and isReady must be true before navigating — ensures Root Layout is
  // fully mounted before router.replace is called (avoids "navigate before mounting" crash).
  useEffect(() => {
    if (!fontsLoaded || !isReady) return;
    if (isAdminDomain()) {
      const currentPath = window.location.pathname;
      if (!currentPath.startsWith('/admin')) {
        // Map known admin routes to their /admin/* equivalents; fall back to /admin index
        const ADMIN_ROUTES = [
          'users', 'settings', 'moderation', 'categories', 'payments', 'reports',
        ];
        const segment = currentPath.replace(/^\//, '').split('/')[0];
        const target = ADMIN_ROUTES.includes(segment)
          ? `/admin/${currentPath.replace(/^\//, '')}`
          : '/admin';
        // Defer one tick so expo-router finishes mounting the Root Layout
        setTimeout(() => router.replace(target as any), 0);
      }
    }
  }, [fontsLoaded, isReady]);

  // Proactive token refresh: every 20 min + on tab/app focus (auth.md Level 2)
  useAuthRefresh();
  useProtectedRoute();

  // Wait for both fonts and auth store hydration before rendering
  if (!fontsLoaded || !isReady) {
    return (
      <SafeAreaProvider>
        <View className="flex-1 bg-dark items-center justify-center" style={containerStyle}>
          <ActivityIndicator size="large" color={colors.brandPrimary} />
        </View>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <View className="flex-1 bg-dark w-full self-center" style={containerStyle}>
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: colors.bgPrimary },
          }}
        />
      </View>
    </SafeAreaProvider>
  );
}
