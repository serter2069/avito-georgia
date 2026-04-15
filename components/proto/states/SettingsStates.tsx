import React from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { StateSection } from '../StateSection';

const C = { green:'#00AA6C', greenBg:'#E8F9F2', white:'#FFFFFF', page:'#F5F5F5', text:'#1A1A1A', muted:'#737373', border:'#E0E0E0', error:'#D32F2F' };

// ─── Helpers ────────────────────────────────────────────────────────────────────

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
          className="w-[44px] h-[26px] rounded-full justify-center"
          style={{ backgroundColor: on ? C.green : '#D1D5DB', paddingHorizontal: 2 }}
        >
          <View
            className="w-[22px] h-[22px] rounded-full bg-white"
            style={{
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
        {!isRed && <Text style={{ fontSize: 16, color: C.muted }}>›</Text>}
      </Pressable>
      {!isLast && <View className="h-px ml-4" style={{ backgroundColor: C.border }} />}
    </View>
  );
}

// ─── State: Default ─────────────────────────────────────────────────────────────

function DefaultState() {
  return (
    <StateSection title="SETTINGS_DEFAULT">
      <View style={{ width: 390, backgroundColor: C.page }}>
        {/* Header */}
        <View className="bg-white px-4 py-4 mb-2">
          <Text className="text-xl font-bold" style={{ color: C.text }}>Настройки</Text>
        </View>

        {/* Language */}
        <SectionHeader text="Язык" />
        <View className="bg-white rounded-lg" style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 2 }}>
          <RadioRow label="Русский" selected />
          <RadioRow label="Грузинский" />
          <RadioRow label="English" isLast />
        </View>

        {/* Notifications */}
        <SectionHeader text="Уведомления" />
        <View className="bg-white rounded-lg" style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 2 }}>
          <ToggleRow label="Новые сообщения" on />
          <ToggleRow label="Ответы на объявления" on />
          <ToggleRow label="Акции и новости" isLast />
        </View>

        {/* Security */}
        <SectionHeader text="Безопасность" />
        <View className="bg-white rounded-lg" style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 2 }}>
          <NavRow label="Изменить email" />
          <NavRow label="Сессии" isLast />
        </View>

        {/* Account */}
        <SectionHeader text="Аккаунт" />
        <View className="bg-white rounded-lg" style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 2 }}>
          <NavRow label="Удалить аккаунт" isLast isRed />
        </View>

        <View className="h-6" />
      </View>
    </StateSection>
  );
}

// ─── State: Delete Account Confirmation ─────────────────────────────────────────

function DeleteConfirmationState() {
  return (
    <StateSection title="SETTINGS_DELETE_CONFIRMATION">
      <View style={{ width: 390, backgroundColor: C.page }}>
        {/* Dimmed background simulation */}
        <View style={{ backgroundColor: 'rgba(0,0,0,0.4)', padding: 24, minHeight: 300, justifyContent: 'center' }}>
          <View
            className="bg-white rounded-xl p-6 items-center"
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.15,
              shadowRadius: 24,
              elevation: 8,
              gap: 12,
            }}
          >
            <Text style={{ fontSize: 40 }}>⚠️</Text>
            <Text className="text-lg font-bold text-center" style={{ color: C.text }}>
              Удалить аккаунт?
            </Text>
            <Text className="text-sm text-center leading-5" style={{ color: C.muted, maxWidth: 260 }}>
              Все ваши данные и объявления будут удалены безвозвратно.
            </Text>
            <View className="flex-row w-full mt-2" style={{ gap: 12 }}>
              <Pressable className="flex-1 rounded-md py-3 items-center border" style={{ borderColor: C.border }}>
                <Text className="font-semibold text-[15px]" style={{ color: C.text }}>Отмена</Text>
              </Pressable>
              <Pressable className="flex-1 rounded-md py-3 items-center" style={{ backgroundColor: C.error }}>
                <Text className="text-white font-bold text-[15px]">Удалить</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </StateSection>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN EXPORT
// ═══════════════════════════════════════════════════════════════════════════════

export default function SettingsStates() {
  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 24 }} showsVerticalScrollIndicator={false}>
      <DefaultState />
      <DeleteConfirmationState />
    </ScrollView>
  );
}
