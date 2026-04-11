import { useState } from 'react';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { StateSection } from '../StateSection';

export default function PromotionSuccessStates() {
  const [shared, setShared] = useState(false);

  return (
    <View>
      <StateSection title="success">
        <View style={{ minHeight: Platform.OS === 'web' ? '100vh' : 844 }}>
          <View className="flex-row items-center justify-between h-14 px-4 bg-white border-b border-border"><Text className="text-primary text-lg font-bold">Avito Georgia</Text><View className="flex-row items-center gap-3"><Feather name="search" size={20} color="#737373" /><Feather name="bell" size={20} color="#737373" /></View></View>
          <View style={{ flex: 1 }}>

        <View className="py-12 items-center">
          <View className="w-16 h-16 rounded-full bg-primary/20 items-center justify-center mb-2">
            <Feather name="check-circle" size={40} color="#00AA6C" />
          </View>
          <Text className="text-text-primary text-xl font-bold mt-4">Оплата прошла успешно!</Text>
          <Text className="text-text-muted text-sm mt-2 text-center">Ваше объявление продвинуто. Результаты будут видны в течение часа.</Text>
          <TouchableOpacity
            className={`py-2.5 px-6 rounded-lg mt-4 w-full items-center border ${shared ? 'border-primary bg-primary/10' : 'border-border'}`}
            onPress={() => setShared(!shared)}
          >
            <Text className={`text-sm font-medium ${shared ? 'text-primary' : 'text-text-muted'}`}>
              {shared ? 'Ссылка скопирована' : 'Поделиться объявлением'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity className="bg-primary py-3 px-6 rounded-lg mt-3 w-full items-center" onPress={() => {}}>
            <Text className="text-white font-semibold">Мои объявления</Text>
          </TouchableOpacity>
          <TouchableOpacity className="border border-primary py-3 px-6 rounded-lg mt-3 w-full items-center" onPress={() => {}}>
            <Text className="text-primary font-semibold">На главную</Text>
          </TouchableOpacity>
        </View>
                </View>
          <View className="flex-row h-14 bg-white border-t border-border items-center">{[{i:"home",l:"Home"},{i:"plus-circle",l:"Post"},{i:"message-circle",l:"Chat"},{i:"user",l:"Profile"}].map(t=>(<View key={t.l} className="flex-1 items-center justify-center"><Feather name={t.i as any} size={20} color="#737373" /><Text className="text-[10px] text-text-muted">{t.l}</Text></View>))}</View>
        </View>
</StateSection>
    </View>
  );
}
