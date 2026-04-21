import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import AuthEmail from '../../components/screens/AuthEmail';
import { apiFetch } from '../../lib/api';

export default function AuthEmailPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (email: string) => {
    setLoading(true);
    setError('');
    try {
      await apiFetch('/auth/request-otp', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });
      router.push({ pathname: '/auth/otp', params: { email } } as any);
    } catch (e: unknown) {
      setError((e as { error?: string })?.error || 'Ошибка отправки кода');
    } finally {
      setLoading(false);
    }
  };

  return <SafeAreaView edges={['top']} style={{ flex: 1 }}><AuthEmail onSubmit={handleSubmit} loading={loading} error={error} /></SafeAreaView>;
}
