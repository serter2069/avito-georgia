import React from 'react';
import { View, Text, TextInput, ScrollView, useWindowDimensions } from 'react-native';
import { StateSection } from '../StateSection';

const C = { green:'#00AA6C', greenBg:'#E8F9F2', white:'#FFFFFF', page:'#F5F5F5', text:'#1A1A1A', muted:'#737373', border:'#E0E0E0', error:'#D32F2F' };

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

function ChatHeader({ online = true }: { online?: boolean }) {
  return (
    <View className="flex-row items-center bg-white px-3 py-3 border-b border-[#E0E0E0]" style={{ gap: 10 }}>
      <Text className="text-base font-medium" style={{ color: C.text }}>{'\u2190 \u041D\u0430\u0437\u0430\u0434'}</Text>
      <View className="w-9 h-9 rounded-full items-center justify-center" style={{ backgroundColor: C.muted }}>
        <Text className="text-white font-bold text-sm">{'\u041C'}</Text>
      </View>
      <View className="flex-1">
        <Text className="text-[15px] font-semibold" style={{ color: C.text }}>{'\u041C\u0438\u0445\u0430\u0438\u043B'}</Text>
        {online && (
          <View className="flex-row items-center" style={{ gap: 4 }}>
            <View className="w-2 h-2 rounded-full bg-[#00AA6C]" />
            <Text className="text-xs" style={{ color: C.green }}>{'\u043E\u043D\u043B\u0430\u0439\u043D'}</Text>
          </View>
        )}
      </View>
    </View>
  );
}

function ListingMiniBar() {
  return (
    <View className="flex-row items-center bg-[#F5F5F5] mx-3 mt-2 px-3 py-2 rounded-md" style={{ gap: 8 }}>
      <View className="rounded" style={{ width: 40, height: 40, backgroundColor: C.border }} />
      <Text className="text-xs" style={{ color: C.muted }}>Toyota Camry 2019 {'\u00B7'} {'\u20BE'}12 500</Text>
    </View>
  );
}

function BubbleMine({ text, time }: { text: string; time: string }) {
  return (
    <View className="items-end px-3 mb-2">
      <View className="px-3 py-2" style={{ backgroundColor: C.greenBg, borderRadius: 12, maxWidth: '75%' }}>
        <Text className="text-sm" style={{ color: C.text }}>{text}</Text>
      </View>
      <Text className="text-[10px] mt-0.5" style={{ color: C.muted }}>{time}</Text>
    </View>
  );
}

function BubbleTheirs({ text, time }: { text: string; time: string }) {
  return (
    <View className="items-start px-3 mb-2">
      <View className="px-3 py-2 border" style={{ backgroundColor: C.white, borderColor: C.border, borderRadius: 12, maxWidth: '75%' }}>
        <Text className="text-sm" style={{ color: C.text }}>{text}</Text>
      </View>
      <Text className="text-[10px] mt-0.5" style={{ color: C.muted }}>{time}</Text>
    </View>
  );
}

function InputBar({ disabled = false }: { disabled?: boolean }) {
  return (
    <View className="flex-row items-center px-3 py-2 border-t border-[#E0E0E0]" style={{ gap: 8 }}>
      <View className="flex-1 bg-[#F5F5F5] rounded-full px-4 py-2">
        <TextInput
          placeholder={'\u041D\u0430\u043F\u0438\u0441\u0430\u0442\u044C...'}
          placeholderTextColor={C.muted}
          editable={!disabled}
          style={{ color: C.text, fontSize: 14, outlineWidth: 0 }}
        />
      </View>
      <Text className="text-base font-bold" style={{ color: C.green }}>{'\u2192'}</Text>
    </View>
  );
}

// -- State 1: Default --

function DefaultState() {
  return (
    <StateSection title="CHAT_THREAD__DEFAULT">
      <PhoneFrame>
        <ChatHeader />
        <ListingMiniBar />
        <View style={{ minHeight: 280, justifyContent: 'flex-end', paddingTop: 16, paddingBottom: 4 }}>
          <BubbleMine text={'\u0417\u0434\u0440\u0430\u0432\u0441\u0442\u0432\u0443\u0439\u0442\u0435, \u0435\u0449\u0451 \u043F\u0440\u043E\u0434\u0430\u0451\u0442\u0435?'} time="14:32" />
          <BubbleTheirs text={'\u0414\u0430, \u043F\u0440\u0438\u0445\u043E\u0434\u0438\u0442\u0435 \u0437\u0430\u0432\u0442\u0440\u0430 \u043F\u043E\u0441\u043C\u043E\u0442\u0440\u0435\u0442\u044C'} time="14:35" />
        </View>
        <InputBar />
      </PhoneFrame>
    </StateSection>
  );
}

// -- State 2: Typing --

function TypingState() {
  return (
    <StateSection title="CHAT_THREAD__TYPING">
      <PhoneFrame>
        <ChatHeader />
        <ListingMiniBar />
        <View style={{ minHeight: 280, justifyContent: 'flex-end', paddingTop: 16, paddingBottom: 4 }}>
          <BubbleMine text={'\u0417\u0434\u0440\u0430\u0432\u0441\u0442\u0432\u0443\u0439\u0442\u0435, \u0435\u0449\u0451 \u043F\u0440\u043E\u0434\u0430\u0451\u0442\u0435?'} time="14:32" />
          <BubbleTheirs text={'\u0414\u0430, \u043F\u0440\u0438\u0445\u043E\u0434\u0438\u0442\u0435 \u0437\u0430\u0432\u0442\u0440\u0430 \u043F\u043E\u0441\u043C\u043E\u0442\u0440\u0435\u0442\u044C'} time="14:35" />
          <View className="items-start px-3 mb-2">
            <View className="px-4 py-2 border" style={{ backgroundColor: C.white, borderColor: C.border, borderRadius: 12 }}>
              <Text className="text-lg font-bold" style={{ color: C.muted, letterSpacing: 2 }}>...</Text>
            </View>
          </View>
        </View>
        <InputBar />
      </PhoneFrame>
    </StateSection>
  );
}

// -- State 3: Blocked --

function BlockedState() {
  return (
    <StateSection title="CHAT_THREAD__BLOCKED">
      <PhoneFrame>
        <ChatHeader online={false} />
        <ListingMiniBar />
        <View style={{ minHeight: 280, justifyContent: 'flex-end', paddingTop: 16, paddingBottom: 4, opacity: 0.5 }}>
          <BubbleMine text={'\u0417\u0434\u0440\u0430\u0432\u0441\u0442\u0432\u0443\u0439\u0442\u0435, \u0435\u0449\u0451 \u043F\u0440\u043E\u0434\u0430\u0451\u0442\u0435?'} time="14:32" />
          <BubbleTheirs text={'\u0414\u0430, \u043F\u0440\u0438\u0445\u043E\u0434\u0438\u0442\u0435 \u0437\u0430\u0432\u0442\u0440\u0430 \u043F\u043E\u0441\u043C\u043E\u0442\u0440\u0435\u0442\u044C'} time="14:35" />
        </View>
        <View className="px-4 py-3 border-t border-[#E0E0E0] items-center" style={{ backgroundColor: C.page }}>
          <Text className="text-sm text-center" style={{ color: C.muted }}>{'\u0412\u044B \u0437\u0430\u0431\u043B\u043E\u043A\u0438\u0440\u043E\u0432\u0430\u043D\u044B'}</Text>
        </View>
      </PhoneFrame>
    </StateSection>
  );
}

// -- Main Export --

export default function ChatThreadStates() {
  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 24 }} showsVerticalScrollIndicator={false}>
      <DefaultState />
      <TypingState />
      <BlockedState />
    </ScrollView>
  );
}
