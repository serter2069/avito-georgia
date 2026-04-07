import { View, Text, ScrollView, Switch, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { colors } from '../../lib/colors';

interface Settings {
  autoModerationEnabled: boolean;
  bannedWords: string[];
}

export default function AdminSettings() {
  const { t } = useTranslation();
  const [settings, setSettings] = useState<Settings>({ autoModerationEnabled: false, bannedWords: [] });
  const [bannedWordsText, setBannedWordsText] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get<Settings>('/admin/settings').then((res) => {
      if (res.ok && res.data) {
        setSettings(res.data);
        setBannedWordsText(res.data.bannedWords.join('\n'));
      }
      setLoading(false);
    });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    const bannedWords = bannedWordsText
      .split('\n')
      .map((w) => w.trim().toLowerCase())
      .filter((w) => w.length > 0);

    const res = await api.patch('/admin/settings', {
      autoModerationEnabled: settings.autoModerationEnabled,
      bannedWords,
    });

    setSaving(false);
    if (res.ok) {
      setSettings((prev) => ({ ...prev, bannedWords }));
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
    <ScrollView className="flex-1" contentContainerClassName="p-4 gap-4">
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
            trackColor={{ false: colors.border, true: colors.brandPrimary }}
            thumbColor={colors.textPrimary}
          />
        </View>
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

      {/* Save button */}
      <TouchableOpacity
        className="bg-primary rounded-lg py-3 items-center"
        onPress={handleSave}
        disabled={saving}
      >
        {saving ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text className="text-white font-semibold text-base">{t('save')}</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}
