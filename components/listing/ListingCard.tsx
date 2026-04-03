import { View, Text, Image, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
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
  isPromoted?: boolean;
}

interface ListingCardProps {
  listing: Listing;
  onPress: (id: string) => void;
}

const webShadow = Platform.OS === 'web' ? {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.08,
  shadowRadius: 3,
} : {};

export function ListingCard({ listing, onPress }: ListingCardProps) {
  const { t } = useTranslation();

  return (
    <TouchableOpacity
      style={{
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#C8E0E8',
        borderRadius: 12,
        overflow: 'hidden',
        ...webShadow,
      }}
      onPress={() => onPress(listing.id)}
      activeOpacity={0.7}
    >
      <View>
        {listing.imageUrl ? (
          <Image
            source={{ uri: listing.imageUrl }}
            className="w-full h-48"
            resizeMode="cover"
          />
        ) : (
          <View className="w-full h-48 items-center justify-center" style={{ backgroundColor: '#F2F8FA' }}>
            <Ionicons name="camera-outline" size={32} color="#6A8898" />
          </View>
        )}

        {listing.isPromoted && (
          <View style={{
            position: 'absolute',
            top: 8,
            right: 8,
            backgroundColor: '#f59e0b',
            borderRadius: 6,
            paddingHorizontal: 6,
            paddingVertical: 2,
          }}>
            <Text style={{ color: '#FFFFFF', fontSize: 10, fontWeight: '700' }}>TOP</Text>
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
