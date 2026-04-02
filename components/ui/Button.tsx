import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';

interface ButtonProps {
  onPress: () => void;
  title: string;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
}

const sizeClasses = {
  sm: 'px-3 py-2 rounded-md',
  md: 'px-4 py-3 rounded-lg',
  lg: 'px-6 py-4 rounded-xl',
};

const textSizeClasses = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
};

const variantClasses = {
  primary: 'bg-primary',
  secondary: 'bg-secondary',
  ghost: 'border border-primary bg-transparent',
  danger: 'bg-error',
};

const textVariantClasses = {
  primary: 'text-white font-semibold',
  secondary: 'text-white font-semibold',
  ghost: 'text-primary font-semibold',
  danger: 'text-white font-semibold',
};

export function Button({
  onPress,
  title,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
}: ButtonProps) {
  return (
    <TouchableOpacity
      className={`${sizeClasses[size]} ${variantClasses[variant]} items-center justify-center ${disabled || loading ? 'opacity-50' : ''}`}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'ghost' ? '#6366f1' : '#fff'} />
      ) : (
        <Text className={`${textVariantClasses[variant]} ${textSizeClasses[size]}`}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}
