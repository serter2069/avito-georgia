import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { StateSection } from '../StateSection';

export default function OnboardingStates() {
  return (
    <View style={{ maxWidth: 430, alignSelf: 'center', width: '100%' }}>
      <StateSection title="default">
        <View className="py-6">
          <Text className="text-text-primary text-xl font-bold mb-1">Заполните профиль</Text>
          <Text className="text-text-muted text-sm mb-6">Расскажите немного о себе</Text>
          <View className="mb-4">
            <Text className="text-text-secondary text-sm mb-1 font-medium">Имя</Text>
            <TextInput className="bg-surface border border-border rounded-lg px-4 py-3 text-text-primary" placeholder="Ваше имя" placeholderTextColor="#6A8898" editable={false} />
          </View>
          <View className="mb-4">
            <Text className="text-text-secondary text-sm mb-1 font-medium">Телефон</Text>
            <TextInput className="bg-surface border border-border rounded-lg px-4 py-3 text-text-primary" placeholder="+995 555 XX XX XX" placeholderTextColor="#6A8898" editable={false} />
          </View>
          <View className="mb-6">
            <Text className="text-text-secondary text-sm mb-1 font-medium">Город</Text>
            <TouchableOpacity className="bg-surface border border-border rounded-lg px-4 py-3 flex-row items-center justify-between">
              <Text className="text-text-muted">Выберите город</Text>
              <Feather name="chevron-down" size={20} color="#6A8898" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity className="bg-primary py-3 rounded-lg items-center">
            <Text className="text-white font-semibold text-base">Продолжить</Text>
          </TouchableOpacity>
        </View>
      </StateSection>

      <StateSection title="validation_error">
        <View className="py-6">
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
              <Feather name="chevron-down" size={20} color="#6A8898" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity className="bg-primary py-3 rounded-lg items-center opacity-50">
            <Text className="text-white font-semibold text-base">Продолжить</Text>
          </TouchableOpacity>
        </View>
      </StateSection>

      <StateSection title="loading">
        <View className="py-6">
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
        <View className="py-6">
          <Text className="text-text-primary text-xl font-bold mb-1">Заполните профиль</Text>
          <Text className="text-text-muted text-sm mb-6">Расскажите немного о себе</Text>
          <View className="mb-4">
            <Text className="text-text-secondary text-sm mb-1 font-medium">Город</Text>
            <View className="bg-surface border border-border-focus rounded-lg overflow-hidden">
              <View className="px-4 py-3 flex-row items-center justify-between">
                <Text className="text-text-muted">Выберите город</Text>
                <Feather name="chevron-up" size={20} color="#0A7B8A" />
              </View>
              {['Тбилиси', 'Батуми', 'Кутаиси', 'Рустави', 'Гори', 'Зугдиди'].map((city) => (
                <TouchableOpacity key={city} className="px-4 py-3 border-t border-border">
                  <Text className="text-text-primary text-base">{city}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </StateSection>
    </View>
  );
}
