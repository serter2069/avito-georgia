import React from 'react';
import { View, Text, TextInput, Pressable, useWindowDimensions } from 'react-native';
import { StateSection } from '../StateSection';

// ─── Core Design Tokens ───────────────────────────────────────────────────────
const C = { green:'#00AA6C', white:'#FFFFFF', text:'#1A1A1A', muted:'#737373', border:'#E0E0E0', error:'#D32F2F', bg:'#F5F5F5' };

// ─── Helpers ────────────────────────────────────────────────────────────────────

function ResponsiveWrapper({ children }: { children: React.ReactNode }) {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 640;
  return (
    <View style={isDesktop ? { backgroundColor: C.bg, padding: 24, alignItems: 'center' } : undefined}>
      <View style={{ width: isDesktop ? 390 : '100%', alignSelf: 'center' }}>
        {children}
      </View>
    </View>
  );
}

function InputField({ label, placeholder, value, required }: { label: string; placeholder: string; value?: string; required?: boolean }) {
  return (
    <View>
      <View className="flex-row items-center mb-1.5" style={{ gap: 4 }}>
        <Text className="text-sm font-medium" style={{ color: C.text }}>{label}</Text>
        {required && <Text style={{ color: C.error, fontSize: 14 }}>*</Text>}
      </View>
      <TextInput
        style={{
          borderWidth: 1,
          borderColor: C.border,
          borderRadius: 8,
          backgroundColor: C.white,
          paddingHorizontal: 16,
          color: value ? C.text : C.muted,
          fontSize: 16,
          paddingVertical: 12,
        }}
        placeholder={placeholder}
        placeholderTextColor={C.muted}
        value={value}
        
      />
    </View>
  );
}

function SelectField({ label, value }: { label: string; value?: string }) {
  return (
    <View>
      <Text className="text-sm font-medium mb-1.5" style={{ color: C.text }}>{label}</Text>
      <View
        className="flex-row items-center justify-between"
        style={{
          borderWidth: 1,
          borderColor: C.border,
          borderRadius: 8,
          backgroundColor: C.white,
          paddingHorizontal: 16,
          paddingVertical: 13,
        }}
      >
        <Text style={{ fontSize: 16, color: value ? C.green : C.muted }}>
          {value || 'Выберите город ›'}
        </Text>
      </View>
    </View>
  );
}

function PrimaryButton({ label, disabled }: { label: string; disabled?: boolean }) {
  return (
    <View
      className="rounded-lg items-center justify-center"
      style={{
        backgroundColor: C.green,
        paddingVertical: 14,
        borderRadius: 8,
        opacity: disabled ? 0.5 : 1,
      }}
    >
      <Text className="text-white font-bold" style={{ fontSize: 16 }}>{label}</Text>
    </View>
  );
}

// ─── States ─────────────────────────────────────────────────────────────────────

function DefaultState() {
  return (
    <ResponsiveWrapper>
      <View className="bg-white" style={{ paddingHorizontal: 24, paddingTop: 48, paddingBottom: 40, gap: 28 }}>
        <View style={{ gap: 8 }}>
          <Text className="text-xl font-bold" style={{ color: C.text }}>
            Расскажите о себе
          </Text>
          <Text className="text-sm" style={{ color: C.muted }}>
            Шаг 1 из 1
          </Text>
        </View>

        <View style={{ gap: 16 }}>
          <InputField label="Имя *" placeholder="Введите ваше имя" />
          <InputField label="Телефон" placeholder="+995 XXX XX-XX-XX" />
          <SelectField label="Город" />
        </View>

        <PrimaryButton label="Продолжить" disabled />
      </View>
    </ResponsiveWrapper>
  );
}

function FilledState() {
  return (
    <ResponsiveWrapper>
      <View className="bg-white" style={{ paddingHorizontal: 24, paddingTop: 48, paddingBottom: 40, gap: 28 }}>
        <View style={{ gap: 8 }}>
          <Text className="text-xl font-bold" style={{ color: C.text }}>
            Расскажите о себе
          </Text>
          <Text className="text-sm" style={{ color: C.muted }}>
            Шаг 1 из 1
          </Text>
        </View>

        <View style={{ gap: 16 }}>
          <InputField label="Имя *" placeholder="Введите ваше имя" value="Георгий" />
          <InputField label="Телефон" placeholder="+995 XXX XX-XX-XX" value="+995 555 12-34-56" />
          <SelectField label="Город" value="Тбилиси" />
        </View>

        <PrimaryButton label="Продолжить" />
      </View>
    </ResponsiveWrapper>
  );
}

function CityPickerState() {
  const cities = [
    { name: 'Тбилиси', selected: true },
    { name: 'Батуми', selected: false },
    { name: 'Кутаиси', selected: false },
    { name: 'Рустави', selected: false },
    { name: 'Гори', selected: false },
    { name: 'Зугдиди', selected: false },
  ];

  return (
    <ResponsiveWrapper>
      <View className="bg-white" style={{ paddingHorizontal: 24, paddingTop: 48, paddingBottom: 40, gap: 28 }}>
        <View style={{ gap: 8 }}>
          <Text className="text-xl font-bold" style={{ color: C.text }}>
            Расскажите о себе
          </Text>
          <Text className="text-sm" style={{ color: C.muted }}>
            Шаг 1 из 1
          </Text>
        </View>

        <View style={{ gap: 16 }}>
          <InputField label="Имя *" placeholder="Введите ваше имя" value="Георгий" />
          <InputField label="Телефон" placeholder="+995 XXX XX-XX-XX" value="+995 555 12-34-56" />

          <View>
            <SelectField label="Город" value="Тбилиси" />

            {/* City picker dropdown */}
            <View
              className="mt-1 overflow-hidden"
              style={{
                borderWidth: 1,
                borderColor: C.border,
                borderRadius: 8,
                backgroundColor: C.white,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.12,
                shadowRadius: 24,
                elevation: 8,
              }}
            >
              {cities.map((city, idx) => (
                <View key={city.name}>
                  <Pressable
                    className="flex-row items-center justify-between"
                    style={{ paddingHorizontal: 16, paddingVertical: 12 }}
                  >
                    <Text
                      style={{
                        fontSize: 16,
                        color: city.selected ? C.green : C.text,
                        fontWeight: city.selected ? '600' : '400',
                      }}
                    >
                      {city.name}{city.selected ? '  ✓' : ''}
                    </Text>
                  </Pressable>
                  {idx < cities.length - 1 && (
                    <View style={{ height: 1, backgroundColor: C.border, marginLeft: 16 }} />
                  )}
                </View>
              ))}
            </View>
          </View>
        </View>
      </View>
    </ResponsiveWrapper>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN EXPORT
// ═══════════════════════════════════════════════════════════════════════════════

export default function OnboardingStates() {
  return (
    <View style={{ gap: 40 }}>
      <StateSection title="ONBOARDING — Default">
        <DefaultState />
      </StateSection>

      <StateSection title="ONBOARDING — Filled">
        <FilledState />
      </StateSection>

      <StateSection title="ONBOARDING — City Picker Open">
        <CityPickerState />
      </StateSection>
    </View>
  );
}
