import { useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import ChatThread from '../../../components/screens/ChatThread';
import { apiFetch } from '../../../lib/api';
import { useAuthStore } from '../../../store/auth';

export default function ChatThreadPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [messages, setMessages] = useState<any[]>([]);
  const [otherUser, setOtherUser] = useState<{ id: string; name: string; avatarUrl?: string } | undefined>();
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();

  const load = async () => {
    try {
      const [msgRes, threadRes] = await Promise.all([
        apiFetch(`/threads/${id}/messages`),
        apiFetch(`/threads/${id}`),
      ]);
      setMessages(msgRes.messages || []);
      if (threadRes.thread?.otherUser) setOtherUser(threadRes.thread.otherUser);
      // Mark as seen
      apiFetch(`/threads/${id}/seen`, { method: 'POST' }).catch(() => {});
    } catch (e) { console.error('Failed to load chat thread', e); }
    setLoading(false);
  };

  useEffect(() => { if (id) load(); }, [id]);

  const handleSend = async (text: string) => {
    try {
      const r = await apiFetch(`/threads/${id}/message`, {
        method: 'POST',
        body: JSON.stringify({ text }),
      });
      setMessages(prev => [...prev, r.message]);
    } catch (e) { console.error(e); }
  };

  if (loading) return (
    <SafeAreaView edges={['top']} style={{ flex: 1 }}>
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <ActivityIndicator />
    </View>
    </SafeAreaView>
  );
  return <SafeAreaView edges={['top']} style={{ flex: 1 }}><ChatThread messages={messages} currentUserId={user?.id} onSend={handleSend} otherUser={otherUser} /></SafeAreaView>;
}
