import { Stack } from 'expo-router';

export default function ListingIdLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#F2F8FA' },
      }}
    />
  );
}
