import React from 'react';
import { View, Text, TextInput, ScrollView } from 'react-native';
import { StateSection } from '../StateSection';

const C = { green:'#00AA6C', greenBg:'#E8F9F2', white:'#FFFFFF', page:'#F5F5F5', text:'#1A1A1A', muted:'#737373', border:'#E0E0E0', error:'#D32F2F' };

function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <View className="bg-white rounded-xl border border-[#E0E0E0] overflow-hidden" style={{ width: 390, alignSelf: 'center' }}>
      {children}
    </View>
  );
}

function ChatHeader({ online = true }: { online?: boolean }) {
  return (
    <View className="flex-row items-center bg-white px-3 py-3 border-b border-[#E0E0E0]" style={{ gap: 10 }}>
      <Text className="text-lg" style={{ color: C.text }}>{'<-'}</Text>
      <View className="w-9 h-9 rounded-full bg-[#00AA6C] items-center justify-center">
        <Text className="text-white font-bold text-sm">M</Text>
      </View>
      <View className="flex-1">
        <Text className="text-[15px] font-semibold" style={{ color: C.text }}>Михаил</Text>
        {online && (
          <View className="flex-row items-center" style={{ gap: 4 }}>
            <View className="w-2 h-2 rounded-full bg-[#00AA6C]" />
            <Text className="text-xs" style={{ color: C.green }}>онлайн</Text>
          </View>
        )}
      </View>
    </View>
  );
}

function ListingMiniCard() {
  return (
    <View className="flex-row items-center bg-[#F5F5F5] mx-3 mt-2 px-3 py-2 rounded-md" style={{ gap: 8 }}>
      <View className="w-10 h-10 rounded bg-[#E0E0E0]" />
      <Text className="text-xs" style={{ color: C.muted }}>Toyota Camry 2019 · ₾12 500</Text>
    </View>
  );
}

function BubbleMine({ text, time }: { text: string; time: string }) {
  return (
    <View className="items-end px-3 mb-2">
      <View className="rounded-xl rounded-br-sm px-3 py-2" style={{ backgroundColor: C.greenBg, maxWidth: '75%' }}>
        <Text className="text-sm" style={{ color: C.text }}>{text}</Text>
      </View>
      <Text className="text-[10px] mt-0.5" style={{ color: C.muted }}>{time}</Text>
    </View>
  );
}

function BubbleTheirs({ text, time }: { text: string; time: string }) {
  return (
    <View className="items-start px-3 mb-2">
      <View className="rounded-xl rounded-bl-sm px-3 py-2 border" style={{ backgroundColor: C.white, borderColor: C.border, maxWidth: '75%' }}>
        <Text className="text-sm" style={{ color: C.text }}>{text}</Text>
      </View>
      <Text className="text-[10px] mt-0.5" style={{ color: C.muted }}>{time}</Text>
    </View>
  );
}

function InputBar({ disabled = false, placeholder = 'Написать сообщение...' }: { disabled?: boolean; placeholder?: string }) {
  return (
    <View className="flex-row items-center px-3 py-2 border-t border-[#E0E0E0]" style={{ gap: 8 }}>
      <View className="flex-1 bg-[#F5F5F5] rounded-full px-4 py-2">
        <TextInput
          className="text-sm"
          placeholder={placeholder}
          placeholderTextColor={C.muted}
          editable={!disabled}
          style={{ color: C.text }}
        />
      </View>
      <View className="w-9 h-9 rounded-full bg-[#00AA6C] items-center justify-center">
        <Text className="text-white font-bold text-sm">{'>'}</Text>
      </View>
    </View>
  );
}

// ── State 1: Default conversation ──────────────────────────────────────────────

function DefaultConversation() {
  return (
    <StateSection title="CHAT_THREAD__DEFAULT">
      <PhoneFrame>
        <ChatHeader />
        <ListingMiniCard />
        <View style={{ minHeight: 300, justifyContent: 'flex-end', paddingTop: 16, paddingBottom: 4 }}>
          <BubbleMine text="Здравствуйте, ещё продаёте?" time="14:32" />
          <BubbleTheirs text="Да, продаётся. Приходите смотреть завтра." time="14:35" />
        </View>
        <InputBar />
      </PhoneFrame>
    </StateSection>
  );
}

// ── State 2: Typing indicator ──────────────────────────────────────────────────

function TypingIndicator() {
  return (
    <StateSection title="CHAT_THREAD__TYPING">
      <PhoneFrame>
        <ChatHeader />
        <ListingMiniCard />
        <View style={{ minHeight: 300, justifyContent: 'flex-end', paddingTop: 16, paddingBottom: 4 }}>
          <BubbleMine text="Здравствуйте, ещё продаёте?" time="14:32" />
          <BubbleTheirs text="Да, продаётся. Приходите смотреть завтра." time="14:35" />
          {/* Typing dots */}
          <View className="items-start px-3 mb-2">
            <View className="rounded-xl rounded-bl-sm px-4 py-2 border" style={{ backgroundColor: C.white, borderColor: C.border }}>
              <Text className="text-lg font-bold" style={{ color: C.muted, letterSpacing: 2 }}>...</Text>
            </View>
          </View>
        </View>
        <InputBar />
      </PhoneFrame>
    </StateSection>
  );
}

// ── State 3: Blocked user ──────────────────────────────────────────────────────

function BlockedUser() {
  return (
    <StateSection title="CHAT_THREAD__BLOCKED">
      <PhoneFrame>
        <ChatHeader online={false} />
        <ListingMiniCard />
        <View style={{ minHeight: 300, justifyContent: 'flex-end', paddingTop: 16, paddingBottom: 4, opacity: 0.5 }}>
          <BubbleMine text="Здравствуйте, ещё продаёте?" time="14:32" />
          <BubbleTheirs text="Да, продаётся. Приходите смотреть завтра." time="14:35" />
        </View>
        <View className="px-4 py-3 border-t border-[#E0E0E0] items-center">
          <Text className="text-xs text-center" style={{ color: C.muted }}>
            Вы заблокированы и не можете отправлять сообщения
          </Text>
        </View>
      </PhoneFrame>
    </StateSection>
  );
}

// ── Main Export ────────────────────────────────────────────────────────────────

export default function ChatThreadStates() {
  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 24 }} showsVerticalScrollIndicator={false}>
      <DefaultConversation />
      <TypingIndicator />
      <BlockedUser />
    </ScrollView>
  );
}
