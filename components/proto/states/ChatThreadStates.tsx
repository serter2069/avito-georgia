import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, useWindowDimensions } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { StateSection } from '../StateSection';
import { SkeletonBlock, SkeletonRow, SkeletonCard } from '../SkeletonBlock';
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
  const containerStyle = isDesktop ? { maxWidth: 960, alignSelf: 'center' as const, width: '100%' } : {};


  return (
    <View>
      <StateSection title="DEFAULT">
        <View style={[{ minHeight: 844 }, isDesktop ? { maxWidth: 960, alignSelf: 'center', width: '100%' } : undefined]}>
          <View className="bg-surface rounded-lg p-3 mb-4 flex-row items-center gap-2">
            <Feather name="tag" size={16} color="#00AA6C" />
            <Text className="text-text-secondary text-sm font-medium">Toyota Camry 2020</Text>
          </View>
          {mockChatMessages.map((msg) => (
            <ChatBubble key={msg.id} text={msg.text} isOwn={msg.isOwn} time={new Date(msg.createdAt).toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' })} />
          ))}
          <View className="flex-row items-center gap-2 mt-4 border-t border-border pt-3">
            <TextInput
              className="flex-1 bg-surface border border-border rounded-lg px-4 py-3 text-base"
              placeholder="Сообщение..."
              placeholderTextColor="#737373"
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

      <StateSection title="LOADING">
        <View style={[{ minHeight: 844 }, containerStyle]}>
          <SkeletonBlock height={44} radius={8} style={{ marginBottom: 16 }} />
          {[1, 2, 3, 4].map(i => (
            <View key={i} style={{ alignItems: i % 2 === 0 ? 'flex-end' : 'flex-start', marginBottom: 12 }}>
              <SkeletonBlock width={i % 2 === 0 ? '60%' : '70%'} height={40} radius={16} />
              <SkeletonBlock width={40} height={8} style={{ marginTop: 4 }} />
            </View>
          ))}
        </View>
      </StateSection>

      <StateSection title="EMPTY">
        <View style={[{ minHeight: 844 }, isDesktop ? { maxWidth: 960, alignSelf: 'center', width: '100%' } : undefined]} className="py-12 items-center">
          <Feather name="message-circle" size={48} color="#737373" />
          <Text className="text-text-muted text-sm mt-3">Начните диалог</Text>
          <View className="flex-row items-center gap-2 mt-6 w-full">
            <TextInput
              className="flex-1 bg-surface border border-border rounded-lg px-4 py-3 text-base"
              placeholder="Сообщение..."
              placeholderTextColor="#737373"
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

      <StateSection title="SENDING">
        <View style={[{ minHeight: 844 }, isDesktop ? { maxWidth: 960, alignSelf: 'center', width: '100%' } : undefined]}>
          {mockChatMessages.map((msg) => (
            <ChatBubble key={msg.id} text={msg.text} isOwn={msg.isOwn} time={new Date(msg.createdAt).toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' })} />
          ))}
          <View className="items-end mb-3">
            <View className="max-w-[80%] px-4 py-3 rounded-2xl bg-primary rounded-br-sm opacity-50">
              <Text className="text-white text-sm">Отлично, договорились!</Text>
            </View>
            <Text style={{ fontSize: 11, color: "#737373", marginTop: 2 }}>Отправка...</Text>
          </View>
        </View>
      </StateSection>
    </View>
  );
}
