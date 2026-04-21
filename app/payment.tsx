import { Linking } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { apiFetch } from '../lib/api';
import Payment from '../components/screens/Payment';

export default function PaymentPage() {
  const { listingId, type } = useLocalSearchParams<{ listingId: string; type: string }>();

  const handlePay = async (promotionType: string) => {
    const res = await apiFetch('/promotions/purchase', {
      method: 'POST',
      body: JSON.stringify({ listingId, type: promotionType }),
    });
    if (res.url) await Linking.openURL(res.url);
  };

  return <SafeAreaView edges={['top']} style={{ flex: 1 }}><Payment listingId={listingId} promotionType={type} onPay={handlePay} /></SafeAreaView>;
}
