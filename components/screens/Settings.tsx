import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, useWindowDimensions, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import BottomNav from '../BottomNav';
import { colors } from '../../lib/theme';

// Custom Toggle component
function Toggle({ value, onToggle }: { value: boolean; onToggle: () => void }) {
  return (
    <Pressable onPress={onToggle} style={{ width: 46, height: 27, borderRadius: 14, backgroundColor: value ? colors.primary : '#D1D5DB', paddingHorizontal: 2, justifyContent: 'center' }}>
      <View
        style={{
          width: 23,
          height: 23,
          borderRadius: 12,
          backgroundColor: colors.background,
          alignSelf: value ? 'flex-end' : 'flex-start',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.15,
          shadowRadius: 2,
          elevation: 2,
        }}
      />
    </Pressable>
  );
}

function SectionLabel({ text }: { text: string }) {
  return (
    <Text style={{ fontSize: 12, fontWeight: '600', color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: 0.6, paddingHorizontal: 4, paddingTop: 8, paddingBottom: 6 }}>
      {text}
    </Text>
  );
}

function Divider({ indent = 0 }: { indent?: number }) {
  return <View style={{ height: 1, backgroundColor: colors.border, marginLeft: indent }} />;
}

type SectionId = 'notifications' | 'security' | 'language' | 'about';

interface NavItemProps {
  label: string;
  active: boolean;
  onPress: () => void;
}

function DesktopNavItem({ label, active, onPress }: NavItemProps) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        backgroundColor: active ? '#E8F9F2' : 'transparent',
      }}
    >
      <Text style={{ fontSize: 15, fontWeight: active ? '600' : '400', color: active ? colors.primary : colors.text }}>
        {label}
      </Text>
    </Pressable>
  );
}

// Notification pref type -> UI label mapping
const NOTIF_ITEMS: { type: string; label: string }[] = [
  { type: 'new_message', label: 'Новые сообщения' },
  { type: 'listing_expired', label: 'Статус объявлений' },
  { type: 'promo', label: 'Акции и предложения' },
];

interface NotificationsSectionProps {
  prefs?: Record<string, boolean>;
  onToggle?: (type: string, enabled: boolean) => void;
}

function NotificationsSection({ prefs, onToggle }: NotificationsSectionProps) {
  // Local state fallback when no real prefs provided
  const [localPrefs, setLocalPrefs] = useState<Record<string, boolean>>({
    new_message: true,
    listing_expired: true,
    promo: false,
  });

  const getValue = (type: string) => {
    if (prefs) return prefs[type] ?? false;
    return localPrefs[type] ?? false;
  };

  const handleToggle = (type: string) => {
    const newVal = !getValue(type);
    if (onToggle) {
      onToggle(type, newVal);
    } else {
      setLocalPrefs(prev => ({ ...prev, [type]: newVal }));
    }
  };

  return (
    <View style={{ gap: 0 }}>
      {NOTIF_ITEMS.map((item, i) => (
        <View key={item.type}>
          {i > 0 && <Divider indent={16} />}
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 14, paddingHorizontal: 16 }}>
            <Text style={{ fontSize: 15, color: colors.text }}>{item.label}</Text>
            <Toggle value={getValue(item.type)} onToggle={() => handleToggle(item.type)} />
          </View>
        </View>
      ))}
      <Text style={{ fontSize: 12, color: colors.textSecondary, paddingHorizontal: 16, paddingTop: 8, paddingBottom: 4 }}>
        Уведомления отправляются на email
      </Text>
    </View>
  );
}

function SecuritySection() {
  const router = useRouter();
  return (
    <View>
      <Pressable
        onPress={() => Alert.alert('Смена email', 'Для смены email обратитесь в поддержку: support@avito.ge')}
        style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 14, paddingHorizontal: 16 }}
      >
        <Text style={{ fontSize: 15, color: colors.text }}>Изменить email</Text>
        <Text style={{ fontSize: 18, color: colors.textSecondary }}>{'›'}</Text>
      </Pressable>
      <Divider indent={16} />
      <Pressable
        onPress={() => router.push('/dashboard/sessions' as any)}
        style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 14, paddingHorizontal: 16 }}
      >
        <Text style={{ fontSize: 15, color: colors.text }}>Активные сессии</Text>
        <Text style={{ fontSize: 18, color: colors.textSecondary }}>{'›'}</Text>
      </Pressable>
    </View>
  );
}

type Lang = 'ru' | 'ka' | 'en';

function LanguageSection({ currentLang, onChangeLang }: { currentLang?: string; onChangeLang?: (lang: string) => void }) {
  const [lang, setLang] = useState<Lang>((currentLang as Lang) || 'ru');
  const langs: { id: Lang; label: string }[] = [
    { id: 'ru', label: 'Русский' },
    { id: 'ka', label: 'Georgian / ქართული' },
    { id: 'en', label: 'English' },
  ];

  const handleSelect = (id: Lang) => {
    setLang(id);
    onChangeLang?.(id);
  };

  return (
    <View style={{ paddingHorizontal: 16, paddingVertical: 12, flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
      {langs.map(l => (
        <Pressable
          key={l.id}
          onPress={() => handleSelect(l.id)}
          style={{
            paddingHorizontal: 16,
            paddingVertical: 9,
            borderRadius: 20,
            borderWidth: 1.5,
            borderColor: lang === l.id ? colors.primary : colors.border,
            backgroundColor: lang === l.id ? '#E8F9F2' : colors.background,
          }}
        >
          <Text style={{ fontSize: 14, fontWeight: lang === l.id ? '600' : '400', color: lang === l.id ? colors.primary : colors.text }}>
            {l.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

function AboutSection() {
  const router = useRouter();
  const items: { label: string; value: string; route?: string }[] = [
    { label: 'Версия приложения', value: '1.4.2' },
    { label: 'О проекте', value: '›', route: '/legal/about' },
    { label: 'Помощь', value: '›', route: '/legal/help' },
    { label: 'Условия использования', value: '›', route: '/legal/terms' },
    { label: 'Политика конфиденциальности', value: '›', route: '/legal/privacy' },
  ];
  return (
    <View>
      {items.map((row, i) => (
        <View key={i}>
          {i > 0 && <Divider indent={16} />}
          <Pressable
            onPress={row.route ? () => router.push(row.route as any) : undefined}
            disabled={!row.route}
            style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 14, paddingHorizontal: 16 }}
          >
            <Text style={{ fontSize: 15, color: colors.text }}>{row.label}</Text>
            <Text style={{ fontSize: row.value === '›' ? 18 : 14, color: colors.textSecondary }}>{row.value}</Text>
          </Pressable>
        </View>
      ))}
    </View>
  );
}

const SECTIONS: { id: SectionId; label: string }[] = [
  { id: 'notifications', label: 'Уведомления' },
  { id: 'security', label: 'Безопасность' },
  { id: 'language', label: 'Язык' },
  { id: 'about', label: 'О приложении' },
];

interface SettingsProps {
  showBottomNav?: boolean;
  prefs?: Record<string, boolean>;
  onToggle?: (type: string, enabled: boolean) => void;
  onLogout?: () => void;
  onDeleteAccount?: () => void;
  onChangeLang?: (lang: string) => void;
  currentLang?: string;
}

function renderSection(
  id: SectionId,
  prefs?: Record<string, boolean>,
  onToggle?: (type: string, enabled: boolean) => void,
  currentLang?: string,
  onChangeLang?: (lang: string) => void,
) {
  if (id === 'notifications') return <NotificationsSection prefs={prefs} onToggle={onToggle} />;
  if (id === 'security') return <SecuritySection />;
  if (id === 'language') return <LanguageSection currentLang={currentLang} onChangeLang={onChangeLang} />;
  return <AboutSection />;
}

// -- State 1: Settings (interactive) --

export function SettingsDefault({ showBottomNav = true, prefs, onToggle, onLogout, onDeleteAccount, onChangeLang, currentLang }: SettingsProps) {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 640;
  const [activeSection, setActiveSection] = useState<SectionId>('notifications');

  if (isDesktop) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, borderRadius: 12, overflow: 'hidden' }}>
        <View style={{ flexDirection: 'row', padding: 20, gap: 16, alignItems: 'flex-start' }}>
          {/* Left nav */}
          <View style={{ width: 200, backgroundColor: colors.background, borderRadius: 12, padding: 8, gap: 2 }}>
            <Text style={{ fontSize: 18, fontWeight: '700', color: colors.text, paddingHorizontal: 8, paddingVertical: 10 }}>Настройки</Text>
            {SECTIONS.map(s => (
              <DesktopNavItem key={s.id} label={s.label} active={activeSection === s.id} onPress={() => setActiveSection(s.id)} />
            ))}
            <View style={{ marginTop: 16, borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 8 }}>
              {onLogout && (
                <Pressable onPress={onLogout} style={{ paddingVertical: 12, paddingHorizontal: 16, borderRadius: 8 }}>
                  <Text style={{ fontSize: 15, color: colors.error, fontWeight: '500' }}>Выйти</Text>
                </Pressable>
              )}
              {onDeleteAccount && (
                <Pressable onPress={onDeleteAccount} style={{ paddingVertical: 12, paddingHorizontal: 16, borderRadius: 8 }}>
                  <Text style={{ fontSize: 15, color: colors.error, fontWeight: '500' }}>Удалить аккаунт</Text>
                </Pressable>
              )}
            </View>
          </View>

          {/* Right content */}
          <View style={{ flex: 1, backgroundColor: colors.background, borderRadius: 12, overflow: 'hidden' }}>
            <Text style={{ fontSize: 16, fontWeight: '700', color: colors.text, padding: 16, borderBottomWidth: 1, borderBottomColor: colors.border }}>
              {SECTIONS.find(s => s.id === activeSection)?.label}
            </Text>
            {renderSection(activeSection, prefs, onToggle, currentLang, onChangeLang)}
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background, borderRadius: 12, overflow: 'hidden' }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ padding: 12, gap: 4 }}>
          {/* Header */}
          <View style={{ backgroundColor: colors.background, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14 }}>
            <Text style={{ fontSize: 20, fontWeight: '700', color: colors.text }}>Настройки</Text>
          </View>

          {/* Notifications */}
          <SectionLabel text="Уведомления" />
          <View style={{ backgroundColor: colors.background, borderRadius: 12, overflow: 'hidden' }}>
            <NotificationsSection prefs={prefs} onToggle={onToggle} />
          </View>

          {/* Security */}
          <SectionLabel text="Безопасность" />
          <View style={{ backgroundColor: colors.background, borderRadius: 12, overflow: 'hidden' }}>
            <SecuritySection />
          </View>

          {/* Language */}
          <SectionLabel text="Язык" />
          <View style={{ backgroundColor: colors.background, borderRadius: 12, overflow: 'hidden' }}>
            <LanguageSection currentLang={currentLang} onChangeLang={onChangeLang} />
          </View>

          {/* About */}
          <SectionLabel text="О приложении" />
          <View style={{ backgroundColor: colors.background, borderRadius: 12, overflow: 'hidden' }}>
            <AboutSection />
          </View>

          {/* Danger zone */}
          <SectionLabel text="Аккаунт" />
          <View style={{ backgroundColor: colors.background, borderRadius: 12, overflow: 'hidden' }}>
            {onLogout && (
              <Pressable onPress={onLogout} style={{ paddingVertical: 14, paddingHorizontal: 16 }}>
                <Text style={{ fontSize: 15, color: colors.error, fontWeight: '500' }}>Выйти</Text>
              </Pressable>
            )}
            {onLogout && onDeleteAccount && <Divider indent={16} />}
            {onDeleteAccount && (
              <Pressable onPress={onDeleteAccount} style={{ paddingVertical: 14, paddingHorizontal: 16 }}>
                <Text style={{ fontSize: 15, color: colors.error, fontWeight: '500' }}>Удалить аккаунт</Text>
              </Pressable>
            )}
          </View>

          <View style={{ height: 8 }} />
        </View>
      </ScrollView>
      {showBottomNav && <BottomNav active="profile" />}
    </View>
  );
}

// -- Main Export --

export default SettingsDefault;
