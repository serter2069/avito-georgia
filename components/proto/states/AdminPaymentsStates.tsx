import { View, Text, TouchableOpacity, ActivityIndicator, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import { StateSection } from '../StateSection';
import { mockPayments, mockUsers } from '../../../constants/protoMockData';

const statusBadge: Record<string, { bg: string; text: string; label: string }> = {
  success: { bg: 'bg-success/20', text: 'text-success', label: 'Успешно' },
  failed: { bg: 'bg-error/20', text: 'text-error', label: 'Ошибка' },
  pending: { bg: 'bg-warning/20', text: 'text-warning', label: 'Ожидание' },
};

type FilterStatus = 'all' | 'success' | 'failed' | 'pending';

export default function AdminPaymentsStates() {
  const [filter, setFilter] = useState<FilterStatus>('all');

  const filteredPayments = filter === 'all'
    ? mockPayments
    : mockPayments.filter(p => p.status === filter);

  return (
    <View>
      <StateSection title="default">
        <View style={{ minHeight: Platform.OS === 'web' ? '100vh' : 844 }}>
          <View className="flex-row items-center justify-between h-14 px-4 bg-white border-b border-border"><Text className="text-primary text-lg font-bold">Avito Georgia</Text><View className="flex-row items-center gap-3"><Feather name="search" size={20} color="#737373" /><Feather name="bell" size={20} color="#737373" /></View></View>
          <View style={{ flex: 1 }}>

        <View>
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-text-primary text-lg font-bold">Платежи</Text>
            <TouchableOpacity className="flex-row items-center gap-2 border border-border px-3 py-2 rounded-lg">
              <Feather name="download" size={14} color="#00AA6C" />
              <Text className="text-primary text-sm font-medium">CSV</Text>
            </TouchableOpacity>
          </View>
          <View className="flex-row bg-surface border border-border rounded-lg p-0.5 mb-4">
            {(['all', 'success', 'failed', 'pending'] as FilterStatus[]).map((s) => (
              <TouchableOpacity
                key={s}
                className={`flex-1 py-1.5 rounded-md items-center ${filter === s ? 'bg-primary' : ''}`}
                onPress={() => setFilter(s)}
              >
                <Text className={`text-xs font-medium ${filter === s ? 'text-white' : 'text-text-muted'}`}>
                  {s === 'all' ? 'Все' : statusBadge[s]?.label ?? s}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {filteredPayments.map((p, i) => {
            const badge = statusBadge[p.status];
            const user = mockUsers[i % mockUsers.length];
            return (
              <View key={p.id} className="flex-row items-center justify-between py-3 border-b border-border">
                <View className="flex-1">
                  <Text className="text-text-primary text-sm font-medium">{user.name}</Text>
                  <Text className="text-text-muted text-xs">{p.description}</Text>
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
          })}
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
          <Text className="text-text-muted text-sm mt-1">Транзакции появятся здесь после первой оплаты</Text>
        </View>
                </View>
          <View className="flex-row h-14 bg-white border-t border-border items-center">{[{i:"home",l:"Home"},{i:"plus-circle",l:"Post"},{i:"message-circle",l:"Chat"},{i:"user",l:"Profile"}].map(t=>(<View key={t.l} className="flex-1 items-center justify-center"><Feather name={t.i as any} size={20} color="#737373" /><Text className="text-[10px] text-text-muted">{t.l}</Text></View>))}</View>
        </View>
</StateSection>
    </View>
  );
}
