import { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { apiFetch } from '../../lib/api';
import { ErrorState } from '../../components/ErrorState';

const C = { green: '#00AA6C', white: '#FFFFFF', text: '#1A1A1A', muted: '#9E9E9E', border: '#E8E8E8', page: '#F5F5F5', amber: '#F59E0B', error: '#D32F2F' };

const STATUS_COLORS: Record<string, string> = {
  completed: C.green,
  pending: C.amber,
  failed: C.error,
  refunded: C.muted,
};

const STATUS_LABELS: Record<string, string> = {
  completed: 'Оплачено',
  pending: 'Ожидание',
  failed: 'Ошибка',
  refunded: 'Возврат',
};

export default function AdminFinance() {
  const router = useRouter();
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

  if (loading) return <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}><ActivityIndicator color={C.green} /></View>;
  if (error) return <ErrorState message="Не удалось загрузить финансы" onRetry={load} />;

  return (
    <View style={{ flex: 1, backgroundColor: C.page }}>
      {/* Header */}
      <View style={{ backgroundColor: C.white, borderBottomWidth: 1, borderBottomColor: C.border, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 52, paddingBottom: 14, gap: 12 }}>
        <Pressable onPress={() => router.back()}><Text style={{ fontSize: 22 }}>←</Text></Pressable>
        <Text style={{ fontSize: 17, fontWeight: '700' }}>Финансы</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, gap: 16 }}>
        {/* Summary cards */}
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <View style={{ flex: 1, backgroundColor: C.white, borderRadius: 12, padding: 16, borderWidth: 1, borderColor: C.border }}>
            <Text style={{ fontSize: 22, fontWeight: '800', color: C.green }}>₾{stats?.paymentsThisMonth?.sum ?? 0}</Text>
            <Text style={{ fontSize: 12, color: C.muted, marginTop: 4 }}>Выручка за месяц</Text>
          </View>
          <View style={{ flex: 1, backgroundColor: C.white, borderRadius: 12, padding: 16, borderWidth: 1, borderColor: C.border }}>
            <Text style={{ fontSize: 22, fontWeight: '800', color: C.text }}>{stats?.paymentsThisMonth?.count ?? 0}</Text>
            <Text style={{ fontSize: 12, color: C.muted, marginTop: 4 }}>Платежей за месяц</Text>
          </View>
        </View>

        <View style={{ backgroundColor: C.white, borderRadius: 12, padding: 16, borderWidth: 1, borderColor: C.border }}>
          <Text style={{ fontSize: 22, fontWeight: '800', color: C.text }}>₾{totalRevenue.toFixed(2)}</Text>
          <Text style={{ fontSize: 12, color: C.muted, marginTop: 4 }}>Всего выручки (последние {payments.length} платежей)</Text>
        </View>

        {/* Payments list */}
        {payments.length > 0 && (
          <View style={{ backgroundColor: C.white, borderRadius: 12, borderWidth: 1, borderColor: C.border, overflow: 'hidden' }}>
            <Text style={{ fontSize: 14, fontWeight: '700', color: C.text, padding: 16, borderBottomWidth: 1, borderBottomColor: C.border }}>
              Последние платежи
            </Text>
            {payments.map((p, i) => (
              <View
                key={p.id ?? i}
                style={{ padding: 14, borderBottomWidth: i < payments.length - 1 ? 1 : 0, borderBottomColor: C.border, flexDirection: 'row', alignItems: 'center', gap: 12 }}
              >
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 13, fontWeight: '600', color: C.text }}>
                    {p.user?.name ?? p.user?.email ?? 'Пользователь'}
                  </Text>
                  <Text style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>
                    {p.createdAt ? new Date(p.createdAt).toLocaleString('ru-RU') : ''}
                    {p.description ? ` · ${p.description}` : ''}
                  </Text>
                </View>
                <View style={{ alignItems: 'flex-end', gap: 4 }}>
                  <Text style={{ fontSize: 14, fontWeight: '700', color: C.text }}>
                    ₾{(p.amount ?? 0).toFixed ? (p.amount ?? 0).toFixed(2) : p.amount}
                  </Text>
                  <View style={{ paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4, backgroundColor: (STATUS_COLORS[p.status] ?? C.muted) + '22' }}>
                    <Text style={{ fontSize: 10, fontWeight: '600', color: STATUS_COLORS[p.status] ?? C.muted }}>
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
            <Text style={{ fontSize: 15, color: C.muted }}>Платежей пока нет</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
