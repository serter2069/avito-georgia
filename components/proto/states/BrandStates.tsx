import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  Pressable,
  Image,
  useWindowDimensions,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { StateSection } from '../StateSection';

// ─── Core Design Tokens ───────────────────────────────────────────────────────
// 7 colors. No more. Source: TripAdvisor green × classifieds utility.
const C = {
  green:   '#00AA6C',   // primary — CTA, links, active, price
  greenBg: '#E8F9F2',   // tinted surface for green elements
  white:   '#FFFFFF',   // cards, modals, inputs
  page:    '#F4F4F4',   // page background
  text:    '#1A1A1A',   // headings, prices, important content
  muted:   '#737373',   // meta, hints, secondary labels
  border:  '#E0E0E0',   // dividers, input borders, card borders
  error:   '#D32F2F',   // urgent badge, validation, destructive
};

const R = { xs: 2, sm: 4, md: 8, lg: 12, full: 9999 };  // radius
const S = { shadow: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.09, shadowRadius: 8, elevation: 3 } };

// ─── Logo Component ───────────────────────────────────────────────────────────
function AvitoLogo({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const scale = size === 'sm' ? 0.6 : size === 'lg' ? 1.5 : 1;
  const iconSize = Math.round(40 * scale);
  const iconRadius = Math.round(10 * scale);
  const textSize = Math.round(22 * scale);
  const subSize = Math.round(11 * scale);

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: Math.round(10 * scale) }}>
      {/* Icon mark — "A" on green background */}
      <View style={{
        width: iconSize, height: iconSize,
        backgroundColor: C.green,
        borderRadius: iconRadius,
        alignItems: 'center', justifyContent: 'center',
      }}>
        <Text style={{
          color: '#fff',
          fontSize: Math.round(20 * scale),
          fontWeight: '800',
          letterSpacing: -0.5,
          lineHeight: Math.round(24 * scale),
        }}>
          A
        </Text>
      </View>

      {/* Wordmark */}
      <View style={{ gap: 0 }}>
        <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 1 }}>
          <Text style={{ fontSize: textSize, fontWeight: '700', color: C.text, letterSpacing: -0.3 }}>
            avito
          </Text>
          <Text style={{ fontSize: Math.round(textSize * 0.72), fontWeight: '600', color: C.green }}>
            .ge
          </Text>
        </View>
        <Text style={{ fontSize: subSize, color: C.muted, fontWeight: '400', letterSpacing: 0.2 }}>
          Georgia classifieds
        </Text>
      </View>
    </View>
  );
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function SectionTitle({ label }: { label: string }) {
  return (
    <View style={{ marginBottom: 16, marginTop: 8 }}>
      <Text style={{ fontSize: 11, fontWeight: '600', color: C.muted, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 8 }}>
        {label}
      </Text>
      <View style={{ height: 1, backgroundColor: C.border }} />
    </View>
  );
}

// ─── Classifieds Listing Card ─────────────────────────────────────────────────
function ListingCard({ seed, price, title, location, time, badge }: {
  seed: string; price: string; title: string; location: string; time: string;
  badge?: 'top' | 'urgent' | 'premium';
}) {
  const [saved, setSaved] = useState(false);
  const badgeStyle: Record<string, { bg: string; text: string; label: string }> = {
    top:     { bg: '#FFF3E0', text: '#E65100', label: 'Top' },
    urgent:  { bg: '#FFEBEE', text: C.error,   label: 'Urgent' },
    premium: { bg: C.greenBg, text: C.green,   label: 'Premium' },
  };

  return (
    <View style={{
      backgroundColor: C.white,
      borderRadius: R.md,
      borderWidth: 1,
      borderColor: C.border,
      overflow: 'hidden',
      ...S.shadow,
    }}>
      <View style={{ position: 'relative' }}>
        <Image
          source={{ uri: `https://picsum.photos/seed/${seed}/600/380` }}
          style={{ width: '100%', height: 160 }}
          resizeMode="cover"
        />
        {badge && (
          <View style={{
            position: 'absolute', top: 8, left: 8,
            backgroundColor: badgeStyle[badge].bg,
            borderRadius: R.sm,
            paddingHorizontal: 8, paddingVertical: 3,
          }}>
            <Text style={{ fontSize: 11, fontWeight: '700', color: badgeStyle[badge].text }}>
              {badgeStyle[badge].label}
            </Text>
          </View>
        )}
        <Pressable
          onPress={() => setSaved(!saved)}
          style={{
            position: 'absolute', top: 6, right: 8,
            backgroundColor: 'rgba(255,255,255,0.9)',
            borderRadius: R.full, width: 32, height: 32,
            alignItems: 'center', justifyContent: 'center',
          }}
        >
          <Feather name="heart" size={15} color={saved ? C.error : C.muted} />
        </Pressable>
      </View>

      <View style={{ padding: 12 }}>
        {/* Price */}
        <Text style={{ fontSize: 20, fontWeight: '700', color: C.text, marginBottom: 2 }}>
          {price}
        </Text>

        {/* Title */}
        <Text style={{ fontSize: 14, color: C.text, marginBottom: 8, lineHeight: 20 }} numberOfLines={2}>
          {title}
        </Text>

        {/* Meta */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Feather name="map-pin" size={12} color={C.muted} />
            <Text style={{ fontSize: 12, color: C.muted }}>{location}</Text>
          </View>
          <Text style={{ fontSize: 12, color: C.muted }}>{time}</Text>
        </View>
      </View>
    </View>
  );
}

// ─── Category Item ────────────────────────────────────────────────────────────
function CategoryItem({ icon, label, count }: { icon: keyof typeof Feather.glyphMap; label: string; count: number }) {
  return (
    <Pressable style={{
      alignItems: 'center', gap: 6,
      paddingVertical: 14, paddingHorizontal: 8,
      backgroundColor: C.white,
      borderRadius: R.md,
      borderWidth: 1, borderColor: C.border,
      minWidth: 80,
      ...S.shadow,
    }}>
      <View style={{
        width: 40, height: 40, borderRadius: R.md,
        backgroundColor: C.greenBg,
        alignItems: 'center', justifyContent: 'center',
      }}>
        <Feather name={icon} size={20} color={C.green} />
      </View>
      <Text style={{ fontSize: 12, fontWeight: '600', color: C.text, textAlign: 'center' }}>{label}</Text>
      <Text style={{ fontSize: 11, color: C.muted }}>{count.toLocaleString()}</Text>
    </Pressable>
  );
}

// ─── Post Ad Button ────────────────────────────────────────────────────────────
function PostAdButton() {
  return (
    <Pressable style={{
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: C.green,
      borderRadius: R.sm,
      paddingHorizontal: 20, paddingVertical: 13,
      gap: 8,
    }}>
      <Feather name="plus" size={18} color="#fff" />
      <Text style={{ color: '#fff', fontWeight: '700', fontSize: 16 }}>
        Post ad
      </Text>
    </Pressable>
  );
}

// ─── Search Bar ───────────────────────────────────────────────────────────────
function SearchBar() {
  const [q, setQ] = useState('');
  return (
    <View style={{
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: C.white,
      borderWidth: 1.5, borderColor: C.green,
      borderRadius: R.sm,
      paddingLeft: 12,
      overflow: 'hidden',
      ...S.shadow,
    }}>
      <Feather name="search" size={18} color={C.muted} />
      <TextInput
        style={{ flex: 1, fontSize: 16, color: C.text, paddingVertical: 13, paddingHorizontal: 10 }}
        placeholder="Search listings..."
        placeholderTextColor={C.muted}
        value={q}
        onChangeText={setQ}
      />
      <Pressable style={{ backgroundColor: C.green, paddingHorizontal: 18, paddingVertical: 13 }}>
        <Text style={{ color: '#fff', fontWeight: '600', fontSize: 14 }}>Search</Text>
      </Pressable>
    </View>
  );
}

// ─── Contact Bar ──────────────────────────────────────────────────────────────
function ContactBar() {
  return (
    <View style={{ flexDirection: 'row', gap: 12 }}>
      <Pressable style={{
        flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        backgroundColor: C.green, borderRadius: R.sm,
        paddingVertical: 13, gap: 8,
      }}>
        <Feather name="phone" size={16} color="#fff" />
        <Text style={{ color: '#fff', fontWeight: '600', fontSize: 15 }}>Call</Text>
      </Pressable>
      <Pressable style={{
        flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        backgroundColor: C.white, borderRadius: R.sm,
        borderWidth: 1.5, borderColor: C.green,
        paddingVertical: 13, gap: 8,
      }}>
        <Feather name="message-circle" size={16} color={C.green} />
        <Text style={{ color: C.green, fontWeight: '600', fontSize: 15 }}>Message</Text>
      </Pressable>
    </View>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────
export default function BrandStates() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;

  const ICONS: Array<keyof typeof Feather.glyphMap> = [
    'home', 'search', 'heart', 'user', 'bell', 'map-pin', 'message-circle',
    'plus-circle', 'settings', 'camera', 'star', 'check-circle', 'alert-circle',
    'edit-2', 'trash-2', 'eye', 'share-2', 'filter', 'grid', 'list',
    'phone', 'mail', 'clock', 'tag', 'layers', 'maximize', 'lock',
    'log-out', 'chevron-right', 'x', 'check', 'arrow-left', 'info',
  ];
  const containerStyle = isDesktop ? { maxWidth: 960, alignSelf: 'center' as const, width: '100%' } : {};


  return (
    <StateSection title="BRAND_GUIDE">
      <ScrollView style={[{ minHeight: 844 }, containerStyle]}
        contentContainerStyle={{ padding: isDesktop ? 32 : 16, gap: 40, backgroundColor: C.white }}
        showsVerticalScrollIndicator={false}
      >

        {/* ── 1. Logo ──────────────────────────────────────────────────────── */}
        <View>
          <SectionTitle label="01 — Logo" />

          <View style={{ backgroundColor: C.white, borderRadius: R.md, padding: 24, borderWidth: 1, borderColor: C.border, gap: 32, ...S.shadow }}>
            {/* Large */}
            <View>
              <Text style={{ fontSize: 11, color: C.muted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 16 }}>Large</Text>
              <AvitoLogo size="lg" />
            </View>

            <View style={{ height: 1, backgroundColor: C.border }} />

            {/* Medium + Small side by side */}
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 40, flexWrap: 'wrap' }}>
              <View>
                <Text style={{ fontSize: 11, color: C.muted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 16 }}>Medium</Text>
                <AvitoLogo size="md" />
              </View>
              <View>
                <Text style={{ fontSize: 11, color: C.muted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 16 }}>Small</Text>
                <AvitoLogo size="sm" />
              </View>
            </View>

            <View style={{ height: 1, backgroundColor: C.border }} />

            {/* On dark */}
            <View>
              <Text style={{ fontSize: 11, color: C.muted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 16 }}>On dark</Text>
              <View style={{ backgroundColor: C.text, borderRadius: R.md, padding: 20, alignSelf: 'flex-start' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <View style={{ width: 40, height: 40, backgroundColor: C.green, borderRadius: 10, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ color: '#fff', fontSize: 20, fontWeight: '800' }}>A</Text>
                  </View>
                  <View>
                    <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 1 }}>
                      <Text style={{ fontSize: 22, fontWeight: '700', color: '#FFFFFF', letterSpacing: -0.3 }}>avito</Text>
                      <Text style={{ fontSize: 16, fontWeight: '600', color: C.green }}>.ge</Text>
                    </View>
                    <Text style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', fontWeight: '400' }}>Georgia classifieds</Text>
                  </View>
                </View>
              </View>
            </View>

            <View style={{ height: 1, backgroundColor: C.border }} />

            {/* Icon only */}
            <View>
              <Text style={{ fontSize: 11, color: C.muted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 16 }}>Icon only (app icon, favicon)</Text>
              <View style={{ flexDirection: 'row', gap: 16, flexWrap: 'wrap', alignItems: 'flex-end' }}>
                {[64, 48, 32, 24].map((sz) => (
                  <View key={sz} style={{ alignItems: 'center', gap: 6 }}>
                    <View style={{
                      width: sz, height: sz,
                      backgroundColor: C.green,
                      borderRadius: Math.round(sz * 0.22),
                      alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Text style={{ color: '#fff', fontSize: Math.round(sz * 0.5), fontWeight: '800' }}>A</Text>
                    </View>
                    <Text style={{ fontSize: 10, color: C.muted }}>{sz}px</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </View>

        {/* ── 2. Color Palette ─────────────────────────────────────────────── */}
        <View>
          <SectionTitle label="02 — Color Palette (7 colors)" />

          <View style={{ backgroundColor: C.white, borderRadius: R.md, padding: 24, borderWidth: 1, borderColor: C.border, ...S.shadow }}>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {[
                { color: C.green,   name: 'Green',    hex: '#00AA6C', usage: 'CTA, prices, links' },
                { color: C.greenBg, name: 'Green BG', hex: '#E8F9F2', usage: 'Tinted surfaces', border: true },
                { color: C.white,   name: 'White',    hex: '#FFFFFF', usage: 'Cards, inputs', border: true },
                { color: C.page,    name: 'Page',     hex: '#F4F4F4', usage: 'App background', border: true },
                { color: C.text,    name: 'Text',     hex: '#1A1A1A', usage: 'Headlines, content' },
                { color: C.muted,   name: 'Muted',    hex: '#737373', usage: 'Meta, secondary' },
                { color: C.border,  name: 'Border',   hex: '#E0E0E0', usage: 'Dividers, lines', border: true },
                { color: C.error,   name: 'Error',    hex: '#D32F2F', usage: 'Urgent, errors' },
              ].map(({ color, name, hex, usage, border }) => (
                <View key={name} style={{ alignItems: 'center', marginBottom: 8, minWidth: 80 }}>
                  <View style={{
                    width: 64, height: 64,
                    backgroundColor: color,
                    borderRadius: R.md,
                    borderWidth: border ? 1 : 0,
                    borderColor: C.border,
                    marginBottom: 6,
                    ...S.shadow,
                  }} />
                  <Text style={{ fontSize: 12, fontWeight: '600', color: C.text }}>{name}</Text>
                  <Text style={{ fontSize: 10, color: C.muted, fontFamily: 'monospace' }}>{hex}</Text>
                  <Text style={{ fontSize: 9, color: C.muted, textAlign: 'center', maxWidth: 72 }}>{usage}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* ── 3. Logo in Nav Context ────────────────────────────────────────── */}
        <View>
          <SectionTitle label="03 — Navigation Bar" />

          <View style={{ gap: 12 }}>
            {/* White nav */}
            <View style={{
              backgroundColor: C.white,
              borderBottomWidth: 1, borderBottomColor: C.border,
              paddingHorizontal: 16, paddingVertical: 12,
              flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
              borderRadius: R.md, ...S.shadow,
            }}>
              <AvitoLogo size="sm" />
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
                <Feather name="search" size={20} color={C.text} />
                <Feather name="heart" size={20} color={C.text} />
                <View style={{
                  backgroundColor: C.green, borderRadius: R.sm,
                  paddingHorizontal: 14, paddingVertical: 7,
                }}>
                  <Text style={{ color: '#fff', fontWeight: '700', fontSize: 13 }}>Post ad</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* ── 4. Search Bar ─────────────────────────────────────────────────── */}
        <View>
          <SectionTitle label="04 — Search" />
          <SearchBar />
        </View>

        {/* ── 5. Categories ─────────────────────────────────────────────────── */}
        <View>
          <SectionTitle label="05 — Categories" />

          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
            <CategoryItem icon="home"       label="Real Estate"  count={8420} />
            <CategoryItem icon="truck"      label="Cars"         count={3150} />
            <CategoryItem icon="monitor"    label="Electronics"  count={5830} />
            <CategoryItem icon="briefcase"  label="Jobs"         count={1240} />
            <CategoryItem icon="package"    label="Furniture"    count={2610} />
            <CategoryItem icon="tool"       label="Services"     count={970}  />
            <CategoryItem icon="shopping-bag" label="Clothes"    count={4320} />
            <CategoryItem icon="more-horizontal" label="Other"   count={6700} />
          </View>
        </View>

        {/* ── 6. Listing Cards ──────────────────────────────────────────────── */}
        <View>
          <SectionTitle label="06 — Listing Cards" />

          <View style={{ flexDirection: isDesktop ? 'row' : 'column', gap: 12, flexWrap: 'wrap' }}>
            <View style={{ flex: 1, minWidth: 240 }}>
              <ListingCard
                seed="apt1"
                price="$85 000"
                title="3-room apartment, Batumi center, sea view, fully furnished"
                location="Batumi, Adjara"
                time="2h ago"
                badge="premium"
              />
            </View>
            <View style={{ flex: 1, minWidth: 240 }}>
              <ListingCard
                seed="car2"
                price="$12 500"
                title="Toyota Camry 2019, 45 000 km, automatic, clean"
                location="Tbilisi, Vake"
                time="5h ago"
                badge="top"
              />
            </View>
            <View style={{ flex: 1, minWidth: 240 }}>
              <ListingCard
                seed="sofa3"
                price="₾ 350"
                title="Corner sofa, good condition, beige, 2.4m × 1.8m"
                location="Kutaisi"
                time="1d ago"
                badge="urgent"
              />
            </View>
          </View>
        </View>

        {/* ── 7. Badges ─────────────────────────────────────────────────────── */}
        <View>
          <SectionTitle label="07 — Badges" />

          <View style={{ backgroundColor: C.white, borderRadius: R.md, padding: 20, borderWidth: 1, borderColor: C.border, ...S.shadow }}>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
              {[
                { label: 'Premium',  bg: C.greenBg,  text: C.green  },
                { label: 'Top',      bg: '#FFF3E0',  text: '#E65100' },
                { label: 'Urgent',   bg: '#FFEBEE',  text: C.error  },
                { label: 'New',      bg: '#E3F2FD',  text: '#1565C0' },
                { label: 'Verified', bg: C.greenBg,  text: C.green  },
                { label: 'Archived', bg: C.page,     text: C.muted  },
              ].map(({ label, bg, text }) => (
                <View key={label} style={{
                  backgroundColor: bg,
                  borderRadius: R.full,
                  paddingHorizontal: 12, paddingVertical: 5,
                }}>
                  <Text style={{ fontSize: 12, fontWeight: '700', color: text }}>{label}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* ── 8. Buttons ────────────────────────────────────────────────────── */}
        <View>
          <SectionTitle label="08 — Buttons & Actions" />

          <View style={{ backgroundColor: C.white, borderRadius: R.md, padding: 20, borderWidth: 1, borderColor: C.border, gap: 16, ...S.shadow }}>
            {/* Post Ad */}
            <View>
              <Text style={{ fontSize: 11, color: C.muted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>Post listing</Text>
              <PostAdButton />
            </View>

            <View style={{ height: 1, backgroundColor: C.border }} />

            {/* Contact */}
            <View>
              <Text style={{ fontSize: 11, color: C.muted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>Contact seller</Text>
              <ContactBar />
            </View>

            <View style={{ height: 1, backgroundColor: C.border }} />

            {/* Destructive */}
            <View>
              <Text style={{ fontSize: 11, color: C.muted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>Destructive</Text>
              <Pressable style={{
                flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
                backgroundColor: '#FFEBEE', borderRadius: R.sm,
                paddingVertical: 13, gap: 8,
              }}>
                <Feather name="trash-2" size={16} color={C.error} />
                <Text style={{ color: C.error, fontWeight: '600', fontSize: 15 }}>Delete listing</Text>
              </Pressable>
            </View>
          </View>
        </View>

        {/* ── 9. Form Inputs ────────────────────────────────────────────────── */}
        <View>
          <SectionTitle label="09 — Form Inputs" />

          <View style={{ backgroundColor: C.white, borderRadius: R.md, padding: 20, borderWidth: 1, borderColor: C.border, gap: 20, ...S.shadow }}>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16 }}>
              {/* Normal */}
              <View style={{ flex: 1, minWidth: 200 }}>
                <Text style={{ fontSize: 11, color: C.muted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>Normal</Text>
                <Text style={{ fontSize: 14, fontWeight: '500', color: C.text, marginBottom: 6 }}>City</Text>
                <View style={{ borderWidth: 1, borderColor: C.border, borderRadius: R.sm, backgroundColor: C.white, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12 }}>
                  <Feather name="map-pin" size={15} color={C.muted} />
                  <TextInput style={{ flex: 1, fontSize: 16, color: C.text, paddingVertical: 11, paddingLeft: 8 }} placeholder="e.g. Batumi" placeholderTextColor={C.muted} />
                </View>
              </View>

              {/* Focused */}
              <View style={{ flex: 1, minWidth: 200 }}>
                <Text style={{ fontSize: 11, color: C.muted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>Focused</Text>
                <Text style={{ fontSize: 14, fontWeight: '500', color: C.text, marginBottom: 6 }}>Price</Text>
                <View style={{ borderWidth: 2, borderColor: C.green, borderRadius: R.sm, backgroundColor: C.white, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12 }}>
                  <Feather name="tag" size={15} color={C.green} />
                  <TextInput style={{ flex: 1, fontSize: 16, color: C.text, paddingVertical: 11, paddingLeft: 8 }} value="85 000" editable={false} />
                  <Text style={{ fontSize: 14, color: C.muted }}>$</Text>
                </View>
              </View>

              {/* Error */}
              <View style={{ flex: 1, minWidth: 200 }}>
                <Text style={{ fontSize: 11, color: C.muted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>Error</Text>
                <Text style={{ fontSize: 14, fontWeight: '500', color: C.text, marginBottom: 6 }}>Phone</Text>
                <View style={{ borderWidth: 1.5, borderColor: C.error, borderRadius: R.sm, backgroundColor: '#FFEBEE', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12 }}>
                  <Feather name="phone" size={15} color={C.error} />
                  <TextInput style={{ flex: 1, fontSize: 16, color: C.text, paddingVertical: 11, paddingLeft: 8 }} value="not-valid" editable={false} />
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 }}>
                  <Feather name="alert-circle" size={12} color={C.error} />
                  <Text style={{ fontSize: 12, color: C.error }}>Invalid phone number</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* ── 10. Typography ────────────────────────────────────────────────── */}
        <View>
          <SectionTitle label="10 — Typography" />

          <View style={{ backgroundColor: C.white, borderRadius: R.md, padding: 20, borderWidth: 1, borderColor: C.border, gap: 16, ...S.shadow }}>
            <View style={{ gap: 4 }}>
              <Text style={{ fontSize: 28, fontWeight: '700', color: C.text }}>3-room apartment, Batumi center</Text>
              <Text style={{ fontSize: 11, color: C.muted }}>H1 — 28px / Bold 700</Text>
            </View>
            <View style={{ height: 1, backgroundColor: C.border }} />
            <View style={{ gap: 4 }}>
              <Text style={{ fontSize: 24, fontWeight: '700', color: C.green }}>$85 000</Text>
              <Text style={{ fontSize: 11, color: C.muted }}>Price — 24px / Bold 700 / green</Text>
            </View>
            <View style={{ height: 1, backgroundColor: C.border }} />
            <View style={{ gap: 4 }}>
              <Text style={{ fontSize: 16, color: C.text, lineHeight: 24 }}>
                Fully furnished 3-room apartment in the heart of Batumi. 5 min walk to Black Sea beach. Modern renovation, high floor, panoramic view.
              </Text>
              <Text style={{ fontSize: 11, color: C.muted }}>Body — 16px / 400 / lh 1.5</Text>
            </View>
            <View style={{ height: 1, backgroundColor: C.border }} />
            <View style={{ gap: 4 }}>
              <Text style={{ fontSize: 12, color: C.muted }}>Batumi, Adjara  ·  3h ago  ·  1 248 views</Text>
              <Text style={{ fontSize: 11, color: C.muted }}>Meta — 12px / 400 / muted</Text>
            </View>
            <View style={{ height: 1, backgroundColor: C.border }} />
            <View>
              <Text style={{ fontSize: 14, color: C.muted }}>
                Font:{' '}
                <Text style={{ fontWeight: '500', color: C.text }}>
                  -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif
                </Text>
              </Text>
            </View>
          </View>
        </View>

        {/* ── 11. App Backgrounds ──────────────────────────────────────────── */}
        <View>
          <SectionTitle label="11 — App Backgrounds (where to use each)" />

          <View style={{ backgroundColor: C.white, borderRadius: R.md, padding: 20, borderWidth: 1, borderColor: C.border, gap: 16, ...S.shadow }}>
            {[
              { hex: '#FFFFFF', name: 'White',    usage: 'Main app background, screens, cards, inputs, modals', highlight: true },
              { hex: '#F4F4F4', name: 'Page Gray', usage: 'Brand guide only / section separators when needed', highlight: false },
              { hex: '#E8F9F2', name: 'Green Tint', usage: 'Active badges, icon backgrounds, selected states', highlight: false },
            ].map(({ hex, name, usage, highlight }) => (
              <View key={hex} style={{
                flexDirection: 'row', alignItems: 'center', gap: 16,
                padding: 14,
                borderRadius: R.md,
                borderWidth: highlight ? 2 : 1,
                borderColor: highlight ? C.green : C.border,
                backgroundColor: highlight ? C.greenBg : C.white,
              }}>
                <View style={{
                  width: 48, height: 48,
                  backgroundColor: hex,
                  borderRadius: R.sm,
                  borderWidth: 1, borderColor: C.border,
                }} />
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                    <Text style={{ fontSize: 14, fontWeight: '700', color: C.text }}>{name}</Text>
                    <Text style={{ fontSize: 11, color: C.muted, fontFamily: 'monospace' }}>{hex}</Text>
                    {highlight && (
                      <View style={{ backgroundColor: C.green, borderRadius: R.full, paddingHorizontal: 8, paddingVertical: 2 }}>
                        <Text style={{ fontSize: 10, fontWeight: '700', color: '#fff' }}>DEFAULT</Text>
                      </View>
                    )}
                  </View>
                  <Text style={{ fontSize: 13, color: C.muted, lineHeight: 18 }}>{usage}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* ── 12. Icons ─────────────────────────────────────────────────────── */}
        <View>
          <SectionTitle label="12 — Feather Icons" />

          <View style={{ backgroundColor: C.white, borderRadius: R.md, padding: 20, borderWidth: 1, borderColor: C.border, ...S.shadow }}>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
              {ICONS.map((name) => (
                <View key={name} style={{ width: 72, alignItems: 'center', marginBottom: 20 }}>
                  <View style={{
                    width: 44, height: 44,
                    backgroundColor: C.greenBg,
                    borderRadius: R.md,
                    alignItems: 'center', justifyContent: 'center',
                    marginBottom: 6,
                  }}>
                    <Feather name={name} size={20} color={C.green} />
                  </View>
                  <Text style={{ fontSize: 9, color: C.muted, textAlign: 'center', lineHeight: 12 }} numberOfLines={2}>
                    {name}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        <View style={{ height: 40 }} />

      </ScrollView>
    </StateSection>
  );
}
