import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  Image,
  ScrollView,
  useWindowDimensions,
  Platform,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { StateSection } from '../StateSection';
import { mockCategories, mockCategoryIcons, mockCities, mockListings } from '../../../constants/protoMockData';

// Navigation helper for proto links
function navTo(pageId: string) {
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    window.open(`/proto/states/${pageId}`, '_self');
  }
}

// Brand colors — synced with BrandStates.tsx
const C = {
  primary: '#0A7B8A',
  primaryBg: '#E8F4F8',
  white: '#FFFFFF',
  page: '#F2F8FA',
  text: '#0A2840',
  muted: '#6A8898',
  border: '#C8E0E8',
  error: '#D32F2F',
};

// ─── Logo ────────────────────────────────────────────────────────────────────
function AvitoLogo() {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
      <View style={{
        width: 40, height: 40, backgroundColor: C.primary,
        borderRadius: 10, alignItems: 'center', justifyContent: 'center',
      }}>
        <Text style={{ color: '#fff', fontSize: 20, fontWeight: '800', letterSpacing: -0.5 }}>A</Text>
      </View>
      <View>
        <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 1 }}>
          <Text style={{ fontSize: 22, fontWeight: '700', color: C.text, letterSpacing: -0.3 }}>avito</Text>
          <Text style={{ fontSize: 16, fontWeight: '600', color: C.primary }}>.ge</Text>
        </View>
        <Text style={{ fontSize: 11, color: C.muted, fontWeight: '400', letterSpacing: 0.2 }}>
          Georgia classifieds
        </Text>
      </View>
    </View>
  );
}

// ─── Header ─────────────────────────────────────────────────────────────────
function LandingHeader({ onLogin }: { onLogin: () => void }) {
  return (
    <View style={{
      flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
      paddingHorizontal: 20, paddingVertical: 14, backgroundColor: C.white,
      borderBottomWidth: 1, borderBottomColor: C.border,
    }}>
      <AvitoLogo />
      <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
        <Pressable style={{
          paddingHorizontal: 16, paddingVertical: 8, borderRadius: 6,
          borderWidth: 1.5, borderColor: C.primary, backgroundColor: C.white,
        }} onPress={() => { onLogin(); navTo('auth-email'); }}>
          <Text style={{ color: C.primary, fontWeight: '600', fontSize: 14 }}>Войти</Text>
        </Pressable>
        <Pressable style={{
          paddingHorizontal: 16, paddingVertical: 8, borderRadius: 6,
          backgroundColor: C.primary,
        }} onPress={() => navTo('create-listing')}>
          <Text style={{ color: C.white, fontWeight: '600', fontSize: 14 }}>Подать объявление</Text>
        </Pressable>
      </View>
    </View>
  );
}

// ─── Category Chip ──────────────────────────────────────────────────────────
function CategoryChip({ name, icon }: { name: string; icon: string }) {
  return (
    <View style={{
      alignItems: 'center', width: 80, marginBottom: 12,
    }}>
      <View style={{
        width: 56, height: 56, borderRadius: 12, backgroundColor: C.primaryBg,
        alignItems: 'center', justifyContent: 'center', marginBottom: 6,
      }}>
        <Feather name={icon as any} size={24} color={C.primary} />
      </View>
      <Text style={{ fontSize: 12, fontWeight: '500', color: C.text, textAlign: 'center' }} numberOfLines={2}>
        {name}
      </Text>
    </View>
  );
}

// ─── Listing Card ───────────────────────────────────────────────────────────
function ListingCard({ title, price, currency, city, seed }: {
  title: string; price: number | null; currency: string; city: string; seed: string;
}) {
  const [saved, setSaved] = useState(false);
  return (
    <View style={{
      backgroundColor: C.white, borderRadius: 8, borderWidth: 1,
      borderColor: C.border, overflow: 'hidden',
      shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.06, shadowRadius: 3, elevation: 2,
    }}>
      <View style={{ position: 'relative' }}>
        <Image
          source={{ uri: `https://picsum.photos/seed/${seed}/400/260` }}
          style={{ width: '100%', height: 130, backgroundColor: C.page }}
          resizeMode="cover"
        />
        <Pressable
          onPress={() => setSaved(!saved)}
          style={{
            position: 'absolute', top: 6, right: 6,
            backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: 16,
            width: 28, height: 28, alignItems: 'center', justifyContent: 'center',
          }}
        >
          <Feather name="heart" size={14} color={saved ? C.error : C.muted} />
        </Pressable>
      </View>
      <View style={{ padding: 10 }}>
        <Text style={{ fontSize: 16, fontWeight: '700', color: C.text, marginBottom: 2 }}>
          {price ? `${price.toLocaleString()} ${currency}` : 'Договорная'}
        </Text>
        <Text style={{ fontSize: 13, color: C.text, marginBottom: 4 }} numberOfLines={2}>{title}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <Feather name="map-pin" size={11} color={C.muted} />
          <Text style={{ fontSize: 11, color: C.muted }}>{city}</Text>
        </View>
      </View>
    </View>
  );
}

// ─── Feature Card ───────────────────────────────────────────────────────────
function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <View style={{
      backgroundColor: C.white, borderRadius: 10, borderWidth: 1,
      borderColor: C.border, padding: 20, flex: 1, minWidth: 200,
    }}>
      <View style={{
        width: 44, height: 44, borderRadius: 10, backgroundColor: C.primaryBg,
        alignItems: 'center', justifyContent: 'center', marginBottom: 12,
      }}>
        <Feather name={icon as any} size={22} color={C.primary} />
      </View>
      <Text style={{ fontSize: 15, fontWeight: '700', color: C.text, marginBottom: 6 }}>{title}</Text>
      <Text style={{ fontSize: 13, color: C.muted, lineHeight: 18 }}>{description}</Text>
    </View>
  );
}

// ─── Footer ─────────────────────────────────────────────────────────────────
function LandingFooter() {
  return (
    <View style={{
      backgroundColor: C.text, paddingVertical: 32, paddingHorizontal: 20,
    }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 20 }}>
        <View style={{
          width: 32, height: 32, backgroundColor: C.primary, borderRadius: 8,
          alignItems: 'center', justifyContent: 'center',
        }}>
          <Text style={{ color: '#fff', fontSize: 16, fontWeight: '800' }}>A</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 1 }}>
          <Text style={{ fontSize: 18, fontWeight: '700', color: '#fff' }}>avito</Text>
          <Text style={{ fontSize: 13, fontWeight: '600', color: C.primary }}>.ge</Text>
        </View>
      </View>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 20, marginBottom: 20 }}>
        <View style={{ gap: 8 }}>
          <Text style={{ fontSize: 13, fontWeight: '600', color: '#fff', marginBottom: 4 }}>Компания</Text>
          <Pressable onPress={() => navTo('about')}><Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>О нас</Text></Pressable>
          <Pressable onPress={() => navTo('help')}><Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>Помощь</Text></Pressable>
          <Pressable onPress={() => navTo('homepage')}><Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>Контакты</Text></Pressable>
        </View>
        <View style={{ gap: 8 }}>
          <Text style={{ fontSize: 13, fontWeight: '600', color: '#fff', marginBottom: 4 }}>Правовая информация</Text>
          <Pressable onPress={() => navTo('privacy')}><Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>Политика конфиденциальности</Text></Pressable>
          <Pressable onPress={() => navTo('terms')}><Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>Пользовательское соглашение</Text></Pressable>
        </View>
        <View style={{ gap: 8 }}>
          <Text style={{ fontSize: 13, fontWeight: '600', color: '#fff', marginBottom: 4 }}>Города</Text>
          {mockCities.slice(0, 4).map((city) => (
            <Text key={city} style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>{city}</Text>
          ))}
        </View>
      </View>
      <View style={{ borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.15)', paddingTop: 16 }}>
        <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>
          2026 Avito Georgia. Все права защищены.
        </Text>
      </View>
    </View>
  );
}

// ─── DEFAULT STATE — Full Landing Page ──────────────────────────────────────
function DefaultState({ onLogin }: { onLogin: () => void }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;

  const cardWidth = isDesktop ? '31%' : '48%';

  return (
    <View style={{ minHeight: 844, backgroundColor: C.page }}>
      {/* Header */}
      <LandingHeader onLogin={onLogin} />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View style={{
          backgroundColor: C.primary, paddingVertical: 40, paddingHorizontal: 20,
          alignItems: 'center',
        }}>
          <Text style={{
            fontSize: isDesktop ? 36 : 28, fontWeight: '800', color: '#fff',
            textAlign: 'center', marginBottom: 12, letterSpacing: -0.5,
          }}>
            Купля-продажа в Грузии
          </Text>
          <Text style={{
            fontSize: isDesktop ? 16 : 14, color: 'rgba(255,255,255,0.85)',
            textAlign: 'center', marginBottom: 28, maxWidth: 500, lineHeight: 22,
          }}>
            Тысячи объявлений по всей Грузии. Покупайте и продавайте легко — от Тбилиси до Батуми.
          </Text>

          {/* Search Bar */}
          <View style={{
            flexDirection: 'row', backgroundColor: C.white,
            borderRadius: 8, overflow: 'hidden', width: '100%', maxWidth: 600,
            shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.15, shadowRadius: 12, elevation: 6,
          }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', paddingLeft: 14, flex: 1 }}>
              <Feather name="search" size={18} color={C.muted} />
              <TextInput
                style={{
                  flex: 1, fontSize: 15, color: C.text,
                  paddingVertical: 14, paddingHorizontal: 10,
                }}
                placeholder="Что ищете?"
                placeholderTextColor={C.muted}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
            <Pressable style={{
              backgroundColor: C.primary, paddingHorizontal: 24,
              alignItems: 'center', justifyContent: 'center',
            }}>
              <Text style={{ color: '#fff', fontWeight: '700', fontSize: 15 }}>Найти</Text>
            </Pressable>
          </View>

          {/* City pills */}
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 16, justifyContent: 'center' }}>
            {mockCities.map((city) => (
              <Pressable
                key={city}
                onPress={() => setSelectedCity(selectedCity === city ? null : city)}
                style={{
                  paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20,
                  backgroundColor: selectedCity === city ? '#fff' : 'rgba(255,255,255,0.2)',
                  borderWidth: 1,
                  borderColor: selectedCity === city ? '#fff' : 'rgba(255,255,255,0.3)',
                }}
              >
                <Text style={{
                  fontSize: 13, fontWeight: '600',
                  color: selectedCity === city ? C.primary : '#fff',
                }}>
                  {city}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Categories */}
        <View style={{ paddingHorizontal: 20, paddingVertical: 28 }}>
          <Text style={{ fontSize: 20, fontWeight: '700', color: C.text, marginBottom: 16 }}>
            Категории
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {mockCategories.map((cat) => (
              <CategoryChip key={cat} name={cat} icon={mockCategoryIcons[cat] || 'grid'} />
            ))}
          </View>
        </View>

        {/* Featured Listings */}
        <View style={{ paddingHorizontal: 20, paddingBottom: 28 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <Text style={{ fontSize: 20, fontWeight: '700', color: C.text }}>
              Свежие объявления
            </Text>
            <Pressable style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }} onPress={() => navTo('listings-feed')}>
              <Text style={{ fontSize: 14, fontWeight: '600', color: C.primary }}>Все</Text>
              <Feather name="chevron-right" size={16} color={C.primary} />
            </Pressable>
          </View>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
            {mockListings.filter(l => l.status === 'active').slice(0, 6).map((l, idx) => (
              <View key={l.id} style={{ width: cardWidth as any }}>
                <ListingCard
                  title={l.title}
                  price={l.price}
                  currency={l.currency}
                  city={l.city}
                  seed={`landing-listing-${idx}`}
                />
              </View>
            ))}
          </View>
        </View>

        {/* Features / Benefits */}
        <View style={{ paddingHorizontal: 20, paddingBottom: 28 }}>
          <Text style={{ fontSize: 20, fontWeight: '700', color: C.text, marginBottom: 16 }}>
            Почему avito.ge?
          </Text>
          <View style={{ flexDirection: isDesktop ? 'row' : 'column', gap: 12 }}>
            <FeatureCard
              icon="shield"
              title="Безопасно"
              description="Проверенные продавцы и система жалоб. Ваши сделки под защитой."
            />
            <FeatureCard
              icon="zap"
              title="Быстро"
              description="Разместите объявление за 2 минуты. Модерация в течение часа."
            />
            <FeatureCard
              icon="map-pin"
              title="Локально"
              description="Находите предложения рядом с вами — от Тбилиси до Зугдиди."
            />
          </View>
        </View>

        {/* CTA Section */}
        <View style={{
          backgroundColor: C.primaryBg, paddingVertical: 36, paddingHorizontal: 20,
          alignItems: 'center',
        }}>
          <Text style={{
            fontSize: isDesktop ? 24 : 20, fontWeight: '700', color: C.text,
            textAlign: 'center', marginBottom: 10,
          }}>
            Начните продавать прямо сейчас
          </Text>
          <Text style={{
            fontSize: 14, color: C.muted, textAlign: 'center', marginBottom: 20,
            maxWidth: 400, lineHeight: 20,
          }}>
            Бесплатное размещение до 10 объявлений. Премиум подписка для профессиональных продавцов.
          </Text>
          <Pressable style={{
            backgroundColor: C.primary, borderRadius: 8,
            paddingHorizontal: 32, paddingVertical: 14,
            shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.15, shadowRadius: 6, elevation: 3,
          }} onPress={() => navTo('create-listing')}>
            <Text style={{ color: '#fff', fontWeight: '700', fontSize: 16 }}>Подать объявление бесплатно</Text>
          </Pressable>
        </View>

        {/* Stats */}
        <View style={{
          flexDirection: isDesktop ? 'row' : 'column', paddingHorizontal: 20,
          paddingVertical: 28, gap: 16,
          justifyContent: 'center', alignItems: 'center',
        }}>
          <StatItem value="12 000+" label="Активных объявлений" />
          <StatItem value="6" label="Городов Грузии" />
          <StatItem value="8 500+" label="Пользователей" />
          <StatItem value="3" label="Языка (KA/RU/EN)" />
        </View>

        {/* Footer */}
        <LandingFooter />
      </ScrollView>
    </View>
  );
}

function StatItem({ value, label }: { value: string; label: string }) {
  return (
    <View style={{ alignItems: 'center', flex: 1, minWidth: 120 }}>
      <Text style={{ fontSize: 28, fontWeight: '800', color: C.primary, marginBottom: 4 }}>{value}</Text>
      <Text style={{ fontSize: 13, color: C.muted, textAlign: 'center' }}>{label}</Text>
    </View>
  );
}

// ─── MOBILE HEADER STATE ────────────────────────────────────────────────────
function MobileHeaderState() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <View style={{ minHeight: 844, backgroundColor: C.page }}>
      {/* Mobile header */}
      <View style={{
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingHorizontal: 16, paddingVertical: 12, backgroundColor: C.white,
        borderBottomWidth: 1, borderBottomColor: C.border,
      }}>
        <Pressable onPress={() => setMenuOpen(!menuOpen)}>
          <Feather name={menuOpen ? 'x' : 'menu'} size={24} color={C.text} />
        </Pressable>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <View style={{
            width: 28, height: 28, backgroundColor: C.primary, borderRadius: 6,
            alignItems: 'center', justifyContent: 'center',
          }}>
            <Text style={{ color: '#fff', fontSize: 14, fontWeight: '800' }}>A</Text>
          </View>
          <Text style={{ fontWeight: '700', color: C.text, fontSize: 16 }}>avito.ge</Text>
        </View>
        <Pressable style={{
          paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6,
          backgroundColor: C.primary,
        }}>
          <Text style={{ color: '#fff', fontWeight: '600', fontSize: 12 }}>Войти</Text>
        </Pressable>
      </View>

      {menuOpen && (
        <View style={{
          backgroundColor: C.white, borderBottomWidth: 1, borderBottomColor: C.border,
          paddingVertical: 8,
        }}>
          {[
            { icon: 'home', label: 'Главная' },
            { icon: 'search', label: 'Поиск' },
            { icon: 'list', label: 'Объявления' },
            { icon: 'plus-circle', label: 'Подать объявление' },
            { icon: 'info', label: 'О нас' },
            { icon: 'help-circle', label: 'Помощь' },
          ].map((item) => (
            <Pressable key={item.label} style={{
              flexDirection: 'row', alignItems: 'center', gap: 12,
              paddingHorizontal: 16, paddingVertical: 12,
            }}>
              <Feather name={item.icon as any} size={18} color={C.primary} />
              <Text style={{ fontSize: 15, color: C.text, fontWeight: '500' }}>{item.label}</Text>
            </Pressable>
          ))}
        </View>
      )}

      <ScrollView contentContainerStyle={{ padding: 16, gap: 20 }}>
        {/* Hero mobile */}
        <View style={{ alignItems: 'center', paddingTop: 20 }}>
          <Text style={{ fontSize: 24, fontWeight: '800', color: C.text, textAlign: 'center', marginBottom: 8 }}>
            Купля-продажа в Грузии
          </Text>
          <Text style={{ fontSize: 14, color: C.muted, textAlign: 'center', marginBottom: 20, lineHeight: 20 }}>
            Тысячи объявлений по всей Грузии
          </Text>
          <Pressable style={{
            backgroundColor: C.primary, borderRadius: 8,
            paddingHorizontal: 28, paddingVertical: 14, width: '100%',
          }}>
            <Text style={{ color: '#fff', fontWeight: '700', fontSize: 16, textAlign: 'center' }}>
              Начать пользоваться
            </Text>
          </Pressable>
        </View>

        {/* Mobile categories */}
        <View>
          <Text style={{ fontSize: 17, fontWeight: '700', color: C.text, marginBottom: 12 }}>Категории</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {mockCategories.map((cat) => (
              <View key={cat} style={{
                width: 72, alignItems: 'center', marginRight: 12,
              }}>
                <View style={{
                  width: 52, height: 52, borderRadius: 10, backgroundColor: C.primaryBg,
                  alignItems: 'center', justifyContent: 'center', marginBottom: 4,
                }}>
                  <Feather name={(mockCategoryIcons[cat] || 'grid') as any} size={22} color={C.primary} />
                </View>
                <Text style={{ fontSize: 11, color: C.text, textAlign: 'center' }} numberOfLines={2}>{cat}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Mobile listings */}
        <View>
          <Text style={{ fontSize: 17, fontWeight: '700', color: C.text, marginBottom: 12 }}>Свежие объявления</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
            {mockListings.filter(l => l.status === 'active').slice(0, 4).map((l, idx) => (
              <View key={l.id} style={{ width: '48%' }}>
                <ListingCard
                  title={l.title}
                  price={l.price}
                  currency={l.currency}
                  city={l.city}
                  seed={`mobile-listing-${idx}`}
                />
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

// ─── MAIN EXPORT ────────────────────────────────────────────────────────────
export default function LandingStates() {
  const [loginPressed, setLoginPressed] = useState(false);

  return (
    <View>
      {/* DEFAULT — Full landing page with hero, search, categories, listings, features, footer */}
      <StateSection title="DEFAULT">
        <DefaultState onLogin={() => setLoginPressed(true)} />
      </StateSection>

      {/* MOBILE — Mobile-first landing with hamburger menu */}
      <StateSection title="MOBILE">
        <MobileHeaderState />
      </StateSection>
    </View>
  );
}
