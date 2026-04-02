import { View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';

interface PriceTagProps {
  price: number | null;
  currency?: string;
  negotiable?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'text-sm',
  md: 'text-lg',
  lg: 'text-2xl',
};

export function PriceTag({
  price,
  currency,
  negotiable = false,
  size = 'md',
}: PriceTagProps) {
  const { t } = useTranslation();
  const curr = currency || t('currency');

  if (price === null || negotiable) {
    return (
      <Text className={`text-secondary font-bold ${sizeClasses[size]}`}>
        {t('negotiable')}
      </Text>
    );
  }

  const formatted = price.toLocaleString();

  return (
    <View className="flex-row items-baseline gap-1">
      <Text className={`text-text-primary font-bold ${sizeClasses[size]}`}>
        {formatted}
      </Text>
      <Text className="text-text-secondary text-sm">{curr}</Text>
    </View>
  );
}
