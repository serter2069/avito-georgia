import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, Pressable, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StateSection } from '../StateSection';
import BottomNav from '../BottomNav';
import ProtoImage from '../ProtoPlaceholderImage';

const C = {
  green: '#00AA6C', greenBg: '#E8F9F2',
  white: '#FFFFFF',
  text: '#1A1A1A', muted: '#9E9E9E', border: '#E8E8E8',
};

// ─── Category definitions ────────────────────────────────────────────────────
const CATEGORIES: { id: string; label: string; bg: string; color: string; icon: string }[] = [
  { id: 'all',      label: 'Все',      bg: '#E8F9F2', color: '#00AA6C', icon: 'grid-outline' },
  { id: 'auto',     label: 'Авто',     bg: '#E3F2FD', color: '#1976D2', icon: 'car-outline' },
  { id: 'realty',   label: 'Жильё',    bg: '#E8F5E9', color: '#388E3C', icon: 'home-outline' },
  { id: 'tech',     label: 'Техника',  bg: '#EDE7F6', color: '#7B1FA2', icon: 'phone-portrait-outline' },
  { id: 'clothes',  label: 'Одежда',   bg: '#FCE4EC', color: '#C2185B', icon: 'shirt-outline' },
  { id: 'home',     label: 'Дом',      bg: '#FFF3E0', color: '#E65100', icon: 'bed-outline' },
  { id: 'jobs',     label: 'Работа',   bg: '#F3E5F5', color: '#6A1B9A', icon: 'briefcase-outline' },
  { id: 'services', label: 'Услуги',   bg: '#E0F2F1', color: '#00695C', icon: 'construct-outline' },
  { id: 'animals',  label: 'Животные', bg: '#FFF8E1', color: '#F57F17', icon: 'paw-outline' },
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

// ─── Custom language switcher (no native select) ─────────────────────────────
const LANGS: ('RU' | 'EN' | 'KA')[] = ['RU', 'EN', 'KA'];

function LangSelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <View style={{ position: 'relative', zIndex: 100 }}>
      <Pressable
        onPress={() => setOpen(o => !o)}
        style={{ borderWidth: 1, borderColor: C.border, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 5, flexDirection: 'row', alignItems: 'center', gap: 3, backgroundColor: C.white }}
      >
        <Text style={{ fontSize: 12, fontWeight: '600', color: '#5C5C5C' }}>{value}</Text>
        <Ionicons name={open ? 'chevron-up' : 'chevron-down'} size={10} color={C.muted} />
      </Pressable>
      {open && (
        <View style={{
          position: 'absolute', top: '100%' as any, left: 0, marginTop: 4,
          backgroundColor: C.white, borderRadius: 8, borderWidth: 1, borderColor: C.border,
          overflow: 'hidden', minWidth: 56, zIndex: 200,
          shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1, shadowRadius: 8, elevation: 8,
        }}>
          {LANGS.map(l => (
            <Pressable key={l} onPress={() => { onChange(l); setOpen(false); }}
              style={{ paddingHorizontal: 12, paddingVertical: 9, backgroundColor: value === l ? '#F5F5F5' : C.white }}>
              <Text style={{ fontSize: 12, fontWeight: value === l ? '700' : '400', color: value === l ? C.green : '#5C5C5C' }}>
                {l}
              </Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}

// ─── Main content ─────────────────────────────────────────────────────────────

function HomepageContent({ loggedIn, showHeader = true, showBottomNav = true }: { loggedIn?: boolean; showHeader?: boolean; showBottomNav?: boolean }) {
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
  const [sort, setSort] = useState<'date' | 'price_asc' | 'price_desc'>('date');
  const [lang, setLang] = useState<'RU' | 'EN' | 'KA'>('RU');

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
      {showHeader && (
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
            {!isTablet && <LangSelect value={lang} onChange={setLang} />}
          </View>

          {/* Search */}
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderColor: C.green, borderRadius: 9, backgroundColor: C.white, paddingHorizontal: 10, paddingVertical: isTablet ? 8 : 10, gap: 8 }}>
            <Ionicons name="search-outline" size={17} color={C.muted} />
            <TextInput
              style={{ flex: 1, fontSize: 14, color: C.text, borderWidth: 0, borderStyle: 'solid', backgroundColor: 'transparent', outlineWidth: 0, paddingVertical: 0 } as any}
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
              {isTablet && <LangSelect value={lang} onChange={setLang} />}
            </View>
          ) : (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flexShrink: 0 }}>
              <Pressable style={{ backgroundColor: C.green, borderRadius: 7, paddingHorizontal: 12, paddingVertical: 7 }}>
                <Text style={{ color: '#fff', fontWeight: '700', fontSize: 13 }}>Войти</Text>
              </Pressable>
              {isTablet && <LangSelect value={lang} onChange={setLang} />}
            </View>
          )}
        </View>
      </View>
      )}

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
                  <Ionicons name={cat.icon as any} size={22} color={active ? '#fff' : cat.color} />
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
                style={{ fontSize: 13, color: C.text, width: 55, borderWidth: 0, backgroundColor: 'transparent', outlineWidth: 0, paddingVertical: 0 } as any}
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
                style={{ fontSize: 13, color: C.text, width: 55, borderWidth: 0, backgroundColor: 'transparent', outlineWidth: 0, paddingVertical: 0 } as any}
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

          {/* Sort select */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            {/* Native select — works in Expo web */}
            <View style={{ borderWidth: 1, borderColor: C.border, borderRadius: 7, paddingHorizontal: 8, paddingVertical: 0, backgroundColor: C.white, flexDirection: 'row', alignItems: 'center' }}>
              {/* @ts-ignore — select is valid HTML element in RN web */}
              <select
                value={sort}
                onChange={(e: any) => setSort(e.target.value)}
                style={{
                  fontSize: 13, color: '#1A1A1A', backgroundColor: 'transparent',
                  border: 'none', outline: 'none', paddingTop: 5, paddingBottom: 5,
                  cursor: 'pointer', appearance: 'none', paddingRight: 18,
                }}
              >
                <option value="date">По дате</option>
                <option value="price_asc">Дешевле</option>
                <option value="price_desc">Дороже</option>
              </select>
              <Text style={{ fontSize: 10, color: C.muted, marginLeft: -16, pointerEvents: 'none' as any }}>▾</Text>
            </View>
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

      {showBottomNav && !isTablet && <BottomNav active="home" />}
    </View>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
export default function HomepageStates({ showHeader = true, showBottomNav = true }: { showHeader?: boolean; showBottomNav?: boolean } = {}) {
  return (
    <View style={{ gap: 40 }}>
      <StateSection title="HOMEPAGE — Guest">
        <HomepageContent showHeader={showHeader} showBottomNav={showBottomNav} />
      </StateSection>
      <StateSection title="HOMEPAGE — Logged In">
        <HomepageContent loggedIn showHeader={showHeader} showBottomNav={showBottomNav} />
      </StateSection>
    </View>
  );
}
