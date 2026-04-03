import { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, Pressable } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useResponsive } from '../../hooks/useResponsive';
import { useAuthStore } from '../../stores/authStore';
import { setStoredLang } from '../../lib/i18n';

const LANGUAGES = [
  { code: 'ru', label: 'RU' },
  { code: 'en', label: 'EN' },
  { code: 'ka', label: 'KA' },
] as const;

interface HeaderProps {
  title?: string;
  showLanguageSwitcher?: boolean;
}

export function Header({ title, showLanguageSwitcher = true }: HeaderProps) {
  const { t, i18n } = useTranslation();
  const { isDesktop } = useResponsive();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const [menuOpen, setMenuOpen] = useState(false);

  const switchLanguage = async (lang: string) => {
    await i18n.changeLanguage(lang);
    await setStoredLang(lang);
  };

  const navigateTo = (path: string) => {
    setMenuOpen(false);
    router.push(path as any);
  };

  // Desktop: full navigation bar (no hamburger needed)
  if (isDesktop) {
    return (
      <View className="bg-white border-b border-border px-4 py-3 flex-row items-center justify-between">
        <TouchableOpacity onPress={() => router.push('/')}>
          <Text className="text-text-primary text-lg font-bold">
            {title || 'Avito Georgia'}
          </Text>
        </TouchableOpacity>

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

          {showLanguageSwitcher && (
            <View className="flex-row gap-1">
              {LANGUAGES.map((lang) => (
                <TouchableOpacity
                  key={lang.code}
                  className={`px-2 py-1 rounded-md ${
                    i18n.language === lang.code
                      ? 'bg-primary'
                      : 'bg-surface'
                  }`}
                  onPress={() => switchLanguage(lang.code)}
                >
                  <Text
                    className={`text-xs font-semibold ${
                      i18n.language === lang.code
                        ? 'text-white'
                        : 'text-text-secondary'
                    }`}
                  >
                    {lang.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </View>
    );
  }

  // Mobile/Tablet: compact header with hamburger menu
  return (
    <View className="bg-white border-b border-border px-4 py-3 flex-row items-center justify-between">
      <Text className="text-text-primary text-lg font-bold">
        {title || 'Avito Georgia'}
      </Text>

      <View className="flex-row items-center gap-2">
        {showLanguageSwitcher && (
          <View className="flex-row gap-1">
            {LANGUAGES.map((lang) => (
              <TouchableOpacity
                key={lang.code}
                className={`px-2 py-1 rounded-md ${
                  i18n.language === lang.code
                    ? 'bg-primary'
                    : 'bg-surface'
                }`}
                onPress={() => switchLanguage(lang.code)}
              >
                <Text
                  className={`text-xs font-semibold ${
                    i18n.language === lang.code
                      ? 'text-white'
                      : 'text-text-secondary'
                  }`}
                >
                  {lang.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

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
