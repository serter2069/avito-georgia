import React from 'react';
import { View, Text, ScrollView, Pressable, useWindowDimensions } from 'react-native';
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

interface ListingCard {
  title: string;
  price: string;
  city: string;
  bgColor: string;
}

const FAVORITES: ListingCard[] = [
  { title: 'Toyota Camry 2019', price: '\u20BE12 500', city: '\u0422\u0431\u0438\u043B\u0438\u0441\u0438', bgColor: '#D4E6F1' },
  { title: '\u041A\u0432\u0430\u0440\u0442\u0438\u0440\u0430 3-\u043A\u043E\u043C\u043D', price: '\u20BE185 000', city: '\u0411\u0430\u0442\u0443\u043C\u0438', bgColor: '#D5F5E3' },
  { title: 'iPhone 15 Pro 256GB', price: '\u20BE2 800', city: '\u0422\u0431\u0438\u043B\u0438\u0441\u0438', bgColor: '#FADBD8' },
  { title: '\u0414\u0438\u0432\u0430\u043D \u0443\u0433\u043B\u043E\u0432\u043E\u0439', price: '\u20BE950', city: '\u041A\u0443\u0442\u0430\u0438\u0441\u0438', bgColor: '#FCF3CF' },
  { title: '\u0412\u0435\u043B\u043E\u0441\u0438\u043F\u0435\u0434 Trek', price: '\u20BE1 200', city: '\u0422\u0431\u0438\u043B\u0438\u0441\u0438', bgColor: '#E8DAEF' },
  { title: 'MacBook Air M2', price: '\u20BE3 400', city: '\u0411\u0430\u0442\u0443\u043C\u0438', bgColor: '#D6EAF8' },
];

function FavCard({ card }: { card: ListingCard }) {
  return (
    <View
      className="rounded-lg border border-[#E0E0E0] overflow-hidden bg-white"
      style={{ width: '48%' }}
    >
      <View className="relative">
        <View style={{ height: 100, backgroundColor: card.bgColor }} />
        <View className="absolute top-2 right-2">
          <Text style={{ fontSize: 16, color: C.muted }}>{'\u2661'}</Text>
        </View>
      </View>
      <View className="p-2.5" style={{ gap: 2 }}>
        <Text className="text-sm font-bold" style={{ color: C.text }} numberOfLines={1}>{card.title}</Text>
        <Text className="text-sm font-bold" style={{ color: C.green }}>{card.price}</Text>
        <Text className="text-xs" style={{ color: C.muted }}>{card.city}</Text>
      </View>
    </View>
  );
}

// -- State 1: Default --

function DefaultState() {
  return (
    <StateSection title="FAVORITES__DEFAULT">
      <PhoneFrame>
        <View className="px-4 pt-4 pb-3">
          <Text className="text-xl font-bold" style={{ color: C.text }}>{'\u0418\u0437\u0431\u0440\u0430\u043D\u043D\u043E\u0435 \u00B7 7'}</Text>
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

// -- State 2: Removed toast --

function RemovedToastState() {
  return (
    <StateSection title="FAVORITES__REMOVED_TOAST">
      <PhoneFrame>
        <View className="px-4 pt-4 pb-3">
          <Text className="text-xl font-bold" style={{ color: C.text }}>{'\u0418\u0437\u0431\u0440\u0430\u043D\u043D\u043E\u0435 \u00B7 6'}</Text>
        </View>
        <View className="flex-row flex-wrap px-3 pb-4" style={{ gap: 10, justifyContent: 'space-between' }}>
          {FAVORITES.slice(1).map((card) => (
            <FavCard key={card.title} card={card} />
          ))}
        </View>
        <View
          className="mx-3 mb-3 rounded-lg flex-row items-center justify-between px-4 py-3"
          style={{ backgroundColor: '#333333' }}
        >
          <Text className="text-sm text-white">{'\u0423\u0434\u0430\u043B\u0435\u043D\u043E \u0438\u0437 \u0438\u0437\u0431\u0440\u0430\u043D\u043D\u043E\u0433\u043E'}</Text>
          <Pressable>
            <Text className="text-sm font-bold text-white">{'\u041E\u0442\u043C\u0435\u043D\u0438\u0442\u044C'}</Text>
          </Pressable>
        </View>
      </PhoneFrame>
    </StateSection>
  );
}

// -- State 3: Empty --

function EmptyState() {
  return (
    <StateSection title="FAVORITES__EMPTY">
      <PhoneFrame>
        <View className="px-4 pt-4 pb-3">
          <Text className="text-xl font-bold" style={{ color: C.text }}>{'\u0418\u0437\u0431\u0440\u0430\u043D\u043D\u043E\u0435'}</Text>
        </View>
        <View className="items-center py-16 px-6">
          <Text className="text-base font-semibold text-center" style={{ color: C.text }}>
            {'\u041D\u0435\u0442 \u0438\u0437\u0431\u0440\u0430\u043D\u043D\u044B\u0445 \u043E\u0431\u044A\u044F\u0432\u043B\u0435\u043D\u0438\u0439'}
          </Text>
          <Pressable className="mt-4 rounded-md px-6 py-3" style={{ backgroundColor: C.green }}>
            <Text className="text-white font-bold text-sm">{'\u041F\u0435\u0440\u0435\u0439\u0442\u0438 \u043A \u043E\u0431\u044A\u044F\u0432\u043B\u0435\u043D\u0438\u044F\u043C'}</Text>
          </Pressable>
        </View>
      </PhoneFrame>
    </StateSection>
  );
}

// -- Main Export --

export default function FavoritesStates() {
  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 24 }} showsVerticalScrollIndicator={false}>
      <DefaultState />
      <RemovedToastState />
      <EmptyState />
    </ScrollView>
  );
}
