import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { StateSection } from '../StateSection';
import { mockListings } from '../../../constants/protoMockData';

function FilterBar() {
  return (
    <View className="flex-row gap-2 mb-4 flex-wrap">
      <TouchableOpacity className="flex-row items-center bg-surface border border-border rounded-lg px-3 py-2">
        <Text className="text-text-secondary text-sm">Категория</Text>
        <Feather name="chevron-down" size={14} color="#1A4A6E" />
      </TouchableOpacity>
      <TouchableOpacity className="flex-row items-center bg-surface border border-border rounded-lg px-3 py-2">
        <Text className="text-text-secondary text-sm">Город</Text>
        <Feather name="chevron-down" size={14} color="#1A4A6E" />
      </TouchableOpacity>
      <TouchableOpacity className="flex-row items-center bg-surface border border-border rounded-lg px-3 py-2">
        <Text className="text-text-secondary text-sm">Цена</Text>
        <Feather name="chevron-down" size={14} color="#1A4A6E" />
      </TouchableOpacity>
      <TouchableOpacity className="flex-row items-center bg-primary/10 border border-primary rounded-lg px-3 py-2">
        <Feather name="arrow-up-down" size={14} color="#0A7B8A" />
        <Text className="text-primary text-sm ml-1">Новые</Text>
      </TouchableOpacity>
    </View>
  );
}

function ListingRow({ title, price, currency, city, isPromoted, seed }: { title: string; price: number | null; currency: string; city: string; isPromoted: boolean; seed: string }) {
  return (
    <View className="flex-row bg-white border border-border rounded-lg overflow-hidden mb-3">
      <Image source={{ uri: `https://picsum.photos/seed/${seed}/400/400` }} style={{ width: 112, height: 112 }} />
      <View className="flex-1 p-3 justify-between">
        <View>
          {isPromoted && <View className="bg-secondary/20 px-2 py-0.5 rounded-full self-start mb-1"><Text className="text-secondary text-[10px] font-medium">TOP</Text></View>}
          <Text className="text-text-primary text-sm font-semibold" numberOfLines={2}>{title}</Text>
        </View>
        <View>
          <Text className="text-primary font-bold text-base">{price ? `${price.toLocaleString()} ${currency}` : 'Договорная'}</Text>
          <Text className="text-text-muted text-xs">{city}</Text>
        </View>
      </View>
    </View>
  );
}

export default function ListingsFeedStates() {
  return (
    <View>
      <StateSection title="default">
        <View>
          <FilterBar />
          {mockListings.filter(l => l.status === 'active').map((l, idx) => (
            <ListingRow key={l.id} title={l.title} price={l.price} currency={l.currency} city={l.city} isPromoted={l.isPromoted} seed={`feed${idx + 1}`} />
          ))}
        </View>
      </StateSection>

      <StateSection title="loading">
        <View>
          <FilterBar />
          <View className="py-12 items-center">
            <ActivityIndicator size="large" color="#0A7B8A" />
          </View>
        </View>
      </StateSection>

      <StateSection title="empty">
        <View>
          <FilterBar />
          <View className="py-12 items-center">
            <Feather name="inbox" size={48} color="#6A8898" />
            <Text className="text-text-primary text-lg font-semibold mt-3">Нет объявлений</Text>
            <Text className="text-text-muted text-sm mt-1">Попробуйте изменить параметры поиска</Text>
          </View>
        </View>
      </StateSection>

      <StateSection title="filtered_empty">
        <View>
          <View className="flex-row gap-2 mb-4 flex-wrap">
            <View className="flex-row items-center bg-primary/10 border border-primary rounded-lg px-3 py-2">
              <Text className="text-primary text-sm">Электроника</Text>
              <Feather name="x" size={14} color="#0A7B8A" />
            </View>
            <View className="flex-row items-center bg-primary/10 border border-primary rounded-lg px-3 py-2">
              <Text className="text-primary text-sm">Кутаиси</Text>
              <Feather name="x" size={14} color="#0A7B8A" />
            </View>
          </View>
          <View className="py-12 items-center">
            <Feather name="search" size={48} color="#6A8898" />
            <Text className="text-text-primary text-lg font-semibold mt-3">Ничего не найдено</Text>
            <Text className="text-text-muted text-sm mt-1 text-center">По вашим фильтрам нет объявлений. Попробуйте убрать фильтры.</Text>
            <TouchableOpacity className="mt-4 border border-primary px-4 py-2 rounded-lg">
              <Text className="text-primary font-semibold">Сбросить фильтры</Text>
            </TouchableOpacity>
          </View>
        </View>
      </StateSection>
    </View>
  );
}
