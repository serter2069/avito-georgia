import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, TextInput } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useState, useEffect, useCallback } from 'react';
import { api } from '../../lib/api';
import { colors } from '../../lib/colors';

interface UserItem {
  id: string;
  email: string;
  name: string | null;
  phone: string | null;
  role: string;
  createdAt: string;
  _count: { listings: number };
}

export default function AdminUsers() {
  const { t } = useTranslation();
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchUsers = useCallback(async (p: number, q: string) => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(p), limit: '20' });
    if (q.trim()) params.set('q', q.trim());
    const res = await api.get<{ users: UserItem[]; total: number }>(
      `/admin/users?${params.toString()}`
    );
    if (res.ok && res.data) {
      setUsers(res.data.users);
      setTotal(res.data.total);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchUsers(page, search);
  }, [page, fetchUsers]);

  const handleSearch = () => {
    setPage(1);
    fetchUsers(1, search);
  };

  const toggleBlock = async (user: UserItem) => {
    setActionLoading(user.id);
    const newRole = user.role === 'blocked' ? 'user' : 'blocked';
    const res = await api.patch<{ id: string; role: string }>(
      `/admin/users/${user.id}/role`,
      { role: newRole }
    );
    if (res.ok && res.data) {
      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, role: res.data!.role } : u))
      );
    }
    setActionLoading(null);
  };

  const formatDate = (iso: string) => new Date(iso).toLocaleDateString();

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return { bg: 'bg-primary/20', text: 'text-primary', label: t('admin') };
      case 'blocked':
        return { bg: 'bg-error/20', text: 'text-error', label: t('blocked') };
      default:
        return { bg: 'bg-surface', text: 'text-text-secondary', label: t('user') };
    }
  };

  return (
    <View className="flex-1">
      {/* Search */}
      <View className="px-4 pt-4 pb-2">
        <View className="flex-row bg-surface border border-border rounded-lg overflow-hidden">
          <TextInput
            className="flex-1 px-4 py-2.5 text-text-primary text-sm"
            placeholder={t('searchUsers')}
            placeholderTextColor={colors.textMuted}
            value={search}
            onChangeText={setSearch}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
          <TouchableOpacity
            className="px-4 items-center justify-center bg-primary"
            onPress={handleSearch}
          >
            <Text className="text-white text-sm">&#x1F50D;</Text>
          </TouchableOpacity>
        </View>
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={colors.brandPrimary} />
        </View>
      ) : (
        <ScrollView className="flex-1" contentContainerClassName="p-4 gap-3">
          <Text className="text-text-muted text-xs mb-1">
            {t('totalUsers')}: {total}
          </Text>

          {users.length === 0 ? (
            <Text className="text-text-muted text-sm text-center py-8">{t('noUsers')}</Text>
          ) : (
            users.map((user) => {
              const badge = getRoleBadge(user.role);
              return (
                <View key={user.id} className="bg-surface-card border border-border rounded-lg p-4">
                  <View className="flex-row justify-between items-start mb-2">
                    <View className="flex-1 mr-3">
                      <Text className="text-text-primary text-sm font-bold">
                        {user.name || user.email}
                      </Text>
                      {user.name && (
                        <Text className="text-text-muted text-xs">{user.email}</Text>
                      )}
                    </View>
                    <View className={`px-2 py-0.5 rounded ${badge.bg}`}>
                      <Text className={`text-xs font-medium ${badge.text}`}>{badge.label}</Text>
                    </View>
                  </View>

                  <View className="flex-row justify-between items-center mb-3">
                    <Text className="text-text-muted text-xs">
                      {t('registrationDate')}: {formatDate(user.createdAt)}
                    </Text>
                    <Text className="text-text-secondary text-xs">
                      {t('listingsCount')}: {user._count.listings}
                    </Text>
                  </View>

                  {user.role !== 'admin' && (
                    <TouchableOpacity
                      className={`py-2 rounded-lg items-center ${
                        user.role === 'blocked'
                          ? 'bg-success/20 border border-success/40'
                          : 'bg-error/20 border border-error/40'
                      }`}
                      onPress={() => toggleBlock(user)}
                      disabled={actionLoading === user.id}
                    >
                      {actionLoading === user.id ? (
                        <ActivityIndicator size="small" color={colors.brandPrimary} />
                      ) : (
                        <Text
                          className={`text-sm font-medium ${
                            user.role === 'blocked' ? 'text-success' : 'text-error'
                          }`}
                        >
                          {user.role === 'blocked' ? t('unblock') : t('block')}
                        </Text>
                      )}
                    </TouchableOpacity>
                  )}
                </View>
              );
            })
          )}

          {/* Pagination */}
          {total > 20 && (
            <View className="flex-row justify-center gap-3 py-4">
              <TouchableOpacity
                className={`px-4 py-2 rounded-lg ${page > 1 ? 'bg-primary' : 'bg-surface'}`}
                onPress={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
              >
                <Text className={page > 1 ? 'text-white' : 'text-text-muted'}>&larr;</Text>
              </TouchableOpacity>
              <Text className="text-text-secondary self-center text-sm">
                {page} / {Math.ceil(total / 20)}
              </Text>
              <TouchableOpacity
                className={`px-4 py-2 rounded-lg ${page < Math.ceil(total / 20) ? 'bg-primary' : 'bg-surface'}`}
                onPress={() => setPage((p) => p + 1)}
                disabled={page >= Math.ceil(total / 20)}
              >
                <Text className={page < Math.ceil(total / 20) ? 'text-white' : 'text-text-muted'}>&rarr;</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
}
