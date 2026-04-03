import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useLocalSearchParams } from 'expo-router';
import { Header } from '../../components/layout/Header';
import { ListingFeed } from '../../components/listing/ListingFeed';

export default function ListingsScreen() {
  const { t } = useTranslation();
  const params = useLocalSearchParams<{ category?: string }>();

  return (
    <View className="flex-1 bg-dark">
      <Header title={t('listings')} />
      <ListingFeed initialCategory={params.category} />
    </View>
  );
}
