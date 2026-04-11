import { useState } from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity, useWindowDimensions, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { StateSection } from '../StateSection';
import { mockPayments } from '../../../constants/protoMockData';

const statusBadge: Record<string, { bg: string; text: string; label: string }> = {
  success: { bg: 'bg-success/20', text: 'text-success', label: 'Оплачено' },
  failed: { bg: 'bg-error/20', text: 'text-error', label: 'Ошибка' },
  pending: { bg: 'bg-warning/20', text: 'text-warning', label: 'Ожидание' },
};

const TYPE_FILTERS = [
  { key: 'all', label: 'Все' },
  { key: 'subscription', label: 'Premium' },
  { key: 'promotion', label: 'Boost' },
] as const;

function PaymentRow({ p }: { p: typeof mockPayments[0] }) {
  const badge = statusBadge[p.status];
  return (
    <View className="flex-row items-center justify-between py-3 border-b border-border">
      <View className="flex-1">
        <Text className="text-text-primary text-sm font-medium">{p.description}</Text>
        <Text className="text-text-muted text-xs mt-0.5">{new Date(p.createdAt).toLocaleDateString('ru')}</Text>
      </View>
      <View className="items-end">
        <Text className="text-text-primary text-sm font-bold">{p.amount} {p.currency}</Text>
        <View className={`${badge.bg} px-2 py-0.5 rounded-full mt-1`}>
          <Text className={`${badge.text} text-[10px] font-medium`}>{badge.label}</Text>
        </View>
      </View>
    </View>
  );
}

function FilterBar({ active, onSelect }: { active: string; onSelect: (k: string) => void }) {
  return (
    <View className="flex-row gap-2 mb-3">
      {TYPE_FILTERS.map((f) => (
        <TouchableOpacity
          key={f.key}
          onPress={() => onSelect(f.key)}
          className={`px-3 py-1.5 rounded-full border ${active === f.key ? 'bg-primary border-primary' : 'border-border'}`}
        >
          <Text className={`text-xs font-medium ${active === f.key ? 'text-white' : 'text-text-secondary'}`}>{f.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

export default function PaymentHistoryStates() {
  const [filter, setFilter] = useState<string>('all');
  const filtered = filter === 'all' ? mockPayments : mockPayments.filter((p) => p.type === filter);
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;

  return (
    <View>
      <StateSection title="default">
        <View style={{ minHeight: Platform.OS === 'web' ? '100vh' : 844 }}>
          <View className="flex-row items-center justify-between h-14 px-4 bg-white border-b border-border"><Text className="text-primary text-lg font-bold">Avito Georgia</Text><View className="flex-row items-center gap-3"><Feather name="search" size={20} color="#737373" /><Feather name="bell" size={20} color="#737373" /></View></View>
          <View style={{ flex: 1 }}>

        <View style={isDesktop ? { maxWidth: 900, alignSelf: 'center', width: '100%' } : undefined}>
          <FilterBar active={filter} onSelect={setFilter} />
          {filtered.map((p) => (
            <PaymentRow key={p.id} p={p} />
          ))}
        </View>
                </View>
          <View className="flex-row h-14 bg-white border-t border-border items-center">{[{i:"home",l:"Home"},{i:"plus-circle",l:"Post"},{i:"message-circle",l:"Chat"},{i:"user",l:"Profile"}].map(t=>(<View key={t.l} className="flex-1 items-center justify-center"><Feather name={t.i as any} size={20} color="#737373" /><Text className="text-[10px] text-text-muted">{t.l}</Text></View>))}</View>
        </View>
</StateSection>

      <StateSection title="loading">
        <View style={{ minHeight: Platform.OS === 'web' ? '100vh' : 844 }}>
          <View className="flex-row items-center justify-between h-14 px-4 bg-white border-b border-border"><Text className="text-primary text-lg font-bold">Avito Georgia</Text><View className="flex-row items-center gap-3"><Feather name="search" size={20} color="#737373" /><Feather name="bell" size={20} color="#737373" /></View></View>
          <View style={{ flex: 1 }}>

        <View className="py-16 items-center">
          <ActivityIndicator size="large" color="#00AA6C" />
        </View>
                </View>
          <View className="flex-row h-14 bg-white border-t border-border items-center">{[{i:"home",l:"Home"},{i:"plus-circle",l:"Post"},{i:"message-circle",l:"Chat"},{i:"user",l:"Profile"}].map(t=>(<View key={t.l} className="flex-1 items-center justify-center"><Feather name={t.i as any} size={20} color="#737373" /><Text className="text-[10px] text-text-muted">{t.l}</Text></View>))}</View>
        </View>
</StateSection>

      <StateSection title="empty">
        <View style={{ minHeight: Platform.OS === 'web' ? '100vh' : 844 }}>
          <View className="flex-row items-center justify-between h-14 px-4 bg-white border-b border-border"><Text className="text-primary text-lg font-bold">Avito Georgia</Text><View className="flex-row items-center gap-3"><Feather name="search" size={20} color="#737373" /><Feather name="bell" size={20} color="#737373" /></View></View>
          <View style={{ flex: 1 }}>

        <View className="py-16 items-center">
          <Feather name="credit-card" size={48} color="#737373" />
          <Text className="text-text-primary text-lg font-semibold mt-3">Нет платежей</Text>
          <Text className="text-text-muted text-sm mt-1">История ваших платежей будет здесь</Text>
        </View>
                </View>
          <View className="flex-row h-14 bg-white border-t border-border items-center">{[{i:"home",l:"Home"},{i:"plus-circle",l:"Post"},{i:"message-circle",l:"Chat"},{i:"user",l:"Profile"}].map(t=>(<View key={t.l} className="flex-1 items-center justify-center"><Feather name={t.i as any} size={20} color="#737373" /><Text className="text-[10px] text-text-muted">{t.l}</Text></View>))}</View>
        </View>
</StateSection>
    </View>
  );
}
