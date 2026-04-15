import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, Pressable } from 'react-native';
import { StateSection } from '../StateSection';

const C = { green:'#00AA6C', greenBg:'#E8F9F2', white:'#FFFFFF', page:'#F5F5F5', text:'#1A1A1A', muted:'#737373', border:'#E0E0E0', error:'#D32F2F' };

const AVATAR_COLORS = ['#00AA6C', '#1565C0', '#E65100', '#7B1FA2', '#C62828'];

function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <View className="bg-white rounded-xl border border-[#E0E0E0] overflow-hidden" style={{ width: 390, alignSelf: 'center' }}>
      {children}
    </View>
  );
}

function Avatar({ letter, colorIdx }: { letter: string; colorIdx: number }) {
  return (
    <View
      className="w-11 h-11 rounded-full items-center justify-center"
      style={{ backgroundColor: AVATAR_COLORS[colorIdx % AVATAR_COLORS.length] }}
    >
      <Text className="text-white font-bold text-base">{letter}</Text>
    </View>
  );
}

interface ConvoRow {
  letter: string;
  colorIdx: number;
  name: string;
  listing: string;
  lastMessage: string;
  time: string;
  unread?: number;
}

const CONVERSATIONS: ConvoRow[] = [
  { letter: 'M', colorIdx: 0, name: 'Михаил', listing: 'Toyota Camry 2019', lastMessage: 'Да, продаётся. Приходите завтра.', time: '14:35', unread: 2 },
  { letter: 'A', colorIdx: 1, name: 'Анна', listing: 'Квартира 3-комн, Батуми', lastMessage: 'Можно посмотреть в субботу?', time: '12:10', unread: 1 },
  { letter: 'G', colorIdx: 2, name: 'Георгий', listing: 'iPhone 15 Pro', lastMessage: 'Скину фото коробки вечером', time: 'Вчера' },
  { letter: 'N', colorIdx: 3, name: 'Нино', listing: 'Диван угловой', lastMessage: 'Вы: Спасибо, подумаю', time: 'Вчера' },
  { letter: 'D', colorIdx: 4, name: 'Давид', listing: 'Велосипед горный', lastMessage: 'Вы: Какой размер рамы?', time: 'Пн' },
];

function ConversationItem({ row, isLast }: { row: ConvoRow; isLast: boolean }) {
  return (
    <View>
      <Pressable className="flex-row items-center px-4 py-3" style={{ gap: 12 }}>
        <Avatar letter={row.letter} colorIdx={row.colorIdx} />
        <View className="flex-1" style={{ gap: 2 }}>
          <View className="flex-row items-center justify-between">
            <Text className="text-[15px] font-semibold" style={{ color: C.text }}>{row.name}</Text>
            <Text className="text-xs" style={{ color: row.unread ? C.green : C.muted }}>{row.time}</Text>
          </View>
          <Text className="text-xs" style={{ color: C.muted }} numberOfLines={1}>{row.listing}</Text>
          <Text className="text-sm" style={{ color: row.unread ? C.text : C.muted }} numberOfLines={1}>{row.lastMessage}</Text>
        </View>
        {row.unread && (
          <View className="w-5 h-5 rounded-full bg-[#00AA6C] items-center justify-center">
            <Text className="text-white text-[10px] font-bold">{row.unread}</Text>
          </View>
        )}
      </Pressable>
      {!isLast && <View className="h-px bg-[#E0E0E0] ml-[68px]" />}
    </View>
  );
}

// ── State 1: Default — with messages ───────────────────────────────────────────

function DefaultWithMessages() {
  return (
    <StateSection title="MESSAGES_LIST__DEFAULT">
      <PhoneFrame>
        <View className="px-4 pt-4 pb-3">
          <Text className="text-xl font-bold" style={{ color: C.text }}>Сообщения</Text>
        </View>
        {CONVERSATIONS.map((row, idx) => (
          <ConversationItem key={row.name} row={row} isLast={idx === CONVERSATIONS.length - 1} />
        ))}
      </PhoneFrame>
    </StateSection>
  );
}

// ── State 2: Search messages ───────────────────────────────────────────────────

function SearchMessages() {
  const filtered = CONVERSATIONS.filter(r => r.name === 'Анна' || r.name === 'Нино');

  return (
    <StateSection title="MESSAGES_LIST__SEARCH">
      <PhoneFrame>
        <View className="px-4 pt-4 pb-2">
          <Text className="text-xl font-bold mb-3" style={{ color: C.text }}>Сообщения</Text>
          <View className="flex-row items-center bg-[#F5F5F5] rounded-lg px-3 py-2" style={{ gap: 8 }}>
            <Text style={{ color: C.muted }}>Q</Text>
            <TextInput
              className="flex-1 text-sm"
              value="кварт"
              editable={false}
              style={{ color: C.text }}
            />
          </View>
        </View>
        <View className="mt-1">
          {filtered.map((row, idx) => (
            <ConversationItem key={row.name} row={row} isLast={idx === filtered.length - 1} />
          ))}
        </View>
      </PhoneFrame>
    </StateSection>
  );
}

// ── State 3: Empty — no messages ───────────────────────────────────────────────

function EmptyMessages() {
  return (
    <StateSection title="MESSAGES_LIST__EMPTY">
      <PhoneFrame>
        <View className="px-4 pt-4 pb-3">
          <Text className="text-xl font-bold" style={{ color: C.text }}>Сообщения</Text>
        </View>
        <View className="items-center py-16 px-6">
          <Text style={{ fontSize: 48 }}>{'💬'}</Text>
          <Text className="text-base font-semibold mt-4 text-center" style={{ color: C.text }}>
            У вас пока нет сообщений
          </Text>
          <Text className="text-sm text-center mt-2" style={{ color: C.muted, maxWidth: 260 }}>
            Напишите продавцу о заинтересовавшем объявлении
          </Text>
        </View>
      </PhoneFrame>
    </StateSection>
  );
}

// ── Main Export ────────────────────────────────────────────────────────────────

export default function MessagesListStates() {
  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 24 }} showsVerticalScrollIndicator={false}>
      <DefaultWithMessages />
      <SearchMessages />
      <EmptyMessages />
    </ScrollView>
  );
}
