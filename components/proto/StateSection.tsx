import { View, Text, Platform } from 'react-native';
import type { ReactNode } from 'react';

interface StateSectionProps {
  title: string;
  children: ReactNode;
}

export function StateSection({ title, children }: StateSectionProps) {
  const isWeb = Platform.OS === 'web';

  return (
    <View style={{
      backgroundColor: '#fff',
      borderWidth: 1,
      borderColor: '#C8E0E8',
      borderRadius: 12,
      overflow: 'hidden',
    }}>
      {/* Badge header */}
      <View style={{
        backgroundColor: '#E8F4F8',
        borderBottomWidth: 1,
        borderBottomColor: '#C8E0E8',
        paddingHorizontal: 12,
        paddingVertical: 6,
      }}>
        <Text style={{
          color: '#0A7B8A',
          fontSize: 12,
          fontWeight: '600',
        }}>
          {title}
        </Text>
      </View>

      {/* Content */}
      <View style={{ padding: 16 }}>
        {children}
      </View>
    </View>
  );
}
