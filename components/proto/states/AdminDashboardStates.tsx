import React from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
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

function StatCard({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <Card style={{ flex: 1, minWidth: 150, padding: 0 }}>
      <View className="p-4">
        <Text className="text-xs text-[#737373] font-medium mb-1">{label}</Text>
        <Text className="text-2xl font-bold" style={{ color }}>{value}</Text>
      </View>
    </Card>
  );
}

function QuickLink({ label, badge }: { label: string; badge?: { count: number; color: string } }) {
  return (
    <Pressable className="flex-row items-center justify-between py-3 px-4">
      <Text className="text-[15px] text-[#1A1A1A] font-medium">{label}</Text>
      <View className="flex-row items-center" style={{ gap: 8 }}>
        {badge && (
          <View className="rounded-full px-2.5 py-0.5" style={{ backgroundColor: badge.color === C.error ? '#FFEBEE' : C.greenBg }}>
            <Text className="text-xs font-bold" style={{ color: badge.color }}>{badge.count}</Text>
          </View>
        )}
        <Text className="text-[#737373] text-lg">›</Text>
      </View>
    </Pressable>
  );
}

function DefaultState() {
  return (
    <View style={{ width: 390, backgroundColor: C.page }}>
      {/* Header */}
      <View className="flex-row items-center justify-between bg-white px-4 py-3 border-b border-[#E0E0E0]">
        <Text className="text-lg font-bold text-[#1A1A1A]">Панель администратора</Text>
        <Pressable>
          <Text className="text-[15px] text-[#00AA6C] font-semibold">Выйти</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, gap: 16 }}>
        {/* Stats grid 2-col */}
        <View className="flex-row flex-wrap" style={{ gap: 12 }}>
          <StatCard label="Объявлений" value="1 247" color={C.green} />
          <StatCard label="На модерации" value="13" color="#E65100" />
          <StatCard label="Пользователей" value="3 891" color="#1565C0" />
          <StatCard label="Премиум" value="47" color="#B8860B" />
        </View>

        {/* Quick links */}
        <Card style={{ padding: 0, overflow: 'hidden' }}>
          <QuickLink label="Модерация (13)" badge={{ count: 13, color: C.error }} />
          <View className="h-px bg-[#E0E0E0] ml-4" />
          <QuickLink label="Пользователи" />
          <View className="h-px bg-[#E0E0E0] ml-4" />
          <QuickLink label="Категории" />
          <View className="h-px bg-[#E0E0E0] ml-4" />
          <QuickLink label="Жалобы (4)" badge={{ count: 4, color: C.error }} />
          <View className="h-px bg-[#E0E0E0] ml-4" />
          <QuickLink label="Настройки платформы" />
        </Card>
      </ScrollView>
    </View>
  );
}

function AlertState() {
  return (
    <View style={{ width: 390, backgroundColor: C.page }}>
      {/* Alert banner */}
      <View className="px-4 py-3" style={{ backgroundColor: '#FFF3E0' }}>
        <Text className="text-sm font-semibold" style={{ color: '#E65100' }}>
          ⚠️ 13 объявлений ожидают проверки
        </Text>
      </View>

      {/* Header */}
      <View className="flex-row items-center justify-between bg-white px-4 py-3 border-b border-[#E0E0E0]">
        <Text className="text-lg font-bold text-[#1A1A1A]">Панель администратора</Text>
        <Pressable>
          <Text className="text-[15px] text-[#00AA6C] font-semibold">Выйти</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, gap: 16 }}>
        <View className="flex-row flex-wrap" style={{ gap: 12 }}>
          <StatCard label="Объявлений" value="1 247" color={C.green} />
          <StatCard label="На модерации" value="13" color="#E65100" />
          <StatCard label="Пользователей" value="3 891" color="#1565C0" />
          <StatCard label="Премиум" value="47" color="#B8860B" />
        </View>
      </ScrollView>
    </View>
  );
}

export default function AdminDashboardStates() {
  return (
    <>
      <StateSection title="ADMIN_DASHBOARD / Default">
        <DefaultState />
      </StateSection>
      <StateSection title="ADMIN_DASHBOARD / Alert state">
        <AlertState />
      </StateSection>
    </>
  );
}
