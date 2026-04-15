import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { StateSection } from '../StateSection';

const C = { green:'#00AA6C', greenBg:'#E8F9F2', white:'#FFFFFF', page:'#F5F5F5', text:'#1A1A1A', muted:'#737373', border:'#E0E0E0', error:'#D32F2F' };

function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <View className="bg-white rounded-xl border border-[#E0E0E0] overflow-hidden" style={{ width: 390, alignSelf: 'center' }}>
      {children}
    </View>
  );
}

interface ListingCard {
  title: string;
  price: string;
  location: string;
  bgColor: string;
}

const FAVORITES: ListingCard[] = [
  { title: 'Toyota Camry 2019', price: '₾12 500', location: 'Тбилиси, Ваке', bgColor: '#D4E6F1' },
  { title: 'Квартира 3-комн, центр', price: '₾185 000', location: 'Батуми', bgColor: '#D5F5E3' },
  { title: 'iPhone 15 Pro 256GB', price: '₾2 800', location: 'Тбилиси', bgColor: '#FADBD8' },
  { title: 'Диван угловой бежевый', price: '₾950', location: 'Кутаиси', bgColor: '#FCF3CF' },
  { title: 'Велосипед горный Trek', price: '₾1 200', location: 'Тбилиси, Сабуртало', bgColor: '#E8DAEF' },
  { title: 'MacBook Air M2', price: '₾3 400', location: 'Батуми', bgColor: '#D6EAF8' },
];

function FavCard({ card }: { card: ListingCard }) {
  return (
    <View
      className="rounded-lg border border-[#E0E0E0] overflow-hidden bg-white"
      style={{ width: '48%', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 2 }}
    >
      <View className="relative">
        <View style={{ height: 100, backgroundColor: card.bgColor }} />
        <View className="absolute top-2 right-2">
          <Text style={{ fontSize: 16, color: '#E53935' }}>{'♥'}</Text>
        </View>
      </View>
      <View className="p-2.5" style={{ gap: 2 }}>
        <Text className="text-sm font-bold" style={{ color: C.text }} numberOfLines={1}>{card.title}</Text>
        <Text className="text-sm font-bold" style={{ color: C.green }}>{card.price}</Text>
        <Text className="text-xs" style={{ color: C.muted }}>{card.location}</Text>
      </View>
    </View>
  );
}

// ── State 1: Default — with favorites ──────────────────────────────────────────

function DefaultWithFavorites() {
  return (
    <StateSection title="FAVORITES__DEFAULT">
      <PhoneFrame>
        <View className="px-4 pt-4 pb-3">
          <Text className="text-xl font-bold" style={{ color: C.text }}>Избранное (7)</Text>
        </View>
        <View className="flex-row flex-wrap px-3 pb-4" style={{ gap: 10, justifyContent: 'space-between' }}>
          {FAVORITES.map((card) => (
            <FavCard key={card.title} card={card} />
          ))}
        </View>
      </PhoneFrame>
    </StateSection>
  );
}

// ── State 2: Item removed — toast ──────────────────────────────────────────────

function ItemRemoved() {
  return (
    <StateSection title="FAVORITES__ITEM_REMOVED">
      <PhoneFrame>
        <View className="px-4 pt-4 pb-3">
          <Text className="text-xl font-bold" style={{ color: C.text }}>Избранное (6)</Text>
        </View>
        <View className="flex-row flex-wrap px-3 pb-4" style={{ gap: 10, justifyContent: 'space-between' }}>
          {FAVORITES.slice(1).map((card) => (
            <FavCard key={card.title} card={card} />
          ))}
        </View>
        {/* Toast / Snackbar */}
        <View
          className="mx-3 mb-3 rounded-lg flex-row items-center justify-between px-4 py-3"
          style={{ backgroundColor: C.text }}
        >
          <Text className="text-sm text-white">Удалено из избранных</Text>
          <Pressable>
            <Text className="text-sm font-bold" style={{ color: C.green }}>Отменить</Text>
          </Pressable>
        </View>
      </PhoneFrame>
    </StateSection>
  );
}

// ── State 3: Empty ─────────────────────────────────────────────────────────────

function EmptyFavorites() {
  return (
    <StateSection title="FAVORITES__EMPTY">
      <PhoneFrame>
        <View className="px-4 pt-4 pb-3">
          <Text className="text-xl font-bold" style={{ color: C.text }}>Избранное</Text>
        </View>
        <View className="items-center py-16 px-6">
          <Text style={{ fontSize: 48 }}>{'🤍'}</Text>
          <Text className="text-base font-semibold mt-4 text-center" style={{ color: C.text }}>
            Вы ещё ничего не добавили в избранное
          </Text>
          <Pressable className="mt-4">
            <Text className="text-sm font-semibold" style={{ color: C.green }}>
              Перейти к объявлениям
            </Text>
          </Pressable>
        </View>
      </PhoneFrame>
    </StateSection>
  );
}

// ── Main Export ────────────────────────────────────────────────────────────────

export default function FavoritesStates() {
  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 24 }} showsVerticalScrollIndicator={false}>
      <DefaultWithFavorites />
      <ItemRemoved />
      <EmptyFavorites />
    </ScrollView>
  );
}
