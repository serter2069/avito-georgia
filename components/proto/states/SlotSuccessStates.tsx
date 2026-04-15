import { useState } from 'react';
import { View, Text, TouchableOpacity,
  useWindowDimensions} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { StateSection } from '../StateSection';
import { SkeletonBlock, SkeletonRow, SkeletonCard } from '../SkeletonBlock';

export default function SlotSuccessStates() {
  const [navigated, setNavigated] = useState(false);
  const { width } = useWindowDimensions();

  const isDesktop = width >= 768;

  const containerStyle = isDesktop ? { maxWidth: 960, alignSelf: 'center' as const, width: '100%' } : {};


  return (
    <View>
      <StateSection title="RESTORING">
        <View style={[{ minHeight: 844 }, containerStyle]} className="py-16 items-center">
          <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: 'rgba(0,170,108,0.1)', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
            <Feather name="refresh-cw" size={28} color="#00AA6C" />
          </View>
          <Text style={{ color: '#1A1A1A', fontSize: 16, fontWeight: '600' }}>Восстановление...</Text>
          <Text style={{ color: '#737373', fontSize: 14, marginTop: 4 }}>Активируем ваше объявление</Text>
        </View>
      </StateSection>

      <StateSection title="SUBMITTING">
        <View style={[{ minHeight: 844 }, containerStyle]} className="py-16 items-center">
          <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: 'rgba(0,170,108,0.1)', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
            <Feather name="zap" size={28} color="#00AA6C" />
          </View>
          <Text style={{ color: '#1A1A1A', fontSize: 16, fontWeight: '600' }}>Обработка слота...</Text>
          <Text style={{ color: '#737373', fontSize: 14, marginTop: 4 }}>Пожалуйста, подождите</Text>
        </View>
      </StateSection>

      <StateSection title="DONE">
        <View style={[{ minHeight: 844 }, containerStyle]} className="py-12 items-center">
          <View className="w-16 h-16 rounded-full bg-primary/20 items-center justify-center mb-2">
            <Feather name="check-circle" size={40} color="#00AA6C" />
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

      <StateSection title="ERROR">
        <View style={[{ minHeight: 844 }, containerStyle]} className="py-12 items-center">
          <View className="w-16 h-16 rounded-full bg-error/10 items-center justify-center mb-2">
            <Feather name="alert-circle" size={40} color="#ef4444" />
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
