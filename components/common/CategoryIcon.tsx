import { View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';

export type CategoryType =
  | 'transport'
  | 'realEstate'
  | 'electronics'
  | 'clothing'
  | 'furniture'
  | 'services'
  | 'jobs'
  | 'other';

interface CategoryIconProps {
  category: CategoryType;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

// Unicode icons for categories (no external icon library needed)
const CATEGORY_ICONS: Record<CategoryType, string> = {
  transport: '\u{1F697}',    // car
  realEstate: '\u{1F3E0}',   // house
  electronics: '\u{1F4F1}',  // phone
  clothing: '\u{1F455}',     // shirt
  furniture: '\u{1FA91}',    // chair
  services: '\u{1F527}',     // wrench
  jobs: '\u{1F4BC}',         // briefcase
  other: '\u{1F4E6}',        // package
};

const sizeClasses = {
  sm: { container: 'w-10 h-10', icon: 'text-lg', label: 'text-xs' },
  md: { container: 'w-14 h-14', icon: 'text-2xl', label: 'text-xs' },
  lg: { container: 'w-20 h-20', icon: 'text-4xl', label: 'text-sm' },
};

export function CategoryIcon({ category, size = 'md', showLabel = true }: CategoryIconProps) {
  const { t } = useTranslation();
  const s = sizeClasses[size];

  return (
    <View className="items-center gap-1">
      <View className={`${s.container} bg-surface rounded-xl items-center justify-center`}>
        <Text className={s.icon}>{CATEGORY_ICONS[category]}</Text>
      </View>
      {showLabel && (
        <Text className={`text-text-secondary ${s.label}`} numberOfLines={1}>
          {t(category)}
        </Text>
      )}
    </View>
  );
}
