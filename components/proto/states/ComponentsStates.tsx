import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  Image,
  useWindowDimensions,
  ActivityIndicator,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { StateSection } from '../StateSection';

// ─── Design Tokens (aligned with BrandStates) ───────────────────────────────
const C = {
  green:   '#00AA6C',
  greenBg: '#E8F9F2',
  white:   '#FFFFFF',
  page:    '#FFFFFF',
  text:    '#1A1A1A',
  muted:   '#737373',
  border:  '#E0E0E0',
  error:   '#D32F2F',
};

const R = { xs: 2, sm: 4, md: 8, lg: 12, xl: 16, full: 9999 };

// ─── Helpers ─────────────────────────────────────────────────────────────────
function SectionHeading({ number, title }: { number: string; title: string }) {
  return (
    <View style={{ marginBottom: 20 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 }}>
        <View style={{
          width: 28, height: 28, borderRadius: R.full,
          backgroundColor: C.green,
          alignItems: 'center', justifyContent: 'center',
        }}>
          <Text style={{ color: '#fff', fontSize: 12, fontWeight: '700' }}>{number}</Text>
        </View>
        <Text style={{ fontSize: 18, fontWeight: '700', color: C.text, letterSpacing: -0.3 }}>
          {title}
        </Text>
      </View>
      <View style={{ height: 1, backgroundColor: C.border }} />
    </View>
  );
}

function Card({ children, style }: { children: React.ReactNode; style?: any }) {
  return (
    <View style={[{
      backgroundColor: C.white,
      borderRadius: R.lg,
      padding: 20,
      borderWidth: 1,
      borderColor: C.border,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 8,
      elevation: 3,
    }, style]}>
      {children}
    </View>
  );
}

function SubLabel({ text }: { text: string }) {
  return (
    <Text style={{
      fontSize: 11, fontWeight: '600', color: C.muted,
      letterSpacing: 1, textTransform: 'uppercase', marginBottom: 10,
    }}>
      {text}
    </Text>
  );
}

// ─── 1. Navigation ───────────────────────────────────────────────────────────
function NavigationSection() {
  const [activeTab, setActiveTab] = useState('home');
  const tabs = [
    { key: 'home', icon: 'home' as const, label: 'Home' },
    { key: 'listings', icon: 'grid' as const, label: 'Listings' },
    { key: 'chat', icon: 'message-circle' as const, label: 'Chat' },
    { key: 'profile', icon: 'user' as const, label: 'Profile' },
  ];

  return (
    <View>
      <SectionHeading number="01" title="Navigation" />
      <Card style={{ gap: 16 }}>
        {/* Header */}
        <SubLabel text="Header bar" />
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: C.white,
          borderWidth: 1,
          borderColor: C.border,
          borderRadius: R.md,
          paddingHorizontal: 16,
          paddingVertical: 10,
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <View style={{
              width: 32, height: 32, backgroundColor: C.green,
              borderRadius: R.md, alignItems: 'center', justifyContent: 'center',
            }}>
              <Text style={{ color: '#fff', fontWeight: '800', fontSize: 16 }}>A</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 1 }}>
              <Text style={{ fontWeight: '700', color: C.text, fontSize: 16 }}>avito</Text>
              <Text style={{ fontWeight: '600', color: C.green, fontSize: 12 }}>.ge</Text>
            </View>
          </View>
          <View style={{ flexDirection: 'row', gap: 16, alignItems: 'center' }}>
            <Feather name="search" size={20} color={C.text} />
            <Feather name="bell" size={20} color={C.text} />
            <View style={{
              backgroundColor: C.green, borderRadius: R.sm,
              paddingHorizontal: 14, paddingVertical: 7,
            }}>
              <Text style={{ color: '#fff', fontWeight: '700', fontSize: 13 }}>Post ad</Text>
            </View>
          </View>
        </View>

        <View style={{ height: 1, backgroundColor: C.border }} />

        {/* Bottom Tab Bar */}
        <SubLabel text={`Bottom tab bar (active: ${activeTab})`} />
        <View style={{
          flexDirection: 'row',
          backgroundColor: C.white,
          borderWidth: 1,
          borderColor: C.border,
          borderRadius: R.lg,
          paddingVertical: 8,
        }}>
          {tabs.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <Pressable
                key={tab.key}
                style={{ flex: 1, alignItems: 'center', gap: 3 }}
                onPress={() => setActiveTab(tab.key)}
              >
                <Feather
                  name={tab.icon}
                  size={22}
                  color={isActive ? C.green : C.muted}
                />
                <Text style={{
                  fontSize: 10,
                  fontWeight: isActive ? '700' : '500',
                  color: isActive ? C.green : C.muted,
                }}>
                  {tab.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </Card>
    </View>
  );
}

// ─── 2. Inputs ───────────────────────────────────────────────────────────────
function InputsSection() {
  const [search, setSearch] = useState('');
  const [city, setCity] = useState('');
  const [phone, setPhone] = useState('not-valid');

  return (
    <View>
      <SectionHeading number="02" title="Inputs" />
      <Card style={{ gap: 20 }}>
        {/* Search bar */}
        <View>
          <SubLabel text="Search bar" />
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: C.white,
            borderWidth: 1.5,
            borderColor: C.green,
            borderRadius: R.md,
            paddingLeft: 12,
            overflow: 'hidden',
          }}>
            <Feather name="search" size={18} color={C.muted} />
            <TextInput
              style={{ flex: 1, fontSize: 16, color: C.text, paddingVertical: 12, paddingHorizontal: 10 }}
              placeholder="Search listings..."
              placeholderTextColor={C.muted}
              value={search}
              onChangeText={setSearch}
            />
            <View style={{ backgroundColor: C.green, paddingHorizontal: 18, paddingVertical: 12 }}>
              <Text style={{ color: '#fff', fontWeight: '600', fontSize: 14 }}>Search</Text>
            </View>
          </View>
        </View>

        {/* Default text input */}
        <View>
          <SubLabel text="Default input" />
          <Text style={{ fontSize: 14, fontWeight: '500', color: C.text, marginBottom: 6 }}>City</Text>
          <View style={{
            borderWidth: 1, borderColor: C.border, borderRadius: R.sm,
            backgroundColor: C.white, flexDirection: 'row',
            alignItems: 'center', paddingHorizontal: 12,
          }}>
            <Feather name="map-pin" size={15} color={C.muted} />
            <TextInput
              style={{ flex: 1, fontSize: 16, color: C.text, paddingVertical: 11, paddingLeft: 8 }}
              placeholder="e.g. Batumi"
              placeholderTextColor={C.muted}
              value={city}
              onChangeText={setCity}
            />
          </View>
        </View>

        {/* Filled input */}
        <View>
          <SubLabel text="Filled (focused)" />
          <Text style={{ fontSize: 14, fontWeight: '500', color: C.text, marginBottom: 6 }}>Price</Text>
          <View style={{
            borderWidth: 2, borderColor: C.green, borderRadius: R.sm,
            backgroundColor: C.white, flexDirection: 'row',
            alignItems: 'center', paddingHorizontal: 12,
          }}>
            <Feather name="tag" size={15} color={C.green} />
            <TextInput
              style={{ flex: 1, fontSize: 16, color: C.text, paddingVertical: 11, paddingLeft: 8 }}
              value="85 000"
              editable={false}
            />
            <Text style={{ fontSize: 14, color: C.muted }}>$</Text>
          </View>
        </View>

        {/* Error input */}
        <View>
          <SubLabel text="Error state" />
          <Text style={{ fontSize: 14, fontWeight: '500', color: C.text, marginBottom: 6 }}>Phone</Text>
          <View style={{
            borderWidth: 1.5, borderColor: C.error, borderRadius: R.sm,
            backgroundColor: '#FFEBEE', flexDirection: 'row',
            alignItems: 'center', paddingHorizontal: 12,
          }}>
            <Feather name="phone" size={15} color={C.error} />
            <TextInput
              style={{ flex: 1, fontSize: 16, color: C.text, paddingVertical: 11, paddingLeft: 8 }}
              value={phone}
              onChangeText={setPhone}
            />
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 }}>
            <Feather name="alert-circle" size={12} color={C.error} />
            <Text style={{ fontSize: 12, color: C.error }}>Invalid phone number</Text>
          </View>
        </View>
      </Card>
    </View>
  );
}

// ─── 3. Buttons ──────────────────────────────────────────────────────────────
function ButtonsSection() {
  const [loading, setLoading] = useState<string | null>(null);

  const handlePress = (name: string) => {
    setLoading(name);
    setTimeout(() => setLoading(null), 1500);
  };

  return (
    <View>
      <SectionHeading number="03" title="Buttons" />
      <Card style={{ gap: 16 }}>
        <SubLabel text="Tap any button to see loading state" />
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
          {/* Primary */}
          <Pressable
            onPress={() => handlePress('primary')}
            style={{
              backgroundColor: C.green,
              borderRadius: R.md,
              paddingHorizontal: 24,
              paddingVertical: 13,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
              opacity: loading === 'primary' ? 0.7 : 1,
            }}
          >
            {loading === 'primary'
              ? <ActivityIndicator size="small" color="#fff" />
              : <Feather name="plus" size={16} color="#fff" />
            }
            <Text style={{ color: '#fff', fontWeight: '700', fontSize: 15 }}>
              {loading === 'primary' ? 'Loading...' : 'Primary'}
            </Text>
          </Pressable>

          {/* Secondary */}
          <Pressable
            onPress={() => handlePress('secondary')}
            style={{
              backgroundColor: C.white,
              borderRadius: R.md,
              paddingHorizontal: 24,
              paddingVertical: 12,
              borderWidth: 1.5,
              borderColor: C.green,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
              opacity: loading === 'secondary' ? 0.7 : 1,
            }}
          >
            {loading === 'secondary'
              ? <ActivityIndicator size="small" color={C.green} />
              : <Feather name="message-circle" size={16} color={C.green} />
            }
            <Text style={{ color: C.green, fontWeight: '700', fontSize: 15 }}>
              {loading === 'secondary' ? 'Loading...' : 'Secondary'}
            </Text>
          </Pressable>

          {/* Ghost */}
          <Pressable
            onPress={() => handlePress('ghost')}
            style={{
              backgroundColor: 'transparent',
              borderRadius: R.md,
              paddingHorizontal: 24,
              paddingVertical: 13,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <Feather name="share-2" size={16} color={C.muted} />
            <Text style={{ color: C.muted, fontWeight: '600', fontSize: 15 }}>Ghost</Text>
          </Pressable>

          {/* Destructive */}
          <Pressable
            onPress={() => handlePress('destructive')}
            style={{
              backgroundColor: '#FFEBEE',
              borderRadius: R.md,
              paddingHorizontal: 24,
              paddingVertical: 13,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
              opacity: loading === 'destructive' ? 0.7 : 1,
            }}
          >
            {loading === 'destructive'
              ? <ActivityIndicator size="small" color={C.error} />
              : <Feather name="trash-2" size={16} color={C.error} />
            }
            <Text style={{ color: C.error, fontWeight: '700', fontSize: 15 }}>
              {loading === 'destructive' ? 'Deleting...' : 'Destructive'}
            </Text>
          </Pressable>
        </View>
      </Card>
    </View>
  );
}

// ─── 4. Listing Card ─────────────────────────────────────────────────────────
function CardsSection({ isDesktop }: { isDesktop: boolean }) {
  const [saved, setSaved] = useState<Record<string, boolean>>({});

  const listings = [
    {
      id: '1',
      seed: 'apt-batumi',
      price: '$85,000',
      title: '3-room apartment, Batumi center, sea view',
      location: 'Batumi, Adjara',
      time: '2h ago',
      badge: { label: 'Premium', bg: C.greenBg, color: C.green },
    },
    {
      id: '2',
      seed: 'car-camry',
      price: '$12,500',
      title: 'Toyota Camry 2019, 45,000 km, automatic',
      location: 'Tbilisi, Vake',
      time: '5h ago',
      badge: { label: 'Top', bg: '#FFF3E0', color: '#E65100' },
    },
    {
      id: '3',
      seed: 'sofa-corner',
      price: '350 GEL',
      title: 'Corner sofa, beige, good condition, 2.4m',
      location: 'Kutaisi',
      time: '1d ago',
      badge: { label: 'Urgent', bg: '#FFEBEE', color: C.error },
    },
  ];

  return (
    <View>
      <SectionHeading number="04" title="Cards" />
      <View style={{
        flexDirection: isDesktop ? 'row' : 'column',
        gap: 16,
        flexWrap: 'wrap',
      }}>
        {listings.map((item) => (
          <Card key={item.id} style={{ flex: 1, minWidth: 240, padding: 0, overflow: 'hidden' }}>
            <View style={{ position: 'relative' }}>
              <Image
                source={{ uri: `https://picsum.photos/seed/${item.seed}/600/380` }}
                style={{ width: '100%', height: 160 }}
                resizeMode="cover"
              />
              {/* Badge */}
              <View style={{
                position: 'absolute', top: 8, left: 8,
                backgroundColor: item.badge.bg,
                borderRadius: R.sm,
                paddingHorizontal: 8, paddingVertical: 3,
              }}>
                <Text style={{ fontSize: 11, fontWeight: '700', color: item.badge.color }}>
                  {item.badge.label}
                </Text>
              </View>
              {/* Save button */}
              <Pressable
                onPress={() => setSaved((prev) => ({ ...prev, [item.id]: !prev[item.id] }))}
                style={{
                  position: 'absolute', top: 8, right: 8,
                  backgroundColor: 'rgba(255,255,255,0.9)',
                  borderRadius: R.full, width: 32, height: 32,
                  alignItems: 'center', justifyContent: 'center',
                }}
              >
                <Feather name="heart" size={15} color={saved[item.id] ? C.error : C.muted} />
              </Pressable>
            </View>

            <View style={{ padding: 12 }}>
              <Text style={{ fontSize: 20, fontWeight: '700', color: C.text, marginBottom: 2 }}>
                {item.price}
              </Text>
              <Text style={{ fontSize: 14, color: C.text, marginBottom: 8, lineHeight: 20 }} numberOfLines={2}>
                {item.title}
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <Feather name="map-pin" size={12} color={C.muted} />
                  <Text style={{ fontSize: 12, color: C.muted }}>{item.location}</Text>
                </View>
                <Text style={{ fontSize: 12, color: C.muted }}>{item.time}</Text>
              </View>
            </View>
          </Card>
        ))}
      </View>
    </View>
  );
}

// ─── 5. Lists ────────────────────────────────────────────────────────────────
function ListsSection() {
  const items = [
    { name: 'Giorgi Beridze', detail: 'Tbilisi -- 12 active listings', rating: '4.8', seed: 'seller1' },
    { name: 'Nino Kapanadze', detail: 'Batumi -- 8 active listings', rating: '4.6', seed: 'seller2' },
    { name: 'Lasha Megrelidze', detail: 'Kutaisi -- 5 active listings', rating: '4.9', seed: 'seller3' },
  ];

  return (
    <View>
      <SectionHeading number="05" title="Lists" />
      <Card style={{ padding: 0, overflow: 'hidden' }}>
        {items.map((item, idx) => (
          <View key={item.name}>
            <Pressable style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 12,
              padding: 16,
            }}>
              <Image
                source={{ uri: `https://picsum.photos/seed/${item.seed}/80/80` }}
                style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: C.border }}
              />
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 15, fontWeight: '600', color: C.text }}>{item.name}</Text>
                <Text style={{ fontSize: 13, color: C.muted, marginTop: 1 }}>{item.detail}</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Feather name="star" size={13} color="#F59E0B" />
                <Text style={{ fontSize: 13, fontWeight: '700', color: C.text }}>{item.rating}</Text>
              </View>
              <Feather name="chevron-right" size={18} color={C.muted} />
            </Pressable>
            {idx < items.length - 1 && (
              <View style={{ height: 1, backgroundColor: C.border, marginLeft: 72 }} />
            )}
          </View>
        ))}
      </Card>
    </View>
  );
}

// ─── 6. Empty State ──────────────────────────────────────────────────────────
function EmptyStateSection() {
  return (
    <View>
      <SectionHeading number="06" title="Empty States" />
      <Card style={{ alignItems: 'center', paddingVertical: 40 }}>
        <View style={{
          width: 72, height: 72,
          borderRadius: R.full,
          backgroundColor: C.greenBg,
          alignItems: 'center', justifyContent: 'center',
          marginBottom: 20,
        }}>
          <Feather name="inbox" size={32} color={C.green} />
        </View>
        <Text style={{ fontSize: 18, fontWeight: '700', color: C.text, marginBottom: 6 }}>
          No listings yet
        </Text>
        <Text style={{
          fontSize: 14, color: C.muted, textAlign: 'center',
          maxWidth: 280, lineHeight: 20, marginBottom: 20,
        }}>
          You have not posted any listings. Start selling by creating your first ad.
        </Text>
        <Pressable style={{
          backgroundColor: C.green,
          borderRadius: R.md,
          paddingHorizontal: 24,
          paddingVertical: 13,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
        }}>
          <Feather name="plus" size={16} color="#fff" />
          <Text style={{ color: '#fff', fontWeight: '700', fontSize: 15 }}>Create listing</Text>
        </Pressable>
      </Card>
    </View>
  );
}

// ─── 7. Alerts / Banners ─────────────────────────────────────────────────────
function AlertsSection() {
  const alerts = [
    {
      type: 'success',
      icon: 'check-circle' as const,
      bg: C.greenBg,
      color: C.green,
      text: 'Listing published successfully! It is now visible to buyers.',
    },
    {
      type: 'error',
      icon: 'alert-circle' as const,
      bg: '#FFEBEE',
      color: C.error,
      text: 'Failed to upload photos. Please check file size (max 5MB) and try again.',
    },
    {
      type: 'warning',
      icon: 'alert-triangle' as const,
      bg: '#FFF3E0',
      color: '#E65100',
      text: 'Your listing expires in 3 days. Renew to keep it active.',
    },
    {
      type: 'info',
      icon: 'info' as const,
      bg: '#E3F2FD',
      color: '#1565C0',
      text: 'Your listing is under review. It will be published within 24 hours.',
    },
  ];

  return (
    <View>
      <SectionHeading number="07" title="Alerts / Banners" />
      <View style={{ gap: 12 }}>
        {alerts.map((alert) => (
          <Card key={alert.type} style={{
            padding: 14,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
            borderLeftWidth: 3,
            borderLeftColor: alert.color,
            backgroundColor: alert.bg,
          }}>
            <Feather name={alert.icon} size={18} color={alert.color} />
            <Text style={{ flex: 1, fontSize: 14, fontWeight: '500', color: alert.color, lineHeight: 20 }}>
              {alert.text}
            </Text>
          </Card>
        ))}
      </View>
    </View>
  );
}

// ─── Main Export ─────────────────────────────────────────────────────────────
export default function ComponentsStates() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 900;
  const containerStyle = isDesktop
    ? { maxWidth: 960, alignSelf: 'center' as const, width: '100%' as const, paddingHorizontal: 48 }
    : {};

  return (
    <StateSection title="SHOWCASE">
      <ScrollView
        style={[{ minHeight: 844 }, containerStyle]}
        contentContainerStyle={{ padding: isDesktop ? 32 : 16, gap: 40, backgroundColor: C.page }}
        showsVerticalScrollIndicator={false}
      >
        {/* Page Header */}
        <View>
          <Text style={{ fontSize: 24, fontWeight: '700', color: C.text, marginBottom: 4 }}>
            UI Components
          </Text>
          <Text style={{ fontSize: 14, color: C.muted }}>
            Interactive showcase of all reusable components -- Avito Georgia
          </Text>
        </View>

        <NavigationSection />
        <InputsSection />
        <ButtonsSection />
        <CardsSection isDesktop={isDesktop} />
        <ListsSection />
        <EmptyStateSection />
        <AlertsSection />

        <View style={{ height: 40 }} />
      </ScrollView>
    </StateSection>
  );
}
