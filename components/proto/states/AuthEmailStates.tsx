import React from 'react';
import { View, Text, TextInput, ActivityIndicator } from 'react-native';
import { StateSection } from '../StateSection';

// ─── Core Design Tokens ───────────────────────────────────────────────────────
const C = { green:'#00AA6C', greenBg:'#E8F9F2', white:'#FFFFFF', page:'#FFFFFF', text:'#1A1A1A', muted:'#737373', border:'#E0E0E0', error:'#D32F2F' };
const R = { xs:2, sm:4, md:8, lg:12, xl:16, full:9999 };

// ─── Helpers ────────────────────────────────────────────────────────────────────

function AvitoLogo() {
  return (
    <View className="flex-row items-center" style={{ gap: 10 }}>
      <View className="items-center justify-center bg-[#00AA6C]" style={{ width: 40, height: 40, borderRadius: 10 }}>
        <Text className="text-white font-extrabold" style={{ fontSize: 20 }}>A</Text>
      </View>
      <View className="flex-row items-baseline" style={{ gap: 1 }}>
        <Text className="font-bold text-[#1A1A1A]" style={{ fontSize: 22 }}>avito</Text>
        <Text className="font-semibold text-[#00AA6C]" style={{ fontSize: 16 }}>.ge</Text>
      </View>
    </View>
  );
}

function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <View
      className="bg-white rounded-2xl border border-[#E0E0E0] overflow-hidden"
      style={{
        width: 390,
        minHeight: 500,
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

function EmailInput({ value, error, disabled }: { value?: string; error?: boolean; disabled?: boolean }) {
  return (
    <View>
      <Text className="text-sm font-medium text-[#1A1A1A] mb-1.5">Email</Text>
      <View
        className="rounded-lg bg-white px-4"
        style={{
          borderWidth: error ? 1.5 : 1,
          borderColor: error ? C.error : C.border,
          borderRadius: R.md,
          backgroundColor: disabled ? '#F5F5F5' : C.white,
        }}
      >
        <TextInput
          className="text-base py-3"
          style={{ color: C.text }}
          placeholder="your@email.com"
          placeholderTextColor={C.muted}
          value={value}
          editable={false}
        />
      </View>
      {error && (
        <Text className="text-xs mt-1.5" style={{ color: C.error }}>
          Введите корректный email
        </Text>
      )}
    </View>
  );
}

function PrimaryButton({ label, disabled, loading }: { label: string; disabled?: boolean; loading?: boolean }) {
  return (
    <View
      className="rounded-lg items-center justify-center flex-row"
      style={{
        backgroundColor: disabled ? '#B0DFC9' : C.green,
        paddingVertical: 14,
        borderRadius: R.md,
        gap: 8,
        opacity: disabled ? 0.7 : 1,
      }}
    >
      {loading && <ActivityIndicator size="small" color="#fff" />}
      <Text className="text-white font-bold" style={{ fontSize: 16 }}>
        {label}
      </Text>
    </View>
  );
}

function LegalText() {
  return (
    <Text className="text-center leading-5" style={{ fontSize: 12, color: C.muted }}>
      Нажимая «Получить код», вы соглашаетесь с{' '}
      <Text style={{ color: C.green }}>Условиями использования</Text> и{' '}
      <Text style={{ color: C.green }}>Политикой конфиденциальности</Text>
    </Text>
  );
}

// ─── States ─────────────────────────────────────────────────────────────────────

function DefaultState() {
  return (
    <PhoneFrame>
      <View className="flex-1 px-6" style={{ paddingTop: 80, gap: 32 }}>
        <View className="items-center" style={{ gap: 16 }}>
          <AvitoLogo />
          <Text className="text-xl font-bold text-center text-[#1A1A1A]" style={{ letterSpacing: -0.3 }}>
            Войдите или зарегистрируйтесь
          </Text>
          <Text className="text-sm text-center" style={{ color: C.muted }}>
            Мы отправим код подтверждения на вашу почту
          </Text>
        </View>
        <View style={{ gap: 16 }}>
          <EmailInput />
          <PrimaryButton label="Получить код" disabled />
          <LegalText />
        </View>
      </View>
    </PhoneFrame>
  );
}

function FilledState() {
  return (
    <PhoneFrame>
      <View className="flex-1 px-6" style={{ paddingTop: 80, gap: 32 }}>
        <View className="items-center" style={{ gap: 16 }}>
          <AvitoLogo />
          <Text className="text-xl font-bold text-center text-[#1A1A1A]" style={{ letterSpacing: -0.3 }}>
            Войдите или зарегистрируйтесь
          </Text>
          <Text className="text-sm text-center" style={{ color: C.muted }}>
            Мы отправим код подтверждения на вашу почту
          </Text>
        </View>
        <View style={{ gap: 16 }}>
          <EmailInput value="user@example.com" />
          <PrimaryButton label="Получить код" />
          <LegalText />
        </View>
      </View>
    </PhoneFrame>
  );
}

function LoadingState() {
  return (
    <PhoneFrame>
      <View className="flex-1 px-6" style={{ paddingTop: 80, gap: 32 }}>
        <View className="items-center" style={{ gap: 16 }}>
          <AvitoLogo />
          <Text className="text-xl font-bold text-center text-[#1A1A1A]" style={{ letterSpacing: -0.3 }}>
            Войдите или зарегистрируйтесь
          </Text>
          <Text className="text-sm text-center" style={{ color: C.muted }}>
            Мы отправим код подтверждения на вашу почту
          </Text>
        </View>
        <View style={{ gap: 16 }}>
          <EmailInput value="user@example.com" disabled />
          <PrimaryButton label="Отправка..." loading />
          <LegalText />
        </View>
      </View>
    </PhoneFrame>
  );
}

function ErrorState() {
  return (
    <PhoneFrame>
      <View className="flex-1 px-6" style={{ paddingTop: 80, gap: 32 }}>
        <View className="items-center" style={{ gap: 16 }}>
          <AvitoLogo />
          <Text className="text-xl font-bold text-center text-[#1A1A1A]" style={{ letterSpacing: -0.3 }}>
            Войдите или зарегистрируйтесь
          </Text>
          <Text className="text-sm text-center" style={{ color: C.muted }}>
            Мы отправим код подтверждения на вашу почту
          </Text>
        </View>
        <View style={{ gap: 16 }}>
          <EmailInput value="not-valid" error />
          <PrimaryButton label="Получить код" disabled />
          <LegalText />
        </View>
      </View>
    </PhoneFrame>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN EXPORT
// ═══════════════════════════════════════════════════════════════════════════════

export default function AuthEmailStates() {
  return (
    <View style={{ gap: 40 }}>
      <StateSection title="AUTH_EMAIL — Default">
        <DefaultState />
      </StateSection>

      <StateSection title="AUTH_EMAIL — Filled">
        <FilledState />
      </StateSection>

      <StateSection title="AUTH_EMAIL — Loading">
        <LoadingState />
      </StateSection>

      <StateSection title="AUTH_EMAIL — Validation Error">
        <ErrorState />
      </StateSection>
    </View>
  );
}
