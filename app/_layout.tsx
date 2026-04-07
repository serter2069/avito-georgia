import '../global.css';
import '../lib/i18n';
import { initI18n } from '../lib/i18n';
import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
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

function useProtectedRoute() {
  const user = useAuthStore((s) => s.user);
  const isReady = useAuthStore((s) => s.isReady);
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!isReady) return;

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
      segments[0] === 'help';
    const inDashboard = segments[0] === 'dashboard' || segments[0] === 'my';

    if (!user && inDashboard) {
      router.replace('/(auth)');
    } else if (!user && inOnboarding) {
      // Unauthenticated users cannot access onboarding
      router.replace('/(auth)');
    } else if (user && inAuthGroup) {
      router.replace('/');
    } else if (user && inOnboarding && user.isOnboarded === true) {
      // Already onboarded users skip the onboarding screen
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

  // Proactive token refresh: every 20 min + on tab/app focus (auth.md Level 2)
  useAuthRefresh();
  useProtectedRoute();

  // Wait for both fonts and auth store hydration before rendering
  if (!fontsLoaded || !isReady) {
    return (
      <SafeAreaProvider>
        <View className="flex-1 bg-dark items-center justify-center" style={{ maxWidth }}>
          <ActivityIndicator size="large" color={colors.brandPrimary} />
        </View>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <View className="flex-1 bg-dark w-full self-center" style={{ maxWidth }}>
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
