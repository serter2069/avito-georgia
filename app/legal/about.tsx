import { Stack } from 'expo-router';
import About from '../../components/screens/About';

export default function AboutPage() {
  return (
    <>
      <Stack.Screen options={{ headerShown: true, title: 'О нас' }} />
      <About />
    </>
  );
}
