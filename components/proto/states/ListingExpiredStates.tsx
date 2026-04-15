import React from 'react';
import { View, Text, ActivityIndicator, Pressable, useWindowDimensions } from 'react-native';
import { StateSection } from '../StateSection';

const C = { green:'#00AA6C', greenBg:'#E8F9F2', white:'#FFFFFF', page:'#F5F5F5', text:'#1A1A1A', muted:'#737373', border:'#E0E0E0', error:'#D32F2F' };

// ─── Helpers ────────────────────────────────────────────────────────────────────

function PhoneFrame({ children }: { children: React.ReactNode }) {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 640;

  return (
    <View
      className="bg-white overflow-hidden"
      style={isDesktop
        ? { width: 390, alignSelf: 'center', borderRadius: 12, borderWidth: 1, borderColor: C.border, backgroundColor: C.white }
        : { width: '100%' as any, backgroundColor: C.white }
      }
    >
      {children}
    </View>
  );
}

function ExpiredListingCard({ title, price }: { title: string; price: string }) {
  return (
    <View className="border border-[#E0E0E0] rounded-lg overflow-hidden">
      {/* Greyed image placeholder */}
      <View style={{ height: 160, backgroundColor: '#E0E0E0', opacity: 0.6 }} />
      <View className="p-3" style={{ gap: 4 }}>
        <View className="flex-row items-center" style={{ gap: 8 }}>
          <Text className="text-[15px] font-semibold text-[#1A1A1A] flex-1" numberOfLines={1}>{title}</Text>
          <View className="rounded px-2 py-0.5" style={{ backgroundColor: '#F5F5F5' }}>
            <Text className="text-[11px] font-bold" style={{ color: C.muted }}>Истёкло</Text>
          </View>
        </View>
        <Text className="text-lg font-bold text-[#1A1A1A]">{price}</Text>
      </View>
    </View>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// STATES
// ═══════════════════════════════════════════════════════════════════════════════

function DefaultExpiredState() {
  return (
    <StateSection title="LISTING_EXPIRED / Default">
      <PhoneFrame>
        <View className="p-4" style={{ gap: 16 }}>
          <ExpiredListingCard title="Toyota Camry 2019, 45 000 км" price="12 500 ₾" />

          <Text className="text-sm" style={{ color: C.muted }}>
            Срок объявления истёк 30 апреля
          </Text>

          <Pressable className="rounded-md py-3 items-center" style={{ backgroundColor: C.green }}>
            <Text className="text-white font-bold text-[15px]">Продлить за ₾3</Text>
          </Pressable>
          <Pressable className="rounded-md py-3 items-center border border-[#E0E0E0]">
            <Text className="text-[15px] font-semibold" style={{ color: C.error }}>Удалить</Text>
          </Pressable>
        </View>
      </PhoneFrame>
    </StateSection>
  );
}

function FreeRenewalState() {
  return (
    <StateSection title="LISTING_EXPIRED / Free renewal">
      <PhoneFrame>
        <View className="p-4" style={{ gap: 16 }}>
          <ExpiredListingCard title="Toyota Camry 2019, 45 000 км" price="12 500 ₾" />

          <View className="rounded-md px-3 py-2" style={{ backgroundColor: C.greenBg }}>
            <Text className="text-[13px] font-semibold" style={{ color: C.green }}>
              Продление бесплатно (1 из 3 бесплатных)
            </Text>
          </View>

          <Pressable className="rounded-md py-3 items-center" style={{ backgroundColor: C.green }}>
            <Text className="text-white font-bold text-[15px]">Продлить бесплатно</Text>
          </Pressable>
          <Pressable className="rounded-md py-3 items-center border border-[#E0E0E0]">
            <Text className="text-[15px] font-semibold" style={{ color: C.error }}>Удалить</Text>
          </Pressable>
        </View>
      </PhoneFrame>
    </StateSection>
  );
}

function RenewingLoadingState() {
  return (
    <StateSection title="LISTING_EXPIRED / Renewing loading">
      <PhoneFrame>
        <View className="p-4" style={{ gap: 16 }}>
          <ExpiredListingCard title="Toyota Camry 2019, 45 000 км" price="12 500 ₾" />

          <Pressable
            className="rounded-md py-3 items-center flex-row justify-center"
            style={{ backgroundColor: C.green, opacity: 0.7, gap: 8 }}
            disabled
          >
            <ActivityIndicator size="small" color="#FFFFFF" />
            <Text className="text-white font-bold text-[15px]">Продление...</Text>
          </Pressable>
        </View>
      </PhoneFrame>
    </StateSection>
  );
}

function SuccessState() {
  return (
    <StateSection title="LISTING_EXPIRED / Success">
      <PhoneFrame>
        <View className="items-center py-16 px-6" style={{ gap: 12 }}>
          {/* Checkmark circle */}
          <View style={{
            width: 64, height: 64, borderRadius: 32,
            borderWidth: 3, borderColor: C.green,
            alignItems: 'center', justifyContent: 'center',
          }}>
            <Text style={{ fontSize: 28, color: C.green, fontWeight: '700' }}>✓</Text>
          </View>

          <Text className="text-lg font-bold text-[#1A1A1A]">Объявление продлено!</Text>
          <Text className="text-sm text-center" style={{ color: C.muted }}>
            Активно до 30 мая.
          </Text>

          <Pressable className="rounded-md px-6 py-3 mt-4" style={{ backgroundColor: C.green }}>
            <Text className="text-white font-bold text-[15px]">Смотреть объявление</Text>
          </Pressable>
        </View>
      </PhoneFrame>
    </StateSection>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN EXPORT
// ═══════════════════════════════════════════════════════════════════════════════

export default function ListingExpiredStates() {
  return (
    <View style={{ gap: 0 }}>
      <DefaultExpiredState />
      <FreeRenewalState />
      <RenewingLoadingState />
      <SuccessState />
    </View>
  );
}
