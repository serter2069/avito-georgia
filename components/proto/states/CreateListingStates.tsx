import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, ActivityIndicator, useWindowDimensions } from 'react-native';
import { StateSection } from '../StateSection';
import BottomNav from '../../BottomNav';

const C = {
  green: '#00AA6C',
  greenBg: '#E8F9F2',
  white: '#FFFFFF',
  text: '#1A1A1A',
  muted: '#9E9E9E',
  border: '#E8E8E8',
  page: '#F5F5F5',
};

const PHOTO_COLORS = ['#B0C4DE', '#D2B48C', '#A8D8A8'];

function StepIndicator({ step }: { step: number }) {
  const steps = ['Фото', 'Описание', 'Цена и контакты'];
  return (
    <View style={{ paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: C.border, backgroundColor: C.white }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
        {steps.map((label, i) => {
          const num = i + 1;
          const active = num === step;
          const done = num < step;
          return (
            <React.Fragment key={num}>
              <View style={{ alignItems: 'center' }}>
                <View style={{
                  width: 26, height: 26, borderRadius: 13,
                  backgroundColor: done || active ? C.green : C.border,
                  alignItems: 'center', justifyContent: 'center',
                }}>
                  <Text style={{ color: done || active ? C.white : C.muted, fontSize: 12, fontWeight: '700' }}>
                    {done ? '✓' : String(num)}
                  </Text>
                </View>
                <Text style={{ fontSize: 10, color: active ? C.green : C.muted, marginTop: 3, fontWeight: active ? '600' : '400' }}>
                  {label}
                </Text>
              </View>
              {i < steps.length - 1 && (
                <View style={{ flex: 1, height: 2, backgroundColor: done ? C.green : C.border, marginHorizontal: 4, marginBottom: 16 }} />
              )}
            </React.Fragment>
          );
        })}
      </View>
    </View>
  );
}

function FieldLabel({ text }: { text: string }) {
  return <Text style={{ fontSize: 13, fontWeight: '600', color: C.text, marginBottom: 6 }}>{text}</Text>;
}

function SelectRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ marginBottom: 14 }}>
      <FieldLabel text={label} />
      <View style={{
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        borderWidth: 1, borderColor: C.border, borderRadius: 8,
        paddingHorizontal: 12, paddingVertical: 12,
        backgroundColor: C.white,
      }}>
        <Text style={{ fontSize: 15, color: C.text }}>{value}</Text>
        <Text style={{ fontSize: 16, color: C.muted }}>{'>'}</Text>
      </View>
    </View>
  );
}

// Preview card shown on desktop right column
function PreviewCard({ step }: { step: number }) {
  return (
    <View style={{
      borderWidth: 1, borderColor: C.border, borderRadius: 10, overflow: 'hidden', backgroundColor: C.white,
    }}>
      <View style={{ height: 180, backgroundColor: step >= 1 ? PHOTO_COLORS[0] : C.border }} />
      <View style={{ padding: 12 }}>
        <Text style={{ fontSize: 18, fontWeight: '800', color: C.text, marginBottom: 4 }}>
          {step >= 3 ? '12 500 ₾' : '—'}
        </Text>
        <Text style={{ fontSize: 14, color: C.text, marginBottom: 4 }}>
          {step >= 2 ? 'Toyota Camry 2019, 45 000 км' : 'Заголовок объявления'}
        </Text>
        <Text style={{ fontSize: 12, color: C.muted }}>Тбилиси</Text>
      </View>
    </View>
  );
}

// --- STEP 1: Фото ---
function Step1({ onNext }: { onNext: () => void }) {
  const [uploaded, setUploaded] = useState(false);
  const { width } = useWindowDimensions();
  const isDesktop = width >= 640;

  const photoArea = (
    <View style={{ padding: 16 }}>
      {!uploaded ? (
        <Pressable
          onPress={() => setUploaded(true)}
          style={{
            borderWidth: 2, borderStyle: 'dashed', borderColor: C.border, borderRadius: 10,
            paddingVertical: 48, alignItems: 'center', justifyContent: 'center',
          }}
        >
          <Text style={{ fontSize: 32, color: C.muted, marginBottom: 8 }}>+</Text>
          <Text style={{ fontSize: 15, fontWeight: '600', color: C.green }}>Добавить фото</Text>
          <Text style={{ fontSize: 12, color: C.muted, marginTop: 4 }}>до 10 фотографий</Text>
        </Pressable>
      ) : (
        <View>
          <Text style={{ fontSize: 13, fontWeight: '600', color: C.text, marginBottom: 10 }}>Фото</Text>
          <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
            {PHOTO_COLORS.map((bg, i) => (
              <View key={i} style={{ width: 90, height: 90, borderRadius: 8, backgroundColor: bg }} />
            ))}
            <Pressable style={{
              width: 90, height: 90, borderRadius: 8, borderWidth: 2, borderStyle: 'dashed', borderColor: C.border,
              alignItems: 'center', justifyContent: 'center',
            }}>
              <Text style={{ fontSize: 26, color: C.green }}>+</Text>
            </Pressable>
          </View>
        </View>
      )}
      <View style={{ marginTop: 20, flexDirection: 'row', justifyContent: 'flex-end' }}>
        <Pressable onPress={onNext} style={{ backgroundColor: C.green, borderRadius: 8, paddingHorizontal: 32, paddingVertical: 12 }}>
          <Text style={{ color: C.white, fontWeight: '700', fontSize: 15 }}>Далее</Text>
        </Pressable>
      </View>
    </View>
  );

  if (isDesktop) {
    return (
      <View style={{ flexDirection: 'row', gap: 24 }}>
        <View style={{ flex: 2 }}>{photoArea}</View>
        <View style={{ flex: 1, padding: 16, paddingLeft: 0 }}>
          <Text style={{ fontSize: 13, fontWeight: '600', color: C.text, marginBottom: 10 }}>Предпросмотр</Text>
          <PreviewCard step={uploaded ? 1 : 0} />
        </View>
      </View>
    );
  }
  return photoArea;
}

// --- STEP 2: Описание ---
function Step2({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const { width } = useWindowDimensions();
  const isDesktop = width >= 640;

  const form = (
    <View style={{ padding: 16, gap: 14 }}>
      <View>
        <FieldLabel text="Заголовок" />
        <View style={{ borderWidth: 1, borderColor: C.border, borderRadius: 8 }}>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="Что продаёте?"
            placeholderTextColor={C.muted}
            style={{ borderWidth: 0, backgroundColor: 'transparent', paddingHorizontal: 12, paddingVertical: 10, fontSize: 15, color: C.text, outlineWidth: 0 } as any}
          />
        </View>
      </View>
      <SelectRow label="Категория" value="Авто" />
      <View>
        <FieldLabel text="Описание" />
        <View style={{ borderWidth: 1, borderColor: C.border, borderRadius: 8 }}>
          <TextInput
            value={desc}
            onChangeText={setDesc}
            placeholder="Опишите товар подробнее..."
            placeholderTextColor={C.muted}
            multiline
            numberOfLines={4}
            style={{ borderWidth: 0, backgroundColor: 'transparent', paddingHorizontal: 12, paddingVertical: 10, fontSize: 15, color: C.text, outlineWidth: 0, minHeight: 100, textAlignVertical: 'top' } as any}
          />
        </View>
      </View>
      <SelectRow label="Город" value="Тбилиси" />
      <View style={{ flexDirection: 'row', gap: 10, marginTop: 6 }}>
        <Pressable onPress={onBack} style={{ flex: 1, borderWidth: 1, borderColor: C.border, borderRadius: 8, paddingVertical: 12, alignItems: 'center' }}>
          <Text style={{ fontSize: 15, fontWeight: '600', color: C.muted }}>Назад</Text>
        </Pressable>
        <Pressable onPress={onNext} style={{ flex: 2, backgroundColor: C.green, borderRadius: 8, paddingVertical: 12, alignItems: 'center' }}>
          <Text style={{ color: C.white, fontWeight: '700', fontSize: 15 }}>Далее</Text>
        </Pressable>
      </View>
    </View>
  );

  if (isDesktop) {
    return (
      <View style={{ flexDirection: 'row', gap: 24 }}>
        <View style={{ flex: 2 }}>{form}</View>
        <View style={{ flex: 1, padding: 16, paddingLeft: 0 }}>
          <Text style={{ fontSize: 13, fontWeight: '600', color: C.text, marginBottom: 10 }}>Предпросмотр</Text>
          <PreviewCard step={2} />
        </View>
      </View>
    );
  }
  return form;
}

// --- STEP 3: Цена и контакты ---
function Step3({ onBack }: { onBack: () => void }) {
  const [price, setPrice] = useState('');
  const [phone, setPhone] = useState('');
  const { width } = useWindowDimensions();
  const isDesktop = width >= 640;

  const form = (
    <View style={{ padding: 16, gap: 14 }}>
      <View>
        <FieldLabel text="Цена" />
        <View style={{ flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: C.border, borderRadius: 8, paddingHorizontal: 12 }}>
          <TextInput
            value={price}
            onChangeText={setPrice}
            placeholder="0"
            placeholderTextColor={C.muted}
            keyboardType="numeric"
            style={{ flex: 1, fontSize: 15, color: C.text, paddingVertical: 10, borderWidth: 0, backgroundColor: 'transparent', outlineWidth: 0 } as any}
          />
          <Text style={{ fontSize: 16, fontWeight: '600', color: C.text }}>₾</Text>
        </View>
      </View>
      <View>
        <FieldLabel text="Контактный телефон" />
        <View style={{ borderWidth: 1, borderColor: C.border, borderRadius: 8 }}>
          <TextInput
            value={phone}
            onChangeText={setPhone}
            placeholder="+995 5XX XXX XXX"
            placeholderTextColor={C.muted}
            keyboardType="phone-pad"
            style={{ borderWidth: 0, backgroundColor: 'transparent', paddingHorizontal: 12, paddingVertical: 10, fontSize: 15, color: C.text, outlineWidth: 0 } as any}
          />
        </View>
      </View>
      <View style={{ flexDirection: 'row', gap: 10, marginTop: 6 }}>
        <Pressable onPress={onBack} style={{ flex: 1, borderWidth: 1, borderColor: C.border, borderRadius: 8, paddingVertical: 12, alignItems: 'center' }}>
          <Text style={{ fontSize: 15, fontWeight: '600', color: C.muted }}>Назад</Text>
        </Pressable>
        <Pressable style={{ flex: 2, backgroundColor: C.green, borderRadius: 8, paddingVertical: 12, alignItems: 'center' }}>
          <Text style={{ color: C.white, fontWeight: '700', fontSize: 15 }}>Опубликовать</Text>
        </Pressable>
      </View>
    </View>
  );

  if (isDesktop) {
    return (
      <View style={{ flexDirection: 'row', gap: 24 }}>
        <View style={{ flex: 2 }}>{form}</View>
        <View style={{ flex: 1, padding: 16, paddingLeft: 0 }}>
          <Text style={{ fontSize: 13, fontWeight: '600', color: C.text, marginBottom: 10 }}>Предпросмотр</Text>
          <PreviewCard step={3} />
        </View>
      </View>
    );
  }
  return form;
}

export function CreateListingInteractive() {
  const [step, setStep] = useState(1);
  const { width } = useWindowDimensions();
  const isDesktop = width >= 640;

  return (
    <View style={{ flex: 1, backgroundColor: C.white }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: C.border }}>
        <Text style={{ fontSize: 17, fontWeight: '700', color: C.text }}>Новое объявление</Text>
      </View>
      <StepIndicator step={step} />
      {step === 1 && <Step1 onNext={() => setStep(2)} />}
      {step === 2 && <Step2 onNext={() => setStep(3)} onBack={() => setStep(1)} />}
      {step === 3 && <Step3 onBack={() => setStep(2)} />}
      {!isDesktop && <BottomNav active="post" />}
    </View>
  );
}

export default function CreateListingStates() {
  return (
    <StateSection title="CREATE_LISTING / Multi-step form">
      <CreateListingInteractive />
    </StateSection>
  );
}
