import { useState, useEffect } from 'react';
import { View, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Settings from '../../components/screens/Settings';
import { apiFetch } from '../../lib/api';
import { useAuthStore } from '../../store/auth';

export default function SettingsPage() {
  const [prefs, setPrefs] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const { logout, user, fetchMe } = useAuthStore();

  useEffect(() => {
    apiFetch('/users/me/notification-prefs')
      .then(r => {
        const map: Record<string, boolean> = {};
        (r.prefs || []).forEach((p: { type: string; enabled: boolean }) => { map[p.type] = p.enabled; });
        setPrefs(map);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleToggle = async (type: string, enabled: boolean) => {
    setPrefs(prev => ({ ...prev, [type]: enabled }));
    apiFetch('/users/me/notification-prefs', {
      method: 'PUT',
      body: JSON.stringify({ type, enabled }),
    }).catch(console.error);
  };

  const handleChangeLang = async (lang: string) => {
    try {
      await apiFetch('/users/me', { method: 'PATCH', body: JSON.stringify({ locale: lang }) });
      await fetchMe();
    } catch (e) {
      console.error('Failed to save language', e);
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Удалить аккаунт',
      'Аккаунт и все данные будут удалены безвозвратно через 30 дней. Продолжить?',
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Удалить',
          style: 'destructive',
          onPress: async () => {
            try {
              await apiFetch('/users/me', { method: 'DELETE' });
              logout();
            } catch (e) {
              console.error('Failed to delete account', e);
              Alert.alert('Ошибка', 'Не удалось удалить аккаунт. Попробуйте позже.');
            }
          },
        },
      ]
    );
  };

  if (loading) return <SafeAreaView edges={['top']} style={{ flex: 1 }}><View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}><ActivityIndicator /></View></SafeAreaView>;
  return (
    <SafeAreaView edges={['top']} style={{ flex: 1 }}>
    <Settings
      showBottomNav={false}
      prefs={prefs}
      onToggle={handleToggle}
      onLogout={logout}
      onDeleteAccount={handleDeleteAccount}
      onChangeLang={handleChangeLang}
      currentLang={(user as any)?.locale || 'ru'}
    />
    </SafeAreaView>
  );
}
