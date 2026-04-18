import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../lib/theme';

export function ErrorState({
  message = 'Что-то пошло не так',
  onRetry
}: {
  message?: string;
  onRetry?: () => void
}) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32, gap: 16 }}>
      <Ionicons name="alert-circle-outline" size={48} color={colors.textSecondary} />
      <Text style={{ fontSize: 16, color: colors.text, textAlign: 'center', lineHeight: 24 }}>{message}</Text>
      {onRetry && (
        <Pressable
          onPress={onRetry}
          accessibilityLabel="Повторить"
          style={{ backgroundColor: colors.primary, borderRadius: 10, paddingHorizontal: 24, paddingVertical: 12 }}
        >
          <Text style={{ color: '#fff', fontWeight: '700', fontSize: 15 }}>Повторить</Text>
        </Pressable>
      )}
    </View>
  );
}
