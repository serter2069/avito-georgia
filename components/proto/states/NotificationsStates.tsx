import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { StateSection } from '../StateSection';
import { mockNotifications } from '../../../constants/protoMockData';

const iconMap: Record<string, string> = {
  message: 'message-circle',
  moderation: 'check-circle',
  promotion: 'bell',
  system: 'info',
};

function NotificationRow({ n }: { n: typeof mockNotifications[0] }) {
  return (
    <TouchableOpacity className={`flex-row items-start gap-3 py-3 border-b border-border ${!n.isRead ? 'bg-primary/5' : ''}`}>
      <View className="w-10 h-10 bg-surface rounded-full items-center justify-center mt-0.5">
        <Feather name={(iconMap[n.type] as any) || 'bell'} size={18} color="#0A7B8A" />
      </View>
      <View className="flex-1">
        <View className="flex-row items-center gap-2 mb-0.5">
          <Text className="text-text-primary text-sm font-semibold">{n.title}</Text>
          {!n.isRead && <View className="w-2 h-2 rounded-full bg-primary" />}
        </View>
        <Text className="text-text-muted text-sm">{n.description}</Text>
        <Text className="text-text-muted text-xs mt-1">{new Date(n.createdAt).toLocaleDateString('ru')}</Text>
      </View>
    </TouchableOpacity>
  );
}

export default function NotificationsStates() {
  return (
    <View>
      <StateSection title="default">
        <View>
          {mockNotifications.map((n) => (
            <NotificationRow key={n.id} n={n} />
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
          <Feather name="bell" size={48} color="#6A8898" />
          <Text className="text-text-primary text-lg font-semibold mt-3">Нет уведомлений</Text>
          <Text className="text-text-muted text-sm mt-1">Здесь будут ваши уведомления</Text>
        </View>
      </StateSection>
    </View>
  );
}
