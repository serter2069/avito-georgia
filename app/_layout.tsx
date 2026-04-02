import '../global.css';
import '../lib/i18n';
import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import Head from 'expo-router/head';
import { View, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useAuthStore } from '../stores/authStore';
import { colors } from '../lib/colors';

function useProtectedRoute() {
  const user = useAuthStore((s) => s.user);
  const isReady = useAuthStore((s) => s.isReady);
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!isReady) return;

    const inAuthGroup = segments[0] === '(auth)';
    const inDashboardGroup = segments[0] === 'dashboard';
    const inAdminGroup = segments[0] === 'admin';
    // Allow guests to view listings detail, seller profiles, and Stripe redirect pages
    const isPublicRoute =
      segments[0] === 'listings' || segments[0] === 'users' || segments[0] === 'promotions';

    if (!user && !inAuthGroup && !isPublicRoute) {
      router.replace('/(auth)');
    } else if (user && inAuthGroup) {
      router.replace('/');
    }

    // Explicit guards: non-authenticated users must not reach protected groups
    if (!user && (inDashboardGroup || inAdminGroup)) {
      router.replace('/(auth)');
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
        <ActivityIndicator size="large" color={colors.brandPrimary} />
      </View>
    );
  }

  return (
    <>
      <Head>
        <title>Авито Грузия — доска объявлений</title>
        <meta
          name="description"
          content="Купить и продать в Грузии: недвижимость, транспорт, электроника и другое. Бесплатные объявления в Тбилиси, Батуми, Кутаиси."
        />
        <meta property="og:title" content="Авито Грузия — доска объявлений" />
        <meta
          property="og:description"
          content="Купить и продать в Грузии: недвижимость, транспорт, электроника и другое."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://avito-georgia.smartlaunchhub.com" />
        <meta name="theme-color" content={colors.brandPrimary} />
      </Head>
      <View className="flex-1 bg-dark w-full self-center" style={{ maxWidth: 430 }}>
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: colors.bgPrimary },
          }}
        />
      </View>
    </>
  );
}
