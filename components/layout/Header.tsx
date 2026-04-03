import { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useBreakpoint } from '../../lib/responsive';
import { useAuthStore } from '../../stores/authStore';
import { BurgerMenu } from './BurgerMenu';

const LANGUAGES = [
  { code: 'ru', label: 'RU' },
  { code: 'en', label: 'EN' },
  { code: 'ka', label: 'KA' },
] as const;

const NAV_LINKS = [
  { label: 'Главная', path: '/' },
  { label: 'Объявления', path: '/listings' },
  { label: 'Создать', path: '/listings/create' },
  { label: 'Сообщения', path: '/dashboard/messages' },
];

function LanguageSwitcher() {
  const { i18n } = useTranslation();

  return (
    <View style={{ flexDirection: 'row', gap: 4 }}>
      {LANGUAGES.map((lang) => (
        <TouchableOpacity
          key={lang.code}
          style={{
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 6,
            backgroundColor: i18n.language === lang.code ? '#0A7B8A' : '#F2F8FA',
          }}
          onPress={() => i18n.changeLanguage(lang.code)}
        >
          <Text
            style={{
              fontSize: 12,
              fontWeight: '600',
              color: i18n.language === lang.code ? '#FFFFFF' : '#6A8898',
            }}
          >
            {lang.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

export function Header() {
  const breakpoint = useBreakpoint();
  const router = useRouter();
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const [burgerOpen, setBurgerOpen] = useState(false);

  const isMobileView = breakpoint === 'mobile';

  return (
    <>
      <View
        style={{
          height: 56,
          backgroundColor: '#FFFFFF',
          borderBottomWidth: 1,
          borderBottomColor: '#C8E0E8',
          paddingHorizontal: 16,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {isMobileView ? (
          <>
            {/* Mobile: burger + title + avatar/login */}
            <TouchableOpacity onPress={() => setBurgerOpen(true)}>
              <Ionicons name="menu" size={24} color="#0A2840" />
            </TouchableOpacity>

            <Text style={{ fontSize: 18, fontWeight: '700', color: '#0A2840' }}>
              Avito Georgia
            </Text>

            {user ? (
              <View
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  backgroundColor: '#0A7B8A',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text style={{ color: '#FFFFFF', fontSize: 14, fontWeight: '600' }}>
                  {user.email?.[0]?.toUpperCase() || 'U'}
                </Text>
              </View>
            ) : (
              <TouchableOpacity onPress={() => router.push('/(auth)' as any)}>
                <Text style={{ color: '#0A7B8A', fontSize: 14, fontWeight: '600' }}>
                  Войти
                </Text>
              </TouchableOpacity>
            )}
          </>
        ) : (
          <>
            {/* Desktop/Tablet: logo + nav links + lang switcher + avatar/login */}
            <Text style={{ fontSize: 18, fontWeight: '700', color: '#0A2840' }}>
              Avito Georgia
            </Text>

            <View style={{ flexDirection: 'row', gap: 24, alignItems: 'center' }}>
              {NAV_LINKS.map((link) => {
                const active = pathname === link.path || (link.path !== '/' && pathname.startsWith(link.path));
                return (
                  <TouchableOpacity key={link.path} onPress={() => router.push(link.path as any)}>
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: active ? '600' : '400',
                        color: active ? '#0A7B8A' : '#0A2840',
                      }}
                    >
                      {link.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
              <LanguageSwitcher />
              {user ? (
                <View
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 16,
                    backgroundColor: '#0A7B8A',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Text style={{ color: '#FFFFFF', fontSize: 14, fontWeight: '600' }}>
                    {user.email?.[0]?.toUpperCase() || 'U'}
                  </Text>
                </View>
              ) : (
                <TouchableOpacity onPress={() => router.push('/(auth)' as any)}>
                  <Text style={{ color: '#0A7B8A', fontSize: 14, fontWeight: '600' }}>
                    Войти
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </>
        )}
      </View>

      {burgerOpen && <BurgerMenu onClose={() => setBurgerOpen(false)} />}
    </>
  );
}
