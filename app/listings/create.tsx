import { useState } from 'react';
import { useRouter } from 'expo-router';
import CreateListing from '../../components/screens/CreateListing';
import { apiFetch } from '../../lib/api';

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
      router.replace(`/listings/${res.listing.id}` as any);
    } catch (e: any) {
      setError(e.error || 'Ошибка создания объявления');
      setLoading(false);
    }
  };

  return <CreateListing onSubmit={handleSubmit} loading={loading} error={error} />;
}
