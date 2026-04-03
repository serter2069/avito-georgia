import { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, Pressable, Platform } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useResponsive } from '../../hooks/useResponsive';
import { useAuthStore } from '../../stores/authStore';
import { setStoredLang } from '../../lib/i18n';

const LANGUAGES = [
  { code: 'ru', label: 'RU', flag: '\u{1F1F7}\u{1F1FA}', name: '\u0420\u0443\u0441\u0441\u043A\u0438\u0439' },
  { code: 'en', label: 'EN', flag: '\u{1F1EC}\u{1F1E7}', name: 'English' },
  { code: 'ka', label: 'KA', flag: '\u{1F1EC}\u{1F1EA}', name: '\u10E5\u10D0\u10E0\u10D7\u10E3\u10DA\u10D8' },
] as const;

interface HeaderProps {
  title?: string;
  showLanguageSwitcher?: boolean;
  showBack?: boolean;
}

function LanguageDropdown() {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);

  const currentLang = LANGUAGES.find((l) => l.code === i18n.language) || LANGUAGES[0];

  const switchLanguage = async (lang: string) => {
    setOpen(false);
    await i18n.changeLanguage(lang);
    await setStoredLang(lang);
  };

  return (
    <View style={{ position: 'relative', zIndex: 50 }}>
      {/* Trigger pill */}
      <TouchableOpacity
        onPress={() => setOpen((v) => !v)}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          height: 32,
          paddingHorizontal: 8,
          borderRadius: 16,
          borderWidth: 1,
          borderColor: '#E2E8F0',
          backgroundColor: '#F8FAFC',
          gap: 4,
        }}
        activeOpacity={0.7}
      >
        <Text style={{ fontSize: 14 }}>{currentLang.flag}</Text>
        <Text style={{ fontSize: 12, fontWeight: '600', color: '#0A2840' }}>{currentLang.label}</Text>
        <Ionicons name={open ? 'chevron-up' : 'chevron-down'} size={12} color="#64748B" />
      </TouchableOpacity>

      {/* Dropdown overlay + menu */}
      {open && (
        <>
          {/* Transparent overlay to catch outside clicks */}
          <Pressable
            onPress={() => setOpen(false)}
            style={{
              position: 'fixed' as any,
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 49,
            }}
          />

          {/* Dropdown menu */}
          <View
            style={{
              position: 'absolute',
              top: 36,
              right: 0,
              minWidth: 160,
              backgroundColor: '#FFFFFF',
              borderRadius: 8,
              borderWidth: 1,
              borderColor: '#E2E8F0',
              zIndex: 51,
              ...Platform.select({
                web: {
                  boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
                },
                default: {
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.12,
                  shadowRadius: 12,
                  elevation: 8,
                },
              }),
            }}
          >
            {LANGUAGES.map((lang, idx) => (
              <TouchableOpacity
                key={lang.code}
                onPress={() => switchLanguage(lang.code)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingHorizontal: 12,
                  paddingVertical: 10,
                  gap: 8,
                  backgroundColor: i18n.language === lang.code ? '#F0FDFA' : 'transparent',
                  borderTopLeftRadius: idx === 0 ? 8 : 0,
                  borderTopRightRadius: idx === 0 ? 8 : 0,
                  borderBottomLeftRadius: idx === LANGUAGES.length - 1 ? 8 : 0,
                  borderBottomRightRadius: idx === LANGUAGES.length - 1 ? 8 : 0,
                }}
                activeOpacity={0.6}
              >
                <Text style={{ fontSize: 16 }}>{lang.flag}</Text>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: i18n.language === lang.code ? '600' : '400',
                    color: i18n.language === lang.code ? '#0A7B8A' : '#0A2840',
                  }}
                >
                  {lang.name}
                </Text>
                {i18n.language === lang.code && (
                  <View style={{ marginLeft: 'auto' }}>
                    <Ionicons name="checkmark" size={16} color="#0A7B8A" />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </>
      )}
    </View>
  );
}

export function Header({ title, showLanguageSwitcher = true, showBack = false }: HeaderProps) {
  const { t, i18n } = useTranslation();
  const { isDesktop } = useResponsive();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const [menuOpen, setMenuOpen] = useState(false);

  const navigateTo = (path: string) => {
    setMenuOpen(false);
    router.push(path as any);
  };

  // Desktop: full navigation bar (no hamburger needed)
  if (isDesktop) {
    return (
      <View className="bg-white border-b border-border px-4 py-3 flex-row items-center justify-between">
        <View className="flex-row items-center gap-3">
          {showBack && (
            <TouchableOpacity onPress={() => router.back()} className="mr-1">
              <Ionicons name="chevron-back" size={24} color="#0A7B8A" />
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={() => router.push('/')}>
            <Text className="text-text-primary text-lg font-bold">
              {title || 'Avito Georgia'}
            </Text>
          </TouchableOpacity>
        </View>

        <View className="flex-row items-center gap-6">
          <TouchableOpacity onPress={() => router.push('/listings')}>
            <Text className="text-text-secondary text-sm font-medium">{t('listings')}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/search')}>
            <Text className="text-text-secondary text-sm font-medium">{t('search')}</Text>
          </TouchableOpacity>
          {user ? (
            <>
              <TouchableOpacity onPress={() => router.push('/dashboard/messages')}>
                <Text className="text-text-secondary text-sm font-medium">{t('messages')}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => router.push('/dashboard/favorites')}>
                <Text className="text-text-secondary text-sm font-medium">{t('favorites')}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => router.push('/dashboard/profile')}>
                <Ionicons name="person-circle-outline" size={24} color="#0A7B8A" />
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity
              className="bg-primary px-4 py-1.5 rounded-lg"
              onPress={() => router.push('/(auth)')}
            >
              <Text className="text-white text-sm font-medium">{t('login')}</Text>
            </TouchableOpacity>
          )}

          {showLanguageSwitcher && <LanguageDropdown />}
        </View>
      </View>
    );
  }

  // Mobile/Tablet: compact header with hamburger menu
  return (
    <View className="bg-white border-b border-border px-4 py-3 flex-row items-center justify-between">
      <View className="flex-row items-center gap-2 flex-1">
        {showBack && (
          <TouchableOpacity onPress={() => router.back()} className="mr-1">
            <Ionicons name="chevron-back" size={24} color="#0A7B8A" />
          </TouchableOpacity>
        )}
        <Text className="text-text-primary text-lg font-bold flex-1" numberOfLines={1}>
          {title || 'Avito Georgia'}
        </Text>
      </View>

      <View className="flex-row items-center gap-2">
        {showLanguageSwitcher && <LanguageDropdown />}

        <TouchableOpacity onPress={() => setMenuOpen(true)} className="ml-1 p-1">
          <Ionicons name="menu" size={24} color="#0A2840" />
        </TouchableOpacity>
      </View>

      <Modal
        visible={menuOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuOpen(false)}
      >
        <Pressable
          style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)' }}
          onPress={() => setMenuOpen(false)}
        >
          <View
            style={{ position: 'absolute', top: 0, right: 0, width: 240, height: '100%', backgroundColor: '#FFFFFF', paddingTop: 56, paddingHorizontal: 16 }}
          >
            <TouchableOpacity onPress={() => setMenuOpen(false)} style={{ position: 'absolute', top: 16, right: 16 }}>
              <Ionicons name="close" size={24} color="#0A2840" />
            </TouchableOpacity>

            <TouchableOpacity className="py-3 flex-row items-center gap-3" onPress={() => navigateTo('/listings')}>
              <Ionicons name="list-outline" size={20} color="#0A7B8A" />
              <Text className="text-text-primary text-base">{t('listings')}</Text>
            </TouchableOpacity>

            <TouchableOpacity className="py-3 flex-row items-center gap-3" onPress={() => navigateTo('/my/listings')}>
              <Ionicons name="albums-outline" size={20} color="#0A7B8A" />
              <Text className="text-text-primary text-base">{t('myListings')}</Text>
            </TouchableOpacity>

            <TouchableOpacity className="py-3 flex-row items-center gap-3" onPress={() => navigateTo('/dashboard/favorites')}>
              <Ionicons name="heart-outline" size={20} color="#0A7B8A" />
              <Text className="text-text-primary text-base">{t('favorites')}</Text>
            </TouchableOpacity>

            {user ? (
              <TouchableOpacity className="py-3 flex-row items-center gap-3" onPress={() => navigateTo('/dashboard/profile')}>
                <Ionicons name="person-outline" size={20} color="#0A7B8A" />
                <Text className="text-text-primary text-base">{t('profile')}</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity className="py-3 flex-row items-center gap-3" onPress={() => navigateTo('/(auth)')}>
                <Ionicons name="log-in-outline" size={20} color="#0A7B8A" />
                <Text className="text-text-primary text-base">{t('login')}</Text>
              </TouchableOpacity>
            )}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}
