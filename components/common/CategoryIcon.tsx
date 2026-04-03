import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { colors } from '../../lib/colors';

export type CategoryType =
  | 'transport'
  | 'realEstate'
  | 'electronics'
  | 'clothing'
  | 'furniture'
  | 'services'
  | 'jobs'
  | 'kids'
  | 'pets'
  | 'hobbies';

interface CategoryIconProps {
  category: CategoryType;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

const CATEGORY_ICONS: Record<CategoryType, keyof typeof Ionicons.glyphMap> = {
  transport: 'car-outline',
  realEstate: 'home-outline',
  electronics: 'phone-portrait-outline',
  clothing: 'shirt-outline',
  furniture: 'bed-outline',
  services: 'construct-outline',
  jobs: 'briefcase-outline',
  kids: 'happy-outline',
  pets: 'paw-outline',
  hobbies: 'color-palette-outline',
};

const sizeMap = {
  sm: { container: 36, icon: 16, label: 10 },
  md: { container: 44, icon: 20, label: 10 },
  lg: { container: 64, icon: 30, label: 12 },
};

export function CategoryIcon({ category, size = 'md', showLabel = true }: CategoryIconProps) {
  const { t } = useTranslation();
  const s = sizeMap[size];

  return (
    <View style={{ alignItems: 'center', gap: 4 }}>
      <View style={{
        width: s.container,
        height: s.container,
        backgroundColor: colors.bgSurface,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: colors.borderDefault,
      }}>
        <Ionicons
          name={CATEGORY_ICONS[category]}
          size={s.icon}
          color={colors.brandPrimary}
        />
      </View>
      {showLabel && (
        <Text style={{ color: colors.textSecondary, fontSize: s.label }} numberOfLines={1}>
          {t(category)}
        </Text>
      )}
    </View>
  );
}
