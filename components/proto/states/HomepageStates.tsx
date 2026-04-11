import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Image, useWindowDimensions } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { StateSection } from '../StateSection';
import { mockListings, mockCategories, mockCategoryIcons } from '../../../constants/protoMockData';

function CategoryChip({ name, icon, selected, onPress }: { name: string; icon: string; selected?: boolean; onPress?: () => void }) {
  return (
    <TouchableOpacity className="items-center mr-4 mb-3" onPress={onPress}>
      <View className={`w-14 h-14 rounded-xl items-center justify-center mb-1 ${selected ? 'bg-primary/20' : 'bg-surface'}`}>
        <Feather name={icon as any} size={24} color="#00AA6C" />
      </View>
      <Text className="text-text-muted text-[10px] text-center">{name}</Text>
    </TouchableOpacity>
  );
}

function ListingCardMini({ title, price, currency, city, seed }: { title: string; price: number | null; currency: string; city: string; seed: string }) {
  return (
    <View className="bg-white border border-border rounded-lg overflow-hidden mb-3">
      <Image source={{ uri: `https://picsum.photos/seed/${seed}/400/300` }} style={{ width: '100%', height: 128 }} />
      <View className="p-3">
        <Text className="text-text-primary text-sm font-semibold mb-1" numberOfLines={1}>{title}</Text>
        <Text className="text-primary font-bold text-base">{price ? `${price.toLocaleString()} ${currency}` : 'Договорная'}</Text>
        <Text className="text-text-muted text-xs mt-1">{city}</Text>
      </View>
    </View>
  );
}

export default function HomepageStates() {
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;
  const isWide = width >= 1280;

  const colWidth = isWide ? '32%' : isDesktop ? '32%' : '48%';
  const containerStyle = isDesktop ? { maxWidth: 1200, alignSelf: 'center' as const, width: '100%' } : {};

  return (
    <View>
      <StateSection title="default">
        <View style={containerStyle}>
          <View className="flex-row items-center gap-2 mb-4">
            <TextInput
              className="flex-1 bg-surface border border-border rounded-lg px-4 py-3 text-base"
              placeholder="Поиск по объявлениям..."
              placeholderTextColor="#737373"
              editable={false}
            />
            <TouchableOpacity className="bg-primary p-3 rounded-lg">
              <Feather name="search" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            className="flex-row items-center gap-2 mb-4 bg-surface px-3 py-2 rounded-lg self-start"
            onPress={() => setSelectedCity(selectedCity ? null : 'Тбилиси')}
          >
            <Feather name="map-pin" size={16} color="#00AA6C" />
            <Text className="text-primary text-sm font-medium">{selectedCity || 'Тбилиси'}</Text>
            <Feather name="chevron-down" size={14} color="#00AA6C" />
          </TouchableOpacity>
          <View className="flex-row flex-wrap mb-4">
            {mockCategories.map((cat) => (
              <CategoryChip
                key={cat}
                name={cat}
                icon={mockCategoryIcons[cat] || 'grid'}
                selected={selectedCategory === cat}
                onPress={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
              />
            ))}
          </View>
          <Text className="text-text-primary text-lg font-bold mb-3">Последние объявления</Text>
          <View className="flex-row flex-wrap gap-3">
            {mockListings.filter(l => l.status === 'active').slice(0, isDesktop ? 6 : 6).map((l, idx) => (
              <View key={l.id} style={{ width: colWidth }}>
                <ListingCardMini title={l.title} price={l.price} currency={l.currency} city={l.city} seed={`listing${idx + 1}`} />
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
        <View style={containerStyle}>
          <View className="flex-row items-center gap-2 mb-4">
            <TextInput className="flex-1 bg-surface border border-border rounded-lg px-4 py-3 text-base" placeholder="Поиск по объявлениям..." placeholderTextColor="#737373" editable={false} />
            <TouchableOpacity className="bg-primary p-3 rounded-lg">
              <Feather name="search" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
          <View className="py-12 items-center">
            <ActivityIndicator size="large" color="#00AA6C" />
            <Text className="text-text-muted text-sm mt-3">Загрузка объявлений...</Text>
          </View>
        </View>
      </StateSection>

      <StateSection title="empty_listings">
        <View style={containerStyle}>
          <View className="flex-row items-center gap-2 mb-4">
            <TextInput className="flex-1 bg-surface border border-border rounded-lg px-4 py-3 text-base" placeholder="Поиск по объявлениям..." placeholderTextColor="#737373" editable={false} />
            <TouchableOpacity className="bg-primary p-3 rounded-lg">
              <Feather name="search" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
          <View className="py-12 items-center">
            <Feather name="inbox" size={48} color="#737373" />
            <Text className="text-text-primary text-lg font-semibold mt-3">Пока нет объявлений</Text>
            <Text className="text-text-muted text-sm mt-1">Будьте первым, кто разместит!</Text>
          </View>
        </View>
      </StateSection>

      <StateSection title="guest_cta">
        <View style={containerStyle} className="bg-surface rounded-lg p-4 items-center">
          <Text className="text-text-primary text-lg font-bold mb-2">Присоединяйтесь!</Text>
          <Text className="text-text-muted text-sm text-center mb-4">Войдите, чтобы размещать объявления и сохранять избранное</Text>
          <TouchableOpacity className="bg-primary py-3 px-6 rounded-lg">
            <Text className="text-white font-semibold">Войти</Text>
          </TouchableOpacity>
        </View>
      </StateSection>

      <StateSection title="user_cta">
        <View style={containerStyle} className="bg-surface rounded-lg p-4 items-center">
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
