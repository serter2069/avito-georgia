import '../global.css';
import { Stack, usePathname, useRouter } from 'expo-router';
import { View, Platform, useWindowDimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useRef, useEffect, useState } from 'react';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import { useAuthStore } from '../store/auth';

import MetroBridge from "../components/MetroBridge";
function useResponsiveMaxWidth() {
  const { width } = useWindowDimensions();
  if (Platform.OS !== 'web') return 430;
  if (width < 768) return 430;
  if (width < 1024) return 700;
  return 1200;
}

const NO_CHROME_PREFIXES = ['/auth/', '/proto', '/brand'];

// Routes where BottomNav should be hidden
const NO_BOTTOM_NAV = ['/listings/create'];

// Routes that require auth — redirect to /auth/email if not logged in
const PRIVATE_PREFIXES = [
  '/dashboard',
  '/listings/create',
  '/payment',
  '/admin',
];
const PRIVATE_EXACT = ['/listings/create'];

function isPrivate(path: string) {
  return PRIVATE_PREFIXES.some(p => path === p || path.startsWith(p + '/') || path.startsWith(p))
    || path.match(/^\/listings\/[^/]+\/(edit|expired)$/);
}

export default function RootLayout() {
  const rawMaxWidth = useResponsiveMaxWidth();
  const pathname = usePathname();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isTablet = width >= 640;
  const rootViewRef = useRef<View>(null);

  const isProto = pathname.startsWith('/proto');
  const showChrome = !NO_CHROME_PREFIXES.some(p => pathname.startsWith(p));

  const { isLoggedIn, user, loading, fetchMe } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); fetchMe(); }, []);

  // Redirect to login if accessing private route without auth
  // Wait for fetchMe to complete (loading=false) before deciding
  useEffect(() => {
    if (!mounted || loading) return;
    if (!isLoggedIn && isPrivate(pathname)) {
      router.replace('/auth/email' as any);
    }
    // Redirect non-admin users away from admin routes
    if (isLoggedIn && user && pathname.startsWith('/admin') && user.role !== 'admin') {
      router.replace('/' as any);
    }
  }, [mounted, loading, isLoggedIn, user, pathname]);

  useEffect(() => {
    if (Platform.OS !== 'web') return;
    const el = rootViewRef.current as unknown as HTMLElement | null;
    if (!el) return;
    el.style.maxWidth = isProto ? '' : rawMaxWidth + 'px';
  }, [isProto, rawMaxWidth]);

  const containerStyle = {
    ...(isProto ? {} : { maxWidth: rawMaxWidth }),
    ...(Platform.OS === 'web' ? { minHeight: '100vh' as any, overflow: 'visible' as any } : {}),
  };

  return (
    <SafeAreaProvider>
      <View ref={rootViewRef} className="flex-1 bg-white w-full self-center" style={containerStyle}>
        <StatusBar style="dark" />

        {showChrome && (
          <Header
            loggedIn={isLoggedIn}
            avatarInitial={user?.initial ?? 'Г'}
            onLoginPress={() => router.push('/auth/email' as any)}
            onPostPress={() => router.push('/listings/create' as any)}
            onAvatarPress={() => router.push('/dashboard/profile' as any)}
          />
        )}

        <View style={{ flex: 1, ...(Platform.OS === 'web' ? { overflow: 'visible' as any } : {}) }}>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="admin/categories" />
            <Stack.Screen name="admin/finance" />
            <Stack.Screen name="admin" />
            <Stack.Screen name="admin/moderation" />
            <Stack.Screen name="admin/users" />
            <Stack.Screen name="auth/email" />
            <Stack.Screen name="auth/onboarding" />
            <Stack.Screen name="auth/otp" />
            <Stack.Screen name="brand" />
            <Stack.Screen name="dashboard/favorites" />
            <Stack.Screen name="dashboard/listings" />
            <Stack.Screen name="dashboard/messages/[id]" />
            <Stack.Screen name="dashboard/messages" />
            <Stack.Screen name="dashboard/payment-history" />
            <Stack.Screen name="dashboard/profile" />
            <Stack.Screen name="dashboard/sessions" />
            <Stack.Screen name="dashboard/settings" />
            <Stack.Screen name="legal/about" />
            <Stack.Screen name="legal/help" />
            <Stack.Screen name="legal/privacy" />
            <Stack.Screen name="legal/terms" />
            <Stack.Screen name="listings/[id]/contact" />
            <Stack.Screen name="listings/[id]/edit" />
            <Stack.Screen name="listings/[id]/expired" />
            <Stack.Screen name="listings/[id]" />
            <Stack.Screen name="listings/create" />
            <Stack.Screen name="map" />
            <Stack.Screen name="payment" />
            <Stack.Screen name="proto/states/[page]" />
            <Stack.Screen name="users/[id]" />
            <Stack.Screen name="users/[id]/reviews" />
          </Stack>
        </View>

        {showChrome && !isTablet && !NO_BOTTOM_NAV.includes(pathname) && <BottomNav />}
      </View>
    </SafeAreaProvider>
  );
}
