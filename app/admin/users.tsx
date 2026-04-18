import { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, Pressable, TextInput, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { apiFetch } from '../../lib/api';
import { ErrorState } from '../../components/ErrorState';
import { colors } from '../../lib/theme';

const ROLE_COLORS: Record<string, string> = { admin: colors.primary, user: '#6B7280', blocked: colors.error };

export default function AdminUsers() {
  const router = useRouter();
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const load = async (q = search) => {
    setLoading(true); setError(false);
    try {
      const r = await apiFetch(`/admin/users?q=${encodeURIComponent(q)}&limit=50`);
      setUsers(r.users ?? []);
    } catch { setError(true); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => load(search), 400);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [search]);

  const toggleBlock = async (user: any) => {
    const newRole = user.role === 'blocked' ? 'user' : 'blocked';
    try {
      await apiFetch(`/admin/users/${user.id}/role`, { method: 'PATCH', body: JSON.stringify({ role: newRole }) });
      setUsers(prev => prev.map(u => u.id === user.id ? { ...u, role: newRole } : u));
    } catch {}
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.surface }}>
      <View style={{ backgroundColor: colors.background, borderBottomWidth: 1, borderBottomColor: '#E8E8E8', paddingTop: 52, paddingBottom: 8, paddingHorizontal: 16, gap: 10 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <Pressable onPress={() => router.back()} accessibilityLabel="Назад"><Text style={{ fontSize: 22 }}>←</Text></Pressable>
          <Text style={{ fontSize: 17, fontWeight: '700' }}>Пользователи</Text>
        </View>
        <View style={{ borderWidth: 1, borderColor: '#E8E8E8', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8, backgroundColor: '#F9F9F9' }}>
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Поиск по email или имени..."
            placeholderTextColor={colors.textSecondary}
            style={{ fontSize: 14, color: colors.text } as any}
          />
        </View>
      </View>
      {loading ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}><ActivityIndicator color={colors.primary} /></View>
      ) : error ? (
        <ErrorState message="Не удалось загрузить пользователей" onRetry={() => load()} />
      ) : (
        <ScrollView contentContainerStyle={{ padding: 16, gap: 8 }}>
          {users.map(u => (
            <View key={u.id} style={{ backgroundColor: colors.background, borderRadius: 10, padding: 14, borderWidth: 1, borderColor: '#E8E8E8', flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: colors.text }}>{u.name ?? 'Без имени'}</Text>
                <Text style={{ fontSize: 12, color: colors.textSecondary }}>{u.email}</Text>
                <View style={{ marginTop: 4, alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4, backgroundColor: (ROLE_COLORS[u.role] ?? colors.textSecondary) + '22' }}>
                  <Text style={{ fontSize: 11, fontWeight: '600', color: ROLE_COLORS[u.role] ?? colors.textSecondary }}>{u.role}</Text>
                </View>
              </View>
              {u.role !== 'admin' && (
                <Pressable
                  onPress={() => toggleBlock(u)}
                  accessibilityLabel={u.role === 'blocked' ? 'Разблокировать пользователя' : 'Заблокировать пользователя'}
                  style={{ paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, borderWidth: 1, borderColor: u.role === 'blocked' ? colors.primary : colors.error }}
                >
                  <Text style={{ fontSize: 12, fontWeight: '600', color: u.role === 'blocked' ? colors.primary : colors.error }}>
                    {u.role === 'blocked' ? 'Разблокировать' : 'Заблокировать'}
                  </Text>
                </Pressable>
              )}
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}
