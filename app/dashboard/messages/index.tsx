import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, AppState } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter, useFocusEffect } from 'expo-router';
import { api } from '../../../lib/api';
import { colors } from '../../../lib/colors';
import { Ionicons } from '@expo/vector-icons';

interface ThreadUser {
  id: string;
  name: string | null;
  avatarUrl: string | null;
}

interface ThreadListing {
  id: string;
  title: string;
  price: number | null;
  currency: string;
  photos: { url: string }[];
}

interface ThreadMessage {
  id: string;
  text: string;
  createdAt: string;
  senderId: string;
}

interface Thread {
  id: string;
  listing: ThreadListing | null;
  otherUser: ThreadUser | null;
  lastMessage: ThreadMessage | null;
  updatedAt: string;
  unreadCount: number;
}

function getInitials(name: string | null | undefined): string {
  if (!name) return '?';
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function formatTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  if (diffDays === 1) return '1d';
  if (diffDays < 7) return `${diffDays}d`;
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

export default function ThreadListScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const [threads, setThreads] = useState<Thread[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const appStateRef = useRef(AppState.currentState);

  const fetchThreads = useCallback(async () => {
    setError(null);
    const res = await api.get<Thread[]>('/threads');
    if (res.ok && res.data) {
      setThreads(res.data);
    } else {
      setError(res.error || 'Failed to load');
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchThreads().finally(() => setLoading(false));
  }, [fetchThreads]);

  // Re-fetch when screen is focused (coming back from a thread)
  useFocusEffect(
    useCallback(() => {
      fetchThreads();
    }, [fetchThreads])
  );

  // Re-fetch when app comes to foreground
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextState) => {
      if (appStateRef.current.match(/inactive|background/) && nextState === 'active') {
        fetchThreads();
      }
      appStateRef.current = nextState;
    });
    return () => subscription.remove();
  }, [fetchThreads]);

  const handleThreadPress = (threadId: string) => {
    router.push(`/dashboard/messages/${threadId}`);
  };

  const renderThread = ({ item }: { item: Thread }) => {
    const hasUnread = item.unreadCount > 0;
    return (
      <TouchableOpacity
        className="flex-row items-center px-4 py-3 border-b border-border"
        onPress={() => handleThreadPress(item.id)}
        activeOpacity={0.7}
      >
        {/* Avatar */}
        <View className="w-12 h-12 rounded-full bg-primary/20 items-center justify-center mr-3">
          <Text className="text-primary font-bold text-base">
            {getInitials(item.otherUser?.name)}
          </Text>
        </View>

        {/* Content */}
        <View className="flex-1 min-w-0">
          <View className="flex-row items-center justify-between mb-1">
            <Text
              className={`text-base flex-1 mr-2 ${hasUnread ? 'text-text-primary font-bold' : 'text-text-primary font-semibold'}`}
              numberOfLines={1}
            >
              {item.otherUser?.name || item.listing?.title || '\u2014'}
            </Text>
            <View className="flex-row items-center gap-2">
              {item.lastMessage && (
                <Text className="text-text-muted text-xs">
                  {formatTime(item.lastMessage.createdAt)}
                </Text>
              )}
              {hasUnread && (
                <View className="bg-red-500 rounded-full min-w-[20px] h-5 items-center justify-center px-1.5">
                  <Text className="text-white text-xs font-bold leading-none">
                    {item.unreadCount > 99 ? '99+' : item.unreadCount}
                  </Text>
                </View>
              )}
            </View>
          </View>
          {item.listing && (
            <Text className="text-text-secondary text-sm" numberOfLines={1}>
              {item.listing.title}
            </Text>
          )}
          {item.lastMessage && (
            <Text
              className={`text-xs mt-0.5 ${hasUnread ? 'text-text-primary font-medium' : 'text-text-muted'}`}
              numberOfLines={1}
            >
              {item.lastMessage.text}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View className="flex-1 bg-dark">
      {/* Header */}
      <View className="bg-dark-secondary border-b border-border px-4 py-3">
        <Text className="text-text-primary text-lg font-bold">{t('messages')}</Text>
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={colors.brandPrimary} />
          <Text className="text-text-muted mt-2 text-sm">{t('loading')}</Text>
        </View>
      ) : error ? (
        <View className="flex-1 items-center justify-center px-4">
          <Text className="text-error text-base mb-3">{error}</Text>
          <TouchableOpacity
            className="bg-primary px-4 py-2 rounded-lg"
            onPress={() => {
              setLoading(true);
              fetchThreads().finally(() => setLoading(false));
            }}
          >
            <Text className="text-white font-semibold">{t('retry')}</Text>
          </TouchableOpacity>
        </View>
      ) : threads.length === 0 ? (
        <View className="flex-1 items-center justify-center px-4">
          <Ionicons name="mail-outline" size={48} color={colors.textMuted} style={{ marginBottom: 12 }} />
          <Text className="text-text-primary text-base font-semibold">{t('noMessages')}</Text>
          <Text className="text-text-muted text-sm mt-1">{t('noMessagesHint')}</Text>
        </View>
      ) : (
        <FlatList
          data={threads}
          keyExtractor={(item) => item.id}
          renderItem={renderThread}
        />
      )}
    </View>
  );
}
