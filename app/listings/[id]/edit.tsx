import { View, Text, ScrollView, Alert, ActivityIndicator, Image, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Header } from '../../../components/layout/Header';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { useAuthStore } from '../../../stores/authStore';
import { api, apiUpload } from '../../../lib/api';
import { colors } from '../../../lib/colors';

interface ListingDetail {
  id: string;
  title: string;
  description: string | null;
  price: number | null;
  currency: string;
  status: string;
  categoryId: string;
  cityId: string;
  districtId: string | null;
  category?: { id: string; name: string };
  city?: { id: string; nameRu: string };
  district?: { id: string; name: string } | null;
  photos?: { id: string; url: string; order: number }[];
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface City {
  id: string;
  name: string;
  nameRu: string;
}

interface PhotoAsset {
  uri: string;
  fileName?: string;
  mimeType?: string;
}

export default function EditListingScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const user = useAuthStore((s) => s.user);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedCityId, setSelectedCityId] = useState<string | null>(null);
  const [selectedDistrictId, setSelectedDistrictId] = useState<string | null>(null);

  // Existing photos
  const [existingPhotos, setExistingPhotos] = useState<{ id: string; url: string }[]>([]);
  // New photos to upload
  const [newPhotos, setNewPhotos] = useState<PhotoAsset[]>([]);

  // Categories & cities for selectors
  const [categories, setCategories] = useState<Category[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [citiesError, setCitiesError] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      router.replace('/(auth)');
    }
  }, [user]);

  // Fetch listing data + categories + cities
  useEffect(() => {
    (async () => {
      const [listingRes, catRes, cityRes] = await Promise.all([
        api.get<ListingDetail>(`/listings/${id}`),
        api.get<Category[]>('/categories'),
        api.get<City[]>('/cities'),
      ]);

      if (listingRes.ok && listingRes.data) {
        const l = listingRes.data;
        setTitle(l.title);
        setDescription(l.description || '');
        setPrice(l.price !== null ? String(l.price) : '');
        setSelectedCategoryId(l.categoryId);
        setSelectedCityId(l.cityId);
        setSelectedDistrictId(l.districtId);
        setExistingPhotos(
          (l.photos || []).map((p) => ({ id: p.id, url: p.url }))
        );
      }

      if (catRes.ok && catRes.data) {
        setCategories(catRes.data);
      }

      if (cityRes.ok && cityRes.data && cityRes.data.length > 0) {
        setCities(cityRes.data);
      } else {
        // Do not use hardcoded city IDs — they are not UUIDs and cause FK errors on save
        setCitiesError(true);
      }

      setLoading(false);
    })();
  }, [id]);

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!title.trim()) errs.title = t('titleRequired');
    if (!selectedCategoryId) errs.category = t('categoryRequired');
    if (!selectedCityId) errs.city = t('cityRequired');
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;

    setSaving(true);
    try {
      const res = await api.patch(`/listings/${id}`, {
        title: title.trim(),
        description: description.trim() || undefined,
        price: price.trim() ? price.trim() : undefined,
        categoryId: selectedCategoryId,
        cityId: selectedCityId,
        districtId: selectedDistrictId || undefined,
      });

      if (!res.ok) {
        Alert.alert(t('error'), res.error || t('error'));
        setSaving(false);
        return;
      }

      // Upload new photos if any
      if (newPhotos.length > 0) {
        const formData = new FormData();
        for (const photo of newPhotos) {
          const blob: any = {
            uri: photo.uri,
            type: photo.mimeType || 'image/jpeg',
            name: photo.fileName || 'photo.jpg',
          };
          formData.append('photos', blob);
        }
        await apiUpload(`/listings/${id}/photos`, formData);
      }

      Alert.alert(t('listingSaved'), '', [
        { text: t('done'), onPress: () => router.back() },
      ]);
    } catch (err) {
      Alert.alert(t('error'), t('error'));
    } finally {
      setSaving(false);
    }
  };

  const deleteExistingPhoto = async (photoId: string) => {
    const res = await api.delete(`/listings/${id}/photos/${photoId}`);
    if (res.ok) {
      setExistingPhotos((prev) => prev.filter((p) => p.id !== photoId));
    }
  };

  const pickNewPhotos = async () => {
    const totalPhotos = existingPhotos.length + newPhotos.length;
    if (totalPhotos >= 10) {
      Alert.alert(t('maxPhotos', { max: 10 }));
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: true,
      selectionLimit: 10 - totalPhotos,
      quality: 0.8,
    });

    if (!result.canceled && result.assets) {
      const assets: PhotoAsset[] = result.assets.map((a) => ({
        uri: a.uri,
        fileName: a.fileName || `photo_${Date.now()}.jpg`,
        mimeType: a.mimeType || 'image/jpeg',
      }));
      setNewPhotos((prev) => [...prev, ...assets].slice(0, 10 - existingPhotos.length));
    }
  };

  const removeNewPhoto = (index: number) => {
    setNewPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  if (loading) {
    return (
      <View className="flex-1 bg-dark">
        <Header title={t('editListing')} />
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={colors.brandPrimary} />
          <Text className="text-text-muted mt-2 text-sm">{t('loading')}</Text>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-dark">
      <Header title={t('editListing')} />

      <ScrollView className="flex-1" contentContainerClassName="px-4 py-4 gap-4 pb-8">
        {/* Title */}
        <Input
          label={t('enterTitle')}
          value={title}
          onChangeText={(v) => { setTitle(v); if (errors.title) setErrors((e) => ({ ...e, title: '' })); }}
          placeholder={t('enterTitle')}
          error={errors.title}
        />

        {/* Description */}
        <Input
          label={t('description')}
          value={description}
          onChangeText={setDescription}
          placeholder={t('enterDescription')}
          multiline
          numberOfLines={4}
        />

        {/* Price */}
        <Input
          label={t('price')}
          value={price}
          onChangeText={setPrice}
          placeholder={t('enterPrice')}
          keyboardType="numeric"
        />

        {/* Category */}
        <View>
          <Text className="text-text-secondary text-sm mb-2 font-medium">{t('category')}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="gap-2">
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                className={`px-3 py-2 rounded-full border ${
                  selectedCategoryId === cat.id
                    ? 'bg-primary border-primary'
                    : 'border-border bg-surface-card'
                }`}
                onPress={() => setSelectedCategoryId(cat.id)}
              >
                <Text
                  className={`text-xs font-medium ${
                    selectedCategoryId === cat.id ? 'text-white' : 'text-text-primary'
                  }`}
                >
                  {cat.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          {errors.category && (
            <Text className="text-error text-xs mt-1">{errors.category}</Text>
          )}
        </View>

        {/* City */}
        <View>
          <Text className="text-text-secondary text-sm mb-2 font-medium">{t('selectCity')}</Text>
          {citiesError ? (
            <Text className="text-error text-xs">{t('citiesLoadError')}</Text>
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="gap-2">
              {cities.map((city) => (
                <TouchableOpacity
                  key={city.id}
                  className={`px-3 py-2 rounded-full border ${
                    selectedCityId === city.id
                      ? 'bg-primary border-primary'
                      : 'border-border bg-surface-card'
                  }`}
                  onPress={() => { setSelectedCityId(city.id); setSelectedDistrictId(null); }}
                >
                  <Text
                    className={`text-xs font-medium ${
                      selectedCityId === city.id ? 'text-white' : 'text-text-primary'
                    }`}
                  >
                    {city.nameRu}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
          {errors.city && (
            <Text className="text-error text-xs mt-1">{errors.city}</Text>
          )}
        </View>

        {/* Photos section */}
        <View>
          <Text className="text-text-secondary text-sm mb-2 font-medium">
            {t('photos')} ({existingPhotos.length + newPhotos.length}/10)
          </Text>

          <View className="flex-row flex-wrap gap-2">
            {/* Existing photos */}
            {existingPhotos.map((photo) => (
              <View key={photo.id} className="relative">
                <Image
                  source={{ uri: photo.url }}
                  className="w-20 h-20 rounded-lg"
                  resizeMode="cover"
                />
                <TouchableOpacity
                  className="absolute -top-1 -right-1 w-5 h-5 bg-error rounded-full items-center justify-center"
                  onPress={() => deleteExistingPhoto(photo.id)}
                >
                  <Text className="text-white text-xs font-bold">x</Text>
                </TouchableOpacity>
              </View>
            ))}

            {/* New photos */}
            {newPhotos.map((photo, index) => (
              <View key={`new-${index}`} className="relative">
                <Image
                  source={{ uri: photo.uri }}
                  className="w-20 h-20 rounded-lg"
                  resizeMode="cover"
                />
                <TouchableOpacity
                  className="absolute -top-1 -right-1 w-5 h-5 bg-error rounded-full items-center justify-center"
                  onPress={() => removeNewPhoto(index)}
                >
                  <Text className="text-white text-xs font-bold">x</Text>
                </TouchableOpacity>
              </View>
            ))}

            {/* Add button */}
            {existingPhotos.length + newPhotos.length < 10 && (
              <TouchableOpacity
                className="w-20 h-20 rounded-lg border-2 border-dashed border-border items-center justify-center"
                onPress={pickNewPhotos}
              >
                <Text className="text-primary text-2xl font-light">+</Text>
                <Text className="text-text-muted text-[10px]">{t('addPhoto')}</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Save button */}
      <View className="px-4 py-4 border-t border-border flex-row gap-3">
        <View className="flex-1">
          <Button title={t('cancel')} variant="ghost" onPress={() => router.back()} />
        </View>
        <View className="flex-1">
          <Button
            title={t('save')}
            onPress={handleSave}
            loading={saving}
            disabled={saving || citiesError}
          />
        </View>
      </View>
    </View>
  );
}
