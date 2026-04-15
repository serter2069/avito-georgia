import { View, Text, TouchableOpacity, Image, useWindowDimensions } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { StateSection } from '../StateSection';
import { SkeletonBlock, SkeletonRow, SkeletonCard } from '../SkeletonBlock';
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
  const containerStyle = isDesktop ? { maxWidth: 960, alignSelf: 'center' as const, width: '100%' } : {};


  return (
    <View>
      <StateSection title="DEFAULT">
        <View style={[{ minHeight: 844 }, isDesktop ? { maxWidth: 960, alignSelf: 'center', width: '100%' } : undefined]}>
          {mockMessages.map((msg) => (
            <ThreadRow key={msg.id} msg={msg} />
          ))}
        </View>
      </StateSection>

      <StateSection title="LOADING">
        <View style={[{ minHeight: 844 }, containerStyle]}>
          {[1, 2, 3, 4, 5].map(i => (
            <View key={i} style={{ borderBottomWidth: 1, borderBottomColor: '#E8EDF0' }}>
              <SkeletonRow />
            </View>
          ))}
        </View>
      </StateSection>

      <StateSection title="EMPTY">
        <View style={[{ minHeight: 844 }, containerStyle]} className="py-16 items-center">
          <Feather name="message-circle" size={48} color="#737373" />
          <Text className="text-text-primary text-lg font-semibold mt-3">Нет сообщений</Text>
          <Text className="text-text-muted text-sm mt-1">Начните общение с продавцами</Text>
          <TouchableOpacity className="bg-primary py-3 px-6 rounded-lg mt-4" onPress={() => {}}>
            <Text className="text-white font-semibold">Найти объявления</Text>
          </TouchableOpacity>
        </View>
      </StateSection>
    </View>
  );
}
