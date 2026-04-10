import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { StateSection } from '../StateSection';
import { mockAdminStats } from '../../../constants/protoMockData';

function StatCard({ label, value, icon, color }: { label: string; value: string; icon: string; color: string }) {
  return (
    <View className="w-[48%] bg-white border border-border rounded-lg p-4 mb-3">
      <View className="flex-row items-center gap-2 mb-2">
        <Feather name={icon as any} size={20} color={color} />
        <Text className="text-text-muted text-xs">{label}</Text>
      </View>
      <Text className="text-text-primary text-2xl font-bold">{value}</Text>
    </View>
  );
}

function NavCard({ title, icon, count }: { title: string; icon: string; count?: number }) {
  return (
    <TouchableOpacity className="flex-row items-center gap-3 bg-white border border-border rounded-lg p-4 mb-2">
      <View className="w-10 h-10 bg-surface rounded-lg items-center justify-center">
        <Feather name={icon as any} size={20} color="#0A7B8A" />
      </View>
      <Text className="text-text-primary text-base font-medium flex-1">{title}</Text>
      {count !== undefined && (
        <View className="bg-error w-6 h-6 rounded-full items-center justify-center">
          <Text className="text-white text-xs font-bold">{count}</Text>
        </View>
      )}
      <Feather name="chevron-right" size={16} color="#6A8898" />
    </TouchableOpacity>
  );
}

export default function AdminDashboardStates() {
  return (
    <View>
      <StateSection title="default">
        <View>
          <Text className="text-text-primary text-lg font-bold mb-4">Admin Dashboard</Text>
          <View className="flex-row flex-wrap gap-3 mb-4">
            <StatCard label="Пользователи" value={mockAdminStats.totalUsers.toLocaleString()} icon="users" color="#0A7B8A" />
            <StatCard label="Объявления" value={mockAdminStats.totalListings.toLocaleString()} icon="list" color="#1A4A6E" />
            <StatCard label="На модерации" value={String(mockAdminStats.pendingModeration)} icon="clock" color="#f59e0b" />
            <StatCard label="Доход (GEL)" value={mockAdminStats.totalRevenue.toLocaleString()} icon="dollar-sign" color="#2E7D30" />
          </View>
          <NavCard title="Пользователи" icon="users" />
          <NavCard title="Модерация" icon="shield" count={23} />
          <NavCard title="Категории" icon="grid" />
          <NavCard title="Жалобы" icon="flag" count={3} />
          <NavCard title="Платежи" icon="credit-card" />
          <NavCard title="Настройки" icon="settings" />
        </View>
      </StateSection>

      <StateSection title="loading">
        <View className="py-16 items-center">
          <ActivityIndicator size="large" color="#0A7B8A" />
        </View>
      </StateSection>
    </View>
  );
}
