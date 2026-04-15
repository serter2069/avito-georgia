import React from 'react';
import { View, Text, TextInput, ScrollView, Pressable, useWindowDimensions } from 'react-native';
import { StateSection } from '../StateSection';

// ─── Design Tokens ───────────────────────────────────────────────────────────
const C = { green:'#00AA6C', greenBg:'#E8F9F2', white:'#FFFFFF', page:'#F5F5F5', text:'#1A1A1A', muted:'#737373', border:'#E0E0E0', error:'#D32F2F' };

// ─── Image Placeholder ───────────────────────────────────────────────────────
function ImgPlaceholder({ height = 180, color = '#C8E6C9' }: { height?: number; color?: string }) {
  return <View style={{ height, backgroundColor: color, width: '100%' }} />;
}
const IMG_COLORS = ['#C8E6C9', '#B2DFDB', '#BBDEFB', '#D7CCC8', '#F8BBD0', '#E1BEE7'];

// ─── Responsive wrapper ─────────────────────────────────────────────────────
function ResponsiveFrame({ children }: { children: React.ReactNode }) {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 640;
  return (
    <View style={isDesktop ? { width: 390, alignSelf: 'center', backgroundColor: C.white, borderRadius: 8, overflow: 'hidden' } : { backgroundColor: C.white }}>
      {children}
    </View>
  );
}

// ─── Reusable ListingCard ────────────────────────────────────────────────────
function ListingCard({ title, price, location, time, badge, colorIndex = 0 }: { title: string; price: string; location: string; time: string; badge?: string; colorIndex?: number }) {
  return (
    <View
      className="bg-white rounded-lg overflow-hidden border border-[#E0E0E0]"
      style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 4, elevation: 2 }}
    >
      <ImgPlaceholder height={120} color={IMG_COLORS[colorIndex % IMG_COLORS.length]} />
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
        <View className="w-8 h-8 bg-[#00AA6C] rounded-full items-center justify-center">
          <Text className="text-white font-bold text-sm">Г</Text>
        </View>
      ) : (
        <View className="bg-[#00AA6C] rounded-md px-4 py-2">
          <Text className="text-white font-bold text-sm">Войти</Text>
        </View>
      )}
    </View>
  );
}

// ─── Search Row ──────────────────────────────────────────────────────────────
function SearchRow() {
  return (
    <View className="flex-row items-center px-4 mt-3" style={{ gap: 8 }}>
      <View className="flex-1 bg-white border border-[#E0E0E0] rounded-lg px-3 py-3">
        <Text className="text-base text-[#737373]">Поиск объявлений...</Text>
      </View>
      <Pressable className="bg-[#00AA6C] rounded-lg px-4 py-3">
        <Text className="text-white font-bold text-sm">Найти</Text>
      </Pressable>
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
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 12, gap: 8 }}>
      {cities.map((c) => (
        <View
          key={c.name}
          className={`rounded-full px-4 py-2 ${c.active ? 'bg-[#00AA6C]' : 'bg-white border border-[#E0E0E0]'}`}
        >
          <Text className={`text-sm font-semibold ${c.active ? 'text-white' : 'text-[#1A1A1A]'}`}>{c.name}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

// ─── Categories Grid (text chips, no icons) ─────────────────────────────────
function CategoriesGrid() {
  const cats = ['Авто', 'Недвижимость', 'Электроника', 'Одежда', 'Дом и сад', 'Работа', 'Услуги', 'Животные'];
  return (
    <View className="flex-row flex-wrap px-4 mt-4" style={{ gap: 10 }}>
      {cats.map((label) => (
        <View
          key={label}
          className="bg-[#F0F0F0] rounded-full px-4 py-2.5"
          style={{ width: '47%' as any, alignItems: 'center' }}
        >
          <Text className="text-sm font-medium text-[#1A1A1A]">{label}</Text>
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
            <ListingCard {...l} colorIndex={i} />
          </View>
        ))}
      </View>
    </View>
  );
}

// ─── Skeleton placeholder ────────────────────────────────────────────────────
function SkeletonBlock({ height, width, mt }: { height: number; width?: string | number; mt?: number }) {
  return <View style={{ height, width: width || '100%', backgroundColor: '#E0E0E0', borderRadius: 6, marginTop: mt || 0 }} />;
}

// ═══════════════════════════════════════════════════════════════════════════════
// STATE 1: Guest
// ═══════════════════════════════════════════════════════════════════════════════
function GuestState() {
  return (
    <StateSection title="HOMEPAGE_GUEST">
      <ResponsiveFrame>
        <TopBar />
        <SearchRow />
        <CityPills />
        <CategoriesGrid />
        <FreshListings />
        <View style={{ height: 16 }} />
      </ResponsiveFrame>
    </StateSection>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// STATE 2: User
// ═══════════════════════════════════════════════════════════════════════════════
function UserState() {
  return (
    <StateSection title="HOMEPAGE_USER">
      <ResponsiveFrame>
        <TopBar loggedIn />
        <SearchRow />
        <CityPills />
        <CategoriesGrid />
        <FreshListings />
        <View style={{ height: 16 }} />
      </ResponsiveFrame>
    </StateSection>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// STATE 3: Loading
// ═══════════════════════════════════════════════════════════════════════════════
function LoadingState() {
  return (
    <StateSection title="HOMEPAGE_LOADING">
      <ResponsiveFrame>
        {/* TopBar skeleton */}
        <View className="flex-row items-center justify-between bg-white px-4 py-3 border-b border-[#E0E0E0]">
          <SkeletonBlock height={32} width={120} />
          <SkeletonBlock height={32} width={64} />
        </View>
        {/* Search skeleton */}
        <View className="px-4 mt-3">
          <SkeletonBlock height={44} />
        </View>
        {/* City pills skeleton */}
        <View className="flex-row px-4 mt-3" style={{ gap: 8 }}>
          <SkeletonBlock height={32} width={80} />
          <SkeletonBlock height={32} width={70} />
          <SkeletonBlock height={32} width={70} />
          <SkeletonBlock height={32} width={70} />
        </View>
        {/* Category chips skeleton */}
        <View className="flex-row flex-wrap px-4 mt-4" style={{ gap: 10 }}>
          {[1,2,3,4,5,6,7,8].map((i) => (
            <View key={i} style={{ width: '47%' as any }}>
              <SkeletonBlock height={40} />
            </View>
          ))}
        </View>
        {/* Listing skeletons */}
        <View className="px-4 mt-5">
          <SkeletonBlock height={20} width={180} />
          <View className="flex-row flex-wrap mt-3" style={{ gap: 10 }}>
            {[1,2,3,4].map((i) => (
              <View key={i} style={{ width: '48%' as any }}>
                <SkeletonBlock height={120} />
                <SkeletonBlock height={14} width={'80%'} mt={8} />
                <SkeletonBlock height={16} width={'50%'} mt={4} />
                <SkeletonBlock height={10} width={'60%'} mt={4} />
              </View>
            ))}
          </View>
        </View>
        <View style={{ height: 16 }} />
      </ResponsiveFrame>
    </StateSection>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN EXPORT
// ═══════════════════════════════════════════════════════════════════════════════
export default function HomepageStates() {
  return (
    <View style={{ gap: 32 }}>
      <GuestState />
      <UserState />
      <LoadingState />
    </View>
  );
}
