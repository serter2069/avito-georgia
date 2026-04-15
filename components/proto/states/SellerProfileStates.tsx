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
  star: '#F59E0B',
};
const IMG_COLORS = ['#C8E6C9', '#B2DFDB', '#BBDEFB', '#D7CCC8', '#F8BBD0', '#E1BEE7', '#FFF9C4', '#FFCCBC'];

interface SellerListing {
  id: number;
  title: string;
  price: string;
  photos: number;
  colorIdx: number;
}

const SELLER_LISTINGS: SellerListing[] = [
  { id: 1, title: '3-комн. квартира, центр Батуми', price: '85 000 ₾', photos: 14, colorIdx: 0 },
  { id: 2, title: 'Toyota Camry 2019, 45 000 км', price: '25 000 ₾', photos: 8, colorIdx: 1 },
  { id: 3, title: 'Угловой диван, бежевый', price: '700 ₾', photos: 4, colorIdx: 2 },
  { id: 4, title: 'MacBook Pro 14" M3', price: '3 600 ₾', photos: 6, colorIdx: 3 },
  { id: 5, title: 'Велосипед Trek Marlin', price: '1 200 ₾', photos: 5, colorIdx: 4 },
  { id: 6, title: 'Samsung Galaxy S24 Ultra', price: '3 100 ₾', photos: 7, colorIdx: 5 },
];

function StarRating({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);
  return (
    <Text style={{ fontSize: 16, color: C.star, letterSpacing: 1 }}>
      {'\u2605'.repeat(full)}
      {half ? '\u00BD' : ''}
      {'\u2606'.repeat(empty)}
    </Text>
  );
}

function SellerHeader({ name, initials, joined, rating, listingCount }: {
  name: string;
  initials: string;
  joined: string;
  rating: number;
  listingCount: number;
}) {
  return (
    <View style={{ padding: 20, gap: 16 }}>
      {/* Avatar + name + meta */}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
        <View
          style={{
            width: 72,
            height: 72,
            borderRadius: 36,
            backgroundColor: '#757575',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text style={{ fontSize: 26, fontWeight: '700', color: C.white }}>{initials}</Text>
        </View>
        <View style={{ flex: 1, gap: 4 }}>
          <Text style={{ fontSize: 18, fontWeight: '700', color: C.text }}>{name}</Text>
          <Text style={{ fontSize: 13, color: C.muted }}>На платформе с {joined}</Text>
          <Text style={{ fontSize: 13, color: C.muted }}>{listingCount} объявлений</Text>
        </View>
      </View>

      {/* Rating row */}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <StarRating rating={rating} />
        <Text style={{ fontSize: 14, fontWeight: '700', color: C.text }}>{rating.toFixed(1)}</Text>
        <Text style={{ fontSize: 13, color: C.muted }}>· 24 отзыва</Text>
      </View>

      {/* Action buttons */}
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <Pressable
          style={{
            flex: 1,
            backgroundColor: C.green,
            borderRadius: 8,
            paddingVertical: 11,
            alignItems: 'center',
          }}
        >
          <Text style={{ color: C.white, fontWeight: '700', fontSize: 14 }}>Написать</Text>
        </Pressable>
        <Pressable
          style={{
            paddingHorizontal: 16,
            paddingVertical: 11,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: C.border,
            alignItems: 'center',
          }}
        >
          <Text style={{ color: C.muted, fontWeight: '600', fontSize: 13 }}>Пожаловаться</Text>
        </Pressable>
      </View>
    </View>
  );
}

function ListingCard({
  listing,
  cardWidth,
}: {
  listing: SellerListing;
  cardWidth: number;
}) {
  const [liked, setLiked] = useState(false);

  return (
    <View
      style={{
        width: cardWidth,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: C.border,
        overflow: 'hidden',
        backgroundColor: C.white,
      }}
    >
      <View style={{ position: 'relative' }}>
        <ProtoImage seed={listing.colorIdx + 60} width="100%" height={100} />
        {/* Heart */}
        <Pressable
          onPress={() => setLiked(!liked)}
          style={{
            position: 'absolute',
            top: 6,
            right: 6,
            width: 26,
            height: 26,
            borderRadius: 13,
            backgroundColor: 'rgba(255,255,255,0.88)',
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
            bottom: 6,
            right: 6,
            backgroundColor: 'rgba(0,0,0,0.55)',
            borderRadius: 4,
            paddingHorizontal: 5,
            paddingVertical: 2,
          }}
        >
          <Text style={{ color: C.white, fontSize: 10, fontWeight: '600' }}>{listing.photos} фото</Text>
        </View>
      </View>
      <View style={{ padding: 8, gap: 3 }}>
        <Text style={{ fontSize: 13, fontWeight: '700', color: C.green }}>{listing.price}</Text>
        <Text style={{ fontSize: 12, color: C.text }} numberOfLines={2}>
          {listing.title}
        </Text>
      </View>
    </View>
  );
}

function ListingsGrid({ listings }: { listings: SellerListing[] }) {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;
  const isTablet = width >= 640;

  // When desktop, the grid is inside the right column (approximately width - 280px sidebar)
  // We compute columns relative to available space
  const cols = isDesktop ? 3 : isTablet ? 3 : 2;
  const hPad = isDesktop ? 0 : 16;
  const availableWidth = isDesktop ? width - 280 - 32 : width - hPad * 2;
  const gap = 10;
  const cardWidth = (availableWidth - gap * (cols - 1)) / cols;

  const rows: SellerListing[][] = [];
  for (let i = 0; i < listings.length; i += cols) {
    rows.push(listings.slice(i, i + cols));
  }

  if (listings.length === 0) {
    return (
      <View style={{ alignItems: 'center', paddingVertical: 48 }}>
        <Text style={{ fontSize: 14, color: C.muted }}>Нет активных объявлений</Text>
      </View>
    );
  }

  return (
    <View style={{ paddingHorizontal: isDesktop ? 16 : hPad, paddingTop: 12, paddingBottom: 16, gap }}>
      {rows.map((row, ri) => (
        <View key={ri} style={{ flexDirection: 'row', gap }}>
          {row.map((item) => (
            <ListingCard key={item.id} listing={item} cardWidth={cardWidth} />
          ))}
          {row.length < cols &&
            Array(cols - row.length)
              .fill(null)
              .map((_, i) => <View key={`empty-${i}`} style={{ width: cardWidth }} />)}
        </View>
      ))}
    </View>
  );
}

function SellerProfileMain() {
  const { width } = useWindowDimensions();
  const isMobile = width < 640;
  const isDesktop = width >= 1024;

  const headerContent = (
    <SellerHeader
      name="Михаил Т."
      initials="МТ"
      joined="марта 2023"
      rating={4.5}
      listingCount={42}
    />
  );

  const sectionHeader = (
    <View
      style={{
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderTopWidth: 1,
        borderTopColor: C.border,
        borderBottomWidth: 1,
        borderBottomColor: C.border,
        backgroundColor: '#FAFAFA',
      }}
    >
      <Text style={{ fontSize: 14, fontWeight: '600', color: C.text }}>Объявления продавца (42)</Text>
    </View>
  );

  if (isDesktop) {
    return (
      <View style={{ flexDirection: 'row' }}>
        {/* Sidebar */}
        <View
          style={{
            width: 280,
            borderRightWidth: 1,
            borderRightColor: C.border,
          }}
        >
          {headerContent}
        </View>
        {/* Listings */}
        <View style={{ flex: 1 }}>
          {sectionHeader}
          <ListingsGrid listings={SELLER_LISTINGS} />
        </View>
      </View>
    );
  }

  return (
    <View>
      {/* Back nav */}
      <View
        style={{
          paddingHorizontal: 16,
          paddingVertical: 12,
          borderBottomWidth: 1,
          borderBottomColor: C.border,
        }}
      >
        <Text style={{ fontSize: 15, fontWeight: '500', color: C.text }}>← Назад</Text>
      </View>
      {headerContent}
      {sectionHeader}
      <ListingsGrid listings={SELLER_LISTINGS} />
      {isMobile && <BottomNav active="browse" />}
    </View>
  );
}

function SellerProfileEmpty() {
  const { width } = useWindowDimensions();
  const isMobile = width < 640;
  const isDesktop = width >= 1024;

  const headerContent = (
    <SellerHeader
      name="Георгий К."
      initials="ГК"
      joined="января 2024"
      rating={4.0}
      listingCount={0}
    />
  );

  if (isDesktop) {
    return (
      <View style={{ flexDirection: 'row' }}>
        <View style={{ width: 280, borderRightWidth: 1, borderRightColor: C.border }}>
          {headerContent}
        </View>
        <View style={{ flex: 1, alignItems: 'center', paddingVertical: 48 }}>
          <Text style={{ fontSize: 14, color: C.muted }}>Нет активных объявлений</Text>
        </View>
      </View>
    );
  }

  return (
    <View>
      <View style={{ paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: C.border }}>
        <Text style={{ fontSize: 15, fontWeight: '500', color: C.text }}>← Назад</Text>
      </View>
      {headerContent}
      <View
        style={{
          paddingHorizontal: 16,
          paddingVertical: 10,
          borderTopWidth: 1,
          borderTopColor: C.border,
          borderBottomWidth: 1,
          borderBottomColor: C.border,
          backgroundColor: '#FAFAFA',
        }}
      >
        <Text style={{ fontSize: 14, fontWeight: '600', color: C.text }}>Объявления продавца</Text>
      </View>
      <View style={{ alignItems: 'center', paddingVertical: 48 }}>
        <Text style={{ fontSize: 14, color: C.muted }}>Нет активных объявлений</Text>
      </View>
      {isMobile && <BottomNav active="browse" />}
    </View>
  );
}

export default function SellerProfileStates() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;

  const frameStyle = isDesktop
    ? { borderWidth: 1, borderColor: C.border, borderRadius: 12, overflow: 'hidden' as const, backgroundColor: C.white }
    : { backgroundColor: C.white };

  return (
    <View style={{ gap: 0 }}>
      <StateSection title="SELLER_PROFILE / Default (with listings grid)">
        <View style={frameStyle}>
          <SellerProfileMain />
        </View>
      </StateSection>

      <StateSection title="SELLER_PROFILE / Empty listings">
        <View style={frameStyle}>
          <SellerProfileEmpty />
        </View>
      </StateSection>
    </View>
  );
}
