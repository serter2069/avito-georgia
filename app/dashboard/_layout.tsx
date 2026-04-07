import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, AppState } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useState, useEffect, useCallback, useRef } from 'react';
import { colors } from '../../lib/colors';
import { api } from '../../lib/api';
import { useAuthStore } from '../../stores/authStore';

function useUnreadCount() {
  const [count, setCount] = useState(0);
  const user = useAuthStore((s) => s.user);
  const appStateRef = useRef(AppState.currentState);

  const fetchCount = useCallback(async () => {
    if (!user) { setCount(0); return; }
    const res = await api.get<{ count: number }>('/threads/unread-count');
    if (res.ok && res.data) {
      setCount(res.data.count);
    }
  }, [user]);

  useEffect(() => {
    fetchCount();
    // Poll every 30s while app is active
    const interval = setInterval(fetchCount, 30000);
    return () => clearInterval(interval);
  }, [fetchCount]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextState) => {
      if (appStateRef.current.match(/inactive|background/) && nextState === 'active') {
        fetchCount();
      }
      appStateRef.current = nextState;
    });
    return () => subscription.remove();
  }, [fetchCount]);

  return count;
}

function useUnreadNotifCount() {
  const [count, setCount] = useState(0);
  const user = useAuthStore((s) => s.user);
  const appStateRef = useRef(AppState.currentState);

  const fetchCount = useCallback(async () => {
    if (!user) { setCount(0); return; }
    const res = await api.get<{ count: number }>('/notifications/unread-count');
    if (res.ok && res.data) {
      setCount(res.data.count);
    }
  }, [user]);

  useEffect(() => {
    fetchCount();
    const interval = setInterval(fetchCount, 30000);
    return () => clearInterval(interval);
  }, [fetchCount]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextState) => {
      if (appStateRef.current.match(/inactive|background/) && nextState === 'active') {
        fetchCount();
      }
      appStateRef.current = nextState;
    });
    return () => subscription.remove();
  }, [fetchCount]);

  return count;
}

export default function DashboardLayout() {
  const { t } = useTranslation();
  const unreadCount = useUnreadCount();
  const unreadNotifCount = useUnreadNotifCount();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.bgCard,
          borderTopColor: colors.borderDefault,
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
          paddingTop: 4,
        },
        tabBarActiveTintColor: colors.brandPrimary,
        tabBarInactiveTintColor: colors.textMuted,
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
          tabBarIcon: ({ focused, color }) => (
            <View>
              <Ionicons name={focused ? 'chatbubbles' : 'chatbubbles-outline'} size={22} color={color} />
              {unreadCount > 0 && (
                <View
                  style={{
                    position: 'absolute',
                    top: -4,
                    right: -6,
                    backgroundColor: colors.statusErrorAlt,
                    borderRadius: 9,
                    minWidth: 18,
                    height: 18,
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingHorizontal: 3,
                  }}
                >
                  <Text style={{ color: colors.white, fontSize: 10, fontWeight: '700', lineHeight: 12 }}>
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </Text>
                </View>
              )}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="messages/[threadId]"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: t('notifications'),
          tabBarIcon: ({ focused, color }) => (
            <View>
              <Ionicons name={focused ? 'notifications' : 'notifications-outline'} size={22} color={color} />
              {unreadNotifCount > 0 && (
                <View
                  style={{
                    position: 'absolute',
                    top: -4,
                    right: -6,
                    backgroundColor: colors.statusErrorAlt,
                    borderRadius: 9,
                    minWidth: 18,
                    height: 18,
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingHorizontal: 3,
                  }}
                >
                  <Text style={{ color: colors.white, fontSize: 10, fontWeight: '700', lineHeight: 12 }}>
                    {unreadNotifCount > 99 ? '99+' : unreadNotifCount}
                  </Text>
                </View>
              )}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: t('favorites'),
          tabBarIcon: ({ focused, color }) => (
            <Ionicons name={focused ? 'heart' : 'heart-outline'} size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t('profile'),
          tabBarIcon: ({ focused, color }) => (
            <Ionicons name={focused ? 'person' : 'person-outline'} size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: t('settings'),
          tabBarIcon: ({ focused, color }) => (
            <Ionicons name={focused ? 'settings' : 'settings-outline'} size={22} color={color} />
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
