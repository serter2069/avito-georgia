import { useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import EditListing from '../../../components/screens/EditListing';
import { apiFetch } from '../../../lib/api';

export default function EditListingPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [listing, setListing] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;
    apiFetch(`/listings/${id}`)
      .then(r => setListing(r.listing))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const handleSave = async (data: { title: string; price: string }) => {
    setSaving(true);
    try {
      await apiFetch(`/listings/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ title: data.title, price: parseFloat(data.price) || undefined }),
      });
      router.back();
    } catch (e) {
      console.error(e);
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    await apiFetch(`/listings/${id}`, { method: 'DELETE' });
    router.replace('/dashboard/listings' as any);
  };

  if (loading) {
    return (
      <SafeAreaView edges={['top']} style={{ flex: 1 }}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator />
      </View>
      </SafeAreaView>
    );
  }

  return <SafeAreaView edges={['top']} style={{ flex: 1 }}><EditListing listing={listing} onSave={handleSave} onDelete={handleDelete} saving={saving} /></SafeAreaView>;
}
