import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Image, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import { StateSection } from '../StateSection';
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

  return (
    <View>
      <StateSection title="default">
        <View style={{ minHeight: Platform.OS === 'web' ? '100vh' : 844 }}>
          <View className="flex-row items-center justify-between h-14 px-4 bg-white border-b border-border"><Text className="text-primary text-lg font-bold">Avito Georgia</Text><View className="flex-row items-center gap-3"><Feather name="search" size={20} color="#737373" /><Feather name="bell" size={20} color="#737373" /></View></View>
          <View style={{ flex: 1 }}>

        <View>
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
                </View>
          <View className="flex-row h-14 bg-white border-t border-border items-center">{[{i:"home",l:"Home"},{i:"plus-circle",l:"Post"},{i:"message-circle",l:"Chat"},{i:"user",l:"Profile"}].map(t=>(<View key={t.l} className="flex-1 items-center justify-center"><Feather name={t.i as any} size={20} color="#737373" /><Text className="text-[10px] text-text-muted">{t.l}</Text></View>))}</View>
        </View>
</StateSection>

      <StateSection title="loading">
        <View style={{ minHeight: Platform.OS === 'web' ? '100vh' : 844 }}>
          <View className="flex-row items-center justify-between h-14 px-4 bg-white border-b border-border"><Text className="text-primary text-lg font-bold">Avito Georgia</Text><View className="flex-row items-center gap-3"><Feather name="search" size={20} color="#737373" /><Feather name="bell" size={20} color="#737373" /></View></View>
          <View style={{ flex: 1 }}>

        <View className="py-16 items-center">
          <ActivityIndicator size="large" color="#00AA6C" />
        </View>
                </View>
          <View className="flex-row h-14 bg-white border-t border-border items-center">{[{i:"home",l:"Home"},{i:"plus-circle",l:"Post"},{i:"message-circle",l:"Chat"},{i:"user",l:"Profile"}].map(t=>(<View key={t.l} className="flex-1 items-center justify-center"><Feather name={t.i as any} size={20} color="#737373" /><Text className="text-[10px] text-text-muted">{t.l}</Text></View>))}</View>
        </View>
</StateSection>

      <StateSection title="search_results">
        <View style={{ minHeight: Platform.OS === 'web' ? '100vh' : 844 }}>
          <View className="flex-row items-center justify-between h-14 px-4 bg-white border-b border-border"><Text className="text-primary text-lg font-bold">Avito Georgia</Text><View className="flex-row items-center gap-3"><Feather name="search" size={20} color="#737373" /><Feather name="bell" size={20} color="#737373" /></View></View>
          <View style={{ flex: 1 }}>

        <View>
          <TextInput className="bg-surface border border-border-focus rounded-lg px-4 py-3 text-base mb-4 text-text-primary" value="Нино" editable={false} />
          <Text className="text-text-muted text-sm mb-3">Найден 1 пользователь</Text>
          <UserRow user={mockUsers[1]} />
        </View>
                </View>
          <View className="flex-row h-14 bg-white border-t border-border items-center">{[{i:"home",l:"Home"},{i:"plus-circle",l:"Post"},{i:"message-circle",l:"Chat"},{i:"user",l:"Profile"}].map(t=>(<View key={t.l} className="flex-1 items-center justify-center"><Feather name={t.i as any} size={20} color="#737373" /><Text className="text-[10px] text-text-muted">{t.l}</Text></View>))}</View>
        </View>
</StateSection>

      <StateSection title="empty_search">
        <View style={{ minHeight: Platform.OS === 'web' ? '100vh' : 844 }}>
          <View className="flex-row items-center justify-between h-14 px-4 bg-white border-b border-border"><Text className="text-primary text-lg font-bold">Avito Georgia</Text><View className="flex-row items-center gap-3"><Feather name="search" size={20} color="#737373" /><Feather name="bell" size={20} color="#737373" /></View></View>
          <View style={{ flex: 1 }}>

        <View>
          <TextInput className="bg-surface border border-border-focus rounded-lg px-4 py-3 text-base mb-4 text-text-primary" value="qwerty123" editable={false} />
          <View className="py-12 items-center">
            <Feather name="user-x" size={48} color="#737373" />
            <Text className="text-text-primary text-lg font-semibold mt-3">Пользователь не найден</Text>
            <Text className="text-text-muted text-sm mt-1 text-center">Нет совпадений по запросу "qwerty123"</Text>
          </View>
        </View>
                </View>
          <View className="flex-row h-14 bg-white border-t border-border items-center">{[{i:"home",l:"Home"},{i:"plus-circle",l:"Post"},{i:"message-circle",l:"Chat"},{i:"user",l:"Profile"}].map(t=>(<View key={t.l} className="flex-1 items-center justify-center"><Feather name={t.i as any} size={20} color="#737373" /><Text className="text-[10px] text-text-muted">{t.l}</Text></View>))}</View>
        </View>
</StateSection>
    </View>
  );
}
