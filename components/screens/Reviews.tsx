import React from 'react';
import { View, Text, Pressable, useWindowDimensions } from 'react-native';
import BottomNav from '../BottomNav';

const C = {
  green: '#00AA6C',
  greenBg: '#E8F9F2',
  white: '#FFFFFF',
  text: '#1A1A1A',
  muted: '#9E9E9E',
  border: '#E8E8E8',
  page: '#F5F5F5',
  star: '#F5A623',
};

const AVATAR_COLORS = ['#5B8DEF', '#E88B45', '#9B59B6', '#00AA6C', '#E91E63', '#2196F3', '#FF5722', '#4CAF50'];

interface ApiReview {
  id: string;
  rating: number;
  text: string;
  createdAt: string;
  author: {
    id: string;
    name: string;
    avatarUrl: string | null;
  };
}

function formatDate(createdAt: string): string {
  const date = new Date(createdAt);
  const months = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

function getLetter(name: string): string {
  return (name?.[0] ?? '?').toUpperCase();
}

function Stars({ rating, size = 16 }: { rating: number; size?: number }) {
  return (
    <Text style={{ fontSize: size, color: C.star, letterSpacing: 2 }}>
      {'★'.repeat(Math.floor(rating))}{'☆'.repeat(5 - Math.floor(rating))}
    </Text>
  );
}

function Avatar({ letter, colorIdx, size = 40 }: { letter: string; colorIdx: number; size?: number }) {
  const color = AVATAR_COLORS[colorIdx % AVATAR_COLORS.length];
  return (
    <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: color, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ color: C.white, fontWeight: '700', fontSize: size * 0.38 }}>{letter}</Text>
    </View>
  );
}

function computeBreakdown(reviews: ApiReview[]) {
  const counts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  reviews.forEach(r => { counts[Math.round(r.rating)] = (counts[Math.round(r.rating)] || 0) + 1; });
  const total = reviews.length || 1;
  return [5, 4, 3, 2, 1].map(stars => ({ stars, pct: Math.round((counts[stars] / total) * 100) }));
}

function RatingSummary({ avgRating, total, reviews }: { avgRating: number; total: number; reviews: ApiReview[] }) {
  const breakdown = computeBreakdown(reviews);
  return (
    <View style={{ padding: 20, borderBottomWidth: 1, borderBottomColor: C.border }}>
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 24 }}>
        <View style={{ alignItems: 'center' }}>
          <Text style={{ fontSize: 52, fontWeight: '800', color: C.text, lineHeight: 58 }}>{avgRating.toFixed(1)}</Text>
          <Stars rating={avgRating} />
          <Text style={{ fontSize: 13, color: C.muted, marginTop: 4 }}>{total} отзывов</Text>
        </View>
        <View style={{ flex: 1, gap: 5 }}>
          {breakdown.map(({ stars, pct }) => (
            <View key={stars} style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Text style={{ fontSize: 13, color: C.muted, width: 9 }}>{stars}</Text>
              <Text style={{ fontSize: 13, color: C.star }}>★</Text>
              <View style={{ flex: 1, height: 6, backgroundColor: C.border, borderRadius: 3 }}>
                <View style={{ width: `${pct}%`, height: 6, backgroundColor: C.star, borderRadius: 3 }} />
              </View>
              <Text style={{ fontSize: 13, color: C.muted, width: 28 }}>{pct}%</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

function ReviewCard({ review, colorIdx }: { review: ApiReview; colorIdx: number }) {
  const letter = getLetter(review.author?.name ?? '');
  const date = formatDate(review.createdAt);
  return (
    <View style={{ paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: C.border }}>
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 8 }}>
        <Avatar letter={letter} colorIdx={colorIdx} size={36} />
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 14, fontWeight: '600', color: C.text }}>{review.author?.name ?? 'Пользователь'}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Stars rating={review.rating} size={13} />
            <Text style={{ fontSize: 13, color: C.muted }}>{date}</Text>
          </View>
        </View>
      </View>
      <Text style={{ fontSize: 13, color: C.text, lineHeight: 20 }}>{review.text}</Text>
    </View>
  );
}

function WriteReviewButton() {
  return (
    <View style={{ padding: 16, borderTopWidth: 1, borderTopColor: C.border }}>
      <Pressable style={{ backgroundColor: C.green, borderRadius: 8, paddingVertical: 13, alignItems: 'center' }}>
        <Text style={{ color: C.white, fontWeight: '700', fontSize: 15 }}>Написать отзыв</Text>
      </Pressable>
    </View>
  );
}

interface ReviewsProps {
  reviews: ApiReview[];
  avgRating: number;
  total: number;
}

function Reviews({ reviews, avgRating, total }: ReviewsProps) {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 640;

  const header = (
    <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: C.border, backgroundColor: C.white, gap: 12 }}>
      <Pressable>
        <Text style={{ fontSize: 20, color: C.muted }}>{'<'}</Text>
      </Pressable>
      <Text style={{ fontSize: 16, fontWeight: '700', color: C.text }}>Отзывы</Text>
    </View>
  );

  if (total === 0) {
    const content = (
      <View style={{ backgroundColor: C.white }}>
        {header}
        <View style={{ alignItems: 'center', paddingVertical: 56, paddingHorizontal: 24 }}>
          <Text style={{ fontSize: 40, fontWeight: '800', color: C.text }}>0</Text>
          <Text style={{ fontSize: 13, color: C.muted, marginTop: 4 }}>отзывов</Text>
          <Text style={{ fontSize: 16, fontWeight: '700', color: C.text, marginTop: 20, marginBottom: 8 }}>Отзывов пока нет</Text>
          <Text style={{ fontSize: 13, color: C.muted, textAlign: 'center', lineHeight: 20 }}>
            Станьте первым — завершите сделку чтобы оставить отзыв
          </Text>
        </View>
        {!isDesktop && <BottomNav active="profile" />}
      </View>
    );

    if (isDesktop) {
      return (
        <View style={{ maxWidth: 600, alignSelf: 'center', width: '100%', borderRadius: 12, borderWidth: 1, borderColor: C.border, overflow: 'hidden' }}>
          {content}
        </View>
      );
    }
    return content;
  }

  if (isDesktop) {
    return (
      <View style={{ maxWidth: 900, alignSelf: 'center', width: '100%', backgroundColor: C.white, borderRadius: 12, borderWidth: 1, borderColor: C.border, overflow: 'hidden' }}>
        {header}
        <View style={{ flexDirection: 'row' }}>
          {/* Left: summary */}
          <View style={{ width: 300, borderRightWidth: 1, borderRightColor: C.border }}>
            <RatingSummary avgRating={avgRating} total={total} reviews={reviews} />
            <WriteReviewButton />
          </View>
          {/* Right: reviews list */}
          <View style={{ flex: 1, paddingHorizontal: 20 }}>
            {reviews.map((r, i) => <ReviewCard key={r.id} review={r} colorIdx={i} />)}
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={{ backgroundColor: C.white }}>
      {header}
      <RatingSummary avgRating={avgRating} total={total} reviews={reviews} />
      <View style={{ paddingHorizontal: 16 }}>
        {reviews.map((r, i) => <ReviewCard key={r.id} review={r} colorIdx={i} />)}
      </View>
      <WriteReviewButton />
      <BottomNav active="profile" />
    </View>
  );
}

export default Reviews;
