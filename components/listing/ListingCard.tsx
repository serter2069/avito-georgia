import { View, Text, Image, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { PriceTag } from '../ui/PriceTag';
import { Badge } from '../ui/Badge';

export interface Listing {
  id: string;
  title: string;
  price: number | null;
  currency?: string;
  negotiable?: boolean;
  imageUrl?: string;
  city?: string;
  category?: string;
  createdAt?: string;
}

interface ListingCardProps {
  listing: Listing;
  onPress: (id: string) => void;
}

export function ListingCard({ listing, onPress }: ListingCardProps) {
  const { t } = useTranslation();

  return (
    <TouchableOpacity
      className="bg-surface-card rounded-lg border border-border overflow-hidden"
      onPress={() => onPress(listing.id)}
      activeOpacity={0.7}
    >
      {listing.imageUrl ? (
        <Image
          source={{ uri: listing.imageUrl }}
          className="w-full h-48"
          resizeMode="cover"
        />
      ) : (
        <View className="w-full h-48 bg-surface items-center justify-center">
          <Text className="text-text-muted text-sm">{t('photos')}</Text>
        </View>
      )}

      <View className="p-3 gap-2">
        <Text className="text-text-primary text-base font-semibold" numberOfLines={2}>
          {listing.title}
        </Text>

        <PriceTag
          price={listing.price}
          currency={listing.currency}
          negotiable={listing.negotiable}
          size="md"
        />

        <View className="flex-row items-center gap-2">
          {listing.city && (
            <Text className="text-text-secondary text-xs">{listing.city}</Text>
          )}
          {listing.category && (
            <Badge label={listing.category} />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}
