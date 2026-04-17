import React from 'react';
import { View, Text, TextInput, KeyboardTypeOptions } from 'react-native';
import { colors, spacing } from '../../lib/theme';

interface InputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  secureTextEntry?: boolean;
  multiline?: boolean;
  keyboardType?: KeyboardTypeOptions;
}

export function Input({ label, placeholder, value, onChangeText, error, secureTextEntry, multiline, keyboardType }: InputProps) {
  return (
    <View style={{ gap: spacing.xs }}>
      {label && <Text style={{ fontSize: 14, fontWeight: '600', color: colors.text }}>{label}</Text>}
      <TextInput
        placeholder={placeholder}
        placeholderTextColor={colors.textSecondary}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        multiline={multiline}
        keyboardType={keyboardType}
        style={{
          fontSize: 16,
          color: colors.text,
          borderWidth: 1,
          borderColor: error ? colors.error : '#C8E0E8',
          borderRadius: 10,
          paddingHorizontal: 14,
          paddingVertical: 12,
          backgroundColor: colors.background,
          minHeight: multiline ? 100 : 48,
          textAlignVertical: multiline ? 'top' : 'center',
          outlineWidth: 0,
        }}
      />
      {error && <Text style={{ fontSize: 12, color: colors.error }}>{error}</Text>}
    </View>
  );
}
