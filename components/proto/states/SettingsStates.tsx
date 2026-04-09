import { View, Text, TouchableOpacity, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StateSection } from '../StateSection';

export default function SettingsStates() {
  return (
    <View>
      <StateSection title="default">
        <View className="py-4">
          <View className="mb-4">
            <Text className="text-text-secondary text-sm mb-1 font-medium">Язык</Text>
            <TouchableOpacity className="bg-surface border border-border rounded-lg px-4 py-3 flex-row items-center justify-between">
              <Text className="text-text-primary">Русский</Text>
              <Ionicons name="chevron-down" size={16} color="#6A8898" />
            </TouchableOpacity>
          </View>
          <View className="flex-row items-center justify-between py-3 border-b border-border mb-4">
            <Text className="text-text-primary text-base">Push-уведомления</Text>
            <Switch value={true} trackColor={{ true: '#0A7B8A', false: '#C8E0E8' }} />
          </View>
          <View className="flex-row items-center justify-between py-3 border-b border-border mb-6">
            <Text className="text-text-primary text-base">Email-уведомления</Text>
            <Switch value={false} trackColor={{ true: '#0A7B8A', false: '#C8E0E8' }} />
          </View>
          <TouchableOpacity className="bg-error py-3 rounded-lg items-center mb-3">
            <Text className="text-white font-semibold">Удалить аккаунт</Text>
          </TouchableOpacity>
          <TouchableOpacity className="border border-primary py-3 rounded-lg items-center">
            <Text className="text-primary font-semibold">Выйти</Text>
          </TouchableOpacity>
        </View>
      </StateSection>

      <StateSection title="delete_confirm_alert">
        <View className="bg-white border border-border rounded-lg p-4">
          <View className="items-center mb-4">
            <Ionicons name="warning" size={48} color="#C0392B" />
            <Text className="text-text-primary text-lg font-bold mt-2">Удалить аккаунт?</Text>
            <Text className="text-text-muted text-sm text-center mt-2">Все ваши данные, объявления и сообщения будут безвозвратно удалены.</Text>
          </View>
          <View className="flex-row gap-3">
            <TouchableOpacity className="flex-1 border border-border py-3 rounded-lg items-center">
              <Text className="text-text-secondary font-semibold">Отмена</Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex-1 bg-error py-3 rounded-lg items-center">
              <Text className="text-white font-semibold">Удалить</Text>
            </TouchableOpacity>
          </View>
        </View>
      </StateSection>
    </View>
  );
}
