import { useState, useEffect } from 'react';
import { View, Text, TextInput, Pressable, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { apiFetch } from '../../../lib/api';

const C = { green: '#00AA6C', white: '#FFFFFF', text: '#1A1A1A', muted: '#9E9E9E', border: '#E8E8E8', error: '#D32F2F', page: '#F5F5F5' };

export default function ContactSellerPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [listing, setListing] = useState<any>(null);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    apiFetch(`/listings/${id}`).then(r => setListing(r.listing)).catch(() => {});
  }, [id]);

  const handleSend = async () => {
    if (!message.trim() || !id) return;
    setSending(true);
    setError('');
    try {
      const r = await apiFetch(`/chat/threads/${id}/message`, {
        method: 'POST',
        body: JSON.stringify({ text: message.trim() }),
      });
      router.replace(`/dashboard/messages/${r.threadId}` as any);
    } catch (e: any) {
      setError(e?.message || 'Не удалось отправить сообщение');
      setSending(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: C.page }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      {/* Header */}
      <View style={{ backgroundColor: C.white, borderBottomWidth: 1, borderBottomColor: C.border, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12 }}>
        <Pressable onPress={() => router.back()} style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Text style={{ fontSize: 20, color: C.text }}>←</Text>
          <Text style={{ fontSize: 15, fontWeight: '500', color: C.text }}>Написать продавцу</Text>
        </Pressable>
      </View>

      <View style={{ flex: 1, padding: 16 }}>
        {/* Listing preview */}
        {listing && (
          <View style={{ backgroundColor: C.white, borderRadius: 10, padding: 14, borderWidth: 1, borderColor: C.border, marginBottom: 16 }}>
            <Text style={{ fontSize: 13, color: C.muted, marginBottom: 4 }}>Объявление</Text>
            <Text style={{ fontSize: 15, fontWeight: '600', color: C.text }} numberOfLines={2}>{listing.title}</Text>
            {listing.price && (
              <Text style={{ fontSize: 16, fontWeight: '700', color: C.green, marginTop: 4 }}>
                {listing.currency === 'GEL' ? '₾' : '$'}{Number(listing.price).toLocaleString('ru-RU')}
              </Text>
            )}
          </View>
        )}

        {/* Message input */}
        <View style={{ backgroundColor: C.white, borderRadius: 10, borderWidth: 1, borderColor: C.border, padding: 12, flex: 1, maxHeight: 200 }}>
          <TextInput
            style={{ flex: 1, fontSize: 15, color: C.text, textAlignVertical: 'top', minHeight: 120 }}
            multiline
            placeholder="Ваше сообщение продавцу..."
            placeholderTextColor={C.muted}
            value={message}
            onChangeText={setMessage}
            autoFocus
          />
        </View>

        {error ? <Text style={{ color: C.error, fontSize: 13, marginTop: 8 }}>{error}</Text> : null}

        <Pressable
          onPress={handleSend}
          disabled={sending || !message.trim()}
          style={{
            marginTop: 16,
            backgroundColor: message.trim() && !sending ? C.green : '#B2DFDB',
            borderRadius: 10,
            paddingVertical: 14,
            alignItems: 'center',
          }}
        >
          {sending
            ? <ActivityIndicator color={C.white} />
            : <Text style={{ color: C.white, fontWeight: '700', fontSize: 15 }}>Отправить сообщение</Text>
          }
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}
