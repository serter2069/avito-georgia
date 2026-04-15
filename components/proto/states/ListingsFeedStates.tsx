import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, useWindowDimensions } from 'react-native';
import { StateSection } from '../StateSection';
import BottomNav from '../BottomNav';

// ─── Design Tokens ───────────────────────────────────────────────────────────
const C = { green: '#00AA6C', greenBg: '#E8F9F2', white: '#FFFFFF', text: '#1A1A1A', muted: '#9E9E9E', border: '#E8E8E8' };
const IMG_COLORS = ['#C8E6C9', '#B2DFDB', '#BBDEFB', '#D7CCC8', '#F8BBD0', '#E1BEE7', '#FFF9C4', '#FFCCBC'];

// ─── Column count by screen width ────────────────────────────────────────────
function useColumns() {
  const { width } = useWindowDimensions();
  if (width >= 1024) return 4;
  if (width >= 640) return 3;
  return 2;
}

function useLayout() {
  const { width } = useWindowDimensions();
  return { width, isMobile: width < 640, isTablet: width >= 640 && width < 1024, isDesktop: width >= 1024 };
}

// ─── Listing Card ─────────────────────────────────────────────────────────────
function ListingCard({ title, price, location, colorIndex = 0, id }: {
  title: string; price: string; location: string; colorIndex?: number; id: number;
}) {
  const [fav, setFav] = useState(false);
  return (
    <View style={{ backgroundColor: C.white, borderRadius: 8, overflow: 'hidden', borderWidth: 1, borderColor: C.border }}>
      <View style={{ position: 'relative' }}>
        <View style={{ height: 120, backgroundColor: IMG_COLORS[colorIndex % IMG_COLORS.length], width: '100%' }} />
        <Pressable
          onPress={() => setFav(!fav)}
          style={{ position: 'absolute', top: 8, right: 8, width: 28, height: 28, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.9)', alignItems: 'center', justifyContent: 'center' }}
        >
          <Text style={{ fontSize: 14, color: fav ? '#E53935' : '#9E9E9E' }}>{fav ? '♥' : '♡'}</Text>
        </Pressable>
        <View style={{ position: 'absolute', bottom: 6, right: 6, backgroundColor: 'rgba(0,0,0,0.55)', borderRadius: 4, paddingHorizontal: 5, paddingVertical: 2 }}>
          <Text style={{ color: '#fff', fontSize: 10, fontWeight: '600' }}>5 фото</Text>
        </View>
      </View>
      <View style={{ padding: 10 }}>
        <Text style={{ fontSize: 13, fontWeight: '500', color: C.text }} numberOfLines={2}>{title}</Text>
        <Text style={{ fontSize: 15, fontWeight: '700', color: C.text, marginTop: 4 }}>{price}</Text>
        <Text style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>{location}</Text>
      </View>
    </View>
  );
}

// ─── Category Chip ────────────────────────────────────────────────────────────
function CategoryChip({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20,
        backgroundColor: active ? C.green : C.white,
        borderWidth: 1, borderColor: active ? C.green : C.border,
      }}
    >
      <Text style={{ fontSize: 13, fontWeight: '500', color: active ? C.white : C.text }}>{label}</Text>
    </Pressable>
  );
}

// ─── Sort Button ──────────────────────────────────────────────────────────────
function SortButton({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6,
        backgroundColor: active ? C.greenBg : 'transparent',
        borderWidth: 1, borderColor: active ? C.green : C.border,
      }}
    >
      <Text style={{ fontSize: 13, fontWeight: active ? '600' : '400', color: active ? C.green : C.text }}>{label}</Text>
    </Pressable>
  );
}

const CATEGORIES = ['Все', 'Недвижимость', 'Авто', 'Электроника', 'Одежда', 'Мебель', 'Работа'];

const LISTINGS = [
  { id: 1, title: '3-комнатная квартира, вид на море', price: '₾125 000', location: 'Батуми' },
  { id: 2, title: 'Toyota Camry 2019, 45 000 км', price: '₾32 000', location: 'Тбилиси' },
  { id: 3, title: 'iPhone 15 Pro Max 256GB', price: '₾2 800', location: 'Тбилиси' },
  { id: 4, title: 'Студия 35м², новый ремонт', price: '₾58 000', location: 'Батуми' },
  { id: 5, title: 'BMW X5 2020, автомат, полный', price: '₾78 000', location: 'Тбилиси' },
  { id: 6, title: 'Samsung Galaxy S24 Ultra', price: '₾2 100', location: 'Кутаиси' },
  { id: 7, title: 'MacBook Pro 14" M3, 16GB', price: '₾3 900', location: 'Тбилиси' },
  { id: 8, title: 'Диван угловой, серый, новый', price: '₾1 400', location: 'Рустави' },
];

// ─── Interactive Feed ─────────────────────────────────────────────────────────
function InteractiveFeed() {
  const [selectedCategory, setSelectedCategory] = useState('Все');
  const [sortOrder, setSortOrder] = useState<'date' | 'price'>('date');
  const columns = useColumns();
  const { width, isMobile, isDesktop } = useLayout();

  // Column width calculation
  const horizontalPadding = isDesktop ? 24 : 16;
  const gap = 10;
  const availableWidth = width - horizontalPadding * 2 - gap * (columns - 1);
  const colWidth = availableWidth / columns;

  return (
    <View style={{ flex: 1, backgroundColor: '#F5F5F5' }}>
      {/* Header */}
      {isMobile ? (
        <View style={{ backgroundColor: C.white, borderBottomWidth: 1, borderBottomColor: C.border }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 12, paddingBottom: 8 }}>
            <Text style={{ fontSize: 18, fontWeight: '800', color: C.green }}>Avito GE</Text>
            <Text style={{ fontSize: 22, color: C.text }}>☰</Text>
          </View>
          <View style={{ marginHorizontal: 16, marginBottom: 12, flexDirection: 'row', alignItems: 'center', backgroundColor: '#F5F5F5', borderRadius: 8, borderWidth: 1, borderColor: C.border, paddingHorizontal: 12, paddingVertical: 8 }}>
            <Text style={{ fontSize: 14, color: C.muted, flex: 1 }}>Поиск по объявлениям...</Text>
            <Text style={{ fontSize: 14, color: C.muted }}>🔍</Text>
          </View>
        </View>
      ) : (
        <View style={{ backgroundColor: C.white, borderBottomWidth: 1, borderBottomColor: C.border, paddingHorizontal: horizontalPadding, paddingVertical: 14 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16, maxWidth: isDesktop ? 1200 : undefined, alignSelf: isDesktop ? 'center' : undefined, width: '100%' }}>
            <Text style={{ fontSize: 20, fontWeight: '800', color: C.green, minWidth: 90 }}>Avito GE</Text>
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#F5F5F5', borderRadius: 8, borderWidth: 1, borderColor: C.border, paddingHorizontal: 14, paddingVertical: 9 }}>
              <Text style={{ fontSize: 14, color: C.muted, flex: 1 }}>Поиск по объявлениям...</Text>
              <Text style={{ fontSize: 14, color: C.muted }}>🔍</Text>
            </View>
            <Pressable style={{ backgroundColor: C.green, borderRadius: 8, paddingHorizontal: 18, paddingVertical: 9 }}>
              <Text style={{ color: C.white, fontWeight: '600', fontSize: 14 }}>Найти</Text>
            </Pressable>
          </View>
        </View>
      )}

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: isMobile ? 80 : 32 }}>
        <View style={isDesktop ? { maxWidth: 1200, alignSelf: 'center', width: '100%', paddingHorizontal: horizontalPadding } : {}}>
          {/* Category chips */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: isDesktop ? 0 : 16, paddingVertical: 12, gap: 8 }}
          >
            {CATEGORIES.map(cat => (
              <CategoryChip
                key={cat}
                label={cat}
                active={selectedCategory === cat}
                onPress={() => setSelectedCategory(cat)}
              />
            ))}
          </ScrollView>

          {/* Sort + count row */}
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: isDesktop ? 0 : 16, marginBottom: 12 }}>
            <Text style={{ fontSize: 13, color: C.muted }}>143 объявления</Text>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <SortButton label="По дате" active={sortOrder === 'date'} onPress={() => setSortOrder('date')} />
              <SortButton label="По цене" active={sortOrder === 'price'} onPress={() => setSortOrder('price')} />
            </View>
          </View>

          {/* Listings grid */}
          <View style={{ paddingHorizontal: isDesktop ? 0 : 16 }}>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap }}>
              {LISTINGS.map((item, i) => (
                <View key={item.id} style={{ width: colWidth }}>
                  <ListingCard {...item} colorIndex={i} />
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      {isMobile && <BottomNav />}
    </View>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN EXPORT
// ═══════════════════════════════════════════════════════════════════════════════
export default function ListingsFeedStates() {
  return (
    <View style={{ gap: 32 }}>
      <StateSection title="LISTINGS_FEED_INTERACTIVE">
        <InteractiveFeed />
      </StateSection>
    </View>
  );
}
