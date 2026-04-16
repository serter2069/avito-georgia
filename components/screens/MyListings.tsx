import React, { useState } from 'react';
import { View, Text, Pressable, useWindowDimensions } from 'react-native';
import BottomNav from '../BottomNav';
import ProtoImage from '../proto/ProtoPlaceholderImage';

const C = {
  green: '#00AA6C',
  greenBg: '#F0FBF6',
  white: '#FFFFFF',
  text: '#1A1A1A',
  sub: '#6B6B6B',
  muted: '#ABABAB',
  border: '#EFEFEF',
  error: '#B45309',
  warnTxt: '#A16207',
  page: '#F7F7F7',
  action: '#5C7C6A',  // softer green for secondary action links
};

type Tab = 'active' | 'inactive' | 'draft';

interface Listing {
  id: number;
  title: string;
  price: string;
  views: string;
  photos: number;
  colorIdx: number;
  expiresDate?: string;
  daysLeft?: number;
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

const TAB_DEFS: { key: Tab; label: string }[] = [
  { key: 'active',   label: 'Активные'   },
  { key: 'inactive', label: 'Неактивные' },
  { key: 'draft',    label: 'Черновики'  },
];

function ListingRow({
  listing,
  tab,
  onDelete,
}: {
  listing: Listing;
  tab: Tab;
  onDelete: (id: number) => void;
}) {
  const urgent = tab === 'active' && (listing.daysLeft ?? 99) <= 3;
  const soon   = tab === 'active' && !urgent && (listing.daysLeft ?? 99) <= 7;

  return (
    <View style={{ flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 14, gap: 12, backgroundColor: C.white }}>
      {/* Thumbnail */}
      <View style={{ borderRadius: 8, overflow: 'hidden', flexShrink: 0 }}>
        <ProtoImage seed={listing.colorIdx + 50} width={72} height={72} />
      </View>

      {/* Info */}
      <View style={{ flex: 1, gap: 3 }}>
        <Text style={{ fontSize: 14, fontWeight: '500', color: C.text, lineHeight: 19 }} numberOfLines={2}>
          {listing.title}
        </Text>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <Text style={{ fontSize: 15, fontWeight: '700', color: C.text }}>{listing.price}</Text>
          {listing.views ? (
            <Text style={{ fontSize: 12, color: C.muted }}>{listing.views}</Text>
          ) : (
            <Text style={{ fontSize: 11, color: C.muted }}>черновик</Text>
          )}
        </View>

        {/* Expiry line */}
        {tab === 'active' && listing.expiresDate && (
          <Text style={{
            fontSize: 11,
            color: urgent ? C.error : soon ? C.warnTxt : C.muted,
            fontWeight: (urgent || soon) ? '600' : '400',
          }}>
            {urgent
              ? `Истекает ${listing.daysLeft === 1 ? 'завтра' : `через ${listing.daysLeft} дн.`} · ${listing.expiresDate}`
              : soon
              ? `Ещё ${listing.daysLeft} дн. · до ${listing.expiresDate}`
              : `До ${listing.expiresDate}`}
          </Text>
        )}

        {/* Actions */}
        <View style={{ flexDirection: 'row', gap: 14, marginTop: 4 }}>
          {tab === 'active' && (
            <>
              <Pressable>
                <Text style={{ fontSize: 12, color: C.action, fontWeight: '500' }}>Редактировать</Text>
              </Pressable>
              {(listing.daysLeft ?? 99) <= 7 && (
                <Pressable>
                  <Text style={{ fontSize: 12, color: C.warnTxt, fontWeight: '500' }}>Продлить — 3 ₾</Text>
                </Pressable>
              )}
            </>
          )}
          {tab === 'inactive' && (
            <Pressable>
              <Text style={{ fontSize: 12, color: C.action, fontWeight: '500' }}>Возобновить — 3 ₾</Text>
            </Pressable>
          )}
          {tab === 'draft' && (
            <>
              <Pressable>
                <Text style={{ fontSize: 12, color: C.action, fontWeight: '500' }}>Опубликовать</Text>
              </Pressable>
              <Pressable onPress={() => onDelete(listing.id)}>
                <Text style={{ fontSize: 12, color: C.muted }}>Удалить</Text>
              </Pressable>
            </>
          )}
        </View>
      </View>
    </View>
  );
}

export function MyListingsInteractive({ showBottomNav = true }: { showBottomNav?: boolean }) {
  const { width } = useWindowDimensions();
  const isMobile = width < 640;
  const isDesktop = width >= 1024;

  const [tab, setTab] = useState<Tab>('active');
  const [items, setItems] = useState<Record<Tab, Listing[]>>(LISTINGS);

  const handleDelete = (id: number) => {
    setItems((prev) => ({ ...prev, draft: prev.draft.filter((l) => l.id !== id) }));
  };

  const counts: Record<Tab, number> = {
    active:   items.active.length,
    inactive: items.inactive.length,
    draft:    items.draft.length,
  };

  const tabBar = (
    <View style={{ flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: C.border, paddingHorizontal: 4 }}>
      {TAB_DEFS.map(({ key, label }) => {
        const active = tab === key;
        return (
          <Pressable
            key={key}
            onPress={() => setTab(key)}
            style={{
              paddingHorizontal: 12,
              paddingVertical: 11,
              borderBottomWidth: 2,
              borderBottomColor: active ? C.green : 'transparent',
              marginBottom: -1,
            }}
          >
            <Text style={{ fontSize: 13, color: active ? C.green : C.sub, fontWeight: active ? '600' : '400' }}>
              {label}
              {counts[key] > 0 && (
                <Text style={{ fontSize: 12, color: active ? C.green : C.muted }}> {counts[key]}</Text>
              )}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );

  const currentList = items[tab];

  const listContent = (
    <View style={{ backgroundColor: C.page }}>
      {currentList.length === 0 ? (
        <View style={{ alignItems: 'center', paddingVertical: 48 }}>
          <Text style={{ fontSize: 14, color: C.muted }}>Нет объявлений</Text>
        </View>
      ) : (
        currentList.map((listing, i) => (
          <View key={listing.id}>
            {i > 0 && <View style={{ height: 1, backgroundColor: C.border, marginLeft: 100 }} />}
            <ListingRow listing={listing} tab={tab} onDelete={handleDelete} />
          </View>
        ))
      )}
    </View>
  );

  if (isDesktop) {
    return (
      <View style={{ flexDirection: 'row' }}>
        {/* Sidebar */}
        <View style={{ width: 180, borderRightWidth: 1, borderRightColor: C.border }}>
          {TAB_DEFS.map(({ key, label }) => {
            const active = tab === key;
            return (
              <Pressable
                key={key}
                onPress={() => setTab(key)}
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  borderLeftWidth: 2,
                  borderLeftColor: active ? C.green : 'transparent',
                  backgroundColor: active ? C.greenBg : C.white,
                }}
              >
                <Text style={{ fontSize: 13, color: active ? C.action : C.sub, fontWeight: active ? '600' : '400' }}>
                  {label}
                </Text>
                <Text style={{ fontSize: 11, color: C.muted, marginTop: 1 }}>{counts[key]} объявлений</Text>
              </Pressable>
            );
          })}
        </View>
        <View style={{ flex: 1 }}>{listContent}</View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: C.white }}>
      {tabBar}
      {listContent}
      {showBottomNav && isMobile && <BottomNav active="browse" />}
    </View>
  );
}

function MyListingsEmpty({ showHeader = true, showBottomNav = true }: { showHeader?: boolean; showBottomNav?: boolean }) {
  const { width } = useWindowDimensions();
  const isMobile = width < 640;

  return (
    <View>
      {showHeader && (
      <View style={{ paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: C.border }}>
        <Text style={{ fontSize: 17, fontWeight: '600', color: C.text }}>Мои объявления</Text>
      </View>
      )}
      <View style={{ alignItems: 'center', paddingVertical: 56, paddingHorizontal: 32 }}>
        <Text style={{ fontSize: 15, fontWeight: '500', color: C.text, marginBottom: 6 }}>Нет объявлений</Text>
        <Text style={{ fontSize: 13, color: C.muted, textAlign: 'center', marginBottom: 24, lineHeight: 18 }}>
          3 бесплатных объявления в каждой категории
        </Text>
        <Pressable style={{ backgroundColor: C.green, borderRadius: 8, paddingHorizontal: 22, paddingVertical: 11 }}>
          <Text style={{ color: C.white, fontWeight: '600', fontSize: 14 }}>Подать объявление</Text>
        </Pressable>
      </View>
      {showBottomNav && isMobile && <BottomNav active="browse" />}
    </View>
  );
}

export default MyListingsInteractive;
