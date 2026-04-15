import React from 'react';
import { View, Text, TextInput, Pressable, ActivityIndicator } from 'react-native';
import { StateSection } from '../StateSection';

const C = { green:'#00AA6C', greenBg:'#E8F9F2', white:'#FFFFFF', page:'#F5F5F5', text:'#1A1A1A', muted:'#737373', border:'#E0E0E0', error:'#D32F2F' };

// ─── Helpers ────────────────────────────────────────────────────────────────────

function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <View className="bg-white rounded-xl border border-[#E0E0E0] overflow-hidden" style={{ width: 390 }}>
      {children}
    </View>
  );
}

function StepHeader({ title, step }: { title: string; step: number }) {
  return (
    <View className="px-4 py-3 border-b border-[#E0E0E0]">
      <View className="flex-row items-center justify-between">
        <Text className="text-lg font-bold text-[#1A1A1A]">{title}</Text>
        <View className="bg-[#E8F9F2] rounded-full px-3 py-1">
          <Text className="text-[13px] font-bold text-[#00AA6C]">{step}/3</Text>
        </View>
      </View>
      {/* Progress bar */}
      <View className="h-1 bg-[#E0E0E0] rounded-full mt-3">
        <View
          className="h-1 bg-[#00AA6C] rounded-full"
          style={{ width: `${(step / 3) * 100}%` }}
        />
      </View>
    </View>
  );
}

function InputField({ label, placeholder, value, suffix, multiline }: {
  label: string; placeholder?: string; value?: string; suffix?: string; multiline?: boolean;
}) {
  return (
    <View>
      <Text className="text-sm font-medium text-[#1A1A1A] mb-1.5">{label}</Text>
      <View className="border border-[#E0E0E0] rounded-md bg-white flex-row items-center px-3">
        <TextInput
          className="flex-1 text-base text-[#1A1A1A] py-2.5"
          placeholder={placeholder}
          placeholderTextColor={C.muted}
          value={value}
          editable={false}
          multiline={multiline}
          style={multiline ? { height: 80, textAlignVertical: 'top' } : {}}
        />
        {suffix && <Text className="text-sm text-[#737373] ml-2">{suffix}</Text>}
      </View>
    </View>
  );
}

function SelectField({ label, value }: { label: string; value: string }) {
  return (
    <View>
      <Text className="text-sm font-medium text-[#1A1A1A] mb-1.5">{label}</Text>
      <View className="border border-[#E0E0E0] rounded-md bg-white flex-row items-center justify-between px-3 py-2.5">
        <Text className="text-base text-[#1A1A1A]">{value}</Text>
        <Text className="text-[#737373]">▾</Text>
      </View>
    </View>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// STATES
// ═══════════════════════════════════════════════════════════════════════════════

function Step1CategoryState() {
  const categories = [
    { emoji: '🏠', label: 'Недвижимость' },
    { emoji: '🚗', label: 'Авто' },
    { emoji: '💻', label: 'Электроника' },
    { emoji: '👕', label: 'Одежда' },
    { emoji: '🛋️', label: 'Дом и сад' },
    { emoji: '🔧', label: 'Услуги' },
    { emoji: '💼', label: 'Работа' },
    { emoji: '🐾', label: 'Животные' },
  ];

  return (
    <StateSection title="CREATE_LISTING / Step 1 — Category">
      <PhoneFrame>
        <StepHeader title="Новое объявление" step={1} />
        <View className="p-4" style={{ gap: 12 }}>
          <Text className="text-base font-semibold text-[#1A1A1A] mb-1">Выберите категорию</Text>
          <View className="flex-row flex-wrap" style={{ gap: 10 }}>
            {categories.map((cat) => (
              <Pressable
                key={cat.label}
                className="border border-[#E0E0E0] rounded-lg items-center justify-center py-4"
                style={{ width: '47.5%' as any }}
              >
                <Text style={{ fontSize: 28 }}>{cat.emoji}</Text>
                <Text className="text-[13px] font-semibold text-[#1A1A1A] mt-2">{cat.label}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      </PhoneFrame>
    </StateSection>
  );
}

function Step2DetailsState() {
  return (
    <StateSection title="CREATE_LISTING / Step 2 — Details">
      <PhoneFrame>
        <StepHeader title="Новое объявление" step={2} />
        <View className="p-4" style={{ gap: 16 }}>
          <InputField label="Заголовок" placeholder="Что продаёте?" />
          <InputField label="Описание" placeholder="Опишите товар подробнее..." multiline />
          <InputField label="Цена" placeholder="0" suffix="GEL" />
          <SelectField label="Город" value="Тбилиси" />

          {/* Photo upload area */}
          <View>
            <Text className="text-sm font-medium text-[#1A1A1A] mb-1.5">Фото</Text>
            <View
              className="border-2 border-dashed border-[#E0E0E0] rounded-lg items-center justify-center py-8"
            >
              <Text className="text-2xl mb-2">📷</Text>
              <Text className="text-[15px] font-semibold text-[#00AA6C]">+ Добавить фото</Text>
              <Text className="text-xs text-[#737373] mt-1">До 8 фотографий</Text>
            </View>
          </View>

          <Pressable className="bg-[#00AA6C] rounded-md py-3 items-center mt-2">
            <Text className="text-white font-bold text-[15px]">Далее</Text>
          </Pressable>
        </View>
      </PhoneFrame>
    </StateSection>
  );
}

function Step3ReviewState() {
  return (
    <StateSection title="CREATE_LISTING / Step 3 — Review & Publish">
      <PhoneFrame>
        <StepHeader title="Новое объявление" step={3} />
        <View className="p-4" style={{ gap: 16 }}>
          <Text className="text-base font-semibold text-[#1A1A1A]">Предпросмотр</Text>

          {/* Preview card */}
          <View
            className="border border-[#E0E0E0] rounded-lg overflow-hidden"
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.06,
              shadowRadius: 8,
              elevation: 3,
            }}
          >
            <View className="h-40 bg-[#E0E0E0]" />
            <View className="p-3" style={{ gap: 4 }}>
              <Text className="text-xl font-bold text-[#1A1A1A]">12 500 GEL</Text>
              <Text className="text-sm text-[#1A1A1A]">Toyota Camry 2019, 45 000 км</Text>
              <Text className="text-xs text-[#737373] mt-1">Тбилиси</Text>
            </View>
          </View>

          <Pressable className="bg-[#00AA6C] rounded-md py-3 items-center">
            <Text className="text-white font-bold text-[15px]">Опубликовать</Text>
          </Pressable>
          <Pressable className="border border-[#E0E0E0] rounded-md py-3 items-center">
            <Text className="text-[15px] font-semibold text-[#737373]">Сохранить черновик</Text>
          </Pressable>
        </View>
      </PhoneFrame>
    </StateSection>
  );
}

function PhotoUploadProgressState() {
  return (
    <StateSection title="CREATE_LISTING / Photo upload in progress">
      <PhoneFrame>
        <StepHeader title="Новое объявление" step={2} />
        <View className="p-4" style={{ gap: 16 }}>
          <InputField label="Заголовок" value="Toyota Camry 2019" />

          {/* Photo area with uploads */}
          <View>
            <Text className="text-sm font-medium text-[#1A1A1A] mb-1.5">Фото</Text>
            <View className="flex-row flex-wrap" style={{ gap: 8 }}>
              {/* Uploaded thumbnails */}
              <View className="w-20 h-20 rounded-md bg-[#E0E0E0]" />
              <View className="w-20 h-20 rounded-md bg-[#E0E0E0]" />
              {/* Loading spinner */}
              <View className="w-20 h-20 rounded-md border border-[#E0E0E0] items-center justify-center">
                <ActivityIndicator size="small" color={C.green} />
              </View>
              {/* Add more slot */}
              <Pressable className="w-20 h-20 rounded-md border-2 border-dashed border-[#E0E0E0] items-center justify-center">
                <Text className="text-[15px] font-semibold text-[#00AA6C]">+</Text>
                <Text className="text-[10px] text-[#737373]">добавить</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </PhoneFrame>
    </StateSection>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN EXPORT
// ═══════════════════════════════════════════════════════════════════════════════

export default function CreateListingStates() {
  return (
    <View style={{ gap: 0 }}>
      <Step1CategoryState />
      <Step2DetailsState />
      <Step3ReviewState />
      <PhotoUploadProgressState />
    </View>
  );
}
