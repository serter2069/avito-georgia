import { Stack } from 'expo-router';
import { colors } from '../../../../lib/colors';

export default function ListingIdLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.bgPrimary },
      }}
    />
  );
}
