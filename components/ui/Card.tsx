import React from 'react';
import { View, Pressable } from 'react-native';
import { colors, spacing } from '../../lib/theme';

interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  variant?: 'default' | 'outlined';
  padding?: 'sm' | 'md' | 'lg';
}

const paddingMap = { sm: spacing.sm, md: spacing.md, lg: spacing.lg };

export function Card({ children, onPress, variant = 'default', padding = 'md' }: CardProps) {
  const Wrapper = onPress ? Pressable : View;
  return (
    <Wrapper
      onPress={onPress}
      className="rounded-xl border border-border-light"
      style={{
        backgroundColor: colors.background,
        padding: paddingMap[padding],
        shadowColor: variant === 'default' ? '#000' : 'transparent',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: variant === 'default' ? 0.05 : 0,
        shadowRadius: 2,
        elevation: variant === 'default' ? 1 : 0,
      }}
    >
      {children}
    </Wrapper>
  );
}
