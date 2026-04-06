import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useState, useEffect, useCallback } from 'react';
import { Header } from '../../components/layout/Header';
import { Badge } from '../../components/ui/Badge';
import { api } from '../../lib/api';
import { colors } from '../../lib/colors';
import { Ionicons } from '@expo/vector-icons';

interface Payment {
  id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  promotionType: string | null;
  listingId: string | null;
  createdAt: string;
}

const PROMOTION_LABELS: Record<string, string> = {
  top_1d:        'Top 1 day',
  top_3d:        'Top 3 days',
  top_7d:        'Top 7 days',
  highlight:     'Highlight',
  unlimited_sub: 'Subscription',
  bundle:        'Bundle',
};

const STATUS_VARIANTS: Record<Payment['status'], 'success' | 'warning' | 'error' | 'default'> = {
  completed: 'success',
  pending:   'warning',
  failed:    'error',
  refunded:  'default',
};

function formatGEL(amount: number): string {
  return Number.isInteger(amount) ? `${amount} GEL` : `${amount.toFixed(2)} GEL`;
}

export default function PaymentsScreen() {
  const { t } = useTranslation();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPayments = useCallback(async () => {
    setLoading(true);
    const res = await api.get<{ payments: Payment[] }>('/payments/my');
    if (res.ok && res.data) {
      setPayments(res.data.payments);
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
      <View className="flex-1 bg-dark">
        <Header title={t('paymentHistory')} />
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={colors.brandPrimary} />
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-dark">
      <Header title={t('paymentHistory')} />

      <ScrollView className="flex-1" contentContainerClassName="px-4 py-4 gap-3">
        {payments.length === 0 ? (
          <View className="bg-surface-card border border-border rounded-lg p-8 items-center">
            <Ionicons name="card" size={48} color={colors.brandPrimary} style={{ marginBottom: 16 }} />
            <Text className="text-text-primary text-lg font-bold mb-2">
              {t('paymentHistory')}
            </Text>
            <Text className="text-text-muted text-sm text-center">
              {t('noPayments')}
            </Text>
          </View>
        ) : (
          payments.map((payment) => (
            <View
              key={payment.id}
              className="bg-surface-card border border-border rounded-lg p-4"
            >
              {/* Header row: promotion type label + status badge */}
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-text-primary text-sm font-bold flex-1 mr-2" numberOfLines={1}>
                  {PROMOTION_LABELS[payment.promotionType ?? ''] ?? (payment.promotionType || '—')}
                </Text>
                <Badge
                  label={t(`paymentStatus_${payment.status}`, payment.status)}
                  variant={STATUS_VARIANTS[payment.status]}
                />
              </View>

              {/* Date + amount row */}
              <View className="flex-row items-center justify-between mt-1">
                <Text className="text-text-muted text-xs">
                  {formatDate(payment.createdAt)}
                </Text>
                <Text className="text-primary text-sm font-bold">
                  {formatGEL(payment.amount)}
                </Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}
