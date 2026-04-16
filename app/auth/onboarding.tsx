import { useState } from 'react';
import { useRouter } from 'expo-router';
import Onboarding from '../../components/screens/Onboarding';
import { apiFetch } from '../../lib/api';
import { useAuthStore } from '../../store/auth';

export default function OnboardingPage() {
  const router = useRouter();
  const { fetchMe } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (data: { name: string; city?: string }) => {
    setLoading(true);
    setError('');
    try {
      await apiFetch('/users/me', {
        method: 'PATCH',
        body: JSON.stringify({ name: data.name, isOnboarded: true }),
      });
      await fetchMe();
      router.replace('/' as any);
    } catch (e: any) {
      setError(e.error || 'Ошибка сохранения');
      setLoading(false);
    }
  };

  return <Onboarding onSubmit={handleSubmit} loading={loading} error={error} />;
}
