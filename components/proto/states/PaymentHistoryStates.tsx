import { useState } from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
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

  return (
    <View>
      <StateSection title="default">
        <View>
          <FilterBar active={filter} onSelect={setFilter} />
          {filtered.map((p) => (
            <PaymentRow key={p.id} p={p} />
          ))}
        </View>
      </StateSection>

      <StateSection title="loading">
        <View className="py-16 items-center">
          <ActivityIndicator size="large" color="#0A7B8A" />
        </View>
      </StateSection>

      <StateSection title="empty">
        <View className="py-16 items-center">
          <Feather name="credit-card" size={48} color="#6A8898" />
          <Text className="text-text-primary text-lg font-semibold mt-3">Нет платежей</Text>
          <Text className="text-text-muted text-sm mt-1">История ваших платежей будет здесь</Text>
        </View>
      </StateSection>
    </View>
  );
}
