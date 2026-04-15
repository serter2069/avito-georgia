import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, useWindowDimensions } from 'react-native';
import { StateSection } from '../StateSection';

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

export function AboutStates() {
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

export function HelpStates() {
  const [expanded, setExpanded] = useState<number | null>(null);
  const [query, setQuery] = useState('');
  const filtered = FAQ.filter(f => !query || f.q.toLowerCase().includes(query.toLowerCase()) || f.a.toLowerCase().includes(query.toLowerCase()));

  return (
    <StateSection title="HELP">
      <PageWrapper>
        <PageHeader title="Помощь" />
        <View style={{ padding: 16, gap: 14 }}>
          {/* Search */}
          <View style={{ flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: C.border, borderRadius: 8, paddingHorizontal: 12, gap: 8, backgroundColor: C.white }}>
            <Text style={{ fontSize: 14, color: C.muted }}>&#8981;</Text>
            <TextInput
              placeholder="Поиск по FAQ"
              placeholderTextColor={C.muted}
              value={query}
              onChangeText={setQuery}
              style={{ flex: 1, fontSize: 14, color: C.text, paddingVertical: 11, borderWidth: 0, backgroundColor: 'transparent', outlineWidth: 0 }}
            />
          </View>
          {/* FAQ list */}
          <View style={{ borderRadius: 10, borderWidth: 1, borderColor: C.border, overflow: 'hidden', backgroundColor: C.white }}>
            {filtered.length === 0 ? (
              <View style={{ padding: 20, alignItems: 'center' }}>
                <Text style={{ fontSize: 14, color: C.muted }}>Ничего не найдено</Text>
              </View>
            ) : filtered.map((item, idx) => {
              const isOpen = expanded === idx;
              return (
                <View key={idx}>
                  <Pressable
                    onPress={() => setExpanded(isOpen ? null : idx)}
                    style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, gap: 10 }}
                  >
                    <Text style={{ fontSize: 12, color: isOpen ? C.green : C.muted, width: 12 }}>{isOpen ? '▼' : '▶'}</Text>
                    <Text style={{ flex: 1, fontSize: 14, fontWeight: '600', color: isOpen ? C.green : C.text }}>{item.q}</Text>
                  </Pressable>
                  {isOpen && (
                    <View style={{ paddingHorizontal: 16, paddingBottom: 14, paddingLeft: 38 }}>
                      <Text style={{ fontSize: 14, color: C.muted, lineHeight: 21 }}>{item.a}</Text>
                    </View>
                  )}
                  {idx < filtered.length - 1 && <View style={{ height: 1, backgroundColor: C.border, marginLeft: 16 }} />}
                </View>
              );
            })}
          </View>
          {/* Contact CTA */}
          <View style={{ padding: 16, borderRadius: 10, borderWidth: 1, borderColor: C.border, backgroundColor: C.white, gap: 8 }}>
            <Text style={{ fontSize: 14, fontWeight: '700', color: C.text }}>Не нашли ответ?</Text>
            <Text style={{ fontSize: 13, color: C.muted }}>Напишите нам на support@avito.ge</Text>
            <Pressable style={{ marginTop: 4, backgroundColor: C.green, borderRadius: 8, paddingVertical: 11, alignItems: 'center' }}>
              <Text style={{ color: '#fff', fontWeight: '700', fontSize: 14 }}>Написать в поддержку</Text>
            </Pressable>
          </View>
        </View>
      </PageWrapper>
    </StateSection>
  );
}

// ─── Privacy ──────────────────────────────────────────────────────────────────

export function PrivacyStates() {
  return (
    <StateSection title="PRIVACY">
      <PageWrapper>
        <PageHeader title="Политика конфиденциальности" />
        <View style={{ padding: 24 }}>
          <Text style={{ fontSize: 12, color: C.muted, marginBottom: 20 }}>Обновлено: 01.01.2026</Text>
          <DocSection heading="1. Какие данные мы собираем" body="Email-адрес для аутентификации, данные объявлений (текст, фото, цена), геолокацию города и технические данные устройства для улучшения работы сервиса." />
          <DocSection heading="2. Как мы используем данные" body="Данные используются для работы платформы: публикации объявлений, связи покупателей и продавцов, персонализации поиска и отправки уведомлений о статусе объявлений." />
          <DocSection heading="3. Передача данных третьим лицам" body="Мы не продаём и не передаём персональные данные третьим лицам, за исключением случаев, предусмотренных законодательством Грузии, или с вашего явного согласия." />
          <DocSection heading="4. Хранение данных" body="Данные хранятся на защищённых серверах. При удалении аккаунта все персональные данные удаляются в течение 30 дней." />
        </View>
      </PageWrapper>
    </StateSection>
  );
}

// ─── Terms ────────────────────────────────────────────────────────────────────

export function TermsStates() {
  return (
    <StateSection title="TERMS">
      <PageWrapper>
        <PageHeader title="Условия использования" />
        <View style={{ padding: 24 }}>
          <DocSection heading="1. Общие положения" body="Настоящие условия регулируют использование платформы avito.ge. Регистрируясь, вы соглашаетесь с данными условиями. Платформа предоставляет сервис размещения объявлений на территории Грузии." />
          <DocSection heading="2. Правила размещения" body="Объявление должно содержать достоверную информацию, реальные фотографии и актуальную цену. Запрещено дублирование одного и того же товара." />
          <DocSection heading="3. Запрещённый контент" body="Запрещены объявления о продаже оружия, наркотиков, контрафактных товаров, а также материалы, нарушающие законодательство Грузии." />
          <DocSection heading="4. Платные услуги" body="3 объявления в категории — бесплатно. Новое объявление сверх лимита: ₾5. Продление истёкшего: ₾3. Оплата через Stripe. Возврат — в течение 24 часов." />
          <DocSection heading="5. Ответственность" body="Платформа не несёт ответственности за качество товаров. Сделки совершаются между пользователями напрямую. Мы вправе блокировать аккаунты, нарушающие правила." />
        </View>
      </PageWrapper>
    </StateSection>
  );
}

export default AboutStates;
