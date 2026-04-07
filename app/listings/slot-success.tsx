import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useEffect, useRef, useState } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Button } from '../../components/ui/Button';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../lib/colors';
import { api, apiUpload } from '../../lib/api';

// Slot success screen — user lands here after paying for a listing slot via Stripe Checkout.
// Reads pending form data from sessionStorage, then re-submits listing creation with paymentId.
export default function ListingSlotSuccessScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { paymentId } = useLocalSearchParams<{ paymentId?: string }>();

  const [status, setStatus] = useState<'restoring' | 'submitting' | 'done' | 'error'>('restoring');
  const [errorMsg, setErrorMsg] = useState('');
  const didRun = useRef(false);

  useEffect(() => {
    if (!paymentId || didRun.current) return;
    didRun.current = true;
    restoreAndSubmit(paymentId);
  }, [paymentId]);

  const restoreAndSubmit = async (pid: string) => {
    // Restore pending form data from sessionStorage (web) saved before Stripe redirect
    let pending: Record<string, any> | null = null;
    try {
      const raw = typeof window !== 'undefined'
        ? window.sessionStorage.getItem('pending_listing_slot')
        : null;
      if (raw) pending = JSON.parse(raw);
    } catch (_) {
      // sessionStorage not available (native) — cannot auto-submit
    }

    if (!pending) {
      // No saved data — just show success and let user navigate manually
      setStatus('done');
      return;
    }

    setStatus('submitting');

    try {
      const createRes = await api.post<{ id: string }>('/listings', {
        ...pending.fields,
        paymentId: pid,
      });

      if (!createRes.ok || !createRes.data) {
        setErrorMsg(createRes.error || t('error'));
        setStatus('error');
        return;
      }

      const listingId = createRes.data.id;

      // Upload photos if any were stored as data URIs
      if (pending.photos && pending.photos.length > 0) {
        const formData = new FormData();
        for (const photo of pending.photos as Array<{ uri: string; mimeType?: string; fileName?: string }>) {
          const blob: any = {
            uri: photo.uri,
            type: photo.mimeType || 'image/jpeg',
            name: photo.fileName || 'photo.jpg',
          };
          formData.append('photos', blob);
        }
        await apiUpload(`/listings/${listingId}/photos`, formData);
      }

      // Clear pending data
      try {
        if (typeof window !== 'undefined') {
          window.sessionStorage.removeItem('pending_listing_slot');
        }
      } catch (_) {}

      setStatus('done');
    } catch (_) {
      setErrorMsg(t('error'));
      setStatus('error');
    }
  };

  if (status === 'restoring' || status === 'submitting') {
    return (
      <View className="flex-1 bg-dark items-center justify-center px-6">
        <ActivityIndicator size="large" color={colors.brandPrimary} />
        <Text className="text-text-secondary text-sm mt-4 text-center">
          {status === 'restoring' ? t('restoringListing') : t('publishingListing')}
        </Text>
      </View>
    );
  }

  if (status === 'error') {
    return (
      <View className="flex-1 bg-dark">
        <ScrollView
          className="flex-1"
          contentContainerClassName="flex-1 items-center justify-center px-6 py-12"
        >
          <View className="items-center mb-8">
            <Ionicons name="warning-outline" size={72} color={colors.statusError} style={{ marginBottom: 16 }} />
            <Text className="text-text-primary text-xl font-bold text-center mb-3">
              {t('slotPaymentOkButListingFailed')}
            </Text>
            <Text className="text-text-secondary text-sm text-center leading-5">
              {errorMsg}
            </Text>
            <Text className="text-text-muted text-xs text-center mt-3">
              {t('slotPaymentIdHint')}: {paymentId}
            </Text>
          </View>
          <View className="w-full gap-3">
            <Button
              title={t('backToDashboard')}
              onPress={() => router.replace('/my/listings')}
              size="lg"
            />
          </View>
        </ScrollView>
      </View>
    );
  }

  // status === 'done'
  return (
    <View className="flex-1 bg-dark">
      <ScrollView
        className="flex-1"
        contentContainerClassName="flex-1 items-center justify-center px-6 py-12"
      >
        <View className="items-center mb-8">
          <Ionicons name="checkmark-circle" size={72} color={colors.statusSuccessAlt} style={{ marginBottom: 16 }} />
          <Text className="text-text-primary text-2xl font-bold text-center mb-3">
            {t('listingPublished')}
          </Text>
          <Text className="text-text-secondary text-sm text-center leading-5">
            {t('listingPublishedSlotDesc')}
          </Text>
        </View>
        <View className="w-full gap-3">
          <Button
            title={t('myListings')}
            onPress={() => router.replace('/my/listings')}
            size="lg"
          />
          <Button
            title={t('backToListings')}
            onPress={() => router.replace('/')}
            variant="ghost"
            size="lg"
          />
        </View>
      </ScrollView>
    </View>
  );
}
