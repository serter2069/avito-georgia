import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, fontSize } from '../lib/theme';

export function EmptyState({
  icon,
  title,
  subtitle,
  ctaLabel,
  onCta
}: {
  icon: string;
  title: string;
  subtitle?: string;
  ctaLabel?: string;
  onCta?: () => void;
}) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32, gap: 12 }}>
      <Ionicons name={icon as any} size={56} color={colors.border} />
      <Text style={{ fontSize: fontSize.lg, fontWeight: '700', color: colors.text, textAlign: 'center' }}>{title}</Text>
      {subtitle && <Text style={{ fontSize: fontSize.md, color: colors.textSecondary, textAlign: 'center', lineHeight: 20 }}>{subtitle}</Text>}
      {ctaLabel && onCta && (
        <Pressable
          onPress={onCta}
          accessibilityLabel={ctaLabel}
          style={{ marginTop: 8, backgroundColor: colors.primary, borderRadius: 10, paddingHorizontal: 24, paddingVertical: 12 }}
        >
          <Text style={{ color: colors.background, fontWeight: '700', fontSize: fontSize.base }}>{ctaLabel}</Text>
        </Pressable>
      )}
    </View>
  );
}
