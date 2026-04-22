import React from 'react';
import { View, Text, Image } from 'react-native';
import { colors } from '../../lib/theme';

interface AvatarProps {
  size: 'sm' | 'md' | 'lg';
  name?: string;
  imageUrl?: string;
}

const sizeMap = { sm: 32, md: 48, lg: 72 };
const fontSizeMap = { sm: 12, md: 16, lg: 24 };

export function Avatar({ size, name, imageUrl }: AvatarProps) {
  const s = sizeMap[size];
  const initials = name
    ? name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : '?';
  if (imageUrl) {
    return <Image source={{ uri: imageUrl }} style={{ width: s, height: s, borderRadius: s / 2 }} />;
  }
  return (
    <View
      className="items-center justify-center rounded-full"
      style={{ width: s, height: s, backgroundColor: colors.surface }}
    >
      <Text style={{ fontSize: fontSizeMap[size], fontWeight: '700', color: colors.primary }}>{initials}</Text>
    </View>
  );
}
