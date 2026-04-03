import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { api } from '../../lib/api';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

export default function ProfileScreen() {
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    // User fields from authStore only have id, email, role
    // Name and phone are on the DB user but not returned by verify-otp
    // Try to load full profile if /auth/me endpoint exists
    const loadProfile = async () => {
      const res = await api.get<{ user: { id: string; email: string; name: string | null; phone: string | null } }>('/auth/me');
      if (res.ok && res.data) {
        setName(res.data.user.name || '');
        setPhone(res.data.user.phone || '');
      }
    };
    loadProfile();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    const res = await api.patch('/users/me', { name: name.trim() || null, phone: phone.trim() || null });
    if (res.ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
    setSaving(false);
  };

  const getInitials = () => {
    if (name) {
      return name
        .split(' ')
        .map((w) => w[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    if (user?.email) return user.email[0].toUpperCase();
    return '?';
  };

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="bg-bg-section border-b border-border px-4 py-3">
        <Text className="text-text-primary text-lg font-bold">{t('profile')}</Text>
      </View>

      <ScrollView className="flex-1" contentContainerClassName="p-4 gap-5">
        {/* Avatar */}
        <View className="items-center py-4">
          <View className="w-20 h-20 rounded-full bg-primary/20 items-center justify-center mb-3">
            <Text className="text-primary text-2xl font-bold">{getInitials()}</Text>
          </View>
          <Text className="text-text-secondary text-sm">{user?.email}</Text>
        </View>

        {/* Name */}
        <Input
          label={t('nickname')}
          value={name}
          onChangeText={setName}
          placeholder={t('nickname')}
          autoCapitalize="words"
        />

        {/* Phone */}
        <Input
          label={t('phone')}
          value={phone}
          onChangeText={setPhone}
          placeholder="+995..."
          keyboardType="phone-pad"
        />

        {/* Email (read-only) */}
        <Input
          label={t('email')}
          value={user?.email || ''}
          onChangeText={() => {}}
          editable={false}
        />

        {/* Save button */}
        <Button
          title={saved ? t('done') : t('save')}
          onPress={handleSave}
          loading={saving}
          variant={saved ? 'secondary' : 'primary'}
        />
      </ScrollView>
    </View>
  );
}
