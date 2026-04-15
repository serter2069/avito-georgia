import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { StateSection } from '../StateSection';

const C = { green:'#00AA6C', greenBg:'#E8F9F2', white:'#FFFFFF', page:'#F5F5F5', text:'#1A1A1A', muted:'#737373', border:'#E0E0E0', error:'#D32F2F' };
const amber = '#F59E0B';
const amberBg = '#FFF8E1';

function Card({ children, style }: { children: React.ReactNode; style?: any }) {
  return (
    <View
      className="bg-white rounded-lg border border-[#E0E0E0]"
      style={[{ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 }, style]}
    >
      {children}
    </View>
  );
}

// ─── PromotionSuccessStates (default export) ──────────────────────────────────

function PromotionSuccessContent() {
  return (
    <StateSection title="PROMOTION_SUCCESS">
      <View style={{ maxWidth: 390, backgroundColor: C.page, padding: 16 }}>
        <Card style={{ padding: 0 }}>
          <View className="items-center py-10 px-6" style={{ gap: 12 }}>
            {/* Green checkmark circle */}
            <View className="w-16 h-16 rounded-full bg-[#E8F9F2] items-center justify-center">
              <Text style={{ fontSize: 28, color: C.green }}>✓</Text>
            </View>

            <Text className="text-xl font-bold text-[#1A1A1A]">Продвижение активно!</Text>
            <Text className="text-sm text-[#737373] text-center">
              Toyota Camry 2019 теперь в топе поиска
            </Text>
            <Text className="text-xs text-[#737373]">Действует до: 22.04.2026</Text>

            <View className="w-full mt-2" style={{ gap: 10 }}>
              <View className="bg-[#00AA6C] rounded-md py-3.5 items-center">
                <Text className="text-white font-bold text-[15px]">Смотреть объявление</Text>
              </View>
              <View className="rounded-md py-3 items-center border border-[#E0E0E0]">
                <Text className="text-[#737373] font-semibold text-[15px]">На главную</Text>
              </View>
            </View>
          </View>
        </Card>
      </View>
    </StateSection>
  );
}

// ─── PromotionCancelledStates (named export) ──────────────────────────────────

function PromotionCancelledContent() {
  return (
    <StateSection title="PROMOTION_CANCELLED">
      <View style={{ maxWidth: 390, backgroundColor: C.page, padding: 16 }}>
        <Card style={{ padding: 0 }}>
          <View className="items-center py-10 px-6" style={{ gap: 12 }}>
            {/* Amber circle */}
            <View className="w-16 h-16 rounded-full items-center justify-center" style={{ backgroundColor: amberBg }}>
              <Text style={{ fontSize: 28, color: amber }}>!</Text>
            </View>

            <Text className="text-xl font-bold text-[#1A1A1A]">Продвижение отменено</Text>
            <Text className="text-sm text-[#737373] text-center">
              Вы отменили продвижение. Объявление по-прежнему активно.
            </Text>

            <View className="w-full mt-2">
              <View className="rounded-md py-3 items-center border border-[#E0E0E0]">
                <Text className="text-[#737373] font-semibold text-[15px]">Вернуться к объявлению</Text>
              </View>
            </View>
          </View>
        </Card>
      </View>
    </StateSection>
  );
}

// ─── SlotSuccessStates (named export) ─────────────────────────────────────────

function SlotSuccessContent() {
  return (
    <StateSection title="SLOT_SUCCESS">
      <View style={{ maxWidth: 390, backgroundColor: C.page, padding: 16 }}>
        <Card style={{ padding: 0 }}>
          <View className="items-center py-10 px-6" style={{ gap: 12 }}>
            {/* Green checkmark circle */}
            <View className="w-16 h-16 rounded-full bg-[#E8F9F2] items-center justify-center">
              <Text style={{ fontSize: 28, color: C.green }}>✓</Text>
            </View>

            <Text className="text-xl font-bold text-[#1A1A1A]">Слот активирован!</Text>
            <Text className="text-sm text-[#737373] text-center">
              Ваше объявление появится в блоке «Топ» на главной
            </Text>
            <Text className="text-xs text-[#737373]">Действует 3 дня до: 18.04.2026</Text>

            <View className="w-full mt-2">
              <View className="bg-[#00AA6C] rounded-md py-3.5 items-center">
                <Text className="text-white font-bold text-[15px]">Отлично</Text>
              </View>
            </View>
          </View>
        </Card>
      </View>
    </StateSection>
  );
}

// ─── Exports ──────────────────────────────────────────────────────────────────

export function PromotionCancelledStates() {
  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 24 }} showsVerticalScrollIndicator={false}>
      <PromotionCancelledContent />
    </ScrollView>
  );
}

export function SlotSuccessStates() {
  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 24 }} showsVerticalScrollIndicator={false}>
      <SlotSuccessContent />
    </ScrollView>
  );
}

export default function PromotionSuccessStates() {
  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 24 }} showsVerticalScrollIndicator={false}>
      <PromotionSuccessContent />
      <PromotionCancelledContent />
      <SlotSuccessContent />
    </ScrollView>
  );
}
