import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StateSection } from '../StateSection';
import { mockUsers } from '../../../constants/protoMockData';

function UserRow({ user }: { user: typeof mockUsers[0] }) {
  const isBlocked = user.status === 'blocked';
  return (
    <View className="flex-row items-center gap-3 py-3 border-b border-border">
      <Image source={{ uri: user.avatar }} className="w-10 h-10 rounded-full" />
      <View className="flex-1">
        <View className="flex-row items-center gap-2">
          <Text className="text-text-primary text-sm font-semibold">{user.name}</Text>
          <View className={`px-1.5 py-0.5 rounded-full ${user.role === 'admin' ? 'bg-error/20' : 'bg-primary/20'}`}>
            <Text className={`text-[10px] font-medium ${user.role === 'admin' ? 'text-error' : 'text-primary'}`}>{user.role}</Text>
          </View>
          {isBlocked && <View className="bg-error/20 px-1.5 py-0.5 rounded-full"><Text className="text-error text-[10px] font-medium">blocked</Text></View>}
        </View>
        <Text className="text-text-muted text-xs">{user.email}</Text>
      </View>
      {isBlocked ? (
        <TouchableOpacity className="bg-success/20 px-2 py-1 rounded-md">
          <Text className="text-success text-xs font-medium">Разблокировать</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity className="bg-error/20 px-2 py-1 rounded-md">
          <Text className="text-error text-xs font-medium">Заблокировать</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

export default function AdminUsersStates() {
  return (
    <View>
      <StateSection title="default">
        <View>
          <TextInput className="bg-surface border border-border rounded-lg px-4 py-3 text-base mb-4" placeholder="Поиск пользователей..." placeholderTextColor="#6A8898" editable={false} />
          {mockUsers.map((u) => (
            <UserRow key={u.id} user={u} />
          ))}
        </View>
      </StateSection>

      <StateSection title="loading">
        <View className="py-16 items-center">
          <ActivityIndicator size="large" color="#0A7B8A" />
        </View>
      </StateSection>

      <StateSection title="search_results">
        <View>
          <TextInput className="bg-surface border border-border-focus rounded-lg px-4 py-3 text-base mb-4 text-text-primary" value="Нино" editable={false} />
          <Text className="text-text-muted text-sm mb-3">Найден 1 пользователь</Text>
          <UserRow user={mockUsers[1]} />
        </View>
      </StateSection>
    </View>
  );
}
