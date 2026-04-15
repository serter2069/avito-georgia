import React from 'react';
import { View, Text, TextInput, ScrollView, Pressable, useWindowDimensions } from 'react-native';
import { StateSection } from '../StateSection';

// ─── Design Tokens ───────────────────────────────────────────────────────────
const C = { green:'#00AA6C', greenBg:'#E8F9F2', white:'#FFFFFF', page:'#F5F5F5', text:'#1A1A1A', muted:'#737373', border:'#E0E0E0', error:'#D32F2F' };

// ─── Responsive wrapper ─────────────────────────────────────────────────────
function ResponsiveFrame({ children }: { children: React.ReactNode }) {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 640;
  return (
    <View style={isDesktop ? { width: 390, alignSelf: 'center', backgroundColor: C.white, borderRadius: 8, overflow: 'hidden', borderWidth: 1, borderColor: C.border } : { backgroundColor: C.white }}>
      {children}
    </View>
  );
}

// ─── Category chips (text only) ──────────────────────────────────────────────
const CATEGORIES = ['Авто', 'Недвижимость', 'Электроника', 'Одежда', 'Дом и сад', 'Работа', 'Услуги', 'Животные'];

const IMG_COLORS = ['#C8E6C9', '#B2DFDB', '#BBDEFB', '#D7CCC8'];

// ─── ListingCard (full-width) ────────────────────────────────────────────────
function ListingCard({ title, price, city, time, idx }: { title: string; price: string; city: string; time: string; idx: number }) {
  return (
    <View className="flex-row border-b border-[#E0E0E0] p-3" style={{ gap: 12 }}>
      <View style={{ width: 100, height: 120, borderRadius: 6, backgroundColor: IMG_COLORS[idx % 4] }} />
      <View className="flex-1 justify-center">
        <Text className="text-[15px] font-bold text-[#1A1A1A] mb-1">{price}</Text>
        <Text className="text-[13px] text-[#1A1A1A] mb-1.5" numberOfLines={2}>{title}</Text>
        <Text className="text-[11px] text-[#737373]">{city} · {time}</Text>
      </View>
    </View>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// STATE 1: Default (focused, empty query)
// ═══════════════════════════════════════════════════════════════════════════════
export function SearchDefault() {
  const recentQueries = ['квартира батуми', 'toyota camry', 'ноутбук'];

  return (
    <StateSection title="SEARCH_DEFAULT">
      <ResponsiveFrame>
        {/* Search input focused */}
        <View className="px-4 pt-4 pb-3">
          <View className="flex-row items-center border-2 border-[#00AA6C] rounded-lg bg-white px-3" style={{ gap: 8 }}>
            <TextInput
              placeholder="Поиск объявлений..."
              placeholderTextColor={C.muted}
              style={{ flex: 1, fontSize: 16, color: '#1A1A1A', paddingVertical: 12, borderWidth: 0, backgroundColor: 'transparent', outlineWidth: 0 } as any}
            />
          </View>
        </View>

        {/* Recent queries */}
        <View className="px-4 pb-3">
          <Text className="text-[13px] font-semibold text-[#737373] mb-2">Недавние запросы</Text>
          <View style={{ gap: 10 }}>
            {recentQueries.map((q) => (
              <View key={q} className="flex-row items-center" style={{ gap: 8 }}>
                <Text className="text-sm text-[#737373]">←</Text>
                <Text className="text-[15px] text-[#1A1A1A]">{q}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Category chips */}
        <View className="px-4 pb-4">
          <View className="flex-row flex-wrap" style={{ gap: 8 }}>
            {CATEGORIES.map((label) => (
              <View key={label} className="bg-[#F0F0F0] rounded-full px-3.5 py-2">
                <Text className="text-[13px] font-medium text-[#1A1A1A]">{label}</Text>
              </View>
            ))}
          </View>
        </View>
      </ResponsiveFrame>
    </StateSection>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// STATE 2: Results
// ═══════════════════════════════════════════════════════════════════════════════
function SearchResults() {
  const listings = [
    { title: '3-комн. квартира, центр Батуми, вид на море', price: '₾85 000', city: 'Батуми', time: '2ч назад' },
    { title: '2-комн. квартира, новостройка, 65м²', price: '₾52 000', city: 'Тбилиси', time: '5ч назад' },
    { title: '1-комн. квартира, евроремонт, мебель', price: '₾1 200/мес', city: 'Тбилиси', time: '8ч назад' },
    { title: 'Студия 35м², у моря, сдача 2025', price: '₾38 000', city: 'Батуми', time: '1д назад' },
  ];

  return (
    <StateSection title="SEARCH_RESULTS">
      <ResponsiveFrame>
        {/* Search bar filled */}
        <View className="px-4 pt-4 pb-3">
          <View className="flex-row items-center border border-[#E0E0E0] rounded-lg bg-white px-3" style={{ gap: 8 }}>
            <Text className="flex-1 text-base text-[#1A1A1A] py-3">квартира</Text>
            <Text className="text-[#737373] text-lg">×</Text>
          </View>
        </View>

        {/* Results count */}
        <View className="px-4 pb-2">
          <Text className="text-[13px] font-semibold text-[#737373]">Найдено 47</Text>
        </View>

        {/* Filter chips */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 12, gap: 8 }}>
          {['Город ▾', 'Цена ▾', 'Площадь ▾'].map((f) => (
            <View key={f} className="border border-[#E0E0E0] rounded-full px-3.5 py-1.5 bg-white">
              <Text className="text-[13px] text-[#1A1A1A]">{f}</Text>
            </View>
          ))}
        </ScrollView>

        {/* Listing cards */}
        {listings.map((item, idx) => (
          <ListingCard key={idx} {...item} idx={idx} />
        ))}
        <View style={{ height: 8 }} />
      </ResponsiveFrame>
    </StateSection>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// STATE 3: No Results
// ═══════════════════════════════════════════════════════════════════════════════
function SearchNoResults() {
  return (
    <StateSection title="SEARCH_NO_RESULTS">
      <ResponsiveFrame>
        {/* Search bar */}
        <View className="px-4 pt-4 pb-3">
          <View className="flex-row items-center border border-[#E0E0E0] rounded-lg bg-white px-3" style={{ gap: 8 }}>
            <Text className="flex-1 text-base text-[#1A1A1A] py-3">мотоцикл</Text>
            <Text className="text-[#737373] text-lg">×</Text>
          </View>
        </View>

        {/* Empty state */}
        <View className="items-center py-16 px-4">
          <Text className="text-lg font-bold text-[#1A1A1A] mb-2 text-center">
            Ничего не найдено по «мотоцикл»
          </Text>
          <Text className="text-[13px] text-[#737373] text-center">
            Попробуйте другой запрос
          </Text>
        </View>
      </ResponsiveFrame>
    </StateSection>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN EXPORT
// ═══════════════════════════════════════════════════════════════════════════════
export default function SearchStates() {
  return (
    <View style={{ gap: 32 }}>
      <SearchDefault />
      <SearchResults />
      <SearchNoResults />
    </View>
  );
}
