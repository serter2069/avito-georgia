import React from 'react';
import { View, Text, useWindowDimensions } from 'react-native';
import { StateSection } from '../StateSection';

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

function BackRow() {
  return (
    <View style={{ paddingHorizontal: 16, paddingTop: 16 }}>
      <Text style={{ fontSize: 18, color: C.text }}>← Назад</Text>
    </View>
  );
}

function OtpBox({ digit, active, error }: { digit?: string; active?: boolean; error?: boolean }) {
  return (
    <View
      className="items-center justify-center"
      style={{
        width: 44,
        height: 52,
        borderWidth: 1.5,
        borderColor: error ? C.error : active ? C.green : C.border,
        borderRadius: 8,
      }}
    >
      {digit ? (
        <Text className="font-bold" style={{ fontSize: 22, color: error ? C.error : C.text }}>
          {digit}
        </Text>
      ) : null}
    </View>
  );
}

function OtpBoxes({ digits, error }: { digits: string[]; error?: boolean }) {
  const boxes = Array.from({ length: 6 }, (_, i) => digits[i] || '');
  return (
    <View className="flex-row justify-center" style={{ gap: 10 }}>
      {boxes.map((d, i) => (
        <OtpBox key={i} digit={d} active={!!d} error={error} />
      ))}
    </View>
  );
}

function ConfirmButton({ disabled }: { disabled?: boolean }) {
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
      <Text className="text-white font-bold" style={{ fontSize: 16 }}>Подтвердить</Text>
    </View>
  );
}

// ─── States ─────────────────────────────────────────────────────────────────────

function DefaultState() {
  return (
    <ResponsiveWrapper>
      <View className="bg-white">
        <BackRow />
        <View style={{ paddingHorizontal: 24, paddingTop: 40, paddingBottom: 40, gap: 28 }}>
          <View className="items-center" style={{ gap: 8 }}>
            <Text className="text-xl font-bold" style={{ color: C.text }}>
              Введите код
            </Text>
            <Text className="text-sm text-center" style={{ color: C.muted }}>
              Отправили код на user@gmail.com
            </Text>
          </View>

          <OtpBoxes digits={[]} />
          <ConfirmButton disabled />

          <View className="items-center">
            <Text className="text-sm" style={{ color: C.muted }}>
              Отправить снова через 58с
            </Text>
          </View>
        </View>
      </View>
    </ResponsiveWrapper>
  );
}

function FillingState() {
  return (
    <ResponsiveWrapper>
      <View className="bg-white">
        <BackRow />
        <View style={{ paddingHorizontal: 24, paddingTop: 40, paddingBottom: 40, gap: 28 }}>
          <View className="items-center" style={{ gap: 8 }}>
            <Text className="text-xl font-bold" style={{ color: C.text }}>
              Введите код
            </Text>
            <Text className="text-sm text-center" style={{ color: C.muted }}>
              Отправили код на user@gmail.com
            </Text>
          </View>

          <OtpBoxes digits={['1', '2', '3', '4']} />
          <ConfirmButton disabled />

          <View className="items-center">
            <Text className="text-sm" style={{ color: C.muted }}>
              Отправить снова через 42с
            </Text>
          </View>
        </View>
      </View>
    </ResponsiveWrapper>
  );
}

function ErrorState() {
  return (
    <ResponsiveWrapper>
      <View className="bg-white">
        <BackRow />
        <View style={{ paddingHorizontal: 24, paddingTop: 40, paddingBottom: 40, gap: 28 }}>
          <View className="items-center" style={{ gap: 8 }}>
            <Text className="text-xl font-bold" style={{ color: C.text }}>
              Введите код
            </Text>
            <Text className="text-sm text-center" style={{ color: C.muted }}>
              Отправили код на user@gmail.com
            </Text>
          </View>

          <View style={{ gap: 8 }}>
            <OtpBoxes digits={['7', '3', '9', '1', '0', '5']} error />
            <Text className="text-center text-sm" style={{ color: C.error }}>
              Неверный код. Осталось 2 попытки
            </Text>
          </View>

          <ConfirmButton disabled />

          <View className="items-center">
            <Text className="text-sm" style={{ color: C.muted }}>
              Отправить снова через 31с
            </Text>
          </View>
        </View>
      </View>
    </ResponsiveWrapper>
  );
}

function ResendState() {
  return (
    <ResponsiveWrapper>
      <View className="bg-white">
        <BackRow />
        <View style={{ paddingHorizontal: 24, paddingTop: 40, paddingBottom: 40, gap: 28 }}>
          <View className="items-center" style={{ gap: 8 }}>
            <Text className="text-xl font-bold" style={{ color: C.text }}>
              Введите код
            </Text>
            <Text className="text-sm text-center" style={{ color: C.muted }}>
              Отправили код на user@gmail.com
            </Text>
          </View>

          <OtpBoxes digits={[]} />
          <ConfirmButton disabled />

          <View className="items-center">
            <Text className="text-sm font-semibold" style={{ color: C.green }}>
              Отправить снова
            </Text>
          </View>
        </View>
      </View>
    </ResponsiveWrapper>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN EXPORT
// ═══════════════════════════════════════════════════════════════════════════════

export default function AuthOtpStates() {
  return (
    <View style={{ gap: 40 }}>
      <StateSection title="AUTH_OTP — Default">
        <DefaultState />
      </StateSection>

      <StateSection title="AUTH_OTP — Filling">
        <FillingState />
      </StateSection>

      <StateSection title="AUTH_OTP — Error">
        <ErrorState />
      </StateSection>

      <StateSection title="AUTH_OTP — Resend Available">
        <ResendState />
      </StateSection>
    </View>
  );
}
