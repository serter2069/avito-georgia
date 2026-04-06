import { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Modal, Pressable, Platform, Animated, Dimensions } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useResponsive } from '../../hooks/useResponsive';
import { useAuthStore } from '../../stores/authStore';
import { setStoredLang } from '../../lib/i18n';
import { colors } from '../../lib/colors';

const LANGUAGES = [
  { code: 'ru', label: 'RU', flag: '\u{1F1F7}\u{1F1FA}', name: '\u0420\u0443\u0441\u0441\u043A\u0438\u0439' },
  { code: 'en', label: 'EN', flag: '\u{1F1EC}\u{1F1E7}', name: 'English' },
  { code: 'ka', label: 'KA', flag: '\u{1F1EC}\u{1F1EA}', name: '\u10E5\u10D0\u10E0\u10D7\u10E3\u10DA\u10D8' },
] as const;

interface MenuItem {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  path: string;
  authRequired?: boolean;
  guestOnly?: boolean;
}

const MENU_ITEMS: MenuItem[] = [
  { icon: 'home-outline', label: 'home', path: '/' },
  { icon: 'list-outline', label: 'listings', path: '/listings' },
  { icon: 'chatbubble-outline', label: 'messages', path: '/dashboard/messages', authRequired: true },
  { icon: 'heart-outline', label: 'favorites', path: '/dashboard/favorites', authRequired: true },
  { icon: 'person-outline', label: 'profile', path: '/dashboard/profile', authRequired: true },
  { icon: 'log-in-outline', label: 'login', path: '/(auth)', guestOnly: true },
];

interface HeaderProps {
  title?: string;
  showLanguageSwitcher?: boolean;
  showBack?: boolean;
  onBack?: () => void;
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
          borderColor: colors.borderLight,
          backgroundColor: colors.bgSubtle,
          gap: 4,
        }}
        activeOpacity={0.7}
      >
        <Text style={{ fontSize: 14 }}>{currentLang.flag}</Text>
        <Text style={{ fontSize: 12, fontWeight: '600', color: colors.textPrimary }}>{currentLang.label}</Text>
        <Ionicons name={open ? 'chevron-up' : 'chevron-down'} size={12} color={colors.textSubtle} />
      </TouchableOpacity>

      {/* Dropdown overlay + menu */}
      {open && (
        <>
          {/* Transparent overlay to catch outside clicks */}
          <Pressable
            onPress={() => setOpen(false)}
            style={{
              ...Platform.select({
                web: { position: 'fixed' as any },
                default: { position: 'absolute' as any },
              }),
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
              backgroundColor: colors.bgCard,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: colors.borderLight,
              zIndex: 51,
              ...Platform.select({
                web: {
                  boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
                },
                default: {
                  shadowColor: '#000000',
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
                  backgroundColor: i18n.language === lang.code ? colors.bgBrandSubtle : 'transparent',
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
                    color: i18n.language === lang.code ? colors.brandPrimary : colors.textPrimary,
                  }}
                >
                  {lang.name}
                </Text>
                {i18n.language === lang.code && (
                  <View style={{ marginLeft: 'auto' }}>
                    <Ionicons name="checkmark" size={16} color={colors.brandPrimary} />
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

export function Header({ title, showLanguageSwitcher = true, showBack = false, onBack }: HeaderProps) {
  const { t, i18n } = useTranslation();
  const { isDesktop } = useResponsive();
  const router = useRouter();
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const insets = useSafeAreaInsets();
  const [menuOpen, setMenuOpen] = useState(false);
  const slideAnim = useRef(new Animated.Value(0)).current;

  const openMenu = () => {
    setMenuOpen(true);
    Animated.timing(slideAnim, {
      toValue: 1,
      duration: 250,
      useNativeDriver: true,
    }).start();
  };

  const closeMenu = () => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => setMenuOpen(false));
  };

  const navigateTo = (path: string) => {
    closeMenu();
    setTimeout(() => router.push(path as any), 220);
  };

  const visibleItems = MENU_ITEMS.filter((item) => {
    if (item.authRequired && !user) return false;
    if (item.guestOnly && user) return false;
    return true;
  });

  const screenHeight = Dimensions.get('window').height;
  const sheetTranslateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [screenHeight * 0.6, 0],
  });
  const backdropOpacity = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  // Desktop: full navigation bar (no hamburger needed)
  if (isDesktop) {
    return (
      <View className="bg-white border-b border-border px-4 py-3 flex-row items-center justify-between" style={{ paddingTop: Math.max(12, insets.top) }}>
        <View className="flex-row items-center gap-3">
          {showBack && (
            <TouchableOpacity onPress={onBack ?? (() => router.back())} className="mr-1">
              <Ionicons name="chevron-back" size={24} color={colors.brandPrimary} />
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
                <Ionicons name="person-circle-outline" size={24} color={colors.brandPrimary} />
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

  // Mobile/Tablet: compact header with hamburger + bottom sheet menu
  return (
    <View className="bg-white border-b border-border px-4 py-3 flex-row items-center justify-between" style={{ paddingTop: Math.max(12, insets.top) }}>
      <View className="flex-row items-center gap-2 flex-1">
        {showBack && (
          <TouchableOpacity onPress={() => router.back()} className="mr-1">
            <Ionicons name="chevron-back" size={24} color={colors.brandPrimary} />
          </TouchableOpacity>
        )}
        <Text className="text-text-primary text-lg font-bold flex-1" numberOfLines={1}>
          {title || 'Avito Georgia'}
        </Text>
      </View>

      <View className="flex-row items-center gap-2">
        {showLanguageSwitcher && <LanguageDropdown />}

        <TouchableOpacity onPress={openMenu} className="ml-1 p-1">
          <Ionicons name="menu" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <Modal
        visible={menuOpen}
        transparent
        animationType="none"
        onRequestClose={closeMenu}
      >
        {/* Backdrop */}
        <Animated.View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.4)',
            opacity: backdropOpacity,
            justifyContent: 'flex-end',
          }}
        >
          <Pressable style={{ flex: 1 }} onPress={closeMenu} />

          {/* Bottom sheet */}
          <Animated.View
            style={{
              transform: [{ translateY: sheetTranslateY }],
              backgroundColor: colors.bgCard,
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
              paddingBottom: 32,
              maxHeight: '60%',
            }}
          >
            {/* Handle bar */}
            <View style={{ alignItems: 'center', paddingTop: 10, paddingBottom: 12 }}>
              <View
                style={{
                  width: 36,
                  height: 4,
                  borderRadius: 2,
                  backgroundColor: colors.overlayHandle,
                }}
              />
            </View>

            {/* Grid of items - 2 columns */}
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                paddingHorizontal: 24,
                paddingBottom: 8,
              }}
            >
              {visibleItems.map((item) => {
                const isActive = pathname === item.path;
                return (
                  <TouchableOpacity
                    key={item.path}
                    style={{
                      width: '50%',
                      alignItems: 'center',
                      paddingVertical: 16,
                    }}
                    onPress={() => navigateTo(item.path)}
                    activeOpacity={0.6}
                  >
                    <View
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: 12,
                        backgroundColor: isActive ? colors.brandPrimary + '15' : colors.bgMuted,
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: 6,
                      }}
                    >
                      <Ionicons
                        name={item.icon}
                        size={22}
                        color={isActive ? colors.brandPrimary : colors.textSecondary}
                      />
                    </View>
                    <Text
                      style={{
                        fontSize: 12,
                        fontWeight: '500',
                        color: isActive ? colors.brandPrimary : colors.textSecondary,
                        textAlign: 'center',
                      }}
                    >
                      {t(item.label)}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </Animated.View>
        </Animated.View>
      </Modal>
    </View>
  );
}
