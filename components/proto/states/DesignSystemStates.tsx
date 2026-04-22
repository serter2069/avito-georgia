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
import { StateSection } from '../StateSection';

// Core Design Tokens
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

// Helpers

function AvitoLogo({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' | 'xl' }) {
  const scale = size === 'sm' ? 0.6 : size === 'lg' ? 1.5 : size === 'xl' ? 2.2 : 1;
  const iconSize = Math.round(40 * scale);
  const iconRadius = Math.round(10 * scale);
  const textSize = Math.round(22 * scale);

  return (
    <View className="flex-row items-center" style={{ gap: Math.round(10 * scale) }}>
      <View
        className="items-center justify-center bg-[#00AA6C]"
        style={{ width: iconSize, height: iconSize, borderRadius: iconRadius }}
      >
        <Text
          className="text-white font-extrabold"
          style={{ fontSize: Math.round(20 * scale), letterSpacing: -0.5, lineHeight: Math.round(24 * scale) }}
        >
          A
        </Text>
      </View>
      <View className="flex-row items-baseline" style={{ gap: 1 }}>
        <Text className="font-bold text-[#1A1A1A]" style={{ fontSize: textSize, letterSpacing: -0.3 }}>
          avito
        </Text>
        <Text className="font-semibold text-[#00AA6C]" style={{ fontSize: Math.round(textSize * 0.72) }}>
          .ge
        </Text>
      </View>
    </View>
  );
}

function SectionHeading({ number, title }: { number: string; title: string }) {
  return (
    <View className="mb-5">
      <View className="flex-row items-center mb-3" style={{ gap: 10 }}>
        <View className="w-7 h-7 rounded-full bg-[#00AA6C] items-center justify-center">
          <Text className="text-white text-xs font-bold">{number}</Text>
        </View>
        <Text className="text-lg font-bold text-[#1A1A1A]" style={{ letterSpacing: -0.3 }}>
          {title}
        </Text>
      </View>
      <View className="h-px bg-[#E0E0E0]" />
    </View>
  );
}

function Card({ children, className: cn, style }: { children: React.ReactNode; className?: string; style?: any }) {
  return (
    <View
      className={`bg-white rounded-lg p-6 border border-[#E0E0E0] ${cn ?? ''}`}
      style={[{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 3,
      }, style]}
    >
      {children}
    </View>
  );
}

function SubLabel({ text }: { text: string }) {
  return (
    <Text className="text-[11px] font-semibold text-[#737373] uppercase tracking-wider mb-2.5">
      {text}
    </Text>
  );
}

// BRAND SECTIONS

function HeroSection({ isDesktop }: { isDesktop: boolean }) {
  return (
    <View
      className="bg-white rounded-xl overflow-hidden border border-[#E0E0E0]"
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 16,
        elevation: 4,
      }}
    >
      <View className="h-1 bg-[#00AA6C]" />
      <View className="items-center" style={{ padding: isDesktop ? 48 : 28, gap: 20 }}>
        <AvitoLogo size="xl" />
        <Text
          className="font-light text-[#1A1A1A] text-center mt-2"
          style={{ fontSize: isDesktop ? 28 : 22, letterSpacing: -0.5 }}
        >
          Georgia's #1 Classifieds
        </Text>
        <View className="flex-row items-center bg-[#E8F9F2] rounded-full px-4 py-2" style={{ gap: 8 }}>
          <Text className="text-[13px] font-semibold text-[#00AA6C]">
            ✓ Design System v1.0
          </Text>
        </View>
      </View>
    </View>
  );
}

function ColorSystemSection({ isDesktop }: { isDesktop: boolean }) {
  const colors = [
    { color: C.green,   name: 'Green',     hex: '#00AA6C', usage: 'CTA, prices, links' },
    { color: C.greenBg, name: 'Green BG',  hex: '#E8F9F2', usage: 'Tinted surfaces', light: true },
    { color: C.white,   name: 'White',     hex: '#FFFFFF', usage: 'Cards, modals, inputs', light: true },
    { color: C.page,    name: 'Page',      hex: '#FFFFFF', usage: 'App background', light: true },
    { color: C.text,    name: 'Text',      hex: '#1A1A1A', usage: 'Headlines, content' },
    { color: C.muted,   name: 'Muted',     hex: '#737373', usage: 'Meta, secondary' },
    { color: C.border,  name: 'Border',    hex: '#E0E0E0', usage: 'Dividers, lines', light: true },
    { color: C.error,   name: 'Error',     hex: '#D32F2F', usage: 'Urgent, errors' },
  ];

  return (
    <View>
      <SectionHeading number="01" title="COLOR SYSTEM" />
      <Card>
        <View className="flex-row flex-wrap" style={{ gap: isDesktop ? 16 : 12 }}>
          {colors.map(({ color, name, hex, usage, light }) => (
            <View key={name} style={{ width: isDesktop ? '22%' as any : '46%' as any, minWidth: isDesktop ? 180 : 140, flex: 1 }}>
              <View
                className="rounded-md mb-2.5"
                style={{ height: 72, backgroundColor: color, borderWidth: light ? 1 : 0, borderColor: C.border }}
              />
              <Text className="text-sm font-bold text-[#1A1A1A]">{name}</Text>
              <Text className="text-xs text-[#737373] font-mono mt-0.5">{hex}</Text>
              <Text className="text-[11px] text-[#737373] mt-0.5">{usage}</Text>
            </View>
          ))}
        </View>
      </Card>
    </View>
  );
}

function TypographySection() {
  const items = [
    { label: 'Display', size: 32, weight: '800' as const, lh: 38, example: 'Find Anything in Georgia', spec: '32px / ExtraBold 800 / lh 38', color: C.text },
    { label: 'H1', size: 24, weight: '700' as const, lh: 30, example: '3-Room Apartment, Batumi Center', spec: '24px / Bold 700 / lh 30', color: C.text },
    { label: 'H2', size: 18, weight: '600' as const, lh: 24, example: 'Popular Categories in Tbilisi', spec: '18px / SemiBold 600 / lh 24', color: C.text },
    { label: 'Body', size: 16, weight: '400' as const, lh: 24, example: 'Fully furnished 3-room apartment in the heart of Batumi. 5 min walk to beach. Modern renovation, panoramic sea view.', spec: '16px / Regular 400 / lh 24', color: C.text },
    { label: 'Caption', size: 12, weight: '400' as const, lh: 16, example: 'Batumi, Adjara  --  3h ago  --  1,248 views', spec: '12px / Regular 400 / lh 16', color: C.muted },
  ];

  return (
    <View>
      <SectionHeading number="02" title="TYPOGRAPHY" />
      <Card style={{ gap: 0 }}>
        {items.map((item, idx, arr) => (
          <View key={item.label}>
            <View className="py-5">
              <View className="flex-row items-center mb-2" style={{ gap: 10 }}>
                <View className="bg-[#E8F9F2] rounded-sm px-2 py-0.5">
                  <Text className="text-[11px] font-bold text-[#00AA6C]">{item.label}</Text>
                </View>
                <Text className="text-[11px] text-[#737373] font-mono">{item.spec}</Text>
              </View>
              <Text style={{ fontSize: item.size, fontWeight: item.weight, lineHeight: item.lh, color: item.color }}>
                {item.example}
              </Text>
            </View>
            {idx < arr.length - 1 && <View className="h-px bg-[#E0E0E0]" />}
          </View>
        ))}
      </Card>
    </View>
  );
}

function UIPrimitivesSection() {
  return (
    <View>
      <SectionHeading number="03" title="UI PRIMITIVES" />

      {/* Buttons */}
      <Card className="mb-4">
        <SubLabel text="Buttons" />
        <View className="flex-row flex-wrap items-center" style={{ gap: 12 }}>
          <View className="bg-[#00AA6C] rounded-md px-6 py-3 flex-row items-center" style={{ gap: 8 }}>
            <Text className="text-white font-bold text-[15px]">+ Primary</Text>
          </View>
          <View className="bg-white rounded-md px-6 py-3 border-[1.5px] border-[#00AA6C] flex-row items-center" style={{ gap: 8 }}>
            <Text className="text-[#00AA6C] font-bold text-[15px]">Secondary</Text>
          </View>
          <View className="rounded-md px-6 py-3 flex-row items-center" style={{ gap: 8 }}>
            <Text className="text-[#737373] font-semibold text-[15px]">Ghost</Text>
          </View>
          <View className="bg-[#FFEBEE] rounded-md px-6 py-3 flex-row items-center" style={{ gap: 8 }}>
            <Text className="text-[#D32F2F] font-bold text-[15px]">Destructive</Text>
          </View>
        </View>
      </Card>

      {/* Badges */}
      <Card className="mb-4">
        <SubLabel text="Badges" />
        <View className="flex-row flex-wrap" style={{ gap: 10 }}>
          {[
            { label: 'New',      bg: '#E3F2FD', color: '#1565C0' },
            { label: 'Premium',  bg: C.greenBg, color: C.green },
            { label: 'Top',      bg: '#FFF3E0', color: '#E65100' },
            { label: 'Sold',     bg: C.border,  color: C.muted },
            { label: 'Urgent',   bg: '#FFEBEE', color: C.error },
            { label: 'Verified', bg: C.greenBg, color: C.green },
          ].map((b) => (
            <View key={b.label} className="rounded-full px-3.5 py-1" style={{ backgroundColor: b.bg }}>
              <Text className="text-xs font-bold" style={{ color: b.color }}>{b.label}</Text>
            </View>
          ))}
        </View>
      </Card>

      {/* Status Chips */}
      <Card>
        <SubLabel text="Status Chips" />
        <View className="flex-row flex-wrap" style={{ gap: 10 }}>
          {[
            { label: 'Active',   symbol: '\u2713', bg: C.greenBg, color: C.green },
            { label: 'Pending',  symbol: '\u25CB', bg: '#FFF3E0', color: '#E65100' },
            { label: 'Rejected', symbol: '\u00D7', bg: '#FFEBEE', color: C.error },
            { label: 'Archived', symbol: '\u2014', bg: '#F4F4F4', color: C.muted },
          ].map((chip) => (
            <View
              key={chip.label}
              className="rounded-md px-3.5 py-2 flex-row items-center"
              style={{ backgroundColor: chip.bg, gap: 6 }}
            >
              <Text className="text-[13px] font-bold" style={{ color: chip.color }}>{chip.symbol}</Text>
              <Text className="text-[13px] font-semibold" style={{ color: chip.color }}>{chip.label}</Text>
            </View>
          ))}
        </View>
      </Card>
    </View>
  );
}

function SpacingRadiusSection() {
  const spacings = [4, 8, 12, 16, 24, 32];
  const radii = [
    { label: 'xs', value: 2 },
    { label: 'sm', value: 4 },
    { label: 'md', value: 8 },
    { label: 'lg', value: 12 },
    { label: 'xl', value: 16 },
    { label: 'full', value: 9999 },
  ];

  return (
    <View>
      <SectionHeading number="04" title="SPACING & RADIUS" />

      <Card className="mb-4">
        <SubLabel text="Spacing Scale" />
        <View style={{ gap: 12 }}>
          {spacings.map((px) => (
            <View key={px} className="flex-row items-center" style={{ gap: 16 }}>
              <Text className="text-xs font-semibold text-[#737373] font-mono text-right" style={{ width: 40 }}>
                {px}px
              </Text>
              <View
                className="rounded-sm border border-[#00AA6C] bg-[#E8F9F2] opacity-70"
                style={{ width: px * 4, height: 24 }}
              />
            </View>
          ))}
        </View>
      </Card>

      <Card>
        <SubLabel text="Border Radius" />
        <View className="flex-row flex-wrap" style={{ gap: 16 }}>
          {radii.map((r) => (
            <View key={r.label} className="items-center" style={{ gap: 8 }}>
              <View
                className="w-14 h-14 bg-[#E8F9F2] border-2 border-[#00AA6C]"
                style={{ borderRadius: Math.min(r.value, 28) }}
              />
              <Text className="text-xs font-bold text-[#1A1A1A]">{r.label}</Text>
              <Text className="text-[10px] text-[#737373] font-mono">
                {r.value === 9999 ? '9999' : `${r.value}px`}
              </Text>
            </View>
          ))}
        </View>
      </Card>
    </View>
  );
}

// COMPONENT SECTIONS

function NavigationSection() {
  const [activeTab, setActiveTab] = useState('home');
  const tabs = [
    { key: 'home', label: 'Home' },
    { key: 'listings', label: 'Listings' },
    { key: 'chat', label: 'Chat' },
    { key: 'profile', label: 'Profile' },
  ];

  return (
    <View>
      <SectionHeading number="05" title="NAVIGATION" />
      <Card style={{ gap: 16 }}>
        <SubLabel text="Header bar" />
        <View className="flex-row items-center justify-between bg-white border border-[#E0E0E0] rounded-md px-4 py-2.5">
          <View className="flex-row items-center" style={{ gap: 8 }}>
            <View className="w-8 h-8 bg-[#00AA6C] rounded-md items-center justify-center">
              <Text className="text-white font-extrabold text-base">A</Text>
            </View>
            <View className="flex-row items-baseline" style={{ gap: 1 }}>
              <Text className="font-bold text-[#1A1A1A] text-base">avito</Text>
              <Text className="font-semibold text-[#00AA6C] text-xs">.ge</Text>
            </View>
          </View>
          <View className="flex-row items-center" style={{ gap: 16 }}>
            <Text className="text-base text-[#1A1A1A]">Search</Text>
            <Text className="text-base text-[#1A1A1A]">Bell</Text>
            <View className="bg-[#00AA6C] rounded-sm px-3.5 py-1.5">
              <Text className="text-white font-bold text-[13px]">Post ad</Text>
            </View>
          </View>
        </View>

        <View className="h-px bg-[#E0E0E0]" />

        <SubLabel text={`Bottom tab bar (active: ${activeTab})`} />
        <View className="flex-row bg-white border border-[#E0E0E0] rounded-lg py-2">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <Pressable
                key={tab.key}
                className="flex-1 items-center"
                style={{ gap: 3 }}
                onPress={() => setActiveTab(tab.key)}
              >
                <Text
                  className="text-[10px]"
                  style={{ fontWeight: isActive ? '700' : '500', color: isActive ? C.green : C.muted }}
                >
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

function InputsSection() {
  const [search, setSearch] = useState('');
  const [city, setCity] = useState('');
  const [phone, setPhone] = useState('not-valid');

  return (
    <View>
      <SectionHeading number="06" title="INPUTS" />
      <Card style={{ gap: 20 }}>
        <View>
          <SubLabel text="Search bar" />
          <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderWidth: 1.5, borderColor: '#00AA6C', borderRadius: 6, paddingLeft: 12, overflow: 'hidden' }}>
            <TextInput
              placeholder="Search listings..."
              placeholderTextColor={C.muted}
              value={search}
              onChangeText={setSearch}
              style={{ flex: 1, fontSize: 16, color: '#1A1A1A', paddingVertical: 12, paddingHorizontal: 10, borderWidth: 0, backgroundColor: 'transparent', outlineWidth: 0 } as any}
            />
            <View className="bg-[#00AA6C] px-4 py-3">
              <Text className="text-white font-semibold text-sm">Search</Text>
            </View>
          </View>
        </View>

        <View>
          <SubLabel text="Default input" />
          <Text className="text-sm font-medium text-[#1A1A1A] mb-1.5">City</Text>
          <View style={{ borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 2, backgroundColor: '#FFFFFF' }}>
            <TextInput
              placeholder="e.g. Batumi"
              placeholderTextColor={C.muted}
              value={city}
              onChangeText={setCity}
              style={{ flex: 1, fontSize: 16, color: '#1A1A1A', paddingVertical: 10, paddingHorizontal: 12, borderWidth: 0, backgroundColor: 'transparent', outlineWidth: 0 } as any}
            />
          </View>
        </View>

        <View>
          <SubLabel text="Filled (focused)" />
          <Text className="text-sm font-medium text-[#1A1A1A] mb-1.5">Price</Text>
          <View style={{ borderWidth: 2, borderColor: '#00AA6C', borderRadius: 2, backgroundColor: '#FFFFFF', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12 }}>
            <TextInput
              value="85 000"
              style={{ flex: 1, fontSize: 16, color: '#1A1A1A', paddingVertical: 10, borderWidth: 0, backgroundColor: 'transparent', outlineWidth: 0 } as any}
            />
            <Text className="text-sm text-[#737373]">$</Text>
          </View>
        </View>

        <View>
          <SubLabel text="Error state" />
          <Text className="text-sm font-medium text-[#1A1A1A] mb-1.5">Phone</Text>
          <View style={{ borderWidth: 1.5, borderColor: '#D32F2F', borderRadius: 2, backgroundColor: '#FFEBEE' }}>
            <TextInput
              value={phone}
              onChangeText={setPhone}
              style={{ flex: 1, fontSize: 16, color: '#1A1A1A', paddingVertical: 10, paddingHorizontal: 12, borderWidth: 0, backgroundColor: 'transparent', outlineWidth: 0 } as any}
            />
          </View>
          <View className="flex-row items-center mt-1" style={{ gap: 4 }}>
            <Text className="text-xs text-[#D32F2F]">× Invalid phone number</Text>
          </View>
        </View>
      </Card>
    </View>
  );
}

function ButtonsSection() {
  const [loading, setLoading] = useState<string | null>(null);

  const handlePress = (name: string) => {
    setLoading(name);
    setTimeout(() => setLoading(null), 1500);
  };

  return (
    <View>
      <SectionHeading number="07" title="BUTTONS" />
      <Card style={{ gap: 16 }}>
        <SubLabel text="Tap any button to see loading state" />
        <View className="flex-row flex-wrap items-center" style={{ gap: 12 }}>
          <Pressable
            onPress={() => handlePress('primary')}
            className="bg-[#00AA6C] rounded-md px-6 py-3 flex-row items-center"
            style={{ gap: 8, opacity: loading === 'primary' ? 0.7 : 1 }}
          >
            {loading === 'primary'
              ? <ActivityIndicator size="small" color="#fff" />
              : <Text className="text-white font-bold text-[15px]">+</Text>}
            <Text className="text-white font-bold text-[15px]">
              {loading === 'primary' ? 'Loading...' : 'Primary'}
            </Text>
          </Pressable>

          <Pressable
            onPress={() => handlePress('secondary')}
            className="bg-white rounded-md px-6 py-3 border-[1.5px] border-[#00AA6C] flex-row items-center"
            style={{ gap: 8, opacity: loading === 'secondary' ? 0.7 : 1 }}
          >
            {loading === 'secondary'
              ? <ActivityIndicator size="small" color={C.green} />
              : null}
            <Text className="text-[#00AA6C] font-bold text-[15px]">
              {loading === 'secondary' ? 'Loading...' : 'Secondary'}
            </Text>
          </Pressable>

          <Pressable
            onPress={() => handlePress('ghost')}
            className="rounded-md px-6 py-3 flex-row items-center"
            style={{ gap: 8 }}
          >
            <Text className="text-[#737373] font-semibold text-[15px]">Ghost</Text>
          </Pressable>

          <Pressable
            onPress={() => handlePress('destructive')}
            className="bg-[#FFEBEE] rounded-md px-6 py-3 flex-row items-center"
            style={{ gap: 8, opacity: loading === 'destructive' ? 0.7 : 1 }}
          >
            {loading === 'destructive'
              ? <ActivityIndicator size="small" color={C.error} />
              : null}
            <Text className="text-[#D32F2F] font-bold text-[15px]">
              {loading === 'destructive' ? 'Deleting...' : 'Destructive'}
            </Text>
          </Pressable>
        </View>
      </Card>
    </View>
  );
}

function CardsSection({ isDesktop }: { isDesktop: boolean }) {
  const [saved, setSaved] = useState<Record<string, boolean>>({});

  const listings = [
    { id: '1', seed: 'apt-batumi', price: '$85,000', title: '3-room apartment, Batumi center, sea view', location: 'Batumi, Adjara', time: '2h ago', badge: { label: 'Premium', bg: C.greenBg, color: C.green } },
    { id: '2', seed: 'car-camry', price: '$12,500', title: 'Toyota Camry 2019, 45,000 km, automatic', location: 'Tbilisi, Vake', time: '5h ago', badge: { label: 'Top', bg: '#FFF3E0', color: '#E65100' } },
    { id: '3', seed: 'sofa-corner', price: '350 GEL', title: 'Corner sofa, beige, good condition, 2.4m', location: 'Kutaisi', time: '1d ago', badge: { label: 'Urgent', bg: '#FFEBEE', color: C.error } },
  ];

  return (
    <View>
      <SectionHeading number="08" title="CARDS" />
      <View className={isDesktop ? 'flex-row flex-wrap' : ''} style={{ gap: 16 }}>
        {listings.map((item) => (
          <Card key={item.id} className="overflow-hidden" style={{ flex: 1, minWidth: 240, padding: 0 }}>
            <View className="relative">
              <Image
                source={{ uri: `https://picsum.photos/seed/${item.seed}/600/380` }}
                style={{ width: '100%', height: 160 }}
                resizeMode="cover"
              />
              <View
                className="absolute top-2 left-2 rounded-sm px-2 py-0.5"
                style={{ backgroundColor: item.badge.bg }}
              >
                <Text className="text-[11px] font-bold" style={{ color: item.badge.color }}>
                  {item.badge.label}
                </Text>
              </View>
              <Pressable
                onPress={() => setSaved((prev) => ({ ...prev, [item.id]: !prev[item.id] }))}
                className="absolute top-2 right-2 w-8 h-8 rounded-full items-center justify-center"
                style={{ backgroundColor: 'rgba(255,255,255,0.9)' }}
              >
                <Text style={{ fontSize: 15, color: saved[item.id] ? C.error : C.muted }}>
                  {saved[item.id] ? '\u2665' : '\u2661'}
                </Text>
              </Pressable>
            </View>
            <View className="p-3">
              <Text className="text-xl font-bold text-[#1A1A1A] mb-0.5">{item.price}</Text>
              <Text className="text-sm text-[#1A1A1A] mb-2 leading-5" numberOfLines={2}>{item.title}</Text>
              <View className="flex-row items-center justify-between">
                <Text className="text-xs text-[#737373]">{item.location}</Text>
                <Text className="text-xs text-[#737373]">{item.time}</Text>
              </View>
            </View>
          </Card>
        ))}
      </View>
    </View>
  );
}

function ListsSection() {
  const items = [
    { name: 'Giorgi Beridze', detail: 'Tbilisi -- 12 active listings', rating: '4.8', seed: 'seller1' },
    { name: 'Nino Kapanadze', detail: 'Batumi -- 8 active listings', rating: '4.6', seed: 'seller2' },
    { name: 'Lasha Megrelidze', detail: 'Kutaisi -- 5 active listings', rating: '4.9', seed: 'seller3' },
  ];

  return (
    <View>
      <SectionHeading number="09" title="LISTS" />
      <Card className="p-0 overflow-hidden">
        {items.map((item, idx) => (
          <View key={item.name}>
            <Pressable className="flex-row items-center p-4" style={{ gap: 12 }}>
              <Image
                source={{ uri: `https://picsum.photos/seed/${item.seed}/80/80` }}
                className="w-11 h-11 rounded-full bg-[#E0E0E0]"
              />
              <View className="flex-1">
                <Text className="text-[15px] font-semibold text-[#1A1A1A]">{item.name}</Text>
                <Text className="text-[13px] text-[#737373] mt-0.5">{item.detail}</Text>
              </View>
              <View className="flex-row items-center" style={{ gap: 4 }}>
                <Text style={{ fontSize: 13, color: '#F59E0B' }}>{'\u2605'}</Text>
                <Text className="text-[13px] font-bold text-[#1A1A1A]">{item.rating}</Text>
              </View>
              <Text className="text-[#737373] text-base">›</Text>
            </Pressable>
            {idx < items.length - 1 && <View className="h-px bg-[#E0E0E0] ml-[72px]" />}
          </View>
        ))}
      </Card>
    </View>
  );
}

function EmptyStateSection() {
  return (
    <View>
      <SectionHeading number="10" title="EMPTY STATES" />
      <Card className="items-center py-10">
        <View className="w-[72px] h-[72px] rounded-full bg-[#E8F9F2] items-center justify-center mb-5">
          <Text className="text-2xl text-[#00AA6C] font-bold">--</Text>
        </View>
        <Text className="text-lg font-bold text-[#1A1A1A] mb-1.5">No listings yet</Text>
        <Text className="text-sm text-[#737373] text-center leading-5 mb-5" style={{ maxWidth: 280 }}>
          You have not posted any listings. Start selling by creating your first ad.
        </Text>
        <Pressable className="bg-[#00AA6C] rounded-md px-6 py-3 flex-row items-center" style={{ gap: 8 }}>
          <Text className="text-white font-bold text-[15px]">+ Create listing</Text>
        </Pressable>
      </Card>
    </View>
  );
}

function AlertsSection() {
  const alerts = [
    { type: 'success', symbol: '\u2713', bg: C.greenBg, color: C.green, text: 'Listing published successfully! It is now visible to buyers.' },
    { type: 'error', symbol: '\u00D7', bg: '#FFEBEE', color: C.error, text: 'Failed to upload photos. Please check file size (max 5MB) and try again.' },
    { type: 'warning', symbol: '!', bg: '#FFF3E0', color: '#E65100', text: 'Your listing expires in 3 days. Renew to keep it active.' },
    { type: 'info', symbol: 'i', bg: '#E3F2FD', color: '#1565C0', text: 'Your listing is under review. It will be published within 24 hours.' },
  ];

  return (
    <View>
      <SectionHeading number="11" title="ALERTS / BANNERS" />
      <View style={{ gap: 12 }}>
        {alerts.map((alert) => (
          <Card
            key={alert.type}
            className="flex-row items-center"
            style={{
              padding: 14,
              gap: 12,
              borderLeftWidth: 3,
              borderLeftColor: alert.color,
              backgroundColor: alert.bg,
            }}
          >
            <Text className="text-lg font-bold" style={{ color: alert.color }}>{alert.symbol}</Text>
            <Text className="flex-1 text-sm font-medium leading-5" style={{ color: alert.color }}>
              {alert.text}
            </Text>
          </Card>
        ))}
      </View>
    </View>
  );
}

// MAIN EXPORT

export default function DesignSystemStates() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 900;

  return (
    <StateSection title="DESIGN_SYSTEM">
      <ScrollView
        contentContainerStyle={{ padding: isDesktop ? 32 : 16, gap: 40, backgroundColor: C.white }}
        showsVerticalScrollIndicator={false}
      >
        {/* Page Header */}
        <View>
          <Text className="text-2xl font-bold text-[#1A1A1A] mb-1">Design System</Text>
          <Text className="text-sm text-[#737373]">
            Complete brand guide & component showcase -- Avito Georgia
          </Text>
        </View>

        {/* Brand sections */}
        <HeroSection isDesktop={isDesktop} />
        <ColorSystemSection isDesktop={isDesktop} />
        <TypographySection />
        <UIPrimitivesSection />
        <SpacingRadiusSection />

        {/* Component sections */}
        <NavigationSection />
        <InputsSection />
        <ButtonsSection />
        <CardsSection isDesktop={isDesktop} />
        <ListsSection />
        <EmptyStateSection />
        <AlertsSection />

        <View className="h-10" />
      </ScrollView>
    </StateSection>
  );
}
