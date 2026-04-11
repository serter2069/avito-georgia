import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import { StateSection } from '../StateSection';
import { mockReports } from '../../../constants/protoMockData';

const typeBadge: Record<string, { bg: string; text: string; label: string }> = {
  spam: { bg: 'bg-warning/20', text: 'text-warning', label: 'Спам' },
  fraud: { bg: 'bg-error/20', text: 'text-error', label: 'Мошенничество' },
  inappropriate: { bg: 'bg-info/20', text: 'text-info', label: 'Контент' },
};

function ReportRow({ r, reviewed, onReview, onDeletePress }: { r: typeof mockReports[0]; reviewed: boolean; onReview: () => void; onDeletePress: () => void }) {
  const badge = typeBadge[r.type] || typeBadge.spam;
  return (
    <View className={`border rounded-lg p-3 mb-3 ${reviewed ? 'border-border opacity-60' : 'border-border'}`}>
      <View className="flex-row items-center justify-between mb-2">
        <View className="flex-row items-center gap-2">
          <View className={`${badge.bg} px-2 py-0.5 rounded-full`}>
            <Text className={`${badge.text} text-xs font-medium`}>{badge.label}</Text>
          </View>
          <View className={`px-2 py-0.5 rounded-full ${reviewed ? 'bg-success/20' : 'bg-primary/20'}`}>
            <Text className={`text-xs font-medium ${reviewed ? 'text-success' : 'text-primary'}`}>
              {reviewed ? 'Рассмотрена' : 'Новая'}
            </Text>
          </View>
        </View>
        <Text className="text-text-muted text-xs">{new Date(r.createdAt).toLocaleDateString('ru')}</Text>
      </View>
      <Text className="text-text-primary text-sm font-semibold mb-1">{r.listingTitle}</Text>
      <Text className="text-text-muted text-sm mb-1">От: {r.reporterName}</Text>
      <Text className="text-text-secondary text-sm mb-3">{r.description}</Text>
      {!reviewed && (
        <View className="flex-row gap-2">
          <TouchableOpacity className="flex-1 bg-error py-2 rounded-lg items-center" onPress={onDeletePress}>
            <Text className="text-white text-sm font-medium">Удалить объявление</Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-1 border border-border py-2 rounded-lg items-center" onPress={onReview}>
            <Text className="text-text-secondary text-sm font-medium">Отклонить жалобу</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

export default function AdminReportsStates() {
  const [reviewed, setReviewed] = useState<Record<string, boolean>>({ r3: true });
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  return (
    <View>
      <StateSection title="default">
        <View>
          <Text className="text-text-primary text-lg font-bold mb-4">Жалобы ({mockReports.length})</Text>
          {mockReports.map((r) => (
            <ReportRow
              key={r.id}
              r={r}
              reviewed={!!reviewed[r.id]}
              onReview={() => setReviewed(prev => ({ ...prev, [r.id]: true }))}
              onDeletePress={() => setDeleteTarget(r.id)}
            />
          ))}
          {deleteTarget && (
            <View className="bg-white border border-error/30 rounded-lg p-4 mt-2">
              <Text className="text-text-primary text-base font-bold mb-1">Удалить объявление?</Text>
              <Text className="text-text-muted text-sm mb-4">Это действие необратимо. Объявление будет удалено для всех пользователей.</Text>
              <View className="flex-row gap-3">
                <TouchableOpacity className="flex-1 border border-border py-3 rounded-lg items-center" onPress={() => setDeleteTarget(null)}>
                  <Text className="text-text-secondary font-semibold">Отмена</Text>
                </TouchableOpacity>
                <TouchableOpacity className="flex-1 bg-error py-3 rounded-lg items-center" onPress={() => { setDeleteTarget(null); setReviewed(prev => ({ ...prev, [deleteTarget]: true })); }}>
                  <Text className="text-white font-semibold">Удалить</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </StateSection>

      <StateSection title="loading">
        <View className="py-16 items-center">
          <ActivityIndicator size="large" color="#00AA6C" />
        </View>
      </StateSection>

      <StateSection title="empty">
        <View className="py-16 items-center">
          <Feather name="flag" size={48} color="#737373" />
          <Text className="text-text-primary text-lg font-semibold mt-3">Нет жалоб</Text>
          <Text className="text-text-muted text-sm mt-1">Новые жалобы появятся здесь</Text>
        </View>
      </StateSection>
    </View>
  );
}
