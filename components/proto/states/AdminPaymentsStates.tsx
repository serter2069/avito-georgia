import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { StateSection } from '../StateSection';
import { mockPayments, mockUsers } from '../../../constants/protoMockData';

const statusBadge: Record<string, { bg: string; text: string; label: string }> = {
  success: { bg: 'bg-success/20', text: 'text-success', label: 'Успешно' },
  failed: { bg: 'bg-error/20', text: 'text-error', label: 'Ошибка' },
  pending: { bg: 'bg-warning/20', text: 'text-warning', label: 'Ожидание' },
};

export default function AdminPaymentsStates() {
  return (
    <View>
      <StateSection title="default">
        <View>
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-text-primary text-lg font-bold">Платежи</Text>
            <TouchableOpacity className="flex-row items-center gap-2 border border-border px-3 py-2 rounded-lg">
              <Feather name="download" size={14} color="#0A7B8A" />
              <Text className="text-primary text-sm font-medium">CSV</Text>
            </TouchableOpacity>
          </View>
          {mockPayments.map((p, i) => {
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
        </View>
      </StateSection>
    </View>
  );
}
