import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useState, useEffect, useCallback } from 'react';
import { Header } from '../../components/layout/Header';
import { Badge } from '../../components/ui/Badge';
import { api } from '../../lib/api';
import { colors } from '../../lib/colors';

interface Promotion {
  id: string;
  promotionType: string;
  isActive: boolean;
  expiresAt: string | null;
  createdAt: string;
  listing: { id: string; title: string } | null;
}

const TYPE_LABELS: Record<string, string> = {
  top_1d: 'promotionTop1d',
  top_3d: 'promotionTop3d',
  top_7d: 'promotionTop7d',
  highlight: 'promotionHighlight',
  unlimited_sub: 'promotionUnlimitedSub',
};

const TYPE_PRICES: Record<string, string> = {
  top_1d: '5 GEL',
  top_3d: '12 GEL',
  top_7d: '25 GEL',
  highlight: '3 GEL',
  unlimited_sub: '9.99 GEL',
};

export default function PaymentsScreen() {
  const { t } = useTranslation();
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPayments = useCallback(async () => {
    setLoading(true);
    const res = await api.get<{ promotions: Promotion[] }>('/promotions/my');
    if (res.ok && res.data) {
      // Sort by createdAt descending — newest first
      const sorted = [...res.data.promotions].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setPromotions(sorted);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <View className="flex-1 bg-white">
        <Header title={t('paymentHistory')} />
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={colors.brandPrimary} />
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <Header title={t('paymentHistory')} />

      <ScrollView className="flex-1" contentContainerClassName="px-4 py-4 gap-3">
        {promotions.length === 0 ? (
          <View className="bg-surface-card border border-border rounded-lg p-8 items-center">
            <Text className="text-4xl mb-4">{'\uD83D\uDCB3'}</Text>
            <Text className="text-text-primary text-lg font-bold mb-2">
              {t('paymentHistory')}
            </Text>
            <Text className="text-text-muted text-sm text-center">
              {t('noPayments')}
            </Text>
          </View>
        ) : (
          promotions.map((promo) => (
            <View
              key={promo.id}
              className="bg-surface-card border border-border rounded-lg p-4"
            >
              {/* Header row: type label + status badge */}
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-text-primary text-sm font-bold flex-1 mr-2" numberOfLines={1}>
                  {t(TYPE_LABELS[promo.promotionType] || promo.promotionType)}
                </Text>
                <Badge
                  label={promo.isActive ? t('alreadyActive') : t('statusRemoved')}
                  variant={promo.isActive ? 'success' : 'default'}
                />
              </View>

              {/* Listing title if present */}
              {promo.listing && (
                <Text className="text-text-secondary text-xs mb-2" numberOfLines={1}>
                  {promo.listing.title}
                </Text>
              )}

              {/* Dates + amount */}
              <View className="flex-row items-center justify-between mt-1">
                <View className="gap-0.5">
                  <Text className="text-text-muted text-xs">
                    {t('paidAt')}: {formatDate(promo.createdAt)}
                  </Text>
                  {promo.expiresAt && (
                    <Text className="text-text-muted text-xs">
                      {t('expiresAt')}: {formatDate(promo.expiresAt)}
                    </Text>
                  )}
                </View>
                <Text className="text-primary text-sm font-bold">
                  {TYPE_PRICES[promo.promotionType] || '—'}
                </Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}
