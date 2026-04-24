import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, fontSize } from '../lib/theme';

type Lang = 'RU' | 'EN' | 'KA';
const LANGS: Lang[] = ['RU', 'EN', 'KA'];

function LangSelect({ value, onChange }: { value: Lang; onChange: (v: Lang) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <View style={{ position: 'relative', zIndex: 100 }}>
      <Pressable
        onPress={() => setOpen(o => !o)}
        accessibilityLabel={`Выбрать язык ${value}`}
        style={{
          borderWidth: 1,
          borderColor: colors.borderLight,
          borderRadius: 6,
          paddingHorizontal: 8,
          paddingVertical: 5,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 3,
          backgroundColor: colors.background,
          minHeight: 44,
          minWidth: 44,
        }}
      >
        <Text style={{ fontSize: fontSize.sm, fontWeight: '600', color: colors.textSecondary }}>{value}</Text>
        <Ionicons name={open ? 'chevron-up' : 'chevron-down'} size={10} color={colors.textSecondary} />
      </Pressable>
      {open && (
        <View
          style={{
            position: 'absolute',
            top: '100%' as any,
            left: 0,
            marginTop: 4,
            backgroundColor: colors.background,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: colors.borderLight,
            overflow: 'hidden',
            minWidth: 56,
            zIndex: 200,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 8,
          }}
        >
          {LANGS.map(l => (
            <Pressable
              key={l}
              onPress={() => {
                onChange(l);
                setOpen(false);
              }}
              style={{
                paddingHorizontal: 12,
                paddingVertical: 9,
                backgroundColor: value === l ? colors.surface : colors.background,
              }}
            >
              <Text
                style={{
                  fontSize: fontSize.sm,
                  fontWeight: value === l ? '700' : '400',
                  color: value === l ? colors.primary : colors.textSecondary,
                }}
              >
                {l}
              </Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}

export interface HeaderProps {
  /** True once user is authenticated (will come from auth store). */
  loggedIn?: boolean;
  /** Called when the "Войти" CTA is pressed. */
  onLoginPress?: () => void;
  /** Called when the logged-in "+ Подать" CTA is pressed. */
  onPostPress?: () => void;
  /** Called when the avatar is pressed. */
  onAvatarPress?: () => void;
  /** Optional controlled search value + handler. */
  search?: { value: string; onChange: (v: string) => void; onFocus?: () => void; onBlur?: () => void };
  /** Hide the search input entirely (default: true — shown). */
  showSearch?: boolean;
  /** Initial letter / avatar placeholder (default 'Г'). */
  avatarInitial?: string;
}

export default function Header({
  loggedIn = false,
  onLoginPress,
  onPostPress,
  onAvatarPress,
  search,
  showSearch = true,
  avatarInitial = 'Г',
}: HeaderProps) {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;
  const isTablet = width >= 640;
  const hPad = isDesktop ? 32 : 16;
  const maxW = isDesktop ? 1280 : undefined;

  const [lang, setLang] = useState<Lang>('RU');
  const [internalQuery, setInternalQuery] = useState('');
  const query = search?.value ?? internalQuery;
  const setQuery = search?.onChange ?? setInternalQuery;

  return (
    <View style={{ backgroundColor: colors.background, borderBottomWidth: 1, borderBottomColor: colors.borderLight }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 10,
          paddingHorizontal: hPad,
          paddingVertical: 10,
          maxWidth: maxW,
          alignSelf: isDesktop ? 'center' : undefined,
          width: '100%',
        }}
      >
        {/* Logo */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, flexShrink: 0 }}>
          <View
            style={{
              width: 30,
              height: 30,
              backgroundColor: colors.primary,
              borderRadius: 7,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ color: colors.background, fontWeight: '800', fontSize: fontSize.lg }}>A</Text>
          </View>
          {isTablet && (
            <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
              <Text style={{ fontWeight: '700', fontSize: fontSize.lg, color: colors.text }}>avito</Text>
              <Text style={{ fontWeight: '600', fontSize: fontSize.sm, color: colors.primary }}>.ge</Text>
            </View>
          )}
          {!isTablet && <LangSelect value={lang} onChange={setLang} />}
        </View>

        {/* Search */}
        {showSearch && (
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              borderWidth: 1.5,
              borderColor: colors.primary,
              borderRadius: 9,
              backgroundColor: colors.background,
              paddingHorizontal: 10,
              paddingVertical: isTablet ? 8 : 10,
              gap: 8,
            }}
          >
            <Ionicons name="search-outline" size={17} color={colors.textSecondary} />
            <TextInput
              style={
                {
                  flex: 1,
                  fontSize: fontSize.md,
                  color: colors.text,
                  borderWidth: 0,
                  borderStyle: 'solid',
                  backgroundColor: 'transparent',
                  outlineWidth: 0,
                  paddingVertical: 4,
                  minHeight: 44,
                } as any
              }
              placeholder="Что ищете?"
              placeholderTextColor={colors.textSecondary}
              value={query}
              onChangeText={setQuery}
              onFocus={search?.onFocus}
              onBlur={search?.onBlur}
            />
            {query.length > 0 && (
              <Pressable onPress={() => setQuery('')} accessibilityLabel="Очистить поиск">
                <Text style={{ color: colors.textSecondary, fontSize: fontSize.xl, lineHeight: fontSize.xl }}>×</Text>
              </Pressable>
            )}
          </View>
        )}

        {/* Right */}
        {loggedIn ? (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flexShrink: 0 }}>
            {isTablet && (
              <Pressable
                onPress={onPostPress}
                accessibilityLabel="Подать объявление"
                accessibilityRole="button"
                role="button"
                style={{
                  backgroundColor: colors.primary,
                  borderRadius: 7,
                  paddingHorizontal: 12,
                  paddingVertical: 11,
                  minHeight: 44,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Text style={{ color: colors.background, fontWeight: '700', fontSize: fontSize.sm }}>+ Подать</Text>
              </Pressable>
            )}
            <Pressable
              onPress={onAvatarPress}
              accessibilityLabel="Профиль"
              accessibilityRole="button"
              role="button"
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: colors.primary,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={{ color: colors.background, fontWeight: '700', fontSize: fontSize.md }}>{avatarInitial}</Text>
            </Pressable>
            {isTablet && <LangSelect value={lang} onChange={setLang} />}
          </View>
        ) : (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flexShrink: 0 }}>
            <Pressable
              onPress={onLoginPress}
              accessibilityLabel="Войти"
              accessibilityRole="button"
              role="button"
              style={{
                backgroundColor: colors.primary,
                borderRadius: 7,
                paddingHorizontal: 12,
                paddingVertical: 11,
                minHeight: 44,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text style={{ color: colors.background, fontWeight: '700', fontSize: fontSize.sm }}>Войти</Text>
            </Pressable>
            {isTablet && <LangSelect value={lang} onChange={setLang} />}
          </View>
        )}
      </View>
    </View>
  );
}
