import { Stack } from 'expo-router';

export default function DashboardListingsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#F2F8FA' },
      }}
    />
  );
}
