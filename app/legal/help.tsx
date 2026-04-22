import { Stack } from 'expo-router';
import Help from '../../components/screens/Help';

export default function HelpPage() {
  return (
    <>
      <Stack.Screen options={{ headerShown: true, title: 'Помощь' }} />
      <Help />
    </>
  );
}
