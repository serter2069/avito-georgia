import { useState } from 'react';
import { View, Text, TouchableOpacity, Image, useWindowDimensions } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { StateSection } from '../StateSection';
import { SkeletonBlock, SkeletonRow, SkeletonCard } from '../SkeletonBlock';
import { mockListings } from '../../../constants/protoMockData';

type SortOption = 'new' | 'price_asc' | 'price_desc';

function FilterBar({ sort, onSort }: { sort: SortOption; onSort: (s: SortOption) => void }) {
  return (
    <View className="flex-row gap-2 mb-4 flex-wrap">
      <TouchableOpacity className="flex-row items-center bg-surface border border-border rounded-lg px-3 py-2">
        <Text className="text-text-secondary text-sm">Категория</Text>
        <Feather name="chevron-down" size={14} color="#1A1A1A" />
      </TouchableOpacity>
      <TouchableOpacity className="flex-row items-center bg-surface border border-border rounded-lg px-3 py-2">
        <Text className="text-text-secondary text-sm">Город</Text>
        <Feather name="chevron-down" size={14} color="#1A1A1A" />
      </TouchableOpacity>
      <TouchableOpacity className="flex-row items-center bg-surface border border-border rounded-lg px-3 py-2">
        <Text className="text-text-secondary text-sm">Цена</Text>
        <Feather name="chevron-down" size={14} color="#1A1A1A" />
      </TouchableOpacity>
      <TouchableOpacity
        className={`flex-row items-center rounded-lg px-3 py-2 ${sort === 'new' ? 'bg-primary/10 border border-primary' : 'bg-surface border border-border'}`}
        onPress={() => onSort('new')}
      >
        <Feather name="arrow-up-down" size={14} color={sort === 'new' ? '#00AA6C' : '#1A1A1A'} />
        <Text className={`text-sm ml-1 ${sort === 'new' ? 'text-primary' : 'text-text-secondary'}`}>Новые</Text>
      </TouchableOpacity>
      <TouchableOpacity
        className={`flex-row items-center rounded-lg px-3 py-2 ${sort === 'price_asc' ? 'bg-primary/10 border border-primary' : 'bg-surface border border-border'}`}
        onPress={() => onSort('price_asc')}
      >
        <Feather name="trending-up" size={14} color={sort === 'price_asc' ? '#00AA6C' : '#1A1A1A'} />
        <Text className={`text-sm ml-1 ${sort === 'price_asc' ? 'text-primary' : 'text-text-secondary'}`}>Дешевле</Text>
      </TouchableOpacity>
    </View>
  );
}

function ListingCard({ title, price, currency, city, isPromoted, seed, isGrid }: { title: string; price: number | null; currency: string; city: string; isPromoted: boolean; seed: string; isGrid?: boolean }) {
  if (isGrid) {
    return (
      <View className="bg-white border border-border rounded-lg overflow-hidden mb-3">
        <Image source={{ uri: `https://picsum.photos/seed/${seed}/400/300` }} style={{ width: '100%', height: 128 }} />
        <View className="p-3">
          {isPromoted && <View className="bg-secondary/20 px-2 py-0.5 rounded-full self-start mb-1"><Text className="text-secondary text-[10px] font-medium">TOP</Text></View>}
          <Text className="text-text-primary text-sm font-semibold mb-1" numberOfLines={1}>{title}</Text>
          <Text className="text-primary font-bold text-base">{price ? `${price.toLocaleString()} ${currency}` : 'Договорная'}</Text>
          <Text className="text-text-muted text-xs mt-1">{city}</Text>
        </View>
      </View>
    );
  }
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
  const [sort, setSort] = useState<SortOption>('new');
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;
  const isWide = width >= 1280;

  const colWidth = isWide ? '32%' : isDesktop ? '48%' : '100%';
  const containerStyle = isDesktop ? { maxWidth: 960, alignSelf: 'center' as const, width: '100%' } : {};

  return (
    <View>
      <StateSection title="DEFAULT">
        <View style={[{ minHeight: 844 }, containerStyle]}>
          <FilterBar sort={sort} onSort={setSort} />
          {isDesktop ? (
            <View className="flex-row flex-wrap gap-3">
              {mockListings.filter(l => l.status === 'active').map((l, idx) => (
                <View key={l.id} style={{ width: colWidth }}>
                  <ListingCard title={l.title} price={l.price} currency={l.currency} city={l.city} isPromoted={l.isPromoted} seed={`feed${idx + 1}`} isGrid />
                </View>
              ))}
            </View>
          ) : (
            mockListings.filter(l => l.status === 'active').map((l, idx) => (
              <ListingCard key={l.id} title={l.title} price={l.price} currency={l.currency} city={l.city} isPromoted={l.isPromoted} seed={`feed${idx + 1}`} />
            ))
          )}
        </View>
      </StateSection>

      <StateSection title="LOADING">
        <View style={[{ minHeight: 844 }, containerStyle]}>
          <FilterBar sort={sort} onSort={setSort} />
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, paddingTop: 8 }}>
            {[1, 2, 3].map(i => (
              <View key={i} style={{ width: isDesktop ? '48%' : '100%' }}>
                <SkeletonCard />
              </View>
            ))}
          </View>
        </View>
      </StateSection>

      <StateSection title="EMPTY">
        <View style={[{ minHeight: 844 }, containerStyle]}>
          <FilterBar sort={sort} onSort={setSort} />
          <View className="py-12 items-center">
            <Feather name="inbox" size={48} color="#737373" />
            <Text className="text-text-primary text-lg font-semibold mt-3">Нет объявлений</Text>
            <Text className="text-text-muted text-sm mt-1">Попробуйте изменить параметры поиска</Text>
          </View>
        </View>
      </StateSection>

      <StateSection title="FILTERED_EMPTY">
        <View style={[{ minHeight: 844 }, containerStyle]}>
          <View className="flex-row gap-2 mb-4 flex-wrap">
            <View className="flex-row items-center bg-primary/10 border border-primary rounded-lg px-3 py-2">
              <Text className="text-primary text-sm">Электроника</Text>
              <Feather name="x" size={14} color="#00AA6C" />
            </View>
            <View className="flex-row items-center bg-primary/10 border border-primary rounded-lg px-3 py-2">
              <Text className="text-primary text-sm">Кутаиси</Text>
              <Feather name="x" size={14} color="#00AA6C" />
            </View>
          </View>
          <View className="py-12 items-center">
            <Feather name="search" size={48} color="#737373" />
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
