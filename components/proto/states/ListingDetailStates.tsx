import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, useWindowDimensions, ActivityIndicator } from 'react-native';
import { StateSection } from '../StateSection';
import BottomNav from '../BottomNav';
import ProtoImage from '../ProtoPlaceholderImage';

// ─── Design Tokens ────────────────────────────────────────────────────────────
const C = { green: '#00AA6C', greenBg: '#E8F9F2', white: '#FFFFFF', text: '#1A1A1A', muted: '#9E9E9E', border: '#E8E8E8' };
const IMG_COLORS = ['#BBDEFB', '#C8E6C9', '#F8BBD0', '#E1BEE7', '#FFF9C4'];

function useLayout() {
  const { width } = useWindowDimensions();
  return { width, isMobile: width < 640, isDesktop: width >= 1024 };
}

// ─── Photo Gallery ────────────────────────────────────────────────────────────
function PhotoGallery({ onFavPress, fav }: { onFavPress: () => void; fav: boolean }) {
  const [activePhoto, setActivePhoto] = useState(0);
  const { isMobile, isDesktop } = useLayout();
  const galleryHeight = isDesktop ? 400 : 280;

  return (
    <View style={{ position: 'relative', height: galleryHeight, width: '100%' }}>
      <ProtoImage seed={activePhoto + 30} width="100%" height={galleryHeight} />

      {/* Heart button top-right */}
      <Pressable
        onPress={onFavPress}
        style={{ position: 'absolute', top: 12, right: 12, width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.92)', alignItems: 'center', justifyContent: 'center' }}
      >
        <Text style={{ fontSize: 18, color: fav ? '#E53935' : '#9E9E9E' }}>{fav ? '♥' : '♡'}</Text>
      </Pressable>

      {/* Photo count badge bottom-right */}
      <View style={{ position: 'absolute', bottom: 6, right: 6, backgroundColor: 'rgba(0,0,0,0.55)', borderRadius: 4, paddingHorizontal: 5, paddingVertical: 2 }}>
        <Text style={{ color: '#fff', fontSize: 10, fontWeight: '600' }}>5 фото</Text>
      </View>

      {/* Dot navigation bottom-center */}
      <View style={{ position: 'absolute', bottom: 16, left: 0, right: 0, flexDirection: 'row', justifyContent: 'center', gap: 6 }}>
        {IMG_COLORS.map((_, i) => (
          <Pressable key={i} onPress={() => setActivePhoto(i)} hitSlop={8}>
            <View style={{
              width: i === activePhoto ? 18 : 8, height: 8, borderRadius: 4,
              backgroundColor: i === activePhoto ? C.white : 'rgba(255,255,255,0.45)',
            }} />
          </Pressable>
        ))}
      </View>
    </View>
  );
}

// ─── Seller Info Row ──────────────────────────────────────────────────────────
function SellerRow() {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 16, borderTopWidth: 1, borderTopColor: C.border, marginTop: 4 }}>
      <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: '#B2DFDB', alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontSize: 18, fontWeight: '700', color: '#00695C' }}>МК</Text>
      </View>
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text style={{ fontSize: 15, fontWeight: '600', color: C.text }}>Михаил Кварацхелия</Text>
        <Text style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>★ 4.8 · На сайте с 2022</Text>
      </View>
      <Text style={{ fontSize: 12, color: C.green, fontWeight: '500' }}>Профиль</Text>
    </View>
  );
}

// ─── Detail Info ──────────────────────────────────────────────────────────────
function ListingInfo() {
  return (
    <View>
      <Text style={{ fontSize: 22, fontWeight: '700', color: C.text, lineHeight: 30 }}>
        3-комнатная квартира, Батуми, вид на море
      </Text>
      <Text style={{ fontSize: 26, fontWeight: '800', color: C.text, marginTop: 10 }}>₾125 000</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6, gap: 6 }}>
        <Text style={{ fontSize: 13, color: C.muted }}>Батуми, Аджара</Text>
        <Text style={{ fontSize: 13, color: C.border }}>·</Text>
        <Text style={{ fontSize: 13, color: C.muted }}>3 часа назад</Text>
      </View>
      <SellerRow />
      <Text style={{ fontSize: 15, color: C.text, lineHeight: 24 }}>
        Просторная 3-комнатная квартира с панорамным видом на море. Современный ремонт, полностью меблирована. 5 минут пешком до пляжа, рядом вся инфраструктура. Окна выходят на Черное море. Есть кондиционеры, встроенная кухня, джакузи.
      </Text>
    </View>
  );
}

// ─── CTA Buttons ──────────────────────────────────────────────────────────────
function CTAButtons({ loading }: { loading: boolean }) {
  return (
    <View style={{ flexDirection: 'row', gap: 10, marginTop: 20 }}>
      <Pressable style={{ flex: 1, backgroundColor: C.green, borderRadius: 10, paddingVertical: 14, alignItems: 'center', justifyContent: 'center' }}>
        {loading ? (
          <ActivityIndicator color={C.white} size="small" />
        ) : (
          <Text style={{ color: C.white, fontWeight: '700', fontSize: 15 }}>Написать продавцу</Text>
        )}
      </Pressable>
      <Pressable style={{ flex: 1, borderRadius: 10, borderWidth: 1.5, borderColor: C.green, paddingVertical: 14, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: C.green, fontWeight: '700', fontSize: 15 }}>Позвонить</Text>
      </Pressable>
    </View>
  );
}

// ─── Default View State ───────────────────────────────────────────────────────
function DefaultView() {
  const [fav, setFav] = useState(false);
  const { isMobile, isDesktop, width } = useLayout();
  const horizontalPadding = isDesktop ? 32 : 16;

  return (
    <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      {/* Back button */}
      <View style={{ backgroundColor: C.white, borderBottomWidth: 1, borderBottomColor: C.border, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12 }}>
        <Pressable style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Text style={{ fontSize: 20, color: C.text, lineHeight: 24 }}>←</Text>
          <Text style={{ fontSize: 15, fontWeight: '500', color: C.text }}>Назад</Text>
        </Pressable>
        <View style={{ flex: 1 }} />
        <Text style={{ fontSize: 13, color: C.muted }}>Поделиться</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: isMobile ? 80 : 32 }}>
        {isDesktop ? (
          // Desktop: 2-column layout
          <View style={{ maxWidth: 1100, alignSelf: 'center', width: '100%', paddingHorizontal: horizontalPadding, paddingTop: 24 }}>
            <View style={{ flexDirection: 'row', gap: 32 }}>
              {/* Left: gallery 55% */}
              <View style={{ width: '55%' }}>
                <View style={{ borderRadius: 12, overflow: 'hidden', borderWidth: 1, borderColor: C.border }}>
                  <PhotoGallery onFavPress={() => setFav(!fav)} fav={fav} />
                </View>
              </View>
              {/* Right: info 45% */}
              <View style={{ flex: 1, backgroundColor: C.white, borderRadius: 12, borderWidth: 1, borderColor: C.border, padding: 24 }}>
                <ListingInfo />
                <CTAButtons loading={false} />
              </View>
            </View>
          </View>
        ) : (
          // Mobile/tablet: stacked layout
          <View>
            <PhotoGallery onFavPress={() => setFav(!fav)} fav={fav} />
            <View style={{ backgroundColor: C.white, padding: horizontalPadding, marginTop: 8 }}>
              <ListingInfo />
              <CTAButtons loading={false} />
            </View>
          </View>
        )}
      </ScrollView>

      {isMobile && <BottomNav />}
    </View>
  );
}

// ─── Contact Loading State ────────────────────────────────────────────────────
function ContactLoadingView() {
  const [fav, setFav] = useState(false);
  const { isMobile, isDesktop } = useLayout();
  const horizontalPadding = isDesktop ? 32 : 16;

  return (
    <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <View style={{ backgroundColor: C.white, borderBottomWidth: 1, borderBottomColor: C.border, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12 }}>
        <Pressable style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Text style={{ fontSize: 20, color: C.text, lineHeight: 24 }}>←</Text>
          <Text style={{ fontSize: 15, fontWeight: '500', color: C.text }}>Назад</Text>
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: isMobile ? 80 : 32 }}>
        {isDesktop ? (
          <View style={{ maxWidth: 1100, alignSelf: 'center', width: '100%', paddingHorizontal: horizontalPadding, paddingTop: 24 }}>
            <View style={{ flexDirection: 'row', gap: 32 }}>
              <View style={{ width: '55%' }}>
                <View style={{ borderRadius: 12, overflow: 'hidden', borderWidth: 1, borderColor: C.border }}>
                  <PhotoGallery onFavPress={() => setFav(!fav)} fav={fav} />
                </View>
              </View>
              <View style={{ flex: 1, backgroundColor: C.white, borderRadius: 12, borderWidth: 1, borderColor: C.border, padding: 24 }}>
                <ListingInfo />
                <CTAButtons loading={true} />
                <View style={{ marginTop: 12, padding: 12, backgroundColor: C.greenBg, borderRadius: 8, alignItems: 'center' }}>
                  <Text style={{ fontSize: 13, color: C.green, fontWeight: '500' }}>Открываем чат с продавцом...</Text>
                </View>
              </View>
            </View>
          </View>
        ) : (
          <View>
            <PhotoGallery onFavPress={() => setFav(!fav)} fav={fav} />
            <View style={{ backgroundColor: C.white, padding: horizontalPadding, marginTop: 8 }}>
              <ListingInfo />
              <CTAButtons loading={true} />
              <View style={{ marginTop: 12, padding: 12, backgroundColor: C.greenBg, borderRadius: 8, alignItems: 'center' }}>
                <Text style={{ fontSize: 13, color: C.green, fontWeight: '500' }}>Открываем чат с продавцом...</Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {isMobile && <BottomNav />}
    </View>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN EXPORT
// ═══════════════════════════════════════════════════════════════════════════════
export default function ListingDetailStates() {
  return (
    <View style={{ gap: 32 }}>
      <StateSection title="LISTING_DETAIL_DEFAULT">
        <DefaultView />
      </StateSection>
      <StateSection title="LISTING_DETAIL_CONTACT_LOADING">
        <ContactLoadingView />
      </StateSection>
    </View>
  );
}
