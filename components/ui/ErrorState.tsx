import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { colors, spacing } from '../../lib/theme';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({ message = 'Something went wrong', onRetry }: ErrorStateProps) {
  return (
    <View className="items-center justify-center py-16 px-6">
      <Text style={{ fontSize: 48, marginBottom: spacing.md }}>!</Text>
      <Text className="text-lg font-bold" style={{ color: colors.error }}>{message}</Text>
      {onRetry && (
        <Pressable
          onPress={onRetry}
          className="mt-6 rounded-lg"
          style={{ backgroundColor: colors.primary, paddingHorizontal: 24, paddingVertical: 12 }}
        >
          <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: '700' }}>Try again</Text>
        </Pressable>
      )}
    </View>
  );
}
