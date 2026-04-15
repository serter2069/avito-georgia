import { useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator,
  useWindowDimensions} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { StateSection } from '../StateSection';

function PackageCard({
  name, price, description, icon, color, selected, onSelect,
}: {
  name: string; price: string; description: string; icon: string; color: string;
  selected: boolean; onSelect: () => void;
}) {
  return (
    <View className={`border rounded-lg p-4 mb-3 ${selected ? 'border-primary bg-primary/10' : 'border-border'}`}>
      <View className="flex-row items-center gap-3 mb-2">
        <View className="w-10 h-10 bg-surface rounded-lg items-center justify-center">
          <Feather name={icon as any} size={20} color={color} />
        </View>
        <View className="flex-1">
          <Text className="text-text-primary text-base font-bold">{name}</Text>
          <Text className="text-text-muted text-xs">{description}</Text>
        </View>
        <Text className="text-primary text-lg font-bold">{price}</Text>
      </View>
      <TouchableOpacity
        className={`py-2.5 rounded-lg items-center mt-2 ${selected ? 'bg-primary' : 'bg-surface border border-primary'}`}
        onPress={onSelect}
      >
        <Text className={`font-semibold text-sm ${selected ? 'text-white' : 'text-primary'}`}>
          {selected ? 'Выбрано' : 'Продвинуть'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

export default function PromoteListingStates() {
  const [selected, setSelected] = useState<string | null>(null);
  const { width } = useWindowDimensions();

  const isDesktop = width >= 768;

  const containerStyle = isDesktop ? { maxWidth: 960, alignSelf: 'center' as const, width: '100%' } : {};


  return (
    <View>
      <StateSection title="default">
        <View style={[{ minHeight: 844 }, containerStyle]} className="py-4">
          <Text className="text-text-primary text-lg font-bold mb-4">Продвижение объявления</Text>
          <PackageCard name="1 день" price="2.99 GEL" description="Поднятие в топ на 1 день" icon="trending-up" color="#00AA6C"
            selected={selected === 'day1'} onSelect={() => setSelected(selected === 'day1' ? null : 'day1')} />
          <PackageCard name="3 дня" price="6.99 GEL" description="Поднятие в топ на 3 дня" icon="star" color="#f59e0b"
            selected={selected === 'day3'} onSelect={() => setSelected(selected === 'day3' ? null : 'day3')} />
          <PackageCard name="7 дней" price="12.99 GEL" description="Поднятие в топ на 7 дней" icon="award" color="#2E7D30"
            selected={selected === 'day7'} onSelect={() => setSelected(selected === 'day7' ? null : 'day7')} />
        </View>
      </StateSection>

      <StateSection title="loading">
        <View style={[{ minHeight: 844 }, containerStyle]} className="py-16 items-center">
          <ActivityIndicator size="large" color="#00AA6C" />
        </View>
      </StateSection>

      <StateSection title="purchasing">
        <View style={[{ minHeight: 844 }, containerStyle]} className="py-16 items-center">
          <ActivityIndicator size="large" color="#00AA6C" />
          <Text className="text-text-muted text-sm mt-3">Обработка платежа...</Text>
        </View>
      </StateSection>

      <StateSection title="error">
        <View style={[{ minHeight: 844 }, containerStyle]} className="py-12 items-center px-4">
          <View className="w-16 h-16 rounded-full bg-error/10 items-center justify-center mb-2">
            <Feather name="alert-circle" size={40} color="#ef4444" />
          </View>
          <Text className="text-text-primary text-xl font-bold mt-4">Ошибка оплаты</Text>
          <Text className="text-text-muted text-sm mt-2 text-center">Платёж отклонён банком. Проверьте данные карты и попробуйте снова.</Text>
          <View className="bg-error/10 border border-error/30 rounded-lg p-3 mt-4 w-full">
            <Text className="text-error text-xs text-center">Код ошибки: insufficient_funds</Text>
          </View>
          <TouchableOpacity className="bg-primary py-3 px-6 rounded-lg mt-6 w-full items-center" onPress={() => {}}>
            <Text className="text-white font-semibold">Попробовать снова</Text>
          </TouchableOpacity>
          <TouchableOpacity className="border border-border py-3 px-6 rounded-lg mt-3 w-full items-center" onPress={() => {}}>
            <Text className="text-text-secondary font-semibold">Отмена</Text>
          </TouchableOpacity>
        </View>
      </StateSection>
    </View>
  );
}
