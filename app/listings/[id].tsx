import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Share, Platform, Linking, Modal, Pressable, TextInput, Animated, Dimensions, KeyboardAvoidingView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useState, useEffect, useCallback, useRef } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Head from 'expo-router/head';
import { Header } from '../../components/layout/Header';
import { PhotoGallery } from '../../components/listing/PhotoGallery';
import { PriceTag } from '../../components/ui/PriceTag';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { api } from '../../lib/api';
import { useAuthStore } from '../../stores/authStore';
import { colors } from '../../lib/colors';
import { Ionicons } from '@expo/vector-icons';

interface ListingPhoto {
  id: string;
  url: string;
  order: number;
}

interface ListingDetail {
  id: string;
  title: string;
  description: string | null;
  price: number | null;
  currency: string;
  status: string;
  views: number;
  createdAt: string;
  city?: { id: string; nameRu: string; nameEn: string; nameKa: string };
  district?: { id: string; nameRu: string; nameEn: string; nameKa: string } | null;
  category?: { id: string; name: string; slug: string };
  photos: ListingPhoto[];
  user: { id: string; name: string | null; phone: string | null; createdAt: string };
  isPromoted?: boolean;
}

const STATUS_VARIANTS: Record<string, 'success' | 'warning' | 'error'> = {
  active: 'success',
  sold: 'warning',
  removed: 'error',
};

const STATUS_LABELS: Record<string, string> = {
  active: 'statusActive',
  sold: 'statusSold',
  removed: 'statusRemoved',
};

// Map DB category slug to i18n translation key
const SLUG_TO_I18N_KEY: Record<string, string> = {
  transport: 'transport',
  'real-estate': 'realEstate',
  electronics: 'electronics',
  fashion: 'clothing',
  'home-garden': 'furniture',
  services: 'services',
  jobs: 'jobs',
  kids: 'kids',
  pets: 'pets',
  hobbies: 'hobbies',
};

export default function ListingDetailScreen() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const user = useAuthStore((s) => s.user);

  const [listing, setListing] = useState<ListingDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [contactLoading, setContactLoading] = useState(false);
  const [phone, setPhone] = useState<string | null>(null);
  const [phoneLoading, setPhoneLoading] = useState(false);
  const [phoneRevealed, setPhoneRevealed] = useState(false);

  // Report state
  const [reportModalVisible, setReportModalVisible] = useState(false);
  const [reportLoading, setReportLoading] = useState(false);
  const [reportDone, setReportDone] = useState(false);

  // Contact sheet state
  const [contactSheetVisible, setContactSheetVisible] = useState(false);
  const [contactMessage, setContactMessage] = useState('');
  const contactSheetAnim = useRef(new Animated.Value(0)).current;

  // Fetch listing once on mount
  useEffect(() => {
    if (!id) return;
    let cancelled = false;

    (async () => {
      setLoading(true);
      setError(null);
      const res = await api.get<ListingDetail>(`/listings/${id}`);
      if (cancelled) return;
      if (res.ok && res.data) {
        setListing(res.data);
      } else {
        setError(res.error || 'Not found');
      }
      setLoading(false);
    })();

    return () => { cancelled = true; };
  }, [id]);

  // Check if favorited (only for logged-in users)
  useEffect(() => {
    if (!user || !id) return;
    let cancelled = false;

    (async () => {
      const res = await api.get<{ isFavorited: boolean }>(`/favorites/${id}/check`);
      if (cancelled) return;
      if (res.ok && res.data) {
        setIsFavorited(res.data.isFavorited);
      }
    })();

    return () => { cancelled = true; };
  }, [user, id]);

  const handleFavorite = useCallback(async () => {
    if (!user) {
      router.push('/(auth)');
      return;
    }
    if (!id || favoriteLoading) return;

    setFavoriteLoading(true);
    if (isFavorited) {
      const res = await api.delete(`/favorites/${id}`);
      if (res.ok) setIsFavorited(false);
    } else {
      const res = await api.post(`/favorites/${id}`);
      if (res.ok) setIsFavorited(true);
    }
    setFavoriteLoading(false);
  }, [user, id, isFavorited, favoriteLoading, router]);

  const openContactSheet = useCallback(async () => {
    if (!user) {
      router.push('/(auth)');
      return;
    }
    if (!id || !listing?.user?.id || contactLoading) return;

    const listingId = Array.isArray(id) ? id[0] : id;

    // Check for an existing thread — navigate directly if one exists
    setContactLoading(true);
    try {
      const threadsRes = await api.get<Array<{ id: string; listing: { id: string } | null }>>('/threads');
      if (threadsRes.ok && threadsRes.data) {
        const existing = threadsRes.data.find((t) => t.listing?.id === listingId);
        if (existing) {
          router.push(`/dashboard/messages/${existing.id}`);
          return;
        }
      }
    } finally {
      setContactLoading(false);
    }

    // No existing thread — show the contact sheet
    setContactMessage(t('defaultContactMessage'));
    setContactSheetVisible(true);
    Animated.timing(contactSheetAnim, {
      toValue: 1,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [user, id, listing, contactLoading, router, t, contactSheetAnim]);

  const closeContactSheet = useCallback(() => {
    Animated.timing(contactSheetAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => setContactSheetVisible(false));
  }, [contactSheetAnim]);

  const handleSendContactMessage = useCallback(async () => {
    if (!id || !listing?.user?.id || contactLoading) return;
    const text = contactMessage.trim();
    if (!text) return;

    const listingId = Array.isArray(id) ? id[0] : id;

    setContactLoading(true);
    try {
      const createRes = await api.post<{ threadId: string }>(`/threads/${listingId}/message`, { text });
      if (createRes.ok && createRes.data?.threadId) {
        closeContactSheet();
        router.push(`/dashboard/messages/${createRes.data.threadId}`);
      }
    } finally {
      setContactLoading(false);
    }
  }, [id, listing, contactLoading, contactMessage, router, closeContactSheet]);

  const handleRevealPhone = useCallback(async () => {
    if (!user) {
      router.push('/(auth)');
      return;
    }
    if (phoneRevealed && phone) {
      Linking.openURL(`tel:${phone}`);
      return;
    }
    if (!id || phoneLoading) return;
    setPhoneLoading(true);
    const res = await api.get<{ phone: string | null }>(`/listings/${id}/phone`);
    setPhoneLoading(false);
    if (res.ok && res.data) {
      setPhone(res.data.phone);
      setPhoneRevealed(true);
    }
  }, [user, id, phone, phoneRevealed, phoneLoading, router]);

  const handleShare = useCallback(async () => {
    if (!listing) return;
    const url = `https://avito-georgia.smartlaunchhub.com/listings/${listing.id}`;
    if (Platform.OS === 'web') {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(url);
      }
    } else {
      await Share.share({ message: `${listing.title} - ${url}`, url });
    }
  }, [listing]);

  const handleSellerPress = useCallback(() => {
    if (listing?.user?.id) {
      router.push(`/users/${listing.user.id}`);
    }
  }, [listing, router]);

  const handleReport = useCallback(async (reason: string) => {
    if (!user || !id || reportLoading) return;
    setReportLoading(true);
    const listingId = Array.isArray(id) ? id[0] : id;
    const res = await api.post('/reports', { listingId, reason });
    setReportLoading(false);
    if (res.ok) {
      setReportDone(true);
      setTimeout(() => {
        setReportModalVisible(false);
        setReportDone(false);
      }, 1500);
    } else {
      setReportModalVisible(false);
    }
  }, [user, id, reportLoading]);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  if (loading) {
    return (
      <View className="flex-1 bg-dark">
        <Header title={t('loading')} />
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={colors.brandPrimary} />
        </View>
      </View>
    );
  }

  if (error || !listing) {
    return (
      <View className="flex-1 bg-dark">
        <Header title={t('error')} />
        <View className="flex-1 items-center justify-center px-4">
          <Text className="text-text-muted text-base mb-4">{error || 'Not found'}</Text>
          <Button title={t('back')} onPress={() => router.back()} variant="ghost" />
        </View>
      </View>
    );
  }

  const photoUrls = listing.photos.map(p => p.url);

  const seoTitle = listing.city
    ? `${listing.title} — ${i18n.language === 'en' ? (listing.city.nameEn || listing.city.nameRu) : i18n.language === 'ka' ? (listing.city.nameKa || listing.city.nameRu) : listing.city.nameRu} | Авито Грузия`
    : `${listing.title} | Авито Грузия`;
  const seoDescription = listing.description
    ? listing.description.slice(0, 160)
    : `${listing.title} — объявление на Авито Грузия`;
  const seoImage = listing.photos[0]?.url;

  return (
    <View className="flex-1 bg-dark">
      {Platform.OS === 'web' && (
        <Head>
          <title>{seoTitle}</title>
          <meta name="description" content={seoDescription} />
          <meta property="og:title" content={seoTitle} />
          <meta property="og:description" content={seoDescription} />
          <meta property="og:type" content="article" />
          <meta property="og:url" content={`https://avito-georgia.smartlaunchhub.com/listings/${listing.id}`} />
          {seoImage ? <meta property="og:image" content={seoImage} /> : null}
        </Head>
      )}
      <Header showBack title={listing.title} />

      <ScrollView className="flex-1" contentContainerClassName="pb-24">
        {/* Photo gallery */}
        <PhotoGallery photos={photoUrls} height={300} />

        {/* Share + Report buttons */}
        <View className="px-4 pt-3 flex-row justify-end items-center gap-4">
          {user && listing.user.id !== user.id && !reportDone && (
            <TouchableOpacity onPress={() => setReportModalVisible(true)} className="flex-row items-center gap-1">
              <Ionicons name="flag-outline" size={18} color="#64748B" />
              <Text className="text-text-secondary text-sm">{t('reportListing')}</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={handleShare} className="flex-row items-center gap-1">
            <Ionicons name="share-outline" size={18} color="#64748B" />
            <Text className="text-text-secondary text-sm">{t('share')}</Text>
          </TouchableOpacity>
        </View>

        {/* Status badge */}
        {listing.status !== 'active' && (
          <View className="px-4 pt-3">
            <Badge
              label={t(STATUS_LABELS[listing.status] || 'statusActive')}
              variant={STATUS_VARIANTS[listing.status] || 'success'}
            />
          </View>
        )}

        {/* Price section */}
        <View className="px-4 pt-4 pb-2">
          <PriceTag price={listing.price} currency={listing.currency} size="lg" />
        </View>

        {/* Title */}
        <View className="px-4 pb-2">
          <Text className="text-text-primary text-xl font-bold">{listing.title}</Text>
        </View>

        {/* Location + date + views */}
        <View className="px-4 pb-3 flex-row flex-wrap items-center gap-2">
          {listing.city && (
            <Text className="text-text-secondary text-sm">
              {i18n.language === 'en' ? (listing.city.nameEn || listing.city.nameRu) : i18n.language === 'ka' ? (listing.city.nameKa || listing.city.nameRu) : listing.city.nameRu}
              {listing.district ? `, ${i18n.language === 'en' ? (listing.district.nameEn || listing.district.nameRu) : i18n.language === 'ka' ? (listing.district.nameKa || listing.district.nameRu) : listing.district.nameRu}` : ''}
            </Text>
          )}
          <Text className="text-text-muted text-xs">
            {formatDate(listing.createdAt)}
          </Text>
          <Text className="text-text-muted text-xs">
            {listing.views} {t('views')}
          </Text>
        </View>

        {/* Category */}
        {listing.category && (
          <View className="px-4 pb-3">
            <Badge label={listing.category.slug && SLUG_TO_I18N_KEY[listing.category.slug] ? t(SLUG_TO_I18N_KEY[listing.category.slug]) : listing.category.name} />
          </View>
        )}

        {/* Description */}
        {listing.description && (
          <View className="px-4 pb-4">
            <Text className="text-text-secondary text-sm font-semibold mb-2">{t('description')}</Text>
            <Text className="text-text-primary text-base leading-6">{listing.description}</Text>
          </View>
        )}

        {/* Seller card */}
        <TouchableOpacity
          className="mx-4 mb-4 p-4 bg-surface-card rounded-lg border border-border"
          onPress={handleSellerPress}
          activeOpacity={0.7}
        >
          <Text className="text-text-muted text-xs mb-2">{t('seller')}</Text>
          <View className="flex-row items-center gap-3">
            {/* Avatar placeholder */}
            <View className="w-12 h-12 rounded-full bg-primary/30 items-center justify-center">
              <Text className="text-primary text-lg font-bold">
                {(listing.user.name || 'U').charAt(0).toUpperCase()}
              </Text>
            </View>
            <View className="flex-1">
              <Text className="text-text-primary text-base font-semibold">
                {listing.user.name || 'User'}
              </Text>
              <Text className="text-text-muted text-xs">
                {t('memberSince')} {formatDate(listing.user.createdAt)}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
          </View>
        </TouchableOpacity>
      </ScrollView>

      {/* Bottom action bar */}
      <View className="absolute bottom-0 left-0 right-0 bg-dark-secondary border-t border-border px-4 py-3 gap-2">
        {user && listing.user.id === user.id ? (
          // Owner view: promote button
          <View>
            <Button
              title={t('promote')}
              onPress={() => router.push(`/dashboard/listings/${listing.id}/promote`)}
              variant="secondary"
              size="md"
            />
          </View>
        ) : (
          // Non-owner view: favorite + contact + phone reveal
          <>
            <View className="flex-row gap-3">
              <TouchableOpacity
                className={`px-4 py-3 rounded-lg border items-center justify-center ${
                  isFavorited ? 'bg-secondary/20 border-secondary' : 'border-border'
                }`}
                onPress={handleFavorite}
                disabled={favoriteLoading}
              >
                {favoriteLoading ? (
                  <ActivityIndicator size="small" color={colors.statusWarning} />
                ) : (
                  <Text className={`text-sm font-semibold ${isFavorited ? 'text-secondary' : 'text-text-secondary'}`}>
                    {isFavorited ? t('removeFromFavorites') : t('addToFavorites')}
                  </Text>
                )}
              </TouchableOpacity>

              <View className="flex-1">
                <Button
                  title={contactLoading ? t('loading') : t('contactSeller')}
                  onPress={openContactSheet}
                  size="md"
                  disabled={contactLoading}
                />
              </View>
            </View>

            <TouchableOpacity
              className="py-3 rounded-lg border border-primary items-center justify-center"
              onPress={handleRevealPhone}
              disabled={phoneLoading}
            >
              {phoneLoading ? (
                <ActivityIndicator size="small" color={colors.brandPrimary} />
              ) : phoneRevealed && phone ? (
                <Text className="text-primary text-sm font-semibold">{phone}</Text>
              ) : phoneRevealed && !phone ? (
                <Text className="text-text-muted text-sm">{t('phoneNotSpecified')}</Text>
              ) : (
                <Text className="text-primary text-sm font-semibold">{t('showPhone')}</Text>
              )}
            </TouchableOpacity>
          </>
        )}
      </View>

      {/* Report listing modal */}
      <Modal
        visible={reportModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setReportModalVisible(false)}
      >
        <Pressable
          style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 24 }}
          onPress={() => setReportModalVisible(false)}
        >
          <Pressable
            style={{ backgroundColor: '#FFFFFF', borderRadius: 16, width: '100%', maxWidth: 380, paddingVertical: 24, paddingHorizontal: 20 }}
            onPress={() => {}}
          >
            {reportDone ? (
              <View style={{ alignItems: 'center', paddingVertical: 12 }}>
                <Ionicons name="checkmark-circle" size={48} color="#0A7B8A" />
                <Text style={{ fontSize: 16, fontWeight: '600', color: '#0A2840', marginTop: 12, textAlign: 'center' }}>
                  {t('reportSuccess')}
                </Text>
              </View>
            ) : (
              <>
                <Text style={{ fontSize: 17, fontWeight: '700', color: '#0A2840', marginBottom: 16, textAlign: 'center' }}>
                  {t('reportTitle')}
                </Text>
                {reportLoading ? (
                  <View style={{ alignItems: 'center', paddingVertical: 16 }}>
                    <ActivityIndicator size="large" color="#0A7B8A" />
                  </View>
                ) : (
                  [
                    { key: 'fraud', label: t('reportReasonFraud') },
                    { key: 'spam', label: t('reportReasonSpam') },
                    { key: 'wrong_category', label: t('reportReasonWrongCategory') },
                    { key: 'prohibited', label: t('reportReasonProhibited') },
                    { key: 'other', label: t('reportReasonOther') },
                  ].map((item, idx, arr) => (
                    <TouchableOpacity
                      key={item.key}
                      onPress={() => handleReport(item.key)}
                      activeOpacity={0.7}
                      style={{
                        paddingVertical: 14,
                        borderBottomWidth: idx < arr.length - 1 ? 1 : 0,
                        borderBottomColor: '#F1F5F9',
                      }}
                    >
                      <Text style={{ fontSize: 15, color: '#0A2840' }}>{item.label}</Text>
                    </TouchableOpacity>
                  ))
                )}
                <TouchableOpacity
                  onPress={() => setReportModalVisible(false)}
                  style={{ marginTop: 8, paddingVertical: 12, alignItems: 'center', borderTopWidth: 1, borderTopColor: '#F1F5F9' }}
                  activeOpacity={0.7}
                >
                  <Text style={{ fontSize: 15, color: '#94A3B8' }}>{t('cancel')}</Text>
                </TouchableOpacity>
              </>
            )}
          </Pressable>
        </Pressable>
      </Modal>

      {/* Contact seller bottom sheet */}
      {contactSheetVisible && (() => {
        const screenHeight = Dimensions.get('window').height;
        const sheetTranslateY = contactSheetAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [screenHeight * 0.5, 0],
        });
        const backdropOpacity = contactSheetAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 1],
        });
        return (
          <Modal
            visible={contactSheetVisible}
            transparent
            animationType="none"
            onRequestClose={closeContactSheet}
          >
            <KeyboardAvoidingView
              style={{ flex: 1 }}
              behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
              <Animated.View
                style={{
                  flex: 1,
                  backgroundColor: 'rgba(0,0,0,0.4)',
                  opacity: backdropOpacity,
                  justifyContent: 'flex-end',
                }}
              >
                <Pressable style={{ flex: 1 }} onPress={closeContactSheet} />

                <Animated.View
                  style={{
                    transform: [{ translateY: sheetTranslateY }],
                    backgroundColor: '#FFFFFF',
                    borderTopLeftRadius: 16,
                    borderTopRightRadius: 16,
                    paddingBottom: 32,
                  }}
                >
                  {/* Handle bar */}
                  <View style={{ alignItems: 'center', paddingTop: 10, paddingBottom: 12 }}>
                    <View
                      style={{
                        width: 36,
                        height: 4,
                        borderRadius: 2,
                        backgroundColor: '#D1D5DB',
                      }}
                    />
                  </View>

                  {/* Title */}
                  <Text
                    style={{
                      fontSize: 17,
                      fontWeight: '600',
                      color: '#0A2840',
                      textAlign: 'center',
                      marginBottom: 20,
                      paddingHorizontal: 24,
                    }}
                  >
                    {t('contactSeller')}
                  </Text>

                  {/* Message input */}
                  <View style={{ paddingHorizontal: 20, marginBottom: 16 }}>
                    <TextInput
                      style={{
                        borderWidth: 1,
                        borderColor: '#CBD5E1',
                        borderRadius: 10,
                        paddingHorizontal: 14,
                        paddingVertical: 12,
                        fontSize: 15,
                        color: '#0A2840',
                        backgroundColor: '#F8FAFC',
                        minHeight: 100,
                        textAlignVertical: 'top',
                      }}
                      value={contactMessage}
                      onChangeText={setContactMessage}
                      placeholder={t('typeMessage')}
                      placeholderTextColor="#94A3B8"
                      multiline
                      autoFocus
                    />
                  </View>

                  {/* Buttons */}
                  <View
                    style={{
                      flexDirection: 'row',
                      paddingHorizontal: 20,
                      gap: 12,
                    }}
                  >
                    <TouchableOpacity
                      style={{
                        flex: 1,
                        paddingVertical: 14,
                        borderRadius: 10,
                        borderWidth: 1,
                        borderColor: '#CBD5E1',
                        alignItems: 'center',
                      }}
                      onPress={closeContactSheet}
                      activeOpacity={0.7}
                    >
                      <Text style={{ fontSize: 15, fontWeight: '600', color: '#64748B' }}>
                        {t('cancel')}
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={{
                        flex: 1,
                        paddingVertical: 14,
                        borderRadius: 10,
                        backgroundColor: contactLoading || !contactMessage.trim() ? '#94A3B8' : '#0A7B8A',
                        alignItems: 'center',
                      }}
                      onPress={handleSendContactMessage}
                      disabled={contactLoading || !contactMessage.trim()}
                      activeOpacity={0.7}
                    >
                      {contactLoading ? (
                        <ActivityIndicator color="#FFFFFF" />
                      ) : (
                        <Text style={{ fontSize: 15, fontWeight: '600', color: '#FFFFFF' }}>
                          {t('send')}
                        </Text>
                      )}
                    </TouchableOpacity>
                  </View>
                </Animated.View>
              </Animated.View>
            </KeyboardAvoidingView>
          </Modal>
        );
      })()}
    </View>
  );
}
