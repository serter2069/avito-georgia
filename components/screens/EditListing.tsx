import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, ActivityIndicator, useWindowDimensions } from 'react-native';
import BottomNav from '../BottomNav';

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
          style={{ flex: 1, fontSize: 15, color: C.text, paddingVertical: 10, borderWidth: 0, outlineWidth: 0, backgroundColor: 'transparent' } as any}
        />
        {suffix && <Text style={{ fontSize: 14, color: C.muted, marginLeft: 8 }}>{suffix}</Text>}
      </View>
    </View>
  );
}

const IMG_COLORS = ['#C8E6C9', '#B2DFDB', '#BBDEFB'];

export interface EditListingProps {
  listing: { id: string; title: string; price?: number; [key: string]: any } | null;
  onSave: (data: { title: string; price: string }) => void;
  onDelete: () => void;
  saving?: boolean;
}

function EditListingScreen({ listing, onSave, onDelete, saving }: EditListingProps) {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 640;
  const [title, setTitle] = useState(listing?.title ?? '');
  const [price, setPrice] = useState(listing?.price != null ? String(listing.price) : '');

  const form = (
    <View style={{ gap: 16, maxWidth: isDesktop ? 560 : undefined, width: '100%', alignSelf: isDesktop ? 'center' : undefined }}>
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, borderBottomWidth: 1, borderBottomColor: C.border, paddingBottom: 14 }}>
        <Text style={{ fontSize: 20, color: C.muted }}>←</Text>
        <Text style={{ fontSize: 18, fontWeight: '700', color: C.text }}>Редактировать</Text>
      </View>

      <InputField label="Заголовок" value={title} onChangeText={setTitle} />
      <InputField label="Цена" value={price} onChangeText={setPrice} suffix="₾" />

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

      <Pressable
        onPress={() => onSave({ title, price })}
        disabled={saving}
        style={{ backgroundColor: C.green, borderRadius: 8, paddingVertical: 14, alignItems: 'center', marginTop: 4, opacity: saving ? 0.7 : 1 }}
      >
        {saving ? (
          <ActivityIndicator color={C.white} size="small" />
        ) : (
          <Text style={{ color: C.white, fontWeight: '700', fontSize: 15 }}>Сохранить изменения</Text>
        )}
      </Pressable>

      <Pressable onPress={onDelete} style={{ alignItems: 'center', paddingVertical: 8 }}>
        <Text style={{ fontSize: 15, fontWeight: '600', color: C.error }}>Удалить объявление</Text>
      </Pressable>
    </View>
  );

  return (
    <View style={{ backgroundColor: C.white }}>
      <View style={{ padding: isDesktop ? 24 : 16 }}>
        {form}
      </View>
      {width < 640 && <BottomNav active="post" />}
    </View>
  );
}

export default EditListingScreen;
