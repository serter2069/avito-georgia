import { View } from 'react-native';
import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className = '' }: CardProps) {
  return (
    <View className={`bg-surface-card rounded-lg border border-border p-4 ${className}`}>
      {children}
    </View>
  );
}
