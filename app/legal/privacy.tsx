import { Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Privacy from '../../components/screens/Privacy';

export default function PrivacyPage() {
  return (
    <SafeAreaView edges={['top']} style={{ flex: 1 }}>
      <Stack.Screen options={{ headerShown: true, title: 'Политика конфиденциальности' }} />
      <Privacy />
    </SafeAreaView>
  );
}
