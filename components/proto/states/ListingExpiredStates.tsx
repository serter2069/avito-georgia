import React from 'react';
import { View, Text, ActivityIndicator, Pressable, ScrollView, useWindowDimensions } from 'react-native';
import { StateSection } from '../StateSection';
import BottomNav from '../BottomNav';

const C = { green:'#00AA6C', greenBg:'#E8F9F2', white:'#FFFFFF', text:'#1A1A1A', muted:'#737373', border:'#E0E0E0', error:'#D32F2F' };

const IMG_COLOR = '#C8E6C9';

function ExpiredListingCard({ title, price }: { title: string; price: string }) {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 640;
  return (
    <View style={{ borderWidth: 1, borderColor: C.border, borderRadius: 10, overflow: 'hidden', maxWidth: isDesktop ? 480 : undefined, width: '100%', alignSelf: isDesktop ? 'center' : undefined }}>
      <View style={{ height: 160, backgroundColor: IMG_COLOR, opacity: 0.6 }} />
      <View style={{ padding: 12, gap: 4 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Text style={{ fontSize: 15, fontWeight: '600', color: C.text, flex: 1 }} numberOfLines={1}>{title}</Text>
          <View style={{ backgroundColor: C.greenBg, borderRadius: 4, paddingHorizontal: 8, paddingVertical: 2 }}>
            <Text style={{ fontSize: 11, fontWeight: '700', color: C.muted }}>Истёкло</Text>
          </View>
        </View>
        <Text style={{ fontSize: 18, fontWeight: '700', color: C.text }}>{price}</Text>
      </View>
    </View>
  );
}

function PageWrapper({ children }: { children: React.ReactNode }) {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 640;
  return (
    <View style={{ backgroundColor: C.white, padding: isDesktop ? 24 : 16, gap: 16, maxWidth: isDesktop ? 560 : undefined, width: '100%', alignSelf: isDesktop ? 'center' : undefined }}>
      {children}
    </View>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// STATES
// ═══════════════════════════════════════════════════════════════════════════════

function DefaultExpiredState() {
  const { width } = useWindowDimensions();
  return (
    <StateSection title="LISTING_EXPIRED / Default">
      <View style={{ backgroundColor: C.white }}>
        <PageWrapper>
          <ExpiredListingCard title="Toyota Camry 2019, 45 000 км" price="12 500 ₾" />
          <Text style={{ fontSize: 13, color: C.muted }}>Срок объявления истёк 30 апреля</Text>
          <Pressable style={{ backgroundColor: C.green, borderRadius: 8, paddingVertical: 14, alignItems: 'center' }}>
            <Text style={{ color: C.white, fontWeight: '700', fontSize: 15 }}>Продлить за ₾3</Text>
          </Pressable>
          <Pressable style={{ borderRadius: 8, paddingVertical: 13, alignItems: 'center', borderWidth: 1, borderColor: C.border }}>
            <Text style={{ fontSize: 15, fontWeight: '600', color: C.error }}>Удалить</Text>
          </Pressable>
        </PageWrapper>
        {width < 640 && <BottomNav active="post" />}
      </View>
    </StateSection>
  );
}

function FreeRenewalState() {
  const { width } = useWindowDimensions();
  return (
    <StateSection title="LISTING_EXPIRED / Free renewal">
      <View style={{ backgroundColor: C.white }}>
        <PageWrapper>
          <ExpiredListingCard title="Toyota Camry 2019, 45 000 км" price="12 500 ₾" />
          <View style={{ backgroundColor: C.greenBg, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10 }}>
            <Text style={{ fontSize: 13, fontWeight: '600', color: C.green }}>Продление бесплатно (1 из 3 бесплатных)</Text>
          </View>
          <Pressable style={{ backgroundColor: C.green, borderRadius: 8, paddingVertical: 14, alignItems: 'center' }}>
            <Text style={{ color: C.white, fontWeight: '700', fontSize: 15 }}>Продлить бесплатно</Text>
          </Pressable>
          <Pressable style={{ borderRadius: 8, paddingVertical: 13, alignItems: 'center', borderWidth: 1, borderColor: C.border }}>
            <Text style={{ fontSize: 15, fontWeight: '600', color: C.error }}>Удалить</Text>
          </Pressable>
        </PageWrapper>
        {width < 640 && <BottomNav active="post" />}
      </View>
    </StateSection>
  );
}

function RenewingLoadingState() {
  const { width } = useWindowDimensions();
  return (
    <StateSection title="LISTING_EXPIRED / Renewing loading">
      <View style={{ backgroundColor: C.white }}>
        <PageWrapper>
          <ExpiredListingCard title="Toyota Camry 2019, 45 000 км" price="12 500 ₾" />
          <Pressable
            style={{ backgroundColor: C.green, opacity: 0.7, borderRadius: 8, paddingVertical: 14, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8 }}
            disabled
          >
            <ActivityIndicator size="small" color="#FFFFFF" />
            <Text style={{ color: C.white, fontWeight: '700', fontSize: 15 }}>Продление...</Text>
          </Pressable>
        </PageWrapper>
        {width < 640 && <BottomNav active="post" />}
      </View>
    </StateSection>
  );
}

function SuccessState() {
  const { width } = useWindowDimensions();
  return (
    <StateSection title="LISTING_EXPIRED / Success">
      <View style={{ backgroundColor: C.white }}>
        <View style={{ alignItems: 'center', paddingVertical: 60, paddingHorizontal: 24, gap: 12 }}>
          <View style={{ width: 64, height: 64, borderRadius: 32, borderWidth: 3, borderColor: C.green, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 28, color: C.green, fontWeight: '700' }}>✓</Text>
          </View>
          <Text style={{ fontSize: 18, fontWeight: '700', color: C.text }}>Объявление продлено!</Text>
          <Text style={{ fontSize: 14, color: C.muted, textAlign: 'center' }}>Активно до 30 мая.</Text>
          <Pressable style={{ backgroundColor: C.green, borderRadius: 8, paddingHorizontal: 24, paddingVertical: 12, marginTop: 8 }}>
            <Text style={{ color: C.white, fontWeight: '700', fontSize: 15 }}>Смотреть объявление</Text>
          </Pressable>
        </View>
        {width < 640 && <BottomNav active="post" />}
      </View>
    </StateSection>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN EXPORT
// ═══════════════════════════════════════════════════════════════════════════════

export default function ListingExpiredStates() {
  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 24 }} showsVerticalScrollIndicator={false}>
      <DefaultExpiredState />
      <FreeRenewalState />
      <RenewingLoadingState />
      <SuccessState />
    </ScrollView>
  );
}
