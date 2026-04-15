import React from 'react';
import { View, Text, TextInput, Pressable, ScrollView } from 'react-native';
import { StateSection } from '../StateSection';

const C = { green:'#00AA6C', greenBg:'#E8F9F2', white:'#FFFFFF', page:'#F5F5F5', text:'#1A1A1A', muted:'#737373', border:'#E0E0E0', error:'#D32F2F' };

// ─── Helpers ────────────────────────────────────────────────────────────────────

function Avatar({ initials, size = 72, golden }: { initials: string; size?: number; golden?: boolean }) {
  return (
    <View
      className="items-center justify-center"
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: C.green,
        borderWidth: golden ? 3 : 0,
        borderColor: golden ? '#D4A017' : undefined,
      }}
    >
      <Text className="text-white font-bold" style={{ fontSize: size * 0.3 }}>{initials}</Text>
    </View>
  );
}

function MenuRow({ icon, label, isLast, isRed }: { icon: string; label: string; isLast?: boolean; isRed?: boolean }) {
  return (
    <View>
      <Pressable className="flex-row items-center py-3.5 px-4" style={{ gap: 14 }}>
        <Text style={{ fontSize: 18, width: 24, textAlign: 'center' }}>{icon}</Text>
        <Text
          className="flex-1 text-[15px] font-medium"
          style={{ color: isRed ? C.error : C.text }}
        >
          {label}
        </Text>
        <Text style={{ fontSize: 16, color: C.muted }}>›</Text>
      </Pressable>
      {!isLast && <View className="h-px ml-[52px]" style={{ backgroundColor: C.border }} />}
    </View>
  );
}

// ─── State: Default ─────────────────────────────────────────────────────────────

function DefaultState() {
  return (
    <StateSection title="PROFILE_DEFAULT">
      <View style={{ width: 390, backgroundColor: C.page }}>
        {/* Top section */}
        <View className="bg-white p-5 items-center" style={{ gap: 8 }}>
          <Avatar initials="ГК" />
          <Text className="text-lg font-bold" style={{ color: C.text }}>Георгий Каландадзе</Text>
          <Text className="text-sm" style={{ color: C.muted }}>g.kalandadze@gmail.com</Text>
          <Pressable className="rounded-md px-5 py-2 mt-1 border" style={{ borderColor: C.green }}>
            <Text className="text-sm font-semibold" style={{ color: C.green }}>Редактировать профиль</Text>
          </Pressable>
        </View>

        {/* Stats row */}
        <View className="flex-row bg-white mt-px">
          {[
            { value: '10', label: 'объявлений' },
            { value: '7', label: 'отзывов' },
            { value: 'С 2024', label: '' },
          ].map((s, i) => (
            <View key={i} className="flex-1 items-center py-3" style={{ borderRightWidth: i < 2 ? 1 : 0, borderRightColor: C.border }}>
              <Text className="text-base font-bold" style={{ color: C.text }}>{s.value}</Text>
              {s.label ? <Text className="text-xs" style={{ color: C.muted }}>{s.label}</Text> : null}
            </View>
          ))}
        </View>

        {/* Menu list */}
        <View className="bg-white mt-2 rounded-lg" style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 2 }}>
          <MenuRow icon="📋" label="Мои объявления" />
          <MenuRow icon="♡" label="Избранное" />
          <MenuRow icon="💳" label="История платежей" />
          <MenuRow icon="⭐" label="Подписка Premium" />
          <MenuRow icon="⚙" label="Настройки" />
          <MenuRow icon="❓" label="Помощь" />
          <MenuRow icon="🚪" label="Выйти" isLast isRed />
        </View>
      </View>
    </StateSection>
  );
}

// ─── State: Premium User ────────────────────────────────────────────────────────

function PremiumState() {
  return (
    <StateSection title="PROFILE_PREMIUM">
      <View style={{ width: 390, backgroundColor: C.page }}>
        <View className="bg-white p-5 items-center" style={{ gap: 8 }}>
          <Avatar initials="ГК" golden />
          <Text className="text-lg font-bold" style={{ color: C.text }}>Георгий Каландадзе</Text>
          <View className="rounded-full px-3 py-1" style={{ backgroundColor: '#FFF8E1' }}>
            <Text className="text-xs font-bold" style={{ color: '#D4A017' }}>⭐ Premium</Text>
          </View>
          <Text className="text-sm" style={{ color: C.muted }}>g.kalandadze@gmail.com</Text>
          <Text className="text-xs font-semibold" style={{ color: C.green }}>Подписка активна до 15.05.2026</Text>
          <Pressable className="rounded-md px-5 py-2 mt-1 border" style={{ borderColor: C.green }}>
            <Text className="text-sm font-semibold" style={{ color: C.green }}>Редактировать профиль</Text>
          </Pressable>
        </View>

        <View className="flex-row bg-white mt-px">
          {[
            { value: '10', label: 'объявлений' },
            { value: '7', label: 'отзывов' },
            { value: 'С 2024', label: '' },
          ].map((s, i) => (
            <View key={i} className="flex-1 items-center py-3" style={{ borderRightWidth: i < 2 ? 1 : 0, borderRightColor: C.border }}>
              <Text className="text-base font-bold" style={{ color: C.text }}>{s.value}</Text>
              {s.label ? <Text className="text-xs" style={{ color: C.muted }}>{s.label}</Text> : null}
            </View>
          ))}
        </View>

        <View className="bg-white mt-2 rounded-lg" style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 2 }}>
          <MenuRow icon="📋" label="Мои объявления" />
          <MenuRow icon="♡" label="Избранное" />
          <MenuRow icon="💳" label="История платежей" />
          <MenuRow icon="⭐" label="Подписка Premium" />
          <MenuRow icon="⚙" label="Настройки" />
          <MenuRow icon="❓" label="Помощь" />
          <MenuRow icon="🚪" label="Выйти" isLast isRed />
        </View>
      </View>
    </StateSection>
  );
}

// ─── State: Edit Mode ───────────────────────────────────────────────────────────

function EditModeState() {
  return (
    <StateSection title="PROFILE_EDIT">
      <View style={{ width: 390, backgroundColor: C.page }}>
        <View className="bg-white p-5" style={{ gap: 16 }}>
          <Text className="text-lg font-bold" style={{ color: C.text }}>Редактировать профиль</Text>

          <View>
            <Text className="text-sm font-medium mb-1.5" style={{ color: C.text }}>Имя</Text>
            <View className="border rounded-md px-3" style={{ borderColor: C.border }}>
              <TextInput
                className="text-base py-2.5"
                style={{ color: C.text }}
                value="Георгий"
                editable={false}
              />
            </View>
          </View>

          <View>
            <Text className="text-sm font-medium mb-1.5" style={{ color: C.text }}>Телефон</Text>
            <View className="border rounded-md px-3" style={{ borderColor: C.border }}>
              <TextInput
                className="text-base py-2.5"
                style={{ color: C.text }}
                placeholder="+995 5XX XXX XXX"
                placeholderTextColor={C.muted}
                editable={false}
              />
            </View>
          </View>

          <View>
            <Text className="text-sm font-medium mb-1.5" style={{ color: C.text }}>Город</Text>
            <Pressable className="border rounded-md px-3 py-2.5 flex-row items-center justify-between" style={{ borderColor: C.border }}>
              <Text className="text-base" style={{ color: C.muted }}>Выберите город</Text>
              <Text style={{ color: C.muted, fontSize: 14 }}>▼</Text>
            </Pressable>
          </View>

          <View className="flex-row" style={{ gap: 12, marginTop: 8 }}>
            <Pressable className="flex-1 bg-[#00AA6C] rounded-md py-3 items-center">
              <Text className="text-white font-bold text-[15px]">Сохранить</Text>
            </Pressable>
            <Pressable className="flex-1 rounded-md py-3 items-center border" style={{ borderColor: C.green }}>
              <Text className="font-semibold text-[15px]" style={{ color: C.green }}>Отмена</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </StateSection>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN EXPORT
// ═══════════════════════════════════════════════════════════════════════════════

export default function ProfileStates() {
  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 24 }} showsVerticalScrollIndicator={false}>
      <DefaultState />
      <PremiumState />
      <EditModeState />
    </ScrollView>
  );
}
