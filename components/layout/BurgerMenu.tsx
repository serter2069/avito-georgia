import { View, Text, TouchableOpacity, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';

interface BurgerMenuProps {
  onClose: () => void;
}

const NAV_ITEMS: { icon: keyof typeof Ionicons.glyphMap; label: string; path: string }[] = [
  { icon: 'home-outline', label: 'Главная', path: '/' },
  { icon: 'list-outline', label: 'Объявления', path: '/listings' },
  { icon: 'add-circle-outline', label: 'Создать', path: '/listings/create' },
  { icon: 'chatbubble-outline', label: 'Сообщения', path: '/dashboard/messages' },
  { icon: 'heart-outline', label: 'Избранное', path: '/dashboard/favorites' },
  { icon: 'person-outline', label: 'Профиль', path: '/dashboard/profile' },
  { icon: 'settings-outline', label: 'Настройки', path: '/dashboard/settings' },
];

export function BurgerMenu({ onClose }: BurgerMenuProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleNavigate = (path: string) => {
    onClose();
    router.push(path as any);
  };

  return (
    <View
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1000,
        flexDirection: 'row',
      }}
    >
      {/* Left panel */}
      <View
        style={{
          width: 280,
          backgroundColor: '#FFFFFF',
          height: '100%',
          paddingTop: 16,
        }}
      >
        {/* Close button */}
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', paddingHorizontal: 16, marginBottom: 16 }}>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color="#0A2840" />
          </TouchableOpacity>
        </View>

        {/* Nav items */}
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.path || (item.path !== '/' && pathname.startsWith(item.path));
          return (
            <TouchableOpacity
              key={item.path}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 16,
                paddingVertical: 12,
                backgroundColor: active ? '#E8F4F8' : 'transparent',
              }}
              onPress={() => handleNavigate(item.path)}
            >
              <Ionicons
                name={item.icon}
                size={22}
                color={active ? '#0A7B8A' : '#6A8898'}
              />
              <Text
                style={{
                  marginLeft: 12,
                  fontSize: 15,
                  fontWeight: active ? '600' : '400',
                  color: active ? '#0A7B8A' : '#0A2840',
                }}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Backdrop */}
      <Pressable
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.5)',
        }}
        onPress={onClose}
      />
    </View>
  );
}
