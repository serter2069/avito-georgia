import { Stack } from 'expo-router';
import PaymentHistory from '../../components/screens/PaymentHistory';

export default function PaymentHistoryPage() {
  return (
    <>
      <Stack.Screen options={{ headerShown: true, title: 'История платежей' }} />
      <PaymentHistory />
    </>
  );
}
