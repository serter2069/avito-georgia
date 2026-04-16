import '../global.css';
import { Stack } from 'expo-router';
import { View, Platform, useWindowDimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useRef, useEffect } from 'react';
import { useSegments, usePathname } from 'expo-router';

function useResponsiveMaxWidth() {
  const { width } = useWindowDimensions();
  if (Platform.OS !== 'web') return 430;
  if (width < 768) return 430;
  if (width < 1024) return 700;
  return 1200;
}

export default function RootLayout() {
  const rawMaxWidth = useResponsiveMaxWidth();
  const segments = useSegments();
  const pathname = usePathname();
  const isProtoSync = Platform.OS === 'web' && typeof window !== 'undefined' && window.location.pathname.startsWith('/proto');
  const isProto = isProtoSync || segments[0] === 'proto' || pathname.startsWith('/proto');
  const rootViewRef = useRef<View>(null);

  useEffect(() => {
    if (Platform.OS !== 'web') return;
    const el = rootViewRef.current as unknown as HTMLElement | null;
    if (!el) return;
    if (isProto) {
      el.style.maxWidth = '';
    } else {
      el.style.maxWidth = rawMaxWidth + 'px';
    }
  }, [isProto, rawMaxWidth]);

  const containerStyle = isProto ? undefined : { maxWidth: rawMaxWidth };

  return (
    <SafeAreaProvider>
      <View ref={rootViewRef} className="flex-1 bg-white w-full self-center" style={containerStyle}>
        <StatusBar style="dark" />
        <Stack screenOptions={{ headerShown: false }} />
      </View>
    </SafeAreaProvider>
  );
}
