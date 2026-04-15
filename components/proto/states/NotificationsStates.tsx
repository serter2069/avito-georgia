import { View, Text, TouchableOpacity, useWindowDimensions } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { StateSection } from '../StateSection';
import { SkeletonBlock, SkeletonRow, SkeletonCard } from '../SkeletonBlock';
import { mockNotifications } from '../../../constants/protoMockData';

const iconMap: Record<string, string> = {
  message: 'message-circle',
  new_message: 'message-circle',
  moderation: 'check-circle',
  moderation_update: 'check-circle',
  promotion: 'bell',
  favorite_added: 'heart',
  listing_expiring: 'clock',
  price_drop: 'tag',
  system: 'info',
};

function NotificationRow({ n }: { n: typeof mockNotifications[0] }) {
  return (
    <TouchableOpacity className={`flex-row items-start gap-3 py-3 border-b border-border ${!n.isRead ? 'bg-primary/5' : ''}`}>
      <View className="w-10 h-10 bg-surface rounded-full items-center justify-center mt-0.5">
        <Feather name={(iconMap[n.type] as any) || 'bell'} size={18} color="#00AA6C" />
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
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;
  const containerStyle = isDesktop ? { maxWidth: 960, alignSelf: 'center' as const, width: '100%' } : {};


  return (
    <View>
      <StateSection title="DEFAULT">
        <View style={[{ minHeight: 844 }, isDesktop ? { maxWidth: 960, alignSelf: 'center', width: '100%' } : undefined]}>
          {mockNotifications.map((n) => (
            <NotificationRow key={n.id} n={n} />
          ))}
        </View>
      </StateSection>

      <StateSection title="LOADING">
        <View style={[{ minHeight: 844 }, containerStyle]}>
          {[1, 2, 3, 4].map(i => (
            <View key={i} style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#E8EDF0' }}>
              <SkeletonBlock width={40} height={40} radius={20} />
              <View style={{ flex: 1, gap: 8 }}>
                <SkeletonBlock width="50%" height={14} />
                <SkeletonBlock width="80%" height={12} />
                <SkeletonBlock width="30%" height={10} />
              </View>
            </View>
          ))}
        </View>
      </StateSection>

      <StateSection title="EMPTY">
        <View style={[{ minHeight: 844 }, containerStyle]} className="py-16 items-center">
          <Feather name="bell" size={48} color="#737373" />
          <Text className="text-text-primary text-lg font-semibold mt-3">Нет уведомлений</Text>
          <Text className="text-text-muted text-sm mt-1">Здесь будут ваши уведомления</Text>
        </View>
      </StateSection>
    </View>
  );
}
