import React from 'react';
import { View, Text, TextInput, Pressable, ScrollView, useWindowDimensions } from 'react-native';
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

function Avatar({ initials, size = 72 }: { initials: string; size?: number }) {
  return (
    <View
      className="items-center justify-center"
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: C.green,
      }}
    >
      <Text className="text-white font-bold" style={{ fontSize: size * 0.3 }}>{initials}</Text>
    </View>
  );
}

function MenuRow({ label, isLast, isRed }: { label: string; isLast?: boolean; isRed?: boolean }) {
  return (
    <View>
      <Pressable className="flex-row items-center justify-between py-3.5 px-4">
        <Text
          className="flex-1 text-[15px] font-medium"
          style={{ color: isRed ? C.error : C.text }}
        >
          {label}
        </Text>
        {!isRed && <Text style={{ fontSize: 16, color: C.muted }}>{'\u203A'}</Text>}
      </Pressable>
      {!isLast && <View className="h-px ml-4" style={{ backgroundColor: C.border }} />}
    </View>
  );
}

// -- State 1: Default --

function DefaultState() {
  return (
    <StateSection title="PROFILE__DEFAULT">
      <PhoneFrame>
        <View style={{ backgroundColor: C.white }}>
          {/* Top section */}
          <View className="bg-white p-5 items-center" style={{ gap: 8 }}>
            <Avatar initials={'\u0413\u041A'} />
            <Text className="text-lg font-bold" style={{ color: C.text }}>{'\u0413\u0435\u043E\u0440\u0433\u0438\u0439 \u041A\u0430\u043B\u0430\u043D\u0434\u0430\u0434\u0437\u0435'}</Text>
            <Text className="text-sm" style={{ color: C.muted }}>g.kalandadze@gmail.com</Text>
            <Pressable className="rounded-md px-5 py-2 mt-1 border" style={{ borderColor: C.green }}>
              <Text className="text-sm font-semibold" style={{ color: C.green }}>{'\u0420\u0435\u0434\u0430\u043A\u0442\u0438\u0440\u043E\u0432\u0430\u0442\u044C'}</Text>
            </Pressable>
          </View>

          {/* Stats row */}
          <View className="flex-row bg-white mt-px">
            {[
              { value: '10', label: '\u043E\u0431\u044A\u044F\u0432\u043B\u0435\u043D\u0438\u0439' },
              { value: '7', label: '\u043E\u0442\u0437\u044B\u0432\u043E\u0432' },
              { value: '\u0421 2024', label: '' },
            ].map((s, i) => (
              <View key={i} className="flex-1 items-center py-3" style={{ borderRightWidth: i < 2 ? 1 : 0, borderRightColor: C.border }}>
                <Text className="text-base font-bold" style={{ color: C.text }}>{s.value}</Text>
                {s.label ? <Text className="text-xs" style={{ color: C.muted }}>{s.label}</Text> : null}
              </View>
            ))}
          </View>

          {/* Menu list */}
          <View className="bg-white mt-2">
            <MenuRow label={'\u041C\u043E\u0438 \u043E\u0431\u044A\u044F\u0432\u043B\u0435\u043D\u0438\u044F'} />
            <MenuRow label={'\u0418\u0437\u0431\u0440\u0430\u043D\u043D\u043E\u0435'} />
            <MenuRow label={'\u0418\u0441\u0442\u043E\u0440\u0438\u044F \u043F\u043B\u0430\u0442\u0435\u0436\u0435\u0439'} />
            <MenuRow label={'\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438'} />
            <MenuRow label={'\u041F\u043E\u043C\u043E\u0449\u044C'} />
            <MenuRow label={'\u0412\u044B\u0439\u0442\u0438'} isLast isRed />
          </View>
        </View>
      </PhoneFrame>
    </StateSection>
  );
}

// -- State 2: Edit mode --

function EditModeState() {
  return (
    <StateSection title="PROFILE__EDIT">
      <PhoneFrame>
        <View style={{ backgroundColor: C.white }}>
          <View className="bg-white p-5" style={{ gap: 16 }}>
            <Text className="text-lg font-bold" style={{ color: C.text }}>{'\u0420\u0435\u0434\u0430\u043A\u0442\u0438\u0440\u043E\u0432\u0430\u0442\u044C \u043F\u0440\u043E\u0444\u0438\u043B\u044C'}</Text>

            <View>
              <Text className="text-sm font-medium mb-1.5" style={{ color: C.text }}>{'\u0418\u043C\u044F'}</Text>
              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: C.border,
                  borderRadius: 6,
                  paddingHorizontal: 12,
                  color: C.text,
                  fontSize: 16,
                  paddingVertical: 10,
                }}
                value={'\u0413\u0435\u043E\u0440\u0433\u0438\u0439'}
                
              />
            </View>

            <View>
              <Text className="text-sm font-medium mb-1.5" style={{ color: C.text }}>{'\u0422\u0435\u043B\u0435\u0444\u043E\u043D'}</Text>
              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: C.border,
                  borderRadius: 6,
                  paddingHorizontal: 12,
                  color: C.text,
                  fontSize: 16,
                  paddingVertical: 10,
                }}
                placeholder="+995 5XX XXX XXX"
                placeholderTextColor={C.muted}
                
              />
            </View>

            <View>
              <Text className="text-sm font-medium mb-1.5" style={{ color: C.text }}>{'\u0413\u043E\u0440\u043E\u0434'}</Text>
              <Pressable className="border rounded-md px-3 py-2.5 flex-row items-center justify-between" style={{ borderColor: C.border }}>
                <Text className="text-base" style={{ color: C.muted }}>{'\u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u0433\u043E\u0440\u043E\u0434'}</Text>
                <Text style={{ color: C.muted, fontSize: 14 }}>{'\u25BC'}</Text>
              </Pressable>
            </View>

            <View className="flex-row" style={{ gap: 12, marginTop: 8 }}>
              <Pressable className="flex-1 rounded-md py-3 items-center" style={{ backgroundColor: C.green }}>
                <Text className="text-white font-bold text-[15px]">{'\u0421\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C'}</Text>
              </Pressable>
              <Pressable className="flex-1 rounded-md py-3 items-center border" style={{ borderColor: C.border }}>
                <Text className="font-semibold text-[15px]" style={{ color: C.muted }}>{'\u041E\u0442\u043C\u0435\u043D\u0430'}</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </PhoneFrame>
    </StateSection>
  );
}

// -- Main Export --

export default function ProfileStates() {
  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 24 }} showsVerticalScrollIndicator={false}>
      <DefaultState />
      <EditModeState />
    </ScrollView>
  );
}
