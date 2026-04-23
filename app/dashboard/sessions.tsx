import { useState, useEffect } from 'react';
import { View, Text, Pressable, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { apiFetch } from '../../lib/api';
import { colors } from '../../lib/theme';

export default function SessionsPage() {
  const router = useRouter();
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const r = await apiFetch('/users/me/sessions');
      setSessions(r.sessions || []);
    } catch (e) { console.error('Failed to load sessions', e); }
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
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: colors.surface }}>
      {/* Header */}
      <View style={{ backgroundColor: colors.background, borderBottomWidth: 1, borderBottomColor: colors.border, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, gap: 12 }}>
        <Pressable onPress={() => router.back()} accessibilityLabel="Назад">
          <Text style={{ fontSize: 22, color: colors.text }}>←</Text>
        </Pressable>
        <Text style={{ fontSize: 17, fontWeight: '700', color: colors.text }}>Активные сессии</Text>
      </View>

      {loading ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator color={colors.primary} />
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ padding: 16, gap: 10 }}>
          {sessions.length === 0 ? (
            <Text style={{ textAlign: 'center', color: colors.textSecondary, paddingTop: 40 }}>Нет активных сессий</Text>
          ) : sessions.map((s) => (
            <View key={s.id} style={{ backgroundColor: colors.background, borderRadius: 12, padding: 16, borderWidth: 1, borderColor: colors.border }}>
              <Text style={{ fontSize: 13, color: colors.textSecondary }}>
                Создана: {new Date(s.createdAt).toLocaleDateString('ru-RU')}
              </Text>
              <Text style={{ fontSize: 13, color: colors.textSecondary, marginTop: 2 }}>
                Истекает: {new Date(s.expiresAt).toLocaleDateString('ru-RU')}
              </Text>
              <Pressable
                onPress={() => handleRevoke(s.id)}
                accessibilityLabel="Завершить сессию"
                style={{ marginTop: 10, alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, borderWidth: 1, borderColor: colors.error }}
              >
                <Text style={{ color: colors.error, fontSize: 13, fontWeight: '600' }}>Завершить</Text>
              </Pressable>
            </View>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
