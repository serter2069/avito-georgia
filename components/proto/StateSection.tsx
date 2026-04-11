import { useRef, useEffect } from 'react';
import { View, Text, Platform } from 'react-native';
import type { ReactNode } from 'react';

interface StateSectionProps {
  title: string;
  children: ReactNode;
}

export function StateSection({ title, children }: StateSectionProps) {
  const ref = useRef<View>(null);

  useEffect(() => {
    if (Platform.OS === 'web' && ref.current) {
      // Set data attribute directly on DOM element for text/screenshot API
      (ref.current as unknown as HTMLElement).setAttribute('data-state-name', title);
    }
  }, [title]);

  return (
    <View ref={ref} style={{
      backgroundColor: '#fff',
      borderWidth: 1,
      borderColor: '#C8E0E8',
      borderRadius: 12,
      overflow: 'hidden',
      marginBottom: 80,
    }}>
      {/* Badge header */}
      <View style={{
        backgroundColor: '#F2F8FA',
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
