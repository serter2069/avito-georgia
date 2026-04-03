import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, TextInput, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useState, useEffect, useCallback } from 'react';
import { api } from '../../lib/api';
import { colors } from '../../lib/colors';
import { Ionicons } from '@expo/vector-icons';

interface ListingItem {
  id: string;
  title: string;
  description: string | null;
  price: number | null;
  currency: string;
  status: string;
  createdAt: string;
  views: number;
  photos?: { url: string }[];
  city?: { nameRu: string };
  category?: { name: string };
  user?: { id: string; name: string | null; email: string };
}

export default function AdminModeration() {
  const { t } = useTranslation();
  const [listings, setListings] = useState<ListingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [rejectId, setRejectId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchListings = useCallback(async (p: number) => {
    setLoading(true);
    const res = await api.get<{ listings: ListingItem[]; total: number }>(
      `/admin/listings/pending?limit=20&page=${p}`
    );
    if (res.ok && res.data) {
      setListings(res.data.listings);
      setTotal(res.data.total);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchListings(page);
  }, [page, fetchListings]);

  const handleApprove = async (id: string) => {
    setActionLoading(id);
    await api.patch(`/admin/listings/${id}/status`, { status: 'active' });
    setListings((prev) => prev.map((l) => (l.id === id ? { ...l, status: 'active' } : l)));
    setActionLoading(null);
  };

  const handleReject = async (id: string) => {
    if (!rejectReason.trim()) return;
    setActionLoading(id);
    await api.patch(`/admin/listings/${id}/status`, { status: 'rejected', rejectReason: rejectReason.trim() });
    setListings((prev) => prev.map((l) => (l.id === id ? { ...l, status: 'rejected' } : l)));
    setRejectId(null);
    setRejectReason('');
    setActionLoading(null);
  };

  const formatDate = (iso: string) => new Date(iso).toLocaleDateString();

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color={colors.brandPrimary} />
      </View>
    );
  }

  return (
    <ScrollView className="flex-1" contentContainerClassName="p-4 gap-3">
      <Text className="text-text-muted text-xs mb-2">
        {t('totalListings')}: {total}
      </Text>

      {listings.map((listing) => (
        <View key={listing.id} className="bg-surface-card border border-border rounded-lg p-4">
          {/* Header */}
          <View className="flex-row justify-between items-start mb-2">
            <View className="flex-1 mr-3">
              <Text className="text-text-primary text-base font-bold" numberOfLines={2}>
                {listing.title}
              </Text>
              <Text className="text-text-muted text-xs mt-1">
                {listing.category?.name} | {listing.city?.nameRu} | {formatDate(listing.createdAt)}
              </Text>
            </View>
            <View className={`px-2 py-1 rounded ${
              listing.status === 'active' ? 'bg-success/20' :
              listing.status === 'removed' ? 'bg-error/20' : 'bg-warning/20'
            }`}>
              <Text className={`text-xs font-medium ${
                listing.status === 'active' ? 'text-success' :
                listing.status === 'removed' ? 'text-error' : 'text-warning'
              }`}>
                {listing.status}
              </Text>
            </View>
          </View>

          {/* Description */}
          {listing.description && (
            <Text className="text-text-secondary text-sm mb-2" numberOfLines={3}>
              {listing.description}
            </Text>
          )}

          {/* Price + seller */}
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-primary text-base font-bold">
              {listing.price != null ? `${listing.price} ${listing.currency}` : t('negotiable')}
            </Text>
            <Text className="text-text-muted text-xs">
              {listing.user?.name || listing.user?.email || '—'}
            </Text>
          </View>

          {/* Actions */}
          {listing.status === 'pending_moderation' && (
            <View className="flex-row gap-2">
              <TouchableOpacity
                className="flex-1 bg-success/20 border border-success/40 py-2 rounded-lg items-center"
                onPress={() => handleApprove(listing.id)}
                disabled={actionLoading === listing.id}
              >
                {actionLoading === listing.id ? (
                  <ActivityIndicator size="small" color={colors.statusSuccess} />
                ) : (
                  <Text className="text-success text-sm font-medium">{t('approve')}</Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1 bg-error/20 border border-error/40 py-2 rounded-lg items-center"
                onPress={() => {
                  if (rejectId === listing.id) {
                    setRejectId(null);
                  } else {
                    setRejectId(listing.id);
                    setRejectReason('');
                  }
                }}
                disabled={actionLoading === listing.id}
              >
                <Text className="text-error text-sm font-medium">{t('reject')}</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Reject reason input */}
          {rejectId === listing.id && (
            <View className="mt-2 gap-2">
              <TextInput
                className="bg-surface border border-border rounded-lg px-3 py-2 text-text-primary text-sm"
                placeholder={t('rejectReason')}
                placeholderTextColor={colors.textMuted}
                value={rejectReason}
                onChangeText={setRejectReason}
              />
              <TouchableOpacity
                className="bg-error py-2 rounded-lg items-center"
                onPress={() => handleReject(listing.id)}
                disabled={!rejectReason.trim() || actionLoading === listing.id}
              >
                {actionLoading === listing.id ? (
                  <ActivityIndicator size="small" color={colors.white} />
                ) : (
                  <Text className="text-white text-sm font-medium">{t('reject')}</Text>
                )}
              </TouchableOpacity>
            </View>
          )}
        </View>
      ))}

      {/* Pagination */}
      {total > 20 && (
        <View className="flex-row justify-center gap-3 py-4">
          <TouchableOpacity
            className={`px-4 py-2 rounded-lg ${page > 1 ? 'bg-primary' : 'bg-surface'}`}
            onPress={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
          >
            <Ionicons name="chevron-back" size={18} color={page > 1 ? '#ffffff' : colors.textMuted} />
          </TouchableOpacity>
          <Text className="text-text-secondary self-center text-sm">
            {page} / {Math.ceil(total / 20)}
          </Text>
          <TouchableOpacity
            className={`px-4 py-2 rounded-lg ${page < Math.ceil(total / 20) ? 'bg-primary' : 'bg-surface'}`}
            onPress={() => setPage((p) => p + 1)}
            disabled={page >= Math.ceil(total / 20)}
          >
            <Ionicons name="chevron-forward" size={18} color={page < Math.ceil(total / 20) ? '#ffffff' : colors.textMuted} />
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}
