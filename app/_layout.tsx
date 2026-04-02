import '../global.css';
import '../lib/i18n';
import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useAuthStore } from '../stores/authStore';

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
      segments[0] === 'search';
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

  useProtectedRoute();

  if (!isReady) {
    return (
      <View className="flex-1 bg-dark items-center justify-center" style={{ maxWidth: 430 }}>
        <ActivityIndicator size="large" color="#0A7B8A" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-dark w-full self-center" style={{ maxWidth: 430 }}>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#F2F8FA' },
        }}
      />
    </View>
  );
}
