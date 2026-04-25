import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, Pressable, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import BottomNav from '../BottomNav';
import { apiFetch } from '../../lib/api';

const C = {
  green: '#00AA6C',
  greenBg: '#E8F9F2',
  white: '#FFFFFF',
  text: '#1A1A1A',
  muted: '#9E9E9E',
  border: '#E8E8E8',
  page: '#F5F5F5',
  error: '#D32F2F',
};

interface PriceItem {
  key: string;    // maps to API field "type"
  label: string;
  price: number;  // maps to API field "amountGEL"
  currency: string;
  durationDays: number;  // maps to API field "days"
}

// Normalize API response fields to the PriceItem shape expected by this component
function normalizePriceItem(p: any): PriceItem {
  return {
    key: p.type ?? p.key,
    label: p.label,
    price: p.amountGEL ?? p.price ?? 0,
    currency: p.currency ?? 'GEL',
    durationDays: p.days ?? p.durationDays ?? 0,
  };
}

export interface PaymentProps {
  listingId?: string;
  promotionType?: string;
  onPay?: (type: string) => Promise<void>;
}

function FormFrame({ children }: { children: React.ReactNode }) {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 640;
  return (
    <View style={isDesktop
      ? { maxWidth: 480, alignSelf: 'center', width: '100%', backgroundColor: C.white, borderRadius: 12, borderWidth: 1, borderColor: C.border, overflow: 'hidden' }
      : { backgroundColor: C.white }
    }>
      {children}
    </View>
  );
}

function SectionHeader({ title }: { title: string }) {
  const router = useRouter();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: C.border, gap: 10 }}>
      <Pressable onPress={() => router.back()} style={{ width: 44, height: 44, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontSize: 20, color: C.muted }}>{'<'}</Text>
      </Pressable>
      <Text style={{ fontSize: 17, fontWeight: '700', color: C.text }}>{title}</Text>
    </View>
  );
}

function PaymentCheckout({ listingId, promotionType, onPay }: PaymentProps) {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 640;
  const [prices, setPrices] = useState<PriceItem[]>([]);
  const [selectedType, setSelectedType] = useState<string>(promotionType ?? 'top_7d');
  const [loadingPrices, setLoadingPrices] = useState(true);
  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState('');

  useEffect(() => {
    apiFetch('/promotions/prices')
      .then(r => {
        const normalized = (r.prices ?? []).map(normalizePriceItem);
        setPrices(normalized);
        // Default to first item if promotionType not in list
        if (normalized.length && !normalized.find((p: PriceItem) => p.key === selectedType)) {
          setSelectedType(normalized[0].key);
        }
      })
      .catch(console.error)
      .finally(() => setLoadingPrices(false));
  }, []);

  const selected = prices.find(p => p.key === selectedType);

  const handlePay = async () => {
    if (!onPay) return;
    setPaying(true);
    setPayError('');
    try {
      await onPay(selectedType);
    } catch (e: any) {
      setPayError(e.error || e.message || 'Ошибка оплаты');
      setPaying(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: C.white }}>
      <FormFrame>
        <SectionHeader title="Оплата" />

        {loadingPrices ? (
          <View style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: 60 }}>
            <ActivityIndicator size="large" color={C.green} />
          </View>
        ) : (
          <View style={{ padding: 16, gap: 16 }}>
            {/* Amount block */}
            <View style={{ backgroundColor: C.greenBg, borderRadius: 10, padding: 16, alignItems: 'center' }}>
              {selected ? (
                <>
                  <Text style={{ fontSize: 32, fontWeight: '800', color: C.text }}>
                    {selected.currency === 'GEL' ? '₾' : selected.currency}{selected.price.toFixed(2)}
                  </Text>
                  <Text style={{ fontSize: 14, color: C.muted, marginTop: 4 }}>{selected.label}</Text>
                  <Text style={{ fontSize: 13, color: C.muted, marginTop: 2 }}>
                    {selected.durationDays} {selected.durationDays === 1 ? 'день' : selected.durationDays < 5 ? 'дня' : 'дней'}
                  </Text>
                </>
              ) : (
                <Text style={{ fontSize: 14, color: C.muted }}>Нет доступных тарифов</Text>
              )}
            </View>

            {/* Promotion type selector */}
            {prices.length > 0 && (
              <View style={{ gap: 8 }}>
                <Text style={{ fontSize: 13, fontWeight: '600', color: C.text }}>Тариф</Text>
                <View style={{ borderWidth: 1, borderColor: C.border, borderRadius: 8, overflow: 'hidden' }}>
                  {prices.map((p, idx) => (
                    <Pressable
                      key={p.key}
                      onPress={() => setSelectedType(p.key)}
                      style={{
                        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
                        paddingHorizontal: 12, paddingVertical: 10,
                        borderBottomWidth: idx < prices.length - 1 ? 1 : 0,
                        borderBottomColor: C.border,
                        backgroundColor: selectedType === p.key ? C.greenBg : C.white,
                      }}
                    >
                      <Text style={{ fontSize: 15, color: C.text }}>{p.label}</Text>
                      <Text style={{ fontSize: 15, fontWeight: '600', color: selectedType === p.key ? C.green : C.text }}>
                        {p.currency === 'GEL' ? '₾' : p.currency}{p.price.toFixed(2)}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            )}

            {payError ? (
              <Text style={{ fontSize: 13, color: C.error, textAlign: 'center' }}>{payError}</Text>
            ) : null}

            <Pressable
              onPress={handlePay}
              disabled={paying || !selected || !onPay}
              style={{
                backgroundColor: C.green, borderRadius: 8, paddingVertical: 14,
                alignItems: 'center', opacity: (paying || !selected || !onPay) ? 0.7 : 1,
              }}
            >
              {paying ? (
                <ActivityIndicator color={C.white} size="small" />
              ) : (
                <Text style={{ color: C.white, fontWeight: '700', fontSize: 16 }}>
                  Оплатить {selected ? `${selected.currency === 'GEL' ? '₾' : selected.currency}${selected.price.toFixed(2)}` : ''}
                </Text>
              )}
            </Pressable>

            <Text style={{ fontSize: 13, color: C.muted, textAlign: 'center' }}>
              Вы будете перенаправлены на страницу оплаты Stripe.
            </Text>
          </View>
        )}

        {!isDesktop && <BottomNav />}
      </FormFrame>
    </View>
  );
}

export { PaymentCheckout };
export default PaymentCheckout;
