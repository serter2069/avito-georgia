import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, useWindowDimensions, ActivityIndicator, Modal } from 'react-native';
import BottomNav from '../BottomNav';
import ProtoImage from '../proto/ProtoPlaceholderImage';

const C = { green: '#00AA6C', greenBg: '#E8F9F2', white: '#FFFFFF', text: '#1A1A1A', muted: '#9E9E9E', border: '#E8E8E8' };

const PHOTOS = [30, 31, 32, 33, 34]; // seeds

function useLayout() {
  const { width } = useWindowDimensions();
  return { width, isMobile: width < 640, isDesktop: width >= 1024 };
}

// ─── Photo Gallery with thumbnails ───────────────────────────────────────────
function PhotoGallery({ onFavPress, fav, onPhotoPress }: {
  onFavPress: () => void;
  fav: boolean;
  onPhotoPress: (idx: number) => void;
}) {
  const [active, setActive] = useState(0);
  const { isDesktop } = useLayout();
  const mainH = isDesktop ? 380 : 260;

  return (
    <View>
      {/* Main photo */}
      <Pressable onPress={() => onPhotoPress(active)} style={{ position: 'relative' }}>
        <ProtoImage seed={PHOTOS[active]} width="100%" height={mainH} />

        {/* Heart */}
        <Pressable
          onPress={onFavPress}
          style={{ position: 'absolute', top: 12, right: 12, width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.92)', alignItems: 'center', justifyContent: 'center' }}
        >
          <Text style={{ fontSize: 18, color: fav ? '#E53935' : C.muted }}>{fav ? '♥' : '♡'}</Text>
        </Pressable>

        {/* Counter */}
        <View style={{ position: 'absolute', bottom: 10, right: 10, backgroundColor: 'rgba(0,0,0,0.55)', borderRadius: 5, paddingHorizontal: 7, paddingVertical: 3 }}>
          <Text style={{ color: '#fff', fontSize: 12, fontWeight: '600' }}>{active + 1} / {PHOTOS.length}</Text>
        </View>

        {/* Expand hint */}
        <View style={{ position: 'absolute', bottom: 10, left: 10, backgroundColor: 'rgba(0,0,0,0.45)', borderRadius: 5, paddingHorizontal: 7, paddingVertical: 3 }}>
          <Text style={{ color: '#fff', fontSize: 11 }}>нажмите для просмотра</Text>
        </View>
      </Pressable>

      {/* Thumbnail strip */}
      <View style={{ flexDirection: 'row', gap: 6, marginTop: 6 }}>
        {PHOTOS.map((seed, i) => (
          <Pressable
            key={i}
            onPress={() => setActive(i)}
            style={{
              flex: 1, height: 56, borderRadius: 6, overflow: 'hidden',
              borderWidth: 2, borderColor: i === active ? C.green : 'transparent',
            }}
          >
            <ProtoImage seed={seed} width="100%" height={56} />
          </Pressable>
        ))}
      </View>
    </View>
  );
}

// ─── Photo Lightbox (modal) ───────────────────────────────────────────────────
function PhotoLightbox({ visible, initialIndex, onClose }: {
  visible: boolean;
  initialIndex: number;
  onClose: () => void;
}) {
  const [idx, setIdx] = useState(initialIndex);
  const { width, height } = useWindowDimensions();

  // sync idx when lightbox opens
  React.useEffect(() => { if (visible) setIdx(initialIndex); }, [visible, initialIndex]);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.95)', justifyContent: 'center', alignItems: 'center' }}>
        {/* Close */}
        <Pressable onPress={onClose} style={{ position: 'absolute', top: 20, right: 20, zIndex: 10, width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: '#fff', fontSize: 20, lineHeight: 22 }}>×</Text>
        </Pressable>

        {/* Counter */}
        <View style={{ position: 'absolute', top: 28, left: 0, right: 0, alignItems: 'center' }}>
          <Text style={{ color: '#fff', fontSize: 14, fontWeight: '600' }}>{idx + 1} / {PHOTOS.length}</Text>
        </View>

        {/* Main image */}
        <View style={{ width: Math.min(width - 32, 800), aspectRatio: 4 / 3, borderRadius: 8, overflow: 'hidden' }}>
          <ProtoImage seed={PHOTOS[idx]} width="100%" height={400} />
        </View>

        {/* Prev / Next */}
        {idx > 0 && (
          <Pressable onPress={() => setIdx(idx - 1)} style={{ position: 'absolute', left: 16, top: '50%', transform: [{ translateY: -24 }], width: 48, height: 48, borderRadius: 24, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: '#fff', fontSize: 22 }}>‹</Text>
          </Pressable>
        )}
        {idx < PHOTOS.length - 1 && (
          <Pressable onPress={() => setIdx(idx + 1)} style={{ position: 'absolute', right: 16, top: '50%', transform: [{ translateY: -24 }], width: 48, height: 48, borderRadius: 24, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: '#fff', fontSize: 22 }}>›</Text>
          </Pressable>
        )}

        {/* Thumbnail strip */}
        <View style={{ position: 'absolute', bottom: 20, left: 0, right: 0, flexDirection: 'row', justifyContent: 'center', gap: 8, paddingHorizontal: 24 }}>
          {PHOTOS.map((seed, i) => (
            <Pressable key={i} onPress={() => setIdx(i)} style={{ width: 52, height: 38, borderRadius: 5, overflow: 'hidden', borderWidth: 2, borderColor: i === idx ? C.green : 'rgba(255,255,255,0.3)' }}>
              <ProtoImage seed={seed} width={52} height={38} />
            </Pressable>
          ))}
        </View>
      </View>
    </Modal>
  );
}

// ─── Fake Map ────────────────────────────────────────────────────────────────
function FakeMap() {
  return (
    <View>
      <Text style={{ fontSize: 16, fontWeight: '700', color: C.text, marginBottom: 10 }}>Местоположение</Text>
      <View style={{ height: 160, borderRadius: 12, overflow: 'hidden', borderWidth: 1, borderColor: C.border, backgroundColor: '#E8EDF0', position: 'relative', alignItems: 'center', justifyContent: 'center' }}>
        {/* Grid lines to simulate map */}
        {[40, 80, 120].map(y => (
          <View key={y} style={{ position: 'absolute', left: 0, right: 0, top: y, height: 1, backgroundColor: '#D0D8DC' }} />
        ))}
        {[80, 160, 240, 320].map(x => (
          <View key={x} style={{ position: 'absolute', top: 0, bottom: 0, left: x, width: 1, backgroundColor: '#D0D8DC' }} />
        ))}
        {/* Road suggestions */}
        <View style={{ position: 'absolute', top: 70, left: 0, right: 0, height: 3, backgroundColor: '#C8D0D4' }} />
        <View style={{ position: 'absolute', left: 140, top: 0, bottom: 0, width: 3, backgroundColor: '#C8D0D4' }} />

        {/* Pin marker */}
        <View style={{ alignItems: 'center' }}>
          <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: C.green, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.25, shadowRadius: 6, elevation: 6 }}>
            <Text style={{ color: '#fff', fontSize: 16 }}>◉</Text>
          </View>
          <View style={{ width: 0, height: 0, borderLeftWidth: 6, borderRightWidth: 6, borderTopWidth: 8, borderLeftColor: 'transparent', borderRightColor: 'transparent', borderTopColor: C.green, marginTop: -1 }} />
        </View>

        {/* Address label */}
        <View style={{ position: 'absolute', bottom: 10, left: 10, right: 10, backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: 6, paddingHorizontal: 10, paddingVertical: 6 }}>
          <Text style={{ fontSize: 12, color: C.text, fontWeight: '600' }}>Батуми, ул. Горгиладзе</Text>
          <Text style={{ fontSize: 11, color: C.muted }}>Аджара · 500м от центра</Text>
        </View>
      </View>
    </View>
  );
}

// ─── Similar Listings ─────────────────────────────────────────────────────────
const SIMILAR = [
  { seed: 35, title: '2-комн. квартира, море', price: '₾98 000', loc: 'Батуми' },
  { seed: 36, title: 'Студия 32м², новый дом', price: '₾55 000', loc: 'Батуми' },
  { seed: 37, title: '4-комн. пентхаус, вид', price: '₾210 000', loc: 'Батуми' },
];

function SimilarListings() {
  const { isDesktop } = useLayout();
  return (
    <View style={{ marginTop: 24 }}>
      <Text style={{ fontSize: 16, fontWeight: '700', color: C.text, marginBottom: 12 }}>Похожие объявления</Text>
      <View style={{ flexDirection: 'row', gap: 10 }}>
        {SIMILAR.map((item, i) => (
          <View key={i} style={{ flex: 1, borderRadius: 10, overflow: 'hidden', borderWidth: 1, borderColor: C.border, backgroundColor: C.white }}>
            <ProtoImage seed={item.seed} width="100%" height={90} />
            <View style={{ padding: 8 }}>
              <Text style={{ fontSize: 12, color: C.text, lineHeight: 16 }} numberOfLines={2}>{item.title}</Text>
              <Text style={{ fontSize: 14, fontWeight: '700', color: C.text, marginTop: 4 }}>{item.price}</Text>
              <Text style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>{item.loc}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

// ─── Seller Row ───────────────────────────────────────────────────────────────
function SellerRow() {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 14, borderTopWidth: 1, borderTopColor: C.border, marginTop: 4 }}>
      <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: '#B2DFDB', alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontSize: 17, fontWeight: '700', color: '#00695C' }}>МК</Text>
      </View>
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text style={{ fontSize: 15, fontWeight: '600', color: C.text }}>Михаил Кварацхелия</Text>
        <Text style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>★ 4.8 · На сайте с 2022</Text>
      </View>
      {/* Removed "Профиль" text — arrow is enough */}
      <Text style={{ fontSize: 18, color: C.muted }}>›</Text>
    </View>
  );
}

// ─── Listing Info ─────────────────────────────────────────────────────────────
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

// ─── Default View ─────────────────────────────────────────────────────────────
export function DefaultView() {
  const [fav, setFav] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIdx, setLightboxIdx] = useState(0);
  const { isMobile, isDesktop } = useLayout();
  const horizontalPadding = isDesktop ? 32 : 16;

  const openLightbox = (idx: number) => { setLightboxIdx(idx); setLightboxOpen(true); };

  return (
    <View style={{ flex: 1, backgroundColor: C.white }}>
      {/* Back bar */}
      <View style={{ backgroundColor: C.white, borderBottomWidth: 1, borderBottomColor: C.border, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12 }}>
        <Pressable style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Text style={{ fontSize: 20, color: C.text }}>←</Text>
          <Text style={{ fontSize: 15, fontWeight: '500', color: C.text }}>Назад</Text>
        </Pressable>
        <View style={{ flex: 1 }} />
        <Text style={{ fontSize: 13, color: C.muted }}>Поделиться</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: isMobile ? 80 : 32 }}>
        {isDesktop ? (
          <View style={{ maxWidth: 1100, alignSelf: 'center', width: '100%', paddingHorizontal: horizontalPadding, paddingTop: 24 }}>
            <View style={{ flexDirection: 'row', gap: 28, alignItems: 'flex-start' }}>
              {/* Left: gallery */}
              <View style={{ width: '55%' }}>
                <View style={{ borderRadius: 12, overflow: 'hidden', borderWidth: 1, borderColor: C.border, padding: 12, gap: 8, backgroundColor: C.white }}>
                  <PhotoGallery onFavPress={() => setFav(!fav)} fav={fav} onPhotoPress={openLightbox} />
                </View>
                <View style={{ marginTop: 20 }}>
                  <FakeMap />
                </View>
              </View>
              {/* Right: info */}
              <View style={{ flex: 1, backgroundColor: C.white, borderRadius: 12, borderWidth: 1, borderColor: C.border, padding: 24 }}>
                <ListingInfo />
                <CTAButtons loading={false} />
                <View style={{ marginTop: 24 }}>
                  <SimilarListings />
                </View>
              </View>
            </View>
          </View>
        ) : (
          <View>
            <View style={{ padding: 10, paddingBottom: 0 }}>
              <PhotoGallery onFavPress={() => setFav(!fav)} fav={fav} onPhotoPress={openLightbox} />
            </View>
            <View style={{ backgroundColor: C.white, padding: horizontalPadding, marginTop: 8 }}>
              <ListingInfo />
              <CTAButtons loading={false} />
              <View style={{ marginTop: 24 }}><FakeMap /></View>
              <SimilarListings />
            </View>
          </View>
        )}
      </ScrollView>

      {isMobile && <BottomNav />}

      {/* Photo lightbox */}
      <PhotoLightbox visible={lightboxOpen} initialIndex={lightboxIdx} onClose={() => setLightboxOpen(false)} />
    </View>
  );
}

// ─── Photo Lightbox State (static preview) ───────────────────────────────────
function LightboxPreview() {
  const { width } = useWindowDimensions();
  const [idx, setIdx] = useState(2);
  return (
    <StateSection title="LISTING_DETAIL__PHOTO_LIGHTBOX">
      <View style={{ backgroundColor: 'rgba(0,0,0,0.95)', minHeight: 400, justifyContent: 'center', alignItems: 'center', paddingVertical: 24 }}>
        {/* Close */}
        <View style={{ position: 'absolute', top: 16, right: 16, width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: '#fff', fontSize: 20 }}>×</Text>
        </View>

        {/* Counter */}
        <View style={{ position: 'absolute', top: 24, left: 0, right: 0, alignItems: 'center' }}>
          <Text style={{ color: '#fff', fontSize: 14, fontWeight: '600' }}>{idx + 1} / {PHOTOS.length}</Text>
        </View>

        {/* Main image */}
        <View style={{ width: Math.min(width - 80, 720), aspectRatio: 4 / 3, borderRadius: 8, overflow: 'hidden' }}>
          <ProtoImage seed={PHOTOS[idx]} width="100%" height={400} />
        </View>

        {/* Arrows */}
        <Pressable onPress={() => setIdx(Math.max(0, idx - 1))} style={{ position: 'absolute', left: 12, top: '50%', transform: [{ translateY: -24 }], width: 48, height: 48, borderRadius: 24, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: '#fff', fontSize: 26 }}>‹</Text>
        </Pressable>
        <Pressable onPress={() => setIdx(Math.min(PHOTOS.length - 1, idx + 1))} style={{ position: 'absolute', right: 12, top: '50%', transform: [{ translateY: -24 }], width: 48, height: 48, borderRadius: 24, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: '#fff', fontSize: 26 }}>›</Text>
        </Pressable>

        {/* Thumbnail strip */}
        <View style={{ position: 'absolute', bottom: 16, left: 0, right: 0, flexDirection: 'row', justifyContent: 'center', gap: 8 }}>
          {PHOTOS.map((seed, i) => (
            <Pressable key={i} onPress={() => setIdx(i)} style={{ width: 52, height: 38, borderRadius: 5, overflow: 'hidden', borderWidth: 2, borderColor: i === idx ? C.green : 'rgba(255,255,255,0.3)' }}>
              <ProtoImage seed={seed} width={52} height={38} />
            </Pressable>
          ))}
        </View>
      </View>
    </StateSection>
  );
}

// ─── Contact Loading State ─────────────────────────────────────────────────────
function ContactLoadingView() {
  const [fav, setFav] = useState(false);
  const { isMobile, isDesktop } = useLayout();
  const horizontalPadding = isDesktop ? 32 : 16;

  return (
    <View style={{ flex: 1, backgroundColor: C.white }}>
      <View style={{ backgroundColor: C.white, borderBottomWidth: 1, borderBottomColor: C.border, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12 }}>
        <Pressable style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Text style={{ fontSize: 20, color: C.text }}>←</Text>
          <Text style={{ fontSize: 15, fontWeight: '500', color: C.text }}>Назад</Text>
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: isMobile ? 80 : 32 }}>
        <View>
          <View style={{ padding: 10, paddingBottom: 0 }}>
            <PhotoGallery onFavPress={() => setFav(!fav)} fav={fav} onPhotoPress={() => {}} />
          </View>
          <View style={{ backgroundColor: C.white, padding: horizontalPadding, marginTop: 8 }}>
            <ListingInfo />
            <CTAButtons loading />
            <View style={{ marginTop: 12, padding: 14, backgroundColor: C.greenBg, borderRadius: 8, alignItems: 'center' }}>
              <Text style={{ fontSize: 13, color: C.green, fontWeight: '500' }}>Открываем чат с продавцом...</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {isMobile && <BottomNav />}
    </View>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════

export default DefaultView;
