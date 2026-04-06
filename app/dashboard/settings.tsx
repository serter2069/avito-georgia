import { View, Text, ScrollView, TouchableOpacity, Switch, Platform, Alert, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../stores/authStore';
import { api } from '../../lib/api';
import { setStoredLang } from '../../lib/i18n';
import { colors } from '../../lib/colors';
import { Ionicons } from '@expo/vector-icons';

const LANGUAGES = [
  { code: 'ru', label: 'RU', name: 'Русский' },
  { code: 'en', label: 'EN', name: 'English' },
  { code: 'ka', label: 'KA', name: 'ქართული' },
] as const;

type NotifPrefType = 'new_message' | 'price_drop' | 'moderation_update';

interface NotifPref {
  type: NotifPrefType;
  enabled: boolean;
}

export default function SettingsScreen() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const logout = useAuthStore((s) => s.logout);
  const deleteAccount = useAuthStore((s) => s.deleteAccount);
  const updateLocale = useAuthStore((s) => s.updateLocale);

  const [notifPrefs, setNotifPrefs] = useState<NotifPref[]>([]);
  const [notifLoading, setNotifLoading] = useState(true);
  const [togglingPref, setTogglingPref] = useState<NotifPrefType | null>(null);
  const [deletingAccount, setDeletingAccount] = useState(false);

  // Fetch notification preferences from API on mount
  const fetchNotifPrefs = useCallback(async () => {
    setNotifLoading(true);
    try {
      const res = await api.get<{ prefs: NotifPref[] }>('/users/me/notification-prefs');
      if (res.ok && res.data) {
        setNotifPrefs(res.data.prefs);
      }
    } catch {
      // Non-critical — silent failure, prefs will show as loading
    } finally {
      setNotifLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifPrefs();
  }, [fetchNotifPrefs]);

  const toggleNotifPref = async (type: NotifPrefType, value: boolean) => {
    if (togglingPref === type) return;
    // Optimistic update
    setNotifPrefs((prev) =>
      prev.map((p) => (p.type === type ? { ...p, enabled: value } : p))
    );
    setTogglingPref(type);
    try {
      await api.put('/users/me/notification-prefs', { type, enabled: value });
    } catch {
      // Revert on failure
      setNotifPrefs((prev) =>
        prev.map((p) => (p.type === type ? { ...p, enabled: !value } : p))
      );
    } finally {
      setTogglingPref(null);
    }
  };

  const switchLanguage = async (lang: string) => {
    // Apply locally first (instant feedback)
    await i18n.changeLanguage(lang);
    await setStoredLang(lang);
    // Persist to backend — optimistic, non-blocking
    updateLocale(lang);
  };

  const handleLogout = async () => {
    await logout();
    router.replace('/(auth)');
  };

  const confirmDeleteAccount = () => {
    const title = t('deleteAccount');
    const message = t('deleteAccountConfirmMessage');

    if (Platform.OS === 'web') {
      if (window.confirm(`${title}\n\n${message}`)) {
        handleDeleteAccount();
      }
    } else {
      Alert.alert(
        title,
        message,
        [
          { text: t('cancel'), style: 'cancel' },
          {
            text: t('deleteAccount'),
            style: 'destructive',
            onPress: handleDeleteAccount,
          },
        ]
      );
    }
  };

  const handleDeleteAccount = async () => {
    if (deletingAccount) return;
    setDeletingAccount(true);
    try {
      await deleteAccount();
      router.replace('/(auth)');
    } catch {
      setDeletingAccount(false);
      if (Platform.OS === 'web') {
        window.alert(t('deleteAccountError'));
      } else {
        Alert.alert(t('error'), t('deleteAccountError'));
      }
    }
  };

  const notifPrefLabel = (type: NotifPrefType): string => {
    switch (type) {
      case 'new_message': return t('notifNewMessage');
      case 'price_drop': return t('notifPriceDrop');
      case 'moderation_update': return t('notifModerationUpdate');
    }
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
          {notifLoading ? (
            <View className="bg-surface-card rounded-lg border border-border px-4 py-4 items-center">
              <ActivityIndicator size="small" color={colors.brandPrimary} />
            </View>
          ) : (
            <View className="bg-surface-card rounded-lg border border-border overflow-hidden">
              {notifPrefs.map((pref, idx) => (
                <View
                  key={pref.type}
                  className={`px-4 py-3 flex-row items-center justify-between ${
                    idx < notifPrefs.length - 1 ? 'border-b border-border' : ''
                  }`}
                >
                  <Text className="text-text-primary text-base flex-1 mr-3">
                    {notifPrefLabel(pref.type)}
                  </Text>
                  <Switch
                    value={pref.enabled}
                    onValueChange={(val) => toggleNotifPref(pref.type, val)}
                    trackColor={{ false: colors.borderDefault, true: colors.brandPrimary }}
                    thumbColor={colors.white}
                    disabled={togglingPref === pref.type}
                  />
                </View>
              ))}
            </View>
          )}
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
                  <Ionicons name="checkmark" size={20} color={colors.brandPrimary} />
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

        {/* Delete account (GDPR) */}
        <View className="px-4 mt-3 mb-8">
          <TouchableOpacity
            className="rounded-lg px-4 py-3 items-center"
            onPress={confirmDeleteAccount}
            activeOpacity={0.7}
            disabled={deletingAccount}
          >
            <Text className="text-text-muted text-sm">
              {deletingAccount ? t('deleting') : t('deleteAccount')}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
