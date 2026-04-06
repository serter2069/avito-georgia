import { View, Text, ScrollView, TouchableOpacity, Alert, Image, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { useAuthStore } from '../../stores/authStore';
import { api, apiUpload } from '../../lib/api';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { colors } from '../../lib/colors';

export default function ProfileScreen() {
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  useEffect(() => {
    // User fields from authStore only have id, email, role
    // Name and phone are on the DB user but not returned by verify-otp
    // Try to load full profile if /auth/me endpoint exists
    const loadProfile = async () => {
      const res = await api.get<{ user: { id: string; email: string; name: string | null; phone: string | null; avatarUrl: string | null } }>('/auth/me');
      if (res.ok && res.data) {
        setName(res.data.user.name || '');
        setPhone(res.data.user.phone || '');
        setAvatarUrl(res.data.user.avatarUrl || null);
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

  const handlePickAvatar = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: false,
      quality: 0.8,
    });

    if (result.canceled || !result.assets?.length) return;

    const asset = result.assets[0];
    // Optimistic update
    setAvatarUrl(asset.uri);
    setUploadingAvatar(true);

    try {
      const formData = new FormData();
      const blob: any = {
        uri: asset.uri,
        type: asset.mimeType || 'image/jpeg',
        name: asset.fileName || 'avatar.jpg',
      };
      formData.append('avatar', blob);

      const res = await apiUpload<{ avatarUrl: string }>('/users/avatar', formData);
      if (res.ok && res.data?.avatarUrl) {
        setAvatarUrl(res.data.avatarUrl);
      } else {
        Alert.alert(t('error'), res.error || t('error'));
        // Revert optimistic update on failure
        setAvatarUrl(null);
      }
    } catch {
      Alert.alert(t('error'), t('error'));
      setAvatarUrl(null);
    } finally {
      setUploadingAvatar(false);
    }
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
    <View className="flex-1 bg-dark">
      {/* Header */}
      <View className="bg-dark-secondary border-b border-border px-4 py-3">
        <Text className="text-text-primary text-lg font-bold">{t('profile')}</Text>
      </View>

      <ScrollView className="flex-1" contentContainerClassName="p-4 gap-5">
        {/* Avatar */}
        <View className="items-center py-4">
          <TouchableOpacity onPress={handlePickAvatar} disabled={uploadingAvatar} className="mb-3">
            <View className="w-20 h-20 rounded-full overflow-hidden bg-primary/20 items-center justify-center">
              {avatarUrl ? (
                <Image
                  source={{ uri: avatarUrl }}
                  style={{ width: 80, height: 80 }}
                  resizeMode="cover"
                />
              ) : (
                <Text className="text-primary text-2xl font-bold">{getInitials()}</Text>
              )}
              {uploadingAvatar && (
                <View className="absolute inset-0 bg-black/50 items-center justify-center">
                  <ActivityIndicator color={colors.white} size="small" />
                </View>
              )}
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={handlePickAvatar} disabled={uploadingAvatar}>
            <Text className="text-primary text-sm font-medium">
              {uploadingAvatar ? t('loading') : t('changePhoto')}
            </Text>
          </TouchableOpacity>
          <Text className="text-text-secondary text-sm mt-1">{user?.email}</Text>
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
