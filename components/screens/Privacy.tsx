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

function Privacy() {
  return (
    <PageWrapper>
      <View style={{ padding: 24 }}>
        <Text style={{ fontSize: 12, color: C.muted, marginBottom: 20 }}>Обновлено: 01.01.2026</Text>
        <DocSection heading="1. Какие данные мы собираем" body="Email-адрес для аутентификации, данные объявлений (текст, фото, цена), геолокацию города и технические данные устройства для улучшения работы сервиса." />
        <DocSection heading="2. Как мы используем данные" body="Данные используются для работы платформы: публикации объявлений, связи покупателей и продавцов, персонализации поиска и отправки уведомлений о статусе объявлений." />
        <DocSection heading="3. Передача данных третьим лицам" body="Мы не продаём и не передаём персональные данные третьим лицам, за исключением случаев, предусмотренных законодательством Грузии, или с вашего явного согласия." />
        <DocSection heading="4. Хранение данных" body="Данные хранятся на защищённых серверах. При удалении аккаунта все персональные данные удаляются в течение 30 дней." />
      </View>
    </PageWrapper>
  );
}

// ─── Terms ────────────────────────────────────────────────────────────────────

export default Privacy;
