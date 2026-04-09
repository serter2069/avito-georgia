import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StateSection } from '../StateSection';
import { mockListings, mockCategories, mockCategoryIcons } from '../../../constants/protoMockData';

function CategoryChip({ name, icon }: { name: string; icon: string }) {
  return (
    <TouchableOpacity className="items-center mr-4 mb-3">
      <View className="w-14 h-14 bg-surface rounded-xl items-center justify-center mb-1">
        <Ionicons name={icon as any} size={24} color="#0A7B8A" />
      </View>
      <Text className="text-text-muted text-[10px] text-center">{name}</Text>
    </TouchableOpacity>
  );
}

function ListingCardMini({ title, price, currency, city, photo }: { title: string; price: number | null; currency: string; city: string; photo: string }) {
  return (
    <View className="bg-white border border-border rounded-lg overflow-hidden mb-3">
      <Image source={{ uri: photo }} className="w-full h-32" resizeMode="cover" />
      <View className="p-3">
        <Text className="text-text-primary text-sm font-semibold mb-1" numberOfLines={1}>{title}</Text>
        <Text className="text-primary font-bold text-base">{price ? `${price.toLocaleString()} ${currency}` : 'Договорная'}</Text>
        <Text className="text-text-muted text-xs mt-1">{city}</Text>
      </View>
    </View>
  );
}

export default function HomepageStates() {
  return (
    <View>
      <StateSection title="default">
        <View>
          <View className="flex-row items-center gap-2 mb-4">
            <TextInput className="flex-1 bg-surface border border-border rounded-lg px-4 py-3 text-base" placeholder="Поиск по объявлениям..." placeholderTextColor="#6A8898" editable={false} />
            <TouchableOpacity className="bg-primary p-3 rounded-lg">
              <Ionicons name="search" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity className="flex-row items-center gap-2 mb-4 bg-surface px-3 py-2 rounded-lg self-start">
            <Ionicons name="location" size={16} color="#0A7B8A" />
            <Text className="text-primary text-sm font-medium">Тбилиси</Text>
            <Ionicons name="chevron-down" size={14} color="#0A7B8A" />
          </TouchableOpacity>
          <View className="flex-row flex-wrap mb-4">
            {mockCategories.map((cat) => (
              <CategoryChip key={cat} name={cat} icon={mockCategoryIcons[cat] || 'grid'} />
            ))}
          </View>
          <Text className="text-text-primary text-lg font-bold mb-3">Последние объявления</Text>
          <View className="flex-row flex-wrap gap-3">
            {mockListings.filter(l => l.status === 'active').slice(0, 6).map((l) => (
              <View key={l.id} className="w-[48%]">
                <ListingCardMini title={l.title} price={l.price} currency={l.currency} city={l.city} photo={l.photos[0]} />
              </View>
            ))}
          </View>
          <TouchableOpacity className="bg-primary py-3 rounded-lg items-center mt-4">
            <Text className="text-white font-semibold">Разместить объявление</Text>
          </TouchableOpacity>
          <View className="mt-6 pt-4 border-t border-border">
            <Text className="text-text-muted text-xs text-center">Avito Georgia 2026</Text>
          </View>
        </View>
      </StateSection>

      <StateSection title="loading_listings">
        <View>
          <View className="flex-row items-center gap-2 mb-4">
            <TextInput className="flex-1 bg-surface border border-border rounded-lg px-4 py-3 text-base" placeholder="Поиск по объявлениям..." placeholderTextColor="#6A8898" editable={false} />
            <TouchableOpacity className="bg-primary p-3 rounded-lg">
              <Ionicons name="search" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
          <View className="py-12 items-center">
            <ActivityIndicator size="large" color="#0A7B8A" />
            <Text className="text-text-muted text-sm mt-3">Загрузка объявлений...</Text>
          </View>
        </View>
      </StateSection>

      <StateSection title="empty_listings">
        <View>
          <View className="flex-row items-center gap-2 mb-4">
            <TextInput className="flex-1 bg-surface border border-border rounded-lg px-4 py-3 text-base" placeholder="Поиск по объявлениям..." placeholderTextColor="#6A8898" editable={false} />
            <TouchableOpacity className="bg-primary p-3 rounded-lg">
              <Ionicons name="search" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
          <View className="py-12 items-center">
            <Ionicons name="file-tray-outline" size={48} color="#6A8898" />
            <Text className="text-text-primary text-lg font-semibold mt-3">Пока нет объявлений</Text>
            <Text className="text-text-muted text-sm mt-1">Будьте первым, кто разместит!</Text>
          </View>
        </View>
      </StateSection>

      <StateSection title="guest_cta">
        <View className="bg-surface rounded-lg p-4 items-center">
          <Text className="text-text-primary text-lg font-bold mb-2">Присоединяйтесь!</Text>
          <Text className="text-text-muted text-sm text-center mb-4">Войдите, чтобы размещать объявления и сохранять избранное</Text>
          <TouchableOpacity className="bg-primary py-3 px-6 rounded-lg">
            <Text className="text-white font-semibold">Войти</Text>
          </TouchableOpacity>
        </View>
      </StateSection>

      <StateSection title="user_cta">
        <View className="bg-surface rounded-lg p-4 items-center">
          <Text className="text-text-primary text-lg font-bold mb-2">Продайте быстрее!</Text>
          <Text className="text-text-muted text-sm text-center mb-4">Продвиньте ваше объявление и получите больше просмотров</Text>
          <TouchableOpacity className="bg-secondary py-3 px-6 rounded-lg">
            <Text className="text-white font-semibold">Продвинуть</Text>
          </TouchableOpacity>
        </View>
      </StateSection>
    </View>
  );
}
