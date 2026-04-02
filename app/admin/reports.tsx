import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useState, useEffect, useCallback } from 'react';
import { api } from '../../lib/api';

interface ReportItem {
  id: string;
  reason: string;
  description: string | null;
  status: string;
  createdAt: string;
  reporter?: { id: string; name: string | null; email: string };
  listing?: { id: string; title: string } | null;
  targetUser?: { id: string; name: string | null; email: string } | null;
}

const STATUS_STYLES: Record<string, { bg: string; text: string }> = {
  pending: { bg: 'bg-warning/20', text: 'text-warning' },
  resolved: { bg: 'bg-success/20', text: 'text-success' },
  dismissed: { bg: 'bg-text-muted/20', text: 'text-text-muted' },
};

export default function AdminReports() {
  const { t } = useTranslation();
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchReports = useCallback(async (p: number, status: string) => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(p), limit: '20' });
    if (status) params.set('status', status);
    const res = await api.get<{ reports: ReportItem[]; total: number }>(
      `/reports/admin?${params.toString()}`
    );
    if (res.ok && res.data) {
      setReports(res.data.reports);
      setTotal(res.data.total);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchReports(page, statusFilter);
  }, [page, statusFilter, fetchReports]);

  const updateStatus = async (id: string, status: string) => {
    setActionLoading(id);
    const res = await api.patch(`/admin/reports/${id}/status`, { status });
    if (res.ok) {
      setReports((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    }
    setActionLoading(null);
  };

  const formatDate = (iso: string) => new Date(iso).toLocaleDateString();

  const FILTERS = [
    { key: '', label: t('all') },
    { key: 'pending', label: t('pending') },
    { key: 'resolved', label: t('resolved') },
    { key: 'dismissed', label: t('dismissed') },
  ];

  return (
    <View className="flex-1">
      {/* Status filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="border-b border-border"
        contentContainerClassName="px-4 py-2 gap-2"
      >
        {FILTERS.map((f) => (
          <TouchableOpacity
            key={f.key}
            className={`px-3 py-1.5 rounded-full ${statusFilter === f.key ? 'bg-primary' : 'bg-surface'}`}
            onPress={() => {
              setStatusFilter(f.key);
              setPage(1);
            }}
          >
            <Text className={`text-xs font-medium ${statusFilter === f.key ? 'text-white' : 'text-text-secondary'}`}>
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#6366f1" />
        </View>
      ) : (
        <ScrollView className="flex-1" contentContainerClassName="p-4 gap-3">
          <Text className="text-text-muted text-xs mb-1">
            {t('adminReports')}: {total}
          </Text>

          {reports.length === 0 ? (
            <Text className="text-text-muted text-sm text-center py-8">{t('noReports')}</Text>
          ) : (
            reports.map((r) => {
              const style = STATUS_STYLES[r.status] || STATUS_STYLES.pending;
              return (
                <View key={r.id} className="bg-surface-card border border-border rounded-lg p-4">
                  <View className="flex-row justify-between items-start mb-2">
                    <View className="flex-1 mr-3">
                      <Text className="text-text-primary text-sm font-bold">{r.reason}</Text>
                      {r.description && (
                        <Text className="text-text-secondary text-xs mt-1" numberOfLines={2}>
                          {r.description}
                        </Text>
                      )}
                    </View>
                    <View className={`px-2 py-0.5 rounded ${style.bg}`}>
                      <Text className={`text-xs font-medium ${style.text}`}>{t(r.status)}</Text>
                    </View>
                  </View>

                  {/* Reporter and target */}
                  <View className="mb-2">
                    <Text className="text-text-muted text-xs">
                      {t('reporter')}: {r.reporter?.name || r.reporter?.email || '—'}
                    </Text>
                    <Text className="text-text-muted text-xs">
                      {t('target')}: {r.listing?.title || r.targetUser?.email || '—'}
                    </Text>
                    <Text className="text-text-muted text-xs">
                      {t('date')}: {formatDate(r.createdAt)}
                    </Text>
                  </View>

                  {/* Actions */}
                  {r.status === 'pending' && (
                    <View className="flex-row gap-2">
                      <TouchableOpacity
                        className="flex-1 bg-success/20 border border-success/40 py-2 rounded-lg items-center"
                        onPress={() => updateStatus(r.id, 'resolved')}
                        disabled={actionLoading === r.id}
                      >
                        {actionLoading === r.id ? (
                          <ActivityIndicator size="small" color="#4CAF50" />
                        ) : (
                          <Text className="text-success text-sm font-medium">{t('resolve')}</Text>
                        )}
                      </TouchableOpacity>
                      <TouchableOpacity
                        className="flex-1 bg-surface border border-border py-2 rounded-lg items-center"
                        onPress={() => updateStatus(r.id, 'dismissed')}
                        disabled={actionLoading === r.id}
                      >
                        <Text className="text-text-muted text-sm font-medium">{t('dismiss')}</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              );
            })
          )}

          {/* Pagination */}
          {total > 20 && (
            <View className="flex-row justify-center gap-3 py-4">
              <TouchableOpacity
                className={`px-4 py-2 rounded-lg ${page > 1 ? 'bg-primary' : 'bg-surface'}`}
                onPress={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
              >
                <Text className={page > 1 ? 'text-white' : 'text-text-muted'}>&larr;</Text>
              </TouchableOpacity>
              <Text className="text-text-secondary self-center text-sm">
                {page} / {Math.ceil(total / 20)}
              </Text>
              <TouchableOpacity
                className={`px-4 py-2 rounded-lg ${page < Math.ceil(total / 20) ? 'bg-primary' : 'bg-surface'}`}
                onPress={() => setPage((p) => p + 1)}
                disabled={page >= Math.ceil(total / 20)}
              >
                <Text className={page < Math.ceil(total / 20) ? 'text-white' : 'text-text-muted'}>&rarr;</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
}
