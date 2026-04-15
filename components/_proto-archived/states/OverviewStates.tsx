import React from 'react';
import { View, Text, ScrollView, Pressable, Platform, useWindowDimensions } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { StateSection } from '../StateSection';
import { pageRegistry } from '../../../constants/pageRegistry';
import { protoMeta } from '../../../constants/protoMeta';

// Navigation helper for proto links
function navTo(pageId: string) {
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    window.open(`/proto/states/${pageId}`, '_self');
  }
}

// Brand colors — synced with BrandStates.tsx
const C = {
  primary: '#0A7B8A',
  primaryBg: '#E8F4F8',
  white: '#FFFFFF',
  page: '#F2F8FA',
  text: '#0A2840',
  muted: '#6A8898',
  border: '#C8E0E8',
  error: '#D32F2F',
};

// ─── Role Card ──────────────────────────────────────────────────────────────
function RoleCard({ id, title, description, screenCount }: { id: string; title: string; description: string; screenCount: number }) {
  return (
    <View style={{
      backgroundColor: C.white, borderRadius: 10, borderWidth: 1,
      borderColor: C.border, padding: 16, flex: 1, minWidth: 200,
    }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 }}>
        <View style={{
          width: 36, height: 36, borderRadius: 8, backgroundColor: C.primaryBg,
          alignItems: 'center', justifyContent: 'center',
        }}>
          <Feather name="user" size={18} color={C.primary} />
        </View>
        <View>
          <Text style={{ fontSize: 14, fontWeight: '700', color: C.text }}>{title}</Text>
          <Text style={{ fontSize: 11, color: C.muted, fontWeight: '600' }}>{id.toUpperCase()}</Text>
        </View>
      </View>
      <Text style={{ fontSize: 13, color: C.muted, lineHeight: 18, marginBottom: 8 }}>{description}</Text>
      <View style={{
        flexDirection: 'row', alignItems: 'center', gap: 4,
        backgroundColor: C.primaryBg, alignSelf: 'flex-start',
        paddingHorizontal: 8, paddingVertical: 3, borderRadius: 4,
      }}>
        <Feather name="monitor" size={11} color={C.primary} />
        <Text style={{ fontSize: 11, fontWeight: '600', color: C.primary }}>{screenCount} экранов</Text>
      </View>
    </View>
  );
}

// ─── Scenario Card ──────────────────────────────────────────────────────────
function ScenarioCard({ id, title, role, steps, screens }: {
  id: string; title: string; role: string; steps: string[]; screens: string[];
}) {
  return (
    <View style={{
      backgroundColor: C.white, borderRadius: 10, borderWidth: 1,
      borderColor: C.border, padding: 16,
    }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <View style={{
            backgroundColor: C.primaryBg, width: 28, height: 28, borderRadius: 6,
            alignItems: 'center', justifyContent: 'center',
          }}>
            <Text style={{ fontSize: 11, fontWeight: '700', color: C.primary }}>{id.replace('browse', 'S1').replace('search', 'S2').replace('auth', 'S3').replace('create-listing', 'S4').replace('messaging', 'S5').replace('promote', 'S6').replace('subscribe', 'S7').replace('moderation', 'S8')}</Text>
          </View>
          <Text style={{ fontSize: 14, fontWeight: '700', color: C.text }}>{title}</Text>
        </View>
        <View style={{
          backgroundColor: C.primaryBg, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 4,
        }}>
          <Text style={{ fontSize: 11, fontWeight: '600', color: C.primary }}>{role}</Text>
        </View>
      </View>

      {/* Steps flow */}
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 6, marginBottom: 8 }}>
        {screens.map((screen, idx) => {
          // Parse steps like "homepage -> listings-feed -> listing-detail"
          const screenNames = steps[0]?.split(' → ') || steps[0]?.split(' -> ') || [screen];
          const currentScreen = screenNames[idx] || screen;
          return (
            <React.Fragment key={idx}>
              <Pressable
                style={{
                  backgroundColor: C.page, borderRadius: 6,
                  paddingHorizontal: 10, paddingVertical: 6,
                  borderWidth: 1, borderColor: C.border,
                }}
                onPress={() => navTo(screen)}
              >
                <Text style={{ fontSize: 12, fontWeight: '500', color: C.primary }}>{currentScreen.trim()}</Text>
              </Pressable>
              {idx < screens.length - 1 && (
                <Feather name="chevron-right" size={14} color={C.muted} />
              )}
            </React.Fragment>
          );
        })}
      </View>

      {/* Expected outcome */}
      <View style={{
        backgroundColor: C.page, borderRadius: 6, paddingHorizontal: 10, paddingVertical: 6,
        borderLeftWidth: 3, borderLeftColor: C.primary,
      }}>
        <Text style={{ fontSize: 11, color: C.muted }}>
          {title === 'Просмотр объявлений' && 'Главная → лента объявлений → детали → контакт с продавцом'}
          {title === 'Поиск' && 'Ввод запроса → результаты/карта → выбор объявления'}
          {title === 'Авторизация' && 'Email → OTP-код → онбординг (первый вход) → главная'}
          {title === 'Размещение объявления' && 'Форма создания → модерация → публикация'}
          {title === 'Переписка' && 'Объявление → чат с продавцом → история сообщений'}
          {title === 'Продвижение объявления' && 'Мои объявления → выбор пакета → оплата → подтверждение'}
          {title === 'Premium подписка' && 'Профиль → тарифы → Stripe → активация'}
          {title === 'Модерация (Admin)' && 'Дашборд → очередь → одобрить/отклонить'}
        </Text>
      </View>
    </View>
  );
}

// ─── Progress Section ───────────────────────────────────────────────────────
function ProgressSection() {
  const totalPages = pageRegistry.filter(p => p.group !== 'Overview' && p.group !== 'Brand').length;
  const protoPages = pageRegistry.filter(p => (p.qaCycles ?? 0) > 0 && (p.qaCycles ?? 0) < 5).length;
  const reviewPages = pageRegistry.filter(p => (p.qaCycles ?? 0) >= 5).length;
  const totalProto = pageRegistry.length;

  const barWidth = totalProto > 0 ? (reviewPages / totalProto) * 100 : 0;

  return (
    <View style={{
      backgroundColor: C.white, borderRadius: 10, borderWidth: 1,
      borderColor: C.border, padding: 16,
    }}>
      <Text style={{ fontSize: 14, fontWeight: '700', color: C.text, marginBottom: 12 }}>Прогресс прототипирования</Text>

      {/* Stats row */}
      <View style={{ flexDirection: 'row', gap: 16, marginBottom: 12 }}>
        <View style={{ alignItems: 'center' }}>
          <Text style={{ fontSize: 22, fontWeight: '800', color: C.text }}>{totalProto}</Text>
          <Text style={{ fontSize: 11, color: C.muted }}>Всего страниц</Text>
        </View>
        <View style={{ alignItems: 'center' }}>
          <Text style={{ fontSize: 22, fontWeight: '800', color: '#f59e0b' }}>{protoPages}</Text>
          <Text style={{ fontSize: 11, color: C.muted }}>В работе</Text>
        </View>
        <View style={{ alignItems: 'center' }}>
          <Text style={{ fontSize: 22, fontWeight: '800', color: C.primary }}>{reviewPages}</Text>
          <Text style={{ fontSize: 11, color: C.muted }}>Готово</Text>
        </View>
      </View>

      {/* Progress bar */}
      <View style={{ height: 8, backgroundColor: C.page, borderRadius: 4, overflow: 'hidden' }}>
        <View style={{ height: '100%', width: `${barWidth}%`, backgroundColor: C.primary, borderRadius: 4 }} />
      </View>
      <Text style={{ fontSize: 11, color: C.muted, marginTop: 4, marginBottom: 12 }}>
        {reviewPages}/{totalProto} страниц готовы к ревью ({Math.round(barWidth)}%)
      </Text>

      {/* Page status list */}
      <Text style={{ fontSize: 12, fontWeight: '700', color: C.text, marginBottom: 8 }}>Страницы по статусам:</Text>
      <View style={{ gap: 4 }}>
        {pageRegistry.map((page) => {
          const cycles = page.qaCycles ?? 0;
          const statusColor = cycles >= 5 ? '#2E7D30' : cycles > 0 ? '#f59e0b' : '#94A3B8';
          const statusLabel = cycles >= 5 ? 'READY' : cycles > 0 ? 'PROTO' : 'TODO';
          return (
            <View key={page.id} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <Pressable onPress={() => navTo(page.id)} style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Feather name="file" size={12} color={C.primary} />
                <Text style={{ fontSize: 12, color: C.text, fontWeight: '500' }}>{page.title}</Text>
              </Pressable>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Text style={{ fontSize: 10, color: C.muted }}>{cycles}/5</Text>
                <View style={{ backgroundColor: statusColor, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 }}>
                  <Text style={{ fontSize: 9, fontWeight: '700', color: '#fff' }}>{statusLabel}</Text>
                </View>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}

// ─── DEFAULT STATE ──────────────────────────────────────────────────────────
function DefaultState() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;

  // Group pages by role for counting
  const pageGroups = pageRegistry.reduce<Record<string, number>>((acc, p) => {
    const group = p.group;
    acc[group] = (acc[group] || 0) + 1;
    return acc;
  }, {});

  return (
    <View style={{ minHeight: 844, backgroundColor: C.page }}>
      <ScrollView contentContainerStyle={{ padding: isDesktop ? 32 : 16, gap: 24 }}>
        {/* Project Header */}
        <View style={{
          backgroundColor: C.primary, borderRadius: 12, padding: 24,
          flexDirection: isDesktop ? 'row' : 'column', alignItems: 'center', gap: 16,
        }}>
          <View style={{
            width: 64, height: 64, backgroundColor: 'rgba(255,255,255,0.2)',
            borderRadius: 16, alignItems: 'center', justifyContent: 'center',
          }}>
            <Text style={{ color: '#fff', fontSize: 32, fontWeight: '800' }}>A</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 24, fontWeight: '800', color: '#fff', marginBottom: 4 }}>
              {protoMeta.project}
            </Text>
            <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.85)', lineHeight: 20 }}>
              {protoMeta.description}
            </Text>
            <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', marginTop: 4 }}>
              {protoMeta.stack}
            </Text>
          </View>
        </View>

        {/* Roles */}
        <View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <Feather name="users" size={18} color={C.primary} />
            <Text style={{ fontSize: 18, fontWeight: '700', color: C.text }}>Роли</Text>
          </View>
          <View style={{ flexDirection: isDesktop ? 'row' : 'column', gap: 12, flexWrap: 'wrap' }}>
            {protoMeta.roles.map((role) => (
              <RoleCard
                key={role.id}
                id={role.id}
                title={role.title}
                description={role.description}
                screenCount={pageRegistry.filter(p => {
                  if (role.id === 'guest') return p.nav === 'public' || p.nav === 'auth';
                  if (role.id === 'user' || role.id === 'premium') return p.nav === 'client';
                  if (role.id === 'admin') return p.nav === 'admin';
                  return false;
                }).length}
              />
            ))}
          </View>
        </View>

        {/* Scenarios */}
        <View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <Feather name="git-branch" size={18} color={C.primary} />
            <Text style={{ fontSize: 18, fontWeight: '700', color: C.text }}>Сценарии</Text>
          </View>
          <View style={{ gap: 10 }}>
            {protoMeta.scenarios.map((scenario) => (
              <ScenarioCard
                key={scenario.id}
                id={scenario.id}
                title={scenario.title}
                role={scenario.roles.join(', ')}
                steps={scenario.steps}
                screens={scenario.steps}
              />
            ))}
          </View>
        </View>

        {/* Pages by Group */}
        <View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <Feather name="layers" size={18} color={C.primary} />
            <Text style={{ fontSize: 18, fontWeight: '700', color: C.text }}>Страницы по группам</Text>
          </View>
          <View style={{ gap: 8 }}>
            {Object.entries(pageGroups).map(([group, count]) => (
              <View key={group} style={{
                flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
                backgroundColor: C.white, borderRadius: 8, borderWidth: 1,
                borderColor: C.border, paddingHorizontal: 14, paddingVertical: 10,
              }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Feather name="folder" size={16} color={C.primary} />
                  <Text style={{ fontSize: 14, fontWeight: '600', color: C.text }}>{group}</Text>
                </View>
                <View style={{
                  backgroundColor: C.primaryBg, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 4,
                }}>
                  <Text style={{ fontSize: 12, fontWeight: '600', color: C.primary }}>{count}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Tech Stack */}
        <View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <Feather name="code" size={18} color={C.primary} />
            <Text style={{ fontSize: 18, fontWeight: '700', color: C.text }}>Стек и конфигурация</Text>
          </View>
          <View style={{
            backgroundColor: C.white, borderRadius: 10, borderWidth: 1,
            borderColor: C.border, padding: 16, gap: 10,
          }}>
            <InfoRow label="Стек" value={protoMeta.stack} />
            <InfoRow label="Города" value={protoMeta.cities.join(', ')} />
            <InfoRow label="Языки" value={protoMeta.languages.join(', ')} />
            <InfoRow label="Авторизация" value={`${protoMeta.auth.method} (dev: ${protoMeta.auth.devOtp})`} />
            <InfoRow label="Платежи" value={`${protoMeta.payments.provider}, ${protoMeta.payments.currency}`} />
            <InfoRow label="Premium" value={`${protoMeta.payments.premiumPrice} ${protoMeta.payments.currency}/мес`} />
          </View>
        </View>

        {/* Progress */}
        <ProgressSection />
      </ScrollView>
    </View>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
      <Text style={{ fontSize: 13, fontWeight: '600', color: C.muted, minWidth: 100 }}>{label}</Text>
      <Text style={{ fontSize: 13, color: C.text, flex: 1, textAlign: 'right' }}>{value}</Text>
    </View>
  );
}

// ─── MAIN EXPORT ────────────────────────────────────────────────────────────
export default function OverviewStates() {  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;
  const containerStyle = isDesktop ? { maxWidth: 960, alignSelf: 'center' as const, width: '100%' } : {};

  return (
    <View>
      <StateSection title="DEFAULT">
        <DefaultState />
      </StateSection>
    </View>
  );
}
