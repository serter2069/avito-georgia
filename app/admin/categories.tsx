import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, TextInput, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useState, useEffect, useCallback } from 'react';
import { api } from '../../lib/api';
import { colors } from '../../lib/colors';

interface CategoryItem {
  id: string;
  name: string;
  nameKa: string;
  nameRu: string;
  nameEn: string;
  slug: string;
  freeListingQuota: number;
  paidListingPrice: number;
  parentId: string | null;
  children?: CategoryItem[];
}

export default function AdminCategories() {
  const { t } = useTranslation();
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editQuota, setEditQuota] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    const res = await api.get<CategoryItem[]>('/admin/categories');
    if (res.ok && res.data) {
      setCategories(res.data);
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchCategories(); }, []);

  const startEdit = (cat: CategoryItem) => {
    setEditingId(cat.id);
    setEditQuota(String(cat.freeListingQuota));
    setEditPrice(String(cat.paidListingPrice));
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditQuota('');
    setEditPrice('');
  };

  const saveEdit = async (id: string) => {
    setSaving(true);
    const res = await api.patch(`/admin/categories/${id}`, {
      freeListingQuota: editQuota,
      paidListingPrice: editPrice,
    });
    setSaving(false);
    if (res.ok) {
      cancelEdit();
      fetchCategories();
    } else {
      Alert.alert(t('error'), res.error || t('error'));
    }
  };

  const renderCategory = (cat: CategoryItem, isChild = false) => {
    const isEditing = editingId === cat.id;
    return (
      <View
        key={cat.id}
        className={`border border-border rounded-lg p-4 ${isChild ? 'ml-4 bg-dark' : 'bg-surface-card'}`}
      >
        <View className="flex-row items-center justify-between mb-2">
          <View className="flex-1">
            <Text className="text-text-primary text-sm font-semibold">{cat.nameEn || cat.name}</Text>
            <Text className="text-text-muted text-xs">{cat.nameRu || ''}{cat.nameKa ? ` / ${cat.nameKa}` : ''}</Text>
            <Text className="text-text-muted text-xs">{cat.slug}</Text>
          </View>
          {!isEditing && (
            <TouchableOpacity
              className="bg-primary/20 px-3 py-1 rounded-md"
              onPress={() => startEdit(cat)}
            >
              <Text className="text-primary text-xs font-medium">{t('edit')}</Text>
            </TouchableOpacity>
          )}
        </View>

        {isEditing ? (
          <View className="gap-2">
            <View className="flex-row items-center gap-2">
              <Text className="text-text-secondary text-xs w-24">{t('freeQuota')}:</Text>
              <TextInput
                className="flex-1 border border-border rounded-md px-3 py-2 text-text-primary text-sm bg-dark"
                value={editQuota}
                onChangeText={setEditQuota}
                keyboardType="numeric"
                placeholderTextColor={colors.textMuted}
              />
            </View>
            <View className="flex-row items-center gap-2">
              <Text className="text-text-secondary text-xs w-24">{t('pricePerListing')}:</Text>
              <TextInput
                className="flex-1 border border-border rounded-md px-3 py-2 text-text-primary text-sm bg-dark"
                value={editPrice}
                onChangeText={setEditPrice}
                keyboardType="numeric"
                placeholderTextColor={colors.textMuted}
              />
            </View>
            <View className="flex-row gap-2 mt-1">
              <TouchableOpacity
                className="flex-1 bg-primary py-2 rounded-md items-center"
                onPress={() => saveEdit(cat.id)}
                disabled={saving}
              >
                <Text className="text-white text-xs font-semibold">
                  {saving ? t('loading') : t('save')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1 border border-border py-2 rounded-md items-center"
                onPress={cancelEdit}
              >
                <Text className="text-text-secondary text-xs">{t('cancel')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View className="flex-row gap-4">
            <Text className="text-text-secondary text-xs">
              {t('freeQuota')}: <Text className="text-text-primary font-medium">{cat.freeListingQuota}</Text>
            </Text>
            <Text className="text-text-secondary text-xs">
              {t('pricePerListing')}: <Text className="text-text-primary font-medium">
                {cat.paidListingPrice > 0 ? `${cat.paidListingPrice} GEL` : '-'}
              </Text>
            </Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <ScrollView className="flex-1 bg-dark" contentContainerClassName="p-4 pb-10 gap-3">
      <Text className="text-text-primary text-lg font-bold mb-2">{t('adminCategories')}</Text>

      {loading ? (
        <ActivityIndicator size="large" color={colors.brandPrimary} />
      ) : (
        categories.map((cat) => (
          <View key={cat.id} className="gap-2">
            {renderCategory(cat)}
            {cat.children?.map((child) => renderCategory(child, true))}
          </View>
        ))
      )}
    </ScrollView>
  );
}
