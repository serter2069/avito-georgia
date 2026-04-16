import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BottomNav from '../BottomNav';
import { ProtoImage } from '../proto/ProtoPlaceholderImage';

const C = {
  green: '#00AA6C',
  greenBg: '#E8F9F2',
  white: '#FFFFFF',
  text: '#1A1A1A',
  muted: '#9E9E9E',
  border: '#E8E8E8',
  page: '#F5F5F5',
  error: '#D32F2F',
  amber: '#F59E0B',
  starEmpty: '#D0D0D0',
};

// ---- Data ----

const USER = {
  name: 'Георгий Мелашвили',
  initials: 'ГМ',
  city: 'Тбилиси',
  memberSince: 'На сайте с 2022',
  rating: '4.8',
  reviewCount: 23,
  listingCount: 7,
};

const LISTINGS = [
  { id: 1, title: 'Toyota Camry 2019', price: '45 000 ₾', seed: 'camry19' },
  { id: 2, title: 'iPhone 14 Pro Max', price: '2 400 ₾', seed: 'iphone14' },
  { id: 3, title: 'Квартира 3-ком, Батуми', price: '85 000 ₾', seed: 'batumi3' },
  { id: 4, title: 'MacBook Pro 14" M2', price: '3 800 ₾', seed: 'macm2' },
  { id: 5, title: 'Диван угловой', price: '1 200 ₾', seed: 'sofa5' },
  { id: 6, title: 'Honda CBR 600RR', price: '18 500 ₾', seed: 'cbr600' },
  { id: 7, title: 'Холодильник Samsung', price: '950 ₾', seed: 'fridge7' },
];

const REVIEWS = [
  {
    id: 1,
    name: 'Нино Беридзе',
    initials: 'НБ',
    rating: 5,
    date: '12 апреля 2025',
    text: 'Отличный продавец! Машина полностью соответствует описанию, документы в порядке. Очень рекомендую.',
  },
  {
    id: 2,
    name: 'Михаил Робакидзе',
    initials: 'МР',
    rating: 5,
    date: '3 апреля 2025',
    text: 'Быстрая сделка, Георгий всё объяснил и помог с оформлением. Честный человек.',
  },
  {
    id: 3,
    name: 'Тамара Чиковани',
    initials: 'ТЧ',
    rating: 4,
    date: '28 марта 2025',
    text: 'Всё хорошо, телефон как новый. Немного задержался с ответом, но в целом доволен.',
  },
  {
    id: 4,
    name: 'Давид Кварацхелия',
    initials: 'ДК',
    rating: 5,
    date: '15 марта 2025',
    text: 'Купил квартиру через Георгия. Профессионал! Помог оформить все документы, ответил на все вопросы.',
  },
  {
    id: 5,
    name: 'Анна Гогиашвили',
    initials: 'АГ',
    rating: 4,
    date: '2 марта 2025',
    text: 'Хороший продавец, MacBook в отличном состоянии. Цена немного завышена, но качество того стоит.',
  },
];

// ---- Sub-components ----

function AvatarCircle({ initials, size = 80 }: { initials: string; size?: number }) {
  return (
    <View
      className="items-center justify-center"
      style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: C.green }}
    >
      <Text style={{ color: C.white, fontWeight: '700', fontSize: size * 0.3 }}>{initials}</Text>
    </View>
  );
}

function ReviewerAvatar({ initials }: { initials: string }) {
  return (
    <View
      className="items-center justify-center"
      style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: '#E0F0FF' }}
    >
      <Text style={{ color: '#1565C0', fontWeight: '700', fontSize: 13 }}>{initials}</Text>
    </View>
  );
}

function StarRow({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <View className="flex-row gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Ionicons
          key={i}
          name={i <= rating ? 'star' : 'star-outline'}
          size={size}
          color={i <= rating ? C.amber : C.starEmpty}
        />
      ))}
    </View>
  );
}

function UserHeader({ showEditButton, onEdit }: { showEditButton?: boolean; onEdit?: () => void }) {
  return (
    <View className="bg-white rounded-xl overflow-hidden">
      {/* Top gradient band */}
      <View style={{ height: 72, backgroundColor: C.green, opacity: 0.12 }} />

      <View className="px-4 pb-5" style={{ marginTop: -40 }}>
        {/* Avatar */}
        <View className="flex-row items-end justify-between">
          <View style={{ borderWidth: 3, borderColor: C.white, borderRadius: 44 }}>
            <AvatarCircle initials={USER.initials} size={80} />
          </View>
          {showEditButton && (
            <Pressable
              onPress={onEdit}
              className="flex-row items-center gap-1 px-3 py-2 rounded-lg"
              style={{ borderWidth: 1, borderColor: C.border }}
            >
              <Ionicons name="pencil-outline" size={16} color={C.green} />
              <Text style={{ fontSize: 13, color: C.green, fontWeight: '600' }}>Изменить</Text>
            </Pressable>
          )}
        </View>

        {/* Name + city + since */}
        <View className="mt-3 gap-1">
          <Text style={{ fontSize: 20, fontWeight: '700', color: C.text }}>{USER.name}</Text>
          <View className="flex-row items-center gap-1">
            <Ionicons name="location-outline" size={14} color={C.muted} />
            <Text style={{ fontSize: 13, color: C.muted }}>{USER.city}</Text>
            <Text style={{ fontSize: 13, color: C.muted }}>·</Text>
            <Ionicons name="calendar-outline" size={14} color={C.muted} />
            <Text style={{ fontSize: 13, color: C.muted }}>{USER.memberSince}</Text>
          </View>
        </View>

        {/* Stats row */}
        <View
          className="flex-row items-center mt-3 rounded-xl px-4 py-3 gap-4"
          style={{ backgroundColor: C.page }}
        >
          <View className="items-center flex-1">
            <Text style={{ fontSize: 16, fontWeight: '700', color: C.text }}>{USER.listingCount}</Text>
            <Text style={{ fontSize: 11, color: C.muted, marginTop: 1 }}>объявлений</Text>
          </View>
          <View style={{ width: 1, height: 30, backgroundColor: C.border }} />
          <View className="items-center flex-1">
            <View className="flex-row items-center gap-1">
              <Text style={{ fontSize: 16, fontWeight: '700', color: C.text }}>{USER.rating}</Text>
              <Ionicons name="star" size={14} color={C.amber} />
            </View>
            <Text style={{ fontSize: 11, color: C.muted, marginTop: 1 }}>рейтинг</Text>
          </View>
          <View style={{ width: 1, height: 30, backgroundColor: C.border }} />
          <View className="items-center flex-1">
            <Text style={{ fontSize: 16, fontWeight: '700', color: C.text }}>{USER.reviewCount}</Text>
            <Text style={{ fontSize: 11, color: C.muted, marginTop: 1 }}>отзыва</Text>
          </View>
        </View>

        {/* Action buttons */}
        {!showEditButton && (
          <View className="flex-row gap-3 mt-4">
            <Pressable
              className="flex-1 flex-row items-center justify-center gap-2 rounded-xl py-3"
              style={{ backgroundColor: C.green }}
            >
              <Ionicons name="chatbubble-outline" size={16} color={C.white} />
              <Text style={{ color: C.white, fontWeight: '700', fontSize: 15 }}>Написать</Text>
            </Pressable>
            <Pressable
              className="flex-1 flex-row items-center justify-center gap-2 rounded-xl py-3"
              style={{ borderWidth: 1.5, borderColor: C.green }}
            >
              <Text style={{ color: C.green, fontWeight: '700', fontSize: 15 }}>Поднять</Text>
            </Pressable>
          </View>
        )}
      </View>
    </View>
  );
}

function ListingsSection({ listings }: { listings: typeof LISTINGS }) {
  return (
    <View className="rounded-xl overflow-hidden" style={{ backgroundColor: C.white }}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 pt-4 pb-2">
        <Text style={{ fontSize: 15, fontWeight: '700', color: C.text }}>Активные объявления</Text>
        <Pressable>
          <Text style={{ fontSize: 13, color: C.green, fontWeight: '600' }}>
            Смотреть все ({USER.listingCount})
          </Text>
        </Pressable>
      </View>

      {/* Horizontal scroll of cards */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 12, paddingBottom: 14, gap: 10 }}
      >
        {listings.map((item) => (
          <Pressable
            key={item.id}
            className="rounded-xl overflow-hidden"
            style={{ width: 130, borderWidth: 1, borderColor: C.border }}
          >
            <ProtoImage seed={item.seed} width={130} height={90} />
            <View className="p-2 gap-0.5">
              <Text style={{ fontSize: 12, color: C.text, fontWeight: '600' }} numberOfLines={2}>
                {item.title}
              </Text>
              <Text style={{ fontSize: 13, color: C.green, fontWeight: '700' }}>{item.price}</Text>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

function ReviewsSection() {
  return (
    <View className="rounded-xl overflow-hidden" style={{ backgroundColor: C.white }}>
      {/* Header with rating badge */}
      <View className="flex-row items-center justify-between px-4 pt-4 pb-3">
        <Text style={{ fontSize: 15, fontWeight: '700', color: C.text }}>Отзывы</Text>
        <View
          className="flex-row items-center gap-1.5 px-3 py-1.5 rounded-full"
          style={{ backgroundColor: C.greenBg }}
        >
          <Text style={{ fontSize: 16, fontWeight: '800', color: C.green }}>{USER.rating}</Text>
          <Text style={{ fontSize: 13, color: C.muted }}>/</Text>
          <Text style={{ fontSize: 13, color: C.muted }}>5</Text>
          <Ionicons name="star" size={14} color={C.amber} />
        </View>
      </View>

      <View style={{ height: 1, backgroundColor: C.border, marginHorizontal: 16 }} />

      {/* Review items */}
      {REVIEWS.map((r, i) => (
        <View key={r.id}>
          <View className="px-4 py-3 gap-2">
            <View className="flex-row items-center gap-3">
              <ReviewerAvatar initials={r.initials} />
              <View className="flex-1">
                <Text style={{ fontSize: 14, fontWeight: '700', color: C.text }}>{r.name}</Text>
                <View className="flex-row items-center gap-2 mt-0.5">
                  <StarRow rating={r.rating} size={12} />
                  <Text style={{ fontSize: 12, color: C.muted }}>{r.date}</Text>
                </View>
              </View>
            </View>
            <Text style={{ fontSize: 14, color: C.text, lineHeight: 20 }}>{r.text}</Text>
          </View>
          {i < REVIEWS.length - 1 && (
            <View style={{ height: 1, backgroundColor: C.border, marginHorizontal: 16 }} />
          )}
        </View>
      ))}
      <View style={{ height: 8 }} />
    </View>
  );
}

function EditProfileForm() {
  const [name, setName] = useState(USER.name);
  const [phone, setPhone] = useState('+995 555 987 654');
  const [city, setCity] = useState(USER.city);

  const fields = [
    { label: 'Имя', value: name, setter: setName, placeholder: 'Ваше имя', keyboard: 'default' as const },
    { label: 'Телефон', value: phone, setter: setPhone, placeholder: '+995 5XX XXX XXX', keyboard: 'phone-pad' as const },
    { label: 'Город', value: city, setter: setCity, placeholder: 'Тбилиси', keyboard: 'default' as const },
  ];

  return (
    <View className="rounded-xl overflow-hidden px-4 py-4 gap-4" style={{ backgroundColor: C.white }}>
      <Text style={{ fontSize: 16, fontWeight: '700', color: C.text }}>Редактировать профиль</Text>

      {fields.map((f) => (
        <View key={f.label} className="gap-1.5">
          <Text style={{ fontSize: 13, fontWeight: '600', color: C.text }}>{f.label}</Text>
          <View style={{ borderWidth: 1, borderColor: C.border, borderRadius: 10 }}>
            <TextInput
              value={f.value}
              onChangeText={f.setter}
              keyboardType={f.keyboard}
              placeholder={f.placeholder}
              placeholderTextColor={C.muted}
              style={{
                borderWidth: 0,
                backgroundColor: 'transparent',
                paddingHorizontal: 12,
                paddingVertical: 11,
                fontSize: 15,
                color: C.text,
                outlineWidth: 0,
              } as any}
            />
          </View>
        </View>
      ))}

      {/* Save / Cancel */}
      <View className="flex-row gap-3 mt-1">
        <Pressable
          className="flex-1 items-center justify-center rounded-xl py-3"
          style={{ backgroundColor: C.green }}
        >
          <Text style={{ color: C.white, fontWeight: '700', fontSize: 15 }}>Сохранить</Text>
        </Pressable>
        <Pressable
          className="flex-1 items-center justify-center rounded-xl py-3"
          style={{ borderWidth: 1, borderColor: C.border }}
        >
          <Text style={{ color: C.muted, fontWeight: '600', fontSize: 15 }}>Отмена</Text>
        </Pressable>
      </View>
    </View>
  );
}

// ---- State 1: Own Profile ----

export function OwnProfileState({ showBottomNav = true }: { showBottomNav?: boolean }) {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 640;

  return (
    <View style={{ flex: 1, backgroundColor: C.white, borderRadius: 12, overflow: 'hidden' }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ padding: isDesktop ? 20 : 12, gap: 12 }}>
          <UserHeader showEditButton />
          <EditProfileForm />
          <ListingsSection listings={LISTINGS.slice(0, 4)} />
          <ReviewsSection />
          <View style={{ height: isDesktop ? 0 : 80 }} />
        </View>
      </ScrollView>
      {showBottomNav && !isDesktop && <BottomNav active="profile" />}
    </View>
  );
}

// ---- State 2: Other User ----

function OtherUserState({ showBottomNav = true }: { showBottomNav?: boolean }) {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 640;

  return (
      <View style={{ backgroundColor: C.white, borderRadius: 12, overflow: 'hidden' }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{ padding: isDesktop ? 20 : 12, gap: 12 }}>
            {/* Back bar */}
            <View className="flex-row items-center gap-2 pb-1">
              <Pressable className="flex-row items-center gap-1">
                <Ionicons name="chevron-back" size={24} color={C.text} />
                <Text style={{ fontSize: 15, color: C.text }}>Назад</Text>
              </Pressable>
            </View>

            <UserHeader showEditButton={false} />
            <ListingsSection listings={LISTINGS.slice(0, 4)} />
            <ReviewsSection />
            <View style={{ height: isDesktop ? 0 : 80 }} />
          </View>
        </ScrollView>
        {showBottomNav && !isDesktop && <BottomNav active="profile" />}
      </View>
  );
}

// ---- Main Export ----

export default OwnProfileState;
