import { View, Text, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { StateSection } from '../StateSection';

export default function MapViewStates() {
  return (
    <View>
      <StateSection title="coming_soon">
        <View className="py-16 items-center">
          <Feather name="map" size={64} color="#6A8898" />
          <Text className="text-text-primary text-xl font-bold mt-4">Карта объявлений — скоро</Text>
          <Text className="text-text-muted text-sm mt-2 text-center">Мы работаем над картой объявлений. Скоро здесь появится интерактивная карта.</Text>
          <TouchableOpacity className="border border-primary px-4 py-2 rounded-lg mt-6" onPress={() => {}}>
            <Text className="text-primary font-semibold">Назад</Text>
          </TouchableOpacity>
        </View>
      </StateSection>
    </View>
  );
}
