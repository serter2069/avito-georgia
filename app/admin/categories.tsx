import { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, TextInput, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { apiFetch } from '../../lib/api';
import { ErrorState } from '../../components/ErrorState';
import { colors } from '../../lib/theme';

interface Category {
  id: string;
  name: string;
  freeListingQuota: number;
  paidListingPrice: number;
  // local edit state (stored as strings for TextInput)
  _quota: string;
  _price: string;
}

export default function AdminCategories() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [saving, setSaving] = useState<string | null>(null);

  const load = async () => {
    setLoading(true); setError(false);
    try {
      const r = await apiFetch('/admin/categories');
      // API returns plain array
      const list: Array<{ id: string; name: string; freeListingQuota: number; paidListingPrice: number }> = Array.isArray(r) ? r : (r.categories ?? []);
      setCategories(list.map((c) => ({
        ...c,
        _quota: String(c.freeListingQuota ?? 0),
        _price: String(c.paidListingPrice ?? 0),
      })));
    } catch { setError(true); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const save = async (cat: Category) => {
    setSaving(cat.id);
    try {
      await apiFetch(`/admin/categories/${cat.id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          freeListingQuota: parseInt(cat._quota) || 0,
          paidListingPrice: parseFloat(cat._price) || 0,
        }),
      });
    } catch (e) { console.error('Failed to save category', e); }
    setSaving(null);
  };

  const update = (id: string, field: '_quota' | '_price', value: string) => {
    setCategories(prev => prev.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  if (loading) return <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}><ActivityIndicator color={colors.primary} /></View>;
  if (error) return <ErrorState message="Не удалось загрузить категории" onRetry={load} />;

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: colors.surface }}>
      <View style={{ backgroundColor: colors.background, borderBottomWidth: 1, borderBottomColor: '#E8E8E8', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, gap: 12 }}>
        <Pressable onPress={() => router.back()} accessibilityLabel="Назад"><Text style={{ fontSize: 22 }}>←</Text></Pressable>
        <Text style={{ fontSize: 17, fontWeight: '700' }}>Категории</Text>
      </View>
      <ScrollView contentContainerStyle={{ padding: 16, gap: 10 }}>
        {categories.map(cat => (
          <View key={cat.id} style={{ backgroundColor: colors.background, borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#E8E8E8', gap: 12 }}>
            <Text style={{ fontSize: 15, fontWeight: '700', color: colors.text }}>{cat.name}</Text>
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 11, color: colors.textSecondary, marginBottom: 4 }}>Бесплатных объявлений</Text>
                <View style={{ borderWidth: 1, borderColor: '#E8E8E8', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 7 }}>
                  <TextInput
                    value={cat._quota}
                    onChangeText={v => update(cat.id, '_quota', v)}
                    keyboardType="numeric"
                    style={{ fontSize: 14, color: colors.text } as any}
                  />
                </View>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 11, color: colors.textSecondary, marginBottom: 4 }}>Цена (₾)</Text>
                <View style={{ borderWidth: 1, borderColor: '#E8E8E8', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 7 }}>
                  <TextInput
                    value={cat._price}
                    onChangeText={v => update(cat.id, '_price', v)}
                    keyboardType="numeric"
                    style={{ fontSize: 14, color: colors.text } as any}
                  />
                </View>
              </View>
            </View>
            <Pressable
              onPress={() => save(cat)}
              disabled={saving === cat.id}
              accessibilityLabel={`Сохранить категорию ${cat.name}`}
              style={{ backgroundColor: colors.primary, borderRadius: 8, paddingVertical: 10, alignItems: 'center', opacity: saving === cat.id ? 0.6 : 1 }}
            >
              <Text style={{ color: colors.background, fontWeight: '700' }}>{saving === cat.id ? 'Сохраняется...' : 'Сохранить'}</Text>
            </Pressable>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
