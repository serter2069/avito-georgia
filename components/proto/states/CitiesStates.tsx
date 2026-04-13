import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { StateSection } from '../StateSection';
import { mockCities } from '../../../constants/protoMockData';

// ─── Brand tokens (from BrandStates) ─────────────────────────────────────────
const C = {
  green: '#00AA6C',
  greenBg: '#E8F9F2',
  teal: '#0A7B8A',
  tealDark: '#0A2840',
  white: '#FFFFFF',
  page: '#FFFFFF',
  text: '#1A1A1A',
  muted: '#737373',
  border: '#E0E0E0',
  error: '#D32F2F',
  surface: '#F7F9FA',
};

// ─── City data with images and listing counts ────────────────────────────────
const georgiaCities = [
  { name: 'Тбилиси', nameKa: 'თბილისი', region: 'Тбилиси', listings: 4230, seed: 'tbilisi-city', description: 'Столица Грузии, крупнейший город' },
  { name: 'Батуми', nameKa: 'ბათუმი', region: 'Аджария', listings: 1850, seed: 'batumi-city', description: 'Черноморский курорт' },
  { name: 'Кутаиси', nameKa: 'ქუთაისი', region: 'Имеретия', listings: 920, seed: 'kutaisi-city', description: 'Второй по величине город' },
  { name: 'Рустави', nameKa: 'რუსთავი', region: 'Квемо-Картли', listings: 540, seed: 'rustavi-city', description: 'Промышленный центр' },
  { name: 'Гори', nameKa: 'გორი', region: 'Шида-Картли', listings: 310, seed: 'gori-city', description: 'Исторический город' },
  { name: 'Зугдиди', nameKa: 'ზუგდიდი', region: 'Самегрело', listings: 280, seed: 'zugdidi-city', description: 'Вблизи Абхазии' },
  { name: 'Сухуми', nameKa: 'სოხუმი', region: 'Абхазия', listings: 0, seed: 'sukhumi-city', description: 'Временно недоступен' },
  { name: 'Поти', nameKa: 'ფოთი', region: 'Самегрело', listings: 190, seed: 'poti-city', description: 'Портовый город' },
  { name: 'Телави', nameKa: 'თელავი', region: 'Кахетия', listings: 220, seed: 'telavi-city', description: 'Винодельческий край' },
  { name: 'Мцхета', nameKa: 'მცხეთა', region: 'Мцхета-Мтианети', listings: 150, seed: 'mtskheta-city', description: 'Древняя столица' },
];

// ─── City Card Component ─────────────────────────────────────────────────────
function CityCard({
  city,
  selected,
  onPress,
}: {
  city: (typeof georgiaCities)[0];
  selected?: boolean;
  onPress?: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={{
        backgroundColor: C.white,
        borderRadius: 12,
        overflow: 'hidden',
        borderWidth: selected ? 2 : 1,
        borderColor: selected ? C.green : C.border,
      }}
    >
      <Image
        source={{ uri: `https://picsum.photos/seed/${city.seed}/400/200` }}
        style={{ width: '100%', height: 120 }}
        resizeMode="cover"
      />
      <View style={{ padding: 12 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
          <Text style={{ fontSize: 16, fontWeight: '700', color: C.text }}>{city.name}</Text>
          {city.listings > 0 ? (
            <View style={{ backgroundColor: C.greenBg, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 }}>
              <Text style={{ fontSize: 11, fontWeight: '600', color: C.green }}>{city.listings.toLocaleString()} объявлений</Text>
            </View>
          ) : (
            <View style={{ backgroundColor: '#FFF3F3', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 }}>
              <Text style={{ fontSize: 11, fontWeight: '600', color: C.error }}>Нет доступа</Text>
            </View>
          )}
        </View>
        <Text style={{ fontSize: 12, color: C.muted, marginBottom: 2 }}>{city.nameKa}</Text>
        <Text style={{ fontSize: 12, color: C.muted }}>{city.description}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6, gap: 4 }}>
          <Feather name="map-pin" size={12} color={C.teal} />
          <Text style={{ fontSize: 11, color: C.teal, fontWeight: '500' }}>{city.region}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

// ─── City List Item (compact) ────────────────────────────────────────────────
function CityListItem({
  city,
  onPress,
}: {
  city: (typeof georgiaCities)[0];
  onPress?: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        backgroundColor: C.white,
        borderBottomWidth: 1,
        borderBottomColor: C.border,
      }}
    >
      <Image
        source={{ uri: `https://picsum.photos/seed/${city.seed}/80/80` }}
        style={{ width: 48, height: 48, borderRadius: 24 }}
        resizeMode="cover"
      />
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text style={{ fontSize: 15, fontWeight: '600', color: C.text }}>{city.name}</Text>
        <Text style={{ fontSize: 12, color: C.muted }}>{city.region}</Text>
      </View>
      <View style={{ alignItems: 'flex-end' }}>
        <Text style={{ fontSize: 13, fontWeight: '600', color: city.listings > 0 ? C.green : C.error }}>
          {city.listings > 0 ? city.listings.toLocaleString() : '--'}
        </Text>
        <Text style={{ fontSize: 10, color: C.muted }}>объявлений</Text>
      </View>
      <Feather name="chevron-right" size={18} color={C.muted} style={{ marginLeft: 8 }} />
    </TouchableOpacity>
  );
}

// ─── Region Badge ────────────────────────────────────────────────────────────
function RegionBadge({ name, count }: { name: string; count: number }) {
  return (
    <View style={{
      backgroundColor: C.surface,
      borderRadius: 10,
      paddingHorizontal: 14,
      paddingVertical: 10,
      borderWidth: 1,
      borderColor: C.border,
    }}>
      <Text style={{ fontSize: 13, fontWeight: '600', color: C.text }}>{name}</Text>
      <Text style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>{count} объявлений</Text>
    </View>
  );
}

// ─── DEFAULT STATE ───────────────────────────────────────────────────────────
function DefaultState() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;

  const filtered = georgiaCities.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.region.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const colWidth = isDesktop ? '48%' : '100%';

  return (
    <StateSection title="DEFAULT">
      <View style={{ minHeight: 844 }}>
        {/* Hero banner */}
        <View style={{ position: 'relative', marginBottom: 20 }}>
          <Image
            source={{ uri: 'https://picsum.photos/seed/georgia-country/800/300' }}
            style={{ width: '100%', height: 180 }}
            resizeMode="cover"
          />
          <View style={{
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(10,40,64,0.6)',
            justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20,
          }}>
            <Text style={{ fontSize: 24, fontWeight: '800', color: C.white, marginBottom: 4 }}>
              Объявления по всей Грузии
            </Text>
            <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.85)' }}>
              Выберите город или регион для поиска
            </Text>
          </View>
        </View>

        {/* Search bar */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <View style={{
            flex: 1, flexDirection: 'row', alignItems: 'center',
            backgroundColor: C.surface, borderRadius: 10, borderWidth: 1, borderColor: C.border,
            paddingHorizontal: 12,
          }}>
            <Feather name="search" size={18} color={C.muted} />
            <TextInput
              style={{ flex: 1, paddingVertical: 10, paddingHorizontal: 8, fontSize: 15, color: C.text }}
              placeholder="Поиск города или региона..."
              placeholderTextColor={C.muted}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Feather name="x" size={16} color={C.muted} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Popular cities */}
        <Text style={{ fontSize: 17, fontWeight: '700', color: C.text, marginBottom: 12 }}>
          Популярные города
        </Text>

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
          {filtered.map((city) => (
            <View key={city.name} style={{ width: colWidth }}>
              <CityCard
                city={city}
                selected={selectedCity === city.name}
                onPress={() => setSelectedCity(selectedCity === city.name ? null : city.name)}
              />
            </View>
          ))}
        </View>

        {filtered.length === 0 && (
          <View style={{ alignItems: 'center', paddingVertical: 40 }}>
            <Feather name="search" size={40} color={C.muted} />
            <Text style={{ fontSize: 16, fontWeight: '600', color: C.text, marginTop: 12 }}>Город не найден</Text>
            <Text style={{ fontSize: 13, color: C.muted, marginTop: 4 }}>Попробуйте другой запрос</Text>
          </View>
        )}

        {/* Regions section */}
        <Text style={{ fontSize: 17, fontWeight: '700', color: C.text, marginTop: 24, marginBottom: 12 }}>
          Регионы Грузии
        </Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {Array.from(new Set(georgiaCities.map((c) => c.region))).map((region) => {
            const count = georgiaCities.filter((c) => c.region === region).reduce((s, c) => s + c.listings, 0);
            return <RegionBadge key={region} name={region} count={count} />;
          })}
        </View>
      </View>
    </StateSection>
  );
}

// ─── LIST VIEW STATE ─────────────────────────────────────────────────────────
function ListViewState() {
  const [searchQuery, setSearchQuery] = useState('');
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;

  const filtered = georgiaCities.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.region.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const containerStyle = isDesktop ? { maxWidth: 600, alignSelf: 'center' as const } : {};

  return (
    <StateSection title="LIST_VIEW">
      <View style={{ minHeight: 844, ...containerStyle }}>
        {/* Header */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <TouchableOpacity style={{ padding: 4 }}>
            <Feather name="arrow-left" size={22} color={C.text} />
          </TouchableOpacity>
          <Text style={{ fontSize: 18, fontWeight: '700', color: C.text, flex: 1 }}>Все города</Text>
          <Text style={{ fontSize: 13, color: C.muted }}>{georgiaCities.length} городов</Text>
        </View>

        {/* Search */}
        <View style={{
          flexDirection: 'row', alignItems: 'center',
          backgroundColor: C.surface, borderRadius: 10, borderWidth: 1, borderColor: C.border,
          paddingHorizontal: 12, marginBottom: 8,
        }}>
          <Feather name="search" size={18} color={C.muted} />
          <TextInput
            style={{ flex: 1, paddingVertical: 10, paddingHorizontal: 8, fontSize: 15, color: C.text }}
            placeholder="Город или регион..."
            placeholderTextColor={C.muted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Sort bar */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8, paddingHorizontal: 16 }}>
          <Text style={{ fontSize: 12, color: C.muted }}>По количеству объявлений</Text>
          <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Feather name="sliders" size={14} color={C.teal} />
            <Text style={{ fontSize: 12, color: C.teal, fontWeight: '500' }}>Фильтр</Text>
          </TouchableOpacity>
        </View>

        {/* City list */}
        <View style={{ borderRadius: 12, overflow: 'hidden', borderWidth: 1, borderColor: C.border }}>
          {filtered.map((city) => (
            <CityListItem key={city.name} city={city} />
          ))}
        </View>

        {filtered.length === 0 && (
          <View style={{ alignItems: 'center', paddingVertical: 40 }}>
            <Feather name="search" size={40} color={C.muted} />
            <Text style={{ fontSize: 16, fontWeight: '600', color: C.text, marginTop: 12 }}>Ничего не найдено</Text>
          </View>
        )}
      </View>
    </StateSection>
  );
}

// ─── CITY DETAIL STATE ───────────────────────────────────────────────────────
function CityDetailState() {
  const [activeTab, setActiveTab] = useState<'all' | 'categories'>('all');
  const city = georgiaCities[0]; // Tbilisi as example
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;

  const categories = [
    { name: 'Транспорт', count: 1240, icon: 'truck' as const },
    { name: 'Недвижимость', count: 980, icon: 'home' as const },
    { name: 'Электроника', count: 650, icon: 'smartphone' as const },
    { name: 'Одежда', count: 420, icon: 'tag' as const },
    { name: 'Мебель', count: 310, icon: 'package' as const },
    { name: 'Услуги', count: 280, icon: 'tool' as const },
    { name: 'Работа', count: 190, icon: 'briefcase' as const },
    { name: 'Детское', count: 100, icon: 'heart' as const },
  ];

  const containerStyle = isDesktop ? { maxWidth: 600, alignSelf: 'center' as const } : {};

  return (
    <StateSection title="CITY_DETAIL">
      <View style={{ minHeight: 844, ...containerStyle }}>
        {/* Hero image */}
        <View style={{ position: 'relative', marginBottom: 16 }}>
          <Image
            source={{ uri: `https://picsum.photos/seed/${city.seed}/800/350` }}
            style={{ width: '100%', height: 200, borderRadius: 12 }}
            resizeMode="cover"
          />
          <TouchableOpacity style={{
            position: 'absolute', top: 12, left: 12,
            backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: 20, padding: 8,
          }}>
            <Feather name="arrow-left" size={18} color={C.text} />
          </TouchableOpacity>
        </View>

        {/* City info */}
        <View style={{ paddingHorizontal: 4 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
            <View>
              <Text style={{ fontSize: 22, fontWeight: '800', color: C.text }}>{city.name}</Text>
              <Text style={{ fontSize: 14, color: C.muted }}>{city.nameKa} / {city.region}</Text>
            </View>
            <View style={{ backgroundColor: C.greenBg, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 }}>
              <Text style={{ fontSize: 14, fontWeight: '700', color: C.green }}>{city.listings.toLocaleString()}</Text>
              <Text style={{ fontSize: 10, color: C.green }}>объявлений</Text>
            </View>
          </View>

          <Text style={{ fontSize: 14, color: C.muted, lineHeight: 20, marginBottom: 16 }}>
            {city.description}. Здесь вы найдёте объявления о продаже автомобилей, недвижимости, электроники и многого другого.
          </Text>

          {/* Tabs */}
          <View style={{ flexDirection: 'row', gap: 0, marginBottom: 16, borderRadius: 8, overflow: 'hidden', borderWidth: 1, borderColor: C.border }}>
            <TouchableOpacity
              onPress={() => setActiveTab('all')}
              style={{
                flex: 1, paddingVertical: 10, alignItems: 'center',
                backgroundColor: activeTab === 'all' ? C.teal : C.white,
              }}
            >
              <Text style={{ fontSize: 13, fontWeight: '600', color: activeTab === 'all' ? C.white : C.muted }}>
                Все объявления
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setActiveTab('categories')}
              style={{
                flex: 1, paddingVertical: 10, alignItems: 'center',
                backgroundColor: activeTab === 'categories' ? C.teal : C.white,
                borderLeftWidth: 1, borderRightWidth: 1, borderColor: C.border,
              }}
            >
              <Text style={{ fontSize: 13, fontWeight: '600', color: activeTab === 'categories' ? C.white : C.muted }}>
                По категориям
              </Text>
            </TouchableOpacity>
          </View>

          {activeTab === 'categories' ? (
            <View style={{ gap: 8 }}>
              {categories.map((cat) => (
                <TouchableOpacity
                  key={cat.name}
                  style={{
                    flexDirection: 'row', alignItems: 'center',
                    backgroundColor: C.surface, borderRadius: 10, padding: 14,
                    borderWidth: 1, borderColor: C.border,
                  }}
                >
                  <View style={{
                    width: 40, height: 40, borderRadius: 10,
                    backgroundColor: C.greenBg, alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Feather name={cat.icon} size={20} color={C.green} />
                  </View>
                  <Text style={{ flex: 1, marginLeft: 12, fontSize: 15, fontWeight: '500', color: C.text }}>
                    {cat.name}
                  </Text>
                  <Text style={{ fontSize: 13, color: C.muted, marginRight: 8 }}>
                    {cat.count.toLocaleString()}
                  </Text>
                  <Feather name="chevron-right" size={16} color={C.muted} />
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <View style={{ gap: 12 }}>
              {/* Recent listings preview */}
              <Text style={{ fontSize: 15, fontWeight: '600', color: C.text, marginBottom: 4 }}>
                Последние объявления в {city.name}
              </Text>
              {[1, 2, 3, 4].map((i) => (
                <View key={i} style={{
                  flexDirection: 'row', backgroundColor: C.white, borderRadius: 10,
                  borderWidth: 1, borderColor: C.border, overflow: 'hidden',
                }}>
                  <Image
                    source={{ uri: `https://picsum.photos/seed/tbilisi-listing-${i}/200/200` }}
                    style={{ width: 90, height: 90 }}
                    resizeMode="cover"
                  />
                  <View style={{ flex: 1, padding: 10, justifyContent: 'center' }}>
                    <Text style={{ fontSize: 14, fontWeight: '600', color: C.text }} numberOfLines={1}>
                      {['Toyota Camry 2020', 'Квартира 2-комн.', 'iPhone 15 Pro', 'Диван угловой'][i - 1]}
                    </Text>
                    <Text style={{ fontSize: 15, fontWeight: '700', color: C.green, marginTop: 4 }}>
                      {[28500, 145000, 3200, 850][i - 1].toLocaleString()} {['USD', 'USD', 'GEL', 'GEL'][i - 1]}
                    </Text>
                  </View>
                </View>
              ))}
              <TouchableOpacity style={{
                backgroundColor: C.teal, borderRadius: 10, paddingVertical: 14,
                alignItems: 'center', marginTop: 4,
              }}>
                <Text style={{ fontSize: 15, fontWeight: '600', color: C.white }}>
                  Все объявления в {city.name}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </StateSection>
  );
}

// ─── EMPTY / NO LISTINGS STATE ───────────────────────────────────────────────
function EmptyState() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;
  const containerStyle = isDesktop ? { maxWidth: 600, alignSelf: 'center' as const } : {};
  const city = georgiaCities[6]; // Sukhumi - no listings

  return (
    <StateSection title="EMPTY_CITY">
      <View style={{ minHeight: 844, ...containerStyle }}>
        {/* Header */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <TouchableOpacity style={{ padding: 4 }}>
            <Feather name="arrow-left" size={22} color={C.text} />
          </TouchableOpacity>
          <Text style={{ fontSize: 18, fontWeight: '700', color: C.text, flex: 1 }}>{city.name}</Text>
        </View>

        {/* City image with overlay */}
        <View style={{ position: 'relative', marginBottom: 24 }}>
          <Image
            source={{ uri: `https://picsum.photos/seed/${city.seed}/800/300` }}
            style={{ width: '100%', height: 160, borderRadius: 12 }}
            resizeMode="cover"
          />
          <View style={{
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 12,
            justifyContent: 'center', alignItems: 'center',
          }}>
            <Feather name="alert-circle" size={36} color={C.white} />
          </View>
        </View>

        {/* Empty message */}
        <View style={{ alignItems: 'center', paddingHorizontal: 20 }}>
          <View style={{
            width: 72, height: 72, borderRadius: 36,
            backgroundColor: '#FFF3F3', alignItems: 'center', justifyContent: 'center',
            marginBottom: 16,
          }}>
            <Feather name="map-pin" size={32} color={C.error} />
          </View>
          <Text style={{ fontSize: 20, fontWeight: '700', color: C.text, marginBottom: 8, textAlign: 'center' }}>
            Объявления недоступны
          </Text>
          <Text style={{ fontSize: 14, color: C.muted, textAlign: 'center', lineHeight: 20, marginBottom: 24 }}>
            В городе {city.name} ({city.nameKa}) пока нет доступных объявлений. Это может быть связано с ограничениями региона.
          </Text>

          <TouchableOpacity style={{
            backgroundColor: C.teal, borderRadius: 10, paddingVertical: 14,
            paddingHorizontal: 32, marginBottom: 12,
          }}>
            <Text style={{ fontSize: 15, fontWeight: '600', color: C.white }}>
              Выбрать другой город
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={{
            backgroundColor: C.surface, borderRadius: 10, paddingVertical: 14,
            paddingHorizontal: 32, borderWidth: 1, borderColor: C.border,
          }}>
            <Text style={{ fontSize: 15, fontWeight: '600', color: C.teal }}>
              Смотреть все объявления
            </Text>
          </TouchableOpacity>
        </View>

        {/* Suggested cities */}
        <Text style={{ fontSize: 15, fontWeight: '600', color: C.text, marginTop: 32, marginBottom: 12 }}>
          Ближайшие города
        </Text>
        <View style={{ gap: 8 }}>
          {georgiaCities.filter((c) => c.listings > 0).slice(0, 3).map((c) => (
            <TouchableOpacity
              key={c.name}
              style={{
                flexDirection: 'row', alignItems: 'center',
                backgroundColor: C.surface, borderRadius: 10, padding: 12,
                borderWidth: 1, borderColor: C.border,
              }}
            >
              <Image
                source={{ uri: `https://picsum.photos/seed/${c.seed}/80/80` }}
                style={{ width: 44, height: 44, borderRadius: 22 }}
                resizeMode="cover"
              />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: C.text }}>{c.name}</Text>
                <Text style={{ fontSize: 12, color: C.muted }}>{c.region}</Text>
              </View>
              <View style={{ backgroundColor: C.greenBg, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 }}>
                <Text style={{ fontSize: 11, fontWeight: '600', color: C.green }}>{c.listings.toLocaleString()}</Text>
              </View>
              <Feather name="chevron-right" size={16} color={C.muted} style={{ marginLeft: 8 }} />
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </StateSection>
  );
}

// ─── EXPORT ──────────────────────────────────────────────────────────────────
export default function CitiesStates() {
  return (
    <View>
      <DefaultState />
      <ListViewState />
      <CityDetailState />
      <EmptyState />
    </View>
  );
}
