import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

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
      <Ionicons name={icon as any} size={56} color="#D0D0D0" />
      <Text style={{ fontSize: 17, fontWeight: '700', color: '#1A1A1A', textAlign: 'center' }}>{title}</Text>
      {subtitle && <Text style={{ fontSize: 14, color: '#9E9E9E', textAlign: 'center', lineHeight: 20 }}>{subtitle}</Text>}
      {ctaLabel && onCta && (
        <Pressable
          onPress={onCta}
          style={{ marginTop: 8, backgroundColor: '#00AA6C', borderRadius: 10, paddingHorizontal: 24, paddingVertical: 12 }}
        >
          <Text style={{ color: '#fff', fontWeight: '700', fontSize: 15 }}>{ctaLabel}</Text>
        </Pressable>
      )}
    </View>
  );
}
