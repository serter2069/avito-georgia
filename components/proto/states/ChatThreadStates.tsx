import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, Pressable, useWindowDimensions } from 'react-native';
import { StateSection } from '../StateSection';
import BottomNav from '../BottomNav';

const C = {
  green: '#00AA6C',
  greenBg: '#E8F9F2',
  white: '#FFFFFF',
  text: '#1A1A1A',
  muted: '#9E9E9E',
  border: '#E8E8E8',
  page: '#F5F5F5',
};

interface Message {
  id: number;
  text: string;
  mine: boolean;
  time: string;
}

const INITIAL_MESSAGES: Message[] = [
  { id: 1, text: 'Здравствуйте, машина ещё продаётся?', mine: true, time: '14:10' },
  { id: 2, text: 'Да, ещё продаётся. Что вас интересует?', mine: false, time: '14:12' },
  { id: 3, text: 'Можно посмотреть завтра? Я из Тбилиси.', mine: true, time: '14:14' },
  { id: 4, text: 'Конечно, приходите в первой половине дня.', mine: false, time: '14:15' },
  { id: 5, text: 'Адрес Руставели 15, третий этаж. Звоните когда будете рядом.', mine: false, time: '14:15' },
  { id: 6, text: 'Отлично, буду около 11:00. Спасибо!', mine: true, time: '14:17' },
  { id: 7, text: 'Хорошо, жду вас.', mine: false, time: '14:18' },
  { id: 8, text: 'До встречи!', mine: true, time: '14:18' },
];

function Header() {
  return (
    <View style={{
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: C.border,
      backgroundColor: C.white,
      gap: 12,
    }}>
      <Pressable>
        <Text style={{ fontSize: 22, color: C.muted, lineHeight: 22 }}>{'<'}</Text>
      </Pressable>
      <View style={{
        width: 38, height: 38, borderRadius: 19,
        backgroundColor: '#5B8DEF',
        alignItems: 'center', justifyContent: 'center',
      }}>
        <Text style={{ color: C.white, fontWeight: '700', fontSize: 15 }}>М</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 15, fontWeight: '600', color: C.text }}>Михаил</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <View style={{ width: 7, height: 7, borderRadius: 3.5, backgroundColor: C.green }} />
          <Text style={{ fontSize: 12, color: C.green }}>онлайн</Text>
        </View>
      </View>
    </View>
  );
}

function MessageBubble({ msg }: { msg: Message }) {
  if (msg.mine) {
    return (
      <View style={{ alignItems: 'flex-end', paddingHorizontal: 16, marginBottom: 6 }}>
        <View style={{
          backgroundColor: C.greenBg,
          borderRadius: 14,
          borderBottomRightRadius: 4,
          paddingHorizontal: 12,
          paddingVertical: 8,
          maxWidth: '75%',
        }}>
          <Text style={{ fontSize: 14, color: C.text, lineHeight: 20 }}>{msg.text}</Text>
        </View>
        <Text style={{ fontSize: 10, color: C.muted, marginTop: 2 }}>{msg.time}</Text>
      </View>
    );
  }
  return (
    <View style={{ alignItems: 'flex-start', paddingHorizontal: 16, marginBottom: 6 }}>
      <View style={{
        backgroundColor: C.white,
        borderRadius: 14,
        borderBottomLeftRadius: 4,
        borderWidth: 1,
        borderColor: C.border,
        paddingHorizontal: 12,
        paddingVertical: 8,
        maxWidth: '75%',
      }}>
        <Text style={{ fontSize: 14, color: C.text, lineHeight: 20 }}>{msg.text}</Text>
      </View>
      <Text style={{ fontSize: 10, color: C.muted, marginTop: 2 }}>{msg.time}</Text>
    </View>
  );
}

function InteractiveChat() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState('');

  function sendMessage() {
    const text = input.trim();
    if (!text) return;
    const now = new Date();
    const time = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;
    setMessages(prev => [...prev, { id: prev.length + 1, text, mine: true, time }]);
    setInput('');
  }

  return (
    <View style={{ flex: 1, backgroundColor: C.page }}>
      <ScrollView
        contentContainerStyle={{ paddingTop: 12, paddingBottom: 8 }}
        showsVerticalScrollIndicator={false}
      >
        {messages.map(msg => <MessageBubble key={msg.id} msg={msg} />)}
      </ScrollView>
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderTopWidth: 1,
        borderTopColor: C.border,
        backgroundColor: C.white,
        gap: 8,
      }}>
        <View style={{
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
          borderWidth: 1,
          borderColor: C.border,
          borderRadius: 20,
          paddingHorizontal: 14,
        }}>
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Написать..."
            placeholderTextColor={C.muted}
            style={{ flex: 1, fontSize: 15, color: C.text, paddingVertical: 10, borderWidth: 0, backgroundColor: 'transparent', outlineWidth: 0 } as any}
            onSubmitEditing={sendMessage}
            returnKeyType="send"
          />
        </View>
        <Pressable
          onPress={sendMessage}
          style={{
            width: 40, height: 40, borderRadius: 20,
            backgroundColor: C.green,
            alignItems: 'center', justifyContent: 'center',
          }}
        >
          <Text style={{ color: C.white, fontSize: 18, fontWeight: '700', marginLeft: 2 }}>{'>'}</Text>
        </Pressable>
      </View>
    </View>
  );
}

function ChatThreadDefault() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 640;

  const inner = (
    <View style={{ flex: 1, minHeight: 520 }}>
      <Header />
      <InteractiveChat />
      {!isDesktop && <BottomNav active="messages" />}
    </View>
  );

  if (isDesktop) {
    return (
      <StateSection title="CHAT_THREAD / Default">
        <View style={{ maxWidth: 800, alignSelf: 'center', width: '100%', backgroundColor: C.white, borderRadius: 12, borderWidth: 1, borderColor: C.border, overflow: 'hidden' }}>
          {inner}
        </View>
      </StateSection>
    );
  }

  return (
    <StateSection title="CHAT_THREAD / Default">
      <View style={{ backgroundColor: C.white }}>
        {inner}
      </View>
    </StateSection>
  );
}

export default function ChatThreadStates() {
  return (
    <View style={{ gap: 0 }}>
      <ChatThreadDefault />
    </View>
  );
}
