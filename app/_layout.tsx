import '../global.css';
import '../lib/i18n';
import { Stack } from 'expo-router';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <View className="flex-1 bg-dark w-full self-center" style={{ maxWidth: 430 }}>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#0f0f1a' },
        }}
      />
    </View>
  );
}
