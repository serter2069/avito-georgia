import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, useWindowDimensions } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { StateSection } from '../StateSection';

const CITIES = ['Тбилиси', 'Батуми', 'Кутаиси', 'Рустави', 'Гори', 'Зугдиди'];

export default function OnboardingStates() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [cityOpen, setCityOpen] = useState(false);
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;

  const formStyle = isDesktop ? { maxWidth: 480, alignSelf: 'center' as const, width: '100%' } : {};
  const containerStyle = isDesktop ? { maxWidth: 960, alignSelf: 'center' as const, width: '100%' } : {};


  return (
    <View>
      <StateSection title="default">
        <View style={[{ minHeight: 844 }, formStyle]} className="py-6">
          <Text className="text-text-primary text-xl font-bold mb-1">Заполните профиль</Text>
          <Text className="text-text-muted text-sm mb-6">Расскажите немного о себе</Text>
          <View className="mb-4">
            <Text className="text-text-secondary text-sm mb-1 font-medium">Имя</Text>
            <TextInput
              className="bg-surface border border-border rounded-lg px-4 py-3 text-text-primary"
              placeholder="Ваше имя"
              placeholderTextColor="#737373"
              value={name}
              onChangeText={setName}
            />
          </View>
          <View className="mb-4">
            <Text className="text-text-secondary text-sm mb-1 font-medium">Телефон</Text>
            <TextInput
              className="bg-surface border border-border rounded-lg px-4 py-3 text-text-primary"
              placeholder="+995 555 XX XX XX"
              placeholderTextColor="#737373"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
          </View>
          <View className="mb-6">
            <Text className="text-text-secondary text-sm mb-1 font-medium">Город</Text>
            <TouchableOpacity
              className="bg-surface border border-border rounded-lg px-4 py-3 flex-row items-center justify-between"
              onPress={() => setCityOpen(!cityOpen)}
            >
              <Text className={city ? 'text-text-primary' : 'text-text-muted'}>{city || 'Выберите город'}</Text>
              <Feather name={cityOpen ? 'chevron-up' : 'chevron-down'} size={20} color="#737373" />
            </TouchableOpacity>
            {cityOpen && (
              <View className="bg-surface border border-border-focus rounded-lg overflow-hidden mt-1">
                {CITIES.map((c) => (
                  <TouchableOpacity
                    key={c}
                    className="px-4 py-3 border-b border-border"
                    onPress={() => { setCity(c); setCityOpen(false); }}
                  >
                    <Text className="text-text-primary text-base">{c}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
          <TouchableOpacity className="bg-primary py-3 rounded-lg items-center">
            <Text className="text-white font-semibold text-base">Продолжить</Text>
          </TouchableOpacity>
        </View>
      </StateSection>

      <StateSection title="validation_error">
        <View style={[{ minHeight: 844 }, formStyle]} className="py-6">
          <Text className="text-text-primary text-xl font-bold mb-1">Заполните профиль</Text>
          <Text className="text-text-muted text-sm mb-6">Расскажите немного о себе</Text>
          <View className="mb-4">
            <Text className="text-text-secondary text-sm mb-1 font-medium">Имя</Text>
            <TextInput className="bg-surface border border-error rounded-lg px-4 py-3 text-text-primary" value="" editable={false} />
            <Text className="text-error text-xs mt-1">Имя обязательно</Text>
          </View>
          <View className="mb-4">
            <Text className="text-text-secondary text-sm mb-1 font-medium">Телефон</Text>
            <TextInput className="bg-surface border border-error rounded-lg px-4 py-3 text-text-primary" value="123" editable={false} />
            <Text className="text-error text-xs mt-1">Некорректный номер телефона</Text>
          </View>
          <View className="mb-6">
            <Text className="text-text-secondary text-sm mb-1 font-medium">Город</Text>
            <TouchableOpacity className="bg-surface border border-border rounded-lg px-4 py-3 flex-row items-center justify-between">
              <Text className="text-text-muted">Выберите город</Text>
              <Feather name="chevron-down" size={20} color="#737373" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity className="bg-primary py-3 rounded-lg items-center opacity-50">
            <Text className="text-white font-semibold text-base">Продолжить</Text>
          </TouchableOpacity>
        </View>
      </StateSection>

      <StateSection title="loading">
        <View style={[{ minHeight: 844 }, formStyle]} className="py-6">
          <Text className="text-text-primary text-xl font-bold mb-1">Заполните профиль</Text>
          <Text className="text-text-muted text-sm mb-6">Расскажите немного о себе</Text>
          <View className="mb-4 opacity-50">
            <Text className="text-text-secondary text-sm mb-1 font-medium">Имя</Text>
            <TextInput className="bg-surface border border-border rounded-lg px-4 py-3 text-text-primary" value="Ираклий" editable={false} />
          </View>
          <View className="mb-4 opacity-50">
            <Text className="text-text-secondary text-sm mb-1 font-medium">Телефон</Text>
            <TextInput className="bg-surface border border-border rounded-lg px-4 py-3 text-text-primary" value="+995 555 12 34 56" editable={false} />
          </View>
          <View className="mb-6 opacity-50">
            <Text className="text-text-secondary text-sm mb-1 font-medium">Город</Text>
            <View className="bg-surface border border-border rounded-lg px-4 py-3">
              <Text className="text-text-primary">Тбилиси</Text>
            </View>
          </View>
          <TouchableOpacity className="bg-primary py-3 rounded-lg items-center opacity-50">
            <ActivityIndicator color="#ffffff" />
          </TouchableOpacity>
        </View>
      </StateSection>

      <StateSection title="city_picker_open">
        <View style={[{ minHeight: 844 }, formStyle]} className="py-6">
          <Text className="text-text-primary text-xl font-bold mb-1">Заполните профиль</Text>
          <Text className="text-text-muted text-sm mb-6">Расскажите немного о себе</Text>
          <View className="mb-4">
            <Text className="text-text-secondary text-sm mb-1 font-medium">Город</Text>
            <View className="bg-surface border border-border-focus rounded-lg overflow-hidden">
              <View className="px-4 py-3 flex-row items-center justify-between">
                <Text className="text-text-muted">Выберите город</Text>
                <Feather name="chevron-up" size={20} color="#00AA6C" />
              </View>
              {CITIES.map((c) => (
                <TouchableOpacity key={c} className="px-4 py-3 border-t border-border">
                  <Text className="text-text-primary text-base">{c}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </StateSection>
    </View>
  );
}
