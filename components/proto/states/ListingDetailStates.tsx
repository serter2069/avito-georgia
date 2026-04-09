import { View, Text, TouchableOpacity, ActivityIndicator, Image, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StateSection } from '../StateSection';
import { mockListings, mockUsers } from '../../../constants/protoMockData';

const listing = mockListings[0];
const seller = mockUsers[0];

function ReviewCard({ name, text, rating }: { name: string; text: string; rating: number }) {
  return (
    <View className="bg-surface rounded-lg p-3 mb-2">
      <View className="flex-row items-center gap-2 mb-1">
        <Text className="text-text-primary text-sm font-semibold">{name}</Text>
        <View className="flex-row">
          {[1, 2, 3, 4, 5].map((i) => (
            <Ionicons key={i} name={i <= rating ? 'star' : 'star-outline'} size={12} color="#f59e0b" />
          ))}
        </View>
      </View>
      <Text className="text-text-muted text-sm">{text}</Text>
    </View>
  );
}

export default function ListingDetailStates() {
  return (
    <View>
      <StateSection title="default">
        <View>
          <Image source={{ uri: listing.photos[0] }} className="w-full h-48 rounded-lg mb-4" resizeMode="cover" />
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-primary font-bold text-2xl">{listing.price?.toLocaleString()} {listing.currency}</Text>
            <View className="bg-success/20 px-2 py-1 rounded-full">
              <Text className="text-success text-xs font-medium">Активно</Text>
            </View>
          </View>
          <Text className="text-text-primary text-lg font-semibold mb-1">{listing.title}</Text>
          <View className="flex-row items-center gap-1 mb-4">
            <Ionicons name="location-outline" size={14} color="#6A8898" />
            <Text className="text-text-muted text-sm">{listing.city}</Text>
            <Text className="text-text-muted text-sm mx-1">|</Text>
            <Ionicons name="eye-outline" size={14} color="#6A8898" />
            <Text className="text-text-muted text-sm">{listing.views}</Text>
          </View>
          <View className="flex-row gap-2 mb-4">
            <TouchableOpacity className="flex-1 bg-primary py-3 rounded-lg items-center">
              <Text className="text-white font-semibold">Написать</Text>
            </TouchableOpacity>
            <TouchableOpacity className="border border-primary py-3 px-4 rounded-lg">
              <Text className="text-primary font-semibold">Показать телефон</Text>
            </TouchableOpacity>
          </View>
          <View className="flex-row gap-3 mb-4">
            <TouchableOpacity className="flex-row items-center gap-1">
              <Ionicons name="heart-outline" size={20} color="#0A7B8A" />
              <Text className="text-primary text-sm">В избранное</Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex-row items-center gap-1">
              <Ionicons name="share-outline" size={20} color="#0A7B8A" />
              <Text className="text-primary text-sm">Поделиться</Text>
            </TouchableOpacity>
          </View>
          <View className="flex-row items-center gap-3 bg-surface rounded-lg p-3 mb-4">
            <Image source={{ uri: seller.avatar }} className="w-12 h-12 rounded-full" />
            <View className="flex-1">
              <Text className="text-text-primary font-semibold">{seller.name}</Text>
              <Text className="text-text-muted text-xs">На сайте с {seller.createdAt}</Text>
            </View>
            {seller.isPremium && <View className="bg-secondary/20 px-2 py-1 rounded-full"><Text className="text-secondary text-xs font-medium">Premium</Text></View>}
          </View>
          <Text className="text-text-primary text-base font-semibold mb-2">Отзывы</Text>
          <ReviewCard name="Нино К." text="Отличный продавец, быстро отвечает!" rating={5} />
          <ReviewCard name="Георгий Б." text="Всё как в описании, рекомендую." rating={4} />
          <Text className="text-text-primary text-base font-semibold mb-2 mt-4">Похожие объявления</Text>
          {mockListings.filter(l => l.id !== listing.id && l.status === 'active').slice(0, 3).map((l) => (
            <View key={l.id} className="flex-row bg-surface rounded-lg overflow-hidden mb-2">
              <Image source={{ uri: l.photos[0] }} className="w-20 h-20" resizeMode="cover" />
              <View className="flex-1 p-2">
                <Text className="text-text-primary text-sm font-medium" numberOfLines={1}>{l.title}</Text>
                <Text className="text-primary font-bold text-sm">{l.price ? `${l.price.toLocaleString()} ${l.currency}` : 'Договорная'}</Text>
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

      <StateSection title="error_not_found">
        <View className="py-16 items-center">
          <Ionicons name="alert-circle-outline" size={48} color="#C0392B" />
          <Text className="text-text-primary text-lg font-semibold mt-3">Объявление не найдено</Text>
          <Text className="text-text-muted text-sm mt-1">Возможно, оно было удалено</Text>
        </View>
      </StateSection>

      <StateSection title="phone_revealed">
        <View className="bg-surface rounded-lg p-4 items-center">
          <Ionicons name="call" size={24} color="#0A7B8A" />
          <Text className="text-text-primary text-lg font-bold mt-2">+995 555 12 34 56</Text>
          <Text className="text-text-muted text-sm mt-1">{seller.name}</Text>
        </View>
      </StateSection>

      <StateSection title="report_modal_open">
        <View className="bg-white border border-border rounded-lg p-4">
          <Text className="text-text-primary text-lg font-bold mb-4">Пожаловаться</Text>
          {['Мошенничество', 'Спам', 'Неприемлемый контент', 'Другое'].map((reason) => (
            <TouchableOpacity key={reason} className="flex-row items-center gap-3 py-3 border-b border-border">
              <View className="w-5 h-5 border-2 border-border rounded-full" />
              <Text className="text-text-primary text-base">{reason}</Text>
            </TouchableOpacity>
          ))}
          <TextInput className="bg-surface border border-border rounded-lg px-4 py-3 mt-4 text-text-primary" placeholder="Опишите проблему..." placeholderTextColor="#6A8898" multiline numberOfLines={3} editable={false} />
          <TouchableOpacity className="bg-error py-3 rounded-lg items-center mt-4">
            <Text className="text-white font-semibold">Отправить жалобу</Text>
          </TouchableOpacity>
        </View>
      </StateSection>
    </View>
  );
}
