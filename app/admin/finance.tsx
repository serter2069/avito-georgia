import { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { apiFetch } from '../../lib/api';
import { ErrorState } from '../../components/ErrorState';
import { colors } from '../../lib/theme';

const STATUS_COLORS: Record<string, string> = {
  completed: colors.primary,
  pending: colors.warning,
  failed: colors.error,
  refunded: colors.textSecondary,
};

const STATUS_LABELS: Record<string, string> = {
  completed: 'Оплачено',
  pending: 'Ожидание',
  failed: 'Ошибка',
  refunded: 'Возврат',
};

export default function AdminFinance() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const contentWidth = Math.min(width, width >= 1024 ? 960 : width);
  const [payments, setPayments] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = async () => {
    setLoading(true); setError(false);
    try {
      const [paymentsRes, statsRes] = await Promise.all([
        apiFetch('/admin/payments?limit=50'),
        apiFetch('/admin/stats'),
      ]);
      setPayments(paymentsRes.payments ?? []);
      setStats(statsRes);
    } catch { setError(true); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  // Compute totals from payments list
  const totalRevenue = payments
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + (p.amount ?? 0), 0);

  if (loading) return <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}><ActivityIndicator color={colors.primary} /></View>;
  if (error) return <ErrorState message="Не удалось загрузить финансы" onRetry={load} />;

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: colors.surface }}>
      {/* Header */}
      <View style={{ backgroundColor: colors.background, borderBottomWidth: 1, borderBottomColor: '#E8E8E8', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, gap: 12 }}>
        <Pressable onPress={() => router.back()} accessibilityLabel="Назад"><Text style={{ fontSize: 22 }}>←</Text></Pressable>
        <Text style={{ fontSize: 17, fontWeight: '700' }}>Финансы</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, gap: 16, maxWidth: contentWidth, alignSelf: 'center', width: '100%' }}>
        {/* Summary cards */}
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <View style={{ flex: 1, backgroundColor: colors.background, borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#E8E8E8' }}>
            <Text style={{ fontSize: 22, fontWeight: '800', color: colors.primary }}>₾{stats?.paymentsThisMonth?.sum ?? 0}</Text>
            <Text style={{ fontSize: 12, color: colors.textSecondary, marginTop: 4 }}>Выручка за месяц</Text>
          </View>
          <View style={{ flex: 1, backgroundColor: colors.background, borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#E8E8E8' }}>
            <Text style={{ fontSize: 22, fontWeight: '800', color: colors.text }}>{stats?.paymentsThisMonth?.count ?? 0}</Text>
            <Text style={{ fontSize: 12, color: colors.textSecondary, marginTop: 4 }}>Платежей за месяц</Text>
          </View>
        </View>

        <View style={{ backgroundColor: colors.background, borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#E8E8E8' }}>
          <Text style={{ fontSize: 22, fontWeight: '800', color: colors.text }}>₾{totalRevenue.toFixed(2)}</Text>
          <Text style={{ fontSize: 12, color: colors.textSecondary, marginTop: 4 }}>Всего выручки (последние {payments.length} платежей)</Text>
        </View>

        {/* Payments list */}
        {payments.length > 0 && (
          <View style={{ backgroundColor: colors.background, borderRadius: 12, borderWidth: 1, borderColor: '#E8E8E8', overflow: 'hidden' }}>
            <Text style={{ fontSize: 14, fontWeight: '700', color: colors.text, padding: 16, borderBottomWidth: 1, borderBottomColor: '#E8E8E8' }}>
              Последние платежи
            </Text>
            {payments.map((p, i) => (
              <View
                key={p.id ?? i}
                style={{ padding: 14, borderBottomWidth: i < payments.length - 1 ? 1 : 0, borderBottomColor: '#E8E8E8', flexDirection: 'row', alignItems: 'center', gap: 12 }}
              >
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 13, fontWeight: '600', color: colors.text }}>
                    {p.user?.name ?? p.user?.email ?? 'Пользователь'}
                  </Text>
                  <Text style={{ fontSize: 11, color: colors.textSecondary, marginTop: 2 }}>
                    {p.createdAt ? new Date(p.createdAt).toLocaleString('ru-RU') : ''}
                    {p.description ? ` · ${p.description}` : ''}
                  </Text>
                </View>
                <View style={{ alignItems: 'flex-end', gap: 4 }}>
                  <Text style={{ fontSize: 14, fontWeight: '700', color: colors.text }}>
                    ₾{(p.amount ?? 0).toFixed ? (p.amount ?? 0).toFixed(2) : p.amount}
                  </Text>
                  <View style={{ paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4, backgroundColor: (STATUS_COLORS[p.status] ?? colors.textSecondary) + '22' }}>
                    <Text style={{ fontSize: 10, fontWeight: '600', color: STATUS_COLORS[p.status] ?? colors.textSecondary }}>
                      {STATUS_LABELS[p.status] ?? p.status}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}

        {payments.length === 0 && (
          <View style={{ alignItems: 'center', paddingVertical: 32, gap: 8 }}>
            <Text style={{ fontSize: 36 }}>💰</Text>
            <Text style={{ fontSize: 15, color: colors.textSecondary }}>Платежей пока нет</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
