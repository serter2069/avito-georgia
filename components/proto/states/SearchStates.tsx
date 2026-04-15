import React from 'react';
import { View, Text, TextInput, ScrollView, Image } from 'react-native';
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

function ListingCard({ title, price, location, time }: { title: string; price: string; location: string; time: string }) {
  return (
    <View className="flex-row border-b border-[#E0E0E0] p-3" style={{ gap: 12 }}>
      <View className="w-[100px] h-[80px] rounded-md bg-[#E0E0E0]" />
      <View className="flex-1 justify-center">
        <Text className="text-[15px] font-bold text-[#1A1A1A] mb-1">{price}</Text>
        <Text className="text-[13px] text-[#1A1A1A] mb-1.5" numberOfLines={2}>{title}</Text>
        <View className="flex-row items-center justify-between">
          <Text className="text-[11px] text-[#737373]">{location}</Text>
          <Text className="text-[11px] text-[#737373]">{time}</Text>
        </View>
      </View>
    </View>
  );
}

// ─── State 1: Default / Empty Query ─────────────────────────────────────────────

function SearchDefault() {
  const recentQueries = ['квартира батуми', 'toyota camry', 'ноутбук'];
  const categories = [
    { emoji: '\u{1F3E0}', label: 'Недвижимость' },
    { emoji: '\u{1F697}', label: 'Авто' },
    { emoji: '\u{1F4BB}', label: 'Электроника' },
    { emoji: '\u{1F455}', label: 'Одежда' },
    { emoji: '', label: 'ещё...' },
  ];

  return (
    <StateSection title="SEARCH_DEFAULT">
      <PhoneFrame>
        {/* Search input focused */}
        <View className="px-4 pt-4 pb-3">
          <View className="flex-row items-center border-2 border-[#00AA6C] rounded-lg bg-white px-3" style={{ gap: 8 }}>
            <Text className="text-[#737373] text-base">&#x1F50D;</Text>
            <TextInput
              className="flex-1 text-base text-[#1A1A1A] py-3"
              placeholder="Поиск по объявлениям"
              placeholderTextColor={C.muted}
              editable={false}
            />
            <Text className="text-[#737373] text-lg">&times;</Text>
          </View>
        </View>

        {/* Recent queries */}
        <View className="px-4 pb-3">
          <Text className="text-[13px] font-semibold text-[#737373] mb-2">Недавние запросы</Text>
          <View style={{ gap: 8 }}>
            {recentQueries.map((q) => (
              <View key={q} className="flex-row items-center" style={{ gap: 8 }}>
                <Text className="text-[#737373] text-sm">&#x1F552;</Text>
                <Text className="text-[15px] text-[#1A1A1A]">{q}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Category chips */}
        <View className="px-4 pb-4">
          <View className="flex-row flex-wrap" style={{ gap: 8 }}>
            {categories.map((cat) => (
              <View key={cat.label} className="flex-row items-center bg-[#F5F5F5] rounded-full px-3.5 py-2" style={{ gap: 6 }}>
                {cat.emoji ? <Text className="text-sm">{cat.emoji}</Text> : null}
                <Text className="text-[13px] font-medium text-[#1A1A1A]">{cat.label}</Text>
              </View>
            ))}
          </View>
        </View>
      </PhoneFrame>
    </StateSection>
  );
}

// ─── State 2: Results ───────────────────────────────────────────────────────────

function SearchResults() {
  const listings = [
    { title: '3-комн. квартира, центр Батуми, вид на море', price: '$85,000', location: 'Батуми, Аджария', time: '2ч' },
    { title: '2-комн. квартира, новостройка, 65 м\u00B2', price: '$52,000', location: 'Тбилиси, Сабуртало', time: '5ч' },
    { title: '1-комн. квартира, евроремонт, мебель', price: '1,200 GEL/мес', location: 'Тбилиси, Ваке', time: '8ч' },
    { title: 'Студия 35 м\u00B2, у моря, сдача 2025', price: '$38,000', location: 'Батуми', time: '1д' },
  ];

  return (
    <StateSection title="SEARCH_RESULTS">
      <PhoneFrame>
        {/* Search bar filled */}
        <View className="px-4 pt-4 pb-3">
          <View className="flex-row items-center border border-[#E0E0E0] rounded-lg bg-white px-3" style={{ gap: 8 }}>
            <Text className="text-[#737373] text-base">&#x1F50D;</Text>
            <Text className="flex-1 text-base text-[#1A1A1A] py-3">квартира</Text>
            <Text className="text-[#737373] text-lg">&times;</Text>
          </View>
        </View>

        {/* Results count */}
        <View className="px-4 pb-2">
          <Text className="text-[13px] font-semibold text-[#737373]">Найдено 47</Text>
        </View>

        {/* Filter chips */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-4 pb-3">
          <View className="flex-row" style={{ gap: 8 }}>
            {['Тбилиси \u25BE', 'Цена \u25BE', 'Площадь \u25BE'].map((f) => (
              <View key={f} className="border border-[#E0E0E0] rounded-full px-3.5 py-1.5 bg-white">
                <Text className="text-[13px] text-[#1A1A1A]">{f}</Text>
              </View>
            ))}
          </View>
        </ScrollView>

        {/* Listing cards */}
        {listings.map((item, idx) => (
          <ListingCard key={idx} {...item} />
        ))}
      </PhoneFrame>
    </StateSection>
  );
}

// ─── State 3: No Results ────────────────────────────────────────────────────────

function SearchNoResults() {
  return (
    <StateSection title="SEARCH_NO_RESULTS">
      <PhoneFrame>
        {/* Search bar */}
        <View className="px-4 pt-4 pb-3">
          <View className="flex-row items-center border border-[#E0E0E0] rounded-lg bg-white px-3" style={{ gap: 8 }}>
            <Text className="text-[#737373] text-base">&#x1F50D;</Text>
            <Text className="flex-1 text-base text-[#1A1A1A] py-3">мотоцикл</Text>
            <Text className="text-[#737373] text-lg">&times;</Text>
          </View>
        </View>

        {/* Empty state */}
        <View className="items-center py-16 px-4">
          <Text className="text-5xl mb-4">&#x1F614;</Text>
          <Text className="text-lg font-bold text-[#1A1A1A] mb-2 text-center">
            Ничего не найдено
          </Text>
          <Text className="text-[13px] text-[#737373] text-center mb-1">
            По запросу «мотоцикл» нет результатов
          </Text>
          <Text className="text-[13px] text-[#737373] text-center">
            Попробуйте другой запрос
          </Text>
        </View>
      </PhoneFrame>
    </StateSection>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN EXPORT
// ═══════════════════════════════════════════════════════════════════════════════

export default function SearchStates() {
  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 24, backgroundColor: C.page }}>
      <View>
        <Text className="text-2xl font-bold text-[#1A1A1A] mb-1">Search</Text>
        <Text className="text-sm text-[#737373]">Search flow states -- Avito Georgia</Text>
      </View>
      <SearchDefault />
      <SearchResults />
      <SearchNoResults />
      <View className="h-10" />
    </ScrollView>
  );
}
