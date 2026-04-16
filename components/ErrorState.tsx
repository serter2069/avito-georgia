import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export function ErrorState({
  message = 'Что-то пошло не так',
  onRetry
}: {
  message?: string;
  onRetry?: () => void
}) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32, gap: 16 }}>
      <Ionicons name="alert-circle-outline" size={48} color="#9E9E9E" />
      <Text style={{ fontSize: 16, color: '#1A1A1A', textAlign: 'center', lineHeight: 24 }}>{message}</Text>
      {onRetry && (
        <Pressable
          onPress={onRetry}
          style={{ backgroundColor: '#00AA6C', borderRadius: 10, paddingHorizontal: 24, paddingVertical: 12 }}
        >
          <Text style={{ color: '#fff', fontWeight: '700', fontSize: 15 }}>Повторить</Text>
        </Pressable>
      )}
    </View>
  );
}
