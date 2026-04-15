import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { StateSection } from '../StateSection';

// ─── Core Design Tokens ───────────────────────────────────────────────────────
const C = { green:'#00AA6C', greenBg:'#E8F9F2', white:'#FFFFFF', page:'#FFFFFF', text:'#1A1A1A', muted:'#737373', border:'#E0E0E0', error:'#D32F2F' };
const R = { xs:2, sm:4, md:8, lg:12, xl:16, full:9999 };

// ─── Helpers ────────────────────────────────────────────────────────────────────

function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <View
      className="bg-white rounded-2xl border border-[#E0E0E0] overflow-hidden"
      style={{
        width: 390,
        minHeight: 540,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 16,
        elevation: 4,
      }}
    >
      {children}
    </View>
  );
}

function ProgressIndicator() {
  return (
    <View className="items-center" style={{ gap: 6 }}>
      <View className="flex-row" style={{ gap: 4 }}>
        <View className="rounded-full" style={{ width: 24, height: 4, backgroundColor: C.green }} />
        <View className="rounded-full" style={{ width: 24, height: 4, backgroundColor: C.border }} />
      </View>
      <Text className="text-xs" style={{ color: C.muted }}>Шаг 1 из 1</Text>
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
      <View
        className="rounded-lg bg-white px-4"
        style={{
          borderWidth: 1,
          borderColor: value ? C.green : C.border,
          borderRadius: R.md,
        }}
      >
        <TextInput
          className="text-base py-3"
          style={{ color: value ? C.text : C.muted }}
          placeholder={placeholder}
          placeholderTextColor={C.muted}
          value={value}
          editable={false}
        />
      </View>
    </View>
  );
}

function SelectField({ label, placeholder, value, active }: { label: string; placeholder: string; value?: string; active?: boolean }) {
  return (
    <View>
      <Text className="text-sm font-medium mb-1.5" style={{ color: C.text }}>{label}</Text>
      <View
        className="rounded-lg bg-white px-4 flex-row items-center justify-between"
        style={{
          borderWidth: 1,
          borderColor: value ? C.green : C.border,
          borderRadius: R.md,
          paddingVertical: 13,
        }}
      >
        <Text style={{ fontSize: 16, color: value ? C.text : C.muted }}>
          {value || placeholder}
        </Text>
        <Text style={{ fontSize: 14, color: C.muted }}>{active ? '▲' : '▼'}</Text>
      </View>
    </View>
  );
}

function PrimaryButton({ label, disabled }: { label: string; disabled?: boolean }) {
  return (
    <View
      className="rounded-lg items-center justify-center"
      style={{
        backgroundColor: disabled ? '#B0DFC9' : C.green,
        paddingVertical: 14,
        borderRadius: R.md,
        opacity: disabled ? 0.7 : 1,
      }}
    >
      <Text className="text-white font-bold" style={{ fontSize: 16 }}>{label}</Text>
    </View>
  );
}

// ─── States ─────────────────────────────────────────────────────────────────────

function DefaultState() {
  return (
    <PhoneFrame>
      <View className="flex-1 px-6" style={{ paddingTop: 48, gap: 28 }}>
        <View className="items-center" style={{ gap: 8 }}>
          <Text className="text-2xl font-bold text-[#1A1A1A]" style={{ letterSpacing: -0.3 }}>
            Расскажите о себе
          </Text>
          <Text className="text-sm text-center" style={{ color: C.muted }}>
            Заполните профиль, чтобы начать пользоваться avito.ge
          </Text>
        </View>

        <View style={{ gap: 16 }}>
          <InputField label="Имя" placeholder="Введите ваше имя" required />
          <InputField label="Телефон" placeholder="+995 ___ __-__-__" />
          <SelectField label="Город" placeholder="Выберите город" />
        </View>

        <PrimaryButton label="Продолжить" disabled />
        <ProgressIndicator />
      </View>
    </PhoneFrame>
  );
}

function FilledState() {
  return (
    <PhoneFrame>
      <View className="flex-1 px-6" style={{ paddingTop: 48, gap: 28 }}>
        <View className="items-center" style={{ gap: 8 }}>
          <Text className="text-2xl font-bold text-[#1A1A1A]" style={{ letterSpacing: -0.3 }}>
            Расскажите о себе
          </Text>
          <Text className="text-sm text-center" style={{ color: C.muted }}>
            Заполните профиль, чтобы начать пользоваться avito.ge
          </Text>
        </View>

        <View style={{ gap: 16 }}>
          <InputField label="Имя" placeholder="Введите ваше имя" value="Георгий" required />
          <InputField label="Телефон" placeholder="+995 ___ __-__-__" value="+995 555 12-34-56" />
          <SelectField label="Город" placeholder="Выберите город" value="Тбилиси" />
        </View>

        <PrimaryButton label="Продолжить" />
        <ProgressIndicator />
      </View>
    </PhoneFrame>
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
    <PhoneFrame>
      <View className="flex-1 px-6" style={{ paddingTop: 48, gap: 28 }}>
        <View className="items-center" style={{ gap: 8 }}>
          <Text className="text-2xl font-bold text-[#1A1A1A]" style={{ letterSpacing: -0.3 }}>
            Расскажите о себе
          </Text>
          <Text className="text-sm text-center" style={{ color: C.muted }}>
            Заполните профиль, чтобы начать пользоваться avito.ge
          </Text>
        </View>

        <View style={{ gap: 16 }}>
          <InputField label="Имя" placeholder="Введите ваше имя" value="Георгий" required />
          <InputField label="Телефон" placeholder="+995 ___ __-__-__" value="+995 555 12-34-56" />

          <View>
            <SelectField label="Город" placeholder="Выберите город" value="Тбилиси" active />

            {/* Dropdown overlay */}
            <View
              className="rounded-lg border border-[#E0E0E0] bg-white mt-1 overflow-hidden"
              style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.12,
                shadowRadius: 24,
                elevation: 8,
                borderRadius: R.md,
              }}
            >
              {cities.map((city, idx) => (
                <View key={city.name}>
                  <View
                    className="flex-row items-center justify-between px-4 py-3"
                    style={{ backgroundColor: city.selected ? C.greenBg : C.white }}
                  >
                    <Text
                      className="text-base"
                      style={{
                        color: city.selected ? C.green : C.text,
                        fontWeight: city.selected ? '600' : '400',
                      }}
                    >
                      {city.name}
                    </Text>
                    {city.selected && (
                      <Text style={{ fontSize: 16, color: C.green }}>✓</Text>
                    )}
                  </View>
                  {idx < cities.length - 1 && (
                    <View style={{ height: 1, backgroundColor: C.border, marginLeft: 16 }} />
                  )}
                </View>
              ))}
            </View>
          </View>
        </View>
      </View>
    </PhoneFrame>
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
