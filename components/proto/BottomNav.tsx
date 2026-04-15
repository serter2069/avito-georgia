import React from 'react';
import { View, Text, Pressable } from 'react-native';

type TabId = 'home' | 'browse' | 'post' | 'messages' | 'profile';

interface BottomNavProps {
  active?: TabId;
}

const TABS: { id: TabId; label: string; isAction?: boolean }[] = [
  { id: 'home',     label: 'Главная' },
  { id: 'browse',   label: 'Каталог' },
  { id: 'post',     label: 'Подать',  isAction: true },
  { id: 'messages', label: 'Чаты' },
  { id: 'profile',  label: 'Профиль' },
];

// Simple icon shapes via View — no icon libraries
function NavIcon({ id, active }: { id: TabId; active: boolean }) {
  const c = active ? '#00AA6C' : '#9E9E9E';
  const s = 20;
  if (id === 'home') return (
    <View style={{ width: s, height: s, alignItems: 'center', justifyContent: 'flex-end' }}>
      <View style={{ width: 0, height: 0, borderLeftWidth: 10, borderRightWidth: 10, borderBottomWidth: 9, borderLeftColor: 'transparent', borderRightColor: 'transparent', borderBottomColor: c }} />
      <View style={{ width: 13, height: 9, backgroundColor: c }} />
    </View>
  );
  if (id === 'browse') return (
    <View style={{ width: s, height: s, justifyContent: 'center', gap: 3 }}>
      {[0,1,2].map(i => <View key={i} style={{ height: 2, backgroundColor: c, borderRadius: 1, width: i === 0 ? 18 : i === 1 ? 14 : 10 }} />)}
    </View>
  );
  if (id === 'post') return (
    <View style={{ width: 22, height: 22, borderRadius: 6, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ color: '#00AA6C', fontSize: 20, fontWeight: '300', lineHeight: 22 }}>+</Text>
    </View>
  );
  if (id === 'messages') return (
    <View style={{ width: s, height: s, borderRadius: 4, borderWidth: 2, borderColor: c, alignItems: 'center', justifyContent: 'center' }}>
      <View style={{ flexDirection: 'row', gap: 2 }}>
        {[0,1,2].map(i => <View key={i} style={{ width: 2.5, height: 2.5, borderRadius: 1.5, backgroundColor: c }} />)}
      </View>
    </View>
  );
  // profile
  return (
    <View style={{ width: s, height: s, alignItems: 'center', gap: 2 }}>
      <View style={{ width: 9, height: 9, borderRadius: 5, borderWidth: 2, borderColor: c }} />
      <View style={{ width: 16, height: 7, borderTopLeftRadius: 8, borderTopRightRadius: 8, borderWidth: 2, borderColor: c, borderBottomWidth: 0 }} />
    </View>
  );
}

export default function BottomNav({ active = 'home' }: BottomNavProps) {
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
        const isActive = tab.id === active;
        if (tab.isAction) {
          return (
            <View key={tab.id} style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: '#00AA6C', alignItems: 'center', justifyContent: 'center', marginTop: -10 }}>
                <NavIcon id={tab.id} active={true} />
              </View>
              <Text style={{ fontSize: 10, color: '#9E9E9E', marginTop: 2 }}>{tab.label}</Text>
            </View>
          );
        }
        return (
          <View key={tab.id} style={{ flex: 1, alignItems: 'center', gap: 3, paddingTop: 2 }}>
            <NavIcon id={tab.id} active={isActive} />
            <Text style={{ fontSize: 10, color: isActive ? '#00AA6C' : '#9E9E9E', fontWeight: isActive ? '600' : '400' }}>
              {tab.label}
            </Text>
            {isActive && <View style={{ position: 'absolute', bottom: -6, width: 4, height: 4, borderRadius: 2, backgroundColor: '#00AA6C' }} />}
          </View>
        );
      })}
    </View>
  );
}
