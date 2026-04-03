import { View, Text, TouchableOpacity } from 'react-native';
import { usePathname, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';

interface NavItem {
  labelKey: string;
  icon: string;
  path: string;
}

const NAV_ITEMS: NavItem[] = [
  { labelKey: 'home', icon: '\u2302', path: '/' },
  { labelKey: 'listings', icon: '\u2630', path: '/listings' },
  { labelKey: 'createListing', icon: '\u2795', path: '/listings/create' },
  { labelKey: 'messages', icon: '\u2709', path: '/dashboard/messages' },
  { labelKey: 'favorites', icon: '\u2661', path: '/dashboard/favorites' },
  { labelKey: 'profile', icon: '\u263A', path: '/dashboard/profile' },
  { labelKey: 'settings', icon: '\u2699', path: '/dashboard/settings' },
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
            <Text
              className={`text-lg ${active ? 'text-primary' : 'text-text-muted'}`}
              style={{ width: 28 }}
            >
              {item.icon}
            </Text>
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
