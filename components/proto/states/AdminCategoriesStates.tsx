import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StateSection } from '../StateSection';
import { mockCategories, mockCategoryIcons } from '../../../constants/protoMockData';

export default function AdminCategoriesStates() {
  return (
    <View>
      <StateSection title="default">
        <View>
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-text-primary text-lg font-bold">Категории ({mockCategories.length})</Text>
            <TouchableOpacity className="bg-primary px-3 py-2 rounded-lg">
              <Text className="text-white text-sm font-semibold">Добавить</Text>
            </TouchableOpacity>
          </View>
          {mockCategories.map((cat) => (
            <View key={cat} className="flex-row items-center gap-3 py-3 border-b border-border">
              <View className="w-10 h-10 bg-surface rounded-lg items-center justify-center">
                <Ionicons name={mockCategoryIcons[cat] as any || 'grid'} size={18} color="#0A7B8A" />
              </View>
              <Text className="text-text-primary text-base flex-1">{cat}</Text>
              <TouchableOpacity>
                <Ionicons name="create-outline" size={18} color="#6A8898" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </StateSection>

      <StateSection title="loading">
        <View className="py-16 items-center">
          <ActivityIndicator size="large" color="#0A7B8A" />
        </View>
      </StateSection>

      <StateSection title="add_modal">
        <View className="bg-white border border-border rounded-lg p-4">
          <Text className="text-text-primary text-lg font-bold mb-4">Новая категория</Text>
          <View className="mb-3">
            <Text className="text-text-secondary text-sm mb-1 font-medium">Название (RU)</Text>
            <TextInput className="bg-surface border border-border rounded-lg px-4 py-3 text-text-primary" placeholder="Электроника" placeholderTextColor="#6A8898" editable={false} />
          </View>
          <View className="mb-3">
            <Text className="text-text-secondary text-sm mb-1 font-medium">Название (KA)</Text>
            <TextInput className="bg-surface border border-border rounded-lg px-4 py-3 text-text-primary" placeholder="ელექტრონიკა" placeholderTextColor="#6A8898" editable={false} />
          </View>
          <View className="mb-4">
            <Text className="text-text-secondary text-sm mb-1 font-medium">Название (EN)</Text>
            <TextInput className="bg-surface border border-border rounded-lg px-4 py-3 text-text-primary" placeholder="Electronics" placeholderTextColor="#6A8898" editable={false} />
          </View>
          <View className="flex-row gap-3">
            <TouchableOpacity className="flex-1 border border-border py-3 rounded-lg items-center">
              <Text className="text-text-secondary font-semibold">Отмена</Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex-1 bg-primary py-3 rounded-lg items-center">
              <Text className="text-white font-semibold">Добавить</Text>
            </TouchableOpacity>
          </View>
        </View>
      </StateSection>
    </View>
  );
}
