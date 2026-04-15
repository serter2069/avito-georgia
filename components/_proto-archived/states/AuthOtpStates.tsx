import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, useWindowDimensions } from 'react-native';
import { StateSection } from '../StateSection';

function OtpInputRow({ values, hasError }: { values: string[]; hasError?: boolean }) {
  return (
    <View className="flex-row gap-2 justify-center mb-4">
      {values.map((v, i) => (
        <TextInput
          key={i}
          className={`w-12 h-12 border ${hasError ? 'border-error' : 'border-border'} rounded-lg text-center text-xl text-text-primary bg-surface`}
          value={v}
          editable={false}
        />
      ))}
    </View>
  );
}

export default function AuthOtpStates() {
  const [otp, setOtp] = useState('');
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;

  const formStyle = isDesktop ? { maxWidth: 480, alignSelf: 'center' as const, width: '100%' } : {};
  const containerStyle = isDesktop ? { maxWidth: 960, alignSelf: 'center' as const, width: '100%' } : {};


  return (
    <View>
      <StateSection title="default">
        <View style={[{ minHeight: 844 }, containerStyle]} className="items-center py-8">
          <Text className="text-text-primary text-xl font-bold mb-2">Введите код</Text>
          <Text className="text-text-muted text-sm mb-6">Отправлен на irakli@gmail.com</Text>
          <View style={[{ width: '100%' }, formStyle]}>
            <View className="w-full mb-4">
              <TextInput
                className="bg-surface border border-border rounded-lg px-4 py-3 text-text-primary text-center text-xl tracking-widest"
                placeholder="000000"
                placeholderTextColor="#737373"
                value={otp}
                onChangeText={(v) => setOtp(v.replace(/[^0-9]/g, '').slice(0, 6))}
                keyboardType="number-pad"
                maxLength={6}
              />
            </View>
            <TouchableOpacity className="bg-primary w-full py-3 rounded-lg items-center mb-3">
              <Text className="text-white font-semibold text-base">Подтвердить</Text>
            </TouchableOpacity>
            <Text className="text-text-muted text-sm text-center">Отправить снова через <Text className="text-primary font-semibold">0:59</Text></Text>
          </View>
        </View>
      </StateSection>

      <StateSection title="error">
        <View style={[{ minHeight: 844 }, containerStyle]} className="items-center py-8">
          <Text className="text-text-primary text-xl font-bold mb-2">Введите код</Text>
          <Text className="text-text-muted text-sm mb-6">Отправлен на irakli@gmail.com</Text>
          <View style={[{ width: '100%' }, formStyle]}>
            <OtpInputRow values={['1', '2', '3', '4', '5', '6']} hasError />
            <Text className="text-error text-sm mb-4 text-center">Неверный код. Осталось 2 попытки.</Text>
            <TouchableOpacity className="bg-primary w-full py-3 rounded-lg items-center mb-3">
              <Text className="text-white font-semibold text-base">Подтвердить</Text>
            </TouchableOpacity>
          </View>
        </View>
      </StateSection>

      <StateSection title="loading">
        <View style={[{ minHeight: 844 }, containerStyle]} className="items-center py-8">
          <Text className="text-text-primary text-xl font-bold mb-2">Введите код</Text>
          <Text className="text-text-muted text-sm mb-6">Отправлен на irakli@gmail.com</Text>
          <View style={[{ width: '100%' }, formStyle]}>
            <OtpInputRow values={['0', '0', '0', '0', '0', '0']} />
            <TouchableOpacity className="bg-primary w-full py-3 rounded-lg items-center opacity-50 mb-3">
              <ActivityIndicator color="#ffffff" />
            </TouchableOpacity>
          </View>
        </View>
      </StateSection>

      <StateSection title="blocked">
        <View style={[{ minHeight: 844 }, containerStyle]} className="items-center py-8">
          <Text className="text-text-primary text-xl font-bold mb-2">Слишком много попыток</Text>
          <Text className="text-text-muted text-sm mb-6">Отправлен на irakli@gmail.com</Text>
          <View style={[{ width: '100%' }, formStyle]}>
            <View className="w-full bg-error/10 border border-error rounded-lg p-4 mb-6 items-center">
              <Text className="text-error font-semibold text-base mb-1">Аккаунт временно заблокирован</Text>
              <Text className="text-error text-sm text-center">Вы исчерпали 3 попытки. Попробуйте снова через</Text>
              <Text className="text-error text-2xl font-bold mt-2">4:58</Text>
            </View>
            <TouchableOpacity className="bg-primary/30 w-full py-3 rounded-lg items-center" disabled>
              <Text className="text-white font-semibold text-base">Подтвердить</Text>
            </TouchableOpacity>
          </View>
        </View>
      </StateSection>

      <StateSection title="resend_available">
        <View style={[{ minHeight: 844 }, containerStyle]} className="items-center py-8">
          <Text className="text-text-primary text-xl font-bold mb-2">Введите код</Text>
          <Text className="text-text-muted text-sm mb-6">Отправлен на irakli@gmail.com</Text>
          <View style={[{ width: '100%' }, formStyle]}>
            <OtpInputRow values={['', '', '', '', '', '']} />
            <TouchableOpacity className="bg-primary w-full py-3 rounded-lg items-center mb-3">
              <Text className="text-white font-semibold text-base">Подтвердить</Text>
            </TouchableOpacity>
            <TouchableOpacity className="items-center">
              <Text className="text-primary text-sm font-semibold">Отправить снова</Text>
            </TouchableOpacity>
          </View>
        </View>
      </StateSection>

      <StateSection title="captcha_required">
        <View style={[{ minHeight: 844 }, containerStyle]} className="items-center py-8">
          <Text className="text-text-primary text-xl font-bold mb-2">Введите код</Text>
          <Text className="text-text-muted text-sm mb-6">Отправлен на irakli@gmail.com</Text>
          <View style={[{ width: '100%' }, formStyle]}>
            <OtpInputRow values={['', '', '', '', '', '']} />
            <View className="w-full bg-surface border border-border rounded-lg p-4 mb-4 items-center">
              <Text className="text-text-muted text-sm">Подтвердите, что вы не робот</Text>
              <View className="w-full h-16 bg-border/30 rounded-md mt-2 items-center justify-center">
                <Text className="text-text-muted text-xs">reCAPTCHA</Text>
              </View>
            </View>
            <TouchableOpacity className="bg-primary w-full py-3 rounded-lg items-center opacity-50">
              <Text className="text-white font-semibold text-base">Подтвердить</Text>
            </TouchableOpacity>
          </View>
        </View>
      </StateSection>
    </View>
  );
}
