import React from 'react';
import { View, Text, ScrollView, useWindowDimensions } from 'react-native';
import BottomNav from '../../BottomNav';

const C = { green:'#00AA6C', greenBg:'#E8F9F2', white:'#FFFFFF', text:'#1A1A1A', muted:'#737373', border:'#E0E0E0', error:'#D32F2F' };

interface Payment {
  date: string;
  type: string;
  listing: string;
  amount: string;
  status: 'paid';
}

const PAYMENTS: Payment[] = [
  { date: '10.04.2026', type: 'Публикация', listing: 'Toyota Camry 2019', amount: '₾5.00', status: 'paid' },
  { date: '01.04.2026', type: 'Продление', listing: 'Квартира Батуми', amount: '₾3.00', status: 'paid' },
  { date: '15.03.2026', type: 'Публикация', listing: 'iPhone 14', amount: '₾5.00', status: 'paid' },
];

function StatusBadge() {
  return (
    <View style={{ backgroundColor: C.greenBg, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 2 }}>
      <Text style={{ fontSize: 11, fontWeight: '700', color: C.green }}>Оплачено</Text>
    </View>
  );
}

function PageContent({ payments }: { payments: Payment[] }) {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 640;
  const maxW = isDesktop ? 600 : undefined;

  return (
    <View style={{ backgroundColor: C.white, padding: 16, gap: 16, maxWidth: maxW, width: '100%', alignSelf: isDesktop ? 'center' : undefined }}>
      <Text style={{ fontSize: 20, fontWeight: '700', color: C.text }}>История платежей</Text>

      <View style={{ backgroundColor: C.white, borderRadius: 10, borderWidth: 1, borderColor: C.border, overflow: 'hidden' }}>
        {payments.length === 0 ? (
          <View style={{ alignItems: 'center', paddingVertical: 40, paddingHorizontal: 24, gap: 8 }}>
            <Text style={{ fontSize: 16, fontWeight: '700', color: C.text }}>Нет платежей</Text>
            <Text style={{ fontSize: 14, color: C.muted, textAlign: 'center' }}>Платежи появятся после публикации объявлений</Text>
          </View>
        ) : payments.map((p, idx) => (
          <View key={idx}>
            <View style={{ paddingHorizontal: 16, paddingVertical: 14, gap: 4 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <Text style={{ fontSize: 13, color: C.muted }}>{p.date} · {p.type}</Text>
                <StatusBadge />
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: C.text, flex: 1 }} numberOfLines={1}>{p.listing}</Text>
                <Text style={{ fontSize: 14, fontWeight: '700', color: C.text, marginLeft: 8 }}>{p.amount}</Text>
              </View>
            </View>
            {idx < payments.length - 1 && <View style={{ height: 1, backgroundColor: C.border, marginLeft: 16 }} />}
          </View>
        ))}
      </View>
    </View>
  );
}

function PaymentHistory() {
  const { width } = useWindowDimensions();
  return (
      <View style={{ backgroundColor: C.white }}>
        <PageContent payments={PAYMENTS} />
        {width < 640 && <BottomNav active="profile" />}
      </View>
  );
}

function EmptyState() {
  const { width } = useWindowDimensions();
  return (
      <View style={{ backgroundColor: C.white }}>
        <PageContent payments={[]} />
        {width < 640 && <BottomNav active="profile" />}
      </View>
  );
}

export default PaymentHistory;
