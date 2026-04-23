import React from 'react';
import { View, Text, ActivityIndicator, Pressable, ScrollView, useWindowDimensions } from 'react-native';
import BottomNav from '../../../components/BottomNav';
import ProtoImage from '../../../components/proto/ProtoPlaceholderImage';
import { colors, fontSize } from '../../../lib/theme';

function ExpiredListingCard({ title, price }: { title: string; price: string }) {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 640;
  return (
    <View style={{ borderWidth: 1, borderColor: colors.border, borderRadius: 10, overflow: 'hidden', maxWidth: isDesktop ? 480 : undefined, width: '100%', alignSelf: isDesktop ? 'center' : undefined }}>
      <View style={{ height: 160, opacity: 0.6 }}><ProtoImage seed={80} width="100%" height={160} /></View>
      <View style={{ padding: 12, gap: 4 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Text style={{ fontSize: fontSize.base, fontWeight: '600', color: colors.text, flex: 1 }} numberOfLines={1}>{title}</Text>
          <View style={{ backgroundColor: colors.primaryLight, borderRadius: 4, paddingHorizontal: 8, paddingVertical: 2 }}>
            <Text style={{ fontSize: fontSize.xs, fontWeight: '700', color: colors.textSecondary }}>Истёкло</Text>
          </View>
        </View>
        <Text style={{ fontSize: fontSize.xl, fontWeight: '700', color: colors.text }}>{price}</Text>
      </View>
    </View>
  );
}

function PageWrapper({ children }: { children: React.ReactNode }) {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 640;
  return (
    <View style={{ backgroundColor: colors.background, padding: isDesktop ? 24 : 16, gap: 16, maxWidth: isDesktop ? 560 : undefined, width: '100%', alignSelf: isDesktop ? 'center' : undefined }}>
      {children}
    </View>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// STATES
// ═══════════════════════════════════════════════════════════════════════════════

function ListingExpired() {
  const { width } = useWindowDimensions();
  return (
      <View style={{ backgroundColor: colors.background }}>
        <PageWrapper>
          <ExpiredListingCard title="Toyota Camry 2019, 45 000 км" price="12 500 ₾" />
          <Text style={{ fontSize: fontSize.sm, color: colors.textSecondary }}>Срок объявления истёк 30 апреля</Text>
          <Pressable style={{ backgroundColor: colors.primary, borderRadius: 8, paddingVertical: 14, alignItems: 'center' }}>
            <Text style={{ color: colors.background, fontWeight: '700', fontSize: fontSize.base }}>Продлить за ₾3</Text>
          </Pressable>
          <Pressable style={{ borderRadius: 8, paddingVertical: 13, alignItems: 'center', borderWidth: 1, borderColor: colors.border }}>
            <Text style={{ fontSize: fontSize.base, fontWeight: '600', color: colors.error }}>Удалить</Text>
          </Pressable>
        </PageWrapper>
        {width < 640 && <BottomNav active="post" />}
      </View>
  );
}

function FreeRenewalState() {
  const { width } = useWindowDimensions();
  return (
      <View style={{ backgroundColor: colors.background }}>
        <PageWrapper>
          <ExpiredListingCard title="Toyota Camry 2019, 45 000 км" price="12 500 ₾" />
          <View style={{ backgroundColor: colors.primaryLight, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10 }}>
            <Text style={{ fontSize: fontSize.sm, fontWeight: '600', color: colors.primary }}>Продление бесплатно (1 из 3 бесплатных)</Text>
          </View>
          <Pressable style={{ backgroundColor: colors.primary, borderRadius: 8, paddingVertical: 14, alignItems: 'center' }}>
            <Text style={{ color: colors.background, fontWeight: '700', fontSize: fontSize.base }}>Продлить бесплатно</Text>
          </Pressable>
          <Pressable style={{ borderRadius: 8, paddingVertical: 13, alignItems: 'center', borderWidth: 1, borderColor: colors.border }}>
            <Text style={{ fontSize: fontSize.base, fontWeight: '600', color: colors.error }}>Удалить</Text>
          </Pressable>
        </PageWrapper>
        {width < 640 && <BottomNav active="post" />}
      </View>
  );
}

function RenewingLoadingState() {
  const { width } = useWindowDimensions();
  return (
      <View style={{ backgroundColor: colors.background }}>
        <PageWrapper>
          <ExpiredListingCard title="Toyota Camry 2019, 45 000 км" price="12 500 ₾" />
          <Pressable
            style={{ backgroundColor: colors.primary, opacity: 0.7, borderRadius: 8, paddingVertical: 14, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8 }}
            disabled
          >
            <ActivityIndicator size="small" color={colors.background} />
            <Text style={{ color: colors.background, fontWeight: '700', fontSize: fontSize.base }}>Продление...</Text>
          </Pressable>
        </PageWrapper>
        {width < 640 && <BottomNav active="post" />}
      </View>
  );
}

function SuccessState() {
  const { width } = useWindowDimensions();
  return (
      <View style={{ backgroundColor: colors.background }}>
        <View style={{ alignItems: 'center', paddingVertical: 60, paddingHorizontal: 24, gap: 12 }}>
          <View style={{ width: 64, height: 64, borderRadius: 32, borderWidth: 3, borderColor: colors.primary, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: fontSize.xxl, color: colors.primary, fontWeight: '700' }}>✓</Text>
          </View>
          <Text style={{ fontSize: fontSize.xl, fontWeight: '700', color: colors.text }}>Объявление продлено!</Text>
          <Text style={{ fontSize: fontSize.md, color: colors.textSecondary, textAlign: 'center' }}>Активно до 30 мая.</Text>
          <Pressable style={{ backgroundColor: colors.primary, borderRadius: 8, paddingHorizontal: 24, paddingVertical: 12, marginTop: 8 }}>
            <Text style={{ color: colors.background, fontWeight: '700', fontSize: fontSize.base }}>Смотреть объявление</Text>
          </Pressable>
        </View>
        {width < 640 && <BottomNav active="post" />}
      </View>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN EXPORT
// ═══════════════════════════════════════════════════════════════════════════════

export default ListingExpired;
