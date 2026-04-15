import { useState } from 'react';
import { View, Text, TouchableOpacity,
  useWindowDimensions} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { StateSection } from '../StateSection';

export default function PromotionCancelledStates() {
  const [retrying, setRetrying] = useState(false);
  const { width } = useWindowDimensions();

  const isDesktop = width >= 768;

  const containerStyle = isDesktop ? { maxWidth: 960, alignSelf: 'center' as const, width: '100%' } : {};


  return (
    <View>
      <StateSection title="cancelled">
        <View style={[{ minHeight: 844 }, containerStyle]} className="py-12 items-center">
          <View className="w-16 h-16 rounded-full bg-error/10 items-center justify-center mb-2">
            <Feather name="x-circle" size={40} color="#ef4444" />
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
