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
    // Allow guests to view listings detail, seller profiles, and Stripe redirect pages
    const inPublicRoute = segments[0] === 'listings' || segments[0] === 'users' || segments[0] === 'promotions';

    if (!user && !inAuthGroup && !inPublicRoute) {
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
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-dark w-full self-center" style={{ maxWidth: 430 }}>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#0f0f1a' },
        }}
      />
    </View>
  );
}
