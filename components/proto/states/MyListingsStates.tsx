import React from 'react';
import { View, Text, Pressable, useWindowDimensions } from 'react-native';
import { StateSection } from '../StateSection';

const C = { green:'#00AA6C', greenBg:'#E8F9F2', white:'#FFFFFF', page:'#F5F5F5', text:'#1A1A1A', muted:'#737373', border:'#E0E0E0', error:'#D32F2F' };

// ─── Helpers ────────────────────────────────────────────────────────────────────

function PhoneFrame({ children }: { children: React.ReactNode }) {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 640;

  return (
    <View
      className="bg-white overflow-hidden"
      style={isDesktop
        ? { width: 390, alignSelf: 'center', borderRadius: 12, borderWidth: 1, borderColor: C.border, backgroundColor: C.white }
        : { width: '100%' as any, backgroundColor: C.white }
      }
    >
      {isDesktop && (
        <View style={{ position: 'absolute', top: -20, left: 0, right: 0, bottom: -20, zIndex: -1, backgroundColor: C.page }} />
      )}
      {children}
    </View>
  );
}

function Header({ title }: { title: string }) {
  return (
    <View className="flex-row items-center justify-between px-4 py-3 border-b border-[#E0E0E0]">
      <Text className="text-lg font-bold text-[#1A1A1A]">{title}</Text>
      <Text className="text-xl text-[#00AA6C]">+</Text>
    </View>
  );
}

function StatusTabs({ tabs, activeIdx }: { tabs: string[]; activeIdx: number }) {
  return (
    <View className="flex-row border-b border-[#E0E0E0]">
      {tabs.map((tab, idx) => {
        const active = idx === activeIdx;
        return (
          <View
            key={tab}
            className="flex-1 items-center py-3"
            style={active ? { borderBottomWidth: 2, borderBottomColor: C.green } : {}}
          >
            <Text
              className="text-[13px] font-semibold"
              style={{ color: active ? C.green : C.muted }}
            >
              {tab}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

function ListingRow({ title, price, views, actions }: {
  title: string; price: string; views?: string; actions?: { label: string; color?: string }[];
}) {
  return (
    <View className="flex-row px-4 py-3 border-b border-[#E0E0E0]" style={{ gap: 12 }}>
      <View style={{ width: 60, height: 60, borderRadius: 6, backgroundColor: '#E0E0E0' }} />
      <View className="flex-1" style={{ gap: 4 }}>
        <Text className="text-[15px] font-semibold text-[#1A1A1A]" numberOfLines={1}>{title}</Text>
        <Text className="text-[15px] font-bold" style={{ color: C.green }}>{price}</Text>
        {views && <Text className="text-xs text-[#737373]">{views}</Text>}
        {actions && actions.length > 0 && (
          <View className="flex-row mt-1" style={{ gap: 12 }}>
            {actions.map((a) => (
              <Text key={a.label} className="text-[13px] font-semibold" style={{ color: a.color || C.green }}>
                {a.label}
              </Text>
            ))}
          </View>
        )}
      </View>
    </View>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// STATES
// ═══════════════════════════════════════════════════════════════════════════════

function ActiveTabState() {
  const tabs = ['Активные (3)', 'Ожидают (1)', 'Черновики (2)', 'Архив'];
  const listings = [
    { title: 'Toyota Camry 2019, 45 000 км', price: '12 500 ₾', views: '24 просмотра' },
    { title: 'Квартира 3-комн., Батуми центр', price: '85 000 ₾', views: '24 просмотра' },
    { title: 'iPhone 14 Pro Max 256GB', price: '2 400 ₾', views: '24 просмотра' },
  ];
  const actions = [
    { label: 'Редактировать' },
    { label: 'Удалить', color: C.error },
    { label: 'Продлить' },
  ];

  return (
    <StateSection title="MY_LISTINGS / Active">
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
  const tabs = ['Активные (3)', 'Ожидают (1)', 'Черновики (2)', 'Архив'];

  return (
    <StateSection title="MY_LISTINGS / Pending">
      <PhoneFrame>
        <Header title="Мои объявления" />
        <StatusTabs tabs={tabs} activeIdx={1} />
        <View className="flex-row px-4 py-3 border-b border-[#E0E0E0]" style={{ gap: 12 }}>
          <View style={{ width: 60, height: 60, borderRadius: 6, backgroundColor: '#E0E0E0' }} />
          <View className="flex-1" style={{ gap: 4 }}>
            <View className="flex-row items-center" style={{ gap: 8 }}>
              <Text className="text-[15px] font-semibold text-[#1A1A1A]" numberOfLines={1}>Диван угловой, бежевый</Text>
            </View>
            <Text className="text-[15px] font-bold" style={{ color: C.green }}>350 ₾</Text>
            <View className="rounded px-2 py-0.5 self-start mt-1" style={{ backgroundColor: '#F5F5F5' }}>
              <Text className="text-[11px] font-bold" style={{ color: C.muted }}>На проверке</Text>
            </View>
          </View>
        </View>
      </PhoneFrame>
    </StateSection>
  );
}

function EmptyState() {
  return (
    <StateSection title="MY_LISTINGS / Empty">
      <PhoneFrame>
        <Header title="Мои объявления" />
        <View className="items-center py-16 px-6">
          <Text className="text-base font-semibold text-[#1A1A1A] mb-2 text-center">
            Нет объявлений
          </Text>
          <Pressable className="rounded-md px-6 py-3 mt-4" style={{ backgroundColor: C.green }}>
            <Text className="text-white font-bold text-[15px]">Подать объявление</Text>
          </Pressable>
          <Text className="text-xs text-[#737373] mt-3 text-center">
            3 бесплатных объявления в каждой категории
          </Text>
        </View>
      </PhoneFrame>
    </StateSection>
  );
}

function DeleteConfirmState() {
  return (
    <StateSection title="MY_LISTINGS / Delete confirm">
      <PhoneFrame>
        <Header title="Мои объявления" />
        <ListingRow
          title="Toyota Camry 2019, 45 000 км"
          price="12 500 ₾"
          views="24 просмотра"
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
                <Text className="text-[15px] font-semibold text-[#1A1A1A]">Отмена</Text>
              </Pressable>
              <Pressable className="rounded-md px-5 py-2.5" style={{ backgroundColor: C.error }}>
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
      <DeleteConfirmState />
    </View>
  );
}
