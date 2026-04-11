import { View, Text, TouchableOpacity, useWindowDimensions, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { StateSection } from '../StateSection';

export default function MapViewStates() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;

  const containerStyle = isDesktop ? { maxWidth: 1200, alignSelf: 'center' as const, width: '100%' } : {};

  return (
    <View>
      <StateSection title="coming_soon">
        <View style={{ minHeight: Platform.OS === 'web' ? '100vh' : 844 }}>
          <View className="flex-row items-center justify-between h-14 px-4 bg-white border-b border-border"><Text className="text-primary text-lg font-bold">Avito Georgia</Text><View className="flex-row items-center gap-3"><Feather name="search" size={20} color="#737373" /><Feather name="bell" size={20} color="#737373" /></View></View>
          <View style={{ flex: 1 }}>

        <View style={containerStyle} className="py-16 items-center">
          <Feather name="map" size={64} color="#737373" />
          <Text className="text-text-primary text-xl font-bold mt-4">Карта объявлений — скоро</Text>
          <Text className="text-text-muted text-sm mt-2 text-center" style={isDesktop ? { maxWidth: 480 } : {}}>
            Мы работаем над картой объявлений. Скоро здесь появится интерактивная карта.
          </Text>
          <TouchableOpacity className="border border-primary px-4 py-2 rounded-lg mt-6" onPress={() => {}}>
            <Text className="text-primary font-semibold">Назад</Text>
          </TouchableOpacity>
        </View>
                </View>
          <View className="flex-row h-14 bg-white border-t border-border items-center">{[{i:"home",l:"Home"},{i:"plus-circle",l:"Post"},{i:"message-circle",l:"Chat"},{i:"user",l:"Profile"}].map(t=>(<View key={t.l} className="flex-1 items-center justify-center"><Feather name={t.i as any} size={20} color="#737373" /><Text className="text-[10px] text-text-muted">{t.l}</Text></View>))}</View>
        </View>
</StateSection>
    </View>
  );
}
