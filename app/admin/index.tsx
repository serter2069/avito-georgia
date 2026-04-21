import { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { apiFetch } from '../../lib/api';
import { ErrorState } from '../../components/ErrorState';
import { colors } from '../../lib/theme';

function StatCard({ label, value, color = colors.primary }: { label: string; value: string | number; color?: string }) {
  return (
    <View style={{ flex: 1, minWidth: '45%', backgroundColor: colors.background, borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#E8E8E8' }}>
      <Text style={{ fontSize: 24, fontWeight: '800', color }}>{value}</Text>
      <Text style={{ fontSize: 12, color: colors.textSecondary, marginTop: 4 }}>{label}</Text>
    </View>
  );
}

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);
  const [activity, setActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = async () => {
    setLoading(true); setError(false);
    try {
      const [statsRes, logRes] = await Promise.all([
        apiFetch('/admin/stats'),
        apiFetch('/admin/audit-log?limit=10'),
      ]);
      setStats(statsRes);
      setActivity(logRes.logs ?? []);
    } catch { setError(true); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const nav = [
    { label: 'Модерация', icon: '📋', route: '/admin/moderation' },
    { label: 'Пользователи', icon: '👥', route: '/admin/users' },
    { label: 'Категории', icon: '📁', route: '/admin/categories' },
    { label: 'Финансы', icon: '💰', route: '/admin/finance' },
  ];

  if (loading) return <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}><ActivityIndicator color={colors.primary} size="large" /></View>;
  if (error) return <ErrorState message="Не удалось загрузить статистику" onRetry={load} />;

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: colors.surface }}>
      {/* Header */}
      <View style={{ backgroundColor: colors.primary, paddingBottom: 20, paddingHorizontal: 20 }}>
        <Text style={{ fontSize: 22, fontWeight: '800', color: colors.background }}>Администрирование</Text>
        <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', marginTop: 2 }}>Avito Georgia</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, gap: 16 }}>
        {/* Stats */}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
          <StatCard label="Всего объявлений" value={stats?.totalListings ?? 0} />
          <StatCard label="Пользователей" value={stats?.totalUsers ?? 0} />
          <StatCard label="На модерации" value={stats?.pendingModeration ?? 0} color="#F59E0B" />
          <StatCard label="Выручка (мес.)" value={`₾${stats?.paymentsThisMonth?.sum ?? 0}`} />
        </View>

        {/* Nav tiles */}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
          {nav.map(n => (
            <Pressable
              key={n.route}
              onPress={() => router.push(n.route as any)}
              accessibilityLabel={`Открыть ${n.label}`}
              style={{ flex: 1, minWidth: '45%', backgroundColor: colors.background, borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#E8E8E8', alignItems: 'center', gap: 8 }}
            >
              <Text style={{ fontSize: 28 }}>{n.icon}</Text>
              <Text style={{ fontSize: 14, fontWeight: '600', color: colors.text }}>{n.label}</Text>
            </Pressable>
          ))}
        </View>

        {/* Recent activity */}
        {activity.length > 0 && (
          <View style={{ backgroundColor: colors.background, borderRadius: 12, borderWidth: 1, borderColor: '#E8E8E8', overflow: 'hidden' }}>
            <Text style={{ fontSize: 14, fontWeight: '700', color: colors.text, padding: 16, borderBottomWidth: 1, borderBottomColor: '#E8E8E8' }}>Последние действия</Text>
            {activity.slice(0, 8).map((a, i) => (
              <View key={i} style={{ padding: 14, borderBottomWidth: i < activity.length - 1 ? 1 : 0, borderBottomColor: '#E8E8E8' }}>
                <Text style={{ fontSize: 13, color: colors.text }}>{a.action ?? JSON.stringify(a).slice(0, 60)}</Text>
                <Text style={{ fontSize: 11, color: colors.textSecondary, marginTop: 2 }}>{a.createdAt ? new Date(a.createdAt).toLocaleString('ru-RU') : ''}</Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
