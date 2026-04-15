import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, Pressable, Image, useWindowDimensions } from 'react-native';
import { StateSection } from '../StateSection';
import BottomNav from '../BottomNav';
import ProtoImage from '../ProtoPlaceholderImage';

const C = {
  green: '#00AA6C', greenBg: '#E8F9F2',
  white: '#FFFFFF',
  text: '#1A1A1A', muted: '#9E9E9E', border: '#E8E8E8',
};

// ─── SVG icon helpers ────────────────────────────────────────────────────────
function si(svg: string) {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
function icon(path: string, color: string, fill = false) {
  return si(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${fill ? color : 'none'}" stroke="${fill ? 'none' : color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${path}</svg>`
  );
}
function iconW(path: string, fill = false) {
  return icon(path, '#fff', fill);
}

// ─── Category definitions ────────────────────────────────────────────────────
const CATEGORIES = [
  {
    id: 'all', label: 'Все', bg: '#E8F9F2', color: '#00AA6C',
    svg: icon('<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>', '#00AA6C', true),
    svgW: iconW('<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>', true),
  },
  {
    id: 'auto', label: 'Авто', bg: '#E3F2FD', color: '#1976D2',
    svg: icon('<path d="M5 11 7 6h10l2 5H5z"/><rect x="2" y="11" width="20" height="6" rx="1.5"/><circle cx="7" cy="19" r="2"/><circle cx="17" cy="19" r="2"/><line x1="7" y1="11" x2="7" y2="17"/><line x1="17" y1="11" x2="17" y2="17"/>', '#1976D2'),
    svgW: iconW('<path d="M5 11 7 6h10l2 5H5z"/><rect x="2" y="11" width="20" height="6" rx="1.5"/><circle cx="7" cy="19" r="2"/><circle cx="17" cy="19" r="2"/>'),
  },
  {
    id: 'realty', label: 'Жильё', bg: '#E8F5E9', color: '#388E3C',
    svg: icon('<path d="M3 12 12 3l9 9"/><path d="M5 10v10h5v-5h4v5h5V10"/>', '#388E3C'),
    svgW: iconW('<path d="M3 12 12 3l9 9"/><path d="M5 10v10h5v-5h4v5h5V10"/>'),
  },
  {
    id: 'tech', label: 'Техника', bg: '#EDE7F6', color: '#7B1FA2',
    svg: icon('<rect x="7" y="2" width="10" height="20" rx="2"/><line x1="10" y1="7" x2="14" y2="7"/><circle cx="12" cy="17" r="1" fill="#7B1FA2" stroke="none"/>', '#7B1FA2'),
    svgW: iconW('<rect x="7" y="2" width="10" height="20" rx="2"/><line x1="10" y1="7" x2="14" y2="7"/><circle cx="12" cy="17" r="1" fill="#fff" stroke="none"/>'),
  },
  {
    id: 'clothes', label: 'Одежда', bg: '#FCE4EC', color: '#C2185B',
    svg: icon('<path d="M20 8 16 4l-3 3a1 1 0 01-2 0L8 4 4 8l3 3v9h10V11z"/>', '#C2185B'),
    svgW: iconW('<path d="M20 8 16 4l-3 3a1 1 0 01-2 0L8 4 4 8l3 3v9h10V11z"/>'),
  },
  {
    id: 'home', label: 'Дом', bg: '#FFF3E0', color: '#E65100',
    svg: icon('<rect x="3" y="10" width="18" height="8" rx="2"/><rect x="7" y="7" width="10" height="5" rx="1"/><line x1="7" y1="18" x2="7" y2="21"/><line x1="17" y1="18" x2="17" y2="21"/>', '#E65100'),
    svgW: iconW('<rect x="3" y="10" width="18" height="8" rx="2"/><rect x="7" y="7" width="10" height="5" rx="1"/><line x1="7" y1="18" x2="7" y2="21"/><line x1="17" y1="18" x2="17" y2="21"/>'),
  },
  {
    id: 'jobs', label: 'Работа', bg: '#F3E5F5', color: '#6A1B9A',
    svg: icon('<rect x="2" y="8" width="20" height="13" rx="2"/><path d="M8 8V6a2 2 0 014 0v2"/><line x1="2" y1="13" x2="22" y2="13"/>', '#6A1B9A'),
    svgW: iconW('<rect x="2" y="8" width="20" height="13" rx="2"/><path d="M8 8V6a2 2 0 014 0v2"/><line x1="2" y1="13" x2="22" y2="13"/>'),
  },
  {
    id: 'services', label: 'Услуги', bg: '#E0F2F1', color: '#00695C',
    svg: icon('<circle cx="12" cy="12" r="3"/><path d="M12 1v4m0 14v4M4.22 4.22l2.83 2.83m9.9 9.9 2.83 2.83M1 12h4m14 0h4M4.22 19.78l2.83-2.83m9.9-9.9 2.83-2.83"/>', '#00695C'),
    svgW: iconW('<circle cx="12" cy="12" r="3"/><path d="M12 1v4m0 14v4M4.22 4.22l2.83 2.83m9.9 9.9 2.83 2.83M1 12h4m14 0h4M4.22 19.78l2.83-2.83m9.9-9.9 2.83-2.83"/>'),
  },
  {
    id: 'animals', label: 'Животные', bg: '#FFF8E1', color: '#F57F17',
    svg: si('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="7" cy="5" r="2" fill="#F57F17"/><circle cx="17" cy="5" r="2" fill="#F57F17"/><circle cx="4" cy="11" r="2" fill="#F57F17"/><circle cx="20" cy="11" r="2" fill="#F57F17"/><path d="M12 22c-3.3 0-6-2.2-6-5 0-1.8 1.5-3.2 3.5-3.8L12 12l2.5.7c2 .6 3.5 2 3.5 3.8 0 2.8-2.7 5-6 5z" fill="#F57F17"/></svg>'),
    svgW: si('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="7" cy="5" r="2" fill="#fff"/><circle cx="17" cy="5" r="2" fill="#fff"/><circle cx="4" cy="11" r="2" fill="#fff"/><circle cx="20" cy="11" r="2" fill="#fff"/><path d="M12 22c-3.3 0-6-2.2-6-5 0-1.8 1.5-3.2 3.5-3.8L12 12l2.5.7c2 .6 3.5 2 3.5 3.8 0 2.8-2.7 5-6 5z" fill="#fff"/></svg>'),
  },
];

const CITIES = ['Все города', 'Тбилиси', 'Батуми', 'Кутаиси', 'Рустави', 'Гори', 'Зугдиди'];

const LISTINGS = [
  { title: '2-комн. квартира, центр Тбилиси', price: '₾95 000', loc: 'Тбилиси', age: '2ч', badge: 'Premium', cat: 'realty' },
  { title: 'Toyota Prius 2018, 60 000 км', price: '₾28 500', loc: 'Батуми', age: '4ч', cat: 'auto' },
  { title: 'MacBook Pro 14" M2, 512 GB', price: '₾3 200', loc: 'Тбилиси', age: '1ч', cat: 'tech' },
  { title: 'Диван угловой, бежевый, новый', price: '₾850', loc: 'Кутаиси', age: '6ч', cat: 'home' },
  { title: 'Куртка зимняя Columbia, р.48', price: '₾120', loc: 'Тбилиси', age: '3ч', cat: 'clothes' },
  { title: 'Офис 45 кв.м, аренда, Saburtalo', price: '₾1 400/мес', loc: 'Тбилиси', age: '5ч', badge: 'Premium', cat: 'realty' },
  { title: 'Honda Civic 2020, 38 000 км', price: '₾22 000', loc: 'Батуми', age: '8ч', cat: 'auto' },
  { title: 'iPhone 14 Pro, 256 GB, черный', price: '₾2 800', loc: 'Тбилиси', age: '30мин', cat: 'tech' },
  { title: 'Репетитор английского, Zoom', price: '₾25/ч', loc: 'Тбилиси', age: '1ч', cat: 'services' },
  { title: 'Студия 30 кв.м, аренда, море', price: '₾750/мес', loc: 'Батуми', age: '3ч', cat: 'realty' },
  { title: 'Samsung Galaxy S23, 256 GB', price: '₾1 850', loc: 'Рустави', age: '2ч', cat: 'tech' },
  { title: 'Кресло офисное, Herman Miller', price: '₾420', loc: 'Тбилиси', age: '5ч', cat: 'home' },
];

// ─── Search icon (drawn with Views) ─────────────────────────────────────────
function SearchIcon({ color = C.muted }: { color?: string }) {
  return (
    <View style={{ width: 17, height: 17, flexShrink: 0 }}>
      <View style={{ position: 'absolute', top: 0, left: 0, width: 12, height: 12, borderRadius: 6, borderWidth: 2, borderColor: color }} />
      <View style={{ position: 'absolute', bottom: 0, right: 0, width: 2, height: 8, backgroundColor: color, borderRadius: 1, transform: [{ rotate: '-45deg' }, { translateX: 1 }, { translateY: -1 }] }} />
    </View>
  );
}

// ─── Listing card ────────────────────────────────────────────────────────────
function ListingCard({ title, price, loc, age, badge, colorIdx }: {
  title: string; price: string; loc: string; age: string; badge?: string; colorIdx: number;
}) {
  const [fav, setFav] = useState(false);
  return (
    <View style={{ borderRadius: 10, overflow: 'hidden', borderWidth: 1, borderColor: C.border, backgroundColor: C.white }}>
      <View style={{ position: 'relative' }}>
        <ProtoImage seed={colorIdx + 10} width="100%" height={130} />
        {badge && (
          <View style={{ position: 'absolute', top: 8, left: 8, backgroundColor: C.greenBg, borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2 }}>
            <Text style={{ fontSize: 10, fontWeight: '700', color: C.green }}>{badge}</Text>
          </View>
        )}
        <Pressable onPress={() => setFav(!fav)} style={{ position: 'absolute', top: 8, right: 8, width: 28, height: 28, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.9)', alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 14, color: fav ? '#E53935' : C.muted }}>{fav ? '♥' : '♡'}</Text>
        </Pressable>
        <View style={{ position: 'absolute', bottom: 6, right: 6, backgroundColor: 'rgba(0,0,0,0.52)', borderRadius: 4, paddingHorizontal: 5, paddingVertical: 2 }}>
          <Text style={{ color: '#fff', fontSize: 10, fontWeight: '600' }}>5 фото</Text>
        </View>
      </View>
      <View style={{ padding: 10 }}>
        <Text style={{ fontSize: 13, color: C.text, lineHeight: 18 }} numberOfLines={2}>{title}</Text>
        <Text style={{ fontSize: 15, fontWeight: '700', color: C.text, marginTop: 4 }}>{price}</Text>
        <Text style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>{loc} · {age}</Text>
      </View>
    </View>
  );
}

// ─── Main content ────────────────────────────────────────────────────────────
function HomepageContent({ loggedIn }: { loggedIn?: boolean }) {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;
  const isTablet = width >= 640;
  const cols = isDesktop ? 4 : isTablet ? 3 : 2;
  const hPad = isDesktop ? 32 : 16;
  const maxW = isDesktop ? 1280 : undefined;

  const [city, setCity] = useState('Все города');
  const [category, setCategory] = useState('all');
  const [query, setQuery] = useState('');
  const [priceFrom, setPriceFrom] = useState('');
  const [priceTo, setPriceTo] = useState('');
  const [sort, setSort] = useState<'date' | 'price'>('date');

  const filtered = LISTINGS.filter(l => {
    const matchCat = category === 'all' || l.cat === category;
    const matchCity = city === 'Все города' || l.loc === city;
    const matchQ = !query || l.title.toLowerCase().includes(query.toLowerCase());
    return matchCat && matchCity && matchQ;
  });

  const wrap = (children: React.ReactNode) =>
    isDesktop
      ? <View style={{ maxWidth: maxW as any, alignSelf: 'center', width: '100%', paddingHorizontal: hPad }}>{children}</View>
      : <>{children}</>;

  return (
    <View style={{ backgroundColor: C.white }}>

      {/* ─── Header ──────────────────────────────────────────────────────────── */}
      <View style={{ backgroundColor: C.white, borderBottomWidth: 1, borderBottomColor: C.border }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: hPad, paddingVertical: 10, maxWidth: maxW, alignSelf: isDesktop ? 'center' : undefined, width: '100%' }}>
          {/* Logo */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, flexShrink: 0 }}>
            <View style={{ width: 30, height: 30, backgroundColor: C.green, borderRadius: 7, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ color: '#fff', fontWeight: '800', fontSize: 17 }}>A</Text>
            </View>
            {isTablet && (
              <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                <Text style={{ fontWeight: '700', fontSize: 17, color: C.text }}>avito</Text>
                <Text style={{ fontWeight: '600', fontSize: 12, color: C.green }}>.ge</Text>
              </View>
            )}
          </View>

          {/* Search */}
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderColor: C.green, borderRadius: 9, backgroundColor: C.white, paddingHorizontal: 10, paddingVertical: isTablet ? 8 : 10, gap: 8 }}>
            <SearchIcon />
            <TextInput
              style={{ flex: 1, fontSize: 14, color: C.text, borderWidth: 0, backgroundColor: 'transparent', outlineWidth: 0, paddingVertical: 0 }}
              placeholder="Что ищете?"
              placeholderTextColor={C.muted}
              value={query}
              onChangeText={setQuery}
            />
            {query.length > 0 && (
              <Pressable onPress={() => setQuery('')}>
                <Text style={{ color: C.muted, fontSize: 18, lineHeight: 18 }}>×</Text>
              </Pressable>
            )}
          </View>

          {/* Right */}
          {loggedIn ? (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flexShrink: 0 }}>
              {isTablet && (
                <Pressable style={{ backgroundColor: C.green, borderRadius: 7, paddingHorizontal: 12, paddingVertical: 7 }}>
                  <Text style={{ color: '#fff', fontWeight: '700', fontSize: 13 }}>+ Подать</Text>
                </Pressable>
              )}
              <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: C.green, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ color: '#fff', fontWeight: '700', fontSize: 14 }}>Г</Text>
              </View>
            </View>
          ) : (
            <Pressable style={{ backgroundColor: C.green, borderRadius: 7, paddingHorizontal: 12, paddingVertical: 7, flexShrink: 0 }}>
              <Text style={{ color: '#fff', fontWeight: '700', fontSize: 13 }}>Войти</Text>
            </Pressable>
          )}
        </View>
      </View>

      {/* ─── City pills ──────────────────────────────────────────────────────── */}
      <View style={{ borderBottomWidth: 1, borderBottomColor: C.border }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: hPad, paddingVertical: 9, gap: 7 }}>
          {CITIES.map((c) => (
            <Pressable
              key={c}
              onPress={() => setCity(c)}
              style={{ borderRadius: 20, paddingHorizontal: 13, paddingVertical: 5, backgroundColor: city === c ? C.green : C.white, borderWidth: 1, borderColor: city === c ? C.green : C.border }}
            >
              <Text style={{ fontSize: 13, fontWeight: city === c ? '600' : '400', color: city === c ? '#fff' : C.text }}>{c}</Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {/* ─── Category icons ───────────────────────────────────────────────────── */}
      <View style={{ borderBottomWidth: 1, borderBottomColor: C.border }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: hPad, paddingVertical: 10, gap: 10 }}>
          {CATEGORIES.map((cat) => {
            const active = category === cat.id;
            return (
              <Pressable key={cat.id} onPress={() => setCategory(cat.id)} style={{ alignItems: 'center', gap: 5, minWidth: 52 }}>
                <View style={{ width: 48, height: 48, borderRadius: 13, backgroundColor: active ? cat.color : cat.bg, alignItems: 'center', justifyContent: 'center', borderWidth: active ? 0 : 1, borderColor: C.border }}>
                  <Image source={{ uri: active ? cat.svgW : cat.svg }} style={{ width: 22, height: 22 }} resizeMode="contain" />
                </View>
                <Text style={{ fontSize: 10, color: active ? cat.color : C.muted, fontWeight: active ? '700' : '400', textAlign: 'center' }} numberOfLines={1}>
                  {cat.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* ─── Inline filters ───────────────────────────────────────────────────── */}
      <View style={{ borderBottomWidth: 1, borderBottomColor: C.border, paddingHorizontal: hPad, paddingVertical: 10 }}>
        <View style={{ flexDirection: isTablet ? 'row' : 'column', gap: 10, alignItems: isTablet ? 'center' : 'stretch', maxWidth: maxW, alignSelf: isDesktop ? 'center' : undefined, width: '100%' }}>

          {/* Price range */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flex: isTablet ? 0 : undefined }}>
            <Text style={{ fontSize: 13, color: C.muted, flexShrink: 0 }}>Цена ₾</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: C.border, borderRadius: 7, paddingHorizontal: 8, paddingVertical: 5, minWidth: 70 }}>
              <TextInput
                style={{ fontSize: 13, color: C.text, width: 55, borderWidth: 0, outlineWidth: 0, backgroundColor: 'transparent', paddingVertical: 0 }}
                placeholder="от"
                placeholderTextColor={C.muted}
                value={priceFrom}
                onChangeText={setPriceFrom}
                keyboardType="numeric"
              />
            </View>
            <Text style={{ color: C.muted, fontSize: 13 }}>—</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: C.border, borderRadius: 7, paddingHorizontal: 8, paddingVertical: 5, minWidth: 70 }}>
              <TextInput
                style={{ fontSize: 13, color: C.text, width: 55, borderWidth: 0, outlineWidth: 0, backgroundColor: 'transparent', paddingVertical: 0 }}
                placeholder="до"
                placeholderTextColor={C.muted}
                value={priceTo}
                onChangeText={setPriceTo}
                keyboardType="numeric"
              />
            </View>
          </View>

          {/* Spacer */}
          {isTablet && <View style={{ flex: 1 }} />}

          {/* Count + sort */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Text style={{ fontSize: 13, color: C.muted, marginRight: 4 }}>{filtered.length} объявлений</Text>
            <Pressable
              onPress={() => setSort('date')}
              style={{ paddingHorizontal: 10, paddingVertical: 5, borderRadius: 6, borderWidth: 1, borderColor: sort === 'date' ? C.green : C.border, backgroundColor: sort === 'date' ? C.greenBg : C.white }}
            >
              <Text style={{ fontSize: 12, fontWeight: sort === 'date' ? '600' : '400', color: sort === 'date' ? C.green : C.text }}>По дате</Text>
            </Pressable>
            <Pressable
              onPress={() => setSort('price')}
              style={{ paddingHorizontal: 10, paddingVertical: 5, borderRadius: 6, borderWidth: 1, borderColor: sort === 'price' ? C.green : C.border, backgroundColor: sort === 'price' ? C.greenBg : C.white }}
            >
              <Text style={{ fontSize: 12, fontWeight: sort === 'price' ? '600' : '400', color: sort === 'price' ? C.green : C.text }}>По цене</Text>
            </Pressable>
          </View>
        </View>
      </View>

      {/* ─── Listings grid ────────────────────────────────────────────────────── */}
      <View style={{ paddingHorizontal: hPad, paddingTop: 14, paddingBottom: 20 }}>
        {wrap(
          filtered.length === 0 ? (
            <View style={{ alignItems: 'center', paddingVertical: 40 }}>
              <Text style={{ fontSize: 15, color: C.muted }}>Ничего не найдено</Text>
            </View>
          ) : (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
              {filtered.map((l, i) => (
                <View key={i} style={{ width: `${(100 / cols) - (cols === 2 ? 2 : cols === 3 ? 1.5 : 1)}%` as any }}>
                  <ListingCard {...l} colorIdx={i} />
                </View>
              ))}
            </View>
          )
        )}
      </View>

      {!isTablet && <BottomNav active="home" />}
    </View>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
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
