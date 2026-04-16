import React, { useState } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAuthStore } from '../../store/auth';
import AuthOtp from '../../components/screens/AuthOtp';
import { apiFetch } from '../../lib/api';

export default function AuthOtpPage() {
  const router = useRouter();
  const { email } = useLocalSearchParams<{ email: string }>();
  const { setUser } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleConfirm = async (code: string) => {
    setLoading(true);
    setError('');
    try {
      const res = await apiFetch('/auth/verify-otp', {
        method: 'POST',
        body: JSON.stringify({ email, code }),
      });
      const initial = (res.user.name || res.user.email || 'Г')[0].toUpperCase();
      setUser({ ...res.user, initial });
      if (!res.user.isOnboarded) {
        router.replace('/auth/onboarding' as any);
      } else {
        router.replace('/' as any);
      }
    } catch (e: any) {
      setError(e.error || 'Неверный код');
    } finally {
      setLoading(false);
    }
  };

  return <AuthOtp email={email || ''} onConfirm={handleConfirm} loading={loading} error={error} />;
}
