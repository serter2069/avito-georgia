import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
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

const options = [
  { id: 'vip', name: 'VIP', price: '₾14.99/7 дней', desc: 'Топ поиска, выделение рамкой' },
  { id: 'raise', name: 'Поднять', price: '₾4.99', desc: 'Вернуть в начало ленты' },
  { id: 'top', name: 'Топ слот', price: '₾9.99/3 дня', desc: 'Специальный блок на главной' },
];

// ─── State 1: Default ─────────────────────────────────────────────────────────

function DefaultState() {
  const [selected, setSelected] = useState('raise');

  return (
    <StateSection title="PROMOTE_LISTING_DEFAULT">
      <View style={{ maxWidth: 390, backgroundColor: C.page, padding: 16, gap: 16 }}>
        <Text className="text-xl font-bold text-[#1A1A1A]">Продвижение объявления</Text>

        {/* Listing preview */}
        <Card style={{ padding: 12, flexDirection: 'row', gap: 12, alignItems: 'center' }}>
          <View className="w-14 h-14 rounded-md bg-[#E0E0E0] items-center justify-center">
            <Text className="text-2xl">🚗</Text>
          </View>
          <View className="flex-1">
            <Text className="text-sm font-semibold text-[#1A1A1A]">Toyota Camry 2019</Text>
            <Text className="text-base font-bold text-[#00AA6C]">$12,500</Text>
          </View>
        </Card>

        {/* Options */}
        <View style={{ gap: 10 }}>
          {options.map((opt) => {
            const isSelected = selected === opt.id;
            return (
              <Pressable key={opt.id} onPress={() => setSelected(opt.id)}>
                <Card style={{
                  padding: 14,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 12,
                  borderColor: isSelected ? C.green : C.border,
                  borderWidth: isSelected ? 2 : 1,
                }}>
                  {/* Radio */}
                  <View
                    className="w-5 h-5 rounded-full border-2 items-center justify-center"
                    style={{ borderColor: isSelected ? C.green : C.border }}
                  >
                    {isSelected && <View className="w-2.5 h-2.5 rounded-full bg-[#00AA6C]" />}
                  </View>
                  <View className="flex-1">
                    <View className="flex-row items-center justify-between">
                      <Text className="text-sm font-bold text-[#1A1A1A]">{opt.name}</Text>
                      <Text className="text-sm font-bold text-[#00AA6C]">{opt.price}</Text>
                    </View>
                    <Text className="text-xs text-[#737373] mt-0.5">{opt.desc}</Text>
                  </View>
                </Card>
              </Pressable>
            );
          })}
        </View>

        {/* CTA */}
        <View className="bg-[#00AA6C] rounded-md py-3.5 items-center">
          <Text className="text-white font-bold text-[15px]">Продолжить</Text>
        </View>
      </View>
    </StateSection>
  );
}

// ─── State 2: Payment step ────────────────────────────────────────────────────

function PaymentState() {
  return (
    <StateSection title="PROMOTE_LISTING_PAYMENT">
      <View style={{ maxWidth: 390, backgroundColor: C.page, padding: 16, gap: 16 }}>
        <Text className="text-xl font-bold text-[#1A1A1A]">Оплата продвижения</Text>

        {/* Selected plan summary */}
        <Card style={{ padding: 14, flexDirection: 'row', alignItems: 'center', gap: 12, borderColor: C.green, borderWidth: 2 }}>
          <View className="w-5 h-5 rounded-full border-2 border-[#00AA6C] items-center justify-center">
            <View className="w-2.5 h-2.5 rounded-full bg-[#00AA6C]" />
          </View>
          <View className="flex-1">
            <View className="flex-row items-center justify-between">
              <Text className="text-sm font-bold text-[#1A1A1A]">Поднять</Text>
              <Text className="text-sm font-bold text-[#00AA6C]">₾4.99</Text>
            </View>
            <Text className="text-xs text-[#737373] mt-0.5">Вернуть в начало ленты</Text>
          </View>
        </Card>

        {/* Stripe form */}
        <Card style={{ padding: 20, gap: 16 }}>
          <View style={{ gap: 6 }}>
            <Text className="text-sm font-medium text-[#1A1A1A]">Номер карты</Text>
            <View className="bg-[#F5F5F5] rounded-md py-3 px-3 border border-[#E0E0E0]">
              <Text className="text-sm text-[#737373]">4242 4242 4242 4242</Text>
            </View>
          </View>

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

          <View className="bg-[#00AA6C] rounded-md py-3.5 items-center">
            <Text className="text-white font-bold text-[15px]">Оплатить ₾4.99</Text>
          </View>

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

export default function PromoteListingStates() {
  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 24 }} showsVerticalScrollIndicator={false}>
      <DefaultState />
      <PaymentState />
    </ScrollView>
  );
}
