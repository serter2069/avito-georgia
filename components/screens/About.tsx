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
    <View style={{ backgroundColor: C.white, maxWidth: isDesktop ? 700 : undefined, width: '100%', alignSelf: isDesktop ? 'center' : undefined }}>
      {children}
    </View>
  );
}

// ─── About ───────────────────────────────────────────────────────────────────

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
    <View style={{ backgroundColor: C.white, maxWidth: isDesktop ? 700 : undefined, width: '100%', alignSelf: isDesktop ? 'center' : undefined }}>
      {children}
    </View>
  );
}

// ─── About ───────────────────────────────────────────────────────────────────

function About() {
  return (
    <StateSection title="ABOUT">
      <PageWrapper>
        <PageHeader title="О нас" />
        <View style={{ padding: 24, gap: 24 }}>
          <View style={{ alignItems: 'center', gap: 12 }}>
            <AvitoLogo />
            <Text style={{ fontSize: 14, color: C.muted, textAlign: 'center', lineHeight: 21, maxWidth: 320 }}>
              avito.ge — крупнейшая доска объявлений Грузии. Покупка и продажа недвижимости, авто, техники и услуг в 6 городах страны.
            </Text>
          </View>
          <View style={{ backgroundColor: C.white, borderRadius: 10, borderWidth: 1, borderColor: C.border, padding: 16, gap: 14 }}>
            <View style={{ gap: 3 }}>
              <Text style={{ fontSize: 11, fontWeight: '700', color: C.muted, textTransform: 'uppercase', letterSpacing: 0.8 }}>Основано</Text>
              <Text style={{ fontSize: 14, fontWeight: '600', color: C.text }}>2026, Тбилиси</Text>
            </View>
            <View style={{ height: 1, backgroundColor: C.border }} />
            <View style={{ gap: 3 }}>
              <Text style={{ fontSize: 11, fontWeight: '700', color: C.muted, textTransform: 'uppercase', letterSpacing: 0.8 }}>Команда</Text>
              <Text style={{ fontSize: 14, color: C.text, lineHeight: 20 }}>Специалисты рынка недвижимости и технологий Грузии</Text>
            </View>
            <View style={{ height: 1, backgroundColor: C.border }} />
            <View style={{ gap: 3 }}>
              <Text style={{ fontSize: 11, fontWeight: '700', color: C.muted, textTransform: 'uppercase', letterSpacing: 0.8 }}>Контакт</Text>
              <Text style={{ fontSize: 14, fontWeight: '600', color: C.green }}>support@avito.ge</Text>
            </View>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 20 }}>
            <Text style={{ fontSize: 14, fontWeight: '600', color: C.green }}>Помощь</Text>
            <Text style={{ color: C.border }}>|</Text>
            <Text style={{ fontSize: 14, fontWeight: '600', color: C.green }}>Политика</Text>
            <Text style={{ color: C.border }}>|</Text>
            <Text style={{ fontSize: 14, fontWeight: '600', color: C.green }}>Условия</Text>
          </View>
        </View>
      </PageWrapper>
    </StateSection>
  );
}

// ─── Help / FAQ ───────────────────────────────────────────────────────────────

const FAQ = [
  { q: 'Как разместить объявление?', a: 'Нажмите «Подать объявление» на главной. Выберите категорию, заполните форму, добавьте до 10 фотографий и нажмите «Опубликовать».' },
  { q: 'Как работает OTP-вход?', a: 'Введите email — придёт 6-значный код. Введите код для входа. Пароль не нужен. В разработке: код всегда 000000.' },
  { q: 'Бесплатно ли размещение?', a: 'Первые 3 объявления в категории бесплатны. Новое объявление сверх лимита — ₾5, продление истёкшего — ₾3.' },
  { q: 'Как пожаловаться на объявление?', a: 'Нажмите «Пожаловаться» на странице объявления, выберите причину. Модераторы рассмотрят в течение 24 часов.' },
  { q: 'Как удалить аккаунт?', a: 'Настройки → Удалить аккаунт. Все данные удаляются в течение 30 дней.' },
  { q: 'Как связаться с продавцом?', a: 'На странице объявления нажмите «Написать продавцу» — откроется чат. Также можно позвонить, если продавец указал телефон.' },
];

export default About;
