import React from 'react';
import { View, Text } from 'react-native';
import { colors, spacing } from '../../lib/theme';

interface BadgeProps {
  variant: 'error' | 'success' | 'warning' | 'info';
  label: string;
  size?: 'sm' | 'md';
}

const bgMap = { error: colors.error, success: colors.success, warning: colors.warning, info: colors.primary };
const textMap = { error: '#FFFFFF', success: '#FFFFFF', warning: '#FFFFFF', info: '#FFFFFF' };

export function Badge({ variant, label, size = 'sm' }: BadgeProps) {
  return (
    <View
      className="rounded-full"
      style={{
        backgroundColor: bgMap[variant],
        paddingHorizontal: size === 'sm' ? spacing.sm : spacing.md,
        paddingVertical: size === 'sm' ? 2 : spacing.xs,
      }}
    >
      <Text style={{ color: textMap[variant], fontSize: size === 'sm' ? 11 : 13, fontWeight: '600' }}>
        {label}
      </Text>
    </View>
  );
}
