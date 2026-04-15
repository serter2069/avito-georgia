import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { StateSection } from '../StateSection';

const C = { green:'#00AA6C', greenBg:'#E8F9F2', white:'#FFFFFF', page:'#F5F5F5', text:'#1A1A1A', muted:'#737373', border:'#E0E0E0', error:'#D32F2F' };

function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <View className="bg-white rounded-xl border border-[#E0E0E0] overflow-hidden" style={{ width: 390 }}>
      {children}
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

function ProfileHeader({ name, since, count, premium }: { name: string; since: string; count: number; premium?: boolean }) {
  return (
    <View className="px-4 pt-4 pb-3">
      <Text className="text-lg font-bold text-[#1A1A1A] mb-4">Профиль продавца</Text>
      <View className="flex-row items-center" style={{ gap: 14 }}>
        {/* Avatar */}
        <View className="w-16 h-16 rounded-full bg-[#00AA6C] items-center justify-center">
          <Text className="text-2xl font-bold text-white">М</Text>
        </View>
        <View className="flex-1">
          <View className="flex-row items-center" style={{ gap: 8 }}>
            <Text className="text-[17px] font-bold text-[#1A1A1A]">{name}</Text>
            {premium && (
              <View className="bg-[#FFF3E0] rounded-full px-2.5 py-0.5">
                <Text className="text-[11px] font-bold text-[#E65100]">Premium &#x2605;</Text>
              </View>
            )}
          </View>
          <Text className="text-[13px] text-[#737373] mt-0.5">{since}</Text>
          <Text className="text-[13px] text-[#737373] mt-0.5">{count} объявлений</Text>
          {premium && (
            <View className="flex-row items-center mt-1" style={{ gap: 4 }}>
              <Text className="text-[12px] text-[#00AA6C] font-semibold">&#x2713; Проверенный продавец</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

function Tabs({ activeTab, listingsCount, reviewsCount, onPress }: { activeTab: string; listingsCount: number; reviewsCount: number; onPress: (tab: string) => void }) {
  const tabs = [
    { key: 'listings', label: `Объявления (${listingsCount})` },
    { key: 'reviews', label: `Отзывы (${reviewsCount})` },
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
            onPress={() => onPress(tab.key)}
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

// ─── State 1: Default Profile ───────────────────────────────────────────────────

function SellerDefault() {
  const listings = [
    { title: '3-комн. квартира, центр', price: '$85,000' },
    { title: 'Toyota Camry 2019', price: '$12,500' },
    { title: 'Угловой диван, бежевый', price: '350 GEL' },
    { title: 'MacBook Pro 14" M3', price: '$1,800' },
  ];

  return (
    <StateSection title="SELLER_DEFAULT">
      <PhoneFrame>
        <ProfileHeader name="Михаил Т." since="На платформе с марта 2023" count={42} />
        <Tabs activeTab="listings" listingsCount={42} reviewsCount={8} onPress={() => {}} />
        <View className="flex-row flex-wrap p-3 justify-between" style={{ gap: 10 }}>
          {listings.map((item, idx) => (
            <MiniListingCard key={idx} {...item} />
          ))}
        </View>
      </PhoneFrame>
    </StateSection>
  );
}

// ─── State 2: Premium Seller ────────────────────────────────────────────────────

function SellerPremium() {
  const listings = [
    { title: 'Пентхаус 120 м\u00B2, вид на море', price: '$180,000' },
    { title: 'BMW X5 2022, 15k км', price: '$48,000' },
    { title: 'iPhone 15 Pro Max 256GB', price: '3,200 GEL' },
    { title: 'Дизайнерская мебель, комплект', price: '4,500 GEL' },
  ];

  return (
    <StateSection title="SELLER_PREMIUM">
      <PhoneFrame>
        <ProfileHeader name="Михаил Т." since="На платформе с марта 2023" count={42} premium />
        <Tabs activeTab="listings" listingsCount={42} reviewsCount={8} onPress={() => {}} />
        <View className="flex-row flex-wrap p-3 justify-between" style={{ gap: 10 }}>
          {listings.map((item, idx) => (
            <MiniListingCard key={idx} {...item} />
          ))}
        </View>
      </PhoneFrame>
    </StateSection>
  );
}

// ─── State 3: Empty Listings ────────────────────────────────────────────────────

function SellerEmpty() {
  return (
    <StateSection title="SELLER_EMPTY_LISTINGS">
      <PhoneFrame>
        <ProfileHeader name="Михаил Т." since="На платформе с марта 2023" count={0} />
        <Tabs activeTab="listings" listingsCount={0} reviewsCount={8} onPress={() => {}} />
        <View className="items-center py-14 px-4">
          <View className="w-16 h-16 rounded-full bg-[#F5F5F5] items-center justify-center mb-4">
            <Text className="text-2xl">&#x1F4E6;</Text>
          </View>
          <Text className="text-[15px] font-semibold text-[#1A1A1A] mb-1">
            Нет активных объявлений
          </Text>
          <Text className="text-[13px] text-[#737373] text-center">
            У этого продавца пока нет объявлений
          </Text>
        </View>
      </PhoneFrame>
    </StateSection>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN EXPORT
// ═══════════════════════════════════════════════════════════════════════════════

export default function SellerProfileStates() {
  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 24, backgroundColor: C.page }}>
      <View>
        <Text className="text-2xl font-bold text-[#1A1A1A] mb-1">Seller Profile</Text>
        <Text className="text-sm text-[#737373]">Seller profile states -- Avito Georgia</Text>
      </View>
      <SellerDefault />
      <SellerPremium />
      <SellerEmpty />
      <View className="h-10" />
    </ScrollView>
  );
}
