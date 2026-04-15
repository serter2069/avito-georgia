import React from 'react';
import { View, Text, TextInput, Pressable, useWindowDimensions } from 'react-native';
import { StateSection } from '../StateSection';

// ─── Design Tokens ───────────────────────────────────────────────────────────
const C = { green:'#00AA6C', greenBg:'#E8F9F2', white:'#FFFFFF', page:'#F5F5F5', text:'#1A1A1A', muted:'#737373', border:'#E0E0E0', error:'#D32F2F' };

// ─── Responsive wrapper ─────────────────────────────────────────────────────
function ResponsiveFrame({ children }: { children: React.ReactNode }) {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 640;
  return (
    <View style={isDesktop ? { width: 390, alignSelf: 'center', backgroundColor: C.white, borderRadius: 8, overflow: 'hidden', borderWidth: 1, borderColor: C.border } : { backgroundColor: C.white }}>
      {children}
    </View>
  );
}

// ─── Stars as text ───────────────────────────────────────────────────────────
function Stars({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  const empty = 5 - full;
  return (
    <Text style={{ fontSize: 16, color: '#F5A623', letterSpacing: 2 }}>
      {'★'.repeat(full)}{'☆'.repeat(empty)}
    </Text>
  );
}

// ─── Avatar circle ───────────────────────────────────────────────────────────
function Avatar({ letter, color }: { letter: string; color: string }) {
  return (
    <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: color, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ color: C.white, fontWeight: '700', fontSize: 14 }}>{letter}</Text>
    </View>
  );
}

// ─── Review card ─────────────────────────────────────────────────────────────
function ReviewCard({ name, letter, color, rating, date, text }: { name: string; letter: string; color: string; rating: number; date: string; text: string }) {
  return (
    <View style={{ paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: C.border }}>
      <View className="flex-row items-center" style={{ gap: 10, marginBottom: 6 }}>
        <Avatar letter={letter} color={color} />
        <View className="flex-1">
          <Text className="text-[14px] font-semibold text-[#1A1A1A]">{name}</Text>
          <View className="flex-row items-center" style={{ gap: 8 }}>
            <Stars rating={rating} />
            <Text className="text-[11px] text-[#737373]">{date}</Text>
          </View>
        </View>
      </View>
      <Text className="text-[13px] text-[#1A1A1A] leading-5">{text}</Text>
    </View>
  );
}

// ─── Header ──────────────────────────────────────────────────────────────────
function ReviewsHeader() {
  return (
    <View className="flex-row items-center bg-white px-4 py-3 border-b border-[#E0E0E0]">
      <Text className="text-[15px] text-[#737373] mr-2">←</Text>
      <Text className="text-[16px] font-bold text-[#1A1A1A]">Отзывы о Михаиле</Text>
    </View>
  );
}

// ─── Summary block ───────────────────────────────────────────────────────────
function RatingSummary() {
  return (
    <View className="items-center py-5 border-b border-[#E0E0E0]">
      <Text style={{ fontSize: 40, fontWeight: '800', color: C.text }}>4.7</Text>
      <Stars rating={4} />
      <Text className="text-[13px] text-[#737373] mt-1">8 отзывов</Text>
    </View>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// STATE 1: Default (reviews list)
// ═══════════════════════════════════════════════════════════════════════════════
function ReviewsDefault() {
  const reviews = [
    { name: 'Анна К.', letter: 'А', color: '#5B8DEF', rating: 5, date: '10 апр 2026', text: 'Отличный продавец! Квартира точно как на фото. Быстро ответил на все вопросы, помог с документами.' },
    { name: 'Давид М.', letter: 'Д', color: '#E88B45', rating: 5, date: '3 апр 2026', text: 'Купил машину, всё честно, без скрытых дефектов. Рекомендую.' },
    { name: 'Нино Г.', letter: 'Н', color: '#9B59B6', rating: 4, date: '28 мар 2026', text: 'В целом хорошо, но долго отвечал на сообщения. Товар соответствует описанию.' },
    { name: 'Гиорги Т.', letter: 'Г', color: C.green, rating: 4, date: '15 мар 2026', text: 'Нормальная сделка, без проблем. Немного торговался, но договорились.' },
  ];

  return (
    <StateSection title="REVIEWS_DEFAULT">
      <ResponsiveFrame>
        <ReviewsHeader />
        <RatingSummary />
        <View className="px-4">
          {reviews.map((r, i) => (
            <ReviewCard key={i} {...r} />
          ))}
        </View>
        <View style={{ height: 16 }} />
      </ResponsiveFrame>
    </StateSection>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// STATE 2: Empty
// ═══════════════════════════════════════════════════════════════════════════════
function ReviewsEmpty() {
  return (
    <StateSection title="REVIEWS_EMPTY">
      <ResponsiveFrame>
        <ReviewsHeader />
        <View className="items-center py-16 px-6">
          <Text className="text-lg font-bold text-[#1A1A1A] mb-2">Отзывов пока нет</Text>
          <Text className="text-[13px] text-[#737373] text-center">
            Станьте первым -- завершите сделку чтобы оставить отзыв
          </Text>
        </View>
      </ResponsiveFrame>
    </StateSection>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// STATE 3: Write Review
// ═══════════════════════════════════════════════════════════════════════════════
function ReviewsWrite() {
  const existingReview = { name: 'Анна К.', letter: 'А', color: '#5B8DEF', rating: 5, date: '10 апр 2026', text: 'Отличный продавец! Квартира точно как на фото.' };

  return (
    <StateSection title="REVIEWS_WRITE">
      <ResponsiveFrame>
        <ReviewsHeader />
        <RatingSummary />

        {/* Existing review */}
        <View className="px-4">
          <ReviewCard {...existingReview} />
        </View>

        {/* Write review form */}
        <View className="px-4 pt-4 pb-5">
          <Text className="text-[14px] font-semibold text-[#1A1A1A] mb-3">Ваш отзыв</Text>

          {/* Tappable rating row */}
          <View className="flex-row mb-3" style={{ gap: 4 }}>
            {[1,2,3,4,5].map((i) => (
              <Text key={i} style={{ fontSize: 28, color: i <= 1 ? '#F5A623' : '#E0E0E0' }}>
                {i <= 1 ? '★' : '☆'}
              </Text>
            ))}
          </View>

          {/* Text input */}
          <View className="border border-[#E0E0E0] rounded-lg p-3 mb-4" style={{ minHeight: 100 }}>
            <Text className="text-[14px] text-[#737373]">Ваш отзыв...</Text>
          </View>

          {/* Submit button */}
          <Pressable className="bg-[#00AA6C] rounded-lg py-3 items-center">
            <Text className="text-white font-bold text-[15px]">Отправить</Text>
          </Pressable>
        </View>
      </ResponsiveFrame>
    </StateSection>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN EXPORT
// ═══════════════════════════════════════════════════════════════════════════════
export default function ReviewsStates() {
  return (
    <View style={{ gap: 32 }}>
      <ReviewsDefault />
      <ReviewsEmpty />
      <ReviewsWrite />
    </View>
  );
}
