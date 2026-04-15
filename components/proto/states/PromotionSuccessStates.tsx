import { useState } from 'react';
import { View, Text, TouchableOpacity,
  useWindowDimensions} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { SkeletonBlock } from '../SkeletonBlock';
import { StateSection } from '../StateSection';

export default function PromotionSuccessStates() {
  const [shared, setShared] = useState(false);
  const { width } = useWindowDimensions();

  const isDesktop = width >= 768;

  const containerStyle = isDesktop ? { maxWidth: 960, alignSelf: 'center' as const, width: '100%' } : {};


  return (
    <View>
      <StateSection title="SUCCESS">
        <View style={[{ minHeight: 844 }, containerStyle]} className="py-12 items-center">
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
      </StateSection>

      <StateSection title="PROCESSING">
        <View style={[{ minHeight: 400 }, containerStyle]} className="py-12 items-center">
          <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: 'rgba(0,170,108,0.1)', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
            <Feather name="credit-card" size={28} color="#00AA6C" />
          </View>
          <Text style={{ color: '#1A1A1A', fontSize: 18, fontWeight: '700', marginBottom: 8 }}>Обработка оплаты...</Text>
          <Text style={{ color: '#737373', fontSize: 14 }}>Пожалуйста, подождите</Text>
          <View style={{ width: '50%', height: 4, backgroundColor: '#E8EDF0', borderRadius: 2, marginTop: 24, overflow: 'hidden' }}>
            <View style={{ width: '45%', height: 4, backgroundColor: '#00AA6C', borderRadius: 2 }} />
          </View>
        </View>
      </StateSection>
    </View>
  );
}
