import { View, TextInput, Text } from 'react-native';
import { useState } from 'react';
import { colors } from '../../lib/colors';

interface InputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  multiline?: boolean;
  numberOfLines?: number;
  editable?: boolean;
}

export function Input({
  value,
  onChangeText,
  placeholder,
  label,
  error,
  secureTextEntry,
  keyboardType = 'default',
  autoCapitalize = 'none',
  multiline = false,
  numberOfLines = 1,
  editable = true,
}: InputProps) {
  const [focused, setFocused] = useState(false);

  const borderClass = error
    ? 'border-error'
    : focused
      ? 'border-border-focus'
      : 'border-border';

  return (
    <View className="w-full">
      {label && (
        <Text className="text-text-secondary text-sm mb-1 font-medium">{label}</Text>
      )}
      <TextInput
        className={`bg-surface border ${borderClass} rounded-lg px-4 py-3 text-text-primary text-base ${!editable ? 'opacity-50' : ''}`}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        multiline={multiline}
        numberOfLines={numberOfLines}
        editable={editable}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
      {error && (
        <Text className="text-error text-xs mt-1">{error}</Text>
      )}
    </View>
  );
}
