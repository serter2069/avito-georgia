import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, Pressable, useWindowDimensions } from 'react-native';
import { StateSection } from '../StateSection';
import BottomNav from '../BottomNav';
import ProtoImage from '../ProtoPlaceholderImage';

const C = {
  green: '#00AA6C', greenBg: '#E8F9F2',
  white: '#FFFFFF', page: '#F7F7F7',
  text: '#1A1A1A', muted: '#9E9E9E', border: '#E8E8E8',
};

const IMG_COLORS = ['#C8E6C9', '#B2DFDB', '#BBDEFB', '#D7CCC8', '#F8BBD0', '#E1BEE7', '#FFF9C4', '#FFCCBC'];

const CATEGORIES = [
  { id: 'all',      label: 'Все',      bg: '#E8F9F2', color: '#00AA6C', sym: '◈' },
  { id: 'auto',     label: 'Авто',     bg: '#E3F2FD', color: '#1976D2', sym: '◉' },
  { id: 'realty',   label: 'Жильё',    bg: '#E8F5E9', color: '#388E3C', sym: '▣' },
  { id: 'tech',     label: 'Техника',  bg: '#EDE7F6', color: '#7B1FA2', sym: '◆' },
  { id: 'clothes',  label: 'Одежда',   bg: '#FCE4EC', color: '#C2185B', sym: '◇' },
  { id: 'home',     label: 'Дом',      bg: '#FFF3E0', color: '#E65100', sym: '◻' },
  { id: 'jobs',     label: 'Работа',   bg: '#F3E5F5', color: '#6A1B9A', sym: '▤' },
  { id: 'services', label: 'Услуги',   bg: '#E0F2F1', color: '#00695C', sym: '▧' },
  { id: 'animals',  label: 'Животные', bg: '#FFF8E1', color: '#F57F17', sym: '▩' },
];

const CITIES = ['Все города', 'Тбилиси', 'Батуми', 'Кутаиси', 'Рустави', 'Гори', 'Зугдиди'];

const LISTINGS = [
  { title: '2-комн. квартира, центр', price: '₾95 000', loc: 'Тбилиси', age: '2ч', badge: 'Premium', cat: 'realty' },
  { title: 'Toyota Prius 2018, 60 000 км', price: '₾28 500', loc: 'Батуми', age: '4ч', cat: 'auto' },
  { title: 'MacBook Pro 14" M2, 512 GB', price: '₾3 200', loc: 'Тбилиси', age: '1ч', cat: 'tech' },
  { title: 'Диван угловой, бежевый', price: '₾850', loc: 'Кутаиси', age: '6ч', cat: 'home' },
  { title: 'Куртка зимняя, р.48', price: '₾120', loc: 'Тбилиси', age: '3ч', cat: 'clothes' },
  { title: 'Офис 45 кв.м, аренда', price: '₾1 400/мес', loc: 'Тбилиси', age: '5ч', badge: 'Premium', cat: 'realty' },
  { title: 'Honda Civic 2020', price: '₾22 000', loc: 'Батуми', age: '8ч', cat: 'auto' },
  { title: 'iPhone 14 Pro, 256 GB', price: '₾2 800', loc: 'Тбилиси', age: '30мин', cat: 'tech' },
  { title: 'Велосипед горный, Trek', price: '₾680', loc: 'Тбилиси', age: '1ч', cat: 'services' },
  { title: 'Студия 30 кв.м, аренда', price: '₾750/мес', loc: 'Батуми', age: '3ч', cat: 'realty' },
  { title: 'Samsung Galaxy S23', price: '₾1 850', loc: 'Рустави', age: '2ч', cat: 'tech' },
  { title: 'Кресло офисное, Herman', price: '₾420', loc: 'Тбилиси', age: '5ч', cat: 'home' },
];

function ListingCard({ title, price, loc, age, badge, colorIdx }: {
  title: string; price: string; loc: string; age: string; badge?: string; colorIdx: number;
}) {
  const [fav, setFav] = useState(false);
  return (
    <View style={{ borderRadius: 10, overflow: 'hidden', borderWidth: 1, borderColor: C.border, backgroundColor: C.white }}>
      <View style={{ height: 130, position: 'relative' }}>
        <ProtoImage seed={colorIdx + 10} width="100%" height={130} />
        {badge && (
          <View style={{ position: 'absolute', top: 8, left: 8, backgroundColor: C.greenBg, borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2 }}>
            <Text style={{ fontSize: 10, fontWeight: '700', color: C.green }}>{badge}</Text>
          </View>
        )}
        <Pressable onPress={() => setFav(!fav)} style={{ position: 'absolute', top: 8, right: 8, width: 28, height: 28, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.9)', alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 14, color: fav ? '#E53935' : C.muted }}>{fav ? '♥' : '♡'}</Text>
        </Pressable>
      </View>
      <View style={{ padding: 10 }}>
        <Text style={{ fontSize: 13, color: C.text, lineHeight: 18 }} numberOfLines={2}>{title}</Text>
        <Text style={{ fontSize: 15, fontWeight: '700', color: C.text, marginTop: 4 }}>{price}</Text>
        <Text style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>{loc} · {age}</Text>
      </View>
    </View>
  );
}

function HomepageContent({ loggedIn }: { loggedIn?: boolean }) {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;
  const isTablet = width >= 640;
  const cols = isDesktop ? 4 : isTablet ? 3 : 2;
  const hPad = isDesktop ? 32 : 16;

  const [city, setCity] = useState('Все города');
  const [category, setCategory] = useState('all');
  const [query, setQuery] = useState('');

  const filtered = LISTINGS.filter(l => {
    const matchCat = category === 'all' || l.cat === category;
    const matchCity = city === 'Все города' || l.loc === city;
    const matchQ = !query || l.title.toLowerCase().includes(query.toLowerCase());
    return matchCat && matchCity && matchQ;
  });

  return (
    <View style={{ backgroundColor: C.white }}>
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: C.white, paddingHorizontal: hPad, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: C.border }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <View style={{ width: 32, height: 32, backgroundColor: C.green, borderRadius: 8, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: '#fff', fontWeight: '800', fontSize: 18 }}>A</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 1 }}>
            <Text style={{ fontWeight: '700', fontSize: 18, color: C.text }}>avito</Text>
            <Text style={{ fontWeight: '600', fontSize: 13, color: C.green }}>.ge</Text>
          </View>
        </View>

        {/* Search bar in header on desktop */}
        {isTablet && (
          <View style={{ flex: 1, marginHorizontal: 24, flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderColor: C.green, borderRadius: 10, backgroundColor: C.white, paddingHorizontal: 12, gap: 8 }}>
            <Text style={{ fontSize: 15, color: C.muted }}>&#9906;</Text>
            <TextInput
              style={{ flex: 1, fontSize: 15, color: C.text, paddingVertical: 9, borderWidth: 0, backgroundColor: 'transparent', outlineWidth: 0 }}
              placeholder="Что ищете?"
              placeholderTextColor={C.muted}
              value={query}
              onChangeText={setQuery}
            />
            <Pressable style={{ backgroundColor: C.green, borderRadius: 7, paddingHorizontal: 14, paddingVertical: 7 }}>
              <Text style={{ color: '#fff', fontWeight: '700', fontSize: 13 }}>Найти</Text>
            </Pressable>
          </View>
        )}

        {loggedIn ? (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            {isTablet && (
              <Pressable style={{ backgroundColor: C.green, borderRadius: 8, paddingHorizontal: 16, paddingVertical: 8 }}>
                <Text style={{ color: '#fff', fontWeight: '700', fontSize: 13 }}>+ Подать</Text>
              </Pressable>
            )}
            <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: C.green, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ color: '#fff', fontWeight: '700', fontSize: 15 }}>Г</Text>
            </View>
          </View>
        ) : (
          <Pressable style={{ backgroundColor: C.green, borderRadius: 8, paddingHorizontal: 16, paddingVertical: 8 }}>
            <Text style={{ color: '#fff', fontWeight: '700', fontSize: 13 }}>Войти</Text>
          </Pressable>
        )}
      </View>

      {/* Mobile search bar */}
      {!isTablet && (
        <View style={{ paddingHorizontal: hPad, paddingTop: 12, paddingBottom: 4 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderColor: C.green, borderRadius: 10, backgroundColor: C.white, paddingHorizontal: 12, gap: 8 }}>
            <Text style={{ fontSize: 15, color: C.muted }}>&#9906;</Text>
            <TextInput
              style={{ flex: 1, fontSize: 15, color: C.text, paddingVertical: 11, borderWidth: 0, backgroundColor: 'transparent', outlineWidth: 0 }}
              placeholder="Что ищете?"
              placeholderTextColor={C.muted}
              value={query}
              onChangeText={setQuery}
            />
            <Pressable style={{ backgroundColor: C.green, borderRadius: 7, paddingHorizontal: 14, paddingVertical: 8 }}>
              <Text style={{ color: '#fff', fontWeight: '700', fontSize: 13 }}>Найти</Text>
            </Pressable>
          </View>
        </View>
      )}

      {/* City pills */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: hPad, paddingVertical: 10, gap: 8 }}>
        {CITIES.map((c) => (
          <Pressable key={c} onPress={() => setCity(c)} style={{ borderRadius: 20, paddingHorizontal: 14, paddingVertical: 7, backgroundColor: city === c ? C.green : C.white, borderWidth: 1, borderColor: city === c ? C.green : C.border }}>
            <Text style={{ fontSize: 13, fontWeight: '600', color: city === c ? '#fff' : C.text }}>{c}</Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* Category icons */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: hPad, paddingBottom: 14, gap: 14 }}>
        {CATEGORIES.map((cat) => {
          const isActive = category === cat.id;
          return (
            <Pressable key={cat.id} onPress={() => setCategory(cat.id)} style={{ alignItems: 'center', gap: 5, width: 60 }}>
              <View style={{ width: 52, height: 52, borderRadius: 14, backgroundColor: isActive ? cat.color : cat.bg, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontSize: 22, color: isActive ? '#fff' : cat.color }}>{cat.sym}</Text>
              </View>
              <Text style={{ fontSize: 10, color: isActive ? C.green : C.text, fontWeight: isActive ? '700' : '400', textAlign: 'center' }} numberOfLines={2}>{cat.label}</Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Listings */}
      <View style={{ paddingHorizontal: hPad, paddingBottom: 16 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <Text style={{ fontSize: 16, fontWeight: '700', color: C.text }}>
            {filtered.length > 0 ? `${filtered.length} объявлений` : 'Ничего не найдено'}
          </Text>
          <Pressable>
            <Text style={{ fontSize: 13, color: C.green, fontWeight: '600' }}>Фильтры</Text>
          </Pressable>
        </View>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
          {filtered.map((l, i) => (
            <View key={i} style={{ width: `${(100 / cols) - 1.5}%` as any }}>
              <ListingCard {...l} colorIdx={i} />
            </View>
          ))}
        </View>
      </View>

      {!isTablet && <BottomNav active="home" />}
    </View>
  );
}

export default function HomepageStates() {
  return (
    <View style={{ gap: 40 }}>
      <StateSection title="HOMEPAGE — Guest">
        <HomepageContent />
      </StateSection>
      <StateSection title="HOMEPAGE — Logged In">
        <HomepageContent loggedIn />
      </StateSection>
    </View>
  );
}
