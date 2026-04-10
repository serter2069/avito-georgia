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
          <PackageCard name="TOP" price="15 GEL" description="Поднятие в топ на 3 дня" icon="trending-up" color="#0A7B8A"
            selected={selected === 'top'} onSelect={() => setSelected(selected === 'top' ? null : 'top')} />
          <PackageCard name="VIP" price="25 GEL" description="VIP-метка + топ на 7 дней" icon="star" color="#f59e0b"
            selected={selected === 'vip'} onSelect={() => setSelected(selected === 'vip' ? null : 'vip')} />
          <PackageCard name="Выделение" price="10 GEL" description="Цветная рамка на 5 дней" icon="award" color="#2E7D30"
            selected={selected === 'highlight'} onSelect={() => setSelected(selected === 'highlight' ? null : 'highlight')} />
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
