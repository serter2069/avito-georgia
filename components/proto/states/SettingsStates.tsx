import React from 'react';
import { View, Text, Pressable, ScrollView, useWindowDimensions } from 'react-native';
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

function SectionHeader({ text }: { text: string }) {
  return (
    <Text className="text-xs font-semibold uppercase tracking-wider mb-2 mt-4 px-4" style={{ color: C.muted }}>
      {text}
    </Text>
  );
}

function RadioRow({ label, selected, isLast }: { label: string; selected?: boolean; isLast?: boolean }) {
  return (
    <View>
      <Pressable className="flex-row items-center justify-between py-3.5 px-4">
        <Text className="text-[15px]" style={{ color: C.text }}>{label}</Text>
        <View
          className="w-5 h-5 rounded-full border-2 items-center justify-center"
          style={{ borderColor: selected ? C.green : C.border }}
        >
          {selected && <View className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: C.green }} />}
        </View>
      </Pressable>
      {!isLast && <View className="h-px ml-4" style={{ backgroundColor: C.border }} />}
    </View>
  );
}

function ToggleRow({ label, on, isLast }: { label: string; on?: boolean; isLast?: boolean }) {
  return (
    <View>
      <View className="flex-row items-center justify-between py-3.5 px-4">
        <Text className="text-[15px]" style={{ color: C.text }}>{label}</Text>
        <View
          className="justify-center"
          style={{ width: 44, height: 26, borderRadius: 13, backgroundColor: on ? C.green : '#D1D5DB', paddingHorizontal: 2 }}
        >
          <View
            className="bg-white"
            style={{
              width: 22,
              height: 22,
              borderRadius: 11,
              alignSelf: on ? 'flex-end' : 'flex-start',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.15,
              shadowRadius: 2,
              elevation: 2,
            }}
          />
        </View>
      </View>
      {!isLast && <View className="h-px ml-4" style={{ backgroundColor: C.border }} />}
    </View>
  );
}

function NavRow({ label, isLast, isRed }: { label: string; isLast?: boolean; isRed?: boolean }) {
  return (
    <View>
      <Pressable className="flex-row items-center justify-between py-3.5 px-4">
        <Text className="text-[15px] font-medium" style={{ color: isRed ? C.error : C.text }}>{label}</Text>
        {!isRed && <Text style={{ fontSize: 16, color: C.muted }}>{'\u203A'}</Text>}
      </Pressable>
      {!isLast && <View className="h-px ml-4" style={{ backgroundColor: C.border }} />}
    </View>
  );
}

// -- State 1: Default --

function DefaultState() {
  return (
    <StateSection title="SETTINGS__DEFAULT">
      <PhoneFrame>
        <View style={{ backgroundColor: C.page }}>
          {/* Header */}
          <View className="bg-white px-4 py-4 mb-2">
            <Text className="text-xl font-bold" style={{ color: C.text }}>{'\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438'}</Text>
          </View>

          {/* Language */}
          <SectionHeader text={'\u042F\u0437\u044B\u043A \u0438\u043D\u0442\u0435\u0440\u0444\u0435\u0439\u0441\u0430'} />
          <View className="bg-white">
            <RadioRow label={'\u0420\u0443\u0441\u0441\u043A\u0438\u0439'} selected />
            <RadioRow label={'Georgian / \u10E5\u10D0\u10E0\u10D7\u10E3\u10DA\u10D8'} />
            <RadioRow label="English" isLast />
          </View>

          {/* Notifications */}
          <SectionHeader text={'\u0423\u0432\u0435\u0434\u043E\u043C\u043B\u0435\u043D\u0438\u044F'} />
          <View className="bg-white">
            <ToggleRow label={'\u041D\u043E\u0432\u044B\u0435 \u0441\u043E\u043E\u0431\u0449\u0435\u043D\u0438\u044F'} on />
            <ToggleRow label={'\u0421\u0442\u0430\u0442\u0443\u0441 \u043E\u0431\u044A\u044F\u0432\u043B\u0435\u043D\u0438\u0439'} on />
            <ToggleRow label={'\u0410\u043A\u0446\u0438\u0438'} isLast />
          </View>
          <Text className="text-xs mt-1 px-4" style={{ color: C.muted }}>{'\u0423\u0432\u0435\u0434\u043E\u043C\u043B\u0435\u043D\u0438\u044F \u043E\u0442\u043F\u0440\u0430\u0432\u043B\u044F\u044E\u0442\u0441\u044F \u043D\u0430 email'}</Text>

          {/* Account */}
          <SectionHeader text={'\u0410\u043A\u043A\u0430\u0443\u043D\u0442'} />
          <View className="bg-white">
            <NavRow label={'\u0418\u0437\u043C\u0435\u043D\u0438\u0442\u044C email'} />
            <NavRow label={'\u0423\u0434\u0430\u043B\u0438\u0442\u044C \u0430\u043A\u043A\u0430\u0443\u043D\u0442'} isLast isRed />
          </View>

          <View className="h-6" />
        </View>
      </PhoneFrame>
    </StateSection>
  );
}

// -- State 2: Delete confirm --

function DeleteConfirmState() {
  return (
    <StateSection title="SETTINGS__DELETE_CONFIRM">
      <PhoneFrame>
        <View style={{ backgroundColor: 'rgba(0,0,0,0.4)', padding: 24, minHeight: 300, justifyContent: 'center' }}>
          <View
            className="bg-white rounded-xl p-6 items-center"
            style={{ gap: 12 }}
          >
            <Text className="text-lg font-bold text-center" style={{ color: C.text }}>
              {'\u0423\u0434\u0430\u043B\u0438\u0442\u044C \u0430\u043A\u043A\u0430\u0443\u043D\u0442?'}
            </Text>
            <Text className="text-sm text-center leading-5" style={{ color: C.muted, maxWidth: 260 }}>
              {'\u0412\u0441\u0435 \u0434\u0430\u043D\u043D\u044B\u0435 \u0438 \u043E\u0431\u044A\u044F\u0432\u043B\u0435\u043D\u0438\u044F \u0431\u0443\u0434\u0443\u0442 \u0443\u0434\u0430\u043B\u0435\u043D\u044B.'}
            </Text>
            <View className="flex-row w-full mt-2" style={{ gap: 12 }}>
              <Pressable className="flex-1 rounded-md py-3 items-center border" style={{ borderColor: C.border }}>
                <Text className="font-semibold text-[15px]" style={{ color: C.text }}>{'\u041E\u0442\u043C\u0435\u043D\u0430'}</Text>
              </Pressable>
              <Pressable className="flex-1 rounded-md py-3 items-center" style={{ backgroundColor: C.error }}>
                <Text className="text-white font-bold text-[15px]">{'\u0423\u0434\u0430\u043B\u0438\u0442\u044C'}</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </PhoneFrame>
    </StateSection>
  );
}

// -- Main Export --

export default function SettingsStates() {
  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 24 }} showsVerticalScrollIndicator={false}>
      <DefaultState />
      <DeleteConfirmState />
    </ScrollView>
  );
}
