import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Image, useWindowDimensions } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { StateSection } from '../StateSection';
import { mockUsers } from '../../../constants/protoMockData';

const user = mockUsers[0];

export default function ProfileStates() {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('Ираклий Гоциридзе');
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;

  const AvatarSection = () => (
    <View className="relative mb-4">
      <Image source={{ uri: 'https://picsum.photos/seed/profile1/96/96' }} style={{ width: 96, height: 96, borderRadius: 48 }} />
      <TouchableOpacity className="absolute bottom-0 right-0 bg-primary w-8 h-8 rounded-full items-center justify-center">
        <Feather name="camera" size={16} color="#fff" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View>
      <StateSection title="default">
        {isDesktop ? (
          <View style={{ maxWidth: 720, alignSelf: 'center', width: '100%' }} className="py-4">
            <View className="flex-row gap-8">
              <View className="items-center" style={{ width: 120 }}>
                <AvatarSection />
              </View>
              <View className="flex-1">
                {!isEditing ? (
                  <View>
                    <View className="mb-4">
                      <Text className="text-text-secondary text-sm mb-1 font-medium">Имя</Text>
                      <View className="bg-surface border border-border rounded-lg px-4 py-3">
                        <Text className="text-text-primary">{name}</Text>
                      </View>
                    </View>
                    <View className="mb-4">
                      <Text className="text-text-secondary text-sm mb-1 font-medium">Телефон</Text>
                      <View className="bg-surface border border-border rounded-lg px-4 py-3">
                        <Text className="text-text-primary">{user.phone}</Text>
                      </View>
                    </View>
                    <View className="mb-4">
                      <Text className="text-text-secondary text-sm mb-1 font-medium">Email</Text>
                      <View className="bg-surface/50 border border-border rounded-lg px-4 py-3 flex-row items-center justify-between">
                        <Text className="text-text-muted">{user.email}</Text>
                        <Feather name="lock" size={14} color="#6A8898" />
                      </View>
                    </View>
                    <TouchableOpacity className="bg-primary py-3 rounded-lg items-center" onPress={() => setIsEditing(true)}>
                      <Text className="text-white font-semibold">Редактировать</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View>
                    <View className="mb-4">
                      <Text className="text-text-secondary text-sm mb-1 font-medium">Имя</Text>
                      <TextInput
                        className="bg-surface border border-primary rounded-lg px-4 py-3 text-text-primary"
                        value={name}
                        onChangeText={setName}
                        autoFocus
                      />
                    </View>
                    <View className="mb-4">
                      <Text className="text-text-secondary text-sm mb-1 font-medium">Телефон</Text>
                      <TextInput className="bg-surface border border-border rounded-lg px-4 py-3 text-text-primary" value={user.phone} editable={false} />
                    </View>
                    <View className="mb-4">
                      <Text className="text-text-secondary text-sm mb-1 font-medium">Email</Text>
                      <View className="bg-surface/50 border border-border rounded-lg px-4 py-3 flex-row items-center justify-between">
                        <Text className="text-text-muted">{user.email}</Text>
                        <Feather name="lock" size={14} color="#6A8898" />
                      </View>
                    </View>
                    <View className="flex-row gap-3">
                      <TouchableOpacity className="flex-1 border border-border py-3 rounded-lg items-center" onPress={() => setIsEditing(false)}>
                        <Text className="text-text-secondary font-semibold">Отмена</Text>
                      </TouchableOpacity>
                      <TouchableOpacity className="flex-1 bg-primary py-3 rounded-lg items-center" onPress={() => setIsEditing(false)}>
                        <Text className="text-white font-semibold">Сохранить</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </View>
            </View>
          </View>
        ) : (
          <View className="py-4 items-center">
            <AvatarSection />
            {!isEditing ? (
              <View className="w-full">
                <View className="w-full mb-4">
                  <Text className="text-text-secondary text-sm mb-1 font-medium">Имя</Text>
                  <View className="bg-surface border border-border rounded-lg px-4 py-3">
                    <Text className="text-text-primary">{name}</Text>
                  </View>
                </View>
                <View className="w-full mb-4">
                  <Text className="text-text-secondary text-sm mb-1 font-medium">Телефон</Text>
                  <View className="bg-surface border border-border rounded-lg px-4 py-3">
                    <Text className="text-text-primary">{user.phone}</Text>
                  </View>
                </View>
                <View className="w-full mb-4">
                  <Text className="text-text-secondary text-sm mb-1 font-medium">Email</Text>
                  <View className="bg-surface/50 border border-border rounded-lg px-4 py-3 flex-row items-center justify-between">
                    <Text className="text-text-muted">{user.email}</Text>
                    <Feather name="lock" size={14} color="#6A8898" />
                  </View>
                </View>
                <TouchableOpacity className="bg-primary w-full py-3 rounded-lg items-center" onPress={() => setIsEditing(true)}>
                  <Text className="text-white font-semibold">Редактировать</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View className="w-full">
                <View className="w-full mb-4">
                  <Text className="text-text-secondary text-sm mb-1 font-medium">Имя</Text>
                  <TextInput
                    className="bg-surface border border-primary rounded-lg px-4 py-3 text-text-primary"
                    value={name}
                    onChangeText={setName}
                    autoFocus
                  />
                </View>
                <View className="w-full mb-4">
                  <Text className="text-text-secondary text-sm mb-1 font-medium">Телефон</Text>
                  <TextInput className="bg-surface border border-border rounded-lg px-4 py-3 text-text-primary" value={user.phone} editable={false} />
                </View>
                <View className="w-full mb-4">
                  <Text className="text-text-secondary text-sm mb-1 font-medium">Email</Text>
                  <View className="bg-surface/50 border border-border rounded-lg px-4 py-3 flex-row items-center justify-between">
                    <Text className="text-text-muted">{user.email}</Text>
                    <Feather name="lock" size={14} color="#6A8898" />
                  </View>
                </View>
                <View className="flex-row gap-3">
                  <TouchableOpacity className="flex-1 border border-border py-3 rounded-lg items-center" onPress={() => setIsEditing(false)}>
                    <Text className="text-text-secondary font-semibold">Отмена</Text>
                  </TouchableOpacity>
                  <TouchableOpacity className="flex-1 bg-primary py-3 rounded-lg items-center" onPress={() => setIsEditing(false)}>
                    <Text className="text-white font-semibold">Сохранить</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        )}
      </StateSection>

      <StateSection title="saving">
        <View className="py-4 items-center opacity-50">
          <Image source={{ uri: 'https://picsum.photos/seed/profile1/96/96' }} style={{ width: 96, height: 96, borderRadius: 48 }} />
          <View className="w-full mb-4 mt-4">
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
            <Feather name="check-circle" size={24} color="#2E7D30" />
            <Text className="text-success text-sm font-medium">Профиль сохранён</Text>
          </View>
          <Image source={{ uri: 'https://picsum.photos/seed/profile1/96/96' }} style={{ width: 96, height: 96, borderRadius: 48 }} />
          <View className="w-full mb-4 mt-4">
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
            <Feather name="alert-circle" size={24} color="#C0392B" />
            <Text className="text-error text-sm font-medium">Ошибка сохранения</Text>
          </View>
          <Image source={{ uri: 'https://picsum.photos/seed/profile1/96/96' }} style={{ width: 96, height: 96, borderRadius: 48 }} />
          <View className="w-full mb-4 mt-4">
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
