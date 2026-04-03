import { View } from 'react-native';
import { ReactNode } from 'react';

interface ContentContainerProps {
  children: ReactNode;
}

export function ContentContainer({ children }: ContentContainerProps) {
  return (
    <View
      style={{
        flex: 1,
        maxWidth: 1280,
        width: '100%',
        alignSelf: 'center',
        paddingHorizontal: 16,
      }}
    >
      {children}
    </View>
  );
}
