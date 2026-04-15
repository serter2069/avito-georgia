import { View, Text, TextInput, TouchableOpacity, Image,
  useWindowDimensions} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import { StateSection } from '../StateSection';
import { SkeletonBlock, SkeletonRow, SkeletonCard } from '../SkeletonBlock';
import { mockUsers } from '../../../constants/protoMockData';

function UserRow({ user }: { user: typeof mockUsers[0] }) {
  const isBlocked = user.status === 'blocked';
  return (
    <View className="flex-row items-center gap-3 py-3 border-b border-border">
      <Image source={{ uri: `https://picsum.photos/seed/${user.id}/40/40` }} style={{ width: 40, height: 40, borderRadius: 20 }} />
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
  const [searchQuery, setSearchQuery] = useState('');
  const { width } = useWindowDimensions();

  const isDesktop = width >= 768;

  const containerStyle = isDesktop ? { maxWidth: 960, alignSelf: 'center' as const, width: '100%' } : {};


  return (
    <View>
      <StateSection title="DEFAULT">
        <View style={[{ minHeight: 844 }, containerStyle]}>
          <TextInput
            className="bg-surface border border-border rounded-lg px-4 py-3 text-base mb-4"
            placeholder="Поиск пользователей..."
            placeholderTextColor="#737373"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {mockUsers.map((u) => (
            <UserRow key={u.id} user={u} />
          ))}
        </View>
      </StateSection>

      <StateSection title="LOADING">
        <View style={[{ minHeight: 844 }, containerStyle]}>
          <SkeletonBlock height={44} radius={8} style={{ marginBottom: 16 }} />
          {[1, 2, 3, 4, 5].map(i => (
            <View key={i} style={{ borderBottomWidth: 1, borderBottomColor: '#E8EDF0' }}>
              <SkeletonRow />
            </View>
          ))}
        </View>
      </StateSection>

      <StateSection title="SEARCH_RESULTS">
        <View style={[{ minHeight: 844 }, containerStyle]}>
          <TextInput className="bg-surface border border-border-focus rounded-lg px-4 py-3 text-base mb-4 text-text-primary" value="Нино" editable={false} />
          <Text className="text-text-muted text-sm mb-3">Найден 1 пользователь</Text>
          <UserRow user={mockUsers[1]} />
        </View>
      </StateSection>

      <StateSection title="EMPTY_SEARCH">
        <View style={[{ minHeight: 844 }, containerStyle]}>
          <TextInput className="bg-surface border border-border-focus rounded-lg px-4 py-3 text-base mb-4 text-text-primary" value="qwerty123" editable={false} />
          <View className="py-12 items-center">
            <Feather name="user-x" size={48} color="#737373" />
            <Text className="text-text-primary text-lg font-semibold mt-3">Пользователь не найден</Text>
            <Text className="text-text-muted text-sm mt-1 text-center">Нет совпадений по запросу "qwerty123"</Text>
          </View>
        </View>
      </StateSection>
    </View>
  );
}
