import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, useWindowDimensions } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { StateSection } from '../StateSection';
import { mockChatMessages } from '../../../constants/protoMockData';

function ChatBubble({ text, isOwn, time }: { text: string; isOwn: boolean; time: string }) {
  return (
    <View className={`mb-3 ${isOwn ? 'items-end' : 'items-start'}`}>
      <View className={`max-w-[80%] px-4 py-3 rounded-2xl ${isOwn ? 'bg-primary rounded-br-sm' : 'bg-surface rounded-bl-sm'}`}>
        <Text className={`text-sm ${isOwn ? 'text-white' : 'text-text-primary'}`}>{text}</Text>
      </View>
      <Text className="text-text-muted text-[10px] mt-1 px-1">{time}</Text>
    </View>
  );
}

export default function ChatThreadStates() {
  const [message, setMessage] = useState('');
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;

  return (
    <View>
      <StateSection title="default">
        <View style={isDesktop ? { maxWidth: 720, alignSelf: 'center', width: '100%' } : undefined}>
          <View className="bg-surface rounded-lg p-3 mb-4 flex-row items-center gap-2">
            <Feather name="tag" size={16} color="#0A7B8A" />
            <Text className="text-text-secondary text-sm font-medium">Toyota Camry 2020</Text>
          </View>
          {mockChatMessages.map((msg) => (
            <ChatBubble key={msg.id} text={msg.text} isOwn={msg.isOwn} time={new Date(msg.createdAt).toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' })} />
          ))}
          <View className="flex-row items-center gap-2 mt-4 border-t border-border pt-3">
            <TextInput
              className="flex-1 bg-surface border border-border rounded-lg px-4 py-3 text-base"
              placeholder="Сообщение..."
              placeholderTextColor="#6A8898"
              value={message}
              onChangeText={setMessage}
            />
            <TouchableOpacity
              className={`p-3 rounded-lg ${message.length > 0 ? 'bg-primary' : 'bg-border'}`}
              disabled={message.length === 0}
            >
              <Feather name="send" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </StateSection>

      <StateSection title="loading">
        <View className="py-16 items-center">
          <ActivityIndicator size="large" color="#0A7B8A" />
        </View>
      </StateSection>

      <StateSection title="empty">
        <View style={isDesktop ? { maxWidth: 720, alignSelf: 'center', width: '100%' } : undefined} className="py-12 items-center">
          <Feather name="message-circle" size={48} color="#6A8898" />
          <Text className="text-text-muted text-sm mt-3">Начните диалог</Text>
          <View className="flex-row items-center gap-2 mt-6 w-full">
            <TextInput
              className="flex-1 bg-surface border border-border rounded-lg px-4 py-3 text-base"
              placeholder="Сообщение..."
              placeholderTextColor="#6A8898"
              value={message}
              onChangeText={setMessage}
            />
            <TouchableOpacity
              className={`p-3 rounded-lg ${message.length > 0 ? 'bg-primary' : 'bg-border'}`}
              disabled={message.length === 0}
            >
              <Feather name="send" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </StateSection>

      <StateSection title="sending">
        <View style={isDesktop ? { maxWidth: 720, alignSelf: 'center', width: '100%' } : undefined}>
          {mockChatMessages.map((msg) => (
            <ChatBubble key={msg.id} text={msg.text} isOwn={msg.isOwn} time={new Date(msg.createdAt).toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' })} />
          ))}
          <View className="items-end mb-3">
            <View className="max-w-[80%] px-4 py-3 rounded-2xl bg-primary rounded-br-sm opacity-50">
              <Text className="text-white text-sm">Отлично, договорились!</Text>
            </View>
            <ActivityIndicator size="small" color="#0A7B8A" className="mt-1" />
          </View>
        </View>
      </StateSection>
    </View>
  );
}
