import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, Platform, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { StateSection } from '../StateSection';

// Brand colors from tailwind.config.js — Avito Georgia Teal Batumi
const C = {
  primary: '#0A7B8A',
  primaryDark: '#0A2840',
  primaryLight: '#1A9BAA',
  secondary: '#f59e0b',
  accent: '#1A9BAA',
  surface: '#E8F4F8',
  white: '#FFFFFF',
  bgPrimary: '#F2F8FA',
  textPrimary: '#0A2840',
  textSecondary: '#1A4A6E',
  textMuted: '#6A8898',
  textDisabled: '#94A3B8',
  border: '#C8E0E8',
  borderLight: '#E2E8F0',
  success: '#2E7D30',
  warning: '#f59e0b',
  error: '#C0392B',
  info: '#3b82f6',
  successBg: '#E8F5E9',
  warningBg: '#FFF8E1',
  errorBg: '#FFEBEE',
  infoBg: '#E3F2FD',
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={{
      backgroundColor: C.white,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: C.border,
      padding: 16,
      gap: 12,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.06,
      shadowRadius: 2,
      elevation: 2,
    }}>
      <Text style={{ fontSize: 15, fontWeight: '700', color: C.primary, marginBottom: 4 }}>
        {title}
      </Text>
      <View style={{ gap: 12 }}>{children}</View>
    </View>
  );
}

function Label({ text }: { text: string }) {
  return (
    <Text style={{
      fontSize: 11,
      fontWeight: '600',
      color: C.textMuted,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    }}>
      {text}
    </Text>
  );
}

// ---------------------------------------------------------------------------
// 1. Header variants
// ---------------------------------------------------------------------------
function HeaderVariantsSection() {
  return (
    <Section title="1. Header Variants">
      <Label text="Public nav (guest)" />
      <View style={{
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        backgroundColor: C.white, borderWidth: 1, borderColor: C.border,
        borderRadius: 8, paddingHorizontal: 16, paddingVertical: 10,
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <View style={{
            width: 32, height: 32, backgroundColor: C.primary,
            borderRadius: 8, alignItems: 'center', justifyContent: 'center',
          }}>
            <Text style={{ color: C.white, fontWeight: '800', fontSize: 16 }}>A</Text>
          </View>
          <Text style={{ fontWeight: '700', color: C.primaryDark, fontSize: 16 }}>Avito.ge</Text>
        </View>
        <View style={{ flexDirection: 'row', gap: 16, alignItems: 'center' }}>
          <Feather name="search" size={20} color={C.textSecondary} />
          <Pressable style={{
            backgroundColor: C.primary, borderRadius: 6,
            paddingHorizontal: 14, paddingVertical: 6,
          }}>
            <Text style={{ color: C.white, fontWeight: '600', fontSize: 13 }}>Login</Text>
          </Pressable>
        </View>
      </View>

      <Label text="Auth nav (logged in)" />
      <View style={{
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        backgroundColor: C.white, borderWidth: 1, borderColor: C.border,
        borderRadius: 8, paddingHorizontal: 16, paddingVertical: 10,
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <View style={{
            width: 32, height: 32, backgroundColor: C.primary,
            borderRadius: 8, alignItems: 'center', justifyContent: 'center',
          }}>
            <Text style={{ color: C.white, fontWeight: '800', fontSize: 16 }}>A</Text>
          </View>
          <Text style={{ fontWeight: '700', color: C.primaryDark, fontSize: 16 }}>Avito.ge</Text>
        </View>
        <View style={{ flexDirection: 'row', gap: 16, alignItems: 'center' }}>
          <Feather name="search" size={20} color={C.textSecondary} />
          <Feather name="bell" size={20} color={C.textSecondary} />
          <Feather name="message-circle" size={20} color={C.textSecondary} />
          <Image
            source={{ uri: 'https://picsum.photos/seed/avatar1/80/80' }}
            style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: C.surface }}
          />
        </View>
      </View>

      <Label text="Seller nav (my listings)" />
      <View style={{
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        backgroundColor: C.white, borderWidth: 1, borderColor: C.border,
        borderRadius: 8, paddingHorizontal: 16, paddingVertical: 10,
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Pressable>
            <Feather name="arrow-left" size={20} color={C.textPrimary} />
          </Pressable>
          <Text style={{ fontWeight: '600', color: C.textPrimary, fontSize: 16 }}>My Listings</Text>
        </View>
        <View style={{ flexDirection: 'row', gap: 16, alignItems: 'center' }}>
          <Feather name="plus" size={20} color={C.primary} />
          <Feather name="settings" size={20} color={C.textSecondary} />
        </View>
      </View>
    </Section>
  );
}

// ---------------------------------------------------------------------------
// 2. Bottom TabBar
// ---------------------------------------------------------------------------
const TAB_ITEMS = [
  { key: 'home', icon: 'home', label: 'Home' },
  { key: 'search', icon: 'search', label: 'Search' },
  { key: 'create', icon: 'plus-circle', label: 'Post Ad' },
  { key: 'messages', icon: 'message-circle', label: 'Messages' },
  { key: 'profile', icon: 'user', label: 'Profile' },
] as const;

function TabBarSection() {
  const [active, setActive] = useState('home');
  return (
    <Section title="2. Bottom TabBar">
      <Label text={`Active: ${active}`} />
      <View style={{
        flexDirection: 'row', backgroundColor: C.white,
        borderWidth: 1, borderColor: C.border, borderRadius: 12,
        paddingVertical: 8, paddingHorizontal: 4,
      }}>
        {TAB_ITEMS.map((tab) => (
          <Pressable
            key={tab.key}
            style={{ flex: 1, alignItems: 'center', gap: 2 }}
            onPress={() => setActive(tab.key)}
          >
            <Feather
              name={tab.icon as any}
              size={tab.key === 'create' ? 28 : 22}
              color={active === tab.key ? C.primary : C.textMuted}
            />
            <Text style={{
              fontSize: 10, fontWeight: active === tab.key ? '700' : '500',
              color: active === tab.key ? C.primary : C.textMuted,
            }}>
              {tab.label}
            </Text>
          </Pressable>
        ))}
      </View>
    </Section>
  );
}

// ---------------------------------------------------------------------------
// 3. Burger / Drawer
// ---------------------------------------------------------------------------
const DRAWER_ITEMS = [
  { icon: 'home', label: 'Home' },
  { icon: 'list', label: 'My Listings' },
  { icon: 'heart', label: 'Favorites' },
  { icon: 'message-circle', label: 'Messages' },
  { icon: 'bell', label: 'Notifications' },
  { icon: 'user', label: 'Profile' },
  { icon: 'settings', label: 'Settings' },
  { icon: 'help-circle', label: 'Help' },
] as const;

function BurgerSection() {
  const [open, setOpen] = useState(false);
  return (
    <Section title="3. Burger / Drawer Menu">
      <Label text="Tap hamburger to toggle" />
      <Pressable
        style={{
          flexDirection: 'row', alignItems: 'center', gap: 8,
          backgroundColor: C.surface, borderRadius: 8,
          paddingHorizontal: 12, paddingVertical: 8, alignSelf: 'flex-start',
        }}
        onPress={() => setOpen(!open)}
      >
        <Feather name={open ? 'x' : 'menu'} size={20} color={C.textPrimary} />
        <Text style={{ color: C.textPrimary, fontWeight: '600', fontSize: 14 }}>Menu</Text>
      </Pressable>
      {open && (
        <View style={{
          backgroundColor: C.white, borderWidth: 1, borderColor: C.border,
          borderRadius: 10, overflow: 'hidden',
          shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1, shadowRadius: 4, elevation: 4,
        }}>
          {DRAWER_ITEMS.map((item, i) => (
            <Pressable
              key={item.label}
              style={{
                flexDirection: 'row', alignItems: 'center', gap: 12,
                paddingHorizontal: 16, paddingVertical: 12,
                borderBottomWidth: i < DRAWER_ITEMS.length - 1 ? 1 : 0,
                borderBottomColor: C.borderLight,
              }}
            >
              <Feather name={item.icon as any} size={18} color={C.primary} />
              <Text style={{ fontSize: 14, color: C.textPrimary, fontWeight: '500' }}>{item.label}</Text>
            </Pressable>
          ))}
          <View style={{
            paddingHorizontal: 16, paddingVertical: 12,
            borderTopWidth: 1, borderTopColor: C.border,
          }}>
            <Pressable style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <Feather name="log-out" size={18} color={C.error} />
              <Text style={{ fontSize: 14, color: C.error, fontWeight: '500' }}>Log Out</Text>
            </Pressable>
          </View>
        </View>
      )}
    </Section>
  );
}

// ---------------------------------------------------------------------------
// 4. Search by city/category
// ---------------------------------------------------------------------------
const CITIES = ['Tbilisi', 'Batumi', 'Kutaisi', 'Rustavi', 'Gori', 'Zugdidi'];
const CATEGORIES = ['Electronics', 'Real Estate', 'Vehicles', 'Services', 'Fashion', 'Home & Garden'];

function SearchAutocompleteSection() {
  const [cityQuery, setCityQuery] = useState('');
  const [cityResults, setCityResults] = useState<string[]>([]);
  const [selectedCity, setSelectedCity] = useState('');
  const [catQuery, setCatQuery] = useState('');
  const [catResults, setCatResults] = useState<string[]>([]);

  const handleCitySearch = (text: string) => {
    setCityQuery(text);
    setSelectedCity('');
    setCityResults(text.length > 0
      ? CITIES.filter(c => c.toLowerCase().includes(text.toLowerCase()))
      : []);
  };

  const handleCatSearch = (text: string) => {
    setCatQuery(text);
    setCatResults(text.length > 0
      ? CATEGORIES.filter(c => c.toLowerCase().includes(text.toLowerCase()))
      : []);
  };

  return (
    <Section title="4. Search by City / Category">
      <Label text="City autocomplete" />
      <View style={{
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: C.bgPrimary, borderWidth: 1, borderColor: C.border,
        borderRadius: 8, paddingHorizontal: 12, height: 44,
      }}>
        <Feather name="map-pin" size={16} color={C.textMuted} style={{ marginRight: 8 }} />
        <TextInput
          style={{ flex: 1, fontSize: 14, color: C.textPrimary, height: 44 } as any}
          placeholder="Select city..."
          placeholderTextColor={C.textMuted}
          value={cityQuery}
          onChangeText={handleCitySearch}
        />
        {cityQuery.length > 0 && (
          <Pressable onPress={() => { setCityQuery(''); setCityResults([]); setSelectedCity(''); }}>
            <Feather name="x" size={16} color={C.textMuted} />
          </Pressable>
        )}
      </View>
      {cityResults.length > 0 && (
        <View style={{
          backgroundColor: C.white, borderWidth: 1, borderColor: C.border,
          borderRadius: 8, overflow: 'hidden',
        }}>
          {cityResults.map((city) => (
            <Pressable
              key={city}
              style={{
                flexDirection: 'row', alignItems: 'center', gap: 8,
                paddingHorizontal: 12, paddingVertical: 10,
                borderBottomWidth: 1, borderBottomColor: C.borderLight,
              }}
              onPress={() => { setSelectedCity(city); setCityQuery(city); setCityResults([]); }}
            >
              <Feather name="map-pin" size={14} color={C.textMuted} />
              <Text style={{ fontSize: 14, color: C.textPrimary }}>{city}</Text>
            </Pressable>
          ))}
        </View>
      )}
      {selectedCity !== '' && (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Feather name="check-circle" size={14} color={C.success} />
          <Text style={{ fontSize: 13, color: C.success, fontWeight: '500' }}>Selected: {selectedCity}</Text>
        </View>
      )}

      <Label text="Category filter" />
      <View style={{
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: C.bgPrimary, borderWidth: 1, borderColor: C.border,
        borderRadius: 8, paddingHorizontal: 12, height: 44,
      }}>
        <Feather name="grid" size={16} color={C.textMuted} style={{ marginRight: 8 }} />
        <TextInput
          style={{ flex: 1, fontSize: 14, color: C.textPrimary, height: 44 } as any}
          placeholder="Search category..."
          placeholderTextColor={C.textMuted}
          value={catQuery}
          onChangeText={handleCatSearch}
        />
      </View>
      {catResults.length > 0 && (
        <View style={{
          backgroundColor: C.white, borderWidth: 1, borderColor: C.border,
          borderRadius: 8, overflow: 'hidden',
        }}>
          {catResults.map((cat) => (
            <Pressable
              key={cat}
              style={{
                flexDirection: 'row', alignItems: 'center', gap: 8,
                paddingHorizontal: 12, paddingVertical: 10,
                borderBottomWidth: 1, borderBottomColor: C.borderLight,
              }}
              onPress={() => { setCatQuery(cat); setCatResults([]); }}
            >
              <Feather name="tag" size={14} color={C.primary} />
              <Text style={{ fontSize: 14, color: C.textPrimary }}>{cat}</Text>
            </Pressable>
          ))}
        </View>
      )}
    </Section>
  );
}

// ---------------------------------------------------------------------------
// 5. Text Inputs
// ---------------------------------------------------------------------------
function InputsSection() {
  const [defaultVal, setDefaultVal] = useState('');
  const [focusedVal, setFocusedVal] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [errorVal, setErrorVal] = useState('');
  const [showError, setShowError] = useState(false);

  return (
    <Section title="5. Text Inputs">
      <Label text="Default" />
      <TextInput
        style={{
          height: 44, borderWidth: 1, borderColor: C.border, borderRadius: 8,
          paddingHorizontal: 12, fontSize: 14, color: C.textPrimary, backgroundColor: C.bgPrimary,
        } as any}
        placeholder="Enter text..."
        placeholderTextColor={C.textMuted}
        value={defaultVal}
        onChangeText={setDefaultVal}
      />

      <Label text="Focused" />
      <TextInput
        style={{
          height: 44, borderWidth: isFocused ? 2 : 1,
          borderColor: isFocused ? C.primary : C.border, borderRadius: 8,
          paddingHorizontal: 12, fontSize: 14, color: C.textPrimary, backgroundColor: C.bgPrimary,
        } as any}
        placeholder="Tap to focus..."
        placeholderTextColor={C.textMuted}
        value={focusedVal}
        onChangeText={setFocusedVal}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />

      <Label text="Error (type invalid email)" />
      <TextInput
        style={{
          height: 44, borderWidth: showError ? 2 : 1,
          borderColor: showError ? C.error : C.border, borderRadius: 8,
          paddingHorizontal: 12, fontSize: 14, color: C.textPrimary, backgroundColor: C.bgPrimary,
        } as any}
        placeholder="email@example.com"
        placeholderTextColor={C.textMuted}
        value={errorVal}
        onChangeText={(t) => { setErrorVal(t); setShowError(t.length > 0 && !t.includes('@')); }}
      />
      {showError && (
        <Text style={{ fontSize: 12, color: C.error, marginTop: -4 }}>Enter a valid email address</Text>
      )}

      <Label text="Disabled" />
      <TextInput
        style={{
          height: 44, borderWidth: 1, borderColor: C.borderLight, borderRadius: 8,
          paddingHorizontal: 12, fontSize: 14, color: C.textDisabled,
          backgroundColor: '#F3F4F6',
        } as any}
        placeholder="Cannot edit this..."
        placeholderTextColor={C.textDisabled}
        editable={false}
        value="Disabled input"
      />
    </Section>
  );
}

// ---------------------------------------------------------------------------
// 6. Buttons
// ---------------------------------------------------------------------------
function ButtonsSection() {
  return (
    <Section title="6. Buttons">
      <Label text="Primary" />
      <View style={{ flexDirection: 'row', gap: 12, flexWrap: 'wrap' }}>
        <Pressable style={{
          height: 44, backgroundColor: C.primary, borderRadius: 8,
          alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24,
        }}>
          <Text style={{ fontSize: 14, fontWeight: '600', color: C.white }}>Primary</Text>
        </Pressable>
        <Pressable style={{
          height: 44, backgroundColor: C.border, borderRadius: 8,
          alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24,
        }}>
          <Text style={{ fontSize: 14, fontWeight: '600', color: C.textMuted }}>Disabled</Text>
        </Pressable>
      </View>

      <Label text="Secondary" />
      <View style={{ flexDirection: 'row', gap: 12, flexWrap: 'wrap' }}>
        <Pressable style={{
          height: 44, backgroundColor: C.white, borderRadius: 8,
          alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24,
          borderWidth: 1, borderColor: C.primary,
        }}>
          <Text style={{ fontSize: 14, fontWeight: '600', color: C.primary }}>Secondary</Text>
        </Pressable>
        <Pressable style={{
          height: 44, backgroundColor: C.white, borderRadius: 8,
          alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24,
          borderWidth: 1, borderColor: C.borderLight,
        }}>
          <Text style={{ fontSize: 14, fontWeight: '600', color: C.textDisabled }}>Disabled</Text>
        </Pressable>
      </View>

      <Label text="Ghost" />
      <Pressable style={{
        height: 44, backgroundColor: 'transparent', borderRadius: 8,
        alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24,
        borderWidth: 1, borderColor: C.border, alignSelf: 'flex-start',
      }}>
        <Text style={{ fontSize: 14, fontWeight: '600', color: C.textSecondary }}>Ghost</Text>
      </Pressable>

      <Label text="Icon buttons" />
      <View style={{ flexDirection: 'row', gap: 12 }}>
        <Pressable style={{
          flexDirection: 'row', alignItems: 'center', gap: 6,
          height: 44, backgroundColor: C.primary, borderRadius: 8, paddingHorizontal: 16,
        }}>
          <Feather name="plus" size={16} color={C.white} />
          <Text style={{ fontSize: 14, fontWeight: '600', color: C.white }}>Post Ad</Text>
        </Pressable>
        <Pressable style={{
          flexDirection: 'row', alignItems: 'center', gap: 6,
          height: 44, backgroundColor: C.error, borderRadius: 8, paddingHorizontal: 16,
        }}>
          <Feather name="trash-2" size={16} color={C.white} />
          <Text style={{ fontSize: 14, fontWeight: '600', color: C.white }}>Delete</Text>
        </Pressable>
      </View>
    </Section>
  );
}

// ---------------------------------------------------------------------------
// 7. Select / Dropdown
// ---------------------------------------------------------------------------
const LISTING_TYPES = ['All Categories', 'Electronics', 'Real Estate', 'Vehicles', 'Services', 'Fashion'];

function SelectSection() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState('');

  return (
    <Section title="7. Select / Dropdown">
      <Label text="Category filter" />
      <Pressable
        style={{
          flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
          height: 44, borderWidth: 1, borderColor: C.border, borderRadius: 8,
          paddingHorizontal: 12, backgroundColor: C.bgPrimary,
        }}
        onPress={() => setOpen(!open)}
      >
        <Text style={{
          fontSize: 14, color: selected ? C.textPrimary : C.textMuted,
        }}>
          {selected || 'Select category'}
        </Text>
        <Feather name={open ? 'chevron-up' : 'chevron-down'} size={16} color={C.textMuted} />
      </Pressable>
      {open && (
        <View style={{
          backgroundColor: C.white, borderWidth: 1, borderColor: C.border,
          borderRadius: 8, overflow: 'hidden',
          shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1, shadowRadius: 4, elevation: 4,
        }}>
          {LISTING_TYPES.map((type) => (
            <Pressable
              key={type}
              style={{
                flexDirection: 'row', alignItems: 'center', gap: 8,
                paddingHorizontal: 12, paddingVertical: 10,
                backgroundColor: selected === type ? C.surface : C.white,
                borderBottomWidth: 1, borderBottomColor: C.borderLight,
              }}
              onPress={() => { setSelected(type); setOpen(false); }}
            >
              {selected === type && <Feather name="check" size={14} color={C.primary} />}
              <Text style={{
                fontSize: 14,
                color: selected === type ? C.primary : C.textPrimary,
                fontWeight: selected === type ? '600' : '400',
              }}>{type}</Text>
            </Pressable>
          ))}
        </View>
      )}
    </Section>
  );
}

// ---------------------------------------------------------------------------
// 8. Cards (listing card, user card)
// ---------------------------------------------------------------------------
function CardsSection() {
  return (
    <Section title="8. Cards">
      <Label text="Listing card" />
      <View style={{
        backgroundColor: C.white, borderRadius: 12, borderWidth: 1,
        borderColor: C.border, overflow: 'hidden',
        shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06, shadowRadius: 2, elevation: 2,
      }}>
        <Image
          source={{ uri: 'https://picsum.photos/seed/listing1/400/240' }}
          style={{ width: '100%', height: 160 }}
        />
        <View style={{ padding: 12, gap: 4 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ fontSize: 15, fontWeight: '600', color: C.textPrimary, flex: 1 }} numberOfLines={1}>
              iPhone 15 Pro Max 256GB
            </Text>
            <Feather name="heart" size={18} color={C.textMuted} />
          </View>
          <Text style={{ fontSize: 17, fontWeight: '700', color: C.primary }}>2,800 GEL</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 }}>
            <Feather name="map-pin" size={12} color={C.textMuted} />
            <Text style={{ fontSize: 12, color: C.textMuted }}>Tbilisi</Text>
            <Text style={{ fontSize: 12, color: C.textMuted, marginLeft: 8 }}>2 hours ago</Text>
          </View>
        </View>
      </View>

      <Label text="User / seller card" />
      <View style={{
        backgroundColor: C.white, borderRadius: 12, borderWidth: 1,
        borderColor: C.border, padding: 12, gap: 8,
        shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06, shadowRadius: 2, elevation: 2,
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <Image
            source={{ uri: 'https://picsum.photos/seed/seller1/80/80' }}
            style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: C.surface }}
          />
          <View style={{ flex: 1, gap: 2 }}>
            <Text style={{ fontSize: 15, fontWeight: '600', color: C.textPrimary }}>Giorgi Beridze</Text>
            <Text style={{ fontSize: 13, color: C.textMuted }}>Tbilisi -- Member since 2024</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Feather name="star" size={12} color={C.secondary} />
              <Text style={{ fontSize: 12, fontWeight: '700', color: C.textPrimary }}>4.8</Text>
              <Text style={{ fontSize: 12, color: C.textMuted }}>(23 reviews)</Text>
            </View>
          </View>
        </View>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <Pressable style={{
            flexDirection: 'row', alignItems: 'center', gap: 6,
            height: 36, backgroundColor: C.primary, borderRadius: 8, paddingHorizontal: 14,
          }}>
            <Feather name="message-circle" size={14} color={C.white} />
            <Text style={{ fontSize: 13, fontWeight: '600', color: C.white }}>Message</Text>
          </Pressable>
          <Pressable style={{
            flexDirection: 'row', alignItems: 'center', gap: 6,
            height: 36, borderWidth: 1, borderColor: C.primary, borderRadius: 8, paddingHorizontal: 14,
          }}>
            <Feather name="phone" size={14} color={C.primary} />
            <Text style={{ fontSize: 13, fontWeight: '600', color: C.primary }}>Show Phone</Text>
          </Pressable>
        </View>
      </View>
    </Section>
  );
}

// ---------------------------------------------------------------------------
// 9. Badges / Chips
// ---------------------------------------------------------------------------
function BadgesSection() {
  const [selectedChips, setSelectedChips] = useState<string[]>(['Electronics']);
  const chipCategories = ['Electronics', 'Real Estate', 'Vehicles', 'Services', 'Fashion'];

  const toggleChip = (chip: string) => {
    setSelectedChips(prev =>
      prev.includes(chip) ? prev.filter(c => c !== chip) : [...prev, chip]
    );
  };

  return (
    <Section title="9. Badges / Chips">
      <Label text="Status badges" />
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        <View style={{ backgroundColor: C.infoBg, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 99 }}>
          <Text style={{ fontSize: 12, fontWeight: '600', color: C.info }}>New</Text>
        </View>
        <View style={{ backgroundColor: C.warningBg, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 99 }}>
          <Text style={{ fontSize: 12, fontWeight: '600', color: C.warning }}>Pending</Text>
        </View>
        <View style={{ backgroundColor: C.successBg, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 99 }}>
          <Text style={{ fontSize: 12, fontWeight: '600', color: C.success }}>Active</Text>
        </View>
        <View style={{ backgroundColor: C.errorBg, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 99 }}>
          <Text style={{ fontSize: 12, fontWeight: '600', color: C.error }}>Rejected</Text>
        </View>
      </View>

      <Label text="Price tags" />
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        <View style={{
          backgroundColor: C.primary, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6,
        }}>
          <Text style={{ fontSize: 12, fontWeight: '700', color: C.white }}>2,800 GEL</Text>
        </View>
        <View style={{
          backgroundColor: C.surface, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6,
          borderWidth: 1, borderColor: C.border,
        }}>
          <Text style={{ fontSize: 12, fontWeight: '600', color: C.textSecondary }}>Negotiable</Text>
        </View>
        <View style={{
          backgroundColor: C.secondary, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6,
        }}>
          <Text style={{ fontSize: 12, fontWeight: '700', color: C.white }}>Premium</Text>
        </View>
      </View>

      <Label text="Category chips (toggleable)" />
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {chipCategories.map((cat) => {
          const isSelected = selectedChips.includes(cat);
          return (
            <Pressable
              key={cat}
              style={{
                paddingHorizontal: 14, paddingVertical: 6, borderRadius: 99,
                backgroundColor: isSelected ? C.primary : C.white,
                borderWidth: 1, borderColor: isSelected ? C.primary : C.border,
              }}
              onPress={() => toggleChip(cat)}
            >
              <Text style={{
                fontSize: 13, fontWeight: '500',
                color: isSelected ? C.white : C.textSecondary,
              }}>{cat}</Text>
            </Pressable>
          );
        })}
      </View>
    </Section>
  );
}

// ---------------------------------------------------------------------------
// 10. Alerts
// ---------------------------------------------------------------------------
function AlertsSection() {
  return (
    <Section title="10. Alerts">
      <View style={{
        flexDirection: 'row', alignItems: 'center', gap: 10,
        padding: 12, borderRadius: 8, backgroundColor: C.infoBg, borderLeftWidth: 3, borderLeftColor: C.info,
      }}>
        <Feather name="info" size={16} color={C.info} />
        <Text style={{ flex: 1, fontSize: 13, fontWeight: '500', color: C.info }}>
          Your listing is under review. It will be published within 24 hours.
        </Text>
      </View>

      <View style={{
        flexDirection: 'row', alignItems: 'center', gap: 10,
        padding: 12, borderRadius: 8, backgroundColor: C.successBg, borderLeftWidth: 3, borderLeftColor: C.success,
      }}>
        <Feather name="check-circle" size={16} color={C.success} />
        <Text style={{ flex: 1, fontSize: 13, fontWeight: '500', color: C.success }}>
          Listing published successfully! It is now visible to buyers.
        </Text>
      </View>

      <View style={{
        flexDirection: 'row', alignItems: 'center', gap: 10,
        padding: 12, borderRadius: 8, backgroundColor: C.errorBg, borderLeftWidth: 3, borderLeftColor: C.error,
      }}>
        <Feather name="alert-circle" size={16} color={C.error} />
        <Text style={{ flex: 1, fontSize: 13, fontWeight: '500', color: C.error }}>
          Failed to upload photos. Please check file size (max 5MB) and try again.
        </Text>
      </View>

      <View style={{
        flexDirection: 'row', alignItems: 'center', gap: 10,
        padding: 12, borderRadius: 8, backgroundColor: C.warningBg, borderLeftWidth: 3, borderLeftColor: C.warning,
      }}>
        <Feather name="alert-triangle" size={16} color={C.warning} />
        <Text style={{ flex: 1, fontSize: 13, fontWeight: '500', color: C.warning }}>
          Your listing expires in 3 days. Renew to keep it active.
        </Text>
      </View>
    </Section>
  );
}

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------
export default function ComponentsStates() {
  return (
    <StateSection title="SHOWCASE">
      <View style={{ minHeight: Platform.OS === 'web' ? '100vh' as any : 844 }}>
        <ScrollView
          style={{ flex: 1, backgroundColor: C.bgPrimary }}
          contentContainerStyle={{ padding: 16, gap: 24 }}
        >
          <Text style={{ fontSize: 22, fontWeight: '700', color: C.textPrimary }}>
            UI Components
          </Text>
          <Text style={{ fontSize: 14, color: C.textMuted, marginTop: -12 }}>
            Interactive showcase of all reusable components -- Avito Georgia
          </Text>
          <HeaderVariantsSection />
          <TabBarSection />
          <BurgerSection />
          <SearchAutocompleteSection />
          <InputsSection />
          <ButtonsSection />
          <SelectSection />
          <CardsSection />
          <BadgesSection />
          <AlertsSection />
          <View style={{ height: 40 }} />
        </ScrollView>
      </View>
    </StateSection>
  );
}
