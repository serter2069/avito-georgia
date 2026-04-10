import { View, Text, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { StateSection } from '../StateSection';

export default function PromotionSuccessStates() {
  return (
    <View>
      <StateSection title="success">
        <View className="py-12 items-center">
          <Feather name="check-circle" size={72} color="#2E7D30" />
          <Text className="text-text-primary text-xl font-bold mt-4">Оплата прошла успешно!</Text>
          <Text className="text-text-muted text-sm mt-2 text-center">Ваше объявление продвинуто. Результаты будут видны в течение часа.</Text>
          <TouchableOpacity className="bg-primary py-3 px-6 rounded-lg mt-6 w-full items-center">
            <Text className="text-white font-semibold">Мои объявления</Text>
          </TouchableOpacity>
          <TouchableOpacity className="border border-primary py-3 px-6 rounded-lg mt-3 w-full items-center">
            <Text className="text-primary font-semibold">На главную</Text>
          </TouchableOpacity>
        </View>
      </StateSection>
    </View>
  );
}
