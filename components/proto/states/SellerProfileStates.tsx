import { View, Text, TouchableOpacity, ActivityIndicator, Image, useWindowDimensions } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { StateSection } from '../StateSection';
import { mockUsers, mockListings } from '../../../constants/protoMockData';

const seller = mockUsers[0];

export default function SellerProfileStates() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;

  const containerStyle = isDesktop ? { maxWidth: 1200, alignSelf: 'center' as const, width: '100%' } : {};
  const colWidth = isDesktop ? '32%' : '48%';

  return (
    <View>
      <StateSection title="default">
        <View style={containerStyle}>
          {isDesktop ? (
            // Desktop: 2-column layout (profile left, listings right)
            <View className="flex-row gap-6">
              <View style={{ width: 260 }}>
                <View className="items-center bg-surface rounded-lg p-6">
                  <Image source={{ uri: 'https://picsum.photos/seed/seller-profile/96/96' }} style={{ width: 96, height: 96, borderRadius: 48, marginBottom: 12 }} />
                  <View className="flex-row items-center gap-2 mb-1">
                    <Text className="text-text-primary text-xl font-bold">{seller.name}</Text>
                    {seller.isPremium && <View className="bg-secondary/20 px-2 py-0.5 rounded-full"><Text className="text-secondary text-xs font-medium">Premium</Text></View>}
                  </View>
                  <Text className="text-text-muted text-sm mt-1">На сайте с {seller.createdAt}</Text>
                  <View className="flex-row items-center gap-1 mt-1">
                    <Feather name="map-pin" size={14} color="#737373" />
                    <Text className="text-text-muted text-sm">{seller.city}</Text>
                  </View>
                  <TouchableOpacity className="bg-primary py-2 px-4 rounded-lg mt-4 flex-row items-center gap-2 self-center">
                    <Feather name="message-circle" size={16} color="#fff" />
                    <Text className="text-white font-semibold text-sm">Написать продавцу</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View className="flex-1">
                <Text className="text-text-primary text-base font-semibold mb-3">Объявления (3)</Text>
                <View className="flex-row flex-wrap gap-3">
                  {mockListings.filter(l => l.status === 'active').slice(0, 3).map((l, idx) => (
                    <View key={l.id} style={{ width: colWidth }} className="bg-white border border-border rounded-lg overflow-hidden">
                      <Image source={{ uri: `https://picsum.photos/seed/seller-listing${idx + 1}/400/300` }} style={{ width: '100%', height: 96 }} />
                      <View className="p-2">
                        <Text className="text-text-primary text-sm font-medium" numberOfLines={1}>{l.title}</Text>
                        <Text className="text-primary font-bold text-sm">{l.price ? `${l.price.toLocaleString()} ${l.currency}` : 'Договорная'}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          ) : (
            // Mobile: stacked layout
            <View>
              <View className="items-center mb-4">
                <Image source={{ uri: 'https://picsum.photos/seed/seller-profile/96/96' }} style={{ width: 96, height: 96, borderRadius: 48, marginBottom: 12 }} />
                <View className="flex-row items-center gap-2">
                  <Text className="text-text-primary text-xl font-bold">{seller.name}</Text>
                  {seller.isPremium && <View className="bg-secondary/20 px-2 py-0.5 rounded-full"><Text className="text-secondary text-xs font-medium">Premium</Text></View>}
                </View>
                <Text className="text-text-muted text-sm mt-1">На сайте с {seller.createdAt}</Text>
                <View className="flex-row items-center gap-1 mt-1">
                  <Feather name="map-pin" size={14} color="#737373" />
                  <Text className="text-text-muted text-sm">{seller.city}</Text>
                </View>
                <TouchableOpacity className="bg-primary py-2 px-6 rounded-lg mt-4 flex-row items-center gap-2">
                  <Feather name="message-circle" size={16} color="#fff" />
                  <Text className="text-white font-semibold text-sm">Написать продавцу</Text>
                </TouchableOpacity>
              </View>
              <Text className="text-text-primary text-base font-semibold mb-3">Объявления (3)</Text>
              <View className="flex-row flex-wrap gap-3">
                {mockListings.filter(l => l.status === 'active').slice(0, 3).map((l, idx) => (
                  <View key={l.id} className="w-[48%] bg-white border border-border rounded-lg overflow-hidden">
                    <Image source={{ uri: `https://picsum.photos/seed/seller-listing${idx + 1}/400/300` }} style={{ width: '100%', height: 96 }} />
                    <View className="p-2">
                      <Text className="text-text-primary text-sm font-medium" numberOfLines={1}>{l.title}</Text>
                      <Text className="text-primary font-bold text-sm">{l.price ? `${l.price.toLocaleString()} ${l.currency}` : 'Договорная'}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>
      </StateSection>

      <StateSection title="loading">
        <View className="py-16 items-center">
          <ActivityIndicator size="large" color="#00AA6C" />
        </View>
      </StateSection>

      <StateSection title="empty_listings">
        <View style={containerStyle}>
          <View className="items-center mb-4">
            <Image source={{ uri: 'https://picsum.photos/seed/seller-empty/96/96' }} style={{ width: 96, height: 96, borderRadius: 48, marginBottom: 12 }} />
            <Text className="text-text-primary text-xl font-bold">{mockUsers[2].name}</Text>
            <Text className="text-text-muted text-sm mt-1">{mockUsers[2].city}</Text>
          </View>
          <View className="py-8 items-center">
            <Feather name="inbox" size={48} color="#737373" />
            <Text className="text-text-muted text-sm mt-3">У продавца пока нет активных объявлений</Text>
          </View>
        </View>
      </StateSection>
    </View>
  );
}
