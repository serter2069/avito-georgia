import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  Pressable,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { StateSection } from '../StateSection';

// Brand tokens — Avito Georgia / lun.ua-inspired clean marketplace
const BRAND = {
  // Core palette
  primary: '#0A7B8A',
  primaryDark: '#0A2840',
  primaryLight: '#1A9BAA',
  secondary: '#f59e0b',

  // Backgrounds
  bg: '#F2F8FA',
  bgSurface: '#E8F4F8',
  bgCard: '#FFFFFF',
  bgSubtle: '#F8FAFC',
  bgMuted: '#F3F4F6',
  bgBrandSubtle: '#F0FDFA',

  // Text
  textPrimary: '#0A2840',
  textSecondary: '#1A4A6E',
  textMuted: '#6A8898',
  textSubtle: '#64748B',
  textDisabled: '#94A3B8',
  textAccent: '#0A7B8A',

  // Borders
  border: '#C8E0E8',
  borderLight: '#E2E8F0',
  borderFocus: '#0A7B8A',
  borderError: '#C0392B',

  // Status
  success: '#2E7D30',
  warning: '#f59e0b',
  error: '#C0392B',
  info: '#3b82f6',

  // Typography
  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif',
  fontSizeSm: 12,
  fontSizeBase: 14,
  fontSizeLg: 16,
  fontSizeXl: 20,
  fontSize2xl: 24,
  fontSize3xl: 28,
  fontWeightNormal: '400' as const,
  fontWeightMedium: '500' as const,
  fontWeightSemibold: '600' as const,
  fontWeightBold: '700' as const,

  // Radius
  radiusSm: 4,
  radiusMd: 8,
  radiusLg: 12,
  radiusXl: 16,
  radiusFull: 9999,

  // Spacing
  space1: 4,
  space2: 8,
  space3: 12,
  space4: 16,
  space5: 20,
  space6: 24,
  space8: 32,
};

// ─── Section Divider ─────────────────────────────────────────────────────────
function SectionTitle({ label }: { label: string }) {
  return (
    <View style={{ marginBottom: BRAND.space4 }}>
      <Text
        style={{
          fontSize: BRAND.fontSizeSm,
          fontWeight: BRAND.fontWeightSemibold,
          color: BRAND.textMuted,
          letterSpacing: 1.5,
          textTransform: 'uppercase',
          marginBottom: BRAND.space2,
        }}
      >
        {label}
      </Text>
      <View style={{ height: 1, backgroundColor: BRAND.border }} />
    </View>
  );
}

// ─── Color Swatch ─────────────────────────────────────────────────────────────
function Swatch({ color, name, hex }: { color: string; name: string; hex: string }) {
  return (
    <View style={{ alignItems: 'center', marginRight: BRAND.space4, marginBottom: BRAND.space4 }}>
      <View
        style={{
          width: 72,
          height: 72,
          backgroundColor: color,
          borderRadius: BRAND.radiusMd,
          borderWidth: 1,
          borderColor: BRAND.border,
          marginBottom: 6,
        }}
      />
      <Text style={{ fontSize: 11, fontWeight: BRAND.fontWeightSemibold, color: BRAND.textPrimary, textAlign: 'center' }}>
        {name}
      </Text>
      <Text style={{ fontSize: 10, color: BRAND.textMuted, fontFamily: 'monospace' }}>
        {hex}
      </Text>
    </View>
  );
}

// ─── Button ──────────────────────────────────────────────────────────────────
function Btn({
  label,
  variant = 'primary',
  disabled = false,
  iconName,
}: {
  label: string;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  disabled?: boolean;
  iconName?: keyof typeof Feather.glyphMap;
}) {
  const variantStyles: Record<string, { bg: string; text: string; border?: string }> = {
    primary: { bg: BRAND.primary, text: '#fff' },
    secondary: { bg: BRAND.bgSurface, text: BRAND.textPrimary, border: BRAND.border },
    ghost: { bg: 'transparent', text: BRAND.primary, border: BRAND.primary },
    danger: { bg: BRAND.error, text: '#fff' },
  };
  const s = variantStyles[variant];

  return (
    <Pressable
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: s.bg,
        borderWidth: s.border ? 1 : 0,
        borderColor: s.border,
        borderRadius: BRAND.radiusMd,
        paddingHorizontal: BRAND.space5,
        paddingVertical: 12,
        gap: 6,
        opacity: disabled ? 0.45 : 1,
        marginBottom: 10,
      }}
      disabled={disabled}
    >
      {iconName && <Feather name={iconName} size={16} color={s.text} />}
      <Text style={{ color: s.text, fontWeight: BRAND.fontWeightSemibold, fontSize: BRAND.fontSizeLg }}>
        {label}
      </Text>
    </Pressable>
  );
}

// ─── Badge ───────────────────────────────────────────────────────────────────
function Badge({
  label,
  color,
  bg,
}: {
  label: string;
  color: string;
  bg: string;
}) {
  return (
    <View
      style={{
        backgroundColor: bg,
        borderRadius: BRAND.radiusFull,
        paddingHorizontal: 12,
        paddingVertical: 4,
        marginRight: 8,
        marginBottom: 8,
      }}
    >
      <Text style={{ fontSize: BRAND.fontSizeSm, fontWeight: BRAND.fontWeightSemibold, color }}>
        {label}
      </Text>
    </View>
  );
}

// ─── Listing Card ─────────────────────────────────────────────────────────────
function ListingCard() {
  return (
    <View
      style={{
        backgroundColor: BRAND.bgCard,
        borderRadius: BRAND.radiusLg,
        borderWidth: 1,
        borderColor: BRAND.border,
        overflow: 'hidden',
        maxWidth: 320,
        shadowColor: '#0A2840',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 3,
      }}
    >
      {/* Image placeholder */}
      <View
        style={{
          height: 190,
          backgroundColor: BRAND.bgSurface,
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        <Feather name="home" size={48} color={BRAND.border} />
        {/* Premium badge */}
        <View
          style={{
            position: 'absolute',
            top: 12,
            left: 12,
            backgroundColor: BRAND.secondary,
            borderRadius: BRAND.radiusFull,
            paddingHorizontal: 10,
            paddingVertical: 3,
          }}
        >
          <Text style={{ color: '#fff', fontSize: 11, fontWeight: BRAND.fontWeightBold }}>
            Premium
          </Text>
        </View>
        {/* Favorite button */}
        <Pressable
          style={{
            position: 'absolute',
            top: 10,
            right: 12,
            backgroundColor: 'rgba(255,255,255,0.9)',
            borderRadius: BRAND.radiusFull,
            width: 32,
            height: 32,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Feather name="heart" size={16} color={BRAND.textMuted} />
        </Pressable>
        {/* Photo count */}
        <View
          style={{
            position: 'absolute',
            bottom: 10,
            right: 12,
            backgroundColor: 'rgba(10,40,64,0.65)',
            borderRadius: BRAND.radiusSm,
            paddingHorizontal: 8,
            paddingVertical: 3,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 4,
          }}
        >
          <Feather name="camera" size={12} color="#fff" />
          <Text style={{ color: '#fff', fontSize: 11, fontWeight: BRAND.fontWeightMedium }}>12</Text>
        </View>
      </View>

      {/* Card body */}
      <View style={{ padding: BRAND.space4 }}>
        {/* Price */}
        <Text
          style={{
            fontSize: BRAND.fontSize2xl,
            fontWeight: BRAND.fontWeightBold,
            color: BRAND.textPrimary,
            marginBottom: 4,
          }}
        >
          85 000 $
        </Text>

        {/* Title */}
        <Text
          style={{
            fontSize: BRAND.fontSizeLg,
            fontWeight: BRAND.fontWeightSemibold,
            color: BRAND.textPrimary,
            marginBottom: 4,
            lineHeight: 22,
          }}
          numberOfLines={2}
        >
          3-room apartment, Batumi center
        </Text>

        {/* Meta row */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: BRAND.space3 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Feather name="maximize" size={13} color={BRAND.textMuted} />
            <Text style={{ fontSize: BRAND.fontSizeBase, color: BRAND.textMuted }}>78 m²</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Feather name="layers" size={13} color={BRAND.textMuted} />
            <Text style={{ fontSize: BRAND.fontSizeBase, color: BRAND.textMuted }}>5/12 fl.</Text>
          </View>
        </View>

        {/* Location */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: BRAND.space3 }}>
          <Feather name="map-pin" size={13} color={BRAND.textMuted} />
          <Text style={{ fontSize: BRAND.fontSizeBase, color: BRAND.textMuted }} numberOfLines={1}>
            Batumi, Adjara, Georgia
          </Text>
        </View>

        {/* Divider */}
        <View style={{ height: 1, backgroundColor: BRAND.borderLight, marginBottom: BRAND.space3 }} />

        {/* Footer */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <View
              style={{
                width: 28,
                height: 28,
                borderRadius: 14,
                backgroundColor: BRAND.bgSurface,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Feather name="user" size={14} color={BRAND.textMuted} />
            </View>
            <Text style={{ fontSize: BRAND.fontSizeSm, color: BRAND.textMuted }}>Irakli G.</Text>
          </View>
          <Text style={{ fontSize: BRAND.fontSizeSm, color: BRAND.textMuted }}>2h ago</Text>
        </View>
      </View>
    </View>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────
export default function BrandStates() {
  const [inputValue, setInputValue] = useState('');
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  const ICONS: Array<keyof typeof Feather.glyphMap> = [
    'home', 'search', 'heart', 'user', 'bell', 'map-pin', 'message-circle',
    'plus-circle', 'settings', 'camera', 'star', 'check-circle', 'alert-circle',
    'edit-2', 'trash-2', 'eye', 'share-2', 'filter', 'grid', 'list',
    'phone', 'mail', 'clock', 'tag', 'layers', 'maximize', 'lock',
    'log-out', 'chevron-right', 'x', 'check', 'arrow-left', 'info',
  ];

  return (
    <StateSection title="BRAND_GUIDE">
      <ScrollView
        contentContainerStyle={{ padding: BRAND.space8, gap: 48 }}
        showsVerticalScrollIndicator={false}
      >

        {/* ── Header ─────────────────────────────────────────────────────────── */}
        <View
          style={{
            backgroundColor: BRAND.primary,
            borderRadius: BRAND.radiusLg,
            padding: BRAND.space8,
            marginBottom: -16,
          }}
        >
          <Text style={{ color: '#fff', fontSize: BRAND.fontSize3xl, fontWeight: BRAND.fontWeightBold, marginBottom: 4 }}>
            Avito Georgia
          </Text>
          <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: BRAND.fontSizeLg }}>
            Brand & Design Tokens
          </Text>
          <Text style={{ color: 'rgba(255,255,255,0.55)', fontSize: BRAND.fontSizeBase, marginTop: 6 }}>
            Based on lun.ua clean marketplace aesthetic
          </Text>
        </View>

        {/* ── 1. Color Palette ────────────────────────────────────────────────── */}
        <View>
          <SectionTitle label="01 — Color Palette" />

          <Text style={{ fontSize: BRAND.fontSizeSm, fontWeight: BRAND.fontWeightSemibold, color: BRAND.textMuted, marginBottom: BRAND.space3, textTransform: 'uppercase', letterSpacing: 1 }}>
            Brand
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            <Swatch color={BRAND.primary} name="Primary" hex="#0A7B8A" />
            <Swatch color={BRAND.primaryDark} name="Primary Dark" hex="#0A2840" />
            <Swatch color={BRAND.primaryLight} name="Primary Light" hex="#1A9BAA" />
            <Swatch color={BRAND.secondary} name="Secondary" hex="#f59e0b" />
          </View>

          <Text style={{ fontSize: BRAND.fontSizeSm, fontWeight: BRAND.fontWeightSemibold, color: BRAND.textMuted, marginBottom: BRAND.space3, textTransform: 'uppercase', letterSpacing: 1, marginTop: 8 }}>
            Background
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            <Swatch color={BRAND.bg} name="BG" hex="#F2F8FA" />
            <Swatch color={BRAND.bgSurface} name="Surface" hex="#E8F4F8" />
            <Swatch color={BRAND.bgCard} name="Card" hex="#FFFFFF" />
            <Swatch color={BRAND.bgSubtle} name="Subtle" hex="#F8FAFC" />
            <Swatch color={BRAND.bgMuted} name="Muted" hex="#F3F4F6" />
            <Swatch color={BRAND.bgBrandSubtle} name="Brand Subtle" hex="#F0FDFA" />
          </View>

          <Text style={{ fontSize: BRAND.fontSizeSm, fontWeight: BRAND.fontWeightSemibold, color: BRAND.textMuted, marginBottom: BRAND.space3, textTransform: 'uppercase', letterSpacing: 1, marginTop: 8 }}>
            Text
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            <Swatch color={BRAND.textPrimary} name="Primary" hex="#0A2840" />
            <Swatch color={BRAND.textSecondary} name="Secondary" hex="#1A4A6E" />
            <Swatch color={BRAND.textMuted} name="Muted" hex="#6A8898" />
            <Swatch color={BRAND.textSubtle} name="Subtle" hex="#64748B" />
            <Swatch color={BRAND.textDisabled} name="Disabled" hex="#94A3B8" />
          </View>

          <Text style={{ fontSize: BRAND.fontSizeSm, fontWeight: BRAND.fontWeightSemibold, color: BRAND.textMuted, marginBottom: BRAND.space3, textTransform: 'uppercase', letterSpacing: 1, marginTop: 8 }}>
            Status
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            <Swatch color={BRAND.success} name="Success" hex="#2E7D30" />
            <Swatch color={BRAND.warning} name="Warning" hex="#f59e0b" />
            <Swatch color={BRAND.error} name="Error" hex="#C0392B" />
            <Swatch color={BRAND.info} name="Info" hex="#3b82f6" />
          </View>
        </View>

        {/* ── 2. Typography ───────────────────────────────────────────────────── */}
        <View>
          <SectionTitle label="02 — Typography" />

          <View style={{ backgroundColor: BRAND.bgCard, borderRadius: BRAND.radiusLg, padding: BRAND.space6, borderWidth: 1, borderColor: BRAND.border, gap: 20 }}>
            <View>
              <Text style={{ fontSize: BRAND.fontSize3xl, fontWeight: BRAND.fontWeightBold, color: BRAND.textPrimary, lineHeight: 36 }}>
                H1 — Display 28px Bold
              </Text>
              <Text style={{ fontSize: BRAND.fontSizeSm, color: BRAND.textMuted, marginTop: 2 }}>
                28px / Bold 700 / line-height 1.3
              </Text>
            </View>

            <View style={{ height: 1, backgroundColor: BRAND.borderLight }} />

            <View>
              <Text style={{ fontSize: BRAND.fontSize2xl, fontWeight: BRAND.fontWeightBold, color: BRAND.textPrimary, lineHeight: 32 }}>
                H2 — Heading 24px Bold
              </Text>
              <Text style={{ fontSize: BRAND.fontSizeSm, color: BRAND.textMuted, marginTop: 2 }}>
                24px / Bold 700 / line-height 1.33
              </Text>
            </View>

            <View style={{ height: 1, backgroundColor: BRAND.borderLight }} />

            <View>
              <Text style={{ fontSize: BRAND.fontSizeXl, fontWeight: BRAND.fontWeightSemibold, color: BRAND.textPrimary, lineHeight: 28 }}>
                H3 — Subtitle 20px Semibold
              </Text>
              <Text style={{ fontSize: BRAND.fontSizeSm, color: BRAND.textMuted, marginTop: 2 }}>
                20px / Semibold 600 / line-height 1.4
              </Text>
            </View>

            <View style={{ height: 1, backgroundColor: BRAND.borderLight }} />

            <View>
              <Text style={{ fontSize: BRAND.fontSizeLg, fontWeight: BRAND.fontWeightNormal, color: BRAND.textSecondary, lineHeight: 24 }}>
                Body — Regular text 16px. Used for descriptions, listing content, and general paragraph text across the app.
              </Text>
              <Text style={{ fontSize: BRAND.fontSizeSm, color: BRAND.textMuted, marginTop: 2 }}>
                16px / Regular 400 / line-height 1.5
              </Text>
            </View>

            <View style={{ height: 1, backgroundColor: BRAND.borderLight }} />

            <View>
              <Text style={{ fontSize: BRAND.fontSizeBase, fontWeight: BRAND.fontWeightNormal, color: BRAND.textMuted, lineHeight: 20 }}>
                Small — 14px for secondary info, meta, timestamps, helper text.
              </Text>
              <Text style={{ fontSize: BRAND.fontSizeSm, color: BRAND.textMuted, marginTop: 2 }}>
                14px / Regular 400 / line-height 1.43
              </Text>
            </View>

            <View style={{ height: 1, backgroundColor: BRAND.borderLight }} />

            <View>
              <Text style={{ fontSize: BRAND.fontSizeSm, fontWeight: BRAND.fontWeightMedium, color: BRAND.textMuted, letterSpacing: 1.2, textTransform: 'uppercase' }}>
                Caption — 12px Uppercase Tracking
              </Text>
              <Text style={{ fontSize: BRAND.fontSizeSm, color: BRAND.textMuted, marginTop: 2, letterSpacing: 0 }}>
                12px / Medium 500 / letter-spacing 1.2 / uppercase
              </Text>
            </View>

            <View style={{ height: 1, backgroundColor: BRAND.borderLight }} />

            <View>
              <Text style={{ fontSize: BRAND.fontSizeBase, color: BRAND.textMuted }}>
                Font family:{' '}
                <Text style={{ fontWeight: BRAND.fontWeightMedium, color: BRAND.textPrimary }}>
                  Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif
                </Text>
              </Text>
            </View>
          </View>
        </View>

        {/* ── 3. Buttons ──────────────────────────────────────────────────────── */}
        <View>
          <SectionTitle label="03 — Buttons" />

          <View style={{ backgroundColor: BRAND.bgCard, borderRadius: BRAND.radiusLg, padding: BRAND.space6, borderWidth: 1, borderColor: BRAND.border }}>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: BRAND.space4 }}>
              <View style={{ minWidth: 200 }}>
                <Text style={{ fontSize: BRAND.fontSizeSm, color: BRAND.textMuted, marginBottom: BRAND.space3, textTransform: 'uppercase', letterSpacing: 1 }}>Primary</Text>
                <Btn label="Save changes" variant="primary" iconName="check" />
                <Btn label="Disabled" variant="primary" disabled />
              </View>
              <View style={{ minWidth: 200 }}>
                <Text style={{ fontSize: BRAND.fontSizeSm, color: BRAND.textMuted, marginBottom: BRAND.space3, textTransform: 'uppercase', letterSpacing: 1 }}>Secondary</Text>
                <Btn label="Cancel" variant="secondary" />
                <Btn label="Disabled" variant="secondary" disabled />
              </View>
              <View style={{ minWidth: 200 }}>
                <Text style={{ fontSize: BRAND.fontSizeSm, color: BRAND.textMuted, marginBottom: BRAND.space3, textTransform: 'uppercase', letterSpacing: 1 }}>Ghost</Text>
                <Btn label="Learn more" variant="ghost" iconName="arrow-right" />
                <Btn label="Disabled" variant="ghost" disabled />
              </View>
              <View style={{ minWidth: 200 }}>
                <Text style={{ fontSize: BRAND.fontSizeSm, color: BRAND.textMuted, marginBottom: BRAND.space3, textTransform: 'uppercase', letterSpacing: 1 }}>Danger</Text>
                <Btn label="Delete listing" variant="danger" iconName="trash-2" />
                <Btn label="Disabled" variant="danger" disabled />
              </View>
            </View>
          </View>
        </View>

        {/* ── 4. Form Inputs ──────────────────────────────────────────────────── */}
        <View>
          <SectionTitle label="04 — Form Inputs" />

          <View style={{ backgroundColor: BRAND.bgCard, borderRadius: BRAND.radiusLg, padding: BRAND.space6, borderWidth: 1, borderColor: BRAND.border, gap: BRAND.space5 }}>
            {/* Normal */}
            <View>
              <Text style={{ fontSize: BRAND.fontSizeSm, color: BRAND.textMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: BRAND.space2 }}>Normal</Text>
              <Text style={{ fontSize: BRAND.fontSizeBase, fontWeight: BRAND.fontWeightMedium, color: BRAND.textSecondary, marginBottom: 6 }}>City</Text>
              <TextInput
                style={{
                  backgroundColor: BRAND.bgSurface,
                  borderWidth: 1,
                  borderColor: BRAND.border,
                  borderRadius: BRAND.radiusMd,
                  paddingHorizontal: BRAND.space4,
                  paddingVertical: 12,
                  fontSize: BRAND.fontSizeLg,
                  color: BRAND.textPrimary,
                }}
                placeholder="e.g. Batumi"
                placeholderTextColor={BRAND.textMuted}
                value={inputValue}
                onChangeText={setInputValue}
              />
            </View>

            <View style={{ height: 1, backgroundColor: BRAND.borderLight }} />

            {/* Focused */}
            <View>
              <Text style={{ fontSize: BRAND.fontSizeSm, color: BRAND.textMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: BRAND.space2 }}>Focused</Text>
              <Text style={{ fontSize: BRAND.fontSizeBase, fontWeight: BRAND.fontWeightMedium, color: BRAND.textSecondary, marginBottom: 6 }}>Price</Text>
              <TextInput
                style={{
                  backgroundColor: BRAND.bgBrandSubtle,
                  borderWidth: 2,
                  borderColor: BRAND.borderFocus,
                  borderRadius: BRAND.radiusMd,
                  paddingHorizontal: BRAND.space4,
                  paddingVertical: 12,
                  fontSize: BRAND.fontSizeLg,
                  color: BRAND.textPrimary,
                }}
                value="50 000"
                editable={false}
              />
            </View>

            <View style={{ height: 1, backgroundColor: BRAND.borderLight }} />

            {/* Error */}
            <View>
              <Text style={{ fontSize: BRAND.fontSizeSm, color: BRAND.textMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: BRAND.space2 }}>Error</Text>
              <Text style={{ fontSize: BRAND.fontSizeBase, fontWeight: BRAND.fontWeightMedium, color: BRAND.textSecondary, marginBottom: 6 }}>Phone</Text>
              <TextInput
                style={{
                  backgroundColor: '#FDF2F2',
                  borderWidth: 1.5,
                  borderColor: BRAND.borderError,
                  borderRadius: BRAND.radiusMd,
                  paddingHorizontal: BRAND.space4,
                  paddingVertical: 12,
                  fontSize: BRAND.fontSizeLg,
                  color: BRAND.textPrimary,
                }}
                value="not-a-phone"
                editable={false}
              />
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 }}>
                <Feather name="alert-circle" size={13} color={BRAND.error} />
                <Text style={{ fontSize: BRAND.fontSizeSm, color: BRAND.error }}>Enter a valid phone number</Text>
              </View>
            </View>

            <View style={{ height: 1, backgroundColor: BRAND.borderLight }} />

            {/* Disabled */}
            <View>
              <Text style={{ fontSize: BRAND.fontSizeSm, color: BRAND.textMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: BRAND.space2 }}>Disabled</Text>
              <Text style={{ fontSize: BRAND.fontSizeBase, fontWeight: BRAND.fontWeightMedium, color: BRAND.textDisabled, marginBottom: 6 }}>Email</Text>
              <TextInput
                style={{
                  backgroundColor: BRAND.bgMuted,
                  borderWidth: 1,
                  borderColor: BRAND.borderLight,
                  borderRadius: BRAND.radiusMd,
                  paddingHorizontal: BRAND.space4,
                  paddingVertical: 12,
                  fontSize: BRAND.fontSizeLg,
                  color: BRAND.textDisabled,
                  opacity: 0.6,
                }}
                value="irakli@gmail.com"
                editable={false}
              />
            </View>
          </View>
        </View>

        {/* ── 5. Listing Card ─────────────────────────────────────────────────── */}
        <View>
          <SectionTitle label="05 — Listing Card" />
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: BRAND.space4 }}>
            <ListingCard />
          </View>
        </View>

        {/* ── 6. Badges / Tags ────────────────────────────────────────────────── */}
        <View>
          <SectionTitle label="06 — Badges & Tags" />

          <View style={{ backgroundColor: BRAND.bgCard, borderRadius: BRAND.radiusLg, padding: BRAND.space6, borderWidth: 1, borderColor: BRAND.border }}>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: BRAND.space4 }}>
              <Badge label="Active" color="#1A6B1C" bg="#DCFCE7" />
              <Badge label="Archived" color={BRAND.textMuted} bg={BRAND.bgMuted} />
              <Badge label="On Review" color="#B45309" bg="#FEF3C7" />
              <Badge label="Premium" color="#fff" bg={BRAND.secondary} />
              <Badge label="Rejected" color="#9B1A1A" bg="#FEE2E2" />
              <Badge label="New" color={BRAND.primary} bg={BRAND.bgBrandSubtle} />
            </View>

            <View style={{ height: 1, backgroundColor: BRAND.borderLight, marginBottom: BRAND.space4 }} />

            {/* Category tags */}
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
              {['Real Estate', 'Cars', 'Electronics', 'Furniture', 'Jobs', 'Services'].map((tag) => (
                <View
                  key={tag}
                  style={{
                    backgroundColor: BRAND.bgSurface,
                    borderRadius: BRAND.radiusFull,
                    borderWidth: 1,
                    borderColor: BRAND.border,
                    paddingHorizontal: 14,
                    paddingVertical: 6,
                    marginRight: 8,
                    marginBottom: 8,
                  }}
                >
                  <Text style={{ fontSize: BRAND.fontSizeBase, color: BRAND.textSecondary, fontWeight: BRAND.fontWeightMedium }}>
                    {tag}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* ── 7. Icons ────────────────────────────────────────────────────────── */}
        <View>
          <SectionTitle label="07 — Feather Icons" />

          <View style={{ backgroundColor: BRAND.bgCard, borderRadius: BRAND.radiusLg, padding: BRAND.space6, borderWidth: 1, borderColor: BRAND.border }}>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 0 }}>
              {ICONS.map((iconName) => (
                <View
                  key={iconName}
                  style={{
                    width: 72,
                    alignItems: 'center',
                    marginBottom: BRAND.space5,
                  }}
                >
                  <View
                    style={{
                      width: 44,
                      height: 44,
                      backgroundColor: BRAND.bgSurface,
                      borderRadius: BRAND.radiusMd,
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: 6,
                    }}
                  >
                    <Feather name={iconName} size={20} color={BRAND.primary} />
                  </View>
                  <Text
                    style={{
                      fontSize: 9,
                      color: BRAND.textMuted,
                      textAlign: 'center',
                      lineHeight: 12,
                    }}
                    numberOfLines={2}
                  >
                    {iconName}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* ── 8. Spacing & Radius ─────────────────────────────────────────────── */}
        <View>
          <SectionTitle label="08 — Spacing & Radius" />

          <View style={{ backgroundColor: BRAND.bgCard, borderRadius: BRAND.radiusLg, padding: BRAND.space6, borderWidth: 1, borderColor: BRAND.border }}>
            <Text style={{ fontSize: BRAND.fontSizeSm, color: BRAND.textMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: BRAND.space4 }}>
              Border Radius
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: BRAND.space5, flexWrap: 'wrap' }}>
              {[
                { name: 'SM', value: 4 },
                { name: 'MD', value: 8 },
                { name: 'LG', value: 12 },
                { name: 'XL', value: 16 },
                { name: 'Full', value: 9999 },
              ].map(({ name, value }) => (
                <View key={name} style={{ alignItems: 'center', gap: 6 }}>
                  <View
                    style={{
                      width: 56,
                      height: 56,
                      backgroundColor: BRAND.bgSurface,
                      borderRadius: value,
                      borderWidth: 2,
                      borderColor: BRAND.primary,
                    }}
                  />
                  <Text style={{ fontSize: BRAND.fontSizeSm, fontWeight: BRAND.fontWeightSemibold, color: BRAND.textPrimary }}>{name}</Text>
                  <Text style={{ fontSize: 10, color: BRAND.textMuted, fontFamily: 'monospace' }}>{value === 9999 ? '9999' : `${value}px`}</Text>
                </View>
              ))}
            </View>

            <View style={{ height: 1, backgroundColor: BRAND.borderLight, marginVertical: BRAND.space5 }} />

            <Text style={{ fontSize: BRAND.fontSizeSm, color: BRAND.textMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: BRAND.space4 }}>
              Spacing Scale
            </Text>
            <View style={{ gap: BRAND.space2 }}>
              {[4, 8, 12, 16, 20, 24, 32].map((sp) => (
                <View key={sp} style={{ flexDirection: 'row', alignItems: 'center', gap: BRAND.space3 }}>
                  <Text style={{ fontSize: BRAND.fontSizeSm, color: BRAND.textMuted, width: 32, fontFamily: 'monospace' }}>{sp}px</Text>
                  <View
                    style={{
                      height: 20,
                      width: sp * 2,
                      backgroundColor: BRAND.primary,
                      borderRadius: 2,
                      opacity: 0.7,
                    }}
                  />
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* ── Bottom spacer ────────────────────────────────────────────────────── */}
        <View style={{ height: 48 }} />

      </ScrollView>
    </StateSection>
  );
}
