import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView } from 'react-native';
import { StateSection } from '../StateSection';

const C = { green:'#00AA6C', greenBg:'#E8F9F2', white:'#FFFFFF', page:'#F5F5F5', text:'#1A1A1A', muted:'#737373', border:'#E0E0E0', error:'#D32F2F' };

function Card({ children, style }: { children: React.ReactNode; style?: any }) {
  return (
    <View
      className="bg-white rounded-lg border border-[#E0E0E0]"
      style={[{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 3,
      }, style]}
    >
      {children}
    </View>
  );
}

function RoleBadge({ role }: { role: 'USER' | 'PREMIUM' | 'ADMIN' }) {
  const config = {
    USER: { bg: '#F4F4F4', color: C.muted },
    PREMIUM: { bg: '#FFF3E0', color: '#B8860B' },
    ADMIN: { bg: C.greenBg, color: C.green },
  };
  const { bg, color } = config[role];
  return (
    <View className="rounded-full px-2.5 py-0.5" style={{ backgroundColor: bg }}>
      <Text className="text-[11px] font-bold" style={{ color }}>{role}</Text>
    </View>
  );
}

function UserRow({ name, email, role, date }: { name: string; email: string; role: 'USER' | 'PREMIUM' | 'ADMIN'; date: string }) {
  return (
    <View className="flex-row items-center p-4" style={{ gap: 12 }}>
      {/* Avatar */}
      <View className="w-10 h-10 rounded-full bg-[#E0E0E0] items-center justify-center">
        <Text className="text-sm font-bold text-[#737373]">{name.charAt(0)}</Text>
      </View>
      <View className="flex-1">
        <View className="flex-row items-center" style={{ gap: 6 }}>
          <Text className="text-[15px] font-semibold text-[#1A1A1A]">{name}</Text>
          <RoleBadge role={role} />
        </View>
        <Text className="text-xs text-[#737373] mt-0.5">{email}</Text>
        <Text className="text-[11px] text-[#737373] mt-0.5">Регистрация: {date}</Text>
      </View>
      <Text className="text-lg text-[#737373]">···</Text>
    </View>
  );
}

// ─── Users States ──────────────────────────────────────────────────────────────

function UsersDefaultState() {
  return (
    <View style={{ width: 390, backgroundColor: C.page }}>
      <View className="bg-white px-4 py-3 border-b border-[#E0E0E0]">
        <Text className="text-lg font-bold text-[#1A1A1A]">Пользователи (3 891)</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
        {/* Search */}
        <View className="flex-row items-center bg-white border border-[#E0E0E0] rounded-md px-3">
          <Text className="text-[#737373] mr-2">🔍</Text>
          <TextInput
            className="flex-1 text-sm text-[#1A1A1A] py-2.5"
            placeholder="Поиск по имени или email..."
            placeholderTextColor={C.muted}
          />
        </View>

        {/* User list */}
        <Card style={{ padding: 0, overflow: 'hidden' }}>
          <UserRow name="Гиорги Б." email="giorgi@mail.ge" role="ADMIN" date="12.01.2024" />
          <View className="h-px bg-[#E0E0E0]" />
          <UserRow name="Нино К." email="nino.k@gmail.com" role="PREMIUM" date="05.03.2024" />
          <View className="h-px bg-[#E0E0E0]" />
          <UserRow name="Михаил Т." email="m.toreli@inbox.ge" role="USER" date="18.06.2024" />
          <View className="h-px bg-[#E0E0E0]" />
          <UserRow name="Лаша М." email="lasha.m@mail.ge" role="USER" date="02.09.2024" />
        </Card>
      </ScrollView>
    </View>
  );
}

function UserDetailState() {
  return (
    <View style={{ width: 390, backgroundColor: C.page }}>
      <View className="flex-row items-center bg-white px-4 py-3 border-b border-[#E0E0E0]" style={{ gap: 12 }}>
        <Text className="text-lg text-[#737373]">←</Text>
        <Text className="text-lg font-bold text-[#1A1A1A]">Профиль пользователя</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, gap: 16 }}>
        {/* User card */}
        <Card style={{ padding: 16 }}>
          <View className="items-center mb-4">
            <View className="w-16 h-16 rounded-full bg-[#E0E0E0] items-center justify-center mb-3">
              <Text className="text-2xl font-bold text-[#737373]">М</Text>
            </View>
            <Text className="text-lg font-bold text-[#1A1A1A]">Михаил Т.</Text>
            <Text className="text-sm text-[#737373]">m.toreli@inbox.ge</Text>
            <RoleBadge role="USER" />
          </View>

          <View className="h-px bg-[#E0E0E0] mb-3" />

          {/* Stats */}
          <View className="flex-row" style={{ gap: 16 }}>
            <View className="flex-1 items-center">
              <Text className="text-xl font-bold text-[#1A1A1A]">12</Text>
              <Text className="text-xs text-[#737373]">Объявлений</Text>
            </View>
            <View className="flex-1 items-center">
              <Text className="text-xl font-bold text-[#D32F2F]">2</Text>
              <Text className="text-xs text-[#737373]">Жалоб</Text>
            </View>
          </View>
        </Card>

        {/* Actions */}
        <View style={{ gap: 8 }}>
          <Pressable className="rounded-md py-3.5 items-center" style={{ backgroundColor: '#FFEBEE' }}>
            <Text className="text-[15px] font-bold text-[#D32F2F]">Заблокировать</Text>
          </Pressable>
          <Pressable className="rounded-md py-3.5 items-center border border-[#E0E0E0] bg-white">
            <Text className="text-[15px] font-semibold text-[#1A1A1A]">Назначить Admin</Text>
          </Pressable>
          <Pressable className="rounded-md py-3.5 items-center border border-[#E0E0E0] bg-white">
            <Text className="text-[15px] font-semibold text-[#1A1A1A]">Сбросить пароль</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

function BlockConfirmationState() {
  return (
    <View style={{ width: 390, backgroundColor: 'rgba(0,0,0,0.4)' }}>
      <View style={{ height: 260 }} />
      <View className="bg-white rounded-t-2xl px-4 pt-5 pb-8">
        <Text className="text-lg font-bold text-[#1A1A1A] mb-2">Заблокировать пользователя Михаил Т.?</Text>
        <Text className="text-sm text-[#737373] mb-6">Он не сможет входить в систему.</Text>
        <View className="flex-row" style={{ gap: 8 }}>
          <Pressable className="flex-1 rounded-md py-3.5 items-center border border-[#E0E0E0] bg-white">
            <Text className="text-[15px] font-semibold text-[#1A1A1A]">Отмена</Text>
          </Pressable>
          <Pressable className="flex-1 rounded-md py-3.5 items-center" style={{ backgroundColor: C.error }}>
            <Text className="text-[15px] font-bold text-white">Заблокировать</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

// ─── Categories States ─────────────────────────────────────────────────────────

function CategoriesDefaultState() {
  const categories = [
    { emoji: '🏠', name: 'Недвижимость', count: 247 },
    { emoji: '🚗', name: 'Авто', count: 183 },
    { emoji: '💻', name: 'Электроника', count: 312 },
    { emoji: '👕', name: 'Одежда', count: 156 },
    { emoji: '🛋️', name: 'Мебель', count: 89 },
    { emoji: '🐕', name: 'Животные', count: 64 },
  ];

  return (
    <View style={{ width: 390, backgroundColor: C.page }}>
      <View className="bg-white px-4 py-3 border-b border-[#E0E0E0]">
        <Text className="text-lg font-bold text-[#1A1A1A]">Категории</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
        <Card style={{ padding: 0, overflow: 'hidden' }}>
          {categories.map((cat, idx) => (
            <View key={cat.name}>
              <View className="flex-row items-center justify-between p-4">
                <View className="flex-row items-center" style={{ gap: 10 }}>
                  <Text style={{ fontSize: 20 }}>{cat.emoji}</Text>
                  <Text className="text-[15px] font-medium text-[#1A1A1A]">{cat.name}</Text>
                  <Text className="text-xs text-[#737373]">({cat.count})</Text>
                </View>
                <View className="flex-row items-center" style={{ gap: 12 }}>
                  <Text className="text-sm text-[#00AA6C]">✎</Text>
                  <Text className="text-sm text-[#D32F2F]">✕</Text>
                </View>
              </View>
              {idx < categories.length - 1 && <View className="h-px bg-[#E0E0E0]" />}
            </View>
          ))}
        </Card>

        <Pressable className="rounded-md py-3.5 items-center" style={{ backgroundColor: C.green }}>
          <Text className="text-[15px] font-bold text-white">Добавить категорию</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

function EditCategoryModalState() {
  const emojis = ['🏠', '🚗', '💻', '👕', '🛋️', '🐕', '🎮', '📱', '🔧', '🎵', '📚', '⚽'];

  return (
    <View style={{ width: 390, backgroundColor: 'rgba(0,0,0,0.4)' }}>
      <View style={{ height: 100 }} />
      <View className="bg-white rounded-t-2xl px-4 pt-5 pb-8">
        <Text className="text-lg font-bold text-[#1A1A1A] mb-4">Редактировать категорию</Text>

        <View style={{ gap: 14 }}>
          <View>
            <Text className="text-sm font-medium text-[#1A1A1A] mb-1.5">Название (RU)</Text>
            <View className="border border-[#E0E0E0] rounded-md bg-white px-3">
              <TextInput
                className="text-sm text-[#1A1A1A] py-2.5"
                value="Недвижимость"
                editable={false}
              />
            </View>
          </View>

          <View>
            <Text className="text-sm font-medium text-[#1A1A1A] mb-1.5">Название (KA)</Text>
            <View className="border border-[#E0E0E0] rounded-md bg-white px-3">
              <TextInput
                className="text-sm text-[#1A1A1A] py-2.5"
                value="უძრავი ქონება"
                editable={false}
              />
            </View>
          </View>

          <View>
            <Text className="text-sm font-medium text-[#1A1A1A] mb-1.5">Название (EN)</Text>
            <View className="border border-[#E0E0E0] rounded-md bg-white px-3">
              <TextInput
                className="text-sm text-[#1A1A1A] py-2.5"
                value="Real Estate"
                editable={false}
              />
            </View>
          </View>

          {/* Emoji picker */}
          <View>
            <Text className="text-sm font-medium text-[#1A1A1A] mb-1.5">Иконка</Text>
            <View className="flex-row flex-wrap" style={{ gap: 8 }}>
              {emojis.map((e) => (
                <Pressable
                  key={e}
                  className="w-10 h-10 rounded-md items-center justify-center"
                  style={{ backgroundColor: e === '🏠' ? C.greenBg : '#F4F4F4', borderWidth: e === '🏠' ? 2 : 0, borderColor: C.green }}
                >
                  <Text style={{ fontSize: 18 }}>{e}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        </View>

        <Pressable className="rounded-md py-3.5 items-center mt-6" style={{ backgroundColor: C.green }}>
          <Text className="text-[15px] font-bold text-white">Сохранить</Text>
        </Pressable>
      </View>
    </View>
  );
}

// ─── Exports ───────────────────────────────────────────────────────────────────

export default function AdminUsersStates() {
  return (
    <>
      <StateSection title="ADMIN_USERS / Default">
        <UsersDefaultState />
      </StateSection>
      <StateSection title="ADMIN_USERS / User detail">
        <UserDetailState />
      </StateSection>
      <StateSection title="ADMIN_USERS / Block confirmation">
        <BlockConfirmationState />
      </StateSection>
    </>
  );
}

export function AdminCategoriesStates() {
  return (
    <>
      <StateSection title="ADMIN_CATEGORIES / Default">
        <CategoriesDefaultState />
      </StateSection>
      <StateSection title="ADMIN_CATEGORIES / Edit category modal">
        <EditCategoryModalState />
      </StateSection>
    </>
  );
}
