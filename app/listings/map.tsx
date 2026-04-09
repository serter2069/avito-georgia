import { View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import { Header } from '../../components/layout/Header';
import { Button } from '../../components/ui/Button';

// Dedicated route for /listings/map to prevent [id].tsx from catching "map" as a listing ID.
export default function ListingsMapScreen() {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <View className="flex-1 bg-dark">
      <Header title={t('map')} />
      <View className="flex-1 items-center justify-center px-4">
        <Text className="text-text-muted text-base mb-4">{t('mapComingSoon') || 'Map view coming soon'}</Text>
        <Button title={t('back')} onPress={() => router.back()} variant="ghost" />
      </View>
    </View>
  );
}
