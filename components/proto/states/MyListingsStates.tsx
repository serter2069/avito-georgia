import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { StateSection } from '../StateSection';

const C = { green:'#00AA6C', greenBg:'#E8F9F2', white:'#FFFFFF', page:'#F5F5F5', text:'#1A1A1A', muted:'#737373', border:'#E0E0E0', error:'#D32F2F' };

// ─── Helpers ────────────────────────────────────────────────────────────────────

function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <View className="bg-white rounded-xl border border-[#E0E0E0] overflow-hidden" style={{ width: 390 }}>
      {children}
    </View>
  );
}

function Header({ title }: { title: string }) {
  return (
    <View className="flex-row items-center justify-between px-4 py-3 border-b border-[#E0E0E0]">
      <Text className="text-lg font-bold text-[#1A1A1A]">{title}</Text>
      <Text className="text-xl text-[#737373]">+</Text>
    </View>
  );
}

function StatusTabs({ tabs, activeIdx }: { tabs: { label: string; count: number }[]; activeIdx: number }) {
  return (
    <View className="flex-row border-b border-[#E0E0E0]">
      {tabs.map((tab, idx) => {
        const active = idx === activeIdx;
        return (
          <View
            key={tab.label}
            className="flex-1 items-center py-3"
            style={active ? { borderBottomWidth: 2, borderBottomColor: C.green } : {}}
          >
            <Text
              className="text-[13px] font-semibold"
              style={{ color: active ? C.green : C.muted }}
            >
              {tab.label} ({tab.count})
            </Text>
          </View>
        );
      })}
    </View>
  );
}

function ListingRow({ title, price, views, actions }: {
  title: string; price: string; views?: string; actions: { label: string; color?: string }[];
}) {
  return (
    <View className="flex-row px-4 py-3 border-b border-[#E0E0E0]" style={{ gap: 12 }}>
      {/* Image placeholder */}
      <View className="w-16 h-16 rounded-md bg-[#E0E0E0]" />
      <View className="flex-1" style={{ gap: 4 }}>
        <Text className="text-[15px] font-semibold text-[#1A1A1A]" numberOfLines={1}>{title}</Text>
        <Text className="text-[15px] font-bold text-[#00AA6C]">{price}</Text>
        {views && <Text className="text-xs text-[#737373]">{views}</Text>}
        <View className="flex-row mt-1" style={{ gap: 12 }}>
          {actions.map((a) => (
            <Text key={a.label} className="text-[13px] font-semibold" style={{ color: a.color || C.green }}>
              {a.label}
            </Text>
          ))}
        </View>
      </View>
    </View>
  );
}

function BadgeRow({ title, price, badge }: {
  title: string; price: string; badge: { label: string; bg: string; color: string };
}) {
  return (
    <View className="flex-row px-4 py-3 border-b border-[#E0E0E0]" style={{ gap: 12 }}>
      <View className="w-16 h-16 rounded-md bg-[#E0E0E0]" />
      <View className="flex-1" style={{ gap: 4 }}>
        <View className="flex-row items-center" style={{ gap: 8 }}>
          <Text className="text-[15px] font-semibold text-[#1A1A1A]" numberOfLines={1}>{title}</Text>
          <View className="rounded-full px-2.5 py-0.5" style={{ backgroundColor: badge.bg }}>
            <Text className="text-[11px] font-bold" style={{ color: badge.color }}>{badge.label}</Text>
          </View>
        </View>
        <Text className="text-[15px] font-bold text-[#00AA6C]">{price}</Text>
        <Text className="text-[13px] font-semibold text-[#D32F2F] mt-1">Отменить</Text>
      </View>
    </View>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// STATES
// ═══════════════════════════════════════════════════════════════════════════════

function ActiveTabState() {
  const tabs = [
    { label: 'Активные', count: 3 },
    { label: 'Ожидают', count: 1 },
    { label: 'Черновики', count: 2 },
    { label: 'Проданные', count: 5 },
  ];
  const listings = [
    { title: 'Toyota Camry 2019, 45 000 км', price: '12 500 GEL', views: '2 просмотра сегодня' },
    { title: 'Квартира 3-комн., Батуми центр', price: '85 000 $', views: '2 просмотра сегодня' },
    { title: 'iPhone 14 Pro Max 256GB', price: '2 400 GEL', views: '2 просмотра сегодня' },
  ];
  const actions = [
    { label: 'Редактировать' },
    { label: 'Продвинуть' },
    { label: '\u00B7\u00B7\u00B7', color: C.muted },
  ];

  return (
    <StateSection title="MY_LISTINGS / Active tab">
      <PhoneFrame>
        <Header title="Мои объявления" />
        <StatusTabs tabs={tabs} activeIdx={0} />
        {listings.map((l) => (
          <ListingRow key={l.title} title={l.title} price={l.price} views={l.views} actions={actions} />
        ))}
      </PhoneFrame>
    </StateSection>
  );
}

function PendingTabState() {
  const tabs = [
    { label: 'Активные', count: 3 },
    { label: 'Ожидают', count: 1 },
    { label: 'Черновики', count: 2 },
    { label: 'Проданные', count: 5 },
  ];

  return (
    <StateSection title="MY_LISTINGS / Pending moderation tab">
      <PhoneFrame>
        <Header title="Мои объявления" />
        <StatusTabs tabs={tabs} activeIdx={1} />
        <BadgeRow
          title="Диван угловой, бежевый"
          price="350 GEL"
          badge={{ label: 'На проверке', bg: '#FFF3E0', color: '#E65100' }}
        />
      </PhoneFrame>
    </StateSection>
  );
}

function EmptyState() {
  return (
    <StateSection title="MY_LISTINGS / Empty — no listings">
      <PhoneFrame>
        <Header title="Мои объявления" />
        <View className="items-center py-16 px-6">
          <View className="w-16 h-16 rounded-full bg-[#E8F9F2] items-center justify-center mb-4">
            <Text style={{ fontSize: 28 }}>📋</Text>
          </View>
          <Text className="text-base font-semibold text-[#1A1A1A] mb-2 text-center">
            Здесь будут ваши объявления
          </Text>
          <Pressable className="bg-[#00AA6C] rounded-md px-6 py-3 mt-4">
            <Text className="text-white font-bold text-[15px]">Подать объявление</Text>
          </Pressable>
        </View>
      </PhoneFrame>
    </StateSection>
  );
}

function DeleteConfirmationState() {
  return (
    <StateSection title="MY_LISTINGS / Delete confirmation modal">
      <PhoneFrame>
        <Header title="Мои объявления" />
        <ListingRow
          title="Toyota Camry 2019, 45 000 км"
          price="12 500 GEL"
          actions={[{ label: 'Редактировать' }]}
        />
        {/* Modal overlay */}
        <View
          className="absolute inset-0 items-center justify-center"
          style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
        >
          <View
            className="bg-white rounded-xl mx-6 p-6"
            style={{
              width: 340,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.15,
              shadowRadius: 24,
              elevation: 8,
            }}
          >
            <Text className="text-lg font-bold text-[#1A1A1A] mb-2">Удалить объявление?</Text>
            <Text className="text-sm text-[#737373] mb-6 leading-5">
              Это действие нельзя отменить.
            </Text>
            <View className="flex-row justify-end" style={{ gap: 12 }}>
              <Pressable className="rounded-md px-5 py-2.5 border border-[#E0E0E0]">
                <Text className="text-[15px] font-semibold text-[#1A1A1A]">Отменить</Text>
              </Pressable>
              <Pressable className="rounded-md px-5 py-2.5 bg-[#D32F2F]">
                <Text className="text-[15px] font-bold text-white">Удалить</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </PhoneFrame>
    </StateSection>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN EXPORT
// ═══════════════════════════════════════════════════════════════════════════════

export default function MyListingsStates() {
  return (
    <View style={{ gap: 0 }}>
      <ActiveTabState />
      <PendingTabState />
      <EmptyState />
      <DeleteConfirmationState />
    </View>
  );
}
