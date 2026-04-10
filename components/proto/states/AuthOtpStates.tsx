import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
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

  return (
    <View>
      <StateSection title="default">
        <View className="items-center py-8">
          <Text className="text-text-primary text-xl font-bold mb-2">Введите код</Text>
          <Text className="text-text-muted text-sm mb-6">Отправлен на irakli@gmail.com</Text>
          <View className="w-full mb-4">
            <TextInput
              className="bg-surface border border-border rounded-lg px-4 py-3 text-text-primary text-center text-xl tracking-widest"
              placeholder="000000"
              placeholderTextColor="#6A8898"
              value={otp}
              onChangeText={(v) => setOtp(v.replace(/[^0-9]/g, '').slice(0, 6))}
              keyboardType="number-pad"
              maxLength={6}
            />
          </View>
          <TouchableOpacity className="bg-primary w-full py-3 rounded-lg items-center mb-3">
            <Text className="text-white font-semibold text-base">Подтвердить</Text>
          </TouchableOpacity>
          <Text className="text-text-muted text-sm">Отправить снова через <Text className="text-primary font-semibold">0:59</Text></Text>
        </View>
      </StateSection>

      <StateSection title="error">
        <View className="items-center py-8">
          <Text className="text-text-primary text-xl font-bold mb-2">Введите код</Text>
          <Text className="text-text-muted text-sm mb-6">Отправлен на irakli@gmail.com</Text>
          <OtpInputRow values={['1', '2', '3', '4', '5', '6']} hasError />
          <Text className="text-error text-sm mb-4">Неверный код. Попробуйте снова.</Text>
          <TouchableOpacity className="bg-primary w-full py-3 rounded-lg items-center mb-3">
            <Text className="text-white font-semibold text-base">Подтвердить</Text>
          </TouchableOpacity>
        </View>
      </StateSection>

      <StateSection title="loading">
        <View className="items-center py-8">
          <Text className="text-text-primary text-xl font-bold mb-2">Введите код</Text>
          <Text className="text-text-muted text-sm mb-6">Отправлен на irakli@gmail.com</Text>
          <OtpInputRow values={['0', '0', '0', '0', '0', '0']} />
          <TouchableOpacity className="bg-primary w-full py-3 rounded-lg items-center opacity-50 mb-3">
            <ActivityIndicator color="#ffffff" />
          </TouchableOpacity>
        </View>
      </StateSection>

      <StateSection title="blocked">
        <View className="items-center py-8">
          <Text className="text-text-primary text-xl font-bold mb-2">Слишком много попыток</Text>
          <Text className="text-text-muted text-sm mb-6">Отправлен на irakli@gmail.com</Text>
          <View className="w-full bg-error/10 border border-error rounded-lg p-4 mb-6 items-center">
            <Text className="text-error font-semibold text-base mb-1">Аккаунт временно заблокирован</Text>
            <Text className="text-error text-sm text-center">Вы исчерпали 3 попытки. Попробуйте снова через</Text>
            <Text className="text-error text-2xl font-bold mt-2">4:58</Text>
          </View>
          <TouchableOpacity className="bg-primary/30 w-full py-3 rounded-lg items-center" disabled>
            <Text className="text-white font-semibold text-base">Подтвердить</Text>
          </TouchableOpacity>
        </View>
      </StateSection>

      <StateSection title="resend_available">
        <View className="items-center py-8">
          <Text className="text-text-primary text-xl font-bold mb-2">Введите код</Text>
          <Text className="text-text-muted text-sm mb-6">Отправлен на irakli@gmail.com</Text>
          <OtpInputRow values={['', '', '', '', '', '']} />
          <TouchableOpacity className="bg-primary w-full py-3 rounded-lg items-center mb-3">
            <Text className="text-white font-semibold text-base">Подтвердить</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text className="text-primary text-sm font-semibold">Отправить снова</Text>
          </TouchableOpacity>
        </View>
      </StateSection>

      <StateSection title="captcha_required">
        <View className="items-center py-8">
          <Text className="text-text-primary text-xl font-bold mb-2">Введите код</Text>
          <Text className="text-text-muted text-sm mb-6">Отправлен на irakli@gmail.com</Text>
          <OtpInputRow values={['', '', '', '', '', '']} />
          <View className="w-full bg-surface border border-border rounded-lg p-4 mb-4 items-center">
            <Text className="text-text-muted text-sm">CAPTCHA verification required</Text>
            <View className="w-full h-16 bg-border/30 rounded-md mt-2 items-center justify-center">
              <Text className="text-text-muted text-xs">reCAPTCHA placeholder</Text>
            </View>
          </View>
          <TouchableOpacity className="bg-primary w-full py-3 rounded-lg items-center opacity-50">
            <Text className="text-white font-semibold text-base">Подтвердить</Text>
          </TouchableOpacity>
        </View>
      </StateSection>
    </View>
  );
}
