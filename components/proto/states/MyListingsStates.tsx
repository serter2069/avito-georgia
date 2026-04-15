import React, { useState } from 'react';
import { View, Text, Pressable, useWindowDimensions } from 'react-native';
import { StateSection } from '../StateSection';
import BottomNav from '../BottomNav';
import ProtoImage from '../ProtoPlaceholderImage';

const C = {
  green: '#00AA6C',
  greenBg: '#E8F9F2',
  white: '#FFFFFF',
  text: '#1A1A1A',
  muted: '#9E9E9E',
  border: '#E8E8E8',
  error: '#D32F2F',
  warn: '#F59E0B',
  page: '#F5F5F5',
};
const IMG_COLORS = ['#C8E6C9', '#B2DFDB', '#BBDEFB', '#D7CCC8', '#F8BBD0', '#E1BEE7', '#FFF9C4', '#FFCCBC'];

type Tab = 'active' | 'inactive' | 'draft';

interface Listing {
  id: number;
  title: string;
  price: string;
  views: string;
  photos: number;
  colorIdx: number;
  expiresDate?: string;   // 'DD.MM.YYYY' — only for active
  daysLeft?: number;      // computed for display
}

const LISTINGS: Record<Tab, Listing[]> = {
  active: [
    { id: 1, title: 'Toyota Camry 2019, 45 000 км',   price: '12 500 ₾', views: '24 просмотра',  photos: 8,  colorIdx: 0, expiresDate: '22.04.2026', daysLeft: 7  },
    { id: 2, title: 'Квартира 3-комн., Батуми центр', price: '85 000 ₾', views: '12 просмотров', photos: 12, colorIdx: 1, expiresDate: '03.05.2026', daysLeft: 18 },
    { id: 3, title: 'iPhone 14 Pro Max 256GB',         price: '2 400 ₾',  views: '8 просмотров',  photos: 5,  colorIdx: 2, expiresDate: '16.04.2026', daysLeft: 1  },
  ],
  inactive: [
    { id: 4, title: 'Велосипед горный, алюминий', price: '450 ₾', views: '3 просмотра', photos: 3, colorIdx: 3 },
    { id: 5, title: 'Диван угловой, бежевый',     price: '350 ₾', views: '1 просмотр',  photos: 4, colorIdx: 4 },
  ],
  draft: [
    { id: 6, title: 'Ноутбук Dell Inspiron 15',    price: '1 800 ₾', views: '', photos: 2, colorIdx: 5 },
    { id: 7, title: 'Холодильник Samsung NoFrost',  price: '900 ₾',   views: '', photos: 1, colorIdx: 6 },
  ],
};

const TAB_DEFS: { key: Tab; label: string; count: number }[] = [
  { key: 'active', label: 'Активные', count: 3 },
  { key: 'inactive', label: 'Неактивные', count: 2 },
  { key: 'draft', label: 'Черновики', count: 2 },
];

function ListingCard({
  listing,
  tab,
  onDelete,
}: {
  listing: Listing;
  tab: Tab;
  onDelete: (id: number) => void;
}) {
  const [liked, setLiked] = useState(false);

  return (
    <View
      style={{
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: C.border,
        paddingHorizontal: 16,
        paddingVertical: 12,
        gap: 12,
        backgroundColor: C.white,
      }}
    >
      {/* Image */}
      <View style={{ position: 'relative', width: 88, height: 88, borderRadius: 8, overflow: 'hidden' }}>
        <ProtoImage seed={listing.colorIdx + 50} width={88} height={88} style={{ borderRadius: 6 }} />
        {/* Heart */}
        <Pressable
          onPress={() => setLiked(!liked)}
          style={{
            position: 'absolute',
            top: 4,
            right: 4,
            width: 26,
            height: 26,
            borderRadius: 13,
            backgroundColor: 'rgba(255,255,255,0.85)',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text style={{ fontSize: 14, color: liked ? '#E53935' : C.muted }}>{liked ? '\u2665' : '\u2661'}</Text>
        </Pressable>
        {/* Photo count */}
        <View
          style={{
            position: 'absolute',
            bottom: 4,
            right: 4,
            backgroundColor: 'rgba(0,0,0,0.55)',
            borderRadius: 4,
            paddingHorizontal: 5,
            paddingVertical: 2,
          }}
        >
          <Text style={{ color: C.white, fontSize: 10, fontWeight: '600' }}>{listing.photos} фото</Text>
        </View>
      </View>

      {/* Info */}
      <View style={{ flex: 1, gap: 4 }}>
        <Text style={{ fontSize: 15, fontWeight: '600', color: C.text }} numberOfLines={2}>
          {listing.title}
        </Text>
        <Text style={{ fontSize: 15, fontWeight: '700', color: C.green }}>{listing.price}</Text>
        {listing.views ? (
          <Text style={{ fontSize: 12, color: C.muted }}>{listing.views}</Text>
        ) : (
          <View style={{ alignSelf: 'flex-start', backgroundColor: '#FFFFFF', borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2 }}>
            <Text style={{ fontSize: 11, fontWeight: '600', color: C.muted }}>Черновик</Text>
          </View>
        )}

        {/* Expiry badge for active listings */}
        {tab === 'active' && listing.expiresDate && (() => {
          const urgent = (listing.daysLeft ?? 99) <= 3;
          const soon   = !urgent && (listing.daysLeft ?? 99) <= 7;
          const bgColor  = urgent ? '#FEE2E2' : soon ? '#FEF3C7' : C.greenBg;
          const txtColor = urgent ? C.error   : soon ? '#92400E' : C.green;
          const label = urgent
            ? `Истекает ${listing.daysLeft === 1 ? 'завтра' : `через ${listing.daysLeft} дн.`} · ${listing.expiresDate}`
            : soon
            ? `Ещё ${listing.daysLeft} дн. · до ${listing.expiresDate}`
            : `Активно до ${listing.expiresDate}`;
          return (
            <View style={{ alignSelf: 'flex-start', backgroundColor: bgColor, borderRadius: 5, paddingHorizontal: 7, paddingVertical: 3, marginTop: 2 }}>
              <Text style={{ fontSize: 11, fontWeight: '600', color: txtColor }}>{label}</Text>
            </View>
          );
        })()}

        {/* Actions */}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 4 }}>
          {tab === 'active' && (
            <>
              <Pressable>
                <Text style={{ fontSize: 13, fontWeight: '600', color: C.green }}>Редактировать</Text>
              </Pressable>
              {(listing.daysLeft ?? 99) <= 7 && (
                <Pressable>
                  <Text style={{ fontSize: 13, fontWeight: '600', color: (listing.daysLeft ?? 99) <= 3 ? C.error : '#92400E' }}>Продлить — 3 ₾</Text>
                </Pressable>
              )}
            </>
          )}
          {tab === 'inactive' && (
            <Pressable
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: C.greenBg,
                borderRadius: 6,
                paddingHorizontal: 10,
                paddingVertical: 4,
                gap: 4,
              }}
            >
              <Text style={{ fontSize: 13, fontWeight: '700', color: C.green }}>Возобновить — 3 GEL</Text>
            </Pressable>
          )}
          {tab === 'draft' && (
            <>
              <Pressable
                style={{
                  backgroundColor: C.green,
                  borderRadius: 6,
                  paddingHorizontal: 10,
                  paddingVertical: 4,
                }}
              >
                <Text style={{ fontSize: 13, fontWeight: '700', color: C.white }}>Опубликовать</Text>
              </Pressable>
              <Pressable onPress={() => onDelete(listing.id)}>
                <Text style={{ fontSize: 13, fontWeight: '600', color: C.error }}>Удалить</Text>
              </Pressable>
            </>
          )}
        </View>
      </View>
    </View>
  );
}

function MyListingsInteractive() {
  const { width } = useWindowDimensions();
  const isMobile = width < 640;
  const isDesktop = width >= 1024;

  const [tab, setTab] = useState<Tab>('active');
  const [items, setItems] = useState<Record<Tab, Listing[]>>(LISTINGS);

  const handleDelete = (id: number) => {
    setItems((prev) => ({
      ...prev,
      draft: prev.draft.filter((l) => l.id !== id),
    }));
  };

  const currentList = items[tab];

  const tabBar = (
    <View style={{ flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: C.border }}>
      {TAB_DEFS.map(({ key, label, count }) => {
        const active = tab === key;
        return (
          <Pressable
            key={key}
            onPress={() => setTab(key)}
            style={{
              flex: 1,
              alignItems: 'center',
              paddingVertical: 12,
              borderBottomWidth: active ? 2 : 0,
              borderBottomColor: C.green,
            }}
          >
            <Text style={{ fontSize: 13, fontWeight: '600', color: active ? C.green : C.muted }}>
              {label} ({key === 'draft' ? items.draft.length : count})
            </Text>
          </Pressable>
        );
      })}
    </View>
  );

  const listContent = (
    <View>
      {currentList.length === 0 ? (
        <View style={{ alignItems: 'center', paddingVertical: 48, paddingHorizontal: 24 }}>
          <Text style={{ fontSize: 15, fontWeight: '600', color: C.muted, textAlign: 'center' }}>
            Нет объявлений
          </Text>
        </View>
      ) : (
        currentList.map((listing) => (
          <ListingCard key={listing.id} listing={listing} tab={tab} onDelete={handleDelete} />
        ))
      )}
    </View>
  );

  if (isDesktop) {
    return (
      <View style={{ flexDirection: 'row', gap: 0 }}>
        {/* Sidebar tabs */}
        <View
          style={{
            width: 200,
            borderRightWidth: 1,
            borderRightColor: C.border,
            paddingTop: 8,
          }}
        >
          {TAB_DEFS.map(({ key, label, count }) => {
            const active = tab === key;
            return (
              <Pressable
                key={key}
                onPress={() => setTab(key)}
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 14,
                  backgroundColor: active ? C.greenBg : C.white,
                  borderLeftWidth: active ? 3 : 0,
                  borderLeftColor: C.green,
                }}
              >
                <Text style={{ fontSize: 14, fontWeight: active ? '700' : '500', color: active ? C.green : C.text }}>
                  {label}
                </Text>
                <Text style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>
                  {key === 'draft' ? items.draft.length : count} объявлений
                </Text>
              </Pressable>
            );
          })}
        </View>
        {/* Listings */}
        <View style={{ flex: 1 }}>{listContent}</View>
      </View>
    );
  }

  return (
    <View>
      {tabBar}
      {listContent}
      {isMobile && <BottomNav active="browse" />}
    </View>
  );
}

function MyListingsEmpty() {
  const { width } = useWindowDimensions();
  const isMobile = width < 640;

  return (
    <View>
      <View style={{ paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: C.border, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Text style={{ fontSize: 18, fontWeight: '700', color: C.text }}>Мои объявления</Text>
      </View>
      <View style={{ alignItems: 'center', paddingVertical: 64, paddingHorizontal: 24 }}>
        <Text style={{ fontSize: 16, fontWeight: '600', color: C.text, textAlign: 'center', marginBottom: 8 }}>
          Нет объявлений
        </Text>
        <Text style={{ fontSize: 13, color: C.muted, textAlign: 'center', marginBottom: 20 }}>
          3 бесплатных объявления в каждой категории
        </Text>
        <Pressable
          style={{ backgroundColor: C.green, borderRadius: 8, paddingHorizontal: 24, paddingVertical: 12 }}
        >
          <Text style={{ color: C.white, fontWeight: '700', fontSize: 15 }}>Подать объявление</Text>
        </Pressable>
      </View>
      {isMobile && <BottomNav active="browse" />}
    </View>
  );
}

export default function MyListingsStates() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;

  return (
    <View style={{ gap: 0 }}>
      <StateSection title="MY_LISTINGS / Interactive Tabs (active/inactive/draft)">
        <View
          style={
            isDesktop
              ? {
                  borderWidth: 1,
                  borderColor: C.border,
                  borderRadius: 12,
                  overflow: 'hidden',
                  backgroundColor: C.white,
                }
              : { backgroundColor: C.white }
          }
        >
          <View
            style={{
              paddingHorizontal: 16,
              paddingVertical: 12,
              borderBottomWidth: 1,
              borderBottomColor: C.border,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: '700', color: C.text }}>Мои объявления</Text>
            <Pressable>
              <Text style={{ fontSize: 22, color: C.green, fontWeight: '300' }}>+</Text>
            </Pressable>
          </View>
          <MyListingsInteractive />
        </View>
      </StateSection>

      <StateSection title="MY_LISTINGS / Empty State">
        <View
          style={
            isDesktop
              ? { borderWidth: 1, borderColor: C.border, borderRadius: 12, overflow: 'hidden', backgroundColor: C.white }
              : { backgroundColor: C.white }
          }
        >
          <MyListingsEmpty />
        </View>
      </StateSection>
    </View>
  );
}
