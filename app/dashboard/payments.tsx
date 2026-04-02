import { View, Text, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Header } from '../../components/layout/Header';

export default function PaymentsScreen() {
  const { t } = useTranslation();

  return (
    <View className="flex-1 bg-dark">
      <Header title={t('paymentHistory')} />

      <ScrollView className="flex-1" contentContainerClassName="px-4 py-4">
        <View className="bg-surface-card border border-border rounded-lg p-8 items-center">
          <Text className="text-4xl mb-4">{'\uD83D\uDCB3'}</Text>
          <Text className="text-text-primary text-lg font-bold mb-2">
            {t('paymentHistory')}
          </Text>
          <Text className="text-text-muted text-sm text-center">
            {t('paymentsComingSoon')}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
