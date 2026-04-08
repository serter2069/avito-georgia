import { useState, useEffect } from 'react';
import { View, Text, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { api } from '../lib/api';
import { useAuthStore } from '../stores/authStore';
import i18n from '../lib/i18n';

interface City {
  id: string;
  name: string;
  nameRu: string;
  nameEn: string;
  nameKa: string;
}

export default function OnboardingScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { returnTo } = useLocalSearchParams<{ returnTo?: string }>();
  const user = useAuthStore((s) => s.user);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [cities, setCities] = useState<City[]>([]);
  const [showCityPicker, setShowCityPicker] = useState(false);
  const [nameError, setNameError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadCities = async () => {
      const res = await api.get<City[]>('/cities');
      if (res.ok && res.data) {
        setCities(res.data);
      }
    };
    loadCities();
  }, []);

  const getCityLabel = (cityName: string) => {
    const city = cities.find((c) => c.nameRu === cityName || c.nameEn === cityName || c.nameKa === cityName || c.name === cityName);
    if (!city) return cityName;
    if (i18n.language === 'en') return city.nameEn || city.nameRu;
    if (i18n.language === 'ka') return city.nameKa || city.nameRu;
    return city.nameRu;
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      setNameError(t('onboardingNameRequired'));
      return;
    }
    setNameError('');
    setLoading(true);

    try {
      const res = await api.patch('/users/me', {
        name: name.trim(),
        phone: phone.trim() || null,
        city: selectedCity || null,
        isOnboarded: true,
      });

      if (res.ok) {
        // Update isOnboarded in the store so useProtectedRoute does not redirect back
        const currentUser = useAuthStore.getState().user;
        if (currentUser) {
          useAuthStore.setState({ user: { ...currentUser, isOnboarded: true } });
        }
        router.replace((returnTo as string | undefined) || '/');
      }
    } catch {
      // Non-blocking: navigate anyway
      const currentUser = useAuthStore.getState().user;
      if (currentUser) {
        useAuthStore.setState({ user: { ...currentUser, isOnboarded: true } });
      }
      router.replace((returnTo as string | undefined) || '/');
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = async () => {
    setLoading(true);
    try {
      await api.patch('/users/me', { isOnboarded: true });
    } catch { /* best-effort */ } finally {
      setLoading(false);
    }
    const currentUser = useAuthStore.getState().user;
    if (currentUser) {
      useAuthStore.setState({ user: { ...currentUser, isOnboarded: true } });
    }
    router.replace((returnTo as string | undefined) || '/');
  };

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        className="flex-1 bg-dark"
        contentContainerClassName="flex-grow justify-center px-6 py-10"
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View className="items-center mb-8">
          <Text className="text-text-primary text-2xl font-bold mb-2">
            {t('onboardingTitle')}
          </Text>
          <Text className="text-text-secondary text-sm text-center">
            {t('onboardingSubtitle')}
          </Text>
        </View>

        <View className="gap-4">
          {/* Name */}
          <Input
            label={t('onboardingName')}
            value={name}
            onChangeText={(v) => { setName(v); setNameError(''); }}
            placeholder={t('onboardingNamePlaceholder')}
            autoCapitalize="words"
            error={nameError}
          />

          {/* Phone */}
          <Input
            label={t('onboardingPhone')}
            value={phone}
            onChangeText={setPhone}
            placeholder={t('onboardingPhonePlaceholder')}
            keyboardType="phone-pad"
          />

          {/* City picker */}
          <View className="w-full">
            <Text className="text-text-secondary text-sm mb-1 font-medium">
              {t('onboardingCity')}
            </Text>
            <TouchableOpacity
              className="bg-surface border border-border rounded-lg px-4 py-3"
              onPress={() => setShowCityPicker(!showCityPicker)}
            >
              <Text className={selectedCity ? 'text-text-primary text-base' : 'text-text-muted text-base'}>
                {selectedCity ? getCityLabel(selectedCity) : t('onboardingCityPlaceholder')}
              </Text>
            </TouchableOpacity>

            {showCityPicker && (
              <View className="bg-surface border border-border rounded-lg mt-1 overflow-hidden">
                {cities.map((city) => {
                  const label = i18n.language === 'en' ? (city.nameEn || city.nameRu) : i18n.language === 'ka' ? (city.nameKa || city.nameRu) : city.nameRu;
                  const value = city.nameRu;
                  return (
                    <TouchableOpacity
                      key={city.id}
                      className={`px-4 py-3 border-b border-border ${selectedCity === value ? 'bg-primary/10' : ''}`}
                      onPress={() => {
                        setSelectedCity(value);
                        setShowCityPicker(false);
                      }}
                    >
                      <Text className={selectedCity === value ? 'text-primary font-medium' : 'text-text-primary'}>
                        {label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          </View>
        </View>

        {/* Actions */}
        <View className="mt-8 gap-3">
          <Button
            title={t('onboardingSubmit')}
            onPress={handleSubmit}
            loading={loading}
            size="lg"
          />
          <Button
            title={t('onboardingSkip')}
            onPress={handleSkip}
            variant="ghost"
            size="md"
            disabled={loading}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
