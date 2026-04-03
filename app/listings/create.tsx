import { View, Text, TouchableOpacity, ScrollView, Image, Alert, ActivityIndicator, Platform } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Header } from '../../components/layout/Header';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useAuthStore } from '../../stores/authStore';
import { api, apiUpload } from '../../lib/api';
import { colors } from '../../lib/colors';

const TOTAL_STEPS = 4;

interface Category {
  id: string;
  name: string;
  slug: string;
  children?: { id: string; name: string; slug: string }[];
}

interface City {
  id: string;
  name: string;
  nameRu: string;
  districts?: { id: string; name: string }[];
}

interface PhotoAsset {
  uri: string;
  fileName?: string;
  mimeType?: string;
}

export default function CreateListingScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);

  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  // Step 1: Category
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  // Step 2: City + District
  const [cities, setCities] = useState<City[]>([]);
  const [loadingCities, setLoadingCities] = useState(true);
  const [selectedCityId, setSelectedCityId] = useState<string | null>(null);
  const [selectedDistrictId, setSelectedDistrictId] = useState<string | null>(null);

  // Step 3: Title, Description, Price
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');

  // Step 4: Photos
  const [photos, setPhotos] = useState<PhotoAsset[]>([]);

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  const redirectedRef = useRef(false);

  // Redirect if not logged in — show explanation first
  useEffect(() => {
    if (!user && !redirectedRef.current) {
      redirectedRef.current = true;
      Alert.alert(
        t('authRequired'),
        t('authRequiredToCreate'),
        [{ text: t('ok'), onPress: () => router.replace('/(auth)') }]
      );
    }
  }, [user]);

  // Fetch categories
  useEffect(() => {
    (async () => {
      const res = await api.get<Category[]>('/categories');
      if (res.ok && res.data) {
        setCategories(res.data);
      }
      setLoadingCategories(false);
    })();
  }, []);

  // Fetch cities (reusing the same endpoint as categories for cities)
  useEffect(() => {
    (async () => {
      // The API doesn't have a /cities endpoint exposed in routes, so we use known cities
      // from CitySelector. We'll fetch them if endpoint exists, otherwise hardcode.
      const res = await api.get<City[]>('/cities');
      if (res.ok && res.data) {
        setCities(res.data);
      } else {
        // Fallback: use known city IDs
        setCities([
          { id: 'tbilisi', name: 'Tbilisi', nameRu: 'Тбилиси' },
          { id: 'batumi', name: 'Batumi', nameRu: 'Батуми' },
          { id: 'kutaisi', name: 'Kutaisi', nameRu: 'Кутаиси' },
          { id: 'rustavi', name: 'Rustavi', nameRu: 'Рустави' },
        ]);
      }
      setLoadingCities(false);
    })();
  }, []);

  const validateStep = (): boolean => {
    const errs: Record<string, string> = {};

    if (step === 1) {
      if (!selectedCategoryId) errs.category = t('categoryRequired');
    } else if (step === 2) {
      if (!selectedCityId) errs.city = t('cityRequired');
    } else if (step === 3) {
      if (!title.trim()) errs.title = t('titleRequired');
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (!validateStep()) return;
    setStep((s) => Math.min(s + 1, TOTAL_STEPS));
  };

  const handleBack = () => {
    setStep((s) => Math.max(s - 1, 1));
  };

  const pickPhotos = async () => {
    if (photos.length >= 10) {
      Alert.alert(t('maxPhotos', { max: 10 }));
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: true,
      selectionLimit: 10 - photos.length,
      quality: 0.8,
    });

    if (!result.canceled && result.assets) {
      const newPhotos: PhotoAsset[] = result.assets.map((asset) => ({
        uri: asset.uri,
        fileName: asset.fileName || `photo_${Date.now()}.jpg`,
        mimeType: asset.mimeType || 'image/jpeg',
      }));
      setPhotos((prev) => [...prev, ...newPhotos].slice(0, 10));
    }
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;

    setSubmitting(true);
    try {
      // Create listing
      const createRes = await api.post<{ id: string }>('/listings', {
        title: title.trim(),
        description: description.trim() || undefined,
        price: price.trim() ? price.trim() : undefined,
        categoryId: selectedCategoryId,
        cityId: selectedCityId,
        districtId: selectedDistrictId || undefined,
      });

      if (!createRes.ok || !createRes.data) {
        Alert.alert(t('error'), createRes.error || t('error'));
        setSubmitting(false);
        return;
      }

      const listingId = createRes.data.id;

      // Upload photos if any
      if (photos.length > 0) {
        const formData = new FormData();
        for (const photo of photos) {
          const blob: any = {
            uri: photo.uri,
            type: photo.mimeType || 'image/jpeg',
            name: photo.fileName || 'photo.jpg',
          };
          formData.append('photos', blob);
        }

        await apiUpload(`/listings/${listingId}/photos`, formData);
      }

      Alert.alert(t('listingCreated'), '', [
        { text: t('done'), onPress: () => router.replace('/my/listings') },
      ]);
    } catch (err) {
      Alert.alert(t('error'), t('error'));
    } finally {
      setSubmitting(false);
    }
  };

  const renderStepIndicator = () => (
    <View className="flex-row items-center justify-center py-4 gap-2">
      {Array.from({ length: TOTAL_STEPS }, (_, i) => (
        <View
          key={i}
          className={`h-2 rounded-full ${
            i + 1 <= step ? 'bg-primary w-8' : 'bg-border w-4'
          }`}
        />
      ))}
      <Text className="text-text-muted text-xs ml-2">
        {t('step')} {step} {t('of')} {TOTAL_STEPS}
      </Text>
    </View>
  );

  const renderStep1 = () => (
    <View className="px-4 gap-3">
      <Text className="text-text-primary text-base font-semibold">{t('selectCategory')}</Text>
      {loadingCategories ? (
        <ActivityIndicator size="small" color={colors.brandPrimary} />
      ) : (
        <View className="gap-2">
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              className={`p-4 rounded-lg border ${
                selectedCategoryId === cat.id
                  ? 'border-primary bg-primary/10'
                  : 'border-border bg-surface-card'
              }`}
              onPress={() => setSelectedCategoryId(cat.id)}
            >
              <Text
                className={`text-sm font-medium ${
                  selectedCategoryId === cat.id ? 'text-primary' : 'text-text-primary'
                }`}
              >
                {cat.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
      {errors.category && (
        <Text className="text-error text-xs">{errors.category}</Text>
      )}
    </View>
  );

  const renderStep2 = () => (
    <View className="px-4 gap-3">
      <Text className="text-text-primary text-base font-semibold">{t('selectCity')}</Text>
      {loadingCities ? (
        <ActivityIndicator size="small" color={colors.brandPrimary} />
      ) : (
        <View className="gap-2">
          {cities.map((city) => (
            <TouchableOpacity
              key={city.id}
              className={`p-4 rounded-lg border ${
                selectedCityId === city.id
                  ? 'border-primary bg-primary/10'
                  : 'border-border bg-surface-card'
              }`}
              onPress={() => {
                setSelectedCityId(city.id);
                setSelectedDistrictId(null);
              }}
            >
              <Text
                className={`text-sm font-medium ${
                  selectedCityId === city.id ? 'text-primary' : 'text-text-primary'
                }`}
              >
                {city.nameRu}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
      {errors.city && (
        <Text className="text-error text-xs">{errors.city}</Text>
      )}

      {/* Districts if selected city has them */}
      {selectedCityId && cities.find((c) => c.id === selectedCityId)?.districts && (
        <View className="mt-2 gap-2">
          <Text className="text-text-secondary text-sm">{t('location')}</Text>
          {cities
            .find((c) => c.id === selectedCityId)
            ?.districts?.map((d) => (
              <TouchableOpacity
                key={d.id}
                className={`p-3 rounded-lg border ${
                  selectedDistrictId === d.id
                    ? 'border-primary bg-primary/10'
                    : 'border-border bg-surface-card'
                }`}
                onPress={() => setSelectedDistrictId(d.id)}
              >
                <Text
                  className={`text-xs font-medium ${
                    selectedDistrictId === d.id ? 'text-primary' : 'text-text-primary'
                  }`}
                >
                  {d.name}
                </Text>
              </TouchableOpacity>
            ))}
        </View>
      )}
    </View>
  );

  const renderStep3 = () => (
    <View className="px-4 gap-4">
      <Input
        label={t('enterTitle')}
        value={title}
        onChangeText={(v) => { setTitle(v); if (errors.title) setErrors((e) => ({ ...e, title: '' })); }}
        placeholder={t('enterTitle')}
        error={errors.title}
      />
      <Input
        label={t('description')}
        value={description}
        onChangeText={setDescription}
        placeholder={t('enterDescription')}
        multiline
        numberOfLines={4}
      />
      <Input
        label={t('price')}
        value={price}
        onChangeText={setPrice}
        placeholder={t('enterPrice')}
        keyboardType="numeric"
      />
    </View>
  );

  const renderStep4 = () => (
    <View className="px-4 gap-3">
      <Text className="text-text-primary text-base font-semibold">
        {t('photos')} ({photos.length}/10)
      </Text>

      <View className="flex-row flex-wrap gap-2">
        {photos.map((photo, index) => (
          <View key={index} className="relative">
            <Image
              source={{ uri: photo.uri }}
              className="w-20 h-20 rounded-lg"
              resizeMode="cover"
            />
            <TouchableOpacity
              className="absolute -top-1 -right-1 w-5 h-5 bg-error rounded-full items-center justify-center"
              onPress={() => removePhoto(index)}
            >
              <Text className="text-white text-xs font-bold">x</Text>
            </TouchableOpacity>
          </View>
        ))}

        {photos.length < 10 && (
          <TouchableOpacity
            className="w-20 h-20 rounded-lg border-2 border-dashed border-border items-center justify-center"
            onPress={pickPhotos}
          >
            <Text className="text-primary text-2xl font-light">+</Text>
            <Text className="text-text-muted text-[10px]">{t('addPhoto')}</Text>
          </TouchableOpacity>
        )}
      </View>

      <Text className="text-text-muted text-xs">{t('maxPhotos', { max: 10 })}</Text>
    </View>
  );

  return (
    <View className="flex-1 bg-dark">
      <Header title={t('createListing')} />
      {renderStepIndicator()}

      <ScrollView className="flex-1" contentContainerClassName="pb-6">
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
        {step === 4 && renderStep4()}
      </ScrollView>

      {/* Navigation buttons */}
      <View className="px-4 py-4 border-t border-border flex-row gap-3">
        {step > 1 && (
          <View className="flex-1">
            <Button title={t('back')} variant="ghost" onPress={handleBack} />
          </View>
        )}
        <View className="flex-1">
          {step < TOTAL_STEPS ? (
            <Button title={t('next')} onPress={handleNext} />
          ) : (
            <Button
              title={t('publish')}
              onPress={handleSubmit}
              loading={submitting}
              disabled={submitting}
            />
          )}
        </View>
      </View>
    </View>
  );
}
