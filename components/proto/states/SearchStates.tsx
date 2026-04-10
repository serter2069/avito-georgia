import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { StateSection } from '../StateSection';
import { ProtoPlaceholderImage } from '../ProtoPlaceholderImage';
import { mockListings, mockCategories, mockCategoryIcons } from '../../../constants/protoMockData';

export default function SearchStates() {
  const [query, setQuery] = useState('');

  return (
    <View>
      <StateSection title="default">
        <View>
          <TextInput
            className="bg-surface border border-border rounded-lg px-4 py-3 text-base mb-3"
            placeholder="Что ищете?"
            placeholderTextColor="#6A8898"
            value={query}
            onChangeText={setQuery}
          />
          <TouchableOpacity className="flex-row items-center gap-2 bg-surface px-3 py-2 rounded-lg self-start mb-3">
            <Feather name="map-pin" size={16} color="#0A7B8A" />
            <Text className="text-primary text-sm font-medium">Все города</Text>
            <Feather name="chevron-down" size={14} color="#0A7B8A" />
          </TouchableOpacity>
          <View className="flex-row flex-wrap gap-2 mb-4">
            {mockCategories.map((cat) => (
              <TouchableOpacity key={cat} className="flex-row items-center bg-surface border border-border rounded-full px-3 py-1.5">
                <Feather name={mockCategoryIcons[cat] as any || 'grid'} size={14} color="#0A7B8A" />
                <Text className="text-text-secondary text-sm ml-1">{cat}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-text-muted text-sm">4 результата</Text>
            <View className="flex-row gap-2">
              <TouchableOpacity className="bg-primary p-2 rounded-lg">
                <Feather name="list" size={16} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity className="bg-surface border border-border p-2 rounded-lg">
                <Feather name="map" size={16} color="#6A8898" />
              </TouchableOpacity>
            </View>
          </View>
          {mockListings.filter(l => l.status === 'active').slice(0, 3).map((l) => (
            <View key={l.id} className="flex-row bg-white border border-border rounded-lg overflow-hidden mb-2">
              <ProtoPlaceholderImage type="photo" width={96} height={96} />
              <View className="flex-1 p-3">
                <Text className="text-text-primary text-sm font-semibold" numberOfLines={1}>{l.title}</Text>
                <Text className="text-primary font-bold">{l.price ? `${l.price.toLocaleString()} ${l.currency}` : 'Договорная'}</Text>
                <Text className="text-text-muted text-xs">{l.city}</Text>
              </View>
            </View>
          ))}
        </View>
      </StateSection>

      <StateSection title="loading">
        <View>
          <TextInput className="bg-surface border border-border rounded-lg px-4 py-3 text-base mb-3" value="Toyota" editable={false} />
          <View className="py-12 items-center">
            <ActivityIndicator size="large" color="#0A7B8A" />
          </View>
        </View>
      </StateSection>

      <StateSection title="empty">
        <View>
          <TextInput className="bg-surface border border-border rounded-lg px-4 py-3 text-base mb-3" placeholder="Что ищете?" placeholderTextColor="#6A8898" editable={false} />
          <View className="py-12 items-center">
            <Feather name="search" size={48} color="#6A8898" />
            <Text className="text-text-primary text-lg font-semibold mt-3">Начните поиск</Text>
            <Text className="text-text-muted text-sm mt-1">Введите запрос или выберите категорию</Text>
          </View>
        </View>
      </StateSection>

      <StateSection title="filtered_empty">
        <View>
          <TextInput className="bg-surface border border-border rounded-lg px-4 py-3 text-base mb-3" value="Ламборгини Кутаиси" editable={false} />
          <View className="py-12 items-center">
            <Feather name="frown" size={48} color="#6A8898" />
            <Text className="text-text-primary text-lg font-semibold mt-3">Ничего не найдено</Text>
            <Text className="text-text-muted text-sm mt-1 text-center">Попробуйте изменить запрос</Text>
          </View>
        </View>
      </StateSection>

      <StateSection title="map_view">
        <View>
          <TextInput className="bg-surface border border-border rounded-lg px-4 py-3 text-base mb-3" value="Квартира Тбилиси" editable={false} />
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-text-muted text-sm">2 на карте</Text>
            <View className="flex-row gap-2">
              <TouchableOpacity className="bg-surface border border-border p-2 rounded-lg">
                <Feather name="list" size={16} color="#6A8898" />
              </TouchableOpacity>
              <TouchableOpacity className="bg-primary p-2 rounded-lg">
                <Feather name="map" size={16} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
          <View className="w-full h-48 bg-surface rounded-lg items-center justify-center border border-border">
            <Feather name="map" size={48} color="#6A8898" />
            <Text className="text-text-muted text-sm mt-2">Map placeholder</Text>
          </View>
        </View>
      </StateSection>
    </View>
  );
}
