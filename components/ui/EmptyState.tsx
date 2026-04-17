import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { colors, spacing } from '../../lib/theme';

interface EmptyStateProps {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ title, subtitle, actionLabel, onAction }: EmptyStateProps) {
  return (
    <View className="items-center justify-center py-12 px-6">
      <View className="rounded-full items-center justify-center" style={{ width: 64, height: 64, backgroundColor: colors.surface, marginBottom: spacing.md }}>
        <Text style={{ fontSize: 24, color: colors.textSecondary }}>0</Text>
      </View>
      <Text className="text-base font-semibold text-center" style={{ color: colors.text }}>{title}</Text>
      {subtitle && (
        <Text className="text-center mt-1" style={{ color: colors.textSecondary, fontSize: 14, maxWidth: 280 }}>
          {subtitle}
        </Text>
      )}
      {actionLabel && onAction && (
        <Pressable
          onPress={onAction}
          className="mt-4 rounded-lg"
          style={{ backgroundColor: colors.primary, paddingHorizontal: 24, paddingVertical: 11 }}
        >
          <Text style={{ color: '#FFFFFF', fontSize: 15, fontWeight: '600' }}>{actionLabel}</Text>
        </Pressable>
      )}
    </View>
  );
}
