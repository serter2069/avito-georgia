import React from 'react';
import { View, Text } from 'react-native';
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
        minHeight: 480,
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

function BackRow() {
  return (
    <View className="px-4 pt-4">
      <Text style={{ fontSize: 18, color: C.text }}>← Назад</Text>
    </View>
  );
}

function OtpBox({ digit, error }: { digit?: string; error?: boolean }) {
  return (
    <View
      className="items-center justify-center"
      style={{
        width: 44,
        height: 52,
        borderWidth: error ? 1.5 : 1,
        borderColor: error ? C.error : digit ? C.green : C.border,
        borderRadius: R.md,
        backgroundColor: error ? '#FFEBEE' : C.white,
      }}
    >
      {digit && (
        <Text className="font-bold" style={{ fontSize: 22, color: error ? C.error : C.text }}>
          {digit}
        </Text>
      )}
    </View>
  );
}

function OtpBoxes({ digits, error }: { digits: string[]; error?: boolean }) {
  const boxes = Array.from({ length: 6 }, (_, i) => digits[i] || '');
  return (
    <View className="flex-row justify-center" style={{ gap: 10 }}>
      {boxes.map((d, i) => (
        <OtpBox key={i} digit={d} error={error} />
      ))}
    </View>
  );
}

function ConfirmButton({ disabled }: { disabled?: boolean }) {
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
      <Text className="text-white font-bold" style={{ fontSize: 16 }}>Подтвердить</Text>
    </View>
  );
}

// ─── States ─────────────────────────────────────────────────────────────────────

function DefaultState() {
  return (
    <PhoneFrame>
      <BackRow />
      <View className="flex-1 px-6" style={{ paddingTop: 40, gap: 28 }}>
        <View className="items-center" style={{ gap: 8 }}>
          <Text className="text-xl font-bold text-[#1A1A1A]" style={{ letterSpacing: -0.3 }}>
            Введите код из письма
          </Text>
          <Text className="text-sm text-center" style={{ color: C.muted }}>
            Мы отправили 6-значный код на
          </Text>
          <Text className="text-sm font-semibold" style={{ color: C.text }}>
            user@example.com
          </Text>
        </View>

        <OtpBoxes digits={[]} />
        <ConfirmButton disabled />

        <View className="items-center" style={{ gap: 4 }}>
          <Text className="text-sm" style={{ color: C.muted }}>
            Отправить снова
          </Text>
          <Text className="text-xs font-semibold" style={{ color: C.green }}>
            Через 58с
          </Text>
        </View>
      </View>
    </PhoneFrame>
  );
}

function FillingState() {
  return (
    <PhoneFrame>
      <BackRow />
      <View className="flex-1 px-6" style={{ paddingTop: 40, gap: 28 }}>
        <View className="items-center" style={{ gap: 8 }}>
          <Text className="text-xl font-bold text-[#1A1A1A]" style={{ letterSpacing: -0.3 }}>
            Введите код из письма
          </Text>
          <Text className="text-sm text-center" style={{ color: C.muted }}>
            Мы отправили 6-значный код на
          </Text>
          <Text className="text-sm font-semibold" style={{ color: C.text }}>
            user@example.com
          </Text>
        </View>

        <OtpBoxes digits={['1', '2', '3', '4']} />
        <ConfirmButton disabled />

        <View className="items-center" style={{ gap: 4 }}>
          <Text className="text-sm" style={{ color: C.muted }}>
            Отправить снова
          </Text>
          <Text className="text-xs font-semibold" style={{ color: C.green }}>
            Через 42с
          </Text>
        </View>
      </View>
    </PhoneFrame>
  );
}

function ErrorState() {
  return (
    <PhoneFrame>
      <BackRow />
      <View className="flex-1 px-6" style={{ paddingTop: 40, gap: 28 }}>
        <View className="items-center" style={{ gap: 8 }}>
          <Text className="text-xl font-bold text-[#1A1A1A]" style={{ letterSpacing: -0.3 }}>
            Введите код из письма
          </Text>
          <Text className="text-sm text-center" style={{ color: C.muted }}>
            Мы отправили 6-значный код на
          </Text>
          <Text className="text-sm font-semibold" style={{ color: C.text }}>
            user@example.com
          </Text>
        </View>

        <View style={{ gap: 8 }}>
          <OtpBoxes digits={['7', '3', '9', '1', '0', '5']} error />
          <Text className="text-center text-xs" style={{ color: C.error }}>
            Неверный код. Осталось 2 попытки
          </Text>
        </View>

        <ConfirmButton disabled />

        <View className="items-center" style={{ gap: 4 }}>
          <Text className="text-sm" style={{ color: C.muted }}>
            Отправить снова
          </Text>
          <Text className="text-xs font-semibold" style={{ color: C.green }}>
            Через 31с
          </Text>
        </View>
      </View>
    </PhoneFrame>
  );
}

function ResendState() {
  return (
    <PhoneFrame>
      <BackRow />
      <View className="flex-1 px-6" style={{ paddingTop: 40, gap: 28 }}>
        <View className="items-center" style={{ gap: 8 }}>
          <Text className="text-xl font-bold text-[#1A1A1A]" style={{ letterSpacing: -0.3 }}>
            Введите код из письма
          </Text>
          <Text className="text-sm text-center" style={{ color: C.muted }}>
            Мы отправили 6-значный код на
          </Text>
          <Text className="text-sm font-semibold" style={{ color: C.text }}>
            user@example.com
          </Text>
        </View>

        <OtpBoxes digits={[]} />
        <ConfirmButton disabled />

        <View className="items-center">
          <View
            className="rounded-lg px-5 py-2.5"
            style={{ backgroundColor: C.greenBg }}
          >
            <Text className="font-semibold" style={{ fontSize: 14, color: C.green }}>
              Отправить снова
            </Text>
          </View>
        </View>
      </View>
    </PhoneFrame>
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
