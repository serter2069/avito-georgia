import { useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import Settings from '../../components/screens/Settings';
import { apiFetch } from '../../lib/api';
import { useAuthStore } from '../../store/auth';

export default function SettingsPage() {
  const [prefs, setPrefs] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const { logout } = useAuthStore();

  useEffect(() => {
    apiFetch('/users/me/notification-prefs')
      .then(r => {
        const map: Record<string, boolean> = {};
        (r.prefs || []).forEach((p: any) => { map[p.type] = p.enabled; });
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

  if (loading) return <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}><ActivityIndicator /></View>;
  return <Settings showBottomNav={false} prefs={prefs} onToggle={handleToggle} onLogout={logout} />;
}
