import { useState } from 'react';
import { useRouter, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import CreateListing from '../../components/screens/CreateListing';
import { apiFetch } from '../../lib/api';

const API_BASE = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3813';

export default function CreateListingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (data: {
    title: string;
    price: string;
    categoryId: string;
    cityId: string;
    description?: string;
    selectedFiles?: File[];
  }) => {
    setLoading(true);
    setError('');
    try {
      const res = await apiFetch('/listings', {
        method: 'POST',
        body: JSON.stringify({
          title: data.title,
          price: parseFloat(data.price) || undefined,
          currency: 'GEL',
          categoryId: data.categoryId,
          cityId: data.cityId,
          description: data.description,
        }),
      });

      const listingId: string = res.listing.id;

      // Upload photos after listing creation
      if (data.selectedFiles && data.selectedFiles.length > 0) {
        const fd = new FormData();
        data.selectedFiles.forEach(f => fd.append('photos', f));
        await fetch(`${API_BASE}/api/listings/${listingId}/photos`, {
          method: 'POST',
          credentials: 'include',
          body: fd,
        });
      }

      router.replace(`/listings/${listingId}` as any);
    } catch (e: unknown) {
      setError((e as { error?: string })?.error || 'Ошибка создания объявления');
      setLoading(false);
    }
  };

  return <SafeAreaView edges={['top']} style={{ flex: 1 }}><Stack.Screen options={{ headerShown: true, title: 'Новое объявление' }} /><CreateListing onSubmit={handleSubmit} loading={loading} error={error} /></SafeAreaView>;
}
