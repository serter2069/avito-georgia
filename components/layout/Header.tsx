import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const C = {
  green: '#00AA6C',
  white: '#FFFFFF',
  text: '#1A1A1A',
  muted: '#9E9E9E',
  border: '#EFEFEF',
};

const LANGS: ('RU' | 'EN' | 'KA')[] = ['RU', 'EN', 'KA'];

function LangSelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <View style={{ position: 'relative', zIndex: 100 }}>
      <Pressable
        onPress={() => setOpen(o => !o)}
        style={{ borderWidth: 1, borderColor: C.border, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 5, flexDirection: 'row', alignItems: 'center', gap: 3, backgroundColor: C.white }}
      >
        <Text style={{ fontSize: 12, fontWeight: '600', color: '#5C5C5C' }}>{value}</Text>
        <Ionicons name={open ? 'chevron-up' : 'chevron-down'} size={10} color={C.muted} />
      </Pressable>
      {open && (
        <View style={{
          position: 'absolute', top: '100%' as any, left: 0, marginTop: 4,
          backgroundColor: C.white, borderRadius: 8, borderWidth: 1, borderColor: C.border,
          overflow: 'hidden', minWidth: 56, zIndex: 200,
          shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1, shadowRadius: 8, elevation: 8,
        }}>
          {LANGS.map(l => (
            <Pressable key={l} onPress={() => { onChange(l); setOpen(false); }}
              style={{ paddingHorizontal: 12, paddingVertical: 9, backgroundColor: value === l ? '#F5F5F5' : C.white }}>
              <Text style={{ fontSize: 12, fontWeight: value === l ? '700' : '400', color: value === l ? C.green : '#5C5C5C' }}>
                {l}
              </Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}

export function Header({ showSearch = false }: { showSearch?: boolean }) {
  const { width } = useWindowDimensions();
  const isMobile = width < 640;
  const isTablet = width >= 640;
  const isDesktop = width >= 1024;
  const router = useRouter();

  const [lang, setLang] = useState<'RU' | 'EN' | 'KA'>('RU');
  const [query, setQuery] = useState('');
  const loggedIn = false;

  const hPad = isDesktop ? 32 : 16;
  const maxW = isDesktop ? 1280 : undefined;

  return (
    <View style={{ backgroundColor: C.white, borderBottomWidth: 1, borderBottomColor: C.border, zIndex: 50 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: hPad, paddingVertical: 10, maxWidth: maxW, alignSelf: isDesktop ? 'center' : undefined, width: '100%' }}>
        {/* Logo */}
        <Pressable onPress={() => router.push('/')} style={{ flexDirection: 'row', alignItems: 'center', gap: 5, flexShrink: 0 }}>
          <View style={{ width: 30, height: 30, backgroundColor: C.green, borderRadius: 7, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: '#fff', fontWeight: '800', fontSize: 17 }}>A</Text>
          </View>
          {isTablet && (
            <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
              <Text style={{ fontWeight: '700', fontSize: 17, color: C.text }}>avito</Text>
              <Text style={{ fontWeight: '600', fontSize: 12, color: C.green }}>.ge</Text>
            </View>
          )}
        </Pressable>
        {isMobile && <LangSelect value={lang} onChange={v => setLang(v as any)} />}

        {/* Search */}
        {showSearch && (
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderColor: C.green, borderRadius: 9, backgroundColor: C.white, paddingHorizontal: 10, paddingVertical: isTablet ? 8 : 10, gap: 8 }}>
            <Ionicons name="search-outline" size={17} color={C.muted} />
            <TextInput
              style={{ flex: 1, fontSize: 14, color: C.text, borderWidth: 0, backgroundColor: 'transparent', outlineWidth: 0, paddingVertical: 0 } as any}
              placeholder="Что ищете?"
              placeholderTextColor={C.muted}
              value={query}
              onChangeText={setQuery}
            />
            {query.length > 0 && (
              <Pressable onPress={() => setQuery('')}>
                <Text style={{ color: C.muted, fontSize: 18, lineHeight: 18 }}>x</Text>
              </Pressable>
            )}
          </View>
        )}

        {!showSearch && <View style={{ flex: 1 }} />}

        {/* Right */}
        {loggedIn ? (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flexShrink: 0 }}>
            <Pressable onPress={() => router.push('/dashboard/profile')} style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: C.green, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ color: '#fff', fontWeight: '700', fontSize: 14 }}>U</Text>
            </Pressable>
            {isTablet && <LangSelect value={lang} onChange={v => setLang(v as any)} />}
          </View>
        ) : (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flexShrink: 0 }}>
            <Pressable onPress={() => router.push('/(auth)' as any)} style={{ backgroundColor: C.green, borderRadius: 7, paddingHorizontal: 12, paddingVertical: 7 }}>
              <Text style={{ color: '#fff', fontWeight: '700', fontSize: 13 }}>Войти</Text>
            </Pressable>
            {isTablet && <LangSelect value={lang} onChange={v => setLang(v as any)} />}
          </View>
        )}
      </View>
    </View>
  );
}
