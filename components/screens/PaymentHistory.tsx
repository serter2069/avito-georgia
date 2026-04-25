import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, useWindowDimensions } from 'react-native';
import BottomNav from '../BottomNav';
import { apiFetch } from '../../lib/api';
import { colors } from '../../lib/theme';

const C = { green: colors.primary, greenBg: '#E8F9F2', white: colors.background, text: colors.text, muted: colors.textSecondary, border: colors.border, error: colors.error };

interface ApiPayment {
  id: string;
  amount: number;
  currency: string;
  status: string;
  promotionType: string | null;
  listingId: string | null;
  createdAt: string;
}

const PROMOTION_LABELS: Record<string, string> = {
  top_7d: 'ТОП 7 дней',
  top_30d: 'ТОП 30 дней',
  highlight_7d: 'Выделение 7 дней',
  highlight_30d: 'Выделение 30 дней',
  listing_slot: 'Публикация',
};

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function StatusBadge({ status }: { status: string }) {
  const isPaid = status === 'succeeded' || status === 'paid';
  return (
    <View style={{ backgroundColor: isPaid ? C.greenBg : '#FFF3E0', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 2 }}>
      <Text style={{ fontSize: 12, fontWeight: '700', color: isPaid ? C.green : '#E65100' }}>
        {isPaid ? 'Оплачено' : status}
      </Text>
    </View>
  );
}

function PageContent({ payments, loading }: { payments: ApiPayment[]; loading: boolean }) {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 640;
  const maxW = isDesktop ? 600 : undefined;

  return (
    <View style={{ backgroundColor: C.white, padding: 16, gap: 16, maxWidth: maxW, width: '100%', alignSelf: isDesktop ? 'center' : undefined }}>
      <Text style={{ fontSize: 20, fontWeight: '700', color: C.text }}>История платежей</Text>

      {loading ? (
        <View style={{ alignItems: 'center', paddingVertical: 40 }}>
          <ActivityIndicator size="large" color={C.green} />
        </View>
      ) : (
        <View style={{ backgroundColor: C.white, borderRadius: 10, borderWidth: 1, borderColor: C.border, overflow: 'hidden' }}>
          {payments.length === 0 ? (
            <View style={{ alignItems: 'center', paddingVertical: 40, paddingHorizontal: 24, gap: 8 }}>
              <Text style={{ fontSize: 16, fontWeight: '700', color: C.text }}>Нет платежей</Text>
              <Text style={{ fontSize: 14, color: C.muted, textAlign: 'center' }}>Платежи появятся после публикации объявлений</Text>
            </View>
          ) : payments.map((p, idx) => {
            const label = p.promotionType ? (PROMOTION_LABELS[p.promotionType] ?? p.promotionType) : 'Платёж';
            const amount = `${p.currency === 'GEL' ? '₾' : p.currency}${Number(p.amount).toFixed(2)}`;
            return (
              <View key={p.id}>
                <View style={{ paddingHorizontal: 16, paddingVertical: 14, gap: 4 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Text style={{ fontSize: 13, color: C.muted }}>{formatDate(p.createdAt)} · {label}</Text>
                    <StatusBadge status={p.status} />
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Text style={{ fontSize: 14, color: C.muted, flex: 1 }}>
                      {p.listingId ? `Объявление #${p.listingId.slice(-6)}` : label}
                    </Text>
                    <Text style={{ fontSize: 14, fontWeight: '700', color: C.text, marginLeft: 8 }}>{amount}</Text>
                  </View>
                </View>
                {idx < payments.length - 1 && <View style={{ height: 1, backgroundColor: C.border, marginLeft: 16 }} />}
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
}

function PaymentHistory() {
  const { width } = useWindowDimensions();
  const [payments, setPayments] = useState<ApiPayment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch('/payments/my')
      .then(r => setPayments(r.payments ?? []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <View style={{ backgroundColor: C.white }}>
      <PageContent payments={payments} loading={loading} />
      {width < 640 && <BottomNav active="profile" />}
    </View>
  );
}

export default PaymentHistory;
