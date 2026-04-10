import { View, Text, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Button } from '../../components/ui/Button';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../lib/colors';

export default function PromotionSuccessScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { session_id } = useLocalSearchParams<{ session_id?: string }>();

  return (
    <View className="flex-1 bg-dark">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24, paddingVertical: 48 }}
      >
        <View style={{ width: '100%', maxWidth: 480 }}>
        <View className="items-center mb-8">
          <Ionicons name="checkmark-circle" size={72} color={colors.statusSuccessAlt} style={{ marginBottom: 16 }} />
          <Text className="text-text-primary text-2xl font-bold text-center mb-3">
            {t('paymentSuccess')}
          </Text>
          <Text className="text-text-secondary text-sm text-center leading-5">
            {t('paymentSuccessDesc')}
          </Text>
          {session_id ? (
            <Text className="text-text-muted text-xs text-center mt-4">
              ID: {session_id}
            </Text>
          ) : null}
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
        </View>
      </ScrollView>
    </View>
  );
}
