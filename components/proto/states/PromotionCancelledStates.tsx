import { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { StateSection } from '../StateSection';

export default function PromotionCancelledStates() {
  const [retrying, setRetrying] = useState(false);

  return (
    <View>
      <StateSection title="cancelled">
        <View className="py-12 items-center">
          <View className="w-16 h-16 rounded-full bg-primary/10 items-center justify-center mb-2">
            <Feather name="x-circle" size={40} color="#0A7B8A" />
          </View>
          <Text className="text-text-primary text-xl font-bold mt-4">Оплата отменена</Text>
          <Text className="text-text-muted text-sm mt-2 text-center">Платёж не был завершён. Средства не списаны.</Text>
          <TouchableOpacity
            className="bg-primary py-3 px-6 rounded-lg mt-6 w-full items-center"
            onPress={() => setRetrying(true)}
          >
            <Text className="text-white font-semibold">{retrying ? 'Перенаправление...' : 'Попробовать снова'}</Text>
          </TouchableOpacity>
          <TouchableOpacity className="border border-primary py-3 px-6 rounded-lg mt-3 w-full items-center" onPress={() => {}}>
            <Text className="text-primary font-semibold">На главную</Text>
          </TouchableOpacity>
        </View>
      </StateSection>
    </View>
  );
}
