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

const payments = [
  { title: 'Premium подписка', date: '15.04.2026', amount: '₾29.99', status: 'paid' as const },
  { title: 'Продвижение: Camry 2019', date: '10.04.2026', amount: '₾9.99', status: 'paid' as const },
  { title: 'Premium подписка', date: '15.03.2026', amount: '₾29.99', status: 'paid' as const },
  { title: 'Слот «Топ»', date: '01.03.2026', amount: '₾4.99', status: 'expired' as const },
];

function StatusBadge({ status }: { status: 'paid' | 'expired' }) {
  const isPaid = status === 'paid';
  return (
    <View className="rounded-full px-2.5 py-0.5" style={{ backgroundColor: isPaid ? C.greenBg : '#F4F4F4' }}>
      <Text className="text-[11px] font-bold" style={{ color: isPaid ? C.green : C.muted }}>
        {isPaid ? 'Оплачено' : 'Истёк'}
      </Text>
    </View>
  );
}

// ─── State 1: Default ─────────────────────────────────────────────────────────

function DefaultState() {
  return (
    <StateSection title="PAYMENT_HISTORY_DEFAULT">
      <View style={{ maxWidth: 390, backgroundColor: C.page, padding: 16, gap: 16 }}>
        <Text className="text-xl font-bold text-[#1A1A1A]">История платежей</Text>

        <Card style={{ padding: 0, overflow: 'hidden' }}>
          {payments.map((p, idx) => (
            <View key={idx}>
              <View className="px-4 py-3.5" style={{ gap: 4 }}>
                <View className="flex-row items-center justify-between">
                  <Text className="text-sm font-semibold text-[#1A1A1A] flex-1" numberOfLines={1}>{p.title}</Text>
                  <StatusBadge status={p.status} />
                </View>
                <View className="flex-row items-center justify-between">
                  <Text className="text-xs text-[#737373]">{p.date}</Text>
                  <Text className="text-sm font-bold text-[#1A1A1A]">{p.amount}</Text>
                </View>
              </View>
              {idx < payments.length - 1 && <View className="h-px bg-[#E0E0E0] ml-4" />}
            </View>
          ))}
        </Card>
      </View>
    </StateSection>
  );
}

// ─── State 2: Empty ───────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <StateSection title="PAYMENT_HISTORY_EMPTY">
      <View style={{ maxWidth: 390, backgroundColor: C.page, padding: 16, gap: 16 }}>
        <Text className="text-xl font-bold text-[#1A1A1A]">История платежей</Text>

        <Card style={{ padding: 0 }}>
          <View className="items-center py-10 px-6" style={{ gap: 8 }}>
            <Text style={{ fontSize: 40 }}>🧾</Text>
            <Text className="text-base font-bold text-[#1A1A1A]">Нет платежей</Text>
            <Text className="text-sm text-[#737373] text-center">
              Ваша история платежей появится здесь
            </Text>
          </View>
        </Card>
      </View>
    </StateSection>
  );
}

// ─── Main Export ───────────────────────────────────────────────────────────────

export default function PaymentHistoryStates() {
  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 24 }} showsVerticalScrollIndicator={false}>
      <DefaultState />
      <EmptyState />
    </ScrollView>
  );
}
