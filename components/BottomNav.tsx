import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';

type TabId = 'home' | 'browse' | 'post' | 'messages' | 'profile';

interface BottomNavProps {
  active?: TabId;
}

const TABS: { id: TabId; label: string; route: string; icon: keyof typeof Ionicons.glyphMap; iconActive: keyof typeof Ionicons.glyphMap; isAction?: boolean }[] = [
  { id: 'home',     label: 'Главная',  route: '/',                   icon: 'home-outline',       iconActive: 'home' },
  { id: 'browse',   label: 'Каталог',  route: '/listings',           icon: 'grid-outline',       iconActive: 'grid' },
  { id: 'post',     label: 'Подать',   route: '/listings/create',    icon: 'add',                iconActive: 'add',          isAction: true },
  { id: 'messages', label: 'Чаты',     route: '/dashboard/messages', icon: 'chatbubble-outline', iconActive: 'chatbubble' },
  { id: 'profile',  label: 'Профиль',  route: '/dashboard/profile',  icon: 'person-outline',     iconActive: 'person' },
];

const ROUTE_MAP: Record<TabId, string> = {
  home: '/',
  browse: '/listings',
  post: '/listings/create',
  messages: '/dashboard/messages',
  profile: '/dashboard/profile',
};

function isTabActive(tabId: TabId, pathname: string, activeProp?: TabId): boolean {
  if (activeProp) return tabId === activeProp;
  const route = ROUTE_MAP[tabId];
  if (route === '/') return pathname === '/';
  return pathname.startsWith(route);
}

export default function BottomNav({ active }: BottomNavProps) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <View style={{
      flexDirection: 'row',
      borderTopWidth: 1,
      borderTopColor: '#E0E0E0',
      backgroundColor: '#FFFFFF',
      paddingBottom: 8,
      paddingTop: 6,
    }}>
      {TABS.map((tab) => {
        const isActive = isTabActive(tab.id, pathname, active);

        if (tab.isAction) {
          return (
            <Pressable
              key={tab.id}
              onPress={() => router.push(tab.route as any)}
              style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
            >
              <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: '#00AA6C', alignItems: 'center', justifyContent: 'center', marginTop: -10 }}>
                <Ionicons name="add" size={26} color="#FFFFFF" />
              </View>
              <Text style={{ fontSize: 10, color: '#9E9E9E', marginTop: 2 }}>{tab.label}</Text>
            </Pressable>
          );
        }

        return (
          <Pressable
            key={tab.id}
            onPress={() => router.push(tab.route as any)}
            style={{ flex: 1, alignItems: 'center', gap: 3, paddingTop: 2 }}
          >
            <Ionicons
              name={isActive ? tab.iconActive : tab.icon}
              size={22}
              color={isActive ? '#00AA6C' : '#9E9E9E'}
            />
            <Text style={{ fontSize: 10, color: isActive ? '#00AA6C' : '#9E9E9E', fontWeight: isActive ? '600' : '400' }}>
              {tab.label}
            </Text>
            {isActive && <View style={{ position: 'absolute', bottom: -6, width: 4, height: 4, borderRadius: 2, backgroundColor: '#00AA6C' }} />}
          </Pressable>
        );
      })}
    </View>
  );
}
