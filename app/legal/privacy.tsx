import { Stack } from 'expo-router';
import Privacy from '../../components/screens/Privacy';

export default function PrivacyPage() {
  return (
    <>
      <Stack.Screen options={{ headerShown: true, title: 'Политика конфиденциальности' }} />
      <Privacy />
    </>
  );
}
