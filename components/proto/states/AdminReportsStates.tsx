import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StateSection } from '../StateSection';
import { mockReports } from '../../../constants/protoMockData';

const typeBadge: Record<string, { bg: string; text: string; label: string }> = {
  spam: { bg: 'bg-warning/20', text: 'text-warning', label: 'Спам' },
  fraud: { bg: 'bg-error/20', text: 'text-error', label: 'Мошенничество' },
  inappropriate: { bg: 'bg-info/20', text: 'text-info', label: 'Контент' },
};

function ReportRow({ r }: { r: typeof mockReports[0] }) {
  const badge = typeBadge[r.type] || typeBadge.spam;
  return (
    <View className="border border-border rounded-lg p-3 mb-3">
      <View className="flex-row items-center justify-between mb-2">
        <View className={`${badge.bg} px-2 py-0.5 rounded-full`}>
          <Text className={`${badge.text} text-xs font-medium`}>{badge.label}</Text>
        </View>
        <Text className="text-text-muted text-xs">{new Date(r.createdAt).toLocaleDateString('ru')}</Text>
      </View>
      <Text className="text-text-primary text-sm font-semibold mb-1">{r.listingTitle}</Text>
      <Text className="text-text-muted text-sm mb-1">От: {r.reporterName}</Text>
      <Text className="text-text-secondary text-sm mb-3">{r.description}</Text>
      <View className="flex-row gap-2">
        <TouchableOpacity className="flex-1 bg-primary py-2 rounded-lg items-center">
          <Text className="text-white text-sm font-medium">К объявлению</Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex-1 border border-border py-2 rounded-lg items-center">
          <Text className="text-text-secondary text-sm font-medium">Отклонить</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function AdminReportsStates() {
  return (
    <View>
      <StateSection title="default">
        <View>
          <Text className="text-text-primary text-lg font-bold mb-4">Жалобы ({mockReports.length})</Text>
          {mockReports.map((r) => (
            <ReportRow key={r.id} r={r} />
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
          <Ionicons name="flag-outline" size={48} color="#6A8898" />
          <Text className="text-text-primary text-lg font-semibold mt-3">Нет жалоб</Text>
          <Text className="text-text-muted text-sm mt-1">Новые жалобы появятся здесь</Text>
        </View>
      </StateSection>
    </View>
  );
}
