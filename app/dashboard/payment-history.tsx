import { Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import PaymentHistory from '../../components/screens/PaymentHistory';

export default function PaymentHistoryPage() {
  return (
    <SafeAreaView edges={['top']} style={{ flex: 1 }}>
      <Stack.Screen options={{ headerShown: true, title: 'История платежей' }} />
      <PaymentHistory />
    </SafeAreaView>
  );
}
