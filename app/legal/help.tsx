import { Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Help from '../../components/screens/Help';

export default function HelpPage() {
  return (
    <SafeAreaView edges={['top']} style={{ flex: 1 }}>
      <Stack.Screen options={{ headerShown: true, title: 'Помощь' }} />
      <Help />
    </SafeAreaView>
  );
}
