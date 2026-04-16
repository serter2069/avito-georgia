import React, { useState } from 'react';
import { useRouter } from 'expo-router';
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
    } catch (e: any) {
      setError(e.error || 'Ошибка отправки кода');
    } finally {
      setLoading(false);
    }
  };

  return <AuthEmail onSubmit={handleSubmit} loading={loading} error={error} />;
}
