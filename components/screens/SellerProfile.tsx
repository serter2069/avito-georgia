import React, { useState } from 'react';
import { View, Text, Pressable, useWindowDimensions } from 'react-native';
import BottomNav from '../BottomNav';
import ProtoImage from '../proto/ProtoPlaceholderImage';
import { colors } from '../../lib/theme';
const IMG_COLORS = ['#C8E6C9', '#B2DFDB', '#BBDEFB', '#D7CCC8', '#F8BBD0', '#E1BEE7', '#FFF9C4', '#FFCCBC'];

interface ApiListing {
  id: string;
  title: string;
  price: number;
  currency: string;
  photos: { url: string }[];
  city?: { name: string };
}

interface SellerListing {
  id: string;
  title: string;
  price: string;
  photos: number;
  colorIdx: number;
}

function formatPrice(price: number, currency: string): string {
  return `${price.toLocaleString()} ${currency === 'GEL' ? '₾' : currency}`;
}

function formatJoined(createdAt: string): string {
  const date = new Date(createdAt);
  const months = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
  return `${months[date.getMonth()]} ${date.getFullYear()}`;
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map(w => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function StarRating({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);
  return (
    <Text style={{ fontSize: 16, color: colors.warning, letterSpacing: 1 }}>
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
          <Text style={{ fontSize: 26, fontWeight: '700', color: colors.background }}>{initials}</Text>
        </View>
        <View style={{ flex: 1, gap: 4 }}>
          <Text style={{ fontSize: 18, fontWeight: '700', color: colors.text }}>{name}</Text>
          <Text style={{ fontSize: 13, color: colors.textSecondary }}>На платформе с {joined}</Text>
          <Text style={{ fontSize: 13, color: colors.textSecondary }}>{listingCount} объявлений</Text>
        </View>
      </View>

      {/* Rating row */}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <StarRating rating={rating} />
        <Text style={{ fontSize: 14, fontWeight: '700', color: colors.text }}>{rating.toFixed(1)}</Text>
      </View>

      {/* Action buttons */}
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <Pressable
          accessibilityLabel="Написать продавцу"
          style={{
            flex: 1,
            backgroundColor: colors.primary,
            borderRadius: 8,
            paddingVertical: 11,
            alignItems: 'center',
          }}
        >
          <Text style={{ color: colors.background, fontWeight: '700', fontSize: 14 }}>Написать</Text>
        </Pressable>
        <Pressable
          accessibilityLabel="Пожаловаться на продавца"
          style={{
            paddingHorizontal: 16,
            paddingVertical: 11,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: '#E8E8E8',
            alignItems: 'center',
          }}
        >
          <Text style={{ color: colors.textSecondary, fontWeight: '600', fontSize: 13 }}>Пожаловаться</Text>
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
        borderColor: '#E8E8E8',
        overflow: 'hidden',
        backgroundColor: colors.background,
      }}
    >
      <View style={{ position: 'relative' }}>
        <ProtoImage seed={listing.colorIdx + 60} width="100%" height={100} />
        {/* Heart */}
        <Pressable
          onPress={() => setLiked(!liked)}
          accessibilityLabel="Добавить в избранное"
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
          <Text style={{ fontSize: 14, color: liked ? '#E53935' : colors.textSecondary }}>{liked ? '\u2665' : '\u2661'}</Text>
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
          <Text style={{ color: colors.background, fontSize: 10, fontWeight: '600' }}>{listing.photos} фото</Text>
        </View>
      </View>
      <View style={{ padding: 8, gap: 3 }}>
        <Text style={{ fontSize: 13, fontWeight: '700', color: colors.primary }}>{listing.price}</Text>
        <Text style={{ fontSize: 12, color: colors.text }} numberOfLines={2}>
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
        <Text style={{ fontSize: 14, color: colors.textSecondary }}>Нет активных объявлений</Text>
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

interface SellerProfileProps {
  seller: {
    id: string;
    name: string;
    avatarUrl: string | null;
    createdAt: string;
    _count?: { listings: number };
  } | null;
  listings: ApiListing[];
}

function SellerProfileMain({ seller, listings }: SellerProfileProps) {
  const { width } = useWindowDimensions();
  const isMobile = width < 640;
  const isDesktop = width >= 1024;

  const name = seller?.name ?? 'Продавец';
  const initials = getInitials(name);
  const joined = seller?.createdAt ? formatJoined(seller.createdAt) : '';
  const listingCount = seller?._count?.listings ?? listings.length;

  const mappedListings: SellerListing[] = listings.map((l, i) => ({
    id: l.id,
    title: l.title,
    price: formatPrice(l.price, l.currency),
    photos: l.photos?.length ?? 0,
    colorIdx: i % IMG_COLORS.length,
  }));

  const headerContent = (
    <SellerHeader
      name={name}
      initials={initials}
      joined={joined}
      rating={0}
      listingCount={listingCount}
    />
  );

  const sectionHeader = (
    <View
      style={{
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderTopWidth: 1,
        borderTopColor: '#E8E8E8',
        borderBottomWidth: 1,
        borderBottomColor: '#E8E8E8',
        backgroundColor: '#FAFAFA',
      }}
    >
      <Text style={{ fontSize: 14, fontWeight: '600', color: colors.text }}>Объявления продавца ({listingCount})</Text>
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
            borderRightColor: '#E8E8E8',
          }}
        >
          {headerContent}
        </View>
        {/* Listings */}
        <View style={{ flex: 1 }}>
          {sectionHeader}
          <ListingsGrid listings={mappedListings} />
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Back nav */}
      <View
        style={{
          paddingHorizontal: 16,
          paddingVertical: 12,
          borderBottomWidth: 1,
          borderBottomColor: '#E8E8E8',
        }}
      >
        <Text style={{ fontSize: 15, fontWeight: '500', color: colors.text }}>← Назад</Text>
      </View>
      {headerContent}
      {sectionHeader}
      <ListingsGrid listings={mappedListings} />
      {isMobile && <BottomNav active="browse" />}
    </View>
  );
}

export default SellerProfileMain;
