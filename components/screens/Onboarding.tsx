import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, ActivityIndicator, useWindowDimensions } from 'react-native';

// ─── Core Design Tokens ───────────────────────────────────────────────────────
const C = { green:'#00AA6C', white:'#FFFFFF', text:'#1A1A1A', muted:'#737373', border:'#E0E0E0', error:'#D32F2F', bg:'#F5F5F5' };

// ─── Helpers ────────────────────────────────────────────────────────────────────

function ResponsiveWrapper({ children }: { children: React.ReactNode }) {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 640;
  return (
    <View style={isDesktop ? { alignItems: 'center', padding: 24 } : undefined}>
      <View style={{ width: isDesktop ? 390 : '100%', alignSelf: 'center' }}>
        {children}
      </View>
    </View>
  );
}

function InputField({ label, placeholder, value, onChangeText, required }: { label: string; placeholder: string; value?: string; onChangeText?: (v: string) => void; required?: boolean }) {
  return (
    <View>
      <View className="flex-row items-center mb-1.5" style={{ gap: 4 }}>
        <Text className="text-sm font-medium" style={{ color: C.text }}>{label}</Text>
        {required && <Text style={{ color: C.error, fontSize: 14 }}>*</Text>}
      </View>
      <View style={{ borderWidth: 1, borderColor: C.border, borderRadius: 8, backgroundColor: C.white }}>
        <TextInput
          style={{
            borderWidth: 0,
            backgroundColor: 'transparent',
            paddingHorizontal: 16,
            color: value ? C.text : C.muted,
            fontSize: 16,
            paddingVertical: 12,
            outlineWidth: 0,
          } as any}
          placeholder={placeholder}
          placeholderTextColor={C.muted}
          value={value}
          onChangeText={onChangeText}
        />
      </View>
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

function PrimaryButton({ label, disabled, loading, onPress }: { label: string; disabled?: boolean; loading?: boolean; onPress?: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      className="rounded-lg items-center justify-center"
      style={{
        backgroundColor: C.green,
        paddingVertical: 14,
        borderRadius: 8,
        opacity: (disabled || loading) ? 0.5 : 1,
      }}
    >
      {loading
        ? <ActivityIndicator color={C.white} />
        : <Text className="text-white font-bold" style={{ fontSize: 16 }}>{label}</Text>
      }
    </Pressable>
  );
}

// ─── States ─────────────────────────────────────────────────────────────────────

interface OnboardingProps {
  onSubmit?: (data: { name: string; city?: string }) => void;
  loading?: boolean;
  error?: string;
}

export function OnboardingDefault({ onSubmit, loading, error }: OnboardingProps) {
  const [name, setName] = useState('');
  const [city, setCity] = useState('');

  const handleSubmit = () => {
    if (onSubmit && name.trim()) {
      onSubmit({ name: name.trim(), city: city.trim() || undefined });
    }
  };

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
          <InputField label="Имя *" placeholder="Введите ваше имя" value={name} onChangeText={setName} required />
          <View>
            <Text className="text-sm font-medium mb-1.5" style={{ color: C.text }}>Город</Text>
            <View style={{ borderWidth: 1, borderColor: C.border, borderRadius: 8, backgroundColor: C.white }}>
              {/* @ts-ignore */}
              <select
                value={city}
                onChange={(e: any) => setCity(e.target.value)}
                style={{
                  fontSize: 16, color: city ? '#1A1A1A' : '#737373', backgroundColor: 'transparent',
                  border: 'none', outline: 'none', padding: '12px 16px', width: '100%',
                  cursor: 'pointer',
                }}
              >
                <option value="">Выберите город</option>
                {['Тбилиси', 'Батуми', 'Кутаиси', 'Рустави', 'Гори', 'Зугдиди'].map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </View>
          </View>
        </View>

        {!!error && (
          <Text style={{ fontSize: 14, color: C.error, textAlign: 'center' }}>{error}</Text>
        )}

        <PrimaryButton label="Продолжить" disabled={!name.trim()} loading={loading} onPress={handleSubmit} />
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

export default OnboardingDefault;
