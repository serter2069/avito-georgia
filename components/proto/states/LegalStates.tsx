import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, useWindowDimensions } from 'react-native';
import { StateSection } from '../StateSection';

function useResponsiveWidth() {
  const { width } = useWindowDimensions();
  return width >= 640 ? 390 : ('100%' as any);
}

// ─── Brand Tokens ────────────────────────────────────────────────────────────
const C = {
  green:   '#00AA6C',
  greenBg: '#E8F9F2',
  white:   '#FFFFFF',
  page:    '#F5F5F5',
  text:    '#1A1A1A',
  muted:   '#737373',
  border:  '#E0E0E0',
  error:   '#D32F2F',
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function AvitoLogo() {
  return (
    <View className="flex-row items-center" style={{ gap: 10 }}>
      <View className="w-10 h-10 rounded-[10px] bg-[#00AA6C] items-center justify-center">
        <Text className="text-white font-extrabold text-xl" style={{ letterSpacing: -0.5, lineHeight: 24 }}>
          A
        </Text>
      </View>
      <View className="flex-row items-baseline" style={{ gap: 1 }}>
        <Text className="font-bold text-[#1A1A1A] text-[22px]" style={{ letterSpacing: -0.3 }}>
          avito
        </Text>
        <Text className="font-semibold text-[#00AA6C] text-[16px]">
          .ge
        </Text>
      </View>
    </View>
  );
}

function PageHeader({ title }: { title: string }) {
  return (
    <View className="bg-white border-b border-[#E0E0E0] px-4 py-3 flex-row items-center" style={{ gap: 12 }}>
      <Text className="text-lg" style={{ lineHeight: 24 }}>◀</Text>
      <Text className="text-lg font-bold text-[#1A1A1A]" style={{ letterSpacing: -0.3 }}>
        {title}
      </Text>
    </View>
  );
}

function DocSection({ heading, body }: { heading: string; body: string }) {
  return (
    <View className="mb-5">
      <Text className="text-[15px] font-bold text-[#1A1A1A] mb-1.5">{heading}</Text>
      <Text className="text-sm text-[#737373] leading-5">{body}</Text>
    </View>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// 1. ABOUT
// ═══════════════════════════════════════════════════════════════════════════════

export function AboutStates() {
  const w = useResponsiveWidth();
  return (
    <StateSection title="ABOUT — Default">
      <View className="bg-[#F5F5F5]" style={{ width: w }}>
        <PageHeader title="О нас" />

        <ScrollView contentContainerStyle={{ padding: 16, gap: 24 }}>
          {/* Logo + mission */}
          <View className="items-center py-6" style={{ gap: 16 }}>
            <AvitoLogo />
            <Text className="text-sm text-[#737373] text-center leading-5 px-4">
              avito.ge — крупнейшая доска объявлений Грузии. Покупка и продажа недвижимости, авто, техники и услуг в 6 городах страны. Мультиязычная платформа на русском, грузинском и английском.
            </Text>
          </View>

          {/* Info card */}
          <View className="bg-white rounded-lg border border-[#E0E0E0] p-4" style={{ gap: 16 }}>
            <View style={{ gap: 4 }}>
              <Text className="text-xs font-semibold text-[#737373] uppercase tracking-wider">Основано</Text>
              <Text className="text-sm font-medium text-[#1A1A1A]">2024, Тбилиси</Text>
            </View>

            <View className="h-px bg-[#E0E0E0]" />

            <View style={{ gap: 4 }}>
              <Text className="text-xs font-semibold text-[#737373] uppercase tracking-wider">Команда</Text>
              <Text className="text-sm text-[#1A1A1A] leading-5">
                Команда avito.ge — специалисты рынка недвижимости и технологий Грузии
              </Text>
            </View>

            <View className="h-px bg-[#E0E0E0]" />

            <View style={{ gap: 4 }}>
              <Text className="text-xs font-semibold text-[#737373] uppercase tracking-wider">Контакт</Text>
              <Text className="text-sm font-medium text-[#00AA6C]">support@avito.ge</Text>
            </View>
          </View>

          {/* Footer links */}
          <View className="flex-row items-center justify-center" style={{ gap: 20 }}>
            <Text className="text-sm font-medium text-[#00AA6C]">Помощь</Text>
            <Text className="text-sm text-[#E0E0E0]">|</Text>
            <Text className="text-sm font-medium text-[#00AA6C]">Политика</Text>
            <Text className="text-sm text-[#E0E0E0]">|</Text>
            <Text className="text-sm font-medium text-[#00AA6C]">Условия</Text>
          </View>
        </ScrollView>
      </View>
    </StateSection>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// 2. HELP / FAQ
// ═══════════════════════════════════════════════════════════════════════════════

const faqItems = [
  { q: 'Как разместить объявление?', a: '1. Нажмите кнопку «Подать объявление» на главной.\n2. Выберите категорию и заполните форму.\n3. Добавьте до 10 фотографий.\n4. Укажите цену и контактные данные.\n5. Нажмите «Опубликовать» — объявление появится после модерации.' },
  { q: 'Как работает OTP-вход?', a: 'Введите email — мы отправим 6-значный код. Введите код для входа. Пароль не нужен.' },
  { q: 'Сколько стоит Premium?', a: 'Premium-размещение стоит от 5 GEL/день. Ваше объявление будет выделено и показано выше в поиске.' },
  { q: 'Как пожаловаться на объявление?', a: 'Нажмите «Пожаловаться» на странице объявления и выберите причину. Модераторы рассмотрят жалобу в течение 24 часов.' },
  { q: 'Как удалить аккаунт?', a: 'Перейдите в Настройки → Удалить аккаунт. Все ваши данные будут удалены в течение 30 дней.' },
];

export function HelpStates() {
  const [expanded, setExpanded] = useState<number | null>(null);
  const w = useResponsiveWidth();

  return (
    <View style={{ gap: 80 }}>
      {/* State 1: Default */}
      <StateSection title="HELP — Default">
        <View className="bg-[#F5F5F5]" style={{ width: w }}>
          <PageHeader title="Помощь" />

          <View style={{ padding: 16, gap: 16 }}>
            {/* Search */}
            <View style={{ backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 8, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, gap: 8 }}>
              <Text style={{ fontSize: 14, color: C.muted }}>Q</Text>
              <TextInput
                placeholder="Поиск по FAQ"
                placeholderTextColor={C.muted}
                editable={false}
                style={{ flex: 1, fontSize: 14, color: '#1A1A1A', paddingVertical: 12, borderWidth: 0, backgroundColor: 'transparent' }}
              />
            </View>

            {/* FAQ list — all collapsed */}
            <View className="bg-white rounded-lg border border-[#E0E0E0] overflow-hidden">
              {faqItems.map((item, idx) => (
                <View key={idx}>
                  <View className="flex-row items-center px-4 py-3.5" style={{ gap: 10 }}>
                    <Text className="text-xs text-[#737373]">▶</Text>
                    <Text className="flex-1 text-sm font-medium text-[#1A1A1A]">{item.q}</Text>
                  </View>
                  {idx < faqItems.length - 1 && <View className="h-px bg-[#E0E0E0] ml-4" />}
                </View>
              ))}
            </View>
          </View>
        </View>
      </StateSection>

      {/* State 2: FAQ item expanded */}
      <StateSection title="HELP — FAQ item expanded">
        <View className="bg-[#F5F5F5]" style={{ width: w }}>
          <PageHeader title="Помощь" />

          <View style={{ padding: 16, gap: 16 }}>
            {/* Search */}
            <View style={{ backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 8, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, gap: 8 }}>
              <Text style={{ fontSize: 14, color: C.muted }}>Q</Text>
              <TextInput
                placeholder="Поиск по FAQ"
                placeholderTextColor={C.muted}
                editable={false}
                style={{ flex: 1, fontSize: 14, color: '#1A1A1A', paddingVertical: 12, borderWidth: 0, backgroundColor: 'transparent' }}
              />
            </View>

            {/* FAQ list — first item expanded */}
            <View className="bg-white rounded-lg border border-[#E0E0E0] overflow-hidden">
              {faqItems.map((item, idx) => {
                const isExpanded = idx === 0;
                return (
                  <View key={idx}>
                    <View className="flex-row items-center px-4 py-3.5" style={{ gap: 10 }}>
                      <Text className="text-xs text-[#737373]">{isExpanded ? '▼' : '▶'}</Text>
                      <Text className={`flex-1 text-sm font-medium ${isExpanded ? 'text-[#00AA6C]' : 'text-[#1A1A1A]'}`}>
                        {item.q}
                      </Text>
                    </View>
                    {isExpanded && (
                      <View className="px-4 pb-4 pt-0 ml-6">
                        <Text className="text-sm text-[#737373] leading-5">{item.a}</Text>
                      </View>
                    )}
                    {idx < faqItems.length - 1 && <View className="h-px bg-[#E0E0E0] ml-4" />}
                  </View>
                );
              })}
            </View>
          </View>
        </View>
      </StateSection>
    </View>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// 3. PRIVACY POLICY
// ═══════════════════════════════════════════════════════════════════════════════

export function PrivacyStates() {
  const w = useResponsiveWidth();
  return (
    <StateSection title="PRIVACY — Default">
      <View className="bg-[#F5F5F5]" style={{ width: w }}>
        <PageHeader title="Политика конфиденциальности" />

        <ScrollView contentContainerStyle={{ padding: 16, gap: 4 }}>
          <Text className="text-xs text-[#737373] mb-4">Обновлено: 01.04.2026</Text>

          <DocSection
            heading="1. Какие данные мы собираем"
            body="Мы собираем email-адрес для аутентификации, данные объявлений (текст, фото, цена), геолокацию города и технические данные устройства для улучшения работы сервиса."
          />

          <DocSection
            heading="2. Как мы используем данные"
            body="Данные используются для работы платформы: публикации объявлений, связи покупателей и продавцов, персонализации поиска и отправки уведомлений о статусе объявлений."
          />

          <DocSection
            heading="3. Передача данных третьим лицам"
            body="Мы не продаём и не передаём персональные данные третьим лицам, за исключением случаев, предусмотренных законодательством Грузии, или с вашего явного согласия."
          />
        </ScrollView>
      </View>
    </StateSection>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// 4. TERMS OF SERVICE
// ═══════════════════════════════════════════════════════════════════════════════

export function TermsStates() {
  const w = useResponsiveWidth();
  return (
    <StateSection title="TERMS — Default">
      <View className="bg-[#F5F5F5]" style={{ width: w }}>
        <PageHeader title="Условия использования" />

        <ScrollView contentContainerStyle={{ padding: 16, gap: 4 }}>
          <DocSection
            heading="1. Общие положения"
            body="Настоящие условия регулируют использование платформы avito.ge. Регистрируясь, вы соглашаетесь с данными условиями. Платформа предоставляет сервис размещения объявлений на территории Грузии."
          />

          <DocSection
            heading="2. Правила размещения объявлений"
            body="Объявление должно содержать достоверную информацию, реальные фотографии и актуальную цену. Запрещено дублирование одного и того же товара или услуги."
          />

          <DocSection
            heading="3. Запрещённый контент"
            body="Запрещены объявления о продаже оружия, наркотиков, контрафактных товаров, а также материалы, нарушающие законодательство Грузии или права третьих лиц."
          />

          <DocSection
            heading="4. Платные услуги"
            body="Premium-размещение, поднятие в поиске и выделение цветом — платные услуги. Оплата производится через встроенные платёжные системы. Возврат средств возможен в течение 24 часов."
          />

          <DocSection
            heading="5. Ответственность сторон"
            body="Платформа не несёт ответственности за качество товаров и услуг, размещённых пользователями. Все сделки совершаются между пользователями напрямую. Мы оставляем за собой право блокировать аккаунты, нарушающие правила."
          />
        </ScrollView>
      </View>
    </StateSection>
  );
}

// ─── Default export ──────────────────────────────────────────────────────────
export default AboutStates;
