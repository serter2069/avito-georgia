import { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, Pressable, TextInput, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { apiFetch } from '../../lib/api';
import { ErrorState } from '../../components/ErrorState';

const C = { green: '#00AA6C', white: '#FFFFFF', text: '#1A1A1A', muted: '#9E9E9E', border: '#E8E8E8', page: '#F5F5F5', error: '#D32F2F' };

const ROLE_COLORS: Record<string, string> = { admin: C.green, user: '#6B7280', blocked: C.error };

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
    <View style={{ flex: 1, backgroundColor: C.page }}>
      <View style={{ backgroundColor: C.white, borderBottomWidth: 1, borderBottomColor: C.border, paddingTop: 52, paddingBottom: 8, paddingHorizontal: 16, gap: 10 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <Pressable onPress={() => router.back()}><Text style={{ fontSize: 22 }}>←</Text></Pressable>
          <Text style={{ fontSize: 17, fontWeight: '700' }}>Пользователи</Text>
        </View>
        <View style={{ borderWidth: 1, borderColor: C.border, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8, backgroundColor: '#F9F9F9' }}>
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Поиск по email или имени..."
            placeholderTextColor={C.muted}
            style={{ fontSize: 14, color: C.text } as any}
          />
        </View>
      </View>
      {loading ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}><ActivityIndicator color={C.green} /></View>
      ) : error ? (
        <ErrorState message="Не удалось загрузить пользователей" onRetry={() => load()} />
      ) : (
        <ScrollView contentContainerStyle={{ padding: 16, gap: 8 }}>
          {users.map(u => (
            <View key={u.id} style={{ backgroundColor: C.white, borderRadius: 10, padding: 14, borderWidth: 1, borderColor: C.border, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: C.text }}>{u.name ?? 'Без имени'}</Text>
                <Text style={{ fontSize: 12, color: C.muted }}>{u.email}</Text>
                <View style={{ marginTop: 4, alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4, backgroundColor: (ROLE_COLORS[u.role] ?? C.muted) + '22' }}>
                  <Text style={{ fontSize: 11, fontWeight: '600', color: ROLE_COLORS[u.role] ?? C.muted }}>{u.role}</Text>
                </View>
              </View>
              {u.role !== 'admin' && (
                <Pressable
                  onPress={() => toggleBlock(u)}
                  style={{ paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, borderWidth: 1, borderColor: u.role === 'blocked' ? C.green : C.error }}
                >
                  <Text style={{ fontSize: 12, fontWeight: '600', color: u.role === 'blocked' ? C.green : C.error }}>
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
