import React from 'react';
import { Text, Pressable, ActivityIndicator } from 'react-native';
import { colors, radius } from '../../lib/theme';

interface ButtonProps {
  variant: 'primary' | 'secondary' | 'destructive';
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
}

const variantStyles = {
  primary: { bg: colors.primary, text: '#FFFFFF', border: 'transparent' as const },
  secondary: { bg: 'transparent', text: colors.primary, border: colors.primary },
  destructive: { bg: colors.error, text: '#FFFFFF', border: 'transparent' as const },
};

export function Button({ variant, label, onPress, loading, disabled, fullWidth }: ButtonProps) {
  const s = variantStyles[variant];
  return (
    <Pressable
      onPress={disabled || loading ? undefined : onPress}
      className={`${radius.md} flex-row items-center justify-center`}
      style={{
        backgroundColor: s.bg,
        borderWidth: 1,
        borderColor: s.border,
        height: 48,
        opacity: disabled ? 0.5 : 1,
        width: fullWidth ? '100%' : undefined,
        paddingHorizontal: 24,
      }}
    >
      {loading ? (
        <ActivityIndicator color={s.text} size="small" />
      ) : (
        <Text style={{ color: s.text, fontSize: 16, fontWeight: '700' }}>{label}</Text>
      )}
    </Pressable>
  );
}
