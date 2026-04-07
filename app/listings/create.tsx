import { View, Text, TouchableOpacity, ScrollView, Image, Alert, ActivityIndicator, Platform, BackHandler, Linking } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter, useFocusEffect, useLocalSearchParams } from 'expo-router';
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
  nameKa: string;
  nameRu: string;
  nameEn: string;
  slug: string;
  children?: { id: string; name: string; nameKa: string; nameRu: string; nameEn: string; slug: string }[];
}

interface City {
  id: string;
  name: string;
  nameRu: string;
  nameEn: string;
  nameKa: string;
  districts?: { id: string; name: string }[];
}

interface PhotoAsset {
  uri: string;
  fileName?: string;
  mimeType?: string;
}

export default function CreateListingScreen() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const params = useLocalSearchParams<{ paymentId?: string }>();

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

  // Step 3: Title, Description, Price, Address
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [address, setAddress] = useState('');

  // Step 4: Photos
  const [photos, setPhotos] = useState<PhotoAsset[]>([]);

  // Quota info for selected category
  const [quotaInfo, setQuotaInfo] = useState<{ used: number; freeQuota: number; remaining: number; paidPrice: number } | null>(null);
  const [loadingQuota, setLoadingQuota] = useState(false);

  // Slot payment state — set when quota exceeded and user needs to pay
  const [slotPaymentPending, setSlotPaymentPending] = useState(false);

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  const redirectedRef = useRef(false);
  const draftSavedRef = useRef(false);
  const submittedRef = useRef(false);

  // Check if the form has enough data to save as a draft (need at least category + city)
  const hasFormData = () => {
    return !!(selectedCategoryId && selectedCityId);
  };

  // Save current form data as draft (best-effort, silently ignores errors)
  const saveDraft = useCallback(async () => {
    if (!user || draftSavedRef.current || !selectedCategoryId || !selectedCityId) return;
    draftSavedRef.current = true;
    try {
      const body: Record<string, any> = {
        status: 'draft',
        categoryId: selectedCategoryId,
        cityId: selectedCityId,
      };
      if (title.trim()) body.title = title.trim();
      if (description.trim()) body.description = description.trim();
      if (price.trim()) body.price = price.trim();
      if (selectedDistrictId) body.districtId = selectedDistrictId;
      if (address.trim()) body.address = address.trim();

      const createRes = await api.post<{ id: string }>('/listings', body);
      if (createRes.ok && createRes.data && photos.length > 0) {
        const formData = new FormData();
        for (const photo of photos) {
          const blob: any = { uri: photo.uri, type: photo.mimeType || 'image/jpeg', name: photo.fileName || 'photo.jpg' };
          formData.append('photos', blob);
        }
        await apiUpload(`/listings/${createRes.data.id}/photos`, formData);
      }
    } catch (_) {
      // Draft save is best-effort; ignore errors
    }
  }, [user, selectedCategoryId, selectedCityId, title, description, price, selectedDistrictId, address, photos]);

  // Save pending listing data to sessionStorage before Stripe redirect
  const savePendingSlotData = useCallback(() => {
    if (typeof window === 'undefined') return;
    try {
      const data = {
        fields: {
          title: title.trim(),
          description: description.trim() || undefined,
          price: price.trim() || undefined,
          categoryId: selectedCategoryId,
          cityId: selectedCityId,
          districtId: selectedDistrictId || undefined,
          address: address.trim() || undefined,
        },
        photos,
      };
      window.sessionStorage.setItem('pending_listing_slot', JSON.stringify(data));
    } catch (_) {}
  }, [title, description, price, selectedCategoryId, selectedCityId, selectedDistrictId, address, photos]);

  // On return from Stripe (paymentId in URL) — the slot-success screen handles submission.
  // But if user lands back on create page somehow, clear stale pending data.
  useEffect(() => {
    if (!params.paymentId) return;
    // Redirect to slot-success which will auto-submit
    router.replace(`/listings/slot-success?paymentId=${params.paymentId}`);
  }, [params.paymentId]);

  // Show draft save prompt when user presses hardware back on Android
  useFocusEffect(
    useCallback(() => {
      if (Platform.OS !== 'android') return;
      const onBackPress = () => {
        if (submittedRef.current || !hasFormData()) return false;
        Alert.alert(
          t('saveDraftTitle'),
          t('saveDraftMessage'),
          [
            {
              text: t('dontSave'),
              style: 'destructive',
              onPress: () => router.back(),
            },
            {
              text: t('saveDraft'),
              onPress: async () => {
                await saveDraft();
                router.back();
              },
            },
          ]
        );
        return true;
      };
      const sub = BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => sub.remove();
    }, [selectedCategoryId, selectedCityId, title, description, price, photos, selectedDistrictId])
  );

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

  // Fetch quota when category changes
  useEffect(() => {
    if (!selectedCategoryId || !user) {
      setQuotaInfo(null);
      return;
    }
    setLoadingQuota(true);
    (async () => {
      const res = await api.get<{ used: number; freeQuota: number; remaining: number; paidPrice: number }>(`/categories/${selectedCategoryId}/quota`);
      if (res.ok && res.data) {
        setQuotaInfo(res.data);
      }
      setLoadingQuota(false);
    })();
  }, [selectedCategoryId, user]);

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
          { id: 'tbilisi', name: 'Tbilisi', nameRu: 'Тбилиси', nameEn: 'Tbilisi', nameKa: 'თბილისი' },
          { id: 'batumi', name: 'Batumi', nameRu: 'Батуми', nameEn: 'Batumi', nameKa: 'ბათუმი' },
          { id: 'kutaisi', name: 'Kutaisi', nameRu: 'Кутаиси', nameEn: 'Kutaisi', nameKa: 'ქუთაისი' },
          { id: 'rustavi', name: 'Rustavi', nameRu: 'Рустави', nameEn: 'Rustavi', nameKa: 'რუსთავი' },
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
      // Create listing (data may be success { id } or error { error, allowPaid, price })
      const createRes = await api.post<{ id: string } & { error?: string; allowPaid?: boolean; price?: number }>('/listings', {
        title: title.trim(),
        description: description.trim() || undefined,
        price: price.trim() ? price.trim() : undefined,
        categoryId: selectedCategoryId,
        cityId: selectedCityId,
        districtId: selectedDistrictId || undefined,
        address: address.trim() || undefined,
      });

      if (!createRes.ok) {
        // Handle quota exceeded with paid listing option
        if (createRes.status === 402) {
          const errData = createRes.data;
          if (errData?.allowPaid && errData?.price && selectedCategoryId) {
            // Show paywall confirmation
            const priceGEL = errData.price;
            Alert.alert(
              t('quotaExceededTitle'),
              t('quotaExceededPayAlert', { price: priceGEL }),
              [
                { text: t('cancel'), style: 'cancel', onPress: () => setSubmitting(false) },
                {
                  text: t('payAndPublish', { price: priceGEL }),
                  onPress: async () => {
                    await handleSlotPayment(selectedCategoryId!);
                  },
                },
              ]
            );
            return;
          }
          // Quota exceeded but no paid option
          Alert.alert(t('error'), t('quotaExceeded'));
          setSubmitting(false);
          return;
        }

        Alert.alert(t('error'), createRes.error || t('error'));
        setSubmitting(false);
        return;
      }

      if (!createRes.data) {
        Alert.alert(t('error'), t('error'));
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

      submittedRef.current = true;
      Alert.alert(t('listingSubmittedForReview'), t('listingSubmittedForReviewDesc'), [
        { text: t('done'), onPress: () => router.replace('/my/listings') },
      ]);
    } catch (err) {
      Alert.alert(t('error'), t('error'));
    } finally {
      setSubmitting(false);
    }
  };

  // Initiate Stripe Checkout for a listing slot purchase
  const handleSlotPayment = async (catId: string) => {
    setSlotPaymentPending(true);
    try {
      const res = await api.post<{ url: string; paymentId: string }>('/promotions/purchase-listing-slot', {
        categoryId: catId,
      });

      if (!res.ok || !res.data?.url) {
        Alert.alert(t('error'), res.error || t('error'));
        setSlotPaymentPending(false);
        setSubmitting(false);
        return;
      }

      // Save form data before leaving the page
      savePendingSlotData();

      // Redirect to Stripe Checkout
      Linking.openURL(res.data.url);
      // Submitting state stays true — user left the page
    } catch (_) {
      Alert.alert(t('error'), t('error'));
      setSlotPaymentPending(false);
      setSubmitting(false);
    }
  };

  // Handle header back — show draft save prompt if applicable
  const handleHeaderBack = () => {
    if (submittedRef.current || !hasFormData()) {
      router.back();
      return;
    }
    Alert.alert(
      t('saveDraftTitle'),
      t('saveDraftMessage'),
      [
        {
          text: t('dontSave'),
          style: 'destructive',
          onPress: () => router.back(),
        },
        {
          text: t('saveDraft'),
          onPress: async () => {
            await saveDraft();
            router.back();
          },
        },
      ]
    );
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
                {i18n.language === 'en' ? (cat.nameEn || cat.name) : i18n.language === 'ka' ? (cat.nameKa || cat.nameEn || cat.name) : (cat.nameRu || cat.name)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
      {errors.category && (
        <Text className="text-error text-xs">{errors.category}</Text>
      )}

      {/* Quota status for selected category */}
      {selectedCategoryId && quotaInfo && !loadingQuota && (
        <View className={`p-3 rounded-lg border ${quotaInfo.remaining > 0 ? 'border-border bg-surface-card' : quotaInfo.paidPrice > 0 ? 'border-yellow-500/50 bg-yellow-500/10' : 'border-error/50 bg-error/10'}`}>
          <Text className="text-text-secondary text-xs">
            {t('remainingFree')}: <Text className={`font-semibold ${quotaInfo.remaining > 0 ? 'text-primary' : 'text-error'}`}>{quotaInfo.remaining}/{quotaInfo.freeQuota}</Text>
          </Text>
          {quotaInfo.remaining === 0 && quotaInfo.paidPrice > 0 && (
            <Text className="text-yellow-400 text-xs mt-1 font-medium">
              {t('paidListingAvailable', { price: quotaInfo.paidPrice })}
            </Text>
          )}
          {quotaInfo.remaining === 0 && quotaInfo.paidPrice === 0 && (
            <Text className="text-error text-xs mt-1">{t('quotaExceeded')}</Text>
          )}
        </View>
      )}
      {selectedCategoryId && loadingQuota && (
        <ActivityIndicator size="small" color={colors.brandPrimary} />
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
                {i18n.language === 'en' ? (city.nameEn || city.nameRu) : i18n.language === 'ka' ? (city.nameKa || city.nameRu) : city.nameRu}
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

      {/* Optional street address for precise map pin */}
      {selectedCityId && (
        <Input
          label={t('addressOptional')}
          value={address}
          onChangeText={setAddress}
          placeholder={t('addressOptional')}
        />
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
      <Header title={t('createListing')} showBack onBack={handleHeaderBack} />
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
