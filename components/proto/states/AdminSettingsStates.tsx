import { View, Text, TextInput, TouchableOpacity, Switch, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import { StateSection } from '../StateSection';

export default function AdminSettingsStates() {
  const [maintenanceMode, setMaintenanceMode] = useState(false);

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
          <View className="mb-4">
            <Text className="text-text-secondary text-sm mb-1 font-medium">Макс. объявлений на пользователя</Text>
            <TextInput className="bg-surface border border-border rounded-lg px-4 py-3 text-text-primary" value="50" editable={false} />
          </View>
          <View className="mb-6">
            <Text className="text-text-secondary text-sm mb-1 font-medium">Срок жизни объявления (дни)</Text>
            <TextInput className="bg-surface border border-border rounded-lg px-4 py-3 text-text-primary" value="30" editable={false} />
          </View>
          <View className="flex-row items-center justify-between bg-surface border border-border rounded-lg px-4 py-3 mb-6">
            <View className="flex-1">
              <Text className="text-text-primary text-sm font-medium">Режим обслуживания</Text>
              <Text className="text-text-muted text-xs mt-0.5">Сайт недоступен для пользователей</Text>
            </View>
            <Switch
              value={maintenanceMode}
              onValueChange={setMaintenanceMode}
              trackColor={{ false: '#D1D5DB', true: '#00AA6C' }}
              thumbColor="#ffffff"
            />
          </View>
          {maintenanceMode && (
            <View className="bg-warning/10 border border-warning/30 rounded-lg p-3 flex-row items-center gap-2 mb-4">
              <Feather name="alert-triangle" size={16} color="#f59e0b" />
              <Text className="text-warning text-sm flex-1">Сайт переведен в режим обслуживания</Text>
            </View>
          )}
          <TouchableOpacity className="bg-primary py-3 rounded-lg items-center">
            <Text className="text-white font-semibold">Сохранить</Text>
          </TouchableOpacity>
        </View>
      </StateSection>

      <StateSection title="loading">
        <View className="py-16 items-center">
          <ActivityIndicator size="large" color="#00AA6C" />
        </View>
      </StateSection>

      <StateSection title="saving">
        <View className="py-4 opacity-50">
          <Text className="text-text-primary text-lg font-bold mb-4">Настройки сайта</Text>
          <View className="mb-4">
            <Text className="text-text-secondary text-sm mb-1 font-medium">Название сайта</Text>
            <TextInput className="bg-surface border border-border rounded-lg px-4 py-3 text-text-primary" value="Avito Georgia" editable={false} />
          </View>
          <View className="mb-4">
            <Text className="text-text-secondary text-sm mb-1 font-medium">Макс. объявлений на пользователя</Text>
            <TextInput className="bg-surface border border-border rounded-lg px-4 py-3 text-text-primary" value="50" editable={false} />
          </View>
          <View className="flex-row items-center justify-between bg-surface border border-border rounded-lg px-4 py-3 mb-6">
            <Text className="text-text-primary text-sm font-medium">Режим обслуживания</Text>
            <Switch value={false} trackColor={{ false: '#D1D5DB', true: '#00AA6C' }} thumbColor="#ffffff" />
          </View>
          <TouchableOpacity className="bg-primary py-3 rounded-lg items-center">
            <ActivityIndicator color="#ffffff" />
          </TouchableOpacity>
        </View>
      </StateSection>

      <StateSection title="saved">
        <View className="py-4">
          <View className="bg-success/10 border border-success/30 rounded-lg p-4 flex-row items-center gap-3 mb-4">
            <Feather name="check-circle" size={24} color="#2E7D30" />
            <Text className="text-success text-sm font-medium">Настройки сохранены</Text>
          </View>
          <View className="mb-4">
            <Text className="text-text-secondary text-sm mb-1 font-medium">Название сайта</Text>
            <TextInput className="bg-surface border border-border rounded-lg px-4 py-3 text-text-primary" value="Avito Georgia" editable={false} />
          </View>
          <View className="mb-4">
            <Text className="text-text-secondary text-sm mb-1 font-medium">Макс. объявлений на пользователя</Text>
            <TextInput className="bg-surface border border-border rounded-lg px-4 py-3 text-text-primary" value="50" editable={false} />
          </View>
          <View className="flex-row items-center justify-between bg-surface border border-border rounded-lg px-4 py-3 mb-6">
            <Text className="text-text-primary text-sm font-medium">Режим обслуживания</Text>
            <Switch value={false} trackColor={{ false: '#D1D5DB', true: '#00AA6C' }} thumbColor="#ffffff" />
          </View>
          <TouchableOpacity className="bg-primary py-3 rounded-lg items-center">
            <Text className="text-white font-semibold">Сохранить</Text>
          </TouchableOpacity>
        </View>
      </StateSection>
    </View>
  );
}
