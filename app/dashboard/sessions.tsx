import { useState, useEffect } from 'react';
import { View, Text, Pressable, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { apiFetch } from '../../lib/api';

const C = {
  green: '#00AA6C', white: '#FFFFFF', text: '#1A1A1A',
  muted: '#9E9E9E', border: '#E8E8E8', page: '#F5F5F5', error: '#D32F2F',
};

export default function SessionsPage() {
  const router = useRouter();
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const r = await apiFetch('/users/me/sessions');
      setSessions(r.sessions || []);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleRevoke = (id: string) => {
    Alert.alert('Завершить сессию', 'Вы уверены?', [
      { text: 'Отмена', style: 'cancel' },
      { text: 'Завершить', style: 'destructive', onPress: async () => {
        await apiFetch('/users/me/sessions/' + id, { method: 'DELETE' });
        setSessions(prev => prev.filter(s => s.id !== id));
      }},
    ]);
  };

  return (
    <View style={{ flex: 1, backgroundColor: C.page }}>
      {/* Header */}
      <View style={{ backgroundColor: C.white, borderBottomWidth: 1, borderBottomColor: C.border, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, gap: 12 }}>
        <Pressable onPress={() => router.back()}>
          <Text style={{ fontSize: 22, color: C.text }}>←</Text>
        </Pressable>
        <Text style={{ fontSize: 17, fontWeight: '700', color: C.text }}>Активные сессии</Text>
      </View>

      {loading ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator color={C.green} />
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ padding: 16, gap: 10 }}>
          {sessions.length === 0 ? (
            <Text style={{ textAlign: 'center', color: C.muted, paddingTop: 40 }}>Нет активных сессий</Text>
          ) : sessions.map((s) => (
            <View key={s.id} style={{ backgroundColor: C.white, borderRadius: 12, padding: 16, borderWidth: 1, borderColor: C.border }}>
              <Text style={{ fontSize: 13, color: C.muted }}>
                Создана: {new Date(s.createdAt).toLocaleDateString('ru-RU')}
              </Text>
              <Text style={{ fontSize: 13, color: C.muted, marginTop: 2 }}>
                Истекает: {new Date(s.expiresAt).toLocaleDateString('ru-RU')}
              </Text>
              <Pressable
                onPress={() => handleRevoke(s.id)}
                style={{ marginTop: 10, alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, borderWidth: 1, borderColor: C.error }}
              >
                <Text style={{ color: C.error, fontSize: 13, fontWeight: '600' }}>Завершить</Text>
              </Pressable>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}
