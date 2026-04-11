import React from 'react';
import {
  View,
  Text,
  useWindowDimensions,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { StateSection } from '../StateSection';

// ─── Core Design Tokens ───────────────────────────────────────────────────────
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

// ─── Logo Component ──────────────────────────────────────────────────────────
function AvitoLogo({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' | 'xl' }) {
  const scale = size === 'sm' ? 0.6 : size === 'lg' ? 1.5 : size === 'xl' ? 2.2 : 1;
  const iconSize = Math.round(40 * scale);
  const iconRadius = Math.round(10 * scale);
  const textSize = Math.round(22 * scale);

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: Math.round(10 * scale) }}>
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
      <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 1 }}>
        <Text style={{ fontSize: textSize, fontWeight: '700', color: C.text, letterSpacing: -0.3 }}>
          avito
        </Text>
        <Text style={{ fontSize: Math.round(textSize * 0.72), fontWeight: '600', color: C.green }}>
          .ge
        </Text>
      </View>
    </View>
  );
}

// ─── Section Heading ─────────────────────────────────────────────────────────
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

// ─── Card Wrapper ────────────────────────────────────────────────────────────
function Card({ children, style }: { children: React.ReactNode; style?: any }) {
  return (
    <View style={[{
      backgroundColor: C.white,
      borderRadius: R.lg,
      padding: 24,
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

// ─── Main Export ─────────────────────────────────────────────────────────────
export default function BrandStates() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 900;
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
    <StateSection title="BRAND_GUIDE">
      <View style={{ gap: 48 }}>

        {/* ── Hero Block ──────────────────────────────────────────────────── */}
        <View style={{
          backgroundColor: C.white,
          borderRadius: R.xl,
          overflow: 'hidden',
          borderWidth: 1,
          borderColor: C.border,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.08,
          shadowRadius: 16,
          elevation: 4,
        }}>
          {/* Green accent bar */}
          <View style={{ height: 4, backgroundColor: C.green }} />

          <View style={{
            padding: isDesktop ? 48 : 28,
            alignItems: 'center',
            gap: 20,
          }}>
            <AvitoLogo size="xl" />

            <Text style={{
              fontSize: isDesktop ? 28 : 22,
              fontWeight: '300',
              color: C.text,
              letterSpacing: -0.5,
              textAlign: 'center',
              marginTop: 8,
            }}>
              Georgia's #1 Classifieds
            </Text>

            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
              backgroundColor: C.greenBg,
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: R.full,
            }}>
              <Feather name="check-circle" size={14} color={C.green} />
              <Text style={{ fontSize: 13, fontWeight: '600', color: C.green }}>
                Brand Design System v1.0
              </Text>
            </View>
          </View>
        </View>

        {/* ── 1. Color System ─────────────────────────────────────────────── */}
        <View>
          <SectionHeading number="01" title="Color System" />
          <Card>
            <View style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              gap: isDesktop ? 16 : 12,
            }}>
              {colors.map(({ color, name, hex, usage, light }) => (
                <View key={name} style={{
                  width: isDesktop ? '22%' as any : '46%' as any,
                  minWidth: isDesktop ? 180 : 140,
                  flex: 1,
                }}>
                  <View style={{
                    height: 72,
                    backgroundColor: color,
                    borderRadius: R.md,
                    borderWidth: light ? 1 : 0,
                    borderColor: C.border,
                    marginBottom: 10,
                  }} />
                  <Text style={{ fontSize: 14, fontWeight: '700', color: C.text }}>{name}</Text>
                  <Text style={{ fontSize: 12, color: C.muted, fontFamily: 'monospace', marginTop: 2 }}>{hex}</Text>
                  <Text style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>{usage}</Text>
                </View>
              ))}
            </View>
          </Card>
        </View>

        {/* ── 2. Typography ───────────────────────────────────────────────── */}
        <View>
          <SectionHeading number="02" title="Typography" />
          <Card style={{ gap: 0 }}>
            {[
              {
                label: 'Display',
                size: 32,
                weight: '800' as const,
                lh: 38,
                example: 'Find Anything in Georgia',
                spec: '32px / ExtraBold 800 / lh 38',
                color: C.text,
              },
              {
                label: 'H1',
                size: 24,
                weight: '700' as const,
                lh: 30,
                example: '3-Room Apartment, Batumi Center',
                spec: '24px / Bold 700 / lh 30',
                color: C.text,
              },
              {
                label: 'H2',
                size: 18,
                weight: '600' as const,
                lh: 24,
                example: 'Popular Categories in Tbilisi',
                spec: '18px / SemiBold 600 / lh 24',
                color: C.text,
              },
              {
                label: 'Body',
                size: 16,
                weight: '400' as const,
                lh: 24,
                example: 'Fully furnished 3-room apartment in the heart of Batumi. 5 min walk to beach. Modern renovation, panoramic sea view.',
                spec: '16px / Regular 400 / lh 24',
                color: C.text,
              },
              {
                label: 'Caption',
                size: 12,
                weight: '400' as const,
                lh: 16,
                example: 'Batumi, Adjara  --  3h ago  --  1,248 views',
                spec: '12px / Regular 400 / lh 16',
                color: C.muted,
              },
            ].map((item, idx, arr) => (
              <View key={item.label}>
                <View style={{ paddingVertical: 20 }}>
                  <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 10,
                    marginBottom: 8,
                  }}>
                    <View style={{
                      backgroundColor: C.greenBg,
                      borderRadius: R.sm,
                      paddingHorizontal: 8,
                      paddingVertical: 3,
                    }}>
                      <Text style={{ fontSize: 11, fontWeight: '700', color: C.green }}>
                        {item.label}
                      </Text>
                    </View>
                    <Text style={{ fontSize: 11, color: C.muted, fontFamily: 'monospace' }}>
                      {item.spec}
                    </Text>
                  </View>
                  <Text style={{
                    fontSize: item.size,
                    fontWeight: item.weight,
                    lineHeight: item.lh,
                    color: item.color,
                  }}>
                    {item.example}
                  </Text>
                </View>
                {idx < arr.length - 1 && (
                  <View style={{ height: 1, backgroundColor: C.border }} />
                )}
              </View>
            ))}
          </Card>
        </View>

        {/* ── 3. UI Primitives ────────────────────────────────────────────── */}
        <View>
          <SectionHeading number="03" title="UI Primitives" />

          {/* Buttons */}
          <Card style={{ marginBottom: 16 }}>
            <Text style={{
              fontSize: 11, fontWeight: '600', color: C.muted,
              letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 16,
            }}>
              Buttons
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
              {/* Primary */}
              <View style={{
                backgroundColor: C.green,
                borderRadius: R.md,
                paddingHorizontal: 24,
                paddingVertical: 13,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 8,
              }}>
                <Feather name="plus" size={16} color="#fff" />
                <Text style={{ color: '#fff', fontWeight: '700', fontSize: 15 }}>Primary</Text>
              </View>

              {/* Secondary */}
              <View style={{
                backgroundColor: C.white,
                borderRadius: R.md,
                paddingHorizontal: 24,
                paddingVertical: 12,
                borderWidth: 1.5,
                borderColor: C.green,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 8,
              }}>
                <Feather name="message-circle" size={16} color={C.green} />
                <Text style={{ color: C.green, fontWeight: '700', fontSize: 15 }}>Secondary</Text>
              </View>

              {/* Ghost */}
              <View style={{
                backgroundColor: 'transparent',
                borderRadius: R.md,
                paddingHorizontal: 24,
                paddingVertical: 13,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 8,
              }}>
                <Feather name="share-2" size={16} color={C.muted} />
                <Text style={{ color: C.muted, fontWeight: '600', fontSize: 15 }}>Ghost</Text>
              </View>

              {/* Destructive */}
              <View style={{
                backgroundColor: '#FFEBEE',
                borderRadius: R.md,
                paddingHorizontal: 24,
                paddingVertical: 13,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 8,
              }}>
                <Feather name="trash-2" size={16} color={C.error} />
                <Text style={{ color: C.error, fontWeight: '700', fontSize: 15 }}>Destructive</Text>
              </View>
            </View>
          </Card>

          {/* Badges */}
          <Card style={{ marginBottom: 16 }}>
            <Text style={{
              fontSize: 11, fontWeight: '600', color: C.muted,
              letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 16,
            }}>
              Badges
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
              {[
                { label: 'New',      bg: '#E3F2FD', color: '#1565C0' },
                { label: 'Premium',  bg: C.greenBg, color: C.green },
                { label: 'Top',      bg: '#FFF3E0', color: '#E65100' },
                { label: 'Sold',     bg: C.border,  color: C.muted },
                { label: 'Urgent',   bg: '#FFEBEE', color: C.error },
                { label: 'Verified', bg: C.greenBg, color: C.green },
              ].map((b) => (
                <View key={b.label} style={{
                  backgroundColor: b.bg,
                  borderRadius: R.full,
                  paddingHorizontal: 14,
                  paddingVertical: 5,
                }}>
                  <Text style={{ fontSize: 12, fontWeight: '700', color: b.color }}>{b.label}</Text>
                </View>
              ))}
            </View>
          </Card>

          {/* Status Chips */}
          <Card>
            <Text style={{
              fontSize: 11, fontWeight: '600', color: C.muted,
              letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 16,
            }}>
              Status Chips
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
              {[
                { label: 'Active',    icon: 'check-circle' as const, bg: C.greenBg, color: C.green },
                { label: 'Pending',   icon: 'clock' as const,        bg: '#FFF3E0', color: '#E65100' },
                { label: 'Rejected',  icon: 'x-circle' as const,     bg: '#FFEBEE', color: C.error },
                { label: 'Archived',  icon: 'archive' as const,      bg: '#F4F4F4', color: C.muted },
              ].map((chip) => (
                <View key={chip.label} style={{
                  backgroundColor: chip.bg,
                  borderRadius: R.md,
                  paddingHorizontal: 14,
                  paddingVertical: 8,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 6,
                }}>
                  <Feather name={chip.icon} size={14} color={chip.color} />
                  <Text style={{ fontSize: 13, fontWeight: '600', color: chip.color }}>{chip.label}</Text>
                </View>
              ))}
            </View>
          </Card>
        </View>

        {/* ── 4. Spacing & Radius ─────────────────────────────────────────── */}
        <View>
          <SectionHeading number="04" title="Spacing & Radius" />

          {/* Spacing */}
          <Card style={{ marginBottom: 16 }}>
            <Text style={{
              fontSize: 11, fontWeight: '600', color: C.muted,
              letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 16,
            }}>
              Spacing Scale
            </Text>
            <View style={{ gap: 12 }}>
              {spacings.map((px) => (
                <View key={px} style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 16,
                }}>
                  <Text style={{
                    fontSize: 12, fontWeight: '600', color: C.muted,
                    fontFamily: 'monospace', width: 40, textAlign: 'right',
                  }}>
                    {px}px
                  </Text>
                  <View style={{
                    width: px * 4,
                    height: 24,
                    backgroundColor: C.greenBg,
                    borderRadius: R.xs,
                    borderWidth: 1,
                    borderColor: C.green,
                    opacity: 0.7,
                  }} />
                </View>
              ))}
            </View>
          </Card>

          {/* Radius */}
          <Card>
            <Text style={{
              fontSize: 11, fontWeight: '600', color: C.muted,
              letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 16,
            }}>
              Border Radius
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16 }}>
              {radii.map((r) => (
                <View key={r.label} style={{ alignItems: 'center', gap: 8 }}>
                  <View style={{
                    width: 56,
                    height: 56,
                    backgroundColor: C.greenBg,
                    borderRadius: Math.min(r.value, 28),
                    borderWidth: 2,
                    borderColor: C.green,
                  }} />
                  <Text style={{ fontSize: 12, fontWeight: '700', color: C.text }}>{r.label}</Text>
                  <Text style={{ fontSize: 10, color: C.muted, fontFamily: 'monospace' }}>
                    {r.value === 9999 ? '9999' : `${r.value}px`}
                  </Text>
                </View>
              ))}
            </View>
          </Card>
        </View>

      </View>
    </StateSection>
  );
}
