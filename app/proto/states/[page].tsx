import React from 'react';
import { View, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

import DesignSystemStates from '../../../components/proto/states/DesignSystemStates';

const stateComponents: Record<string, React.ComponentType> = {
  'design-system': DesignSystemStates,
};

export default function ProtoStatesPage() {
  const { page } = useLocalSearchParams<{ page: string }>();
  const Component = stateComponents[page];

  if (!Component) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: '#e03131', fontSize: 16 }}>Not found: {page}</Text>
      </View>
    );
  }

  return <Component />;
}
