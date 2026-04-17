import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { colors, spacing } from '../../lib/theme';

interface EmptyStateProps {
  icon: string;
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ icon, title, subtitle, actionLabel, onAction }: EmptyStateProps) {
  return (
    <View className="items-center justify-center py-16 px-6">
      <Text style={{ fontSize: 48, marginBottom: spacing.md }}>{icon}</Text>
      <Text className="text-lg font-bold" style={{ color: colors.text }}>{title}</Text>
      {subtitle && (
        <Text className="text-center mt-1" style={{ color: colors.textSecondary, fontSize: 14, maxWidth: 280 }}>
          {subtitle}
        </Text>
      )}
      {actionLabel && onAction && (
        <Pressable
          onPress={onAction}
          className="mt-6 rounded-lg"
          style={{ backgroundColor: colors.primary, paddingHorizontal: 24, paddingVertical: 12 }}
        >
          <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: '700' }}>{actionLabel}</Text>
        </Pressable>
      )}
    </View>
  );
}
