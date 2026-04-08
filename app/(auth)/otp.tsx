import { useState, useRef, useEffect, useCallback } from 'react';
import { View, Text, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Button } from '../../components/ui/Button';
import { api } from '../../lib/api';
import { useAuthStore } from '../../stores/authStore';

const OTP_LENGTH = 6;
const RESEND_COOLDOWN = 60;
const TURNSTILE_SITE_KEY = process.env.EXPO_PUBLIC_TURNSTILE_SITE_KEY || '1x00000000000000000000AA';

export default function OtpScreen() {
  const { t } = useTranslation();
  const { email } = useLocalSearchParams<{ email: string }>();
  const setAuth = useAuthStore((s) => s.setAuth);
  const router = useRouter();

  const [code, setCode] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN);
  const [captchaRequired, setCaptchaRequired] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);

  const inputRefs = useRef<(TextInput | null)[]>([]);

  // Cooldown timer for resend
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleChange = useCallback((text: string, index: number) => {
    setError('');

    // Handle paste of full code
    if (text.length > 1) {
      const digits = text.replace(/\D/g, '').slice(0, OTP_LENGTH).split('');
      const newCode = [...Array(OTP_LENGTH).fill('')];
      digits.forEach((d, i) => { newCode[i] = d; });
      setCode(newCode);

      const focusIndex = Math.min(digits.length, OTP_LENGTH - 1);
      inputRefs.current[focusIndex]?.focus();
      return;
    }

    const digit = text.replace(/\D/g, '');
    const newCode = [...code];
    newCode[index] = digit;
    setCode(newCode);

    // Auto-advance to next box
    if (digit && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  }, [code]);

  const handleKeyPress = useCallback((e: { nativeEvent: { key: string } }, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
      const newCode = [...code];
      newCode[index - 1] = '';
      setCode(newCode);
      inputRefs.current[index - 1]?.focus();
    }
  }, [code]);

  // Inject Turnstile script and widget into the page (web-only)
  useEffect(() => {
    if (Platform.OS !== 'web' || !captchaRequired) return;

    // Load Turnstile script once
    const scriptId = 'cf-turnstile-script';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://challenges.cloudflare.com/turnstile/v1/api.js';
      script.async = true;
      document.head.appendChild(script);
    }

    // Render widget after script loads
    const renderWidget = () => {
      const container = document.getElementById('cf-turnstile-container');
      if (!container || container.children.length > 0) return;
      // @ts-ignore — Turnstile is loaded via CDN
      if (window.turnstile) {
        // @ts-ignore
        window.turnstile.render(container, {
          sitekey: TURNSTILE_SITE_KEY,
          callback: (token: string) => {
            setCaptchaToken(token);
          },
          'expired-callback': () => {
            setCaptchaToken(null);
          },
        });
      }
    };

    // Small delay to let script load
    const timer = setTimeout(renderWidget, 500);
    return () => clearTimeout(timer);
  }, [captchaRequired]);

  const handleVerify = async () => {
    const otp = code.join('');
    if (otp.length !== OTP_LENGTH) return;

    // If CAPTCHA is required but not yet solved, block submission
    if (captchaRequired && !captchaToken) {
      setError(t('solveCaptcha') || 'Please complete the CAPTCHA');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const body: Record<string, string> = { email: email as string, code: otp };
      if (captchaToken) body.captchaToken = captchaToken;

      const res = await api.post<{
        accessToken: string;
        refreshToken: string;
        captchaRequired?: boolean;
        user: { id: string; email: string; role: string; isOnboarded: boolean };
      }>('/auth/verify-otp', body);

      if (res.ok && res.data) {
        // Set Zustand in-memory state synchronously BEFORE navigation.
        // This ensures useProtectedRoute sees user immediately when
        // router.replace triggers a layout re-render.
        // Storage writes (SecureStore) happen async in background — no await.
        useAuthStore.setState({
          user: res.data.user,
          accessToken: res.data.accessToken,
          isReady: true,
        });
        // Persist tokens to storage (fire-and-forget, non-blocking)
        setAuth(res.data.user, res.data.accessToken, res.data.refreshToken);
        // Route based on onboarding status
        if (!res.data.user.isOnboarded) {
          router.replace('/onboarding');
        } else {
          router.replace('/');
        }
      } else {
        // Check if server requires CAPTCHA now
        const errData = res.data as { captchaRequired?: boolean } | undefined;
        if (errData?.captchaRequired) {
          setCaptchaRequired(true);
          setCaptchaToken(null);
        }
        setError(res.error || t('invalidCode'));
      }
    } catch {
      setError(t('error'));
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (cooldown > 0) return;

    try {
      await api.post('/auth/request-otp', { email });
      setCooldown(RESEND_COOLDOWN);
      setCode(Array(OTP_LENGTH).fill(''));
      setError('');
      inputRefs.current[0]?.focus();
    } catch {
      setError(t('error'));
    }
  };

  const fullCode = code.join('');

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View className="flex-1 justify-center px-6">
        {/* Header */}
        <View className="items-center mb-8">
          <Text className="text-text-primary text-xl font-bold mb-2">
            {t('enterOtp')}
          </Text>
          <Text className="text-text-secondary text-sm text-center">
            {t('otpSent', { email })}
          </Text>
        </View>

        {/* OTP boxes */}
        <View className="flex-row justify-center gap-2 mb-4">
          {code.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => { inputRefs.current[index] = ref; }}
              className={`w-12 h-14 border rounded-lg text-center text-xl font-bold text-text-primary bg-surface ${
                error ? 'border-error' : digit ? 'border-primary' : 'border-border'
              }`}
              value={digit}
              onChangeText={(text) => handleChange(text, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              keyboardType="number-pad"
              maxLength={index === 0 ? OTP_LENGTH : 1}
              selectTextOnFocus
            />
          ))}
        </View>

        {/* Error */}
        {error ? (
          <Text className="text-error text-sm text-center mb-4">{error}</Text>
        ) : null}

        {/* Turnstile CAPTCHA widget — shown on web after 3 failed attempts */}
        {captchaRequired && Platform.OS === 'web' ? (
          <View className="items-center mb-4">
            {/* @ts-ignore — web-only div element */}
            <div id="cf-turnstile-container" />
          </View>
        ) : null}

        {/* Verify button */}
        <View className="mb-4">
          <Button
            onPress={handleVerify}
            title={t('confirmCode')}
            size="lg"
            loading={loading}
            disabled={fullCode.length !== OTP_LENGTH || (captchaRequired && !captchaToken)}
          />
        </View>

        {/* Resend */}
        <Button
          onPress={handleResend}
          title={cooldown > 0 ? t('resendIn', { seconds: cooldown }) : t('resendCode')}
          variant="ghost"
          size="md"
          disabled={cooldown > 0}
        />
      </View>
    </KeyboardAvoidingView>
  );
}
