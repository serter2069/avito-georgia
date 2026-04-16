import { useState, useEffect, useCallback } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import MessagesList from '../../../components/screens/MessagesList';
import { ErrorState } from '../../../components/ErrorState';
import { EmptyState } from '../../../components/EmptyState';
import { apiFetch } from '../../../lib/api';

export default function MessagesPage() {
  const router = useRouter();
  const [threads, setThreads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const r = await apiFetch('/chat/threads');
      setThreads(Array.isArray(r) ? r : []);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  if (loading) return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <ActivityIndicator />
    </View>
  );
  if (error) return <ErrorState message="Не удалось загрузить чаты" onRetry={load} />;
  if (threads.length === 0) return (
    <EmptyState
      icon="chatbubbles-outline"
      title="Нет сообщений"
      subtitle="Напишите продавцу о понравившемся объявлении"
      ctaLabel="Перейти к объявлениям"
      onCta={() => router.push('/' as any)}
    />
  );
  return <MessagesList showHeader={false} showBottomNav={false} threads={threads} />;
}
