import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import BottomNav from '../BottomNav';

const C = {
  green: '#00AA6C',
  greenBg: '#E8F9F2',
  white: '#FFFFFF',
  text: '#1A1A1A',
  muted: '#9E9E9E',
  border: '#E8E8E8',
  page: '#F5F5F5',
  error: '#D32F2F',
};

const AVATAR_COLORS = ['#5C6BC0', '#E65100', '#2E7D32', '#7B1FA2', '#C62828', '#00838F'];

interface Conversation {
  id: string;
  initials: string;
  colorIdx: number;
  name: string;
  lastMessage: string;
  time: string;
  unread?: number;
}

function AvatarCircle({ initials, colorIdx, size = 46 }: { initials: string; colorIdx: number; size?: number }) {
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: AVATAR_COLORS[colorIdx % AVATAR_COLORS.length],
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      <Text style={{ color: C.white, fontWeight: '700', fontSize: size * 0.28 }}>{initials}</Text>
    </View>
  );
}

function ConversationRow({ conv, isLast, isSelected, onPress }: { conv: Conversation; isLast: boolean; isSelected?: boolean; onPress?: () => void }) {
  return (
    <View style={{ backgroundColor: isSelected ? C.greenBg : C.white }}>
      <Pressable
        onPress={onPress}
        style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, gap: 12 }}
      >
        <AvatarCircle initials={conv.initials} colorIdx={conv.colorIdx} />
        <View style={{ flex: 1, gap: 3 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Text style={{ fontSize: 15, fontWeight: conv.unread ? '700' : '600', color: C.text, flex: 1, marginRight: 8 }} numberOfLines={1}>
              {conv.name}
            </Text>
            <Text style={{ fontSize: 12, color: conv.unread ? C.green : C.muted, flexShrink: 0 }}>
              {conv.time}
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Text
              style={{ fontSize: 13, color: conv.unread ? C.text : C.muted, flex: 1 }}
              numberOfLines={1}
            >
              {conv.lastMessage}
            </Text>
            {conv.unread ? (
              <View style={{
                minWidth: 20,
                height: 20,
                borderRadius: 10,
                backgroundColor: C.green,
                alignItems: 'center',
                justifyContent: 'center',
                paddingHorizontal: 5,
                flexShrink: 0,
              }}>
                <Text style={{ color: C.white, fontSize: 11, fontWeight: '700' }}>{conv.unread}</Text>
              </View>
            ) : null}
          </View>
        </View>
      </Pressable>
      {!isLast && <View style={{ height: 1, backgroundColor: C.border, marginLeft: 74 }} />}
    </View>
  );
}

function SearchBar({ value, onChangeText }: { value: string; onChangeText: (t: string) => void }) {
  return (
    <View style={{
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: C.white,
      borderRadius: 10,
      paddingHorizontal: 12,
      marginHorizontal: 16,
      marginBottom: 8,
    }}>
      <View style={{ width: 16, height: 16, borderRadius: 8, borderWidth: 2, borderColor: C.muted, marginRight: 8 }} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder="Поиск по чатам"
        placeholderTextColor={C.muted}
        style={{ flex: 1, fontSize: 15, color: C.text, paddingVertical: 10, borderWidth: 0, backgroundColor: 'transparent', outlineWidth: 0 } as any}
      />
      {value.length > 0 && (
        <Pressable onPress={() => onChangeText('')} style={{ padding: 4 }}>
          <Text style={{ fontSize: 16, color: C.muted, lineHeight: 18 }}>×</Text>
        </Pressable>
      )}
    </View>
  );
}

function EmptySearch() {
  return (
    <View style={{ alignItems: 'center', paddingVertical: 40 }}>
      <Text style={{ fontSize: 15, fontWeight: '600', color: C.text }}>Ничего не найдено</Text>
      <Text style={{ fontSize: 13, color: C.muted, marginTop: 4 }}>Попробуйте другой запрос</Text>
    </View>
  );
}

function EmptyThreads() {
  return (
    <View style={{ alignItems: 'center', paddingVertical: 60 }}>
      <Text style={{ fontSize: 15, fontWeight: '600', color: C.text }}>Нет сообщений</Text>
      <Text style={{ fontSize: 13, color: C.muted, marginTop: 4 }}>Начните общение с продавцом</Text>
    </View>
  );
}

// -- Helper: map real thread to Conversation --
// API shape: { id, listing?, otherUser?, lastMessage?, updatedAt, unreadCount }

function formatTime(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return `${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`;
  if (diffDays === 1) return 'вчера';
  if (diffDays < 7) {
    const days = ['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб'];
    return days[d.getDay()];
  }
  return `${d.getDate()}.${String(d.getMonth() + 1).padStart(2, '0')}`;
}

function threadToConversation(thread: any, idx: number): Conversation {
  const other = thread.otherUser;
  const name = other?.name ?? thread.listing?.title ?? 'Пользователь';
  const initials = name
    .split(' ')
    .slice(0, 2)
    .map((w: string) => w[0] ?? '')
    .join('')
    .toUpperCase() || '?';
  const lastMsg = thread.lastMessage;
  const listingTitle = thread.listing?.title ?? '';
  return {
    id: thread.id,
    initials,
    colorIdx: idx % AVATAR_COLORS.length,
    name,
    lastMessage: lastMsg?.text ?? (listingTitle ? `По объявлению: ${listingTitle}` : ''),
    time: thread.updatedAt ? formatTime(thread.updatedAt) : '',
    unread: thread.unreadCount > 0 ? thread.unreadCount : undefined,
  };
}

// -- State 1: Messages list (interactive) --

export function MessagesDefault({ showHeader = true, showBottomNav = true, threads }: { showHeader?: boolean; showBottomNav?: boolean; threads?: any[] }) {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 640;
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const router = useRouter();

  const conversations: Conversation[] = (threads ?? []).map((t, i) => threadToConversation(t, i));

  const filtered = conversations.filter(c =>
    c.name.toLowerCase().includes(query.toLowerCase()) ||
    c.lastMessage.toLowerCase().includes(query.toLowerCase())
  );

  const selectedConv = conversations.find(c => c.id === selectedId);

  const listContent = () => {
    if (conversations.length === 0) return <EmptyThreads />;
    if (filtered.length === 0) return <EmptySearch />;
    return filtered.map((conv, idx) => (
      <ConversationRow
        key={conv.id}
        conv={conv}
        isLast={idx === filtered.length - 1}
        isSelected={isDesktop && selectedId === conv.id}
        onPress={() => {
          router.push(`/dashboard/messages/${conv.id}` as any);
          if (isDesktop) setSelectedId(conv.id);
        }}
      />
    ));
  };

  const listPanel = (
    <View style={{ flex: isDesktop ? undefined : 1, width: isDesktop ? 320 : undefined, backgroundColor: C.white, borderRightWidth: isDesktop ? 1 : 0, borderRightColor: C.border }}>
      {/* Header */}
      <View style={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 10 }}>
        <Text style={{ fontSize: 20, fontWeight: '700', color: C.text }}>Сообщения</Text>
      </View>
      {/* Search */}
      <SearchBar value={query} onChangeText={setQuery} />
      {/* List */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {listContent()}
      </ScrollView>
    </View>
  );

  const chatPlaceholder = (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: C.white }}>
      {selectedConv ? (
        <View style={{ alignItems: 'center', gap: 8 }}>
          <AvatarCircle initials={selectedConv.initials} colorIdx={selectedConv.colorIdx} size={56} />
          <Text style={{ fontSize: 16, fontWeight: '600', color: C.text }}>{selectedConv.name}</Text>
          <Text style={{ fontSize: 13, color: C.muted }}>Откройте чат</Text>
        </View>
      ) : (
        <View style={{ alignItems: 'center', gap: 8 }}>
          <View style={{ width: 56, height: 56, borderRadius: 28, borderWidth: 2, borderColor: C.border, alignItems: 'center', justifyContent: 'center' }}>
            <View style={{ flexDirection: 'row', gap: 3 }}>
              {[0, 1, 2].map(i => (
                <View key={i} style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: C.muted }} />
              ))}
            </View>
          </View>
          <Text style={{ fontSize: 15, fontWeight: '600', color: C.text }}>Выберите чат</Text>
          <Text style={{ fontSize: 13, color: C.muted }}>Нажмите на диалог слева</Text>
        </View>
      )}
    </View>
  );

  if (isDesktop) {
    return (
      <View style={{ flex: 1, backgroundColor: C.white, borderRadius: 12, overflow: 'hidden', flexDirection: 'row', height: 520 }}>
        {listPanel}
        {chatPlaceholder}
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: C.white, borderRadius: 12, overflow: 'hidden' }}>
      <View style={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 10 }}>
        <Text style={{ fontSize: 20, fontWeight: '700', color: C.text }}>Сообщения</Text>
      </View>
      <SearchBar value={query} onChangeText={setQuery} />
      {listContent()}
      {showBottomNav && <BottomNav active="messages" />}
    </View>
  );
}

// -- Main Export --

export default MessagesDefault;
