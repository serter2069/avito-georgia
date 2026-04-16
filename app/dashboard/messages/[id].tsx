import { useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import ChatThread from '../../../components/screens/ChatThread';
import { apiFetch } from '../../../lib/api';
import { useAuthStore } from '../../../store/auth';

export default function ChatThreadPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();

  const load = async () => {
    try {
      const r = await apiFetch(`/chat/threads/${id}/messages`);
      setMessages(r.messages || []);
      // Mark as seen
      apiFetch(`/chat/threads/${id}/seen`, { method: 'POST' }).catch(() => {});
    } catch {}
    setLoading(false);
  };

  useEffect(() => { if (id) load(); }, [id]);

  const handleSend = async (text: string) => {
    try {
      const r = await apiFetch(`/chat/threads/${id}/message`, {
        method: 'POST',
        body: JSON.stringify({ text }),
      });
      setMessages(prev => [...prev, r.message]);
    } catch (e) { console.error(e); }
  };

  if (loading) return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <ActivityIndicator />
    </View>
  );
  return <ChatThread messages={messages} currentUserId={user?.id} onSend={handleSend} />;
}
