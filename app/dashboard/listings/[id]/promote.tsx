import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Linking } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useState, useEffect, useCallback } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Header } from '../../../../components/layout/Header';
import { Button } from '../../../../components/ui/Button';
import { api } from '../../../../lib/api';

interface PriceOption {
  type: string;
  label: string;
  amountGEL: number;
  days: number | null;
  recurring: boolean;
}

interface ActivePromotion {
  id: string;
  promotionType: string;
  isActive: boolean;
  expiresAt: string | null;
  listing: { id: string; title: string } | null;
}

interface PurchaseResponse {
  clientSecret?: string;
  paymentIntentId?: string;
  url?: string;
  sessionId?: string;
}

const TYPE_I18N: Record<string, string> = {
  top_1d: 'promotionTop1d',
  top_3d: 'promotionTop3d',
  top_7d: 'promotionTop7d',
  highlight: 'promotionHighlight',
  unlimited_sub: 'promotionUnlimitedSub',
};

const TYPE_DESC_I18N: Record<string, string> = {
  top_1d: 'promotionTop1dDesc',
  top_3d: 'promotionTop3dDesc',
  top_7d: 'promotionTop7dDesc',
  highlight: 'promotionHighlightDesc',
  unlimited_sub: 'promotionUnlimitedSubDesc',
};

const TYPE_ICONS: Record<string, string> = {
  top_1d: '\u2B06',
  top_3d: '\u2B06\u2B06',
  top_7d: '\u2B06\u2B06\u2B06',
  highlight: '\u2728',
  unlimited_sub: '\u221E',
};

export default function PromoteListingScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { id: listingId } = useLocalSearchParams<{ id: string }>();

  const [prices, setPrices] = useState<PriceOption[]>([]);
  const [activePromotions, setActivePromotions] = useState<ActivePromotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState<string | null>(null);
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const [pricesRes, myRes] = await Promise.all([
      api.get<{ prices: PriceOption[] }>('/promotions/prices'),
      api.get<{ promotions: ActivePromotion[] }>('/promotions/my'),
    ]);

    if (pricesRes.ok && pricesRes.data) {
      // Filter out subscription type from listing promote page
      setPrices(pricesRes.data.prices.filter((p) => !p.recurring));
    }
    if (myRes.ok && myRes.data) {
      // Filter promotions for this listing
      setActivePromotions(
        myRes.data.promotions.filter((p) => p.listing?.id === listingId)
      );
    }
    setLoading(false);
  }, [listingId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handlePurchase = async (type: string) => {
    setPurchasing(type);
    setCheckoutUrl(null);

    const res = await api.post<PurchaseResponse>('/promotions/purchase', {
      listingId,
      type,
    });

    if (res.ok && res.data) {
      if (res.data.url) {
        // Stripe Checkout session — open in browser
        setCheckoutUrl(res.data.url);
        Linking.openURL(res.data.url);
      } else if (res.data.clientSecret) {
        // PaymentIntent flow — show info to user
        setCheckoutUrl(null);
      }
    }

    setPurchasing(null);
  };

  const isTypeActive = (type: string) => {
    return activePromotions.some((p) => p.promotionType === type && p.isActive);
  };

  if (loading) {
    return (
      <View className="flex-1 bg-dark">
        <Header title={t('promoteListing')} />
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#6366f1" />
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-dark">
      <Header title={t('promoteListing')} />

      <ScrollView className="flex-1" contentContainerClassName="px-4 py-4 gap-4">
        {/* Active promotions for this listing */}
        {activePromotions.length > 0 && (
          <View className="bg-surface-card border border-success/30 rounded-lg p-4">
            <Text className="text-success text-sm font-bold mb-2">
              {t('activePromotion')}
            </Text>
            {activePromotions.map((promo) => (
              <View key={promo.id} className="flex-row items-center justify-between py-1">
                <Text className="text-text-primary text-sm">
                  {t(TYPE_I18N[promo.promotionType] || promo.promotionType)}
                </Text>
                {promo.expiresAt && (
                  <Text className="text-text-muted text-xs">
                    {t('expiresAt')}: {new Date(promo.expiresAt).toLocaleDateString()}
                  </Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Promotion tiers */}
        <Text className="text-text-primary text-lg font-bold">
          {t('promotionTypes')}
        </Text>

        {prices.map((option) => {
          const active = isTypeActive(option.type);
          const isHighlight = option.type === 'highlight';
          const isBestValue = option.type === 'top_7d';

          return (
            <View
              key={option.type}
              className={`bg-surface-card border rounded-lg p-4 ${
                isHighlight
                  ? 'border-secondary'
                  : isBestValue
                  ? 'border-primary'
                  : 'border-border'
              }`}
            >
              {isBestValue && (
                <View className="bg-primary rounded-full px-2 py-0.5 self-start mb-2">
                  <Text className="text-white text-xs font-bold">Best value</Text>
                </View>
              )}

              <View className="flex-row items-center justify-between mb-2">
                <View className="flex-row items-center gap-2">
                  <Text className="text-xl">
                    {TYPE_ICONS[option.type] || '\u26A1'}
                  </Text>
                  <Text className="text-text-primary text-base font-bold">
                    {t(TYPE_I18N[option.type] || option.type)}
                  </Text>
                </View>
                <Text className="text-primary text-lg font-bold">
                  {option.amountGEL} GEL
                </Text>
              </View>

              <Text className="text-text-muted text-sm mb-3">
                {t(TYPE_DESC_I18N[option.type] || '')}
              </Text>

              {active ? (
                <View className="bg-success/20 rounded-lg py-2 px-3 items-center">
                  <Text className="text-success text-sm font-semibold">
                    {t('alreadyActive')}
                  </Text>
                </View>
              ) : (
                <Button
                  title={`${t('buyNow')} — ${option.amountGEL} GEL`}
                  onPress={() => handlePurchase(option.type)}
                  loading={purchasing === option.type}
                  variant={isHighlight ? 'secondary' : 'primary'}
                />
              )}
            </View>
          );
        })}

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
