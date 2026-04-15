import React, { useState } from 'react';
import { View, Text, TextInput, ActivityIndicator, Pressable, useWindowDimensions } from 'react-native';
import { StateSection } from '../StateSection';
import BottomNav from '../BottomNav';

const C = {
  green: '#00AA6C',
  greenBg: '#E8F9F2',
  white: '#FFFFFF',
  text: '#1A1A1A',
  muted: '#9E9E9E',
  border: '#E8E8E8',
  page: '#F5F5F5',
  error: '#D32F2F',
};

function FormFrame({ children }: { children: React.ReactNode }) {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 640;
  return (
    <View style={isDesktop
      ? { maxWidth: 480, alignSelf: 'center', width: '100%', backgroundColor: C.white, borderRadius: 12, borderWidth: 1, borderColor: C.border, overflow: 'hidden' }
      : { backgroundColor: C.white }
    }>
      {children}
    </View>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: C.border, gap: 10 }}>
      <Pressable>
        <Text style={{ fontSize: 20, color: C.muted }}>{'<'}</Text>
      </Pressable>
      <Text style={{ fontSize: 17, fontWeight: '700', color: C.text }}>{title}</Text>
    </View>
  );
}

function CheckoutContent() {
  const [cardNum, setCardNum] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  return (
    <View style={{ padding: 16, gap: 16 }}>
      {/* Amount block */}
      <View style={{ backgroundColor: C.greenBg, borderRadius: 10, padding: 16, alignItems: 'center' }}>
        <Text style={{ fontSize: 32, fontWeight: '800', color: C.text }}>₾5.00</Text>
        <Text style={{ fontSize: 14, color: C.muted, marginTop: 4 }}>Публикация объявления</Text>
        <Text style={{ fontSize: 13, color: C.muted, marginTop: 2 }}>Toyota Camry 2019, 45 000 км</Text>
      </View>

      {/* Card fields */}
      <View style={{ gap: 10 }}>
        <Text style={{ fontSize: 13, fontWeight: '600', color: C.text }}>Данные карты</Text>
        <View style={{ borderWidth: 1, borderColor: C.border, borderRadius: 8 }}>
          <TextInput
            value={cardNum}
            onChangeText={setCardNum}
            placeholder="Номер карты"
            placeholderTextColor={C.muted}
            keyboardType="numeric"
            maxLength={19}
            style={{ borderWidth: 0, backgroundColor: 'transparent', paddingHorizontal: 12, paddingVertical: 10, fontSize: 15, color: C.text, outlineWidth: 0 } as any}
          />
        </View>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <View style={{ flex: 1, borderWidth: 1, borderColor: C.border, borderRadius: 8 }}>
            <TextInput
              value={expiry}
              onChangeText={setExpiry}
              placeholder="MM / ГГ"
              placeholderTextColor={C.muted}
              keyboardType="numeric"
              maxLength={5}
              style={{ borderWidth: 0, backgroundColor: 'transparent', paddingHorizontal: 12, paddingVertical: 10, fontSize: 15, color: C.text, outlineWidth: 0 } as any}
            />
          </View>
          <View style={{ flex: 1, borderWidth: 1, borderColor: C.border, borderRadius: 8 }}>
            <TextInput
              value={cvv}
              onChangeText={setCvv}
              placeholder="CVV"
              placeholderTextColor={C.muted}
              keyboardType="numeric"
              maxLength={4}
              secureTextEntry
              style={{ borderWidth: 0, backgroundColor: 'transparent', paddingHorizontal: 12, paddingVertical: 10, fontSize: 15, color: C.text, outlineWidth: 0 } as any}
            />
          </View>
        </View>
      </View>

      <Pressable style={{ backgroundColor: C.green, borderRadius: 8, paddingVertical: 14, alignItems: 'center' }}>
        <Text style={{ color: C.white, fontWeight: '700', fontSize: 16 }}>Оплатить ₾5.00</Text>
      </Pressable>

      <Text style={{ fontSize: 11, color: C.muted, textAlign: 'center' }}>
        Защищённый платёж. Данные карты не сохраняются.
      </Text>
    </View>
  );
}

function LoadingState() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 640;

  return (
    <StateSection title="PAYMENT / Loading">
      <FormFrame>
        <SectionHeader title="Оплата" />
        <View style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: 80 }}>
          <ActivityIndicator size="large" color={C.green} />
          <Text style={{ fontSize: 14, color: C.muted, marginTop: 14 }}>Перенаправление на оплату...</Text>
        </View>
        {!isDesktop && <BottomNav />}
      </FormFrame>
    </StateSection>
  );
}

export function PaymentCheckout() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 640;

  return (
    <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <FormFrame>
        <SectionHeader title="Оплата" />
        <CheckoutContent />
        {!isDesktop && <BottomNav />}
      </FormFrame>
    </View>
  );
}

function SuccessState() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 640;

  return (
    <StateSection title="PAYMENT / Success">
      <FormFrame>
        <SectionHeader title="Оплата" />
        <View style={{ alignItems: 'center', paddingVertical: 56, paddingHorizontal: 24, gap: 12 }}>
          <View style={{
            width: 68, height: 68, borderRadius: 34,
            borderWidth: 3, borderColor: C.green,
            alignItems: 'center', justifyContent: 'center',
          }}>
            <Text style={{ fontSize: 30, color: C.green, fontWeight: '700', lineHeight: 34 }}>✓</Text>
          </View>
          <Text style={{ fontSize: 18, fontWeight: '700', color: C.text }}>Оплата прошла!</Text>
          <Text style={{ fontSize: 13, color: C.muted, textAlign: 'center', lineHeight: 20 }}>
            Ваше объявление отправлено на проверку.{'\n'}Обычно это занимает до 2 часов.
          </Text>
          <Pressable style={{ backgroundColor: C.green, borderRadius: 8, paddingHorizontal: 32, paddingVertical: 12, marginTop: 8 }}>
            <Text style={{ color: C.white, fontWeight: '700', fontSize: 15 }}>Перейти к объявлениям</Text>
          </Pressable>
        </View>
        {!isDesktop && <BottomNav />}
      </FormFrame>
    </StateSection>
  );
}

function ErrorState() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 640;

  return (
    <StateSection title="PAYMENT / Error">
      <FormFrame>
        <SectionHeader title="Оплата" />
        <View style={{ alignItems: 'center', paddingVertical: 56, paddingHorizontal: 24, gap: 12 }}>
          <View style={{
            width: 68, height: 68, borderRadius: 34,
            borderWidth: 3, borderColor: C.error,
            alignItems: 'center', justifyContent: 'center',
          }}>
            <Text style={{ fontSize: 30, color: C.error, fontWeight: '700', lineHeight: 34 }}>x</Text>
          </View>
          <Text style={{ fontSize: 18, fontWeight: '700', color: C.text }}>Оплата не прошла</Text>
          <Text style={{ fontSize: 13, color: C.muted, textAlign: 'center', lineHeight: 20 }}>
            Попробуйте другую карту или обратитесь в банк.
          </Text>
          <Pressable style={{ backgroundColor: C.green, borderRadius: 8, paddingHorizontal: 32, paddingVertical: 12, marginTop: 8 }}>
            <Text style={{ color: C.white, fontWeight: '700', fontSize: 15 }}>Попробовать снова</Text>
          </Pressable>
        </View>
        {!isDesktop && <BottomNav />}
      </FormFrame>
    </StateSection>
  );
}

export default function PaymentStates() {
  return (
    <View style={{ gap: 0 }}>
      <LoadingState />
      <StateSection title="PAYMENT / Checkout"><PaymentCheckout /></StateSection>
      <SuccessState />
      <ErrorState />
    </View>
  );
}
