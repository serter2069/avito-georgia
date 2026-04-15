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

function CardInput({ placeholder }: { placeholder: string }) {
  return (
    <View className="border border-[#E0E0E0] rounded-md px-3 py-3">
      <Text className="text-sm" style={{ color: C.muted }}>{placeholder}</Text>
    </View>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// STATES
// ═══════════════════════════════════════════════════════════════════════════════

function LoadingState() {
  return (
    <StateSection title="PAYMENT / Loading">
      <PhoneFrame>
        <View className="items-center justify-center py-24">
          <ActivityIndicator size="large" color={C.green} />
          <Text className="text-sm mt-4" style={{ color: C.muted }}>Перенаправление на оплату...</Text>
        </View>
      </PhoneFrame>
    </StateSection>
  );
}

function CheckoutState() {
  return (
    <StateSection title="PAYMENT / Checkout">
      <PhoneFrame>
        {/* Header */}
        <View className="px-4 py-3 border-b border-[#E0E0E0]">
          <Text className="text-lg font-bold text-[#1A1A1A]">Оплата</Text>
        </View>

        <View className="p-4" style={{ gap: 16 }}>
          {/* Summary card */}
          <View className="border border-[#E0E0E0] rounded-lg p-4" style={{ gap: 8 }}>
            <Text className="text-sm font-semibold text-[#1A1A1A]">Публикация объявления</Text>
            <Text className="text-[13px]" style={{ color: C.muted }}>Toyota Camry 2019, 45 000 км</Text>
            <View className="flex-row items-center justify-between mt-2 pt-2 border-t border-[#E0E0E0]">
              <Text className="text-sm" style={{ color: C.muted }}>Стоимость</Text>
              <Text className="text-base font-bold text-[#1A1A1A]">₾5.00</Text>
            </View>
          </View>

          {/* Stripe card form placeholders */}
          <View style={{ gap: 10 }}>
            <CardInput placeholder="Номер карты" />
            <View className="flex-row" style={{ gap: 10 }}>
              <View style={{ flex: 1 }}>
                <CardInput placeholder="MM/ГГ" />
              </View>
              <View style={{ flex: 1 }}>
                <CardInput placeholder="CVC" />
              </View>
            </View>
            <CardInput placeholder="Имя держателя" />
          </View>

          <Pressable className="rounded-md py-3 items-center" style={{ backgroundColor: C.green }}>
            <Text className="text-white font-bold text-[15px]">Оплатить ₾5.00</Text>
          </Pressable>

          <Text className="text-xs text-center" style={{ color: C.muted }}>
            [ ] Защищённый платёж
          </Text>
        </View>
      </PhoneFrame>
    </StateSection>
  );
}

function SuccessState() {
  return (
    <StateSection title="PAYMENT / Success">
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

          <Text className="text-lg font-bold text-[#1A1A1A]">Оплата прошла!</Text>
          <Text className="text-sm text-center" style={{ color: C.muted }}>
            Ваше объявление отправлено на проверку.
          </Text>

          <Pressable className="rounded-md px-6 py-3 mt-4" style={{ backgroundColor: C.green }}>
            <Text className="text-white font-bold text-[15px]">Перейти к объявлениям</Text>
          </Pressable>
        </View>
      </PhoneFrame>
    </StateSection>
  );
}

function ErrorState() {
  return (
    <StateSection title="PAYMENT / Error">
      <PhoneFrame>
        <View className="items-center py-16 px-6" style={{ gap: 12 }}>
          {/* Error circle */}
          <View style={{
            width: 64, height: 64, borderRadius: 32,
            borderWidth: 3, borderColor: C.error,
            alignItems: 'center', justifyContent: 'center',
          }}>
            <Text style={{ fontSize: 28, color: C.error, fontWeight: '700' }}>×</Text>
          </View>

          <Text className="text-lg font-bold text-[#1A1A1A]">Оплата не прошла</Text>
          <Text className="text-sm text-center" style={{ color: C.muted }}>
            Попробуйте другую карту или обратитесь в банк.
          </Text>

          <Pressable className="rounded-md px-6 py-3 mt-4" style={{ backgroundColor: C.green }}>
            <Text className="text-white font-bold text-[15px]">Попробовать снова</Text>
          </Pressable>
        </View>
      </PhoneFrame>
    </StateSection>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN EXPORT
// ═══════════════════════════════════════════════════════════════════════════════

export default function PaymentStates() {
  return (
    <View style={{ gap: 0 }}>
      <LoadingState />
      <CheckoutState />
      <SuccessState />
      <ErrorState />
    </View>
  );
}
