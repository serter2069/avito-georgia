import { View, Text, ScrollView, TouchableOpacity, Switch, Platform } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../stores/authStore';
import { colors } from '../../lib/colors';

// AsyncStorage fallback for web
async function getStoredValue(key: string): Promise<string | null> {
  if (Platform.OS === 'web') {
    return localStorage.getItem(key);
  }
  const AsyncStorage = require('@react-native-async-storage/async-storage').default;
  return AsyncStorage.getItem(key);
}

async function setStoredValue(key: string, value: string): Promise<void> {
  if (Platform.OS === 'web') {
    localStorage.setItem(key, value);
    return;
  }
  const AsyncStorage = require('@react-native-async-storage/async-storage').default;
  await AsyncStorage.setItem(key, value);
}

const LANGUAGES = [
  { code: 'ru', label: 'RU', name: 'Русский' },
  { code: 'en', label: 'EN', name: 'English' },
  { code: 'ka', label: 'KA', name: 'ქართული' },
] as const;

export default function SettingsScreen() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const logout = useAuthStore((s) => s.logout);

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  useEffect(() => {
    getStoredValue('notifications_enabled').then((val) => {
      if (val !== null) setNotificationsEnabled(val === 'true');
    });
  }, []);

  const toggleNotifications = (value: boolean) => {
    setNotificationsEnabled(value);
    setStoredValue('notifications_enabled', String(value));
  };

  const switchLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  const handleLogout = async () => {
    await logout();
    router.replace('/(auth)');
  };

  return (
    <View className="flex-1 bg-dark">
      {/* Header */}
      <View className="bg-dark-secondary border-b border-border px-4 py-3">
        <Text className="text-text-primary text-lg font-bold">{t('settings')}</Text>
      </View>

      <ScrollView className="flex-1" contentContainerClassName="py-4">
        {/* Notifications */}
        <View className="px-4 mb-6">
          <Text className="text-text-secondary text-xs font-semibold uppercase tracking-wider mb-3">
            {t('notifications')}
          </Text>
          <View className="bg-surface-card rounded-lg border border-border px-4 py-3 flex-row items-center justify-between">
            <View className="flex-1 mr-3">
              <Text className="text-text-primary text-base">{t('notifications')}</Text>
              <Text className="text-text-muted text-xs mt-0.5">
                {notificationsEnabled ? t('notificationsEnabled') : t('notificationsDisabled')}
              </Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={toggleNotifications}
              trackColor={{ false: colors.borderDefault, true: colors.brandPrimary }}
              thumbColor={colors.white}
            />
          </View>
        </View>

        {/* Language */}
        <View className="px-4 mb-6">
          <Text className="text-text-secondary text-xs font-semibold uppercase tracking-wider mb-3">
            {t('language')}
          </Text>
          <View className="bg-surface-card rounded-lg border border-border overflow-hidden">
            {LANGUAGES.map((lang, idx) => (
              <TouchableOpacity
                key={lang.code}
                className={`px-4 py-3 flex-row items-center justify-between ${
                  idx < LANGUAGES.length - 1 ? 'border-b border-border' : ''
                }`}
                onPress={() => switchLanguage(lang.code)}
                activeOpacity={0.7}
              >
                <Text className="text-text-primary text-base">{lang.name}</Text>
                {i18n.language === lang.code && (
                  <Text className="text-primary text-base font-bold">{'\u2713'}</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Logout */}
        <View className="px-4 mt-4">
          <TouchableOpacity
            className="bg-error/10 border border-error/30 rounded-lg px-4 py-3 items-center"
            onPress={handleLogout}
            activeOpacity={0.7}
          >
            <Text className="text-error text-base font-semibold">{t('logout')}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
