import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { colors, spacing } from '../../lib/theme';

interface LoadingStateProps {
  variant: 'spinner' | 'skeleton';
  lines?: number;
}

export function LoadingState({ variant, lines = 3 }: LoadingStateProps) {
  if (variant === 'spinner') {
    return (
      <View className="items-center justify-center py-16">
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }
  return (
    <View style={{ padding: spacing.md, gap: spacing.sm }}>
      {Array.from({ length: lines }).map((_, i) => (
        <View
          key={i}
          className="rounded-md"
          style={{
            height: i === 0 ? 20 : 14,
            width: i === lines - 1 ? '60%' : '100%',
            backgroundColor: colors.surface,
          }}
        />
      ))}
    </View>
  );
}
