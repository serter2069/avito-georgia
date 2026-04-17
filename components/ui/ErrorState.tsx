import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { colors, spacing } from '../../lib/theme';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({ message = 'Something went wrong', onRetry }: ErrorStateProps) {
  return (
    <View className="items-center justify-center py-12 px-6">
      <View className="rounded-full items-center justify-center" style={{ width: 64, height: 64, backgroundColor: '#FEE2E2', marginBottom: spacing.md }}>
        <Text style={{ fontSize: 28, fontWeight: '700', color: colors.error }}>!</Text>
      </View>
      <Text className="text-base font-semibold text-center" style={{ color: colors.text }}>{message}</Text>
      {onRetry && (
        <Pressable
          onPress={onRetry}
          className="mt-4 rounded-lg"
          style={{ backgroundColor: colors.primary, paddingHorizontal: 24, paddingVertical: 11 }}
        >
          <Text style={{ color: '#FFFFFF', fontSize: 15, fontWeight: '600' }}>Try again</Text>
        </Pressable>
      )}
    </View>
  );
}
