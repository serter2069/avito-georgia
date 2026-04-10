import { useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { StateSection } from '../StateSection';

export default function SlotSuccessStates() {
  const [navigated, setNavigated] = useState(false);

  return (
    <View>
      <StateSection title="restoring">
        <View className="py-16 items-center">
          <ActivityIndicator size="large" color="#0A7B8A" />
          <Text className="text-text-muted text-sm mt-3">Восстановление объявления...</Text>
        </View>
      </StateSection>

      <StateSection title="submitting">
        <View className="py-16 items-center">
          <ActivityIndicator size="large" color="#0A7B8A" />
          <Text className="text-text-muted text-sm mt-3">Обработка слота...</Text>
        </View>
      </StateSection>

      <StateSection title="done">
        <View className="py-12 items-center">
          <View className="w-16 h-16 rounded-full bg-primary/20 items-center justify-center mb-2">
            <Feather name="check-circle" size={40} color="#0A7B8A" />
          </View>
          <Text className="text-text-primary text-xl font-bold mt-4">Слот активирован</Text>
          <Text className="text-text-muted text-sm mt-2 text-center">Ваше объявление восстановлено и активно.</Text>
          <TouchableOpacity
            className={`py-3 px-6 rounded-lg mt-6 w-full items-center ${navigated ? 'bg-primary/60' : 'bg-primary'}`}
            onPress={() => setNavigated(true)}
          >
            <Text className="text-white font-semibold">{navigated ? 'Открываем...' : 'К объявлению'}</Text>
          </TouchableOpacity>
        </View>
      </StateSection>

      <StateSection title="error">
        <View className="py-12 items-center">
          <View className="w-16 h-16 rounded-full bg-primary/10 items-center justify-center mb-2">
            <Feather name="alert-circle" size={40} color="#0A7B8A" />
          </View>
          <Text className="text-text-primary text-xl font-bold mt-4">Ошибка</Text>
          <Text className="text-text-muted text-sm mt-2 text-center">Не удалось активировать слот. Попробуйте позже.</Text>
          <TouchableOpacity className="bg-primary py-3 px-6 rounded-lg mt-6 w-full items-center" onPress={() => {}}>
            <Text className="text-white font-semibold">К объявлению</Text>
          </TouchableOpacity>
        </View>
      </StateSection>
    </View>
  );
}
