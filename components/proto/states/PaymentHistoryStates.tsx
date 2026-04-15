import React from 'react';
import { View, Text, ScrollView, useWindowDimensions } from 'react-native';
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

interface Payment {
  date: string;
  type: string;
  listing: string;
  amount: string;
  status: 'paid';
}

const PAYMENTS: Payment[] = [
  { date: '10.04.2026', type: '\u041F\u0443\u0431\u043B\u0438\u043A\u0430\u0446\u0438\u044F', listing: 'Toyota Camry 2019', amount: '\u20BE5.00', status: 'paid' },
  { date: '01.04.2026', type: '\u041F\u0440\u043E\u0434\u043B\u0435\u043D\u0438\u0435', listing: '\u041A\u0432\u0430\u0440\u0442\u0438\u0440\u0430 \u0411\u0430\u0442\u0443\u043C\u0438', amount: '\u20BE3.00', status: 'paid' },
  { date: '15.03.2026', type: '\u041F\u0443\u0431\u043B\u0438\u043A\u0430\u0446\u0438\u044F', listing: 'iPhone 14', amount: '\u20BE5.00', status: 'paid' },
];

function StatusBadge() {
  return (
    <View className="rounded-full px-2.5 py-0.5" style={{ backgroundColor: C.greenBg }}>
      <Text className="text-[11px] font-bold" style={{ color: C.green }}>
        {'\u041E\u043F\u043B\u0430\u0447\u0435\u043D\u043E'}
      </Text>
    </View>
  );
}

// -- State 1: Default --

function DefaultState() {
  return (
    <StateSection title="PAYMENT_HISTORY__DEFAULT">
      <PhoneFrame>
        <View style={{ backgroundColor: C.page, padding: 16, gap: 16 }}>
          <Text className="text-xl font-bold" style={{ color: C.text }}>{'\u0418\u0441\u0442\u043E\u0440\u0438\u044F \u043F\u043B\u0430\u0442\u0435\u0436\u0435\u0439'}</Text>

          <View className="bg-white rounded-lg border border-[#E0E0E0] overflow-hidden">
            {PAYMENTS.map((p, idx) => (
              <View key={idx}>
                <View className="px-4 py-3.5" style={{ gap: 4 }}>
                  <View className="flex-row items-center justify-between">
                    <Text className="text-sm" style={{ color: C.muted }}>
                      {p.date} {'\u00B7'} {p.type}
                    </Text>
                    <StatusBadge />
                  </View>
                  <View className="flex-row items-center justify-between">
                    <Text className="text-sm font-semibold" style={{ color: C.text }} numberOfLines={1}>{p.listing}</Text>
                    <Text className="text-sm font-bold" style={{ color: C.text }}>{p.amount}</Text>
                  </View>
                </View>
                {idx < PAYMENTS.length - 1 && <View className="h-px bg-[#E0E0E0] ml-4" />}
              </View>
            ))}
          </View>
        </View>
      </PhoneFrame>
    </StateSection>
  );
}

// -- State 2: Empty --

function EmptyState() {
  return (
    <StateSection title="PAYMENT_HISTORY__EMPTY">
      <PhoneFrame>
        <View style={{ backgroundColor: C.page, padding: 16, gap: 16 }}>
          <Text className="text-xl font-bold" style={{ color: C.text }}>{'\u0418\u0441\u0442\u043E\u0440\u0438\u044F \u043F\u043B\u0430\u0442\u0435\u0436\u0435\u0439'}</Text>

          <View className="bg-white rounded-lg border border-[#E0E0E0] overflow-hidden">
            <View className="items-center py-10 px-6" style={{ gap: 8 }}>
              <Text className="text-base font-bold" style={{ color: C.text }}>{'\u041D\u0435\u0442 \u043F\u043B\u0430\u0442\u0435\u0436\u0435\u0439'}</Text>
              <Text className="text-sm text-center" style={{ color: C.muted }}>
                {'\u041F\u043B\u0430\u0442\u0435\u0436\u0438 \u043F\u043E\u044F\u0432\u044F\u0442\u0441\u044F \u043F\u043E\u0441\u043B\u0435 \u043F\u0443\u0431\u043B\u0438\u043A\u0430\u0446\u0438\u0438 \u043E\u0431\u044A\u044F\u0432\u043B\u0435\u043D\u0438\u0439'}
              </Text>
            </View>
          </View>
        </View>
      </PhoneFrame>
    </StateSection>
  );
}

// -- Main Export --

export default function PaymentHistoryStates() {
  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 24 }} showsVerticalScrollIndicator={false}>
      <DefaultState />
      <EmptyState />
    </ScrollView>
  );
}
