import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, useWindowDimensions, ActivityIndicator, Modal, Image, Linking, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import BottomNav from '../BottomNav';
import ProtoImage from '../proto/ProtoPlaceholderImage';
import { apiFetch } from '../../lib/api';
import { useAuthStore } from '../../store/auth';
import { colors } from '../../lib/theme';

const FALLBACK_SEEDS = [30, 31, 32, 33, 34]; // used when listing has no photos

function useLayout() {
  const { width } = useWindowDimensions();
  return { width, isMobile: width < 640, isDesktop: width >= 1024 };
}

// ─── Photo Gallery with thumbnails ───────────────────────────────────────────
function PhotoGallery({ photos, onFavPress, fav, onPhotoPress }: {
  photos: { url?: string; seed?: number }[];
  onFavPress: () => void;
  fav: boolean;
  onPhotoPress: (idx: number) => void;
}) {
  const [active, setActive] = useState(0);
  const { isDesktop } = useLayout();
  const mainH = isDesktop ? 380 : 260;

  function renderPhoto(photo: { url?: string; seed?: number }, width: any, height: number, style?: any) {
    if (photo.url) {
      return <Image source={{ uri: photo.url }} style={[{ width, height }, style]} resizeMode="cover" />;
    }
    return <ProtoImage seed={photo.seed ?? 30} width={width} height={height} />;
  }

  return (
    <View>
      {/* Main photo */}
      <Pressable onPress={() => onPhotoPress(active)} accessibilityLabel="Открыть фото" style={{ position: 'relative' }}>
        {renderPhoto(photos[active] ?? {}, '100%', mainH)}

        {/* Heart */}
        <Pressable
          onPress={onFavPress}
          accessibilityLabel="Добавить в избранное"
          style={{ position: 'absolute', top: 12, right: 12, width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.92)', alignItems: 'center', justifyContent: 'center' }}
        >
          <Text style={{ fontSize: 18, color: fav ? '#E53935' : colors.textSecondary }}>{fav ? '♥' : '♡'}</Text>
        </Pressable>

        {/* Counter */}
        <View style={{ position: 'absolute', bottom: 10, right: 10, backgroundColor: 'rgba(0,0,0,0.55)', borderRadius: 5, paddingHorizontal: 7, paddingVertical: 3 }}>
          <Text style={{ color: '#fff', fontSize: 12, fontWeight: '600' }}>{active + 1} / {photos.length}</Text>
        </View>

        {/* Expand hint */}
        <View style={{ position: 'absolute', bottom: 10, left: 10, backgroundColor: 'rgba(0,0,0,0.45)', borderRadius: 5, paddingHorizontal: 7, paddingVertical: 3 }}>
          <Text style={{ color: '#fff', fontSize: 12 }}>нажмите для просмотра</Text>
        </View>
      </Pressable>

      {/* Thumbnail strip */}
      <View style={{ flexDirection: 'row', gap: 6, marginTop: 6 }}>
        {photos.map((photo, i) => (
          <Pressable
            key={i}
            onPress={() => setActive(i)}
            accessibilityLabel={`Фото ${i + 1}`}
            style={{
              flex: 1, height: 56, borderRadius: 6, overflow: 'hidden',
              borderWidth: 2, borderColor: i === active ? colors.primary : 'transparent',
            }}
          >
            {renderPhoto(photo, '100%', 56)}
          </Pressable>
        ))}
      </View>
    </View>
  );
}

// ─── Photo Lightbox (modal) ───────────────────────────────────────────────────
function PhotoLightbox({ photos, visible, initialIndex, onClose }: {
  photos: { url?: string; seed?: number }[];
  visible: boolean;
  initialIndex: number;
  onClose: () => void;
}) {
  const [idx, setIdx] = useState(initialIndex);
  const { width } = useWindowDimensions();

  // sync idx when lightbox opens
  React.useEffect(() => { if (visible) setIdx(initialIndex); }, [visible, initialIndex]);

  function renderPhoto(photo: { url?: string; seed?: number }, w: any, h: number) {
    if (photo?.url) return <Image source={{ uri: photo.url }} style={{ width: w, height: h }} resizeMode="cover" />;
    return <ProtoImage seed={photo?.seed ?? 30} width={w} height={h} />;
  }

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.95)', justifyContent: 'center', alignItems: 'center' }}>
        {/* Close */}
        <Pressable onPress={onClose} accessibilityLabel="Закрыть" style={{ position: 'absolute', top: 20, right: 20, zIndex: 10, width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: '#fff', fontSize: 20, lineHeight: 22 }}>×</Text>
        </Pressable>

        {/* Counter */}
        <View style={{ position: 'absolute', top: 28, left: 0, right: 0, alignItems: 'center' }}>
          <Text style={{ color: '#fff', fontSize: 14, fontWeight: '600' }}>{idx + 1} / {photos.length}</Text>
        </View>

        {/* Main image */}
        <View style={{ width: Math.min(width - 32, 800), aspectRatio: 4 / 3, borderRadius: 8, overflow: 'hidden' }}>
          {renderPhoto(photos[idx] ?? {}, '100%', 400)}
        </View>

        {/* Prev / Next */}
        {idx > 0 && (
          <Pressable onPress={() => setIdx(idx - 1)} accessibilityLabel="Предыдущее фото" style={{ position: 'absolute', left: 16, top: '50%', transform: [{ translateY: -24 }], width: 48, height: 48, borderRadius: 24, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: '#fff', fontSize: 22 }}>‹</Text>
          </Pressable>
        )}
        {idx < photos.length - 1 && (
          <Pressable onPress={() => setIdx(idx + 1)} accessibilityLabel="Следующее фото" style={{ position: 'absolute', right: 16, top: '50%', transform: [{ translateY: -24 }], width: 48, height: 48, borderRadius: 24, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: '#fff', fontSize: 22 }}>›</Text>
          </Pressable>
        )}

        {/* Thumbnail strip */}
        <View style={{ position: 'absolute', bottom: 20, left: 0, right: 0, flexDirection: 'row', justifyContent: 'center', gap: 8, paddingHorizontal: 24 }}>
          {photos.map((photo, i) => (
            <Pressable key={i} onPress={() => setIdx(i)} accessibilityLabel={`Фото ${i + 1}`} style={{ width: 52, height: 38, borderRadius: 5, overflow: 'hidden', borderWidth: 2, borderColor: i === idx ? colors.primary : 'rgba(255,255,255,0.3)' }}>
              {renderPhoto(photo, 52, 38)}
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
      <Text style={{ fontSize: 16, fontWeight: '700', color: colors.text, marginBottom: 10 }}>Местоположение</Text>
      <View style={{ height: 160, borderRadius: 12, overflow: 'hidden', borderWidth: 1, borderColor: '#E8E8E8', backgroundColor: '#E8EDF0', position: 'relative', alignItems: 'center', justifyContent: 'center' }}>
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
          <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.25, shadowRadius: 6, elevation: 6 }}>
            <Text style={{ color: '#fff', fontSize: 16 }}>◉</Text>
          </View>
          <View style={{ width: 0, height: 0, borderLeftWidth: 6, borderRightWidth: 6, borderTopWidth: 8, borderLeftColor: 'transparent', borderRightColor: 'transparent', borderTopColor: colors.primary, marginTop: -1 }} />
        </View>

        {/* Address label */}
        <View style={{ position: 'absolute', bottom: 10, left: 10, right: 10, backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: 6, paddingHorizontal: 10, paddingVertical: 6 }}>
          <Text style={{ fontSize: 12, color: colors.text, fontWeight: '600' }}>Батуми, ул. Горгиладзе</Text>
          <Text style={{ fontSize: 12, color: colors.textSecondary }}>Аджара · 500м от центра</Text>
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
      <Text style={{ fontSize: 16, fontWeight: '700', color: colors.text, marginBottom: 12 }}>Похожие объявления</Text>
      <View style={{ flexDirection: 'row', gap: 10 }}>
        {SIMILAR.map((item, i) => (
          <View key={i} style={{ flex: 1, borderRadius: 10, overflow: 'hidden', borderWidth: 1, borderColor: '#E8E8E8', backgroundColor: colors.background }}>
            <ProtoImage seed={item.seed} width="100%" height={90} />
            <View style={{ padding: 8 }}>
              <Text style={{ fontSize: 12, color: colors.text, lineHeight: 16 }} numberOfLines={2}>{item.title}</Text>
              <Text style={{ fontSize: 14, fontWeight: '700', color: colors.text, marginTop: 4 }}>{item.price}</Text>
              <Text style={{ fontSize: 12, color: colors.textSecondary, marginTop: 2 }}>{item.loc}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

// ─── Seller Row ───────────────────────────────────────────────────────────────
function SellerRow({ user }: { user?: { name?: string; avatarUrl?: string | null } }) {
  const name = user?.name ?? 'Продавец';
  const initials = name.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 14, borderTopWidth: 1, borderTopColor: '#E8E8E8', marginTop: 4 }}>
      <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: '#B2DFDB', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        {user?.avatarUrl
          ? <Image source={{ uri: user.avatarUrl }} style={{ width: 44, height: 44 }} />
          : <Text style={{ fontSize: 17, fontWeight: '700', color: '#00695C' }}>{initials}</Text>
        }
      </View>
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text style={{ fontSize: 15, fontWeight: '600', color: colors.text }}>{name}</Text>
      </View>
      <Text style={{ fontSize: 18, color: colors.textSecondary }}>›</Text>
    </View>
  );
}

// ─── Listing Info ─────────────────────────────────────────────────────────────
function ListingInfo({ listing }: { listing?: any }) {
  const title = listing?.title ?? '3-комнатная квартира, Батуми, вид на море';
  const currency = listing?.currency === 'GEL' ? '₾' : (listing?.currency ?? '₾');
  const price = listing?.price != null
    ? `${currency}${Number(listing.price).toLocaleString('ru-RU')}${listing.isNegotiable ? ' (торг)' : ''}`
    : '₾125 000';
  const cityName = listing?.city?.name ?? 'Батуми';
  const description = listing?.description ?? '';

  return (
    <View>
      <Text style={{ fontSize: 22, fontWeight: '700', color: colors.text, lineHeight: 30 }}>{title}</Text>
      <Text style={{ fontSize: 26, fontWeight: '800', color: colors.text, marginTop: 10 }}>{price}</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6, gap: 6 }}>
        <Text style={{ fontSize: 13, color: colors.textSecondary }}>{cityName}{listing?.address ? `, ${listing.address}` : ''}</Text>
      </View>
      <SellerRow user={listing?.user} />
      {description ? (
        <Text style={{ fontSize: 15, color: colors.text, lineHeight: 24 }}>{description}</Text>
      ) : null}
    </View>
  );
}

// ─── CTA Buttons ──────────────────────────────────────────────────────────────
function CTAButtons({ loading, listingId, isOwner, listing }: { loading: boolean; listingId?: string; isOwner?: boolean; listing?: any }) {
  const router = useRouter();
  const { isLoggedIn } = useAuthStore();
  const [phoneLoading, setPhoneLoading] = useState(false);

  const handleCall = async () => {
    if (!isLoggedIn) {
      Alert.alert(
        'Требуется вход',
        'Войдите в аккаунт, чтобы увидеть номер телефона',
        [
          { text: 'Отмена', style: 'cancel' },
          { text: 'Войти', onPress: () => router.push('/auth' as any) },
        ]
      );
      return;
    }
    if (!listingId) return;
    setPhoneLoading(true);
    try {
      const data = await apiFetch(`/listings/${listingId}/phone`);
      if (data.phone) {
        Linking.openURL('tel:' + data.phone);
      } else {
        Alert.alert('Телефон не указан', 'Продавец не указал номер телефона.');
      }
    } catch (err: any) {
      if (err?.statusCode === 429 || err?.status === 429) {
        Alert.alert('Слишком много запросов', 'Попробуйте позже.');
      } else {
        Alert.alert('Ошибка', 'Не удалось получить номер телефона.');
      }
    } finally {
      setPhoneLoading(false);
    }
  };

  if (isOwner) {
    return (
      <View style={{ flexDirection: 'row', gap: 10, marginTop: 20 }}>
        <Pressable
          onPress={() => router.push(`/payment?listingId=${listingId}` as any)}
          accessibilityLabel="Продвинуть объявление"
          style={{ flex: 1, backgroundColor: colors.primary, borderRadius: 10, paddingVertical: 14, alignItems: 'center', justifyContent: 'center' }}
        >
          <Text style={{ color: colors.background, fontWeight: '700', fontSize: 15 }}>Продвинуть</Text>
        </Pressable>
        <Pressable
          onPress={() => router.push(`/listings/${listingId}/edit` as any)}
          accessibilityLabel="Редактировать объявление"
          style={{ flex: 1, borderRadius: 10, borderWidth: 1.5, borderColor: colors.primary, paddingVertical: 14, alignItems: 'center', justifyContent: 'center' }}
        >
          <Text style={{ color: colors.primary, fontWeight: '700', fontSize: 15 }}>Редактировать</Text>
        </Pressable>
      </View>
    );
  }
  return (
    <View style={{ flexDirection: 'row', gap: 10, marginTop: 20 }}>
      <Pressable
        onPress={() => listingId && router.push(`/listings/${listingId}/contact` as any)}
        accessibilityLabel="Написать продавцу"
        style={{ flex: 1, backgroundColor: colors.primary, borderRadius: 10, paddingVertical: 14, alignItems: 'center', justifyContent: 'center' }}
      >
        {loading ? (
          <ActivityIndicator color={colors.background} size="small" />
        ) : (
          <Text style={{ color: colors.background, fontWeight: '700', fontSize: 15 }}>Написать продавцу</Text>
        )}
      </Pressable>
      <Pressable
        onPress={handleCall}
        disabled={phoneLoading}
        accessibilityLabel="Позвонить продавцу"
        style={{ flex: 1, borderRadius: 10, borderWidth: 1.5, borderColor: colors.primary, paddingVertical: 14, alignItems: 'center', justifyContent: 'center' }}
      >
        {phoneLoading ? (
          <ActivityIndicator color={colors.primary} size="small" />
        ) : (
          <Text style={{ color: colors.primary, fontWeight: '700', fontSize: 15 }}>Позвонить</Text>
        )}
      </Pressable>
    </View>
  );
}

// ─── Default View ─────────────────────────────────────────────────────────────
export function DefaultView({ listing, isOwner }: { listing?: any; isOwner?: boolean }) {
  const [fav, setFav] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIdx, setLightboxIdx] = useState(0);
  const { isMobile, isDesktop } = useLayout();
  const horizontalPadding = isDesktop ? 32 : 16;
  const router = useRouter();

  const openLightbox = (idx: number) => { setLightboxIdx(idx); setLightboxOpen(true); };

  // Build photos array: real photos from API or fallback seeds
  const photos: { url?: string; seed?: number }[] = listing?.photos?.length
    ? listing.photos.map((p: any) => ({ url: p.url }))
    : FALLBACK_SEEDS.map(seed => ({ seed }));

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Back bar */}
      <View style={{ backgroundColor: colors.background, borderBottomWidth: 1, borderBottomColor: '#E8E8E8', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12 }}>
        <Pressable onPress={() => router.back()} accessibilityLabel="Назад" style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Text style={{ fontSize: 20, color: colors.text }}>←</Text>
          <Text style={{ fontSize: 15, fontWeight: '500', color: colors.text }}>Назад</Text>
        </Pressable>
        <View style={{ flex: 1 }} />
        <Text style={{ fontSize: 13, color: colors.textSecondary }}>Поделиться</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: isMobile ? 80 : 32 }}>
        {isDesktop ? (
          <View style={{ maxWidth: 1100, alignSelf: 'center', width: '100%', paddingHorizontal: horizontalPadding, paddingTop: 24 }}>
            <View style={{ flexDirection: 'row', gap: 28, alignItems: 'flex-start' }}>
              {/* Left: gallery */}
              <View style={{ width: '55%' }}>
                <View style={{ borderRadius: 12, overflow: 'hidden', borderWidth: 1, borderColor: '#E8E8E8', padding: 12, gap: 8, backgroundColor: colors.background }}>
                  <PhotoGallery photos={photos} onFavPress={() => setFav(!fav)} fav={fav} onPhotoPress={openLightbox} />
                </View>
                <View style={{ marginTop: 20 }}>
                  <FakeMap />
                </View>
              </View>
              {/* Right: info */}
              <View style={{ flex: 1, backgroundColor: colors.background, borderRadius: 12, borderWidth: 1, borderColor: '#E8E8E8', padding: 24 }}>
                <ListingInfo listing={listing} />
                <CTAButtons loading={false} listingId={listing?.id} isOwner={isOwner} listing={listing} />
                <View style={{ marginTop: 24 }}>
                  <SimilarListings />
                </View>
              </View>
            </View>
          </View>
        ) : (
          <View>
            <View style={{ padding: 10, paddingBottom: 0 }}>
              <PhotoGallery photos={photos} onFavPress={() => setFav(!fav)} fav={fav} onPhotoPress={openLightbox} />
            </View>
            <View style={{ backgroundColor: colors.background, padding: horizontalPadding, marginTop: 8 }}>
              <ListingInfo listing={listing} />
              <CTAButtons loading={false} listingId={listing?.id} isOwner={isOwner} listing={listing} />
              <View style={{ marginTop: 24 }}><FakeMap /></View>
              <SimilarListings />
            </View>
          </View>
        )}
      </ScrollView>

      {isMobile && <BottomNav />}

      {/* Photo lightbox */}
      <PhotoLightbox photos={photos} visible={lightboxOpen} initialIndex={lightboxIdx} onClose={() => setLightboxOpen(false)} />
    </View>
  );
}

// ─── Photo Lightbox State (static preview — uses fallback seeds) ──────────────
function LightboxPreview() {
  const { width } = useWindowDimensions();
  const [idx, setIdx] = useState(2);
  const photos = FALLBACK_SEEDS.map(seed => ({ seed }));
  return (
      <View style={{ backgroundColor: 'rgba(0,0,0,0.95)', minHeight: 400, justifyContent: 'center', alignItems: 'center', paddingVertical: 24 }}>
        {/* Close */}
        <View style={{ position: 'absolute', top: 16, right: 16, width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: '#fff', fontSize: 20 }}>×</Text>
        </View>

        {/* Counter */}
        <View style={{ position: 'absolute', top: 24, left: 0, right: 0, alignItems: 'center' }}>
          <Text style={{ color: '#fff', fontSize: 14, fontWeight: '600' }}>{idx + 1} / {photos.length}</Text>
        </View>

        {/* Main image */}
        <View style={{ width: Math.min(width - 80, 720), aspectRatio: 4 / 3, borderRadius: 8, overflow: 'hidden' }}>
          <ProtoImage seed={photos[idx].seed} width="100%" height={400} />
        </View>

        {/* Arrows */}
        <Pressable onPress={() => setIdx(Math.max(0, idx - 1))} accessibilityLabel="Предыдущее фото" style={{ position: 'absolute', left: 12, top: '50%', transform: [{ translateY: -24 }], width: 48, height: 48, borderRadius: 24, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: '#fff', fontSize: 26 }}>‹</Text>
        </Pressable>
        <Pressable onPress={() => setIdx(Math.min(photos.length - 1, idx + 1))} accessibilityLabel="Следующее фото" style={{ position: 'absolute', right: 12, top: '50%', transform: [{ translateY: -24 }], width: 48, height: 48, borderRadius: 24, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: '#fff', fontSize: 26 }}>›</Text>
        </Pressable>

        {/* Thumbnail strip */}
        <View style={{ position: 'absolute', bottom: 16, left: 0, right: 0, flexDirection: 'row', justifyContent: 'center', gap: 8 }}>
          {photos.map((photo, i) => (
            <Pressable key={i} onPress={() => setIdx(i)} accessibilityLabel={`Фото ${i + 1}`} style={{ width: 52, height: 38, borderRadius: 5, overflow: 'hidden', borderWidth: 2, borderColor: i === idx ? colors.primary : 'rgba(255,255,255,0.3)' }}>
              <ProtoImage seed={photo.seed} width={52} height={38} />
            </Pressable>
          ))}
        </View>
      </View>
  );
}

// ─── Contact Loading State ─────────────────────────────────────────────────────
function ContactLoadingView() {
  const [fav, setFav] = useState(false);
  const { isMobile, isDesktop } = useLayout();
  const horizontalPadding = isDesktop ? 32 : 16;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ backgroundColor: colors.background, borderBottomWidth: 1, borderBottomColor: '#E8E8E8', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12 }}>
        <Pressable style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Text style={{ fontSize: 20, color: colors.text }}>←</Text>
          <Text style={{ fontSize: 15, fontWeight: '500', color: colors.text }}>Назад</Text>
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: isMobile ? 80 : 32 }}>
        <View>
          <View style={{ padding: 10, paddingBottom: 0 }}>
            <PhotoGallery photos={FALLBACK_SEEDS.map(seed => ({ seed }))} onFavPress={() => setFav(!fav)} fav={fav} onPhotoPress={() => {}} />
          </View>
          <View style={{ backgroundColor: colors.background, padding: horizontalPadding, marginTop: 8 }}>
            <ListingInfo />
            <CTAButtons loading />
            <View style={{ marginTop: 12, padding: 14, backgroundColor: '#E8F9F2', borderRadius: 8, alignItems: 'center' }}>
              <Text style={{ fontSize: 13, color: colors.primary, fontWeight: '500' }}>Открываем чат с продавцом...</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {isMobile && <BottomNav />}
    </View>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════

export default function ListingDetail({ listing, isOwner }: { listing?: any; isOwner?: boolean }) {
  return <DefaultView listing={listing} isOwner={isOwner} />;
}
