import { View, Text, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';

interface FooterProps {
  onNavigate?: (path: string) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  const { t } = useTranslation();

  const links = [
    { key: 'about', path: '/about' },
    { key: 'terms', path: '/terms' },
    { key: 'privacy', path: '/privacy' },
    { key: 'help', path: '/help' },
  ] as const;

  return (
    <View className="bg-bg-section border-t border-border px-4 py-4">
      <View className="flex-row justify-center gap-4 mb-2">
        {links.map((link) => (
          <TouchableOpacity
            key={link.key}
            onPress={() => onNavigate?.(link.path)}
          >
            <Text className="text-text-secondary text-xs">{t(link.key)}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <Text className="text-text-muted text-xs text-center">
        Avito Georgia 2026
      </Text>
    </View>
  );
}
