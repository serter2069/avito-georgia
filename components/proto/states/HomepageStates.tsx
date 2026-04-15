import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { StateSection } from '../StateSection';

// ─── Design Tokens ───────────────────────────────────────────────────────────
const C = { green:'#00AA6C', greenBg:'#E8F9F2', white:'#FFFFFF', page:'#F5F5F5', text:'#1A1A1A', muted:'#737373', border:'#E0E0E0', error:'#D32F2F' };

// ─── Reusable ListingCard ────────────────────────────────────────────────────
function ListingCard({ title, price, location, time, badge }: { title: string; price: string; location: string; time: string; badge?: string }) {
  return (
    <View
      className="bg-white rounded-lg overflow-hidden border border-[#E0E0E0]"
      style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 4, elevation: 2 }}
    >
      <View className="bg-[#F0F0F0]" style={{ height: 120 }} />
      {badge && (
        <View className="absolute top-2 left-2 rounded-sm px-2 py-0.5 bg-[#E8F9F2]">
          <Text className="text-[11px] font-bold text-[#00AA6C]">{badge}</Text>
        </View>
      )}
      <View className="p-2.5">
        <Text className="text-sm font-medium text-[#1A1A1A]" numberOfLines={2}>{title}</Text>
        <Text className="text-base font-bold text-[#1A1A1A] mt-1">{price}</Text>
        <Text className="text-xs text-[#737373] mt-0.5">{location} · {time}</Text>
      </View>
    </View>
  );
}

// ─── Top Bar ─────────────────────────────────────────────────────────────────
function TopBar({ loggedIn }: { loggedIn?: boolean }) {
  return (
    <View className="flex-row items-center justify-between bg-white px-4 py-3 border-b border-[#E0E0E0]">
      <View className="flex-row items-center" style={{ gap: 8 }}>
        <View className="w-8 h-8 bg-[#00AA6C] rounded-md items-center justify-center">
          <Text className="text-white font-extrabold text-base">A</Text>
        </View>
        <View className="flex-row items-baseline" style={{ gap: 1 }}>
          <Text className="font-bold text-[#1A1A1A] text-base">avito</Text>
          <Text className="font-semibold text-[#00AA6C] text-xs">.ge</Text>
        </View>
      </View>
      {loggedIn ? (
        <View className="flex-row items-center" style={{ gap: 14 }}>
          <Text className="text-lg">🔔</Text>
          <View className="w-8 h-8 bg-[#00AA6C] rounded-full items-center justify-center">
            <Text className="text-white font-bold text-sm">Г</Text>
          </View>
        </View>
      ) : (
        <View className="bg-[#00AA6C] rounded-md px-4 py-2">
          <Text className="text-white font-bold text-sm">Войти</Text>
        </View>
      )}
    </View>
  );
}

// ─── Search Bar ──────────────────────────────────────────────────────────────
function SearchBar() {
  return (
    <View className="flex-row items-center bg-white border border-[#E0E0E0] rounded-lg px-3 py-3 mx-4 mt-3">
      <Text className="text-base mr-2">🔍</Text>
      <Text className="text-base text-[#737373]">Найти в Тбилиси...</Text>
    </View>
  );
}

// ─── City Pills ──────────────────────────────────────────────────────────────
function CityPills() {
  const cities = [
    { name: 'Тбилиси', active: true },
    { name: 'Батуми', active: false },
    { name: 'Кутаиси', active: false },
    { name: 'Рустави', active: false },
  ];
  return (
    <View className="flex-row flex-wrap px-4 mt-3" style={{ gap: 8 }}>
      {cities.map((c) => (
        <View
          key={c.name}
          className={`rounded-full px-4 py-2 ${c.active ? 'bg-[#00AA6C]' : 'bg-white border border-[#E0E0E0]'}`}
        >
          <Text className={`text-sm font-semibold ${c.active ? 'text-white' : 'text-[#1A1A1A]'}`}>{c.name}</Text>
        </View>
      ))}
    </View>
  );
}

// ─── Categories Grid ─────────────────────────────────────────────────────────
function CategoriesGrid() {
  const cats = [
    { emoji: '🏠', label: 'Недвижимость' },
    { emoji: '🚗', label: 'Авто' },
    { emoji: '💻', label: 'Электроника' },
    { emoji: '👕', label: 'Одежда' },
    { emoji: '🛋️', label: 'Дом и сад' },
    { emoji: '💼', label: 'Работа' },
    { emoji: '🐾', label: 'Животные' },
    { emoji: '🔧', label: 'Услуги' },
  ];
  return (
    <View className="flex-row flex-wrap px-4 mt-4" style={{ gap: 10 }}>
      {cats.map((c) => (
        <View
          key={c.label}
          className="bg-white rounded-lg border border-[#E0E0E0] items-center justify-center py-3"
          style={{ width: '47%' as any, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 3, elevation: 1 }}
        >
          <Text style={{ fontSize: 28 }}>{c.emoji}</Text>
          <Text className="text-sm font-medium text-[#1A1A1A] mt-1.5">{c.label}</Text>
        </View>
      ))}
    </View>
  );
}

// ─── Fresh Listings ──────────────────────────────────────────────────────────
function FreshListings() {
  const listings = [
    { title: '2-комнатная квартира, центр', price: '₾95 000', location: 'Тбилиси', time: '2ч назад', badge: 'Premium' },
    { title: 'Toyota Prius 2018, 60 000 км', price: '₾28 500', location: 'Батуми', time: '4ч назад' },
    { title: 'MacBook Pro 14" M2, 512GB', price: '₾3 200', location: 'Тбилиси', time: '1ч назад' },
    { title: 'Диван угловой, бежевый', price: '₾850', location: 'Кутаиси', time: '6ч назад' },
  ];
  return (
    <View className="px-4 mt-5">
      <Text className="text-lg font-bold text-[#1A1A1A] mb-3">Свежие объявления</Text>
      <View className="flex-row flex-wrap" style={{ gap: 10 }}>
        {listings.map((l, i) => (
          <View key={i} style={{ width: '48%' as any }}>
            <ListingCard {...l} />
          </View>
        ))}
      </View>
    </View>
  );
}

// ─── CTA Banner ──────────────────────────────────────────────────────────────
function CtaBanner() {
  return (
    <View className="mx-4 mt-5 bg-[#00AA6C] rounded-lg px-5 py-4 items-center">
      <Text className="text-white font-bold text-base mb-1">Подайте объявление</Text>
      <Text className="text-white text-sm opacity-80">Быстро, просто и бесплатно</Text>
    </View>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// STATE 1: Guest Default
// ═══════════════════════════════════════════════════════════════════════════════
function GuestDefault() {
  return (
    <StateSection title="HOMEPAGE_GUEST_DEFAULT">
      <View className="bg-[#F5F5F5] rounded-lg overflow-hidden" style={{ width: 390 }}>
        <TopBar />
        <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
          <SearchBar />
          <CityPills />
          <CategoriesGrid />
          <FreshListings />
          <CtaBanner />
        </ScrollView>
      </View>
    </StateSection>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// STATE 2: User Logged In
// ═══════════════════════════════════════════════════════════════════════════════
function UserLoggedIn() {
  return (
    <StateSection title="HOMEPAGE_USER_LOGGED_IN">
      <View className="bg-[#F5F5F5] rounded-lg overflow-hidden" style={{ width: 390 }}>
        <TopBar loggedIn />
        <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
          <SearchBar />
          <CityPills />
          <CategoriesGrid />
          <FreshListings />
          <CtaBanner />
        </ScrollView>
      </View>
    </StateSection>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN EXPORT
// ═══════════════════════════════════════════════════════════════════════════════
export default function HomepageStates() {
  return (
    <View style={{ gap: 32 }}>
      <GuestDefault />
      <UserLoggedIn />
    </View>
  );
}
