import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PriceTag } from '../ui/PriceTag';
import { Badge } from '../ui/Badge';
import { colors } from '../../lib/colors';

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
  isPromoted?: boolean;
  isHighlighted?: boolean;
}

interface ListingCardProps {
  listing: Listing;
  onPress: (id: string) => void;
}

export function ListingCard({ listing, onPress }: ListingCardProps) {
  const borderClass = listing.isHighlighted
    ? 'bg-surface-card rounded-lg border-2 border-primary overflow-hidden'
    : 'bg-surface-card rounded-lg border border-border overflow-hidden';

  return (
    <TouchableOpacity
      className={borderClass}
      onPress={() => onPress(listing.id)}
      activeOpacity={0.7}
    >
      <View className="relative">
        {listing.imageUrl ? (
          <Image
            source={{ uri: listing.imageUrl }}
            className="w-full h-48"
            resizeMode="cover"
          />
        ) : (
          <View className="w-full h-48 bg-surface items-center justify-center">
            <Ionicons name="image-outline" size={32} color={colors.borderDefault} />
          </View>
        )}
        {listing.isPromoted && (
          <View className="absolute top-2 left-2 bg-yellow-400 px-2 py-0.5 rounded">
            <Text className="text-xs font-bold text-yellow-900">Топ</Text>
          </View>
        )}
      </View>

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
