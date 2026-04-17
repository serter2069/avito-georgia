import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, useWindowDimensions } from 'react-native';

const C = { green: '#00AA6C', white: '#FFFFFF', text: '#1A1A1A', muted: '#737373', border: '#E0E0E0' };

const FAQ: { q: string; a: string }[] = [
  { q: 'Как разместить объявление?', a: 'Нажмите кнопку "+" на главной странице, выберите категорию, заполните форму и нажмите "Опубликовать".' },
  { q: 'Как оплатить продвижение?', a: 'Откройте "Мои объявления", выберите объявление и нажмите "Продвинуть". Оплата картой или Apple Pay.' },
  { q: 'Как написать продавцу?', a: 'Откройте объявление и нажмите кнопку "Написать". Чат доступен в разделе "Сообщения".' },
  { q: 'Как изменить профиль?', a: 'Перейдите в "Настройки" → "Редактировать профиль". Можно изменить имя, фото и контакты.' },
  { q: 'Как удалить объявление?', a: 'Откройте "Мои объявления", нажмите на объявление и выберите "Удалить".' },
];

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

function Help() {
  const [expanded, setExpanded] = useState<number | null>(null);
  const [query, setQuery] = useState('');
  const filtered = FAQ.filter(f => !query || f.q.toLowerCase().includes(query.toLowerCase()) || f.a.toLowerCase().includes(query.toLowerCase()));

  return (
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
              style={{ flex: 1, fontSize: 14, color: C.text, paddingVertical: 11, borderWidth: 0, backgroundColor: 'transparent', outlineWidth: 0 } as any}
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
  );
}

// ─── Privacy ──────────────────────────────────────────────────────────────────

export default Help;
