import '../global.css';
import { Stack, usePathname, useRouter } from 'expo-router';
import { View, Platform, useWindowDimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useRef, useEffect } from 'react';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import { useAuthStore } from '../store/auth';

function useResponsiveMaxWidth() {
  const { width } = useWindowDimensions();
  if (Platform.OS !== 'web') return 430;
  if (width < 768) return 430;
  if (width < 1024) return 700;
  return 1200;
}

const NO_CHROME_PREFIXES = ['/auth/', '/proto'];

export default function RootLayout() {
  const rawMaxWidth = useResponsiveMaxWidth();
  const pathname = usePathname();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isTablet = width >= 640;
  const rootViewRef = useRef<View>(null);

  const isProto = pathname.startsWith('/proto');
  const showChrome = !NO_CHROME_PREFIXES.some(p => pathname.startsWith(p));

  const { isLoggedIn, user } = useAuthStore();

  useEffect(() => {
    if (Platform.OS !== 'web') return;
    const el = rootViewRef.current as unknown as HTMLElement | null;
    if (!el) return;
    el.style.maxWidth = isProto ? '' : rawMaxWidth + 'px';
  }, [isProto, rawMaxWidth]);

  const containerStyle = isProto ? undefined : { maxWidth: rawMaxWidth };

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

        <View style={{ flex: 1 }}>
          <Stack screenOptions={{ headerShown: false }} />
        </View>

        {showChrome && !isTablet && <BottomNav />}
      </View>
    </SafeAreaProvider>
  );
}
