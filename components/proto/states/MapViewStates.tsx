import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { StateSection } from '../StateSection';

const C = { green:'#00AA6C', greenBg:'#E8F9F2', white:'#FFFFFF', page:'#F5F5F5', text:'#1A1A1A', muted:'#737373', border:'#E0E0E0', error:'#D32F2F' };

function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <View className="bg-white rounded-xl border border-[#E0E0E0] overflow-hidden" style={{ width: 390 }}>
      {children}
    </View>
  );
}

// ─── State 1: Coming Soon ───────────────────────────────────────────────────────

function MapComingSoon() {
  return (
    <StateSection title="MAP_COMING_SOON">
      <PhoneFrame>
        <View className="bg-[#E8EDF0] relative" style={{ height: 500 }}>
          {/* Centered card */}
          <View className="absolute inset-0 items-center justify-center px-8">
            <View
              className="bg-white rounded-xl px-6 py-8 items-center border border-[#E0E0E0]"
              style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.1,
                shadowRadius: 12,
                elevation: 4,
                width: '100%',
                maxWidth: 300,
              }}
            >
              <Text className="text-4xl mb-3">&#x1F4CD;</Text>
              <Text className="text-lg font-bold text-[#1A1A1A] mb-2 text-center">
                Карта объявлений
              </Text>
              <Text className="text-[13px] text-[#737373] text-center leading-5 mb-5">
                Скоро будет доступно. Следите за обновлениями!
              </Text>
              <View className="rounded-lg px-5 py-2.5">
                <Text className="text-[15px] font-semibold text-[#737373]">
                  &#x2190; Назад
                </Text>
              </View>
            </View>
          </View>
        </View>
      </PhoneFrame>
    </StateSection>
  );
}

// ─── State 2: Preview with Markers ──────────────────────────────────────────────

function MapPreview() {
  // Scattered marker positions
  const markers = [
    { top: 80, left: 120 },
    { top: 160, left: 250 },
    { top: 220, left: 90 },
    { top: 130, left: 300 },
    { top: 280, left: 180 },
  ];

  return (
    <StateSection title="MAP_PREVIEW">
      <PhoneFrame>
        <View className="bg-[#E8EDF0] relative" style={{ height: 500 }}>
          {/* Map markers */}
          {markers.map((pos, idx) => (
            <View
              key={idx}
              className="absolute w-3 h-3 rounded-full bg-[#00AA6C]"
              style={{
                top: pos.top,
                left: pos.left,
                shadowColor: '#00AA6C',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.4,
                shadowRadius: 4,
                elevation: 3,
              }}
            />
          ))}

          {/* Bottom sheet */}
          <View
            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-xl border-t border-[#E0E0E0] px-4 pt-3 pb-4"
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: -2 },
              shadowOpacity: 0.08,
              shadowRadius: 8,
              elevation: 4,
            }}
          >
            <View className="w-9 h-1 rounded-full bg-[#E0E0E0] self-center mb-3" />
            <Text className="text-[13px] font-semibold text-[#737373] mb-3">
              38 объявлений в этом районе
            </Text>
            {/* Preview listing card */}
            <View className="flex-row border border-[#E0E0E0] rounded-lg overflow-hidden" style={{ gap: 0 }}>
              <View className="w-[90px] h-[72px] bg-[#E0E0E0]" />
              <View className="flex-1 justify-center px-3 py-2">
                <Text className="text-[14px] font-bold text-[#1A1A1A] mb-0.5">$62,000</Text>
                <Text className="text-[12px] text-[#1A1A1A]" numberOfLines={1}>2-комн. квартира, 55 м&#x00B2;</Text>
                <Text className="text-[11px] text-[#737373] mt-0.5">Тбилиси, Сабуртало</Text>
              </View>
            </View>
          </View>
        </View>
      </PhoneFrame>
    </StateSection>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN EXPORT
// ═══════════════════════════════════════════════════════════════════════════════

export default function MapViewStates() {
  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 24, backgroundColor: C.page }}>
      <View>
        <Text className="text-2xl font-bold text-[#1A1A1A] mb-1">Map View</Text>
        <Text className="text-sm text-[#737373]">Map screen states -- Avito Georgia</Text>
      </View>
      <MapComingSoon />
      <MapPreview />
      <View className="h-10" />
    </ScrollView>
  );
}
