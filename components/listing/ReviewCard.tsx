import { View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';

export interface ReviewData {
  id: string;
  rating: number;
  text: string | null;
  createdAt: string;
  author: {
    id: string;
    name: string | null;
    avatarUrl: string | null;
  };
  listing?: {
    id: string;
    title: string;
  };
}

interface ReviewCardProps {
  review: ReviewData;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <View style={{ flexDirection: 'row', gap: 2 }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Text
          key={star}
          style={{ fontSize: 14, color: star <= rating ? '#F59E0B' : '#D1D5DB' }}
        >
          ★
        </Text>
      ))}
    </View>
  );
}

export function ReviewCard({ review }: ReviewCardProps) {
  const { t } = useTranslation();

  const authorName = review.author.name || t('anonymousUser') || 'User';
  const initials = authorName.charAt(0).toUpperCase();

  const date = new Date(review.createdAt).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <View className="bg-surface-card rounded-lg border border-border p-4 mb-3">
      <View className="flex-row items-center gap-3 mb-2">
        {/* Avatar placeholder */}
        <View className="w-9 h-9 rounded-full bg-primary/30 items-center justify-center">
          <Text className="text-primary text-sm font-bold">{initials}</Text>
        </View>
        <View className="flex-1">
          <Text className="text-text-primary text-sm font-semibold">{authorName}</Text>
          <Text className="text-text-muted text-xs">{date}</Text>
        </View>
        <StarRating rating={review.rating} />
      </View>
      {review.text ? (
        <Text className="text-text-secondary text-sm leading-5">{review.text}</Text>
      ) : null}
    </View>
  );
}
