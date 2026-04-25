import React, { useState } from 'react';
import { View, Text, Pressable, useWindowDimensions } from 'react-native';
import BottomNav from '../BottomNav';
import ProtoImage from '../proto/ProtoPlaceholderImage';
import { colors } from '../../lib/theme';
const IMG_COLORS = ['#C8E6C9', '#B2DFDB', '#BBDEFB', '#D7CCC8', '#F8BBD0', '#E1BEE7', '#FFF9C4', '#FFCCBC'];

interface FavItem {
  id: number;
  title: string;
  price: string;
  city: string;
  photos: number;
  colorIdx: number;
}

const INITIAL_FAVORITES: FavItem[] = [
  { id: 1, title: 'Toyota Camry 2019', price: '12 500 ₾', city: 'Тбилиси', photos: 8, colorIdx: 0 },
  { id: 2, title: 'Квартира 3-комн., центр Батуми', price: '185 000 ₾', city: 'Батуми', photos: 12, colorIdx: 1 },
  { id: 3, title: 'iPhone 15 Pro 256GB', price: '2 800 ₾', city: 'Тбилиси', photos: 5, colorIdx: 2 },
  { id: 4, title: 'Диван угловой, бежевый', price: '950 ₾', city: 'Кутаиси', photos: 4, colorIdx: 3 },
  { id: 5, title: 'Велосипед Trek Marlin 5', price: '1 200 ₾', city: 'Тбилиси', photos: 3, colorIdx: 4 },
  { id: 6, title: 'MacBook Air M2 256GB', price: '3 400 ₾', city: 'Батуми', photos: 6, colorIdx: 5 },
  { id: 7, title: 'Холодильник Samsung NoFrost', price: '1 100 ₾', city: 'Тбилиси', photos: 4, colorIdx: 6 },
  { id: 8, title: 'Ноутбук Dell XPS 15', price: '4 200 ₾', city: 'Тбилиси', photos: 7, colorIdx: 7 },
];

function FavCard({
  item,
  onRemove,
}: {
  item: FavItem;
  onRemove: (id: number) => void;
}) {
  const [liked, setLiked] = useState(true);

  const handleHeart = () => {
    setLiked(false);
    setTimeout(() => onRemove(item.id), 200);
  };

  return (
    <View
      style={{
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#E8E8E8',
        overflow: 'hidden',
        backgroundColor: colors.background,
      }}
    >
      {/* Image area */}
      <View style={{ position: 'relative' }}>
        <ProtoImage seed={item.colorIdx + 40} width="100%" height={110} />
        {/* Heart button — filled red since in favorites */}
        <Pressable
          onPress={handleHeart}
          accessibilityLabel="Убрать из избранного"
          hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
          style={{
            position: 'absolute',
            top: 6,
            right: 6,
            width: 32,
            height: 32,
            borderRadius: 16,
            backgroundColor: 'rgba(255,255,255,0.88)',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text style={{ fontSize: 15, color: liked ? '#E53935' : colors.textSecondary }}>{liked ? '\u2665' : '\u2661'}</Text>
        </Pressable>
        {/* Photo count badge */}
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
          <Text style={{ color: colors.background, fontSize: 13, fontWeight: '600' }}>{item.photos} фото</Text>
        </View>
      </View>

      {/* Info */}
      <View style={{ padding: 10, gap: 3 }}>
        <Text style={{ fontSize: 14, fontWeight: '700', color: colors.primary }}>{item.price}</Text>
        <Text style={{ fontSize: 13, fontWeight: '500', color: colors.text }} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={{ fontSize: 13, color: colors.textSecondary }}>{item.city}</Text>
      </View>
    </View>
  );
}

function FavoritesGrid({ items, onRemove }: { items: FavItem[]; onRemove: (id: number) => void }) {
  const { width } = useWindowDimensions();

  let cols = 2;
  if (width >= 1024) cols = 4;
  else if (width >= 640) cols = 3;

  const gap = 12;
  const hPad = 16;
  const cardWidth = (width - hPad * 2 - gap * (cols - 1)) / cols;

  if (items.length === 0) {
    return (
      <View style={{ alignItems: 'center', paddingVertical: 64, paddingHorizontal: 24 }}>
        <Text style={{ fontSize: 16, fontWeight: '600', color: colors.text, textAlign: 'center', marginBottom: 8 }}>
          Нет избранных объявлений
        </Text>
        <Text style={{ fontSize: 13, color: colors.textSecondary, textAlign: 'center', marginBottom: 20 }}>
          Нажимайте на сердечко, чтобы сохранять объявления
        </Text>
        <Pressable
          accessibilityLabel="Перейти к объявлениям"
          style={{ backgroundColor: colors.primary, borderRadius: 8, paddingHorizontal: 24, paddingVertical: 12 }}
        >
          <Text style={{ color: colors.background, fontWeight: '700', fontSize: 15 }}>Перейти к объявлениям</Text>
        </Pressable>
      </View>
    );
  }

  // Build rows
  const rows: FavItem[][] = [];
  for (let i = 0; i < items.length; i += cols) {
    rows.push(items.slice(i, i + cols));
  }

  return (
    <View style={{ paddingHorizontal: hPad, paddingVertical: 12, gap }}>
      {rows.map((row, ri) => (
        <View key={ri} style={{ flexDirection: 'row', gap }}>
          {row.map((item) => (
            <View key={item.id} style={{ width: cardWidth }}>
              <FavCard item={item} onRemove={onRemove} />
            </View>
          ))}
          {/* Fill empty slots in last row */}
          {row.length < cols &&
            Array(cols - row.length)
              .fill(null)
              .map((_, i) => <View key={`empty-${i}`} style={{ width: cardWidth }} />)}
        </View>
      ))}
    </View>
  );
}

function mapApiItems(apiItems: any[]): FavItem[] {
  return apiItems.map((f, i) => {
    const l = f.listing ?? f;
    const price = l.price != null ? `${l.price} ${l.currency ?? '₾'}` : '';
    // use listing id so delete calls work with /api/favorites/:listingId
    return {
      id: l.id,
      title: l.title ?? '',
      price,
      city: l.city?.name ?? '',
      photos: l.photos?.length ?? 0,
      colorIdx: i % 8,
    };
  });
}

export function FavoritesInteractive({
  showHeader = true,
  showBottomNav = true,
  items: apiItems,
  loading,
  onRemove: onRemoveApi,
}: {
  showHeader?: boolean;
  showBottomNav?: boolean;
  items?: any[];
  loading?: boolean;
  onRemove?: (listingId: string) => Promise<void>;
}) {
  const { width } = useWindowDimensions();
  const isMobile = width < 640;

  const [items, setItems] = useState<FavItem[]>(
    apiItems ? mapApiItems(apiItems) : INITIAL_FAVORITES
  );

  React.useEffect(() => {
    if (apiItems) setItems(mapApiItems(apiItems));
  }, [apiItems]);

  const handleRemove = async (id: number) => {
    if (onRemoveApi) {
      await onRemoveApi(String(id));
    } else {
      setItems((prev) => prev.filter((i) => i.id !== id));
    }
  };

  return (
    <View>
      {showHeader && (
      <View
        style={{
          paddingHorizontal: 16,
          paddingVertical: 12,
          borderBottomWidth: 1,
          borderBottomColor: '#E8E8E8',
        }}
      >
        <Text style={{ fontSize: 18, fontWeight: '700', color: colors.text }}>
          Избранное{items.length > 0 ? ` · ${items.length}` : ''}
        </Text>
      </View>
      )}
      <FavoritesGrid items={items} onRemove={handleRemove} />
      {showBottomNav && isMobile && <BottomNav active="profile" />}
    </View>
  );
}

export default FavoritesInteractive;
