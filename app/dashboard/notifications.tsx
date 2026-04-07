import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'expo-router';
import { api } from '../../lib/api';
import { colors } from '../../lib/colors';
import { Ionicons } from '@expo/vector-icons';

// Shapes returned by GET /api/notifications
interface NotificationListing {
  id: string;
  title: string;
  photos: { url: string }[];
}

interface Notification {
  id: string;
  type: string;
  payload: unknown;
  read: boolean;
  createdAt: string;
  listingId: string | null;
  listing: NotificationListing | null;
}

interface NotificationsResponse {
  notifications: Notification[];
  total: number;
  page: number;
  totalPages: number;
}

// Map notification type to Ionicons icon name
function iconForType(type: string): keyof typeof Ionicons.glyphMap {
  switch (type) {
    case 'new_message':
      return 'chatbubble-outline';
    case 'price_drop':
      return 'pricetag-outline';
    case 'moderation_update':
      return 'shield-checkmark-outline';
    default:
      return 'notifications-outline';
  }
}

// Map notification type to icon color
function colorForType(type: string): string {
  switch (type) {
    case 'new_message':
      return colors.brandPrimary;
    case 'price_drop':
      return colors.statusSuccess;
    case 'moderation_update':
      return colors.statusWarning;
    default:
      return colors.textMuted;
  }
}

// Derive a human-readable title from the notification
function getNotifTitle(
  notif: Notification,
  typeFallback: string,
): string {
  const p = notif.payload as Record<string, unknown> | null;
  if (p && typeof p === 'object') {
    const title = p['title'] ?? p['subject'] ?? p['message'];
    if (typeof title === 'string' && title) return title;
  }
  // Fallback: listing title or type label
  if (notif.listing?.title) return notif.listing.title;
  return typeFallback;
}

// Derive a body/subtitle from the notification payload
function getNotifBody(notif: Notification): string | null {
  const p = notif.payload as Record<string, unknown> | null;
  if (p && typeof p === 'object') {
    const body = p['body'] ?? p['text'] ?? p['description'];
    if (typeof body === 'string' && body) return body;
  }
  return null;
}

// Format timestamp: today → time, else short date
function formatTime(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const isToday =
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate();
  if (isToday) {
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  return d.toLocaleDateString([], { day: '2-digit', month: '2-digit' });
}

interface NotifRowProps {
  item: Notification;
  typeLabel: string;
  onPress: (notif: Notification) => void;
}

function NotifRow({ item, typeLabel, onPress }: NotifRowProps) {
  const title = getNotifTitle(item, typeLabel);
  const body = getNotifBody(item);
  const icon = iconForType(item.type);
  const iconColor = colorForType(item.type);

  return (
    <TouchableOpacity
      onPress={() => onPress(item)}
      activeOpacity={0.7}
      style={{
        flexDirection: 'row',
        alignItems: 'flex-start',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: item.read ? 'transparent' : colors.bgBrandSubtle,
        borderBottomWidth: 1,
        borderBottomColor: colors.borderDivider,
      }}
    >
      {/* Icon */}
      <View
        style={{
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: colors.bgSurface,
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: 12,
          flexShrink: 0,
        }}
      >
        <Ionicons name={icon} size={20} color={iconColor} />
      </View>

      {/* Content */}
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 2 }}>
          <Text
            style={{
              flex: 1,
              fontSize: 14,
              fontWeight: item.read ? '400' : '700',
              color: colors.textPrimary,
            }}
            numberOfLines={1}
          >
            {title}
          </Text>
          <Text style={{ fontSize: 11, color: colors.textMuted, marginLeft: 8 }}>
            {formatTime(item.createdAt)}
          </Text>
        </View>
        {body ? (
          <Text
            style={{ fontSize: 13, color: colors.textSecondary, lineHeight: 18 }}
            numberOfLines={2}
          >
            {body}
          </Text>
        ) : null}
      </View>

      {/* Unread dot */}
      {!item.read && (
        <View
          style={{
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: colors.brandPrimary,
            marginLeft: 8,
            marginTop: 6,
            flexShrink: 0,
          }}
        />
      )}
    </TouchableOpacity>
  );
}

export default function NotificationsScreen() {
  const { t } = useTranslation();
  const router = useRouter();

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [markingAll, setMarkingAll] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const typeLabelMap: Record<string, string> = {
    new_message: t('notifTypeNewMessage'),
    price_drop: t('notifTypePriceDrop'),
    moderation_update: t('notifTypeModerationUpdate'),
  };

  const fetchNotifications = useCallback(async (p: number) => {
    const res = await api.get<NotificationsResponse>(`/notifications?page=${p}&limit=20`);
    if (res.ok && res.data) {
      if (p === 1) {
        setNotifications(res.data.notifications);
      } else {
        setNotifications((prev) => [...prev, ...res.data!.notifications]);
      }
      setTotalPages(res.data.totalPages);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchNotifications(1).finally(() => setLoading(false));
  }, [fetchNotifications]);

  const handleLoadMore = () => {
    if (loadingMore || page >= totalPages) return;
    const nextPage = page + 1;
    setPage(nextPage);
    setLoadingMore(true);
    fetchNotifications(nextPage).finally(() => setLoadingMore(false));
  };

  const handleMarkRead = async (notif: Notification) => {
    if (!notif.read) {
      // Optimistic update
      setNotifications((prev) =>
        prev.map((n) => (n.id === notif.id ? { ...n, read: true } : n))
      );
      await api.patch(`/notifications/${notif.id}/read`);
    }
    // Bonus: navigate to related listing if available
    if (notif.listingId) {
      router.push(`/listings/${notif.listingId}`);
    }
  };

  const handleMarkAll = async () => {
    if (markingAll) return;
    const hasUnread = notifications.some((n) => !n.read);
    if (!hasUnread) return;
    setMarkingAll(true);
    // Optimistic update
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    try {
      await api.post('/notifications/read-all');
    } catch {
      // On failure: silently leave optimistic state (non-critical)
    } finally {
      setMarkingAll(false);
    }
  };

  const allRead = notifications.length === 0 || notifications.every((n) => n.read);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bgPrimary }}>
      {/* Header */}
      <View
        style={{
          backgroundColor: colors.bgCard,
          borderBottomWidth: 1,
          borderBottomColor: colors.borderDefault,
          paddingHorizontal: 16,
          paddingVertical: 12,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Text style={{ fontSize: 18, fontWeight: '700', color: colors.textPrimary }}>
          {t('notificationsInbox')}
        </Text>
        {notifications.length > 0 && (
          <TouchableOpacity
            onPress={handleMarkAll}
            disabled={allRead || markingAll}
            activeOpacity={0.7}
          >
            <Text
              style={{
                fontSize: 13,
                color: allRead || markingAll ? colors.textDisabled : colors.brandPrimary,
                fontWeight: '600',
              }}
            >
              {t('markAllRead')}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Body */}
      {loading ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" color={colors.brandPrimary} />
          <Text style={{ color: colors.textMuted, marginTop: 8, fontSize: 14 }}>
            {t('loading')}
          </Text>
        </View>
      ) : notifications.length === 0 ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 }}>
          <Ionicons
            name="notifications-off-outline"
            size={52}
            color={colors.textMuted}
            style={{ marginBottom: 12 }}
          />
          <Text style={{ fontSize: 16, fontWeight: '600', color: colors.textPrimary, marginBottom: 6 }}>
            {t('noNotifications')}
          </Text>
          <Text style={{ fontSize: 14, color: colors.textMuted, textAlign: 'center', lineHeight: 20 }}>
            {t('noNotificationsHint')}
          </Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <NotifRow
              item={item}
              typeLabel={typeLabelMap[item.type] ?? item.type}
              onPress={handleMarkRead}
            />
          )}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.3}
          ListFooterComponent={
            loadingMore ? (
              <View style={{ paddingVertical: 16, alignItems: 'center' }}>
                <ActivityIndicator size="small" color={colors.brandPrimary} />
              </View>
            ) : null
          }
        />
      )}
    </View>
  );
}
