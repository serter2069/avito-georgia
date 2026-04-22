import { Stack } from 'expo-router';
import Terms from '../../components/screens/Terms';

export default function TermsPage() {
  return (
    <>
      <Stack.Screen options={{ headerShown: true, title: 'Условия использования' }} />
      <Terms />
    </>
  );
}
