import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { api } from '../../lib/api';

interface Stats {
  totalListings: number;
  totalUsers: number;
  pendingReports: number;
  paymentsThisMonth: { count: number; sum: number };
}

interface ReportItem {
  id: string;
  reason: string;
  status: string;
  createdAt: string;
  reporter?: { email: string };
  listing?: { title: string } | null;
  targetUser?: { email: string } | null;
}

interface PaymentItem {
  id: string;
  amount: number;
  currency: string;
  status: string;
  createdAt: string;
  user?: { email: string };
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <View className="bg-surface-card border border-border rounded-lg p-4 flex-1 min-w-[140px]">
      <Text className="text-text-muted text-xs mb-1">{label}</Text>
      <Text className="text-text-primary text-2xl font-bold">{value}</Text>
    </View>
  );
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString();
}

export default function AdminDashboard() {
  const { t } = useTranslation();
  const [stats, setStats] = useState<Stats | null>(null);
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [payments, setPayments] = useState<PaymentItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get<Stats>('/admin/stats'),
      api.get<{ reports: ReportItem[] }>('/reports/admin?limit=5'),
      api.get<{ payments: PaymentItem[] }>('/admin/payments?limit=5'),
    ]).then(([statsRes, reportsRes, paymentsRes]) => {
      if (statsRes.ok && statsRes.data) setStats(statsRes.data);
      if (reportsRes.ok && reportsRes.data) setReports(reportsRes.data.reports);
      if (paymentsRes.ok && paymentsRes.data) setPayments(paymentsRes.data.payments);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );
  }

  return (
    <ScrollView className="flex-1" contentContainerClassName="p-4 gap-4">
      {/* Stats cards */}
      <View className="flex-row flex-wrap gap-3">
        <StatCard label={t('totalListings')} value={stats?.totalListings ?? 0} />
        <StatCard label={t('totalUsers')} value={stats?.totalUsers ?? 0} />
        <StatCard label={t('pendingReports')} value={stats?.pendingReports ?? 0} />
        <StatCard
          label={t('paymentsThisMonth')}
          value={`${stats?.paymentsThisMonth.sum.toFixed(0) ?? 0} GEL`}
        />
      </View>

      {/* Recent reports */}
      <View className="bg-surface-card border border-border rounded-lg p-4">
        <Text className="text-text-primary text-base font-bold mb-3">{t('recentReports')}</Text>
        {reports.length === 0 ? (
          <Text className="text-text-muted text-sm">{t('noReports')}</Text>
        ) : (
          reports.map((r) => (
            <View key={r.id} className="border-b border-border py-2 last:border-b-0">
              <View className="flex-row justify-between items-center mb-1">
                <Text className="text-text-primary text-sm font-medium" numberOfLines={1}>
                  {r.reason}
                </Text>
                <View className={`px-2 py-0.5 rounded ${r.status === 'pending' ? 'bg-warning/20' : 'bg-success/20'}`}>
                  <Text className={`text-xs ${r.status === 'pending' ? 'text-warning' : 'text-success'}`}>
                    {t(r.status)}
                  </Text>
                </View>
              </View>
              <Text className="text-text-muted text-xs">
                {r.reporter?.email ?? '—'} &rarr; {r.listing?.title ?? r.targetUser?.email ?? '—'} | {formatDate(r.createdAt)}
              </Text>
            </View>
          ))
        )}
      </View>

      {/* Recent payments */}
      <View className="bg-surface-card border border-border rounded-lg p-4">
        <Text className="text-text-primary text-base font-bold mb-3">{t('recentPayments')}</Text>
        {payments.length === 0 ? (
          <Text className="text-text-muted text-sm">{t('noPayments')}</Text>
        ) : (
          payments.map((p) => (
            <View key={p.id} className="border-b border-border py-2 last:border-b-0">
              <View className="flex-row justify-between items-center">
                <Text className="text-text-primary text-sm">
                  {p.user?.email ?? '—'}
                </Text>
                <Text className="text-text-primary text-sm font-bold">
                  {p.amount} {p.currency}
                </Text>
              </View>
              <View className="flex-row justify-between items-center mt-1">
                <Text className="text-text-muted text-xs">{formatDate(p.createdAt)}</Text>
                <View className={`px-2 py-0.5 rounded ${p.status === 'completed' ? 'bg-success/20' : p.status === 'failed' ? 'bg-error/20' : 'bg-warning/20'}`}>
                  <Text className={`text-xs ${p.status === 'completed' ? 'text-success' : p.status === 'failed' ? 'text-error' : 'text-warning'}`}>
                    {t(p.status)}
                  </Text>
                </View>
              </View>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}
