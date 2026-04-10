import { View, Text, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { StateSection } from '../StateSection';
import { mockListings } from '../../../constants/protoMockData';

export default function FavoritesStates() {
  return (
    <View style={{ maxWidth: 430, alignSelf: 'center', width: '100%' }}>
      <StateSection title="default">
        <View className="flex-row flex-wrap gap-3">
          {mockListings.filter(l => l.status === 'active').slice(0, 4).map((l) => (
            <View key={l.id} className="w-[48%] bg-white border border-border rounded-lg overflow-hidden">
              <View className="relative">
                <Image source={{ uri: `https://picsum.photos/seed/${l.id}/400/112` }} style={{ width: '100%', height: 112 }} />
                <TouchableOpacity className="absolute top-2 right-2 bg-white/80 p-1.5 rounded-full">
                  <Feather name="heart" size={16} color="#C0392B" />
                </TouchableOpacity>
              </View>
              <View className="p-2">
                <Text className="text-text-primary text-sm font-medium" numberOfLines={1}>{l.title}</Text>
                <Text className="text-primary font-bold text-sm">{l.price ? `${l.price.toLocaleString()} ${l.currency}` : 'Договорная'}</Text>
                <Text className="text-text-muted text-xs">{l.city}</Text>
              </View>
            </View>
          ))}
        </View>
      </StateSection>

      <StateSection title="loading">
        <View className="py-16 items-center">
          <ActivityIndicator size="large" color="#0A7B8A" />
        </View>
      </StateSection>

      <StateSection title="empty">
        <View className="py-16 items-center">
          <Feather name="heart" size={48} color="#6A8898" />
          <Text className="text-text-primary text-lg font-semibold mt-3">Нет избранных</Text>
          <Text className="text-text-muted text-sm mt-1 text-center">Добавляйте объявления в избранное, чтобы не потерять</Text>
        </View>
      </StateSection>
    </View>
  );
}
