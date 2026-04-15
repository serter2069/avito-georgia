import React from 'react';
import { View, Text, ScrollView, Pressable, useWindowDimensions } from 'react-native';
import { StateSection } from '../StateSection';

const C = { green:'#00AA6C', greenBg:'#E8F9F2', white:'#FFFFFF', page:'#F5F5F5', text:'#1A1A1A', muted:'#737373', border:'#E0E0E0', error:'#D32F2F' };

const AVATAR_COLORS = ['#737373', '#1565C0', '#E65100', '#7B1FA2', '#C62828'];

function PhoneFrame({ children }: { children: React.ReactNode }) {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 640;
  return (
    <View
      className="bg-white rounded-xl border border-[#E0E0E0] overflow-hidden"
      style={isDesktop ? { width: 390, alignSelf: 'center' } : { width: '100%' }}
    >
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
  { letter: '\u041C', colorIdx: 0, name: '\u041C\u0438\u0445\u0430\u0438\u043B', listing: 'Toyota Camry 2019', lastMessage: '\u0414\u0430, \u043F\u0440\u0438\u0445\u043E\u0434\u0438\u0442\u0435 \u0437\u0430\u0432\u0442\u0440\u0430 \u043F\u043E\u0441\u043C\u043E\u0442\u0440\u0435\u0442\u044C', time: '14:35', unread: 2 },
  { letter: '\u0410', colorIdx: 1, name: '\u0410\u043D\u043D\u0430', listing: '\u041A\u0432\u0430\u0440\u0442\u0438\u0440\u0430 3-\u043A\u043E\u043C\u043D, \u0411\u0430\u0442\u0443\u043C\u0438', lastMessage: '\u041C\u043E\u0436\u043D\u043E \u043F\u043E\u0441\u043C\u043E\u0442\u0440\u0435\u0442\u044C \u0432 \u0441\u0443\u0431\u0431\u043E\u0442\u0443?', time: '12:10', unread: 1 },
  { letter: '\u0414', colorIdx: 2, name: '\u0414\u0430\u0432\u0438\u0434', listing: 'iPhone 14 Pro', lastMessage: '\u0421\u043A\u0438\u043D\u0443 \u0444\u043E\u0442\u043E \u0432\u0435\u0447\u0435\u0440\u043E\u043C', time: '\u0412\u0447\u0435\u0440\u0430' },
  { letter: '\u041D', colorIdx: 3, name: '\u041D\u0438\u043D\u043E', listing: '\u0414\u0438\u0432\u0430\u043D \u0443\u0433\u043B\u043E\u0432\u043E\u0439', lastMessage: '\u0412\u044B: \u0421\u043F\u0430\u0441\u0438\u0431\u043E, \u043F\u043E\u0434\u0443\u043C\u0430\u044E', time: '\u0412\u0447\u0435\u0440\u0430' },
  { letter: '\u0413', colorIdx: 4, name: '\u0413\u0435\u043E\u0440\u0433\u0438\u0439', listing: '\u0412\u0435\u043B\u043E\u0441\u0438\u043F\u0435\u0434 \u0433\u043E\u0440\u043D\u044B\u0439', lastMessage: '\u0412\u044B: \u041A\u0430\u043A\u043E\u0439 \u0440\u0430\u0437\u043C\u0435\u0440 \u0440\u0430\u043C\u044B?', time: '\u041F\u043D' },
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
        {row.unread ? (
          <View className="w-5 h-5 rounded-full bg-[#00AA6C] items-center justify-center">
            <Text className="text-white text-[10px] font-bold">{row.unread}</Text>
          </View>
        ) : null}
      </Pressable>
      {!isLast && <View className="h-px bg-[#E0E0E0] ml-[68px]" />}
    </View>
  );
}

// -- State 1: Default --

function DefaultState() {
  return (
    <StateSection title="MESSAGES_LIST__DEFAULT">
      <PhoneFrame>
        <View className="px-4 pt-4 pb-3">
          <Text className="text-xl font-bold" style={{ color: C.text }}>{'\u0421\u043E\u043E\u0431\u0449\u0435\u043D\u0438\u044F'}</Text>
        </View>
        {CONVERSATIONS.map((row, idx) => (
          <ConversationItem key={row.name} row={row} isLast={idx === CONVERSATIONS.length - 1} />
        ))}
      </PhoneFrame>
    </StateSection>
  );
}

// -- State 2: Empty --

function EmptyState() {
  return (
    <StateSection title="MESSAGES_LIST__EMPTY">
      <PhoneFrame>
        <View className="px-4 pt-4 pb-3">
          <Text className="text-xl font-bold" style={{ color: C.text }}>{'\u0421\u043E\u043E\u0431\u0449\u0435\u043D\u0438\u044F'}</Text>
        </View>
        <View className="items-center py-16 px-6">
          <Text className="text-base font-semibold text-center" style={{ color: C.text }}>
            {'\u041D\u0435\u0442 \u0441\u043E\u043E\u0431\u0449\u0435\u043D\u0438\u0439'}
          </Text>
          <Text className="text-sm text-center mt-2" style={{ color: C.muted, maxWidth: 260 }}>
            {'\u041D\u0430\u043F\u0438\u0448\u0438\u0442\u0435 \u043F\u0440\u043E\u0434\u0430\u0432\u0446\u0443 \u043E \u0437\u0430\u0438\u043D\u0442\u0435\u0440\u0435\u0441\u043E\u0432\u0430\u0432\u0448\u0435\u043C \u043E\u0431\u044A\u044F\u0432\u043B\u0435\u043D\u0438\u0438'}
          </Text>
        </View>
      </PhoneFrame>
    </StateSection>
  );
}

// -- Main Export --

export default function MessagesListStates() {
  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 24 }} showsVerticalScrollIndicator={false}>
      <DefaultState />
      <EmptyState />
    </ScrollView>
  );
}
