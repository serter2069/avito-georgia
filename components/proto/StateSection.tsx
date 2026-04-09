import { View, Text } from 'react-native';
import type { ReactNode } from 'react';

interface StateSectionProps {
  title: string;
  children: ReactNode;
}

export function StateSection({ title, children }: StateSectionProps) {
  return (
    <View className="mb-8">
      <View className="bg-primary/10 px-3 py-2 rounded-lg mb-4 self-start">
        <Text className="text-primary text-sm font-semibold">{title}</Text>
      </View>
      <View className="border border-border rounded-lg p-4 bg-white">
        {children}
      </View>
    </View>
  );
}
