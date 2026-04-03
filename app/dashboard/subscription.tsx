import { View, Text, ScrollView, ActivityIndicator, Linking } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useState, useEffect, useCallback } from 'react';
import { Header } from '../../components/layout/Header';
import { Button } from '../../components/ui/Button';
import { api } from '../../lib/api';
import { colors } from '../../lib/colors';
import { Ionicons } from '@expo/vector-icons';

interface ActivePromotion {
  id: string;
  promotionType: string;
  isActive: boolean;
  expiresAt: string | null;
  createdAt: string;
}

interface PurchaseResponse {
  url?: string;
  sessionId?: string;
}

export default function SubscriptionScreen() {
  const { t } = useTranslation();

  const [activeSubscription, setActiveSubscription] = useState<ActivePromotion | null>(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);

  const fetchSubscription = useCallback(async () => {
    setLoading(true);
    const res = await api.get<{ promotions: ActivePromotion[] }>('/promotions/my');
    if (res.ok && res.data) {
      const sub = res.data.promotions.find(
        (p) => p.promotionType === 'unlimited_sub' && p.isActive
      );
      setActiveSubscription(sub || null);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchSubscription();
  }, [fetchSubscription]);

  const handleSubscribe = async () => {
    setPurchasing(true);
    setCheckoutUrl(null);

    const res = await api.post<PurchaseResponse>('/promotions/purchase', {
      type: 'unlimited_sub',
    });

    if (res.ok && res.data?.url) {
      setCheckoutUrl(res.data.url);
      Linking.openURL(res.data.url);
    }

    setPurchasing(false);
  };

  if (loading) {
    return (
      <View className="flex-1 bg-dark">
        <Header title={t('subscription')} />
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={colors.brandPrimary} />
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-dark">
      <Header title={t('subscription')} />

      <ScrollView className="flex-1" contentContainerClassName="px-4 py-4 gap-4">
        {/* Subscription card */}
        <View className="bg-surface-card border border-primary rounded-xl p-5">
          <View className="items-center mb-4">
            <Ionicons name="infinite" size={36} color={colors.brandPrimary} style={{ marginBottom: 8 }} />
            <Text className="text-text-primary text-xl font-bold">
              {t('promotionUnlimitedSub')}
            </Text>
            <View className="flex-row items-baseline mt-2">
              <Text className="text-primary text-3xl font-bold">9.99</Text>
              <Text className="text-text-muted text-base ml-1">GEL{t('perMonth')}</Text>
            </View>
          </View>

          <View className="bg-dark/50 rounded-lg p-4 mb-4 gap-3">
            <FeatureRow text={t('unlimitedListings')} />
            <FeatureRow text={t('promotionUnlimitedSubDesc')} />
          </View>

          {activeSubscription ? (
            <View className="bg-success/20 rounded-lg py-3 px-4 items-center">
              <Text className="text-success text-base font-bold mb-1">
                {t('alreadyActive')}
              </Text>
              <Text className="text-text-muted text-xs">
                {t('expiresAt')}:{' '}
                {activeSubscription.expiresAt
                  ? new Date(activeSubscription.expiresAt).toLocaleDateString()
                  : '-'}
              </Text>
            </View>
          ) : (
            <Button
              title={`${t('subscribeNow')} — 9.99 GEL${t('perMonth')}`}
              onPress={handleSubscribe}
              loading={purchasing}
              size="lg"
            />
          )}
        </View>

        {/* Checkout URL info */}
        {checkoutUrl && (
          <View className="bg-surface border border-primary/30 rounded-lg p-4">
            <Text className="text-text-primary text-sm font-semibold mb-2">
              {t('processingPayment')}
            </Text>
            <Button
              title={t('completePayment')}
              onPress={() => Linking.openURL(checkoutUrl)}
              variant="primary"
            />
          </View>
        )}
      </ScrollView>
    </View>
  );
}

function FeatureRow({ text }: { text: string }) {
  return (
    <View className="flex-row items-start gap-2">
      <Ionicons name="checkmark" size={16} color="#22c55e" />
      <Text className="text-text-secondary text-sm flex-1">{text}</Text>
    </View>
  );
}
