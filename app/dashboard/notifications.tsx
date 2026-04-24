import { useState, useEffect } from 'react';
import { View, Text, Switch, ActivityIndicator, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { apiFetch } from '../../lib/api';
import { colors } from '../../lib/theme';

const NOTIF_ITEMS = [
  { type: 'new_message', label: 'Новые сообщения' },
  { type: 'listing_expired', label: 'Объявление истекает' },
  { type: 'promo', label: 'Акции и новости' },
];

export default function NotificationsPage() {
  const { width } = useWindowDimensions();
  const maxWidth = width >= 640 ? 520 : undefined;
  const [prefs, setPrefs] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch('/users/me/notification-prefs')
      .then(r => {
        const map: Record<string, boolean> = {};
        (r.prefs || []).forEach((p: { type: string; enabled: boolean }) => {
          map[p.type] = p.enabled;
        });
        setPrefs(map);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleToggle = async (type: string) => {
    const enabled = !prefs[type];
    setPrefs(prev => ({ ...prev, [type]: enabled }));
    apiFetch('/users/me/notification-prefs', {
      method: 'PUT',
      body: JSON.stringify({ type, enabled }),
    }).catch(console.error);
  };

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: colors.background }}>
      <Stack.Screen options={{ headerShown: true, title: 'Уведомления' }} />
      <View style={{ flex: 1, maxWidth, width: '100%', alignSelf: 'center', padding: 16 }}>
        {loading ? (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <ActivityIndicator />
          </View>
        ) : (
          <>
            <View style={{ backgroundColor: '#fff', borderRadius: 12, overflow: 'hidden', borderWidth: 1, borderColor: colors.border }}>
              {NOTIF_ITEMS.map((item, i) => (
                <View key={item.type}>
                  {i > 0 && <View style={{ height: 1, backgroundColor: colors.border, marginLeft: 16 }} />}
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      paddingVertical: 14,
                      paddingHorizontal: 16,
                    }}
                  >
                    <Text style={{ fontSize: 15, color: colors.text }}>{item.label}</Text>
                    <Switch
                      value={prefs[item.type] ?? false}
                      onValueChange={() => handleToggle(item.type)}
                      trackColor={{ false: '#E0E0E0', true: colors.primary }}
                      thumbColor="#fff"
                    />
                  </View>
                </View>
              ))}
            </View>
            <Text style={{ fontSize: 12, color: colors.textSecondary, marginTop: 10, marginHorizontal: 4 }}>
              Уведомления отправляются на email
            </Text>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}
