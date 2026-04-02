import { View, Text } from 'react-native';

interface BadgeProps {
  label: string;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
}

const variantClasses = {
  default: 'bg-primary/20',
  success: 'bg-success/20',
  warning: 'bg-warning/20',
  error: 'bg-error/20',
  info: 'bg-info/20',
};

const textClasses = {
  default: 'text-primary',
  success: 'text-success',
  warning: 'text-warning',
  error: 'text-error',
  info: 'text-info',
};

export function Badge({ label, variant = 'default' }: BadgeProps) {
  return (
    <View className={`${variantClasses[variant]} px-2 py-1 rounded-full self-start`}>
      <Text className={`${textClasses[variant]} text-xs font-medium`}>{label}</Text>
    </View>
  );
}
