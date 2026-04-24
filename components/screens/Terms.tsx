import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, useWindowDimensions } from 'react-native';

const C = { green: '#00AA6C', white: '#FFFFFF', text: '#1A1A1A', muted: '#737373', border: '#E0E0E0' };

function PageHeader({ title }: { title: string }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: C.white, borderBottomWidth: 1, borderBottomColor: C.border, paddingHorizontal: 16, paddingVertical: 13 }}>
      <Text style={{ fontSize: 18, color: C.muted }}>‹</Text>
      <Text style={{ fontSize: 17, fontWeight: '700', color: C.text }}>{title}</Text>
    </View>
  );
}

function DocSection({ heading, body }: { heading: string; body: string }) {
  return (
    <View style={{ marginBottom: 20 }}>
      <Text style={{ fontSize: 15, fontWeight: '700', color: C.text, marginBottom: 6 }}>{heading}</Text>
      <Text style={{ fontSize: 14, color: C.muted, lineHeight: 21 }}>{body}</Text>
    </View>
  );
}

function AvitoLogo() {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
      <View style={{ width: 36, height: 36, borderRadius: 9, backgroundColor: C.green, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: '#fff', fontWeight: '800', fontSize: 20 }}>A</Text>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 1 }}>
        <Text style={{ fontWeight: '700', fontSize: 20, color: C.text }}>avito</Text>
        <Text style={{ fontWeight: '600', fontSize: 14, color: C.green }}>.ge</Text>
      </View>
    </View>
  );
}

function PageWrapper({ children }: { children: React.ReactNode }) {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 640;
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: C.white }}
      contentContainerStyle={{ maxWidth: isDesktop ? 700 : undefined, width: '100%', alignSelf: isDesktop ? 'center' : undefined, paddingBottom: 80 }}
    >
      {children}
    </ScrollView>
  );
}

// ─── About ───────────────────────────────────────────────────────────────────

function Terms() {
  return (
    <PageWrapper>
      <View style={{ padding: 24 }}>
        <DocSection heading="1. Общие положения" body="Настоящие условия регулируют использование платформы avito.ge. Регистрируясь, вы соглашаетесь с данными условиями. Платформа предоставляет сервис размещения объявлений на территории Грузии." />
        <DocSection heading="2. Правила размещения" body="Объявление должно содержать достоверную информацию, реальные фотографии и актуальную цену. Запрещено дублирование одного и того же товара." />
        <DocSection heading="3. Запрещённый контент" body="Запрещены объявления о продаже оружия, наркотиков, контрафактных товаров, а также материалы, нарушающие законодательство Грузии." />
        <DocSection heading="4. Платные услуги" body="3 объявления в категории — бесплатно. Новое объявление сверх лимита: ₾5. Продление истёкшего: ₾3. Оплата через Stripe. Возврат — в течение 24 часов." />
        <DocSection heading="5. Ответственность" body="Платформа не несёт ответственности за качество товаров. Сделки совершаются между пользователями напрямую. Мы вправе блокировать аккаунты, нарушающие правила." />
      </View>
    </PageWrapper>
  );
}

export default Terms;
