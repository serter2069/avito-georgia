import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useBreakpoint, isDesktop } from '../../lib/responsive';

type IoniconsName = keyof typeof Ionicons.glyphMap;

interface Tab {
  label: string;
  iconDefault: IoniconsName;
  iconActive: IoniconsName;
  path: string;
}

const TABS: Tab[] = [
  { label: 'Home', iconDefault: 'home-outline', iconActive: 'home', path: '/' },
  { label: 'Listings', iconDefault: 'grid-outline', iconActive: 'grid', path: '/listings' },
  { label: 'Create', iconDefault: 'add-circle-outline', iconActive: 'add-circle', path: '/listings/create' },
  { label: 'Favorites', iconDefault: 'heart-outline', iconActive: 'heart', path: '/dashboard/favorites' },
  { label: 'Profile', iconDefault: 'person-circle-outline', iconActive: 'person-circle', path: '/dashboard/profile' },
];

export function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();
  const breakpoint = useBreakpoint();
  const insets = useSafeAreaInsets();

  // Hide on desktop
  if (isDesktop(breakpoint)) return null;

  // Hide on auth pages
  if (pathname.startsWith('/(auth)') || pathname.startsWith('/auth')) return null;

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  };

  return (
    <View
      style={{
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#C8E0E8',
        paddingBottom: insets.bottom,
      }}
    >
      {TABS.map((tab) => {
        const active = isActive(tab.path);
        return (
          <TouchableOpacity
            key={tab.path}
            style={{
              flex: 1,
              alignItems: 'center',
              paddingVertical: 8,
            }}
            onPress={() => router.push(tab.path as any)}
          >
            <Ionicons
              name={active ? tab.iconActive : tab.iconDefault}
              size={24}
              color={active ? '#0A7B8A' : '#6A8898'}
            />
            <Text
              style={{
                fontSize: 10,
                color: active ? '#0A7B8A' : '#6A8898',
                marginTop: 2,
              }}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
