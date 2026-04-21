import { useState, useEffect, useCallback } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import MessagesList from '../../../components/screens/MessagesList';
import { ErrorState } from '../../../components/ErrorState';
import { EmptyState } from '../../../components/EmptyState';
import { SkeletonBox } from '../../../components/SkeletonBox';
import { apiFetch } from '../../../lib/api';

function ChatSkeleton() {
  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      {[0, 1, 2, 3].map(i => (
        <View key={i} style={{ flexDirection: 'row', gap: 12, padding: 16, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' }}>
          <SkeletonBox width={48} height={48} borderRadius={24} />
          <View style={{ flex: 1, gap: 8, justifyContent: 'center' }}>
            <SkeletonBox width="60%" height={14} />
            <SkeletonBox width="85%" height={12} />
          </View>
        </View>
      ))}
    </View>
  );
}

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

  if (loading) return <SafeAreaView edges={['top']} style={{ flex: 1 }}><ChatSkeleton /></SafeAreaView>;
  if (error) return <SafeAreaView edges={['top']} style={{ flex: 1 }}><ErrorState message="Не удалось загрузить чаты" onRetry={load} /></SafeAreaView>;
  if (threads.length === 0) return (
    <SafeAreaView edges={['top']} style={{ flex: 1 }}>
    <EmptyState
      icon="chatbubbles-outline"
      title="Нет сообщений"
      subtitle="Напишите продавцу о понравившемся объявлении"
      ctaLabel="Перейти к объявлениям"
      onCta={() => router.push('/' as any)}
    />
    </SafeAreaView>
  );
  return <SafeAreaView edges={['top']} style={{ flex: 1 }}><MessagesList showHeader={false} showBottomNav={false} threads={threads} /></SafeAreaView>;
}
