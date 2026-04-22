import { Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Terms from '../../components/screens/Terms';

export default function TermsPage() {
  return (
    <SafeAreaView edges={['top']} style={{ flex: 1 }}>
      <Stack.Screen options={{ headerShown: true, title: 'Условия использования' }} />
      <Terms />
    </SafeAreaView>
  );
}
