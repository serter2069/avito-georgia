import { useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import Reviews from '../../../components/screens/Reviews';
import { apiFetch } from '../../../lib/api';

export default function ReviewsPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [reviews, setReviews] = useState<any[]>([]);
  const [avgRating, setAvgRating] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    apiFetch(`/reviews?subjectId=${id}&limit=50`)
      .then(r => {
        setReviews(r.reviews || []);
        setAvgRating(r.avgRating || 0);
        setTotal(r.total || 0);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <SafeAreaView edges={['top']} style={{ flex: 1 }}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator />
      </View>
      </SafeAreaView>
    );
  }

  return <SafeAreaView edges={['top']} style={{ flex: 1 }}><Reviews reviews={reviews} avgRating={avgRating} total={total} /></SafeAreaView>;
}
