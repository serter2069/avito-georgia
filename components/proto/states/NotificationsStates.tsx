import { View, Text, TouchableOpacity, ActivityIndicator, useWindowDimensions, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { StateSection } from '../StateSection';
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

  return (
    <View>
      <StateSection title="default">
        <View style={{ minHeight: Platform.OS === 'web' ? '100vh' : 844 }}>
          <View className="flex-row items-center justify-between h-14 px-4 bg-white border-b border-border"><Text className="text-primary text-lg font-bold">Avito Georgia</Text><View className="flex-row items-center gap-3"><Feather name="search" size={20} color="#737373" /><Feather name="bell" size={20} color="#737373" /></View></View>
          <View style={{ flex: 1 }}>

        <View style={isDesktop ? { maxWidth: 600, alignSelf: 'center', width: '100%' } : undefined}>
          {mockNotifications.map((n) => (
            <NotificationRow key={n.id} n={n} />
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
          <Feather name="bell" size={48} color="#737373" />
          <Text className="text-text-primary text-lg font-semibold mt-3">Нет уведомлений</Text>
          <Text className="text-text-muted text-sm mt-1">Здесь будут ваши уведомления</Text>
        </View>
                </View>
          <View className="flex-row h-14 bg-white border-t border-border items-center">{[{i:"home",l:"Home"},{i:"plus-circle",l:"Post"},{i:"message-circle",l:"Chat"},{i:"user",l:"Profile"}].map(t=>(<View key={t.l} className="flex-1 items-center justify-center"><Feather name={t.i as any} size={20} color="#737373" /><Text className="text-[10px] text-text-muted">{t.l}</Text></View>))}</View>
        </View>
</StateSection>
    </View>
  );
}
