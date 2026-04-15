import React from 'react';
import { View, Text, Pressable, ScrollView, useWindowDimensions } from 'react-native';
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

function Header() {
  return (
    <View className="flex-row items-center px-4 py-3 bg-white border-b border-[#E0E0E0]">
      <Text className="text-base font-semibold text-[#1A1A1A]">← Назад</Text>
    </View>
  );
}

function ProfileHeader() {
  return (
    <View className="px-4 pt-4 pb-3">
      <View className="flex-row items-center" style={{ gap: 14 }}>
        <View className="w-16 h-16 rounded-full bg-[#737373] items-center justify-center">
          <Text className="text-2xl font-bold text-white">M</Text>
        </View>
        <View className="flex-1">
          <Text className="text-lg font-bold text-[#1A1A1A]">Михаил Т.</Text>
          <Text className="text-[13px] text-[#737373] mt-0.5">На платформе с марта 2023</Text>
          <Text className="text-[13px] text-[#737373] mt-0.5">42 объявления</Text>
        </View>
      </View>
    </View>
  );
}

function Tabs({ activeTab }: { activeTab: 'listings' | 'reviews' }) {
  const tabs = [
    { key: 'listings', label: 'Объявления (42)' },
    { key: 'reviews', label: 'Отзывы (8)' },
  ];
  return (
    <View className="flex-row border-b border-[#E0E0E0]">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key;
        return (
          <Pressable
            key={tab.key}
            className="flex-1 items-center py-3"
            style={isActive ? { borderBottomWidth: 2, borderBottomColor: C.green } : {}}
          >
            <Text
              className="text-[14px]"
              style={{ fontWeight: isActive ? '700' : '500', color: isActive ? C.green : C.muted }}
            >
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function MiniListingCard({ title, price }: { title: string; price: string }) {
  return (
    <View className="border border-[#E0E0E0] rounded-lg overflow-hidden" style={{ width: '48%' as any }}>
      <View className="h-[90px] bg-[#E0E0E0]" />
      <View className="p-2">
        <Text className="text-[13px] font-bold text-[#1A1A1A] mb-0.5">{price}</Text>
        <Text className="text-[11px] text-[#737373]" numberOfLines={2}>{title}</Text>
      </View>
    </View>
  );
}

function ReviewCard({ name, stars, date, text }: { name: string; stars: number; date: string; text: string }) {
  const filled = Array(stars).fill(null);
  const empty = Array(5 - stars).fill(null);
  return (
    <View className="border border-[#E0E0E0] rounded-lg p-3" style={{ gap: 6 }}>
      <View className="flex-row items-center" style={{ gap: 10 }}>
        <View className="w-9 h-9 rounded-full bg-[#E0E0E0] items-center justify-center">
          <Text className="text-xs font-bold text-[#737373]">{name.charAt(0)}</Text>
        </View>
        <View className="flex-1">
          <Text className="text-[13px] font-semibold text-[#1A1A1A]">{name}</Text>
          <Text className="text-[11px] text-[#737373]">{date}</Text>
        </View>
      </View>
      <Text className="text-sm" style={{ color: '#F59E0B' }}>
        {filled.map(() => '\u2605').join('')}{empty.map(() => '\u2606').join('')}
      </Text>
      <Text className="text-[13px] text-[#1A1A1A] leading-5">{text}</Text>
    </View>
  );
}

// State 1: Default
function SellerDefault() {
  const listings = [
    { title: '3-комн. квартира, центр', price: '₾85 000' },
    { title: 'Toyota Camry 2019', price: '₾25 000' },
    { title: 'Угловой диван, бежевый', price: '₾700' },
    { title: 'MacBook Pro 14" M3', price: '₾3 600' },
  ];

  return (
    <StateSection title="SELLER_DEFAULT">
      <PhoneFrame>
        <Header />
        <ProfileHeader />
        <Tabs activeTab="listings" />
        <View className="flex-row flex-wrap p-3 justify-between" style={{ gap: 10 }}>
          {listings.map((item, idx) => (
            <MiniListingCard key={idx} {...item} />
          ))}
        </View>
      </PhoneFrame>
    </StateSection>
  );
}

// State 2: Reviews Tab
function SellerReviews() {
  const reviews = [
    { name: 'Анна К.', stars: 5, date: '12 марта 2026', text: 'Отличный продавец, быстрая сделка. Рекомендую!' },
    { name: 'Давид М.', stars: 4, date: '28 февраля 2026', text: 'Хорошее качество товара, но немного задержал доставку.' },
    { name: 'Нино Б.', stars: 5, date: '15 января 2026', text: 'Всё как в описании, очень приятное общение.' },
  ];

  return (
    <StateSection title="SELLER_REVIEWS_TAB">
      <PhoneFrame>
        <Header />
        <ProfileHeader />
        <Tabs activeTab="reviews" />
        <View className="p-3" style={{ gap: 12 }}>
          {/* Rating summary */}
          <View className="flex-row items-center" style={{ gap: 8 }}>
            <Text className="text-lg font-bold text-[#1A1A1A]">4.7</Text>
            <Text style={{ color: '#F59E0B', fontSize: 14 }}>{'\u2605\u2605\u2605\u2605\u2606'}</Text>
            <Text className="text-[13px] text-[#737373]">8 отзывов</Text>
          </View>
          {/* Review list */}
          {reviews.map((r, idx) => (
            <ReviewCard key={idx} {...r} />
          ))}
        </View>
      </PhoneFrame>
    </StateSection>
  );
}

// State 3: Empty Listings
function SellerEmpty() {
  return (
    <StateSection title="SELLER_EMPTY_LISTINGS">
      <PhoneFrame>
        <Header />
        <ProfileHeader />
        <Tabs activeTab="listings" />
        <View className="items-center py-14 px-4">
          <Text className="text-[15px] font-semibold text-[#737373] text-center">
            Нет активных объявлений
          </Text>
        </View>
      </PhoneFrame>
    </StateSection>
  );
}

export default function SellerProfileStates() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 640;

  return (
    <ScrollView
      contentContainerStyle={{
        padding: 16,
        gap: 24,
        backgroundColor: isDesktop ? '#F0F0F0' : C.white,
        alignItems: isDesktop ? 'center' : undefined,
      }}
    >
      <SellerDefault />
      <SellerReviews />
      <SellerEmpty />
      <View className="h-10" />
    </ScrollView>
  );
}
