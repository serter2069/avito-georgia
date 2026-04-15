import React from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { StateSection } from '../StateSection';

const C = { green:'#00AA6C', greenBg:'#E8F9F2', white:'#FFFFFF', page:'#F5F5F5', text:'#1A1A1A', muted:'#737373', border:'#E0E0E0', error:'#D32F2F' };

// ─── Helpers ────────────────────────────────────────────────────────────────────

function NotificationRow({ color, title, time, read }: { color: string; title: string; time: string; read?: boolean }) {
  return (
    <View
      className="bg-white flex-row"
      style={{
        borderLeftWidth: 3,
        borderLeftColor: read ? '#D1D5DB' : color,
        opacity: read ? 0.6 : 1,
      }}
    >
      <View className="flex-1 py-3.5 px-4" style={{ gap: 4 }}>
        <Text
          className="text-[14px] leading-5"
          style={{ color: read ? C.muted : C.text, fontWeight: read ? '400' : '500' }}
        >
          {title}
        </Text>
        <Text className="text-xs" style={{ color: C.muted }}>{time}</Text>
      </View>
      {!read && <View className="w-2 h-2 rounded-full mt-4 mr-4" style={{ backgroundColor: color }} />}
    </View>
  );
}

// ─── State: Default — with notifications ────────────────────────────────────────

function DefaultState() {
  return (
    <StateSection title="NOTIFICATIONS_DEFAULT">
      <View style={{ width: 390, backgroundColor: C.page }}>
        {/* Header */}
        <View className="bg-white px-4 py-4 flex-row items-center justify-between">
          <Text className="text-xl font-bold" style={{ color: C.text }}>Уведомления</Text>
          <Pressable>
            <Text className="text-sm font-medium" style={{ color: C.green }}>Отметить все прочитанными</Text>
          </Pressable>
        </View>

        {/* Notification list */}
        <View className="mt-2 rounded-lg overflow-hidden" style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 2 }}>
          <NotificationRow
            color={C.green}
            title="Ваше объявление одобрено — Toyota Camry 2019"
            time="2ч назад"
          />
          <View className="h-px" style={{ backgroundColor: C.border }} />
          <NotificationRow
            color="#1565C0"
            title="Новое сообщение от Михаила"
            time="5ч назад"
          />
          <View className="h-px" style={{ backgroundColor: C.border }} />
          <NotificationRow
            color="#E65100"
            title="Объявление истекает через 3 дня — Ноутбук..."
            time="1д назад"
          />
          <View className="h-px" style={{ backgroundColor: C.border }} />
          <NotificationRow
            color="#D1D5DB"
            title="Добро пожаловать в avito.ge!"
            time="3д назад"
            read
          />
        </View>

        <View className="h-6" />
      </View>
    </StateSection>
  );
}

// ─── State: All Read ────────────────────────────────────────────────────────────

function AllReadState() {
  return (
    <StateSection title="NOTIFICATIONS_ALL_READ">
      <View style={{ width: 390, backgroundColor: C.page }}>
        <View className="bg-white px-4 py-4">
          <Text className="text-xl font-bold" style={{ color: C.text }}>Уведомления</Text>
        </View>

        <View className="mt-2 rounded-lg overflow-hidden" style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 2 }}>
          <NotificationRow
            color="#D1D5DB"
            title="Ваше объявление одобрено — Toyota Camry 2019"
            time="2ч назад"
            read
          />
          <View className="h-px" style={{ backgroundColor: C.border }} />
          <NotificationRow
            color="#D1D5DB"
            title="Новое сообщение от Михаила"
            time="5ч назад"
            read
          />
          <View className="h-px" style={{ backgroundColor: C.border }} />
          <NotificationRow
            color="#D1D5DB"
            title="Объявление истекает через 3 дня — Ноутбук..."
            time="1д назад"
            read
          />
          <View className="h-px" style={{ backgroundColor: C.border }} />
          <NotificationRow
            color="#D1D5DB"
            title="Добро пожаловать в avito.ge!"
            time="3д назад"
            read
          />
        </View>

        <View className="h-6" />
      </View>
    </StateSection>
  );
}

// ─── State: Empty ───────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <StateSection title="NOTIFICATIONS_EMPTY">
      <View style={{ width: 390, backgroundColor: C.page }}>
        <View className="bg-white px-4 py-4">
          <Text className="text-xl font-bold" style={{ color: C.text }}>Уведомления</Text>
        </View>

        <View className="bg-white mt-2 rounded-lg items-center py-16" style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 2 }}>
          <Text style={{ fontSize: 48 }}>🔔</Text>
          <Text className="text-lg font-bold mt-4" style={{ color: C.text }}>Нет уведомлений</Text>
          <Text className="text-sm mt-1 text-center" style={{ color: C.muted, maxWidth: 240 }}>
            Здесь будут появляться уведомления о ваших объявлениях и сообщениях
          </Text>
        </View>
      </View>
    </StateSection>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN EXPORT
// ═══════════════════════════════════════════════════════════════════════════════

export default function NotificationsStates() {
  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 24 }} showsVerticalScrollIndicator={false}>
      <DefaultState />
      <AllReadState />
      <EmptyState />
    </ScrollView>
  );
}
