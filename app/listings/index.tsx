import { View, Platform } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useLocalSearchParams } from 'expo-router';
import { Header } from '../../components/layout/Header';
import { ListingFeed } from '../../components/listing/ListingFeed';
import Head from 'expo-router/head';

export default function ListingsScreen() {
  const { t } = useTranslation();
  const params = useLocalSearchParams<{ category?: string }>();

  return (
    <View className="flex-1 bg-dark">
      {Platform.OS === 'web' && (
        <Head>
          <title>Объявления | Авито Грузия</title>
          <meta name="description" content="Все объявления в Грузии. Недвижимость, авто, электроника, работа и многое другое." />
          <meta property="og:title" content="Объявления | Авито Грузия" />
          <meta property="og:description" content="Все объявления в Грузии. Недвижимость, авто, электроника, работа и многое другое." />
          <meta property="og:type" content="website" />
        </Head>
      )}
      <Header title={t('listings')} />
      <ListingFeed initialCategory={params.category} />
    </View>
  );
}
