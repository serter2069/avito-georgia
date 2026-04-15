import { View, Text, TouchableOpacity,
  useWindowDimensions} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import { StateSection } from '../StateSection';
import { SkeletonBlock, SkeletonRow, SkeletonCard } from '../SkeletonBlock';
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
        <Feather name={icon as any} size={20} color="#00AA6C" />
      </View>
      <Text className="text-text-primary text-base font-medium flex-1">{title}</Text>
      {count !== undefined && (
        <View className="bg-error w-6 h-6 rounded-full items-center justify-center">
          <Text className="text-white text-xs font-bold">{count}</Text>
        </View>
      )}
      <Feather name="chevron-right" size={16} color="#737373" />
    </TouchableOpacity>
  );
}

const chart7 = [42, 38, 55, 47, 63, 71, 58];
const chart7Labels = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
const chart30 = [38, 44, 52, 48, 61, 55, 45, 70, 63, 58, 72, 65, 48, 55, 78, 60, 52, 67, 71, 58, 63, 55, 48, 70, 65, 58, 72, 60, 55, 63];
const chart30Labels = ['1', '', '', '', '5', '', '', '', '', '10', '', '', '', '', '15', '', '', '', '', '20', '', '', '', '', '25', '', '', '', '', '30'];

function MiniBarChart({ data, labels, color }: { data: number[]; labels: string[]; color: string }) {
  const maxVal = Math.max(...data);
  return (
    <View>
      <View className="flex-row items-end" style={{ height: 40, gap: 2 }}>
        {data.map((v, i) => (
          <View key={i} className="flex-1 bg-border rounded-sm overflow-hidden" style={{ height: 40, justifyContent: 'flex-end' }}>
            <View style={{ height: Math.round((v / maxVal) * 40), backgroundColor: color }} />
          </View>
        ))}
      </View>
      <View className="flex-row mt-1" style={{ gap: 2 }}>
        {labels.map((l, i) => (
          <View key={i} className="flex-1 items-center">
            <Text className="text-text-muted" style={{ fontSize: 7 }}>{l}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

export default function AdminDashboardStates() {
  const [period, setPeriod] = useState<'7' | '30'>('7');
  const { width } = useWindowDimensions();

  const isDesktop = width >= 768;

  const containerStyle = isDesktop ? { maxWidth: 960, alignSelf: 'center' as const, width: '100%' } : {};


  return (
    <View>
      <StateSection title="DEFAULT">
        <View style={[{ minHeight: 844 }, containerStyle]}>
          <Text className="text-text-primary text-lg font-bold mb-4">Admin Dashboard</Text>
          <View className="flex-row flex-wrap gap-3 mb-4">
            <StatCard label="Пользователи" value={mockAdminStats.totalUsers.toLocaleString()} icon="users" color="#00AA6C" />
            <StatCard label="Объявления" value={mockAdminStats.totalListings.toLocaleString()} icon="list" color="#1A1A1A" />
            <StatCard label="На модерации" value={String(mockAdminStats.pendingModeration)} icon="clock" color="#f59e0b" />
            <StatCard label="Доход (GEL)" value={mockAdminStats.totalRevenue.toLocaleString()} icon="dollar-sign" color="#2E7D30" />
          </View>

          <View className="bg-white border border-border rounded-lg p-4 mb-4">
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-text-secondary text-sm font-medium">Объявления</Text>
              <View className="flex-row bg-surface border border-border rounded-lg p-0.5">
                <TouchableOpacity
                  className={`px-3 py-1 rounded-md ${period === '7' ? 'bg-primary' : ''}`}
                  onPress={() => setPeriod('7')}
                >
                  <Text className={`text-xs font-medium ${period === '7' ? 'text-white' : 'text-text-muted'}`}>7 дней</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className={`px-3 py-1 rounded-md ${period === '30' ? 'bg-primary' : ''}`}
                  onPress={() => setPeriod('30')}
                >
                  <Text className={`text-xs font-medium ${period === '30' ? 'text-white' : 'text-text-muted'}`}>30 дней</Text>
                </TouchableOpacity>
              </View>
            </View>
            <MiniBarChart
              data={period === '7' ? chart7 : chart30}
              labels={period === '7' ? chart7Labels : chart30Labels}
              color="#00AA6C"
            />
          </View>

          <NavCard title="ПОЛЬЗОВАТЕЛИ" icon="users" />
          <NavCard title="МОДЕРАЦИЯ" icon="shield" count={23} />
          <NavCard title="КАТЕГОРИИ" icon="grid" />
          <NavCard title="ЖАЛОБЫ" icon="flag" count={3} />
          <NavCard title="ПЛАТЕЖИ" icon="credit-card" />
          <NavCard title="НАСТРОЙКИ" icon="settings" />
        </View>
      </StateSection>

      <StateSection title="LOADING">
        <View style={[{ minHeight: 844 }, containerStyle]}>
          <SkeletonBlock width={160} height={20} style={{ marginBottom: 16 }} />
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
            {[1, 2, 3, 4].map(i => (
              <View key={i} style={{ width: '48%', backgroundColor: '#fff', borderRadius: 8, borderWidth: 1, borderColor: '#E8EDF0', padding: 16, gap: 8 }}>
                <SkeletonBlock width={80} height={12} />
                <SkeletonBlock width={60} height={28} />
              </View>
            ))}
          </View>
          <View style={{ backgroundColor: '#fff', borderRadius: 8, borderWidth: 1, borderColor: '#E8EDF0', padding: 16, marginBottom: 16 }}>
            <SkeletonBlock width={120} height={14} style={{ marginBottom: 12 }} />
            <SkeletonBlock height={40} />
          </View>
          {[1, 2, 3].map(i => (
            <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#E8EDF0' }}>
              <SkeletonBlock width={40} height={40} radius={8} />
              <SkeletonBlock width={120} height={14} style={{ flex: 1 }} />
            </View>
          ))}
        </View>
      </StateSection>
    </View>
  );
}
