import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
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
  return (
    <View>
      <StateSection title="step1_category">
        <View className="py-4">
          <Stepper current={1} />
          <Text className="text-text-primary text-lg font-bold mb-4">Выберите категорию</Text>
          {mockCategories.map((cat) => (
            <TouchableOpacity key={cat} className="flex-row items-center gap-3 py-3 border-b border-border">
              <View className="w-10 h-10 bg-surface rounded-lg items-center justify-center">
                <Ionicons name={mockCategoryIcons[cat] as any || 'grid'} size={20} color="#0A7B8A" />
              </View>
              <Text className="text-text-primary text-base flex-1">{cat}</Text>
              <Ionicons name="chevron-forward" size={16} color="#6A8898" />
            </TouchableOpacity>
          ))}
        </View>
      </StateSection>

      <StateSection title="step2_city">
        <View className="py-4">
          <Stepper current={2} />
          <Text className="text-text-primary text-lg font-bold mb-4">Выберите город</Text>
          {mockCities.map((city) => (
            <TouchableOpacity key={city} className="flex-row items-center gap-3 py-3 border-b border-border">
              <Ionicons name="location-outline" size={20} color="#0A7B8A" />
              <Text className="text-text-primary text-base flex-1">{city}</Text>
              <Ionicons name="chevron-forward" size={16} color="#6A8898" />
            </TouchableOpacity>
          ))}
        </View>
      </StateSection>

      <StateSection title="step3_details">
        <View className="py-4">
          <Stepper current={3} />
          <Text className="text-text-primary text-lg font-bold mb-4">Детали объявления</Text>
          <View className="mb-4">
            <Text className="text-text-secondary text-sm mb-1 font-medium">Заголовок</Text>
            <TextInput className="bg-surface border border-border rounded-lg px-4 py-3 text-text-primary" value="Toyota Camry 2020, 2.5L" editable={false} />
          </View>
          <View className="mb-4">
            <Text className="text-text-secondary text-sm mb-1 font-medium">Описание</Text>
            <TextInput className="bg-surface border border-border rounded-lg px-4 py-3 text-text-primary h-24" value="Отличное состояние, один владелец, полная история обслуживания." editable={false} multiline />
          </View>
          <View className="flex-row gap-3 mb-4">
            <View className="flex-1">
              <Text className="text-text-secondary text-sm mb-1 font-medium">Цена</Text>
              <TextInput className="bg-surface border border-border rounded-lg px-4 py-3 text-text-primary" value="28500" editable={false} keyboardType="numeric" />
            </View>
            <View className="w-24">
              <Text className="text-text-secondary text-sm mb-1 font-medium">Валюта</Text>
              <TouchableOpacity className="bg-surface border border-border rounded-lg px-4 py-3 flex-row items-center justify-between">
                <Text className="text-text-primary">USD</Text>
                <Ionicons name="chevron-down" size={14} color="#6A8898" />
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity className="bg-primary py-3 rounded-lg items-center">
            <Text className="text-white font-semibold">Далее</Text>
          </TouchableOpacity>
        </View>
      </StateSection>

      <StateSection title="step4_photos">
        <View className="py-4">
          <Stepper current={4} />
          <Text className="text-text-primary text-lg font-bold mb-4">Добавьте фотографии</Text>
          <View className="flex-row flex-wrap gap-3 mb-4">
            <View className="w-24 h-24 bg-surface border-2 border-dashed border-border rounded-lg items-center justify-center">
              <Ionicons name="camera" size={24} color="#6A8898" />
              <Text className="text-text-muted text-[10px] mt-1">Добавить</Text>
            </View>
            <View className="w-24 h-24 bg-surface border border-border rounded-lg items-center justify-center">
              <Ionicons name="image" size={32} color="#0A7B8A" />
            </View>
            <View className="w-24 h-24 bg-surface border border-border rounded-lg items-center justify-center">
              <Ionicons name="image" size={32} color="#0A7B8A" />
            </View>
          </View>
          <TouchableOpacity className="bg-primary py-3 rounded-lg items-center">
            <Text className="text-white font-semibold">Опубликовать</Text>
          </TouchableOpacity>
        </View>
      </StateSection>

      <StateSection title="submitting">
        <View className="py-16 items-center">
          <ActivityIndicator size="large" color="#0A7B8A" />
          <Text className="text-text-muted text-sm mt-3">Публикация объявления...</Text>
        </View>
      </StateSection>

      <StateSection title="error">
        <View className="py-8 items-center">
          <Ionicons name="alert-circle" size={48} color="#C0392B" />
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
