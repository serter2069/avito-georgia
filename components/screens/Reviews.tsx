import React from 'react';
import { View, Text, Pressable, useWindowDimensions } from 'react-native';
import BottomNav from '../../BottomNav';

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

const REVIEWS = [
  { name: 'Анна К.', letter: 'А', color: '#5B8DEF', rating: 5, date: '10 апр 2026', text: 'Отличный продавец! Машина точно как на фото. Быстро ответил на все вопросы, помог с документами. Рекомендую всем!' },
  { name: 'Давид М.', letter: 'Д', color: '#E88B45', rating: 5, date: '3 апр 2026', text: 'Купил автомобиль, всё честно, без скрытых дефектов. Сделка прошла быстро и без проблем.' },
  { name: 'Нино Г.', letter: 'Н', color: '#9B59B6', rating: 4, date: '28 мар 2026', text: 'В целом хорошо, но немного долго отвечал на сообщения. Товар соответствует описанию.' },
  { name: 'Гиорги Т.', letter: 'Г', color: C.green, rating: 4, date: '15 мар 2026', text: 'Нормальная сделка, без проблем. Немного поторговался, договорились на хорошей цене.' },
  { name: 'Тамара Б.', letter: 'Т', color: '#E91E63', rating: 5, date: '2 мар 2026', text: 'Прекрасный продавец, всё точно и вовремя. Уже второй раз покупаю у него.' },
];

const BREAKDOWN = [
  { stars: 5, pct: 60 },
  { stars: 4, pct: 25 },
  { stars: 3, pct: 10 },
  { stars: 2, pct: 3 },
  { stars: 1, pct: 2 },
];

function Stars({ rating, size = 16 }: { rating: number; size?: number }) {
  return (
    <Text style={{ fontSize: size, color: C.star, letterSpacing: 2 }}>
      {'★'.repeat(Math.floor(rating))}{'☆'.repeat(5 - Math.floor(rating))}
    </Text>
  );
}

function Avatar({ letter, color, size = 40 }: { letter: string; color: string; size?: number }) {
  return (
    <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: color, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ color: C.white, fontWeight: '700', fontSize: size * 0.38 }}>{letter}</Text>
    </View>
  );
}

function RatingSummary() {
  return (
    <View style={{ padding: 20, borderBottomWidth: 1, borderBottomColor: C.border }}>
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 24 }}>
        <View style={{ alignItems: 'center' }}>
          <Text style={{ fontSize: 52, fontWeight: '800', color: C.text, lineHeight: 58 }}>4.7</Text>
          <Stars rating={4.7} />
          <Text style={{ fontSize: 12, color: C.muted, marginTop: 4 }}>128 отзывов</Text>
        </View>
        <View style={{ flex: 1, gap: 5 }}>
          {BREAKDOWN.map(({ stars, pct }) => (
            <View key={stars} style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Text style={{ fontSize: 11, color: C.muted, width: 8 }}>{stars}</Text>
              <Text style={{ fontSize: 11, color: C.star }}>★</Text>
              <View style={{ flex: 1, height: 6, backgroundColor: C.border, borderRadius: 3 }}>
                <View style={{ width: `${pct}%`, height: 6, backgroundColor: C.star, borderRadius: 3 }} />
              </View>
              <Text style={{ fontSize: 11, color: C.muted, width: 28 }}>{pct}%</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

function ReviewCard({ name, letter, color, rating, date, text }: typeof REVIEWS[0]) {
  return (
    <View style={{ paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: C.border }}>
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 8 }}>
        <Avatar letter={letter} color={color} size={36} />
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 14, fontWeight: '600', color: C.text }}>{name}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Stars rating={rating} size={13} />
            <Text style={{ fontSize: 11, color: C.muted }}>{date}</Text>
          </View>
        </View>
      </View>
      <Text style={{ fontSize: 13, color: C.text, lineHeight: 20 }}>{text}</Text>
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

function Reviews() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 640;

  const header = (
    <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: C.border, backgroundColor: C.white, gap: 12 }}>
      <Pressable>
        <Text style={{ fontSize: 20, color: C.muted }}>{'<'}</Text>
      </Pressable>
      <Text style={{ fontSize: 16, fontWeight: '700', color: C.text }}>Отзывы о Михаиле</Text>
    </View>
  );

  if (isDesktop) {
    return (
        <View style={{ maxWidth: 900, alignSelf: 'center', width: '100%', backgroundColor: C.white, borderRadius: 12, borderWidth: 1, borderColor: C.border, overflow: 'hidden' }}>
          {header}
          <View style={{ flexDirection: 'row' }}>
            {/* Left: summary */}
            <View style={{ width: 300, borderRightWidth: 1, borderRightColor: C.border }}>
              <RatingSummary />
              <WriteReviewButton />
            </View>
            {/* Right: reviews list */}
            <View style={{ flex: 1, paddingHorizontal: 20 }}>
              {REVIEWS.map((r, i) => <ReviewCard key={i} {...r} />)}
            </View>
          </View>
        </View>
    );
  }

  return (
      <View style={{ backgroundColor: C.white }}>
        {header}
        <RatingSummary />
        <View style={{ paddingHorizontal: 16 }}>
          {REVIEWS.map((r, i) => <ReviewCard key={i} {...r} />)}
        </View>
        <WriteReviewButton />
        <BottomNav active="profile" />
      </View>
  );
}

function ReviewsEmpty() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 640;

  const content = (
    <View style={{ backgroundColor: C.white }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: C.border, gap: 12 }}>
        <Pressable>
          <Text style={{ fontSize: 20, color: C.muted }}>{'<'}</Text>
        </Pressable>
        <Text style={{ fontSize: 16, fontWeight: '700', color: C.text }}>Отзывы о Михаиле</Text>
      </View>
      <View style={{ alignItems: 'center', paddingVertical: 56, paddingHorizontal: 24 }}>
        <Text style={{ fontSize: 40, fontWeight: '800', color: C.text }}>0</Text>
        <Text style={{ fontSize: 12, color: C.muted, marginTop: 4 }}>отзывов</Text>
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

  return
{content}
;
}

export default Reviews;
