import React from 'react';
import { View, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { getPage } from '../../../constants/pageRegistry';
import { ProtoLayout } from '../../../components/proto/ProtoLayout';

import DesignSystemStates from '../../../components/proto/states/DesignSystemStates';

const stateComponents: Record<string, React.ComponentType> = {
  'design-system': DesignSystemStates,
};

export default function ProtoStatesPage() {
  const { page } = useLocalSearchParams<{ page: string }>();
  const protoPage = getPage(page);

  if (!protoPage) {
    return (
      <View className="flex-1 bg-surface items-center justify-center">
        <Text className="text-error text-lg font-semibold">Page not found: {page}</Text>
      </View>
    );
  }

  const Component = stateComponents[page];

  if (!Component) {
    return (
      <View className="flex-1 bg-surface items-center justify-center">
        <Text className="text-error text-lg font-semibold">Component not found: {page}</Text>
      </View>
    );
  }

  return (
    <ProtoLayout pagId={protoPage.id} title={protoPage.title} route={protoPage.route} nav={protoPage.nav}>
      <Component />
    </ProtoLayout>
  );
}
