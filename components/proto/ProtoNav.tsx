import { View, Text, Pressable, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import type { NavVariant } from '../../constants/pageRegistry';

interface ProtoNavProps {
  variant: NavVariant;
  title?: string;
}

export function ProtoNav({ variant, title }: ProtoNavProps) {
  if (variant === 'none') return null;

  if (variant === 'auth') {
    return (
      <View style={{
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
        paddingHorizontal: 16,
        paddingVertical: 14,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <Text style={{ color: '#0A7B8A', fontSize: 18, fontWeight: '700' }}>
          {title ?? 'Авито GE'}
        </Text>
      </View>
    );
  }

  if (variant === 'public') {
    return (
      <View style={{
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
        paddingHorizontal: 16,
        paddingVertical: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <Text style={{ color: '#0A7B8A', fontSize: 18, fontWeight: '700' }}>
          Авито GE
        </Text>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <Pressable style={{
            paddingHorizontal: 14,
            paddingVertical: 7,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: '#0A7B8A',
          }}>
            <Text style={{ color: '#0A7B8A', fontSize: 13, fontWeight: '600' }}>Войти</Text>
          </Pressable>
          <Pressable style={{
            paddingHorizontal: 14,
            paddingVertical: 7,
            borderRadius: 8,
            backgroundColor: '#0A7B8A',
          }}>
            <Text style={{ color: '#fff', fontSize: 13, fontWeight: '600' }}>Разместить</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  if (variant === 'client') {
    return (
      <View style={{
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        paddingVertical: 8,
        paddingBottom: Platform.OS === 'ios' ? 24 : 8,
      }}>
        <TabItem icon="home" label="Главная" />
        <TabItem icon="search" label="Поиск" />
        <TabItemAdd />
        <TabItem icon="message-circle" label="Сообщения" />
        <TabItem icon="user" label="Профиль" />
      </View>
    );
  }

  if (variant === 'admin') {
    return (
      <View style={{
        backgroundColor: '#0A2840',
        width: 200,
        paddingTop: 24,
        paddingBottom: 24,
        paddingHorizontal: 0,
        flexShrink: 0,
      }}>
        <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, fontWeight: '600', paddingHorizontal: 16, marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 }}>
          Админка
        </Text>
        <AdminItem icon="bar-chart-2" label="Дашборд" />
        <AdminItem icon="users" label="Пользователи" />
        <AdminItem icon="shield" label="Модерация" />
        <AdminItem icon="grid" label="Категории" />
        <AdminItem icon="flag" label="Отчёты" />
        <AdminItem icon="credit-card" label="Платежи" />
        <AdminItem icon="settings" label="Настройки" />
      </View>
    );
  }

  return null;
}

function TabItem({ icon, label }: { icon: React.ComponentProps<typeof Feather>['name']; label: string }) {
  return (
    <View style={{ alignItems: 'center', gap: 3, flex: 1 }}>
      <Feather name={icon} size={22} color="#6B7280" />
      <Text style={{ color: '#6B7280', fontSize: 10 }}>{label}</Text>
    </View>
  );
}

function TabItemAdd() {
  return (
    <View style={{ alignItems: 'center', flex: 1 }}>
      <View style={{
        backgroundColor: '#0A7B8A',
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 2,
      }}>
        <Feather name="plus" size={22} color="#fff" />
      </View>
    </View>
  );
}

function AdminItem({ icon, label }: { icon: React.ComponentProps<typeof Feather>['name']; label: string }) {
  return (
    <Pressable style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 16, paddingVertical: 10 }}>
      <Feather name={icon} size={16} color="rgba(255,255,255,0.7)" />
      <Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: 13 }}>{label}</Text>
    </Pressable>
  );
}
