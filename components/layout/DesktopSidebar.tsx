import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { usePathname, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';

type IoniconsName = keyof typeof Ionicons.glyphMap;

interface NavItem {
  labelKey: string;
  iconDefault: IoniconsName;
  iconActive: IoniconsName;
  path: string;
}

const NAV_ITEMS: NavItem[] = [
  { labelKey: 'home', iconDefault: 'home-outline', iconActive: 'home', path: '/' },
  { labelKey: 'listings', iconDefault: 'grid-outline', iconActive: 'grid', path: '/listings' },
  { labelKey: 'createListing', iconDefault: 'add-circle-outline', iconActive: 'add-circle', path: '/listings/create' },
  { labelKey: 'messages', iconDefault: 'chatbubble-outline', iconActive: 'chatbubble', path: '/dashboard/messages' },
  { labelKey: 'favorites', iconDefault: 'heart-outline', iconActive: 'heart', path: '/dashboard/favorites' },
  { labelKey: 'profile', iconDefault: 'person-circle-outline', iconActive: 'person-circle', path: '/dashboard/profile' },
  { labelKey: 'settings', iconDefault: 'settings-outline', iconActive: 'settings', path: '/dashboard/settings' },
];

export function DesktopSidebar() {
  const { t } = useTranslation();
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  };

  return (
    <View
      style={{ width: 260 }}
      className="bg-white border-r border-border py-4"
    >
      {NAV_ITEMS.map((item) => {
        const active = isActive(item.path);
        return (
          <TouchableOpacity
            key={item.path}
            className={`flex-row items-center px-5 py-3 mx-2 rounded-lg ${
              active ? 'bg-surface' : ''
            }`}
            onPress={() => router.push(item.path as any)}
            activeOpacity={0.7}
          >
            <Ionicons
              name={active ? item.iconActive : item.iconDefault}
              size={22}
              color={active ? '#0A7B8A' : '#6A8898'}
              style={{ width: 28 }}
            />
            <Text
              className={`text-base font-medium ${
                active ? 'text-primary' : 'text-text-muted'
              }`}
            >
              {t(item.labelKey)}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
