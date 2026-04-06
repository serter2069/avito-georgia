import { View, Text, FlatList, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { io, Socket } from 'socket.io-client';
import { api, getAccessToken } from '../../../lib/api';
import { useAuthStore } from '../../../stores/authStore';
import { colors } from '../../../lib/colors';
import { Ionicons } from '@expo/vector-icons';

interface MessageSender {
  id: string;
  name: string | null;
  avatarUrl: string | null;
}

interface ChatMessage {
  id: string;
  text: string;
  createdAt: string;
  senderId: string;
  sender: MessageSender;
}

interface MessagesResponse {
  messages: ChatMessage[];
  nextCursor: string | null;
}

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'https://avito-georgia.smartlaunchhub.com/api';
// Socket connects to the server root, not the /api path
const SOCKET_URL = API_URL.replace(/\/api\/?$/, '');

export default function ChatScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { threadId } = useLocalSearchParams<{ threadId: string }>();
  const currentUser = useAuthStore((s) => s.user);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [inputText, setInputText] = useState('');
  const [sending, setSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | null>(null);

  const socketRef = useRef<Socket | null>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const flatListRef = useRef<FlatList>(null);

  // Load messages via REST
  const loadMessages = useCallback(async (cursor?: string) => {
    const params = cursor ? `?cursor=${cursor}&limit=50` : '?limit=50';
    const res = await api.get<MessagesResponse>(`/threads/${threadId}/messages${params}`);
    if (res.ok && res.data) {
      if (cursor) {
        // Loading older messages — append at end (since FlatList is inverted)
        setMessages((prev) => [...prev, ...res.data!.messages]);
      } else {
        // Messages come newest-first from API, keep that order for inverted FlatList
        setMessages(res.data.messages);
      }
      setNextCursor(res.data.nextCursor);
    }
  }, [threadId]);

  // Setup socket
  useEffect(() => {
    let socket: Socket;

    const connectSocket = async () => {
      const token = await getAccessToken();
      if (!token) return;

      socket = io(SOCKET_URL, {
        auth: { token },
        transports: ['websocket', 'polling'],
      });

      socket.on('connect', () => {
        socket.emit('join_thread', threadId);
      });

      socket.on('message_received', (msg: ChatMessage) => {
        setMessages((prev) => {
          // Avoid duplicates
          if (prev.some((m) => m.id === msg.id)) return prev;
          return [msg, ...prev];
        });
      });

      socket.on('typing', (data: { threadId: string; userId: string }) => {
        if (data.userId !== currentUser?.id) {
          setIsTyping(true);
          if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
          typingTimeoutRef.current = setTimeout(() => setIsTyping(false), 3000);
        }
      });

      socket.on('connect_error', (err) => {
        console.warn('Socket connection error:', err.message);
      });

      socketRef.current = socket;
    };

    connectSocket();

    return () => {
      if (socketRef.current) {
        socketRef.current.emit('leave_thread', threadId);
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, [threadId, currentUser?.id]);

  // Initial message load + mark thread as seen
  useEffect(() => {
    setLoading(true);
    loadMessages().finally(() => setLoading(false));
    // Mark thread as seen on open
    if (threadId) {
      api.post(`/threads/${threadId}/seen`, {});
    }
  }, [loadMessages, threadId]);

  const handleSend = async () => {
    const text = inputText.trim();
    if (!text || sending) return;

    if (!socketRef.current?.connected) {
      // Keep input text so user can retry — never silently lose the message
      Alert.alert(
        t('chat.errorTitle', 'No connection'),
        t('chat.errorSocketDisconnected', 'Message not sent: no connection to server. Please try again.'),
      );
      return;
    }

    setSending(true);
    setInputText('');
    socketRef.current.emit('send_message', { threadId, text });
    setSending(false);
  };

  const handleTyping = () => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('typing', { threadId });
    }
  };

  const handleLoadMore = () => {
    if (nextCursor) {
      loadMessages(nextCursor);
    }
  };

  const renderMessage = ({ item }: { item: ChatMessage }) => {
    const isMe = item.senderId === currentUser?.id;
    return (
      <View className={`px-4 py-1 ${isMe ? 'items-end' : 'items-start'}`}>
        <View
          className={`max-w-[80%] px-3 py-2 rounded-xl ${
            isMe ? 'bg-primary rounded-br-sm' : 'bg-surface-card rounded-bl-sm'
          }`}
        >
          <Text className={`text-base ${isMe ? 'text-white' : 'text-text-primary'}`}>
            {item.text}
          </Text>
          <Text className={`text-xs mt-1 ${isMe ? 'text-white/60' : 'text-text-muted'}`}>
            {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-dark"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
    >
      {/* Header */}
      <View className="bg-dark-secondary border-b border-border px-4 py-3 flex-row items-center">
        <TouchableOpacity onPress={() => router.back()} className="mr-3 pr-1 flex-row items-center gap-1">
          <Ionicons name="arrow-back" size={20} color={colors.brandPrimary} />
          <Text className="text-primary text-base font-semibold">{t('back')}</Text>
        </TouchableOpacity>
        <Text className="text-text-primary text-lg font-bold flex-1" numberOfLines={1}>
          {t('messages')}
        </Text>
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={colors.brandPrimary} />
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          inverted
          contentContainerStyle={{ paddingVertical: 8 }}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.3}
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center py-12">
              <Text className="text-text-muted text-sm">{t('noMessages')}</Text>
            </View>
          }
        />
      )}

      {/* Typing indicator */}
      {isTyping && (
        <View className="px-4 py-1">
          <Text className="text-text-muted text-xs italic">{t('typing')}</Text>
        </View>
      )}

      {/* Input bar */}
      <View className="border-t border-border bg-dark-secondary px-3 py-2 flex-row items-end gap-2">
        <TextInput
          className="flex-1 bg-surface border border-border rounded-xl px-4 py-2.5 text-text-primary text-base max-h-24"
          placeholder={t('typeMessage')}
          placeholderTextColor={colors.textMuted}
          value={inputText}
          onChangeText={(text) => {
            setInputText(text);
            handleTyping();
          }}
          multiline
          returnKeyType="default"
        />
        <TouchableOpacity
          className={`w-10 h-10 rounded-full items-center justify-center ${
            inputText.trim() ? 'bg-primary' : 'bg-surface'
          }`}
          onPress={handleSend}
          disabled={!inputText.trim() || sending}
        >
          <Ionicons name="arrow-up" size={20} color={inputText.trim() ? colors.white : colors.textMuted} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
