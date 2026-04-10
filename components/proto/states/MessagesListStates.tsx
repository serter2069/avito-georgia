import { View, Text, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { StateSection } from '../StateSection';
import { mockMessages } from '../../../constants/protoMockData';

function ThreadRow({ msg }: { msg: typeof mockMessages[0] }) {
  return (
    <TouchableOpacity className="flex-row items-center gap-3 py-3 border-b border-border">
      <Image source={{ uri: 'https://picsum.photos/seed/user1/48/48' }} style={{ width: 48, height: 48, borderRadius: 24 }} />
      <View className="flex-1">
        <View className="flex-row items-center justify-between mb-0.5">
          <Text className="text-text-primary text-sm font-semibold">{msg.senderName}</Text>
          <Text className="text-text-muted text-xs">{new Date(msg.createdAt).toLocaleDateString('ru')}</Text>
        </View>
        <Text className="text-text-muted text-xs mb-0.5">{msg.listingTitle}</Text>
        <Text className="text-text-secondary text-sm" numberOfLines={1}>{msg.lastMessage}</Text>
      </View>
      {msg.unreadCount > 0 && (
        <View className="bg-primary w-5 h-5 rounded-full items-center justify-center">
          <Text className="text-white text-[10px] font-bold">{msg.unreadCount}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

export default function MessagesListStates() {
  return (
    <View>
      <StateSection title="default">
        <View>
          {mockMessages.map((msg) => (
            <ThreadRow key={msg.id} msg={msg} />
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
          <Feather name="message-circle" size={48} color="#6A8898" />
          <Text className="text-text-primary text-lg font-semibold mt-3">Нет сообщений</Text>
          <Text className="text-text-muted text-sm mt-1">Начните общение с продавцами</Text>
        </View>
      </StateSection>
    </View>
  );
}
