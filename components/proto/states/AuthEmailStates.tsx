import React from 'react';
import { View, Text, TextInput, ActivityIndicator, useWindowDimensions } from 'react-native';
import { StateSection } from '../StateSection';

// ─── Core Design Tokens ───────────────────────────────────────────────────────
const C = { green:'#00AA6C', white:'#FFFFFF', text:'#1A1A1A', muted:'#737373', border:'#E0E0E0', error:'#D32F2F', bg:'#F5F5F5' };

// ─── Helpers ────────────────────────────────────────────────────────────────────

function AvitoLogo() {
  return (
    <View style={{ flexDirection:'row', alignItems:'center', gap:10 }}>
      <View style={{ width:40, height:40, borderRadius:10, backgroundColor:'#00AA6C', alignItems:'center', justifyContent:'center' }}>
        <Text style={{ color:'#fff', fontWeight:'800', fontSize:20 }}>A</Text>
      </View>
      <View style={{ flexDirection:'row', alignItems:'baseline', gap:1 }}>
        <Text style={{ fontWeight:'700', fontSize:22, color:'#1A1A1A' }}>avito</Text>
        <Text style={{ fontWeight:'600', fontSize:16, color:'#00AA6C' }}>.ge</Text>
      </View>
    </View>
  );
}

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

function EmailInput({ value, error, disabled }: { value?: string; error?: boolean; disabled?: boolean }) {
  return (
    <View>
      <TextInput
        style={{
          borderWidth: error ? 1.5 : 1,
          borderColor: error ? C.error : C.border,
          borderRadius: 8,
          backgroundColor: disabled ? C.bg : C.white,
          paddingHorizontal: 16,
          color: C.text,
          fontSize: 16,
          paddingVertical: 12,
        }}
        placeholder="ваш@email.com"
        placeholderTextColor={C.muted}
        value={value}
        
      />
      {error && (
        <Text className="text-sm mt-1.5" style={{ color: C.error }}>
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
        backgroundColor: C.green,
        paddingVertical: 14,
        borderRadius: 8,
        gap: 8,
        opacity: disabled ? 0.5 : 1,
      }}
    >
      {loading && <ActivityIndicator size="small" color="#fff" />}
      <Text className="text-white font-bold" style={{ fontSize: 16 }}>
        {label}
      </Text>
    </View>
  );
}

// ─── States ─────────────────────────────────────────────────────────────────────

function DefaultState() {
  return (
    <ResponsiveWrapper>
      <View className="bg-white" style={{ paddingHorizontal: 24, paddingTop: 80, paddingBottom: 40, gap: 32 }}>
        <View className="items-center" style={{ gap: 16 }}>
          <AvitoLogo />
          <Text className="text-xl font-bold text-center" style={{ color: C.text }}>
            Войдите или зарегистрируйтесь
          </Text>
          <Text className="text-sm text-center" style={{ color: C.muted }}>
            Введите email — мы отправим код подтверждения
          </Text>
        </View>
        <View style={{ gap: 16 }}>
          <EmailInput />
          <PrimaryButton label="Получить код" disabled />
        </View>
      </View>
    </ResponsiveWrapper>
  );
}

function FilledState() {
  return (
    <ResponsiveWrapper>
      <View className="bg-white" style={{ paddingHorizontal: 24, paddingTop: 80, paddingBottom: 40, gap: 32 }}>
        <View className="items-center" style={{ gap: 16 }}>
          <AvitoLogo />
          <Text className="text-xl font-bold text-center" style={{ color: C.text }}>
            Войдите или зарегистрируйтесь
          </Text>
          <Text className="text-sm text-center" style={{ color: C.muted }}>
            Введите email — мы отправим код подтверждения
          </Text>
        </View>
        <View style={{ gap: 16 }}>
          <EmailInput value="user@gmail.com" />
          <PrimaryButton label="Получить код" />
        </View>
      </View>
    </ResponsiveWrapper>
  );
}

function LoadingState() {
  return (
    <ResponsiveWrapper>
      <View className="bg-white" style={{ paddingHorizontal: 24, paddingTop: 80, paddingBottom: 40, gap: 32 }}>
        <View className="items-center" style={{ gap: 16 }}>
          <AvitoLogo />
          <Text className="text-xl font-bold text-center" style={{ color: C.text }}>
            Войдите или зарегистрируйтесь
          </Text>
          <Text className="text-sm text-center" style={{ color: C.muted }}>
            Введите email — мы отправим код подтверждения
          </Text>
        </View>
        <View style={{ gap: 16 }}>
          <EmailInput value="user@gmail.com" disabled />
          <PrimaryButton label="Получить код" loading />
        </View>
      </View>
    </ResponsiveWrapper>
  );
}

function ErrorState() {
  return (
    <ResponsiveWrapper>
      <View className="bg-white" style={{ paddingHorizontal: 24, paddingTop: 80, paddingBottom: 40, gap: 32 }}>
        <View className="items-center" style={{ gap: 16 }}>
          <AvitoLogo />
          <Text className="text-xl font-bold text-center" style={{ color: C.text }}>
            Войдите или зарегистрируйтесь
          </Text>
          <Text className="text-sm text-center" style={{ color: C.muted }}>
            Введите email — мы отправим код подтверждения
          </Text>
        </View>
        <View style={{ gap: 16 }}>
          <EmailInput value="not-valid" error />
          <PrimaryButton label="Получить код" disabled />
        </View>
      </View>
    </ResponsiveWrapper>
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
