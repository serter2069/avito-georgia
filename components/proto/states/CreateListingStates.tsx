import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, useWindowDimensions } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { StateSection } from '../StateSection';
import { mockCategories, mockCategoryIcons, mockCities } from '../../../constants/protoMockData';

function Stepper({ current }: { current: number }) {
  return (
    <View className="flex-row items-center justify-center mb-6">
      {[1, 2, 3, 4].map((step) => (
        <View key={step} className="flex-row items-center">
          <View className={`w-8 h-8 rounded-full items-center justify-center ${step <= current ? 'bg-primary' : 'bg-surface border border-border'}`}>
            <Text className={`text-sm font-bold ${step <= current ? 'text-white' : 'text-text-muted'}`}>{step}</Text>
          </View>
          {step < 4 && <View className={`w-8 h-0.5 ${step < current ? 'bg-primary' : 'bg-border'}`} />}
        </View>
      ))}
    </View>
  );
}

export default function CreateListingStates() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formTitle, setFormTitle] = useState('Toyota Camry 2020, 2.5L');
  const [formDescription, setFormDescription] = useState('Отличное состояние, один владелец, полная история обслуживания.');
  const [formPrice, setFormPrice] = useState('28500');
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;

  return (
    <View>
      <StateSection title="step_flow">
        <View style={isDesktop ? { maxWidth: 640, alignSelf: 'center', width: '100%' } : undefined} className="py-4">
          <Stepper current={currentStep} />

          {currentStep === 1 && (
            <View>
              <Text className="text-text-primary text-lg font-bold mb-4">Выберите категорию</Text>
              {mockCategories.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  className="flex-row items-center gap-3 py-3 border-b border-border"
                  onPress={() => setCurrentStep(2)}
                >
                  <View className="w-10 h-10 bg-surface rounded-lg items-center justify-center">
                    <Feather name={(mockCategoryIcons[cat] as any) || 'grid'} size={20} color="#00AA6C" />
                  </View>
                  <Text className="text-text-primary text-base flex-1">{cat}</Text>
                  <Feather name="chevron-right" size={16} color="#737373" />
                </TouchableOpacity>
              ))}
            </View>
          )}

          {currentStep === 2 && (
            <View>
              <Text className="text-text-primary text-lg font-bold mb-4">Выберите город</Text>
              {mockCities.map((city) => (
                <TouchableOpacity
                  key={city}
                  className="flex-row items-center gap-3 py-3 border-b border-border"
                  onPress={() => setCurrentStep(3)}
                >
                  <Feather name="map-pin" size={20} color="#00AA6C" />
                  <Text className="text-text-primary text-base flex-1">{city}</Text>
                  <Feather name="chevron-right" size={16} color="#737373" />
                </TouchableOpacity>
              ))}
              <TouchableOpacity className="mt-4 py-2" onPress={() => setCurrentStep(1)}>
                <Text className="text-primary text-sm font-medium">Назад</Text>
              </TouchableOpacity>
            </View>
          )}

          {currentStep === 3 && (
            <View>
              <Text className="text-text-primary text-lg font-bold mb-4">Детали объявления</Text>
              <View className="mb-4">
                <Text className="text-text-secondary text-sm mb-1 font-medium">Заголовок</Text>
                <TextInput className="bg-surface border border-border rounded-lg px-4 py-3 text-text-primary" value={formTitle} onChangeText={setFormTitle} />
              </View>
              <View className="mb-4">
                <Text className="text-text-secondary text-sm mb-1 font-medium">Описание</Text>
                <TextInput className="bg-surface border border-border rounded-lg px-4 py-3 text-text-primary h-24" value={formDescription} onChangeText={setFormDescription} multiline />
              </View>
              <View className="flex-row gap-3 mb-4">
                <View className="flex-1">
                  <Text className="text-text-secondary text-sm mb-1 font-medium">Цена</Text>
                  <TextInput className="bg-surface border border-border rounded-lg px-4 py-3 text-text-primary" value={formPrice} onChangeText={setFormPrice} keyboardType="numeric" />
                </View>
                <View className="w-24">
                  <Text className="text-text-secondary text-sm mb-1 font-medium">Валюта</Text>
                  <TouchableOpacity className="bg-surface border border-border rounded-lg px-4 py-3 flex-row items-center justify-between">
                    <Text className="text-text-primary">USD</Text>
                    <Feather name="chevron-down" size={14} color="#737373" />
                  </TouchableOpacity>
                </View>
              </View>
              <View className="flex-row gap-3">
                <TouchableOpacity className="flex-1 border border-border py-3 rounded-lg items-center" onPress={() => setCurrentStep(2)}>
                  <Text className="text-text-secondary font-semibold">Назад</Text>
                </TouchableOpacity>
                <TouchableOpacity className="flex-1 bg-primary py-3 rounded-lg items-center" onPress={() => setCurrentStep(4)}>
                  <Text className="text-white font-semibold">Далее</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {currentStep === 4 && (
            <View>
              <Text className="text-text-primary text-lg font-bold mb-4">Добавьте фотографии</Text>
              <View className="flex-row flex-wrap gap-3 mb-4">
                <View className="w-24 h-24 bg-surface border-2 border-dashed border-border rounded-lg items-center justify-center">
                  <Feather name="camera" size={24} color="#737373" />
                  <Text className="text-text-muted text-[10px] mt-1">Добавить</Text>
                </View>
                <View className="w-24 h-24 bg-surface border border-border rounded-lg items-center justify-center">
                  <Feather name="image" size={32} color="#00AA6C" />
                </View>
                <View className="w-24 h-24 bg-surface border border-border rounded-lg items-center justify-center">
                  <Feather name="image" size={32} color="#00AA6C" />
                </View>
              </View>
              <View className="flex-row gap-3">
                <TouchableOpacity className="flex-1 border border-border py-3 rounded-lg items-center" onPress={() => setCurrentStep(3)}>
                  <Text className="text-text-secondary font-semibold">Назад</Text>
                </TouchableOpacity>
                <TouchableOpacity className="flex-1 bg-primary py-3 rounded-lg items-center">
                  <Text className="text-white font-semibold">Опубликовать</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </StateSection>

      <StateSection title="submitting">
        <View className="py-16 items-center">
          <ActivityIndicator size="large" color="#00AA6C" />
          <Text className="text-text-muted text-sm mt-3">Публикация объявления...</Text>
        </View>
      </StateSection>

      <StateSection title="error">
        <View className="py-8 items-center">
          <Feather name="alert-circle" size={48} color="#C0392B" />
          <Text className="text-text-primary text-lg font-semibold mt-3">Ошибка публикации</Text>
          <Text className="text-text-muted text-sm mt-1 text-center">Не удалось опубликовать объявление. Проверьте соединение и попробуйте снова.</Text>
          <TouchableOpacity className="bg-primary py-3 px-6 rounded-lg mt-4">
            <Text className="text-white font-semibold">Попробовать снова</Text>
          </TouchableOpacity>
        </View>
      </StateSection>
    </View>
  );
}
