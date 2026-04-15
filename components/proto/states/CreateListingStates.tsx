import React from 'react';
import { View, Text, TextInput, Pressable, ActivityIndicator, useWindowDimensions } from 'react-native';
import { StateSection } from '../StateSection';

const C = { green:'#00AA6C', greenBg:'#E8F9F2', white:'#FFFFFF', page:'#F5F5F5', text:'#1A1A1A', muted:'#737373', border:'#E0E0E0', error:'#D32F2F' };

// ─── Helpers ────────────────────────────────────────────────────────────────────

function PhoneFrame({ children }: { children: React.ReactNode }) {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 640;

  return (
    <View
      className="bg-white overflow-hidden"
      style={isDesktop
        ? { width: 390, alignSelf: 'center', borderRadius: 12, borderWidth: 1, borderColor: C.border, backgroundColor: C.white }
        : { width: '100%' as any, backgroundColor: C.white }
      }
    >
      {children}
    </View>
  );
}

function StepHeader({ title, step }: { title: string; step: number }) {
  return (
    <View className="px-4 py-3 border-b border-[#E0E0E0]">
      <View className="flex-row items-center justify-between">
        <Text className="text-lg font-bold text-[#1A1A1A]">{title}</Text>
        <View className="rounded-full px-3 py-1" style={{ backgroundColor: C.greenBg }}>
          <Text className="text-[13px] font-bold" style={{ color: C.green }}>{step}/3</Text>
        </View>
      </View>
      <View className="h-1 bg-[#E0E0E0] rounded-full mt-3">
        <View
          className="h-1 rounded-full"
          style={{ width: `${(step / 3) * 100}%`, backgroundColor: C.green }}
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
        <Text style={{ color: C.muted }}>›</Text>
      </View>
    </View>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// STATES
// ═══════════════════════════════════════════════════════════════════════════════

function Step1CategoryState() {
  const categories = ['Авто', 'Недвижимость', 'Электроника', 'Одежда', 'Дом и сад', 'Работа', 'Услуги', 'Животные'];

  return (
    <StateSection title="CREATE_LISTING / Step 1 — Category">
      <PhoneFrame>
        <StepHeader title="Новое объявление" step={1} />
        <View className="p-4" style={{ gap: 12 }}>
          <Text className="text-base font-semibold text-[#1A1A1A] mb-1">Выберите категорию</Text>
          <View className="flex-row flex-wrap" style={{ gap: 10 }}>
            {categories.map((cat) => (
              <Pressable
                key={cat}
                className="border border-[#E0E0E0] rounded-lg items-center justify-center py-4"
                style={{ width: '47.5%' as any }}
              >
                <Text className="text-[14px] font-semibold text-[#1A1A1A]">{cat}</Text>
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
          <InputField label="Цена" placeholder="0" suffix="₾" />
          <SelectField label="Город" value="Тбилиси ›" />

          {/* Photo upload area */}
          <View>
            <Text className="text-sm font-medium text-[#1A1A1A] mb-1.5">Фото</Text>
            <View
              className="rounded-lg items-center justify-center py-8"
              style={{ borderWidth: 2, borderStyle: 'dashed', borderColor: C.border }}
            >
              <Text className="text-[15px] font-semibold" style={{ color: C.green }}>Добавить фото (обязательно)</Text>
              <Text className="text-xs mt-1" style={{ color: C.muted }}>макс. 10</Text>
            </View>
          </View>

          <Pressable className="rounded-md py-3 items-center mt-2" style={{ backgroundColor: C.green }}>
            <Text className="text-white font-bold text-[15px]">Далее</Text>
          </Pressable>
        </View>
      </PhoneFrame>
    </StateSection>
  );
}

function Step3ReviewFreeState() {
  return (
    <StateSection title="CREATE_LISTING / Step 3 — Review (free slot)">
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
            <View style={{ height: 160, backgroundColor: '#E0E0E0' }} />
            <View className="p-3" style={{ gap: 4 }}>
              <Text className="text-xl font-bold text-[#1A1A1A]">12 500 ₾</Text>
              <Text className="text-sm text-[#1A1A1A]">Toyota Camry 2019, 45 000 км</Text>
              <Text className="text-xs mt-1" style={{ color: C.muted }}>Тбилиси</Text>
            </View>
          </View>

          {/* Free slot note */}
          <View className="rounded-md px-3 py-2" style={{ backgroundColor: C.greenBg }}>
            <Text className="text-[13px] font-semibold" style={{ color: C.green }}>
              Публикация бесплатна (2 из 3 использовано)
            </Text>
          </View>

          <Pressable className="rounded-md py-3 items-center" style={{ backgroundColor: C.green }}>
            <Text className="text-white font-bold text-[15px]">Опубликовать</Text>
          </Pressable>
          <Pressable className="border border-[#E0E0E0] rounded-md py-3 items-center">
            <Text className="text-[15px] font-semibold" style={{ color: C.muted }}>Сохранить черновик</Text>
          </Pressable>
        </View>
      </PhoneFrame>
    </StateSection>
  );
}

function Step3ReviewPaidState() {
  return (
    <StateSection title="CREATE_LISTING / Step 3 — Review (paid)">
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
            <View style={{ height: 160, backgroundColor: '#E0E0E0' }} />
            <View className="p-3" style={{ gap: 4 }}>
              <Text className="text-xl font-bold text-[#1A1A1A]">12 500 ₾</Text>
              <Text className="text-sm text-[#1A1A1A]">Toyota Camry 2019, 45 000 км</Text>
              <Text className="text-xs mt-1" style={{ color: C.muted }}>Тбилиси</Text>
            </View>
          </View>

          {/* Paid note */}
          <View className="rounded-md px-3 py-2" style={{ backgroundColor: '#FFF8E1' }}>
            <Text className="text-[13px] font-semibold" style={{ color: '#E65100' }}>
              Публикация стоит ₾5
            </Text>
            <Text className="text-[11px] mt-0.5" style={{ color: C.muted }}>
              Оплата через Stripe
            </Text>
          </View>

          <Pressable className="rounded-md py-3 items-center" style={{ backgroundColor: C.green }}>
            <Text className="text-white font-bold text-[15px]">Опубликовать</Text>
          </Pressable>
          <Pressable className="border border-[#E0E0E0] rounded-md py-3 items-center">
            <Text className="text-[15px] font-semibold" style={{ color: C.muted }}>Сохранить черновик</Text>
          </Pressable>
        </View>
      </PhoneFrame>
    </StateSection>
  );
}

function PhotoUploadState() {
  return (
    <StateSection title="CREATE_LISTING / Photo upload">
      <PhoneFrame>
        <StepHeader title="Новое объявление" step={2} />
        <View className="p-4" style={{ gap: 16 }}>
          <Text className="text-sm font-medium text-[#1A1A1A] mb-1.5">Фото</Text>
          <View className="flex-row flex-wrap" style={{ gap: 8 }}>
            {/* Uploaded thumbnails */}
            <View style={{ position: 'relative' }}>
              <View style={{ width: 80, height: 80, borderRadius: 6, backgroundColor: '#E0E0E0' }} />
              <Text className="text-[11px] text-center mt-1" style={{ color: C.error }}>Удалить</Text>
            </View>
            <View style={{ position: 'relative' }}>
              <View style={{ width: 80, height: 80, borderRadius: 6, backgroundColor: '#E0E0E0' }} />
              <Text className="text-[11px] text-center mt-1" style={{ color: C.error }}>Удалить</Text>
            </View>
            {/* Loading spinner */}
            <View style={{ width: 80, height: 80, borderRadius: 6, borderWidth: 1, borderColor: C.border, alignItems: 'center', justifyContent: 'center' }}>
              <ActivityIndicator size="small" color={C.green} />
            </View>
            {/* Add more slot */}
            <Pressable style={{ width: 80, height: 80, borderRadius: 6, borderWidth: 2, borderStyle: 'dashed', borderColor: C.border, alignItems: 'center', justifyContent: 'center' }}>
              <Text className="text-xl" style={{ color: C.green }}>+</Text>
            </Pressable>
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
      <Step3ReviewFreeState />
      <Step3ReviewPaidState />
      <PhotoUploadState />
    </View>
  );
}
