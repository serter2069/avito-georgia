import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { StateSection } from '../StateSection';

const C = { green:'#00AA6C', greenBg:'#E8F9F2', white:'#FFFFFF', page:'#F5F5F5', text:'#1A1A1A', muted:'#737373', border:'#E0E0E0', error:'#D32F2F' };

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

function FeatureRow({ label, free, isPremium }: { label: string; free?: string; isPremium?: boolean }) {
  return (
    <View className="flex-row items-center py-2.5 border-b border-[#E0E0E0]" style={{ gap: 10 }}>
      <Text style={{ fontSize: 16, color: C.green }}>✓</Text>
      <View className="flex-1">
        <Text className="text-sm text-[#1A1A1A]">{label}</Text>
        {free && <Text className="text-xs text-[#737373]">Бесплатно: {free}</Text>}
      </View>
    </View>
  );
}

// ─── State 1: Default (free user) ─────────────────────────────────────────────

function DefaultState() {
  return (
    <StateSection title="SUBSCRIPTION_DEFAULT">
      <View style={{ maxWidth: 390, backgroundColor: C.page, padding: 16, gap: 20 }}>
        <Text className="text-xl font-bold text-[#1A1A1A]">Premium подписка</Text>

        <Card style={{ padding: 0, overflow: 'hidden' }}>
          {/* Hero */}
          <View className="items-center py-6 bg-[#E8F9F2]" style={{ gap: 8 }}>
            <Text style={{ fontSize: 40 }}>⭐</Text>
            <Text className="text-lg font-bold text-[#1A1A1A]">Premium продавец</Text>
            <Text className="text-sm text-[#737373] text-center px-6">
              Безлимитные объявления + приоритет в поиске
            </Text>
          </View>

          {/* Features */}
          <View className="px-4 pt-2 pb-1">
            <FeatureRow label="Безлимитные объявления" free="10" />
            <FeatureRow label="Значок Premium" />
            <FeatureRow label="Приоритет в поиске" />
            <FeatureRow label="Статистика объявлений" />
          </View>

          {/* Price + CTA */}
          <View className="items-center px-4 pt-4 pb-5" style={{ gap: 12 }}>
            <Text className="text-2xl font-bold text-[#1A1A1A]">₾29.99<Text className="text-sm font-normal text-[#737373]">/месяц</Text></Text>
            <View className="bg-[#00AA6C] rounded-md py-3.5 w-full items-center">
              <Text className="text-white font-bold text-[15px]">Оформить подписку</Text>
            </View>
            <Text className="text-xs text-[#737373]">Отмена в любой момент</Text>
          </View>
        </Card>
      </View>
    </StateSection>
  );
}

// ─── State 2: Active subscription ─────────────────────────────────────────────

function ActiveState() {
  return (
    <StateSection title="SUBSCRIPTION_ACTIVE">
      <View style={{ maxWidth: 390, backgroundColor: C.page, padding: 16, gap: 20 }}>
        <Text className="text-xl font-bold text-[#1A1A1A]">Premium подписка</Text>

        <Card style={{ padding: 20, gap: 16 }}>
          <View className="flex-row items-center" style={{ gap: 10 }}>
            <View className="bg-[#E8F9F2] rounded-full px-3 py-1">
              <Text className="text-xs font-bold text-[#00AA6C]">Premium активна</Text>
            </View>
          </View>

          <Text className="text-sm text-[#737373]">
            Следующее списание: 15.05.2026 · ₾29.99
          </Text>

          <View className="rounded-md py-3 items-center border border-[#D32F2F]">
            <Text className="text-[#D32F2F] font-bold text-[15px]">Отменить подписку</Text>
          </View>
        </Card>
      </View>
    </StateSection>
  );
}

// ─── State 3: Payment processing ──────────────────────────────────────────────

function PaymentState() {
  return (
    <StateSection title="SUBSCRIPTION_PAYMENT">
      <View style={{ maxWidth: 390, backgroundColor: C.page, padding: 16, gap: 20 }}>
        <Text className="text-xl font-bold text-[#1A1A1A]">Оплата подписки</Text>

        <Card style={{ padding: 20, gap: 16 }}>
          {/* Card number */}
          <View style={{ gap: 6 }}>
            <Text className="text-sm font-medium text-[#1A1A1A]">Номер карты</Text>
            <View className="bg-[#F5F5F5] rounded-md py-3 px-3 border border-[#E0E0E0]">
              <Text className="text-sm text-[#737373]">4242 4242 4242 4242</Text>
            </View>
          </View>

          {/* Expiry + CVC */}
          <View className="flex-row" style={{ gap: 12 }}>
            <View className="flex-1" style={{ gap: 6 }}>
              <Text className="text-sm font-medium text-[#1A1A1A]">Срок</Text>
              <View className="bg-[#F5F5F5] rounded-md py-3 px-3 border border-[#E0E0E0]">
                <Text className="text-sm text-[#737373]">MM / YY</Text>
              </View>
            </View>
            <View className="flex-1" style={{ gap: 6 }}>
              <Text className="text-sm font-medium text-[#1A1A1A]">CVC</Text>
              <View className="bg-[#F5F5F5] rounded-md py-3 px-3 border border-[#E0E0E0]">
                <Text className="text-sm text-[#737373]">123</Text>
              </View>
            </View>
          </View>

          {/* Pay button */}
          <View className="bg-[#00AA6C] rounded-md py-3.5 items-center">
            <Text className="text-white font-bold text-[15px]">Оплатить ₾29.99</Text>
          </View>

          {/* Stripe footer */}
          <View className="flex-row items-center justify-center" style={{ gap: 6 }}>
            <Text style={{ fontSize: 14 }}>🔒</Text>
            <Text className="text-xs text-[#737373]">Защищённый платёж · Stripe</Text>
          </View>
        </Card>
      </View>
    </StateSection>
  );
}

// ─── Main Export ───────────────────────────────────────────────────────────────

export default function SubscriptionStates() {
  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 24 }} showsVerticalScrollIndicator={false}>
      <DefaultState />
      <ActiveState />
      <PaymentState />
    </ScrollView>
  );
}
