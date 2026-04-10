import { useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
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

  return (
    <View>
      <StateSection title="default">
        <View className="py-4">
          <Text className="text-text-primary text-lg font-bold mb-4">Продвижение объявления</Text>
          <PackageCard name="1 день" price="2.99 GEL" description="Поднятие в топ на 1 день" icon="trending-up" color="#0A7B8A"
            selected={selected === 'day1'} onSelect={() => setSelected(selected === 'day1' ? null : 'day1')} />
          <PackageCard name="3 дня" price="6.99 GEL" description="Поднятие в топ на 3 дня" icon="star" color="#f59e0b"
            selected={selected === 'day3'} onSelect={() => setSelected(selected === 'day3' ? null : 'day3')} />
          <PackageCard name="7 дней" price="12.99 GEL" description="Поднятие в топ на 7 дней" icon="award" color="#2E7D30"
            selected={selected === 'day7'} onSelect={() => setSelected(selected === 'day7' ? null : 'day7')} />
        </View>
      </StateSection>

      <StateSection title="loading">
        <View className="py-16 items-center">
          <ActivityIndicator size="large" color="#0A7B8A" />
        </View>
      </StateSection>

      <StateSection title="purchasing">
        <View className="py-16 items-center">
          <ActivityIndicator size="large" color="#0A7B8A" />
          <Text className="text-text-muted text-sm mt-3">Обработка платежа...</Text>
        </View>
      </StateSection>
    </View>
  );
}
