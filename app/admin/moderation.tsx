import { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { apiFetch } from '../../lib/api';
import { ErrorState } from '../../components/ErrorState';

const C = { green: '#00AA6C', white: '#FFFFFF', text: '#1A1A1A', muted: '#9E9E9E', border: '#E8E8E8', page: '#F5F5F5', error: '#D32F2F' };

export default function AdminModeration() {
  const router = useRouter();
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = async () => {
    setLoading(true); setError(false);
    try {
      const r = await apiFetch('/admin/listings/pending');
      setListings(r.listings ?? []);
    } catch { setError(true); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const approve = async (id: string) => {
    try {
      await apiFetch(`/admin/listings/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status: 'active' }) });
      setListings(prev => prev.filter(l => l.id !== id));
    } catch {
      Alert.alert('Ошибка', 'Не удалось одобрить объявление');
    }
  };

  const reject = (id: string) => {
    Alert.prompt('Причина отказа', 'Укажите причину', [
      { text: 'Отмена', style: 'cancel' },
      {
        text: 'Отклонить', style: 'destructive', onPress: async (reason: string | undefined) => {
          try {
            await apiFetch(`/admin/listings/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status: 'rejected', rejectReason: reason }) });
            setListings(prev => prev.filter(l => l.id !== id));
          } catch {
            Alert.alert('Ошибка', 'Не удалось отклонить объявление');
          }
        },
      },
    ]);
  };

  if (loading) return <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}><ActivityIndicator color={C.green} /></View>;
  if (error) return <ErrorState message="Не удалось загрузить очередь" onRetry={load} />;

  return (
    <View style={{ flex: 1, backgroundColor: C.page }}>
      <View style={{ backgroundColor: C.white, borderBottomWidth: 1, borderBottomColor: C.border, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 52, paddingBottom: 14, gap: 12 }}>
        <Pressable onPress={() => router.back()}><Text style={{ fontSize: 22 }}>←</Text></Pressable>
        <Text style={{ fontSize: 17, fontWeight: '700' }}>Модерация ({listings.length})</Text>
      </View>
      {listings.length === 0 ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          <Text style={{ fontSize: 40 }}>✅</Text>
          <Text style={{ fontSize: 16, color: C.muted }}>Очередь пуста</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
          {listings.map(l => (
            <View key={l.id} style={{ backgroundColor: C.white, borderRadius: 12, padding: 16, borderWidth: 1, borderColor: C.border, gap: 10 }}>
              <Text style={{ fontSize: 15, fontWeight: '700', color: C.text }}>{l.title}</Text>
              <Text style={{ fontSize: 14, color: C.muted }}>{l.price} {l.currency} · {l.city?.nameRu ?? l.city?.nameEn}</Text>
              {l.description && <Text style={{ fontSize: 13, color: C.text }} numberOfLines={3}>{l.description}</Text>}
              <Text style={{ fontSize: 11, color: C.muted }}>
                от {l.user?.name ?? l.user?.email} · {l.createdAt ? new Date(l.createdAt).toLocaleDateString('ru-RU') : ''}
              </Text>
              <View style={{ flexDirection: 'row', gap: 10 }}>
                <Pressable onPress={() => approve(l.id)} style={{ flex: 1, backgroundColor: C.green, borderRadius: 8, paddingVertical: 10, alignItems: 'center' }}>
                  <Text style={{ color: C.white, fontWeight: '700' }}>Одобрить</Text>
                </Pressable>
                <Pressable onPress={() => reject(l.id)} style={{ flex: 1, borderWidth: 1.5, borderColor: C.error, borderRadius: 8, paddingVertical: 10, alignItems: 'center' }}>
                  <Text style={{ color: C.error, fontWeight: '700' }}>Отклонить</Text>
                </Pressable>
              </View>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}
