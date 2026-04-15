import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { StateSection } from '../StateSection';

// ─── Design Tokens ───────────────────────────────────────────────────────────
const C = { green:'#00AA6C', greenBg:'#E8F9F2', white:'#FFFFFF', page:'#F5F5F5', text:'#1A1A1A', muted:'#737373', border:'#E0E0E0', error:'#D32F2F' };

// ─── ListingCard ─────────────────────────────────────────────────────────────
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

// ─── Filter Chip ─────────────────────────────────────────────────────────────
function FilterChip({ label, active, onClear }: { label: string; active?: boolean; onClear?: boolean }) {
  return (
    <View
      className={`rounded-full px-3.5 py-2 flex-row items-center ${active ? 'bg-[#00AA6C]' : 'bg-white border border-[#E0E0E0]'}`}
      style={{ gap: 4 }}
    >
      <Text className={`text-sm font-medium ${active ? 'text-white' : 'text-[#1A1A1A]'}`}>{label}</Text>
      {onClear && <Text className="text-white font-bold text-sm ml-1">×</Text>}
    </View>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// STATE 1: Default
// ═══════════════════════════════════════════════════════════════════════════════
function DefaultFeed() {
  const listings = [
    { title: '3-комнатная квартира, вид на море', price: '₾125 000', location: 'Батуми', time: '1ч назад', badge: 'Premium' },
    { title: 'Toyota Camry 2019, 45 000 км', price: '₾32 000', location: 'Тбилиси', time: '2ч назад' },
    { title: 'iPhone 15 Pro Max 256GB', price: '₾2 800', location: 'Тбилиси', time: '3ч назад' },
    { title: 'Студия 35м², новый ремонт', price: '₾58 000', location: 'Батуми', time: '5ч назад', badge: 'Top' },
    { title: 'BMW X5 2020, автомат, полный', price: '₾78 000', location: 'Тбилиси', time: '6ч назад' },
    { title: 'Samsung Galaxy S24 Ultra', price: '₾2 100', location: 'Кутаиси', time: '8ч назад' },
  ];

  return (
    <StateSection title="LISTINGS_FEED_DEFAULT">
      <View className="bg-[#F5F5F5] rounded-lg overflow-hidden" style={{ width: 390 }}>
        {/* Header */}
        <View className="bg-white px-4 py-3 border-b border-[#E0E0E0]">
          <Text className="text-lg font-bold text-[#1A1A1A]">Объявления (143)</Text>
        </View>

        {/* Filters */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 12, gap: 8 }}>
          <FilterChip label="Все категории ▾" />
          <FilterChip label="Тбилиси ▾" />
          <FilterChip label="Цена ▾" />
          <FilterChip label="По дате ▾" />
        </ScrollView>

        {/* Grid */}
        <View className="flex-row flex-wrap px-4 pb-4" style={{ gap: 10 }}>
          {listings.map((l, i) => (
            <View key={i} style={{ width: '48%' as any }}>
              <ListingCard {...l} />
            </View>
          ))}
        </View>
      </View>
    </StateSection>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// STATE 2: Filtered — Недвижимость
// ═══════════════════════════════════════════════════════════════════════════════
function FilteredRealEstate() {
  const listings = [
    { title: '3-комнатная квартира, вид на море', price: '₾125 000', location: 'Батуми', time: '1ч назад', badge: 'Premium' },
    { title: 'Студия 35м², новый ремонт', price: '₾58 000', location: 'Батуми', time: '5ч назад' },
    { title: '2-комнатная, центр города', price: '₾92 000', location: 'Тбилиси', time: '7ч назад', badge: 'Top' },
    { title: 'Дом 120м², участок 400м²', price: '₾180 000', location: 'Кутаиси', time: '12ч назад' },
    { title: '1-комнатная, Сабуртало', price: '₾68 000', location: 'Тбилиси', time: '1д назад' },
    { title: 'Пентхаус 150м², терраса', price: '₾295 000', location: 'Батуми', time: '1д назад', badge: 'Premium' },
  ];

  return (
    <StateSection title="LISTINGS_FEED_FILTERED_REALESTATE">
      <View className="bg-[#F5F5F5] rounded-lg overflow-hidden" style={{ width: 390 }}>
        <View className="bg-white px-4 py-3 border-b border-[#E0E0E0]">
          <Text className="text-lg font-bold text-[#1A1A1A]">Недвижимость (38)</Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 12, gap: 8 }}>
          <FilterChip label="Недвижимость ×" active onClear />
          <FilterChip label="Тбилиси ▾" />
          <FilterChip label="Цена ▾" />
          <FilterChip label="По дате ▾" />
        </ScrollView>

        <View className="flex-row flex-wrap px-4 pb-4" style={{ gap: 10 }}>
          {listings.map((l, i) => (
            <View key={i} style={{ width: '48%' as any }}>
              <ListingCard {...l} />
            </View>
          ))}
        </View>
      </View>
    </StateSection>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// STATE 3: Empty — No Results
// ═══════════════════════════════════════════════════════════════════════════════
function EmptyResults() {
  return (
    <StateSection title="LISTINGS_FEED_EMPTY">
      <View className="bg-[#F5F5F5] rounded-lg overflow-hidden" style={{ width: 390 }}>
        <View className="bg-white px-4 py-3 border-b border-[#E0E0E0]">
          <Text className="text-lg font-bold text-[#1A1A1A]">Объявления (0)</Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 12, gap: 8 }}>
          <FilterChip label="Электроника ×" active onClear />
          <FilterChip label="Рустави ▾" />
          <FilterChip label="до ₾500 ×" active onClear />
        </ScrollView>

        <View className="items-center py-12 px-6">
          <Text style={{ fontSize: 48 }}>🏠</Text>
          <Text className="text-lg font-bold text-[#1A1A1A] mt-4 mb-2">Нет объявлений по вашему запросу</Text>
          <Text className="text-sm text-[#737373] text-center mb-5">Попробуйте изменить фильтры или расширить область поиска</Text>
          <Pressable className="bg-[#00AA6C] rounded-md px-6 py-3">
            <Text className="text-white font-bold text-[15px]">Сбросить фильтры</Text>
          </Pressable>
        </View>
      </View>
    </StateSection>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN EXPORT
// ═══════════════════════════════════════════════════════════════════════════════
export default function ListingsFeedStates() {
  return (
    <View style={{ gap: 32 }}>
      <DefaultFeed />
      <FilteredRealEstate />
      <EmptyResults />
    </View>
  );
}
