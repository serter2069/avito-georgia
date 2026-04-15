import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, useWindowDimensions } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { StateSection } from '../StateSection';
import { SkeletonBlock, SkeletonRow, SkeletonCard } from '../SkeletonBlock';
import { mockListings, mockCategories, mockCategoryIcons } from '../../../constants/protoMockData';

export default function SearchStates() {
  const [query, setQuery] = useState('');
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;
  const isWide = width >= 1280;

  const containerStyle = isDesktop ? { maxWidth: 960, alignSelf: 'center' as const, width: '100%' } : {};
  const colWidth = isWide ? '32%' : isDesktop ? '48%' : '100%';

  return (
    <View>
      <StateSection title="DEFAULT">
        <View style={[{ minHeight: 844 }, containerStyle]}>
          <View className="flex-row gap-2 mb-3">
            <TextInput
              className="flex-1 bg-surface border border-border rounded-lg px-4 py-3 text-base"
              placeholder="Что ищете?"
              placeholderTextColor="#737373"
              value={query}
              onChangeText={setQuery}
            />
            {isDesktop && (
              <TouchableOpacity className="bg-primary px-6 rounded-lg items-center justify-center">
                <Feather name="search" size={18} color="#fff" />
              </TouchableOpacity>
            )}
          </View>
          <TouchableOpacity className="flex-row items-center gap-2 bg-surface px-3 py-2 rounded-lg self-start mb-3">
            <Feather name="map-pin" size={16} color="#00AA6C" />
            <Text className="text-primary text-sm font-medium">Все города</Text>
            <Feather name="chevron-down" size={14} color="#00AA6C" />
          </TouchableOpacity>
          <View className="flex-row flex-wrap gap-2 mb-4">
            {mockCategories.map((cat) => (
              <TouchableOpacity key={cat} className="flex-row items-center bg-surface border border-border rounded-full px-3 py-1.5">
                <Feather name={mockCategoryIcons[cat] as any || 'grid'} size={14} color="#00AA6C" />
                <Text className="text-text-secondary text-sm ml-1">{cat}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-text-muted text-sm">3 результата</Text>
            <View className="flex-row gap-2">
              <TouchableOpacity className="bg-primary p-2 rounded-lg">
                <Feather name="list" size={16} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity className="bg-surface border border-border p-2 rounded-lg">
                <Feather name="map" size={16} color="#737373" />
              </TouchableOpacity>
            </View>
          </View>
          {isDesktop ? (
            <View className="flex-row flex-wrap gap-3">
              {mockListings.filter(l => l.status === 'active').slice(0, 3).map((l, idx) => (
                <View key={l.id} style={{ width: colWidth }}>
                  <View className="bg-white border border-border rounded-lg overflow-hidden mb-2">
                    <Image source={{ uri: `https://picsum.photos/seed/search${idx + 1}/400/300` }} style={{ width: '100%', height: 128 }} />
                    <View className="p-3">
                      <Text className="text-text-primary text-sm font-semibold" numberOfLines={1}>{l.title}</Text>
                      <Text className="text-primary font-bold">{l.price ? `${l.price.toLocaleString()} ${l.currency}` : 'Договорная'}</Text>
                      <Text className="text-text-muted text-xs">{l.city}</Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            mockListings.filter(l => l.status === 'active').slice(0, 3).map((l, idx) => (
              <View key={l.id} className="flex-row bg-white border border-border rounded-lg overflow-hidden mb-2">
                <Image source={{ uri: `https://picsum.photos/seed/search${idx + 1}/200/200` }} style={{ width: 96, height: 96 }} />
                <View className="flex-1 p-3">
                  <Text className="text-text-primary text-sm font-semibold" numberOfLines={1}>{l.title}</Text>
                  <Text className="text-primary font-bold">{l.price ? `${l.price.toLocaleString()} ${l.currency}` : 'Договорная'}</Text>
                  <Text className="text-text-muted text-xs">{l.city}</Text>
                </View>
              </View>
            ))
          )}
        </View>
      </StateSection>

      <StateSection title="LOADING">
        <View style={[{ minHeight: 844 }, containerStyle]}>
          <TextInput className="bg-surface border border-border rounded-lg px-4 py-3 text-base mb-3" value="Toyota" editable={false} />
          <View style={{ gap: 12, paddingTop: 8 }}>
            {[1, 2, 3].map(i => (
              <View key={i} style={{ flexDirection: 'row', borderRadius: 8, borderWidth: 1, borderColor: '#E8EDF0', overflow: 'hidden' }}>
                <SkeletonBlock width={96} height={96} radius={0} />
                <View style={{ flex: 1, padding: 12, gap: 8 }}>
                  <SkeletonBlock width="70%" height={14} />
                  <SkeletonBlock width="40%" height={16} />
                  <SkeletonBlock width="30%" height={10} />
                </View>
              </View>
            ))}
          </View>
        </View>
      </StateSection>

      <StateSection title="EMPTY">
        <View style={[{ minHeight: 844 }, containerStyle]}>
          <TextInput className="bg-surface border border-border rounded-lg px-4 py-3 text-base mb-3" placeholder="Что ищете?" placeholderTextColor="#737373" editable={false} />
          <View className="py-12 items-center">
            <Feather name="search" size={48} color="#737373" />
            <Text className="text-text-primary text-lg font-semibold mt-3">Начните поиск</Text>
            <Text className="text-text-muted text-sm mt-1">Введите запрос или выберите категорию</Text>
          </View>
        </View>
      </StateSection>

      <StateSection title="FILTERED_EMPTY">
        <View style={[{ minHeight: 844 }, containerStyle]}>
          <TextInput className="bg-surface border border-border rounded-lg px-4 py-3 text-base mb-3" value="Ламборгини Кутаиси" editable={false} />
          <View className="py-12 items-center">
            <Feather name="frown" size={48} color="#737373" />
            <Text className="text-text-primary text-lg font-semibold mt-3">Ничего не найдено</Text>
            <Text className="text-text-muted text-sm mt-1 text-center">Попробуйте изменить запрос</Text>
          </View>
        </View>
      </StateSection>

      <StateSection title="MAP_VIEW">
        <View style={[{ minHeight: 844 }, containerStyle]}>
          <TextInput className="bg-surface border border-border rounded-lg px-4 py-3 text-base mb-3" value="Квартира Тбилиси" editable={false} />
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-text-muted text-sm">2 на карте</Text>
            <View className="flex-row gap-2">
              <TouchableOpacity className="bg-surface border border-border p-2 rounded-lg">
                <Feather name="list" size={16} color="#737373" />
              </TouchableOpacity>
              <TouchableOpacity className="bg-primary p-2 rounded-lg">
                <Feather name="map" size={16} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
          <View style={{ height: isDesktop ? 400 : 192 }} className="w-full bg-surface rounded-lg items-center justify-center border border-border">
            <Feather name="map" size={48} color="#737373" />
            <Text className="text-text-muted text-sm mt-2">Map placeholder</Text>
          </View>
        </View>
      </StateSection>
    </View>
  );
}
