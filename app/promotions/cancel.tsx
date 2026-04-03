import { View, Text, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import { Button } from '../../components/ui/Button';
import { Ionicons } from '@expo/vector-icons';

export default function PromotionCancelScreen() {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <View className="flex-1 bg-dark">
      <ScrollView
        className="flex-1"
        contentContainerClassName="flex-1 items-center justify-center px-6 py-12"
      >
        <View className="items-center mb-8">
          <Ionicons name="close-circle" size={72} color="#ef4444" style={{ marginBottom: 16 }} />
          <Text className="text-text-primary text-2xl font-bold text-center mb-3">
            {t('paymentCancel')}
          </Text>
          <Text className="text-text-secondary text-sm text-center leading-5">
            {t('paymentCancelDesc')}
          </Text>
        </View>

        <View className="w-full gap-3">
          <Button
            title={t('backToDashboard')}
            onPress={() => router.replace('/my/listings')}
            size="lg"
          />
          <Button
            title={t('backToListings')}
            onPress={() => router.replace('/')}
            variant="ghost"
            size="lg"
          />
        </View>
      </ScrollView>
    </View>
  );
}
