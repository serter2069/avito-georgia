import { Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import About from '../../components/screens/About';

export default function AboutPage() {
  return (
    <SafeAreaView edges={['top']} style={{ flex: 1 }}>
      <Stack.Screen options={{ headerShown: true, title: 'О нас' }} />
      <About />
    </SafeAreaView>
  );
}
