import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import type { ReactNode } from 'react';

interface ProtoLayoutProps {
  pagId: string;
  title: string;
  route: string;
  children: ReactNode;
}

export function ProtoLayout({ pagId, title, route, children }: ProtoLayoutProps) {
  const router = useRouter();

  return (
    <View className="flex-1 bg-surface" style={{ maxWidth: 430 }}>
      <View className="bg-white border-b border-border px-4 py-3 flex-row items-center gap-3">
        <TouchableOpacity onPress={() => router.push('/proto' as any)} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={24} color="#0A2840" />
        </TouchableOpacity>
        <View className="flex-1">
          <Text className="text-text-primary text-base font-semibold">{pagId} — {title}</Text>
          <Text className="text-text-muted text-xs">{route}</Text>
        </View>
      </View>
      <ScrollView className="flex-1 px-4 pt-4" contentContainerStyle={{ paddingBottom: 48 }}>
        {children}
      </ScrollView>
    </View>
  );
}
