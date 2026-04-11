import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, useWindowDimensions } from 'react-native';
import { StateSection } from '../StateSection';

export default function AuthEmailStates() {
  const [email, setEmail] = useState('');
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;

  const formStyle = isDesktop ? { maxWidth: 480, alignSelf: 'center' as const, width: '100%' } : {};

  return (
    <View>
      <StateSection title="default">
        <View className="items-center py-8">
          <Text className="text-primary text-2xl font-bold mb-2">Avito Georgia</Text>
          <Text className="text-text-muted text-sm mb-8">Войдите или зарегистрируйтесь</Text>
          <View style={[{ width: '100%' }, formStyle]}>
            <View className="w-full mb-4">
              <Text className="text-text-secondary text-sm mb-1 font-medium">Email</Text>
              <TextInput
                className="bg-surface border border-border rounded-lg px-4 py-3 text-text-primary text-base"
                placeholder="your@email.com"
                placeholderTextColor="#737373"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            <TouchableOpacity className="bg-primary w-full py-3 rounded-lg items-center">
              <Text className="text-white font-semibold text-base">Получить код</Text>
            </TouchableOpacity>
          </View>
        </View>
      </StateSection>

      <StateSection title="validation_error">
        <View className="items-center py-8">
          <Text className="text-primary text-2xl font-bold mb-2">Avito Georgia</Text>
          <Text className="text-text-muted text-sm mb-8">Войдите или зарегистрируйтесь</Text>
          <View style={[{ width: '100%' }, formStyle]}>
            <View className="w-full mb-4">
              <Text className="text-text-secondary text-sm mb-1 font-medium">Email</Text>
              <TextInput
                className="bg-surface border border-error rounded-lg px-4 py-3 text-text-primary text-base"
                value="invalid-email"
                editable={false}
              />
              <Text className="text-error text-xs mt-1">Введите корректный email</Text>
            </View>
            <TouchableOpacity className="bg-primary w-full py-3 rounded-lg items-center opacity-50">
              <Text className="text-white font-semibold text-base">Получить код</Text>
            </TouchableOpacity>
          </View>
        </View>
      </StateSection>

      <StateSection title="loading">
        <View className="items-center py-8">
          <Text className="text-primary text-2xl font-bold mb-2">Avito Georgia</Text>
          <Text className="text-text-muted text-sm mb-8">Войдите или зарегистрируйтесь</Text>
          <View style={[{ width: '100%' }, formStyle]}>
            <View className="w-full mb-4">
              <Text className="text-text-secondary text-sm mb-1 font-medium">Email</Text>
              <TextInput
                className="bg-surface border border-border rounded-lg px-4 py-3 text-text-primary text-base opacity-50"
                value="irakli@gmail.com"
                editable={false}
              />
            </View>
            <TouchableOpacity className="bg-primary w-full py-3 rounded-lg items-center opacity-50">
              <ActivityIndicator color="#ffffff" />
            </TouchableOpacity>
          </View>
        </View>
      </StateSection>

      <StateSection title="network_error">
        <View className="items-center py-8">
          <Text className="text-primary text-2xl font-bold mb-2">Avito Georgia</Text>
          <Text className="text-text-muted text-sm mb-8">Войдите или зарегистрируйтесь</Text>
          <View style={[{ width: '100%' }, formStyle]}>
            <View className="w-full bg-error/10 border border-error rounded-lg p-3 mb-4">
              <Text className="text-error text-sm text-center">Нет соединения. Проверьте интернет и попробуйте снова.</Text>
            </View>
            <View className="w-full mb-4">
              <Text className="text-text-secondary text-sm mb-1 font-medium">Email</Text>
              <TextInput
                className="bg-surface border border-border rounded-lg px-4 py-3 text-text-primary text-base"
                value="irakli@gmail.com"
                editable={false}
              />
            </View>
            <TouchableOpacity className="bg-primary w-full py-3 rounded-lg items-center">
              <Text className="text-white font-semibold text-base">Повторить</Text>
            </TouchableOpacity>
          </View>
        </View>
      </StateSection>
    </View>
  );
}
