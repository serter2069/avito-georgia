import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, useWindowDimensions } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { StateSection } from '../StateSection';
import { SkeletonBlock, SkeletonCard } from '../SkeletonBlock';
import { mockListings, mockCategories, mockCategoryIcons } from '../../../constants/protoMockData';

function CategoryChip({ name, icon, selected, onPress }: { name: string; icon: string; selected?: boolean; onPress?: () => void }) {
  return (
    <TouchableOpacity style={{ alignItems: 'center', marginRight: 16, marginBottom: 12 }} onPress={onPress}>
      <View style={{
        width: 56, height: 56, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginBottom: 6,
        backgroundColor: selected ? 'rgba(0,170,108,0.12)' : '#F5F7F8',
      }}>
        <Feather name={icon as any} size={24} color="#00AA6C" />
      </View>
      <Text style={{ color: '#737373', fontSize: 11, textAlign: 'center', fontWeight: '500' }}>{name}</Text>
    </TouchableOpacity>
  );
}

function ListingCardMini({ title, price, currency, city, seed }: { title: string; price: number | null; currency: string; city: string; seed: string }) {
  return (
    <View style={{ backgroundColor: '#fff', borderRadius: 10, borderWidth: 1, borderColor: '#E8EDF0', overflow: 'hidden', marginBottom: 12 }}>
      <Image source={{ uri: `https://picsum.photos/seed/${seed}/400/300` }} style={{ width: '100%', height: 128 }} />
      <View style={{ padding: 12 }}>
        <Text style={{ color: '#1A1A1A', fontSize: 14, fontWeight: '600', marginBottom: 4 }} numberOfLines={1}>{title}</Text>
        <Text style={{ color: '#00AA6C', fontWeight: '700', fontSize: 16 }}>{price ? `${price.toLocaleString()} ${currency}` : 'Договорная'}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 6 }}>
          <Feather name="map-pin" size={12} color="#737373" />
          <Text style={{ color: '#737373', fontSize: 12 }}>{city}</Text>
        </View>
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
  const containerStyle = isDesktop ? { maxWidth: 960, alignSelf: 'center' as const, width: '100%' } : {};

  return (
    <View>
      <StateSection title="DEFAULT">
        <View style={[{ minHeight: 844 }, containerStyle]}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <TextInput
              style={{ flex: 1, backgroundColor: '#F5F7F8', borderWidth: 1, borderColor: '#E8EDF0', borderRadius: 10, paddingHorizontal: 16, paddingVertical: 12, fontSize: 15, color: '#1A1A1A' }}
              placeholder="Поиск по объявлениям..."
              placeholderTextColor="#737373"
              editable={false}
            />
            <TouchableOpacity style={{ backgroundColor: '#00AA6C', padding: 12, borderRadius: 10 }}>
              <Feather name="search" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 16, backgroundColor: '#F5F7F8', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, alignSelf: 'flex-start' }}
            onPress={() => setSelectedCity(selectedCity ? null : 'Тбилиси')}
          >
            <Feather name="map-pin" size={16} color="#00AA6C" />
            <Text style={{ color: '#00AA6C', fontSize: 14, fontWeight: '600' }}>{selectedCity || 'Тбилиси'}</Text>
            <Feather name="chevron-down" size={14} color="#00AA6C" />
          </TouchableOpacity>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 16 }}>
            {mockCategories.map((cat) => (
              <CategoryChip key={cat} name={cat} icon={mockCategoryIcons[cat] || 'grid'} selected={selectedCategory === cat} onPress={() => setSelectedCategory(selectedCategory === cat ? null : cat)} />
            ))}
          </View>
          <Text style={{ color: '#1A1A1A', fontSize: 18, fontWeight: '700', marginBottom: 12 }}>Последние объявления</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
            {mockListings.filter(l => l.status === 'active').slice(0, 6).map((l, idx) => (
              <View key={l.id} style={{ width: colWidth as any }}>
                <ListingCardMini title={l.title} price={l.price} currency={l.currency} city={l.city} seed={`listing${idx + 1}`} />
              </View>
            ))}
          </View>
          <TouchableOpacity style={{ backgroundColor: '#00AA6C', paddingVertical: 14, borderRadius: 10, alignItems: 'center', marginTop: 16 }}>
            <Text style={{ color: '#fff', fontWeight: '600', fontSize: 15 }}>Разместить объявление</Text>
          </TouchableOpacity>
          <View style={{ marginTop: 24, paddingTop: 16, borderTopWidth: 1, borderTopColor: '#E8EDF0' }}>
            <Text style={{ color: '#737373', fontSize: 12, textAlign: 'center' }}>Avito Georgia 2026</Text>
          </View>
        </View>
      </StateSection>

      <StateSection title="LOADING">
        <View style={[{ minHeight: 844 }, containerStyle]}>
          <View style={{ flexDirection: 'row', gap: 8, marginBottom: 16 }}>
            <SkeletonBlock height={46} radius={10} style={{ flex: 1 }} />
            <SkeletonBlock width={46} height={46} radius={10} />
          </View>
          <SkeletonBlock width={120} height={36} radius={8} style={{ marginBottom: 16 }} />
          <View style={{ flexDirection: 'row', gap: 16, marginBottom: 24 }}>
            {[1, 2, 3, 4, 5].map(i => (
              <View key={i} style={{ alignItems: 'center', gap: 6 }}>
                <SkeletonBlock width={56} height={56} radius={14} />
                <SkeletonBlock width={48} height={10} />
              </View>
            ))}
          </View>
          <SkeletonBlock width={180} height={18} style={{ marginBottom: 12 }} />
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
            {[1, 2, 3, 4].map(i => (
              <View key={i} style={{ width: isDesktop ? '48%' as any : '48%' as any }}>
                <SkeletonCard />
              </View>
            ))}
          </View>
        </View>
      </StateSection>

      <StateSection title="EMPTY">
        <View style={[{ minHeight: 844 }, containerStyle]}>
          <View style={{ paddingVertical: 64, alignItems: 'center' }}>
            <View style={{ width: 72, height: 72, borderRadius: 36, backgroundColor: '#F5F7F8', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
              <Feather name="inbox" size={32} color="#737373" />
            </View>
            <Text style={{ color: '#1A1A1A', fontSize: 18, fontWeight: '700', marginBottom: 6 }}>Пока нет объявлений</Text>
            <Text style={{ color: '#737373', fontSize: 14, textAlign: 'center', maxWidth: 280 }}>Будьте первым, кто разместит объявление!</Text>
            <TouchableOpacity style={{ backgroundColor: '#00AA6C', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 10, marginTop: 20 }}>
              <Text style={{ color: '#fff', fontWeight: '600' }}>Разместить</Text>
            </TouchableOpacity>
          </View>
        </View>
      </StateSection>

      <StateSection title="ERROR">
        <View style={[{ minHeight: 844 }, containerStyle]}>
          <View style={{ paddingVertical: 64, alignItems: 'center' }}>
            <View style={{ width: 72, height: 72, borderRadius: 36, backgroundColor: '#FFEBEE', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
              <Feather name="wifi-off" size={32} color="#D32F2F" />
            </View>
            <Text style={{ color: '#1A1A1A', fontSize: 18, fontWeight: '700', marginBottom: 6 }}>Ошибка загрузки</Text>
            <Text style={{ color: '#737373', fontSize: 14, textAlign: 'center', maxWidth: 280, marginBottom: 20 }}>
              Не удалось загрузить объявления. Проверьте интернет-соединение.
            </Text>
            <TouchableOpacity style={{ backgroundColor: '#00AA6C', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 10 }}>
              <Text style={{ color: '#fff', fontWeight: '600' }}>Повторить</Text>
            </TouchableOpacity>
          </View>
        </View>
      </StateSection>

      <StateSection title="GUEST_CTA">
        <View style={[{ minHeight: 400 }, containerStyle]}>
          <View style={{ backgroundColor: '#F5F7F8', borderRadius: 12, padding: 24, alignItems: 'center' }}>
            <View style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: 'rgba(0,170,108,0.1)', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
              <Feather name="user-plus" size={24} color="#00AA6C" />
            </View>
            <Text style={{ color: '#1A1A1A', fontSize: 18, fontWeight: '700', marginBottom: 6 }}>Присоединяйтесь!</Text>
            <Text style={{ color: '#737373', fontSize: 14, textAlign: 'center', marginBottom: 16 }}>Войдите, чтобы размещать объявления и сохранять избранное</Text>
            <TouchableOpacity style={{ backgroundColor: '#00AA6C', paddingVertical: 12, paddingHorizontal: 32, borderRadius: 10 }}>
              <Text style={{ color: '#fff', fontWeight: '600' }}>Войти</Text>
            </TouchableOpacity>
          </View>
        </View>
      </StateSection>
    </View>
  );
}
