import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, TextInput, useWindowDimensions } from 'react-native';
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
  city?: { nameRu: string; nameEn: string; nameKa: string };
  category?: { name: string };
  user?: { id: string; name: string | null; email: string };
}

export default function AdminModeration() {
  const { t, i18n } = useTranslation();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;
  const [listings, setListings] = useState<ListingItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
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

  const selectedListing = selectedId ? listings.find((l) => l.id === selectedId) ?? null : null;

  const renderListingCard = (listing: ListingItem) => (
    <TouchableOpacity
      key={listing.id}
      onPress={() => isDesktop ? setSelectedId(listing.id === selectedId ? null : listing.id) : undefined}
      activeOpacity={isDesktop ? 0.7 : 1}
      className={`bg-surface-card border rounded-lg p-4 ${isDesktop && selectedId === listing.id ? 'border-primary' : 'border-border'}`}
    >
      {/* Header */}
      <View className="flex-row justify-between items-start mb-2">
        <View className="flex-1 mr-3">
          <Text className="text-text-primary text-base font-bold" numberOfLines={2}>
            {listing.title}
          </Text>
          <Text className="text-text-muted text-xs mt-1">
            {listing.category?.name} | {listing.city ? (i18n.language === 'en' ? (listing.city.nameEn || listing.city.nameRu) : i18n.language === 'ka' ? (listing.city.nameKa || listing.city.nameRu) : listing.city.nameRu) : ''} | {formatDate(listing.createdAt)}
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

      {/* Description — full on desktop detail, truncated on list */}
      {listing.description && (
        <Text className="text-text-secondary text-sm mb-2" numberOfLines={isDesktop ? 1 : 3}>
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

      {/* Actions — always show on mobile; on desktop show only for selected */}
      {listing.status === 'pending_moderation' && (!isDesktop) && (
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

      {/* Reject reason input — mobile only */}
      {!isDesktop && rejectId === listing.id && (
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
    </TouchableOpacity>
  );

  if (isDesktop) {
    return (
      <View style={{ flex: 1, flexDirection: 'row' }}>
        {/* Left: list */}
        <ScrollView style={{ flex: 1, borderRightWidth: 1, borderColor: '#333' }} contentContainerStyle={{ padding: 16, gap: 12 }}>
          <Text className="text-text-muted text-xs mb-2">{t('totalListings')}: {total}</Text>
          {listings.map(renderListingCard)}
          {total > 20 && (
            <View className="flex-row justify-center gap-3 py-4">
              <TouchableOpacity
                className={`px-4 py-2 rounded-lg ${page > 1 ? 'bg-primary' : 'bg-surface'}`}
                onPress={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
              >
                <Ionicons name="chevron-back" size={18} color={page > 1 ? colors.white : colors.textMuted} />
              </TouchableOpacity>
              <Text className="text-text-secondary self-center text-sm">
                {page} / {Math.ceil(total / 20)}
              </Text>
              <TouchableOpacity
                className={`px-4 py-2 rounded-lg ${page < Math.ceil(total / 20) ? 'bg-primary' : 'bg-surface'}`}
                onPress={() => setPage((p) => p + 1)}
                disabled={page >= Math.ceil(total / 20)}
              >
                <Ionicons name="chevron-forward" size={18} color={page < Math.ceil(total / 20) ? colors.white : colors.textMuted} />
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>

        {/* Right: detail */}
        <ScrollView style={{ flex: 1.5 }} contentContainerStyle={{ padding: 24 }}>
          {selectedListing ? (
            <View className="bg-surface-card border border-border rounded-lg p-6 gap-4">
              <Text className="text-text-primary text-xl font-bold">{selectedListing.title}</Text>
              <Text className="text-text-muted text-xs">
                {selectedListing.category?.name} | {selectedListing.city ? (i18n.language === 'en' ? (selectedListing.city.nameEn || selectedListing.city.nameRu) : i18n.language === 'ka' ? (selectedListing.city.nameKa || selectedListing.city.nameRu) : selectedListing.city.nameRu) : ''} | {formatDate(selectedListing.createdAt)}
              </Text>
              {selectedListing.description && (
                <Text className="text-text-secondary text-sm leading-5">{selectedListing.description}</Text>
              )}
              <View className="flex-row justify-between items-center">
                <Text className="text-primary text-lg font-bold">
                  {selectedListing.price != null ? `${selectedListing.price} ${selectedListing.currency}` : t('negotiable')}
                </Text>
                <Text className="text-text-muted text-sm">
                  {selectedListing.user?.name || selectedListing.user?.email || '—'}
                </Text>
              </View>
              {selectedListing.status === 'pending_moderation' && (
                <View style={{ gap: 12 }}>
                  <View className="flex-row gap-3">
                    <TouchableOpacity
                      className="flex-1 bg-success/20 border border-success/40 py-3 rounded-lg items-center"
                      onPress={() => handleApprove(selectedListing.id)}
                      disabled={actionLoading === selectedListing.id}
                    >
                      {actionLoading === selectedListing.id ? (
                        <ActivityIndicator size="small" color={colors.statusSuccess} />
                      ) : (
                        <Text className="text-success text-sm font-semibold">{t('approve')}</Text>
                      )}
                    </TouchableOpacity>
                    <TouchableOpacity
                      className="flex-1 bg-error/20 border border-error/40 py-3 rounded-lg items-center"
                      onPress={() => {
                        if (rejectId === selectedListing.id) {
                          setRejectId(null);
                        } else {
                          setRejectId(selectedListing.id);
                          setRejectReason('');
                        }
                      }}
                      disabled={actionLoading === selectedListing.id}
                    >
                      <Text className="text-error text-sm font-semibold">{t('reject')}</Text>
                    </TouchableOpacity>
                  </View>
                  {rejectId === selectedListing.id && (
                    <View style={{ gap: 8 }}>
                      <TextInput
                        className="bg-surface border border-border rounded-lg px-3 py-2 text-text-primary text-sm"
                        placeholder={t('rejectReason')}
                        placeholderTextColor={colors.textMuted}
                        value={rejectReason}
                        onChangeText={setRejectReason}
                      />
                      <TouchableOpacity
                        className="bg-error py-2.5 rounded-lg items-center"
                        onPress={() => handleReject(selectedListing.id)}
                        disabled={!rejectReason.trim() || actionLoading === selectedListing.id}
                      >
                        {actionLoading === selectedListing.id ? (
                          <ActivityIndicator size="small" color={colors.white} />
                        ) : (
                          <Text className="text-white text-sm font-semibold">{t('reject')}</Text>
                        )}
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              )}
            </View>
          ) : (
            <View className="flex-1 items-center justify-center py-20">
              <Text className="text-text-muted text-sm">{t('selectListingToReview') || 'Select a listing to review'}</Text>
            </View>
          )}
        </ScrollView>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1" contentContainerStyle={{ padding: 16, gap: 12 }}>
      <Text className="text-text-muted text-xs mb-2">
        {t('totalListings')}: {total}
      </Text>

      {listings.map(renderListingCard)}

      {/* Pagination */}
      {total > 20 && (
        <View className="flex-row justify-center gap-3 py-4">
          <TouchableOpacity
            className={`px-4 py-2 rounded-lg ${page > 1 ? 'bg-primary' : 'bg-surface'}`}
            onPress={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
          >
            <Ionicons name="chevron-back" size={18} color={page > 1 ? colors.white : colors.textMuted} />
          </TouchableOpacity>
          <Text className="text-text-secondary self-center text-sm">
            {page} / {Math.ceil(total / 20)}
          </Text>
          <TouchableOpacity
            className={`px-4 py-2 rounded-lg ${page < Math.ceil(total / 20) ? 'bg-primary' : 'bg-surface'}`}
            onPress={() => setPage((p) => p + 1)}
            disabled={page >= Math.ceil(total / 20)}
          >
            <Ionicons name="chevron-forward" size={18} color={page < Math.ceil(total / 20) ? colors.white : colors.textMuted} />
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}
