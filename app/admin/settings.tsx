import { View, Text, ScrollView, Switch, TextInput, TouchableOpacity, ActivityIndicator, Alert, useWindowDimensions } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { colors } from '../../lib/colors';

interface Settings {
  autoModerationEnabled: boolean;
  bannedWords: string[];
  listingExpiryDays: number;
}

export default function AdminSettings() {
  const { t } = useTranslation();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;
  const [settings, setSettings] = useState<Settings>({ autoModerationEnabled: false, bannedWords: [], listingExpiryDays: 30 });
  const [bannedWordsText, setBannedWordsText] = useState('');
  const [listingExpiryDaysText, setListingExpiryDaysText] = useState('30');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get<Settings>('/admin/settings').then((res) => {
      if (res.ok && res.data) {
        setSettings(res.data);
        setBannedWordsText(res.data.bannedWords.join('\n'));
        setListingExpiryDaysText(String(res.data.listingExpiryDays));
      }
      setLoading(false);
    });
  }, []);

  const handleSave = async () => {
    const expiryDays = parseInt(listingExpiryDaysText, 10);
    if (isNaN(expiryDays) || expiryDays < 1 || expiryDays > 365) {
      Alert.alert(t('error'), t('listingExpiryDaysInvalid'));
      return;
    }

    setSaving(true);
    const bannedWords = bannedWordsText
      .split('\n')
      .map((w) => w.trim().toLowerCase())
      .filter((w) => w.length > 0);

    const res = await api.patch('/admin/settings', {
      autoModerationEnabled: settings.autoModerationEnabled,
      bannedWords,
      listingExpiryDays: expiryDays,
    });

    setSaving(false);
    if (res.ok) {
      setSettings((prev) => ({ ...prev, bannedWords, listingExpiryDays: expiryDays }));
      Alert.alert(t('success'), t('settingsSaved'));
    } else {
      Alert.alert(t('error'), t('settingsSaveError'));
    }
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color={colors.brandPrimary} />
      </View>
    );
  }

  return (
    <ScrollView className="flex-1" contentContainerStyle={isDesktop ? { padding: 24, gap: 16, maxWidth: 1000, alignSelf: 'center', width: '100%' } : { padding: 16, gap: 16 }}>
      {isDesktop ? (
        /* Desktop: 2 sections side by side */
        <View style={{ flexDirection: 'row', gap: 16, alignItems: 'flex-start' }}>
          {/* Left column */}
          <View style={{ flex: 1, gap: 16 }}>
            {/* Auto-moderation toggle */}
            <View className="bg-surface-card border border-border rounded-lg p-4">
              <Text className="text-text-primary text-base font-bold mb-1">{t('autoModerationTitle')}</Text>
              <Text className="text-text-muted text-sm mb-4">{t('autoModerationDesc')}</Text>
              <View className="flex-row items-center justify-between">
                <Text className="text-text-primary text-sm">
                  {settings.autoModerationEnabled ? t('autoModerationOn') : t('autoModerationOff')}
                </Text>
                <Switch
                  value={settings.autoModerationEnabled}
                  onValueChange={(val) => setSettings((prev) => ({ ...prev, autoModerationEnabled: val }))}
                  trackColor={{ false: colors.borderDefault, true: colors.brandPrimary }}
                  thumbColor={colors.textPrimary}
                />
              </View>
            </View>

            {/* Listing expiry days */}
            <View className="bg-surface-card border border-border rounded-lg p-4">
              <Text className="text-text-primary text-base font-bold mb-1">{t('listingExpiryDaysTitle')}</Text>
              <Text className="text-text-muted text-sm mb-3">{t('listingExpiryDaysDesc')}</Text>
              <TextInput
                className="bg-surface border border-border rounded-lg p-3 text-text-primary text-sm"
                keyboardType="number-pad"
                value={listingExpiryDaysText}
                onChangeText={setListingExpiryDaysText}
                placeholder="30"
                placeholderTextColor={colors.textMuted}
                maxLength={3}
              />
              <Text className="text-text-muted text-xs mt-2">{t('listingExpiryDaysHint')}</Text>
            </View>
          </View>

          {/* Right column */}
          <View style={{ flex: 1, gap: 16 }}>
            {/* Banned words */}
            <View className="bg-surface-card border border-border rounded-lg p-4">
              <Text className="text-text-primary text-base font-bold mb-1">{t('bannedWordsTitle')}</Text>
              <Text className="text-text-muted text-sm mb-3">{t('bannedWordsDesc')}</Text>
              <TextInput
                className="bg-surface border border-border rounded-lg p-3 text-text-primary text-sm"
                multiline
                numberOfLines={8}
                value={bannedWordsText}
                onChangeText={setBannedWordsText}
                placeholder={t('bannedWordsPlaceholder')}
                placeholderTextColor={colors.textMuted}
                textAlignVertical="top"
                style={{ minHeight: 160 }}
              />
              <Text className="text-text-muted text-xs mt-2">{t('bannedWordsHint')}</Text>
            </View>
          </View>
        </View>
      ) : (
        /* Mobile: stacked */
        <>
          {/* Auto-moderation toggle */}
          <View className="bg-surface-card border border-border rounded-lg p-4">
            <Text className="text-text-primary text-base font-bold mb-1">{t('autoModerationTitle')}</Text>
            <Text className="text-text-muted text-sm mb-4">{t('autoModerationDesc')}</Text>
            <View className="flex-row items-center justify-between">
              <Text className="text-text-primary text-sm">
                {settings.autoModerationEnabled ? t('autoModerationOn') : t('autoModerationOff')}
              </Text>
              <Switch
                value={settings.autoModerationEnabled}
                onValueChange={(val) => setSettings((prev) => ({ ...prev, autoModerationEnabled: val }))}
                trackColor={{ false: colors.borderDefault, true: colors.brandPrimary }}
                thumbColor={colors.textPrimary}
              />
            </View>
          </View>

          {/* Listing expiry days */}
          <View className="bg-surface-card border border-border rounded-lg p-4">
            <Text className="text-text-primary text-base font-bold mb-1">{t('listingExpiryDaysTitle')}</Text>
            <Text className="text-text-muted text-sm mb-3">{t('listingExpiryDaysDesc')}</Text>
            <TextInput
              className="bg-surface border border-border rounded-lg p-3 text-text-primary text-sm"
              keyboardType="number-pad"
              value={listingExpiryDaysText}
              onChangeText={setListingExpiryDaysText}
              placeholder="30"
              placeholderTextColor={colors.textMuted}
              maxLength={3}
            />
            <Text className="text-text-muted text-xs mt-2">{t('listingExpiryDaysHint')}</Text>
          </View>

          {/* Banned words */}
          <View className="bg-surface-card border border-border rounded-lg p-4">
            <Text className="text-text-primary text-base font-bold mb-1">{t('bannedWordsTitle')}</Text>
            <Text className="text-text-muted text-sm mb-3">{t('bannedWordsDesc')}</Text>
            <TextInput
              className="bg-surface border border-border rounded-lg p-3 text-text-primary text-sm"
              multiline
              numberOfLines={8}
              value={bannedWordsText}
              onChangeText={setBannedWordsText}
              placeholder={t('bannedWordsPlaceholder')}
              placeholderTextColor={colors.textMuted}
              textAlignVertical="top"
              style={{ minHeight: 160 }}
            />
            <Text className="text-text-muted text-xs mt-2">{t('bannedWordsHint')}</Text>
          </View>
        </>
      )}

      {/* Save button */}
      <TouchableOpacity
        className="bg-primary rounded-lg py-3 items-center"
        onPress={handleSave}
        disabled={saving}
      >
        {saving ? (
          <ActivityIndicator size="small" color={colors.white} />
        ) : (
          <Text className="text-white font-semibold text-base">{t('save')}</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}
