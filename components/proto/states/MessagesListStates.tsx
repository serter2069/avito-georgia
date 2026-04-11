import { View, Text, TouchableOpacity, ActivityIndicator, Image, useWindowDimensions, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { StateSection } from '../StateSection';
import { mockMessages } from '../../../constants/protoMockData';

function ThreadRow({ msg }: { msg: typeof mockMessages[0] }) {
  const hasUnread = msg.unreadCount > 0;
  return (
    <TouchableOpacity className={`flex-row items-center gap-3 py-3 border-b border-border ${hasUnread ? 'bg-primary/5' : ''}`}>
      <Image source={{ uri: 'https://picsum.photos/seed/user1/48/48' }} style={{ width: 48, height: 48, borderRadius: 24 }} />
      <View className="flex-1">
        <View className="flex-row items-center justify-between mb-0.5">
          <Text className={`text-text-primary text-sm ${hasUnread ? 'font-bold' : 'font-semibold'}`}>{msg.senderName}</Text>
          <Text className="text-text-muted text-xs">{new Date(msg.createdAt).toLocaleDateString('ru')}</Text>
        </View>
        <Text className="text-text-muted text-xs mb-0.5">{msg.listingTitle}</Text>
        <Text className={`text-sm ${hasUnread ? 'text-text-primary font-medium' : 'text-text-secondary'}`} numberOfLines={1}>{msg.lastMessage}</Text>
      </View>
      {hasUnread && (
        <View className="bg-primary w-5 h-5 rounded-full items-center justify-center">
          <Text className="text-white text-[10px] font-bold">{msg.unreadCount}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

export default function MessagesListStates() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;

  return (
    <View>
      <StateSection title="default">
        <View style={{ minHeight: Platform.OS === 'web' ? '100vh' : 844 }}>
          <View className="flex-row items-center justify-between h-14 px-4 bg-white border-b border-border"><Text className="text-primary text-lg font-bold">Avito Georgia</Text><View className="flex-row items-center gap-3"><Feather name="search" size={20} color="#737373" /><Feather name="bell" size={20} color="#737373" /></View></View>
          <View style={{ flex: 1 }}>

        <View style={isDesktop ? { maxWidth: 720, alignSelf: 'center', width: '100%' } : undefined}>
          {mockMessages.map((msg) => (
            <ThreadRow key={msg.id} msg={msg} />
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
          <Feather name="message-circle" size={48} color="#737373" />
          <Text className="text-text-primary text-lg font-semibold mt-3">Нет сообщений</Text>
          <Text className="text-text-muted text-sm mt-1">Начните общение с продавцами</Text>
          <TouchableOpacity className="bg-primary py-3 px-6 rounded-lg mt-4" onPress={() => {}}>
            <Text className="text-white font-semibold">Найти объявления</Text>
          </TouchableOpacity>
        </View>
                </View>
          <View className="flex-row h-14 bg-white border-t border-border items-center">{[{i:"home",l:"Home"},{i:"plus-circle",l:"Post"},{i:"message-circle",l:"Chat"},{i:"user",l:"Profile"}].map(t=>(<View key={t.l} className="flex-1 items-center justify-center"><Feather name={t.i as any} size={20} color="#737373" /><Text className="text-[10px] text-text-muted">{t.l}</Text></View>))}</View>
        </View>
</StateSection>
    </View>
  );
}
