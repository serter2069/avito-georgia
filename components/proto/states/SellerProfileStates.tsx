import { View, Text, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { StateSection } from '../StateSection';
import { ProtoPlaceholderImage } from '../ProtoPlaceholderImage';
import { mockUsers, mockListings } from '../../../constants/protoMockData';

const seller = mockUsers[0];

export default function SellerProfileStates() {
  return (
    <View>
      <StateSection title="default">
        <View>
          <View className="items-center mb-4">
            <ProtoPlaceholderImage type="avatar" width={96} height={96} style={{ marginBottom: 12 }} />
            <View className="flex-row items-center gap-2">
              <Text className="text-text-primary text-xl font-bold">{seller.name}</Text>
              {seller.isPremium && <View className="bg-secondary/20 px-2 py-0.5 rounded-full"><Text className="text-secondary text-xs font-medium">Premium</Text></View>}
            </View>
            <Text className="text-text-muted text-sm mt-1">На сайте с {seller.createdAt}</Text>
            <View className="flex-row items-center gap-1 mt-1">
              <Feather name="map-pin" size={14} color="#6A8898" />
              <Text className="text-text-muted text-sm">{seller.city}</Text>
            </View>
          </View>
          <Text className="text-text-primary text-base font-semibold mb-3">Объявления (3)</Text>
          <View className="flex-row flex-wrap gap-3">
            {mockListings.filter(l => l.status === 'active').slice(0, 3).map((l) => (
              <View key={l.id} className="w-[48%] bg-white border border-border rounded-lg overflow-hidden">
                <ProtoPlaceholderImage type="photo" width="100%" height={96} />
                <View className="p-2">
                  <Text className="text-text-primary text-sm font-medium" numberOfLines={1}>{l.title}</Text>
                  <Text className="text-primary font-bold text-sm">{l.price ? `${l.price.toLocaleString()} ${l.currency}` : 'Договорная'}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </StateSection>

      <StateSection title="loading">
        <View className="py-16 items-center">
          <ActivityIndicator size="large" color="#0A7B8A" />
        </View>
      </StateSection>

      <StateSection title="empty_listings">
        <View>
          <View className="items-center mb-4">
            <ProtoPlaceholderImage type="avatar" width={96} height={96} style={{ marginBottom: 12 }} />
            <Text className="text-text-primary text-xl font-bold">{mockUsers[2].name}</Text>
            <Text className="text-text-muted text-sm mt-1">{mockUsers[2].city}</Text>
          </View>
          <View className="py-8 items-center">
            <Feather name="inbox" size={48} color="#6A8898" />
            <Text className="text-text-muted text-sm mt-3">У продавца пока нет активных объявлений</Text>
          </View>
        </View>
      </StateSection>
    </View>
  );
}
