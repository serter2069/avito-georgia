import React from 'react';
import { View, Text, TextInput, Pressable, useWindowDimensions } from 'react-native';
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

function InputField({ label, value, suffix }: {
  label: string; value?: string; suffix?: string;
}) {
  return (
    <View>
      <Text className="text-sm font-medium text-[#1A1A1A] mb-1.5">{label}</Text>
      <View style={{ borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 6, backgroundColor: '#FFFFFF', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12 }}>
        <TextInput
          value={value}
          
          style={{ flex: 1, fontSize: 16, color: '#1A1A1A', paddingVertical: 10, borderWidth: 0, backgroundColor: 'transparent' }}
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

function DefaultEditState() {
  return (
    <StateSection title="EDIT_LISTING / Default">
      <PhoneFrame>
        {/* Header with back arrow */}
        <View className="flex-row items-center px-4 py-3 border-b border-[#E0E0E0]" style={{ gap: 12 }}>
          <Text className="text-xl text-[#1A1A1A]">←</Text>
          <Text className="text-lg font-bold text-[#1A1A1A]">Редактировать</Text>
        </View>

        <View className="p-4" style={{ gap: 16 }}>
          <InputField label="Заголовок" value="Toyota Camry 2019" />
          <InputField label="Цена" value="12500" suffix="₾" />
          <SelectField label="Город" value="Тбилиси" />

          {/* Photos row */}
          <View>
            <Text className="text-sm font-medium text-[#1A1A1A] mb-1.5">Фото</Text>
            <View className="flex-row" style={{ gap: 8 }}>
              <View style={{ width: 80, height: 80, borderRadius: 6, backgroundColor: '#E0E0E0' }} />
              <View style={{ width: 80, height: 80, borderRadius: 6, backgroundColor: '#E0E0E0' }} />
              <View style={{ width: 80, height: 80, borderRadius: 6, backgroundColor: '#E0E0E0' }} />
              <Pressable style={{ width: 80, height: 80, borderRadius: 6, borderWidth: 2, borderStyle: 'dashed', borderColor: C.border, alignItems: 'center', justifyContent: 'center' }}>
                <Text className="text-xl" style={{ color: C.green }}>+</Text>
              </Pressable>
            </View>
          </View>

          <Pressable className="rounded-md py-3 items-center mt-2" style={{ backgroundColor: C.green }}>
            <Text className="text-white font-bold text-[15px]">Сохранить изменения</Text>
          </Pressable>

          <Pressable className="items-center py-2">
            <Text className="text-[15px] font-semibold" style={{ color: C.error }}>Удалить объявление</Text>
          </Pressable>
        </View>
      </PhoneFrame>
    </StateSection>
  );
}

function UnsavedChangesState() {
  return (
    <StateSection title="EDIT_LISTING / Unsaved warning">
      <PhoneFrame>
        {/* Header */}
        <View className="flex-row items-center px-4 py-3 border-b border-[#E0E0E0]" style={{ gap: 12 }}>
          <Text className="text-xl text-[#1A1A1A]">←</Text>
          <Text className="text-lg font-bold text-[#1A1A1A]">Редактировать</Text>
        </View>

        <View className="p-4" style={{ gap: 16 }}>
          <InputField label="Заголовок" value="Toyota Camry 2019" />
          <InputField label="Цена" value="12500" suffix="₾" />
        </View>

        {/* Modal overlay */}
        <View
          className="absolute inset-0 items-center justify-center"
          style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
        >
          <View
            className="bg-white rounded-xl mx-6 p-6"
            style={{
              width: 340,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.15,
              shadowRadius: 24,
              elevation: 8,
            }}
          >
            <Text className="text-lg font-bold text-[#1A1A1A] mb-2">
              Несохранённые изменения
            </Text>
            <Text className="text-sm text-[#737373] mb-6 leading-5">
              Выйти без сохранения?
            </Text>
            <View className="flex-row justify-end" style={{ gap: 12 }}>
              <Pressable className="rounded-md px-5 py-2.5 border border-[#E0E0E0]">
                <Text className="text-[15px] font-semibold text-[#1A1A1A]">Остаться</Text>
              </Pressable>
              <Pressable className="rounded-md px-5 py-2.5" style={{ backgroundColor: C.error }}>
                <Text className="text-[15px] font-bold text-white">Выйти без сохранения</Text>
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

export default function EditListingStates() {
  return (
    <View style={{ gap: 0 }}>
      <DefaultEditState />
      <UnsavedChangesState />
    </View>
  );
}
