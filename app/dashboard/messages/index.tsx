import { useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import MessagesList from '../../../components/screens/MessagesList';
import { apiFetch } from '../../../lib/api';

export default function MessagesPage() {
  const [threads, setThreads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch('/chat/threads')
      .then(r => setThreads(Array.isArray(r) ? r : []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <ActivityIndicator />
    </View>
  );
  return <MessagesList showHeader={false} showBottomNav={false} threads={threads} />;
}
