import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, useWindowDimensions } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useState, useEffect, useCallback } from 'react';
import { api } from '../../lib/api';
import { colors } from '../../lib/colors';
import { Ionicons } from '@expo/vector-icons';

interface PaymentItem {
  id: string;
  amount: number;
  currency: string;
  status: string;
  provider: string | null;
  promotionType: string | null;
  createdAt: string;
  user?: { id: string; email: string; name: string | null };
}

const STATUS_STYLES: Record<string, { bg: string; text: string }> = {
  completed: { bg: 'bg-success/20', text: 'text-success' },
  pending: { bg: 'bg-warning/20', text: 'text-warning' },
  failed: { bg: 'bg-error/20', text: 'text-error' },
  refunded: { bg: 'bg-info/20', text: 'text-info' },
};

export default function AdminPayments() {
  const { t } = useTranslation();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;
  const [payments, setPayments] = useState<PaymentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchPayments = useCallback(async (p: number) => {
    setLoading(true);
    const res = await api.get<{ payments: PaymentItem[]; total: number }>(
      `/admin/payments?page=${p}`
    );
    if (res.ok && res.data) {
      setPayments(res.data.payments);
      setTotal(res.data.total);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchPayments(page);
  }, [page, fetchPayments]);

  const formatDate = (iso: string) => new Date(iso).toLocaleDateString();

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color={colors.brandPrimary} />
      </View>
    );
  }

  return (
    <ScrollView className="flex-1" contentContainerStyle={isDesktop ? { padding: 24, gap: 12, maxWidth: 1000, alignSelf: 'center', width: '100%' } : { padding: 16, gap: 12 }}>
      <Text className="text-text-muted text-xs mb-1">
        {t('adminPayments')}: {total}
      </Text>

      {payments.length === 0 ? (
        <Text className="text-text-muted text-sm text-center py-8">{t('noPayments')}</Text>
      ) : (
        payments.map((p) => {
          const style = STATUS_STYLES[p.status] || STATUS_STYLES.pending;
          return (
            <View key={p.id} className="bg-surface-card border border-border rounded-lg p-4">
              <View className="flex-row justify-between items-center mb-2">
                <Text className="text-text-primary text-sm font-medium flex-1 mr-2" numberOfLines={1}>
                  {p.user?.email ?? '—'}
                </Text>
                <Text className="text-primary text-base font-bold">
                  {p.amount} {p.currency}
                </Text>
              </View>

              <View className="flex-row justify-between items-center">
                <View className="flex-row gap-2 items-center">
                  {p.promotionType && (
                    <View className="bg-primary/20 px-2 py-0.5 rounded">
                      <Text className="text-primary text-xs">{p.promotionType}</Text>
                    </View>
                  )}
                  <Text className="text-text-muted text-xs">{formatDate(p.createdAt)}</Text>
                </View>
                <View className={`px-2 py-0.5 rounded ${style.bg}`}>
                  <Text className={`text-xs font-medium ${style.text}`}>{t(p.status)}</Text>
                </View>
              </View>
            </View>
          );
        })
      )}

      {/* Pagination */}
      {total > 50 && (
        <View className="flex-row justify-center gap-3 py-4">
          <TouchableOpacity
            className={`px-4 py-2 rounded-lg ${page > 1 ? 'bg-primary' : 'bg-surface'}`}
            onPress={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
          >
            <Ionicons name="chevron-back" size={18} color={page > 1 ? colors.white : colors.textMuted} />
          </TouchableOpacity>
          <Text className="text-text-secondary self-center text-sm">
            {page} / {Math.ceil(total / 50)}
          </Text>
          <TouchableOpacity
            className={`px-4 py-2 rounded-lg ${page < Math.ceil(total / 50) ? 'bg-primary' : 'bg-surface'}`}
            onPress={() => setPage((p) => p + 1)}
            disabled={page >= Math.ceil(total / 50)}
          >
            <Ionicons name="chevron-forward" size={18} color={page < Math.ceil(total / 50) ? colors.white : colors.textMuted} />
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}
