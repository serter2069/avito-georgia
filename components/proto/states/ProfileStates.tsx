import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, useWindowDimensions } from 'react-native';
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

function PhotoEditor() {
  const [showOptions, setShowOptions] = useState(false);
  const [hasPhoto, setHasPhoto] = useState(false);
  return (
    <View style={{ alignItems: 'center', paddingVertical: 12, gap: 10 }}>
      <Pressable onPress={() => setShowOptions(!showOptions)} style={{ position: 'relative' }}>
        {hasPhoto ? (
          <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: '#B2DFDB', alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 11, color: '#00695C', fontWeight: '600' }}>фото</Text>
          </View>
        ) : (
          <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: C.green, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: '#fff', fontWeight: '700', fontSize: 26 }}>ГК</Text>
          </View>
        )}
        {/* Camera badge */}
        <View style={{ position: 'absolute', bottom: 0, right: 0, width: 26, height: 26, borderRadius: 13, backgroundColor: '#1A1A1A', borderWidth: 2, borderColor: '#fff', alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: '#fff', fontSize: 12 }}>+</Text>
        </View>
      </Pressable>
      <Pressable onPress={() => setShowOptions(!showOptions)}>
        <Text style={{ fontSize: 14, color: C.green, fontWeight: '600' }}>Сменить фото</Text>
      </Pressable>
      {showOptions && (
        <View style={{ borderWidth: 1, borderColor: C.border, borderRadius: 10, overflow: 'hidden', width: '100%', backgroundColor: C.white }}>
          {[
            { label: 'Сделать фото', action: () => { setHasPhoto(true); setShowOptions(false); } },
            { label: 'Выбрать из галереи', action: () => { setHasPhoto(true); setShowOptions(false); } },
            { label: 'Удалить фото', action: () => { setHasPhoto(false); setShowOptions(false); }, red: true },
          ].map((opt, i) => (
            <Pressable key={i} onPress={opt.action} style={{ paddingVertical: 13, paddingHorizontal: 16, borderTopWidth: i > 0 ? 1 : 0, borderTopColor: C.border }}>
              <Text style={{ fontSize: 15, color: opt.red ? '#D32F2F' : C.text, textAlign: 'center' }}>{opt.label}</Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}

function Avatar({ initials, size = 72 }: { initials: string; size?: number }) {
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: C.green,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text style={{ color: C.white, fontWeight: '700', fontSize: size * 0.3 }}>{initials}</Text>
    </View>
  );
}

function StatBox({ value, label }: { value: string; label: string }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', paddingVertical: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: '700', color: C.text }}>{value}</Text>
      <Text style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>{label}</Text>
    </View>
  );
}

// -- State 1: View mode --

function ViewModeState() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 640;

  const profileCard = (
    <View style={{ backgroundColor: C.white, borderRadius: 12, overflow: 'hidden', flex: isDesktop ? 1 : undefined }}>
      {/* Avatar + name */}
      <View style={{ alignItems: 'center', paddingTop: 28, paddingBottom: 20, paddingHorizontal: 20, gap: 8 }}>
        <Avatar initials="ГК" size={80} />
        <Text style={{ fontSize: 18, fontWeight: '700', color: C.text, marginTop: 4 }}>Георгий Каландадзе</Text>
        <Text style={{ fontSize: 14, color: C.muted }}>g.kalandadze@gmail.com</Text>
        <Text style={{ fontSize: 14, color: C.muted }}>+995 555 123 456</Text>
        <Text style={{ fontSize: 13, color: C.muted, marginTop: 2 }}>Участник с января 2024</Text>
      </View>

      {/* Divider */}
      <View style={{ height: 1, backgroundColor: C.border, marginHorizontal: 16 }} />

      {/* Stats row */}
      <View style={{ flexDirection: 'row' }}>
        <StatBox value="12" label="объявлений" />
        <View style={{ width: 1, backgroundColor: C.border, marginVertical: 12 }} />
        <StatBox value="38 000 ₾" label="продано" />
        <View style={{ width: 1, backgroundColor: C.border, marginVertical: 12 }} />
        <StatBox value="9" label="отзывов" />
      </View>

      {/* Edit button */}
      <View style={{ paddingHorizontal: 16, paddingBottom: 20 }}>
        <Pressable
          style={{
            borderWidth: 1,
            borderColor: C.green,
            borderRadius: 8,
            paddingVertical: 11,
            alignItems: 'center',
          }}
        >
          <Text style={{ color: C.green, fontWeight: '600', fontSize: 15 }}>Редактировать профиль</Text>
        </Pressable>
      </View>
    </View>
  );

  const statsPanel = (
    <View style={{ flex: 1, gap: 12 }}>
      {/* Active listings */}
      <View style={{ backgroundColor: C.white, borderRadius: 12, padding: 16 }}>
        <Text style={{ fontSize: 13, color: C.muted, marginBottom: 8, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 }}>
          Активные объявления
        </Text>
        {['Toyota Camry 2019 — 45 000 ₾', 'iPhone 14 Pro — 2 400 ₾', 'Квартира 3-ком, Батуми — 85 000 ₾'].map((item, i) => (
          <View key={i} style={{ paddingVertical: 10, borderTopWidth: i > 0 ? 1 : 0, borderTopColor: C.border }}>
            <Text style={{ fontSize: 14, color: C.text }}>{item}</Text>
          </View>
        ))}
      </View>

      {/* Recent reviews */}
      <View style={{ backgroundColor: C.white, borderRadius: 12, padding: 16 }}>
        <Text style={{ fontSize: 13, color: C.muted, marginBottom: 8, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 }}>
          Последние отзывы
        </Text>
        {[
          { name: 'Анна К.', text: 'Отличный продавец, рекомендую!' },
          { name: 'Михаил Р.', text: 'Быстрая сделка, всё как описано.' },
        ].map((r, i) => (
          <View key={i} style={{ paddingVertical: 10, borderTopWidth: i > 0 ? 1 : 0, borderTopColor: C.border }}>
            <Text style={{ fontSize: 14, fontWeight: '600', color: C.text }}>{r.name}</Text>
            <Text style={{ fontSize: 13, color: C.muted, marginTop: 2 }}>{r.text}</Text>
          </View>
        ))}
      </View>
    </View>
  );

  return (
    <StateSection title="PROFILE__VIEW">
      <View style={{ backgroundColor: C.page, borderRadius: 12, overflow: 'hidden' }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={isDesktop ? { flexDirection: 'row', padding: 20, gap: 16, alignItems: 'flex-start' } : { padding: 12, gap: 12 }}>
            {profileCard}
            {isDesktop && statsPanel}
          </View>
          {!isDesktop && <View style={{ paddingHorizontal: 12, paddingBottom: 0, gap: 12 }}>{statsPanel}</View>}
          {!isDesktop && <View style={{ height: 12 }} />}
        </ScrollView>
        {!isDesktop && <BottomNav active="profile" />}
      </View>
    </StateSection>
  );
}

// -- State 2: Edit mode --

function EditModeState() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 640;
  const [name, setName] = useState('Георгий Каландадзе');
  const [phone, setPhone] = useState('+995 555 123 456');

  const form = (
    <View style={{ backgroundColor: C.white, borderRadius: 12, padding: 20, gap: 16, flex: isDesktop ? undefined : undefined, maxWidth: isDesktop ? 480 : undefined, alignSelf: isDesktop ? 'center' : undefined, width: isDesktop ? '100%' : undefined }}>
      <Text style={{ fontSize: 18, fontWeight: '700', color: C.text }}>Редактировать профиль</Text>

      <PhotoEditor />

      {/* Name */}
      <View style={{ gap: 6 }}>
        <Text style={{ fontSize: 13, fontWeight: '600', color: C.text }}>Имя</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          style={{ borderWidth: 1, borderColor: C.border, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, fontSize: 15, color: C.text, outlineWidth: 0 }}
        />
      </View>

      {/* Email (read-only) */}
      <View style={{ gap: 6 }}>
        <Text style={{ fontSize: 13, fontWeight: '600', color: C.text }}>Email</Text>
        <View style={{ borderWidth: 1, borderColor: C.border, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, backgroundColor: '#FAFAFA' }}>
          <Text style={{ fontSize: 15, color: C.muted }}>g.kalandadze@gmail.com</Text>
        </View>
        <Text style={{ fontSize: 12, color: C.muted }}>Email нельзя изменить</Text>
      </View>

      {/* Phone */}
      <View style={{ gap: 6 }}>
        <Text style={{ fontSize: 13, fontWeight: '600', color: C.text }}>Телефон</Text>
        <TextInput
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          placeholder="+995 5XX XXX XXX"
          placeholderTextColor={C.muted}
          style={{ borderWidth: 1, borderColor: C.border, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, fontSize: 15, color: C.text, outlineWidth: 0 }}
        />
      </View>

      {/* Buttons */}
      <View style={{ flexDirection: 'row', gap: 12, marginTop: 4 }}>
        <Pressable style={{ flex: 1, backgroundColor: C.green, borderRadius: 8, paddingVertical: 13, alignItems: 'center' }}>
          <Text style={{ color: C.white, fontWeight: '700', fontSize: 15 }}>Сохранить</Text>
        </Pressable>
        <Pressable style={{ flex: 1, borderWidth: 1, borderColor: C.border, borderRadius: 8, paddingVertical: 13, alignItems: 'center' }}>
          <Text style={{ color: C.muted, fontWeight: '600', fontSize: 15 }}>Отмена</Text>
        </Pressable>
      </View>
    </View>
  );

  return (
    <StateSection title="PROFILE__EDIT">
      <View style={{ backgroundColor: C.page, borderRadius: 12, overflow: 'hidden' }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{ padding: isDesktop ? 32 : 12 }}>
            {form}
          </View>
        </ScrollView>
        {!isDesktop && <BottomNav active="profile" />}
      </View>
    </StateSection>
  );
}

// -- Main Export --

export default function ProfileStates() {
  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 24 }} showsVerticalScrollIndicator={false}>
      <ViewModeState />
      <EditModeState />
    </ScrollView>
  );
}
