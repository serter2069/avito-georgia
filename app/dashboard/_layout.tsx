import { Tabs } from 'expo-router';
import { Text } from 'react-native';
import { useTranslation } from 'react-i18next';

export default function DashboardLayout() {
  const { t } = useTranslation();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#E8F4F8',
          borderTopColor: '#C8E0E8',
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
          paddingTop: 4,
        },
        tabBarActiveTintColor: '#0A7B8A',
        tabBarInactiveTintColor: '#6A8898',
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="messages/index"
        options={{
          title: t('messages'),
          tabBarIcon: ({ focused }) => (
            <Text style={{ fontSize: 20 }}>{focused ? '\u2709\uFE0F' : '\u2709'}</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="messages/[threadId]"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: t('favorites'),
          tabBarIcon: ({ focused }) => (
            <Text style={{ fontSize: 20 }}>{focused ? '\u2764\uFE0F' : '\u2661'}</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t('profile'),
          tabBarIcon: ({ focused }) => (
            <Text style={{ fontSize: 20 }}>{focused ? '\uD83D\uDC64' : '\uD83D\uDC64'}</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: t('settings'),
          tabBarIcon: ({ focused }) => (
            <Text style={{ fontSize: 20 }}>{focused ? '\u2699\uFE0F' : '\u2699'}</Text>
          ),
        }}
      />
      {/* Existing dashboard screens — hidden from tab bar */}
      <Tabs.Screen name="listings" options={{ href: null }} />
      <Tabs.Screen name="payments" options={{ href: null }} />
      <Tabs.Screen name="subscription" options={{ href: null }} />
    </Tabs>
  );
}
