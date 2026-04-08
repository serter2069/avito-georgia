import { useState } from 'react';
import { View, Text, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { api } from '../../lib/api';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function EmailScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { returnTo } = useLocalSearchParams<{ returnTo?: string }>();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError('');

    if (!EMAIL_REGEX.test(email.trim())) {
      setError(t('invalidEmail'));
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/auth/request-otp', { email: email.trim() });

      if (res.ok) {
        const otpUrl = returnTo
          ? `/(auth)/otp?email=${encodeURIComponent(email.trim())}&returnTo=${encodeURIComponent(returnTo)}`
          : `/(auth)/otp?email=${encodeURIComponent(email.trim())}`;
        router.push(otpUrl);
      } else {
        setError(res.error || t('error'));
      }
    } catch {
      setError(t('error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View className="flex-1 justify-center px-6">
        {/* Logo area */}
        <View className="items-center mb-10">
          <Text className="text-primary text-4xl font-bold mb-2">
            {t('authTitle')}
          </Text>
          <Text className="text-text-secondary text-base">
            {t('authSubtitle')}
          </Text>
        </View>

        {/* Email input */}
        <View className="mb-4">
          <Input
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              if (error) setError('');
            }}
            placeholder={t('enterEmail')}
            label={t('email')}
            keyboardType="email-address"
            autoCapitalize="none"
            error={error}
          />
        </View>

        {/* Submit button */}
        <Button
          onPress={handleSubmit}
          title={t('getCode')}
          size="lg"
          loading={loading}
          disabled={!email.trim()}
        />
      </View>
    </KeyboardAvoidingView>
  );
}
