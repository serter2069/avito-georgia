import { View, Text, TouchableOpacity, ActivityIndicator, Image, useWindowDimensions, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { StateSection } from '../StateSection';
import { mockListings } from '../../../constants/protoMockData';

export default function FavoritesStates() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;

  const listings = mockListings.filter(l => l.status === 'active').slice(0, 6);

  return (
    <View>
      <StateSection title="default">
        <View style={{ minHeight: Platform.OS === 'web' ? '100vh' : 844 }}>
          <View className="flex-row items-center justify-between h-14 px-4 bg-white border-b border-border"><Text className="text-primary text-lg font-bold">Avito Georgia</Text><View className="flex-row items-center gap-3"><Feather name="search" size={20} color="#737373" /><Feather name="bell" size={20} color="#737373" /></View></View>
          <View style={{ flex: 1 }}>

        <View className="flex-row flex-wrap gap-3">
          {listings.map((l) => (
            <View
              key={l.id}
              className="bg-white border border-border rounded-lg overflow-hidden"
              style={{ width: isDesktop ? '31%' : '48%' }}
            >
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

      <StateSection title="empty">
        <View style={{ minHeight: Platform.OS === 'web' ? '100vh' : 844 }}>
          <View className="flex-row items-center justify-between h-14 px-4 bg-white border-b border-border"><Text className="text-primary text-lg font-bold">Avito Georgia</Text><View className="flex-row items-center gap-3"><Feather name="search" size={20} color="#737373" /><Feather name="bell" size={20} color="#737373" /></View></View>
          <View style={{ flex: 1 }}>

        <View className="py-16 items-center">
          <Feather name="heart" size={48} color="#737373" />
          <Text className="text-text-primary text-lg font-semibold mt-3">Нет избранных</Text>
          <Text className="text-text-muted text-sm mt-1 text-center">Добавляйте объявления в избранное, чтобы не потерять</Text>
          <TouchableOpacity className="bg-primary py-3 px-6 rounded-lg mt-4" onPress={() => {}}>
            <Text className="text-white font-semibold">Перейти в каталог</Text>
          </TouchableOpacity>
        </View>
                </View>
          <View className="flex-row h-14 bg-white border-t border-border items-center">{[{i:"home",l:"Home"},{i:"plus-circle",l:"Post"},{i:"message-circle",l:"Chat"},{i:"user",l:"Profile"}].map(t=>(<View key={t.l} className="flex-1 items-center justify-center"><Feather name={t.i as any} size={20} color="#737373" /><Text className="text-[10px] text-text-muted">{t.l}</Text></View>))}</View>
        </View>
</StateSection>
    </View>
  );
}
