import React from 'react';
import { View, Text, Pressable, useWindowDimensions } from 'react-native';
import { StateSection } from '../StateSection';

// ─── Design Tokens ───────────────────────────────────────────────────────────
const C = { green:'#00AA6C', greenBg:'#E8F9F2', white:'#FFFFFF', page:'#F5F5F5', text:'#1A1A1A', muted:'#737373', border:'#E0E0E0', error:'#D32F2F' };

// ─── Responsive wrapper ─────────────────────────────────────────────────────
function ResponsiveFrame({ children }: { children: React.ReactNode }) {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 640;
  return (
    <View style={isDesktop ? { width: 390, alignSelf: 'center', backgroundColor: C.page, borderRadius: 8, overflow: 'hidden' } : { backgroundColor: C.page }}>
      {children}
    </View>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// STATE 1: Coming Soon
// ═══════════════════════════════════════════════════════════════════════════════
function MapComingSoon() {
  return (
    <StateSection title="MAP_COMING_SOON">
      <ResponsiveFrame>
        <View style={{ height: 500, backgroundColor: '#E8EDF0', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 32 }}>
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
            <Text className="text-lg font-bold text-[#1A1A1A] mb-2 text-center">
              Карта объявлений
            </Text>
            <Text className="text-[13px] text-[#737373] text-center leading-5 mb-5">
              Скоро будет доступно
            </Text>
            <Pressable className="rounded-lg px-5 py-2.5 border border-[#E0E0E0]">
              <Text className="text-[15px] font-semibold text-[#737373]">
                ← Назад
              </Text>
            </Pressable>
          </View>
        </View>
      </ResponsiveFrame>
    </StateSection>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// STATE 2: Preview
// ═══════════════════════════════════════════════════════════════════════════════
function MapPreview() {
  const markers = [
    { top: 80, left: 120 },
    { top: 160, left: 250 },
    { top: 220, left: 90 },
    { top: 130, left: 300 },
    { top: 280, left: 180 },
  ];

  return (
    <StateSection title="MAP_PREVIEW">
      <ResponsiveFrame>
        <View style={{ height: 500, backgroundColor: '#E8EDF0', position: 'relative' }}>
          {/* Map markers */}
          {markers.map((pos, idx) => (
            <View
              key={idx}
              style={{
                position: 'absolute',
                top: pos.top,
                left: pos.left,
                width: 12,
                height: 12,
                borderRadius: 6,
                backgroundColor: C.green,
                shadowColor: C.green,
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.4,
                shadowRadius: 4,
                elevation: 3,
              }}
            />
          ))}

          {/* Bottom sheet */}
          <View
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              backgroundColor: C.white,
              borderTopLeftRadius: 12,
              borderTopRightRadius: 12,
              borderTopWidth: 1,
              borderTopColor: C.border,
              paddingHorizontal: 16,
              paddingTop: 12,
              paddingBottom: 16,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: -2 },
              shadowOpacity: 0.08,
              shadowRadius: 8,
              elevation: 4,
            }}
          >
            <View style={{ width: 36, height: 4, borderRadius: 2, backgroundColor: C.border, alignSelf: 'center', marginBottom: 12 }} />
            <Text className="text-[13px] font-semibold text-[#737373] mb-3">
              38 объявлений в этом районе
            </Text>
            {/* Preview listing card */}
            <View className="flex-row border border-[#E0E0E0] rounded-lg overflow-hidden">
              <View style={{ width: 90, height: 72, backgroundColor: '#F0F0F0' }} />
              <View className="flex-1 justify-center px-3 py-2">
                <Text className="text-[14px] font-bold text-[#1A1A1A] mb-0.5">₾62 000</Text>
                <Text className="text-[12px] text-[#1A1A1A]" numberOfLines={1}>2-комн. квартира, 55м²</Text>
                <Text className="text-[11px] text-[#737373] mt-0.5">Тбилиси, Сабуртало</Text>
              </View>
            </View>
          </View>
        </View>
      </ResponsiveFrame>
    </StateSection>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN EXPORT
// ═══════════════════════════════════════════════════════════════════════════════
export default function MapViewStates() {
  return (
    <View style={{ gap: 32 }}>
      <MapComingSoon />
      <MapPreview />
    </View>
  );
}
