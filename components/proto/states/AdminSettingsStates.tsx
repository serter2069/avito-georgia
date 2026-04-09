import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StateSection } from '../StateSection';

export default function AdminSettingsStates() {
  return (
    <View>
      <StateSection title="default">
        <View className="py-4">
          <Text className="text-text-primary text-lg font-bold mb-4">Настройки сайта</Text>
          <View className="mb-4">
            <Text className="text-text-secondary text-sm mb-1 font-medium">Название сайта</Text>
            <TextInput className="bg-surface border border-border rounded-lg px-4 py-3 text-text-primary" value="Avito Georgia" editable={false} />
          </View>
          <View className="mb-4">
            <Text className="text-text-secondary text-sm mb-1 font-medium">Email поддержки</Text>
            <TextInput className="bg-surface border border-border rounded-lg px-4 py-3 text-text-primary" value="support@avito.ge" editable={false} />
          </View>
          <View className="mb-4">
            <Text className="text-text-secondary text-sm mb-1 font-medium">Макс. фото на объявление</Text>
            <TextInput className="bg-surface border border-border rounded-lg px-4 py-3 text-text-primary" value="10" editable={false} />
          </View>
          <View className="mb-6">
            <Text className="text-text-secondary text-sm mb-1 font-medium">Срок жизни объявления (дни)</Text>
            <TextInput className="bg-surface border border-border rounded-lg px-4 py-3 text-text-primary" value="30" editable={false} />
          </View>
          <TouchableOpacity className="bg-primary py-3 rounded-lg items-center">
            <Text className="text-white font-semibold">Сохранить</Text>
          </TouchableOpacity>
        </View>
      </StateSection>

      <StateSection title="loading">
        <View className="py-16 items-center">
          <ActivityIndicator size="large" color="#0A7B8A" />
        </View>
      </StateSection>

      <StateSection title="saving">
        <View className="py-4 opacity-50">
          <Text className="text-text-primary text-lg font-bold mb-4">Настройки сайта</Text>
          <View className="mb-4">
            <Text className="text-text-secondary text-sm mb-1 font-medium">Название сайта</Text>
            <TextInput className="bg-surface border border-border rounded-lg px-4 py-3 text-text-primary" value="Avito Georgia" editable={false} />
          </View>
          <TouchableOpacity className="bg-primary py-3 rounded-lg items-center">
            <ActivityIndicator color="#ffffff" />
          </TouchableOpacity>
        </View>
      </StateSection>

      <StateSection title="saved">
        <View className="py-4">
          <View className="bg-success/10 border border-success/30 rounded-lg p-4 flex-row items-center gap-3 mb-4">
            <Ionicons name="checkmark-circle" size={24} color="#2E7D30" />
            <Text className="text-success text-sm font-medium">Настройки сохранены</Text>
          </View>
          <View className="mb-4">
            <Text className="text-text-secondary text-sm mb-1 font-medium">Название сайта</Text>
            <TextInput className="bg-surface border border-border rounded-lg px-4 py-3 text-text-primary" value="Avito Georgia" editable={false} />
          </View>
          <TouchableOpacity className="bg-primary py-3 rounded-lg items-center">
            <Text className="text-white font-semibold">Сохранить</Text>
          </TouchableOpacity>
        </View>
      </StateSection>
    </View>
  );
}
