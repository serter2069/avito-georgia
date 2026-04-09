import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StateSection } from '../StateSection';
import { mockUsers } from '../../../constants/protoMockData';

const user = mockUsers[0];

export default function ProfileStates() {
  return (
    <View>
      <StateSection title="default">
        <View className="py-4 items-center">
          <View className="relative mb-4">
            <Image source={{ uri: user.avatar }} className="w-24 h-24 rounded-full" />
            <TouchableOpacity className="absolute bottom-0 right-0 bg-primary w-8 h-8 rounded-full items-center justify-center">
              <Ionicons name="camera" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
          <View className="w-full mb-4">
            <Text className="text-text-secondary text-sm mb-1 font-medium">Имя</Text>
            <TextInput className="bg-surface border border-border rounded-lg px-4 py-3 text-text-primary" value={user.name} editable={false} />
          </View>
          <View className="w-full mb-4">
            <Text className="text-text-secondary text-sm mb-1 font-medium">Телефон</Text>
            <TextInput className="bg-surface border border-border rounded-lg px-4 py-3 text-text-primary" value={user.phone} editable={false} />
          </View>
          <TouchableOpacity className="bg-primary w-full py-3 rounded-lg items-center">
            <Text className="text-white font-semibold">Сохранить</Text>
          </TouchableOpacity>
        </View>
      </StateSection>

      <StateSection title="saving">
        <View className="py-4 items-center opacity-50">
          <Image source={{ uri: user.avatar }} className="w-24 h-24 rounded-full mb-4" />
          <View className="w-full mb-4">
            <Text className="text-text-secondary text-sm mb-1 font-medium">Имя</Text>
            <TextInput className="bg-surface border border-border rounded-lg px-4 py-3 text-text-primary" value={user.name} editable={false} />
          </View>
          <TouchableOpacity className="bg-primary w-full py-3 rounded-lg items-center">
            <ActivityIndicator color="#ffffff" />
          </TouchableOpacity>
        </View>
      </StateSection>

      <StateSection title="saved">
        <View className="py-4 items-center">
          <View className="bg-success/10 border border-success/30 rounded-lg p-4 flex-row items-center gap-3 mb-4 w-full">
            <Ionicons name="checkmark-circle" size={24} color="#2E7D30" />
            <Text className="text-success text-sm font-medium">Профиль сохранён</Text>
          </View>
          <Image source={{ uri: user.avatar }} className="w-24 h-24 rounded-full mb-4" />
          <View className="w-full mb-4">
            <Text className="text-text-secondary text-sm mb-1 font-medium">Имя</Text>
            <TextInput className="bg-surface border border-border rounded-lg px-4 py-3 text-text-primary" value={user.name} editable={false} />
          </View>
          <TouchableOpacity className="bg-primary w-full py-3 rounded-lg items-center">
            <Text className="text-white font-semibold">Сохранить</Text>
          </TouchableOpacity>
        </View>
      </StateSection>

      <StateSection title="error">
        <View className="py-4 items-center">
          <View className="bg-error/10 border border-error/30 rounded-lg p-4 flex-row items-center gap-3 mb-4 w-full">
            <Ionicons name="alert-circle" size={24} color="#C0392B" />
            <Text className="text-error text-sm font-medium">Ошибка сохранения</Text>
          </View>
          <Image source={{ uri: user.avatar }} className="w-24 h-24 rounded-full mb-4" />
          <View className="w-full mb-4">
            <Text className="text-text-secondary text-sm mb-1 font-medium">Имя</Text>
            <TextInput className="bg-surface border border-border rounded-lg px-4 py-3 text-text-primary" value={user.name} editable={false} />
          </View>
          <TouchableOpacity className="bg-primary w-full py-3 rounded-lg items-center">
            <Text className="text-white font-semibold">Сохранить</Text>
          </TouchableOpacity>
        </View>
      </StateSection>
    </View>
  );
}
