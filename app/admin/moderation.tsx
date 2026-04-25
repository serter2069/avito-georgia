import { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator, Alert, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { apiFetch } from '../../lib/api';
import { ErrorState } from '../../components/ErrorState';
import { colors } from '../../lib/theme';

export default function AdminModeration() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const contentWidth = Math.min(width, width >= 1024 ? 960 : width);
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

  if (loading) return <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}><ActivityIndicator color={colors.primary} /></View>;
  if (error) return <ErrorState message="Не удалось загрузить очередь" onRetry={load} />;

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: colors.surface }}>
      <View style={{ backgroundColor: colors.background, borderBottomWidth: 1, borderBottomColor: '#E8E8E8', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, gap: 12 }}>
        <Pressable onPress={() => router.back()} accessibilityLabel="Назад" style={{ width: 44, height: 44, alignItems: 'center', justifyContent: 'center' }}><Text style={{ fontSize: 22 }}>←</Text></Pressable>
        <Text style={{ fontSize: 17, fontWeight: '700' }}>Модерация ({listings.length})</Text>
      </View>
      {listings.length === 0 ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          <Text style={{ fontSize: 40 }}>✅</Text>
          <Text style={{ fontSize: 16, color: colors.textSecondary }}>Очередь пуста</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ padding: 16, gap: 12, maxWidth: contentWidth, alignSelf: 'center', width: '100%' }}>
          {listings.map(l => (
            <View key={l.id} style={{ backgroundColor: colors.background, borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#E8E8E8', gap: 10 }}>
              <Text style={{ fontSize: 15, fontWeight: '700', color: colors.text }}>{l.title}</Text>
              <Text style={{ fontSize: 14, color: colors.textSecondary }}>{l.price} {l.currency} · {l.city?.nameRu ?? l.city?.nameEn}</Text>
              {l.description && <Text style={{ fontSize: 13, color: colors.text }} numberOfLines={3}>{l.description}</Text>}
              <Text style={{ fontSize: 13, color: colors.textSecondary }}>
                от {l.user?.name ?? l.user?.email} · {l.createdAt ? new Date(l.createdAt).toLocaleDateString('ru-RU') : ''}
              </Text>
              <View style={{ flexDirection: 'row', gap: 10 }}>
                <Pressable onPress={() => approve(l.id)} accessibilityLabel="Одобрить объявление" style={{ flex: 1, backgroundColor: colors.primary, borderRadius: 8, minHeight: 44, alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ color: colors.background, fontWeight: '700' }}>Одобрить</Text>
                </Pressable>
                <Pressable onPress={() => reject(l.id)} accessibilityLabel="Отклонить объявление" style={{ flex: 1, borderWidth: 1.5, borderColor: colors.error, borderRadius: 8, minHeight: 44, alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ color: colors.error, fontWeight: '700' }}>Отклонить</Text>
                </Pressable>
              </View>
            </View>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
