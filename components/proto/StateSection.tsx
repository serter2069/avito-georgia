import { View, Text } from 'react-native';
import type { ReactNode } from 'react';

interface StateSectionProps {
  title: string;
  children: ReactNode;
}

export function StateSection({ title, children }: StateSectionProps) {
  return (
    <View style={{
      backgroundColor: '#fff',
      borderWidth: 1,
      borderColor: '#E0E0E0',
      borderRadius: 12,
      overflow: 'hidden',
    }}>
      {/* Badge header */}
      <View style={{
        backgroundColor: '#F4F4F4',
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
        paddingHorizontal: 12,
        paddingVertical: 6,
      }}>
        <Text style={{
          color: '#00AA6C',
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
