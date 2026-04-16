import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, useWindowDimensions } from 'react-native';
import { StateSection } from '../StateSection';
import BottomNav from '../../BottomNav';

const C = { green:'#00AA6C', greenBg:'#E8F9F2', white:'#FFFFFF', text:'#1A1A1A', muted:'#737373', border:'#E0E0E0', error:'#D32F2F' };

function InputField({ label, value, onChangeText, suffix }: {
  label: string; value?: string; onChangeText?: (v: string) => void; suffix?: string;
}) {
  return (
    <View style={{ gap: 6 }}>
      <Text style={{ fontSize: 13, fontWeight: '600', color: C.text }}>{label}</Text>
      <View style={{ borderWidth: 1, borderColor: C.border, borderRadius: 8, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12 }}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          style={{ flex: 1, fontSize: 15, color: C.text, paddingVertical: 10, borderWidth: 0, outlineWidth: 0, backgroundColor: 'transparent' }}
        />
        {suffix && <Text style={{ fontSize: 14, color: C.muted, marginLeft: 8 }}>{suffix}</Text>}
      </View>
    </View>
  );
}

function SelectField({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ gap: 6 }}>
      <Text style={{ fontSize: 13, fontWeight: '600', color: C.text }}>{label}</Text>
      <View style={{ borderWidth: 1, borderColor: C.border, borderRadius: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12, paddingVertical: 12 }}>
        <Text style={{ fontSize: 15, color: C.text }}>{value}</Text>
        <Text style={{ color: C.muted, fontSize: 16 }}>›</Text>
      </View>
    </View>
  );
}

const IMG_COLORS = ['#C8E6C9', '#B2DFDB', '#BBDEFB'];

// ═══════════════════════════════════════════════════════════════════════════════
// STATE 1: Default Edit
// ═══════════════════════════════════════════════════════════════════════════════

function DefaultEditState() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 640;
  const [title, setTitle] = useState('Toyota Camry 2019');
  const [price, setPrice] = useState('12500');

  const form = (
    <View style={{ gap: 16, maxWidth: isDesktop ? 560 : undefined, width: '100%', alignSelf: isDesktop ? 'center' : undefined }}>
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, borderBottomWidth: 1, borderBottomColor: C.border, paddingBottom: 14 }}>
        <Text style={{ fontSize: 20, color: C.muted }}>←</Text>
        <Text style={{ fontSize: 18, fontWeight: '700', color: C.text }}>Редактировать</Text>
      </View>

      <InputField label="Заголовок" value={title} onChangeText={setTitle} />
      <InputField label="Цена" value={price} onChangeText={setPrice} suffix="₾" />
      <SelectField label="Город" value="Тбилиси" />

      {/* Photos */}
      <View style={{ gap: 8 }}>
        <Text style={{ fontSize: 13, fontWeight: '600', color: C.text }}>Фото</Text>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          {IMG_COLORS.map((color, i) => (
            <View key={i} style={{ width: 80, height: 80, borderRadius: 8, backgroundColor: color }} />
          ))}
          <Pressable style={{ width: 80, height: 80, borderRadius: 8, borderWidth: 2, borderStyle: 'dashed', borderColor: C.border, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 24, color: C.green }}>+</Text>
          </Pressable>
        </View>
      </View>

      <Pressable style={{ backgroundColor: C.green, borderRadius: 8, paddingVertical: 14, alignItems: 'center', marginTop: 4 }}>
        <Text style={{ color: C.white, fontWeight: '700', fontSize: 15 }}>Сохранить изменения</Text>
      </Pressable>

      <Pressable style={{ alignItems: 'center', paddingVertical: 8 }}>
        <Text style={{ fontSize: 15, fontWeight: '600', color: C.error }}>Удалить объявление</Text>
      </Pressable>
    </View>
  );

  return (
    <StateSection title="EDIT_LISTING / Default">
      <View style={{ backgroundColor: C.white }}>
        <View style={{ padding: isDesktop ? 24 : 16 }}>
          {form}
        </View>
        {width < 640 && <BottomNav active="post" />}
      </View>
    </StateSection>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// STATE 2: Unsaved Changes Warning
// ═══════════════════════════════════════════════════════════════════════════════

function UnsavedChangesState() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 640;
  const [title, setTitle] = useState('Toyota Camry 2019');
  const [price, setPrice] = useState('12500');

  return (
    <StateSection title="EDIT_LISTING / Unsaved warning">
      <View style={{ backgroundColor: C.white }}>
        <View style={{ padding: isDesktop ? 24 : 16, gap: 16, maxWidth: isDesktop ? 560 : undefined, width: '100%', alignSelf: isDesktop ? 'center' : undefined }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, borderBottomWidth: 1, borderBottomColor: C.border, paddingBottom: 14 }}>
            <Text style={{ fontSize: 20, color: C.muted }}>←</Text>
            <Text style={{ fontSize: 18, fontWeight: '700', color: C.text }}>Редактировать</Text>
          </View>
          <InputField label="Заголовок" value={title} onChangeText={setTitle} />
          <InputField label="Цена" value={price} onChangeText={setPrice} suffix="₾" />
        </View>

        {/* Modal overlay */}
        <View
          style={{
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.45)',
            alignItems: 'center', justifyContent: 'center',
          }}
        >
          <View
            style={{
              backgroundColor: C.white, borderRadius: 14, padding: 24, marginHorizontal: 24, width: '90%', maxWidth: 340,
              shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.15, shadowRadius: 24, elevation: 8,
            }}
          >
            <Text style={{ fontSize: 17, fontWeight: '700', color: C.text, marginBottom: 8 }}>Несохранённые изменения</Text>
            <Text style={{ fontSize: 14, color: C.muted, lineHeight: 20, marginBottom: 20 }}>Выйти без сохранения?</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 10 }}>
              <Pressable style={{ borderWidth: 1, borderColor: C.border, borderRadius: 8, paddingHorizontal: 18, paddingVertical: 10 }}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: C.text }}>Остаться</Text>
              </Pressable>
              <Pressable style={{ backgroundColor: C.error, borderRadius: 8, paddingHorizontal: 18, paddingVertical: 10 }}>
                <Text style={{ fontSize: 14, fontWeight: '700', color: C.white }}>Выйти</Text>
              </Pressable>
            </View>
          </View>
        </View>

        {width < 640 && <BottomNav active="post" />}
      </View>
    </StateSection>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN EXPORT
// ═══════════════════════════════════════════════════════════════════════════════

export default function EditListingStates() {
  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 24 }} showsVerticalScrollIndicator={false}>
      <DefaultEditState />
      <UnsavedChangesState />
    </ScrollView>
  );
}
