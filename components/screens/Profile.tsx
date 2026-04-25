import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import BottomNav from '../BottomNav';
import { ProtoImage } from '../proto/ProtoPlaceholderImage';
import { AuthUser } from '../../store/auth';

const C = {
  green: '#00AA6C',
  greenBg: '#E8F9F2',
  white: '#FFFFFF',
  text: '#1A1A1A',
  muted: '#767676',  // WCAG AA on white: 4.54:1 (was #9E9E9E = 2.85:1, failed)
  border: '#E8E8E8',
  page: '#F5F5F5',
  error: '#D32F2F',
  amber: '#F59E0B',
  starEmpty: '#D0D0D0',
};

// ---- Types ----

interface ProfileProps {
  realUser?: AuthUser | null;
  listings?: any[];
  reviews?: any[];
  onSave?: (data: { name: string; phone?: string; city?: string }) => Promise<void>;
  showBottomNav?: boolean;
  // legacy prop kept for backwards compat
  user?: AuthUser | null;
}

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

function ActionButtons() {
  const router = useRouter();
  return (
    <View className="flex-row gap-3 mt-4">
      <Pressable
        onPress={() => router.push('/dashboard/messages' as any)}
        className="flex-1 flex-row items-center justify-center gap-2 rounded-xl py-3"
        style={{ backgroundColor: C.green }}
      >
        <Ionicons name="chatbubble-outline" size={16} color={C.white} />
        <Text style={{ color: C.white, fontWeight: '700', fontSize: 15 }}>Написать</Text>
      </Pressable>
      <Pressable
        onPress={() => router.push('/payment' as any)}
        className="flex-1 flex-row items-center justify-center gap-2 rounded-xl py-3"
        style={{ borderWidth: 1.5, borderColor: C.green }}
      >
        <Text style={{ color: C.green, fontWeight: '700', fontSize: 15 }}>Поднять</Text>
      </Pressable>
    </View>
  );
}

function UserHeader({
  showEditButton,
  onEdit,
  realUser,
  listingCount,
  reviewCount,
}: {
  showEditButton?: boolean;
  onEdit?: () => void;
  realUser?: AuthUser | null;
  listingCount?: number;
  reviewCount?: number;
}) {
  const displayName = realUser?.name || realUser?.email || 'Пользователь';
  const displayInitials = realUser
    ? (realUser.name ?? realUser.email ?? '?')[0].toUpperCase()
    : '?';
  const displayCity = realUser?.city || '';

  return (
    <View className="bg-white rounded-xl overflow-hidden">
      {/* Top gradient band */}
      <View style={{ height: 72, backgroundColor: C.green, opacity: 0.12 }} />

      <View className="px-4 pb-5" style={{ marginTop: -40 }}>
        {/* Avatar */}
        <View className="flex-row items-end justify-between">
          <View style={{ borderWidth: 3, borderColor: C.white, borderRadius: 44 }}>
            <AvatarCircle initials={displayInitials} size={80} />
          </View>
          {showEditButton && (
            <Pressable
              onPress={onEdit}
              className="flex-row items-center gap-1 px-3 rounded-lg"
              style={{ borderWidth: 1, borderColor: C.border, minHeight: 44, justifyContent: 'center' }}
            >
              <Ionicons name="pencil-outline" size={16} color={C.green} />
              <Text style={{ fontSize: 13, color: C.green, fontWeight: '600' }}>Изменить</Text>
            </Pressable>
          )}
        </View>

        {/* Name + city */}
        <View className="mt-3 gap-1">
          <Text style={{ fontSize: 20, fontWeight: '700', color: C.text }}>{displayName}</Text>
          {displayCity ? (
            <View className="flex-row items-center gap-1">
              <Ionicons name="location-outline" size={14} color={C.muted} />
              <Text style={{ fontSize: 13, color: C.muted }}>{displayCity}</Text>
            </View>
          ) : null}
        </View>

        {/* Stats row */}
        <View
          className="flex-row items-center mt-3 rounded-xl px-4 py-3 gap-4"
          style={{ backgroundColor: C.page }}
        >
          <View className="items-center flex-1">
            <Text style={{ fontSize: 16, fontWeight: '700', color: C.text }}>{listingCount ?? 0}</Text>
            <Text style={{ fontSize: 13, color: C.muted, marginTop: 1 }}>объявлений</Text>
          </View>
          <View style={{ width: 1, height: 30, backgroundColor: C.border }} />
          <View className="items-center flex-1">
            <View className="flex-row items-center gap-1">
              <Text style={{ fontSize: 16, fontWeight: '700', color: C.text }}>—</Text>
            </View>
            <Text style={{ fontSize: 13, color: C.muted, marginTop: 1 }}>рейтинг</Text>
          </View>
          <View style={{ width: 1, height: 30, backgroundColor: C.border }} />
          <View className="items-center flex-1">
            <Text style={{ fontSize: 16, fontWeight: '700', color: C.text }}>{reviewCount ?? 0}</Text>
            <Text style={{ fontSize: 13, color: C.muted, marginTop: 1 }}>отзывов</Text>
          </View>
        </View>

        {/* Action buttons — only for other user view */}
        {!showEditButton && (
          <ActionButtons />
        )}
      </View>
    </View>
  );
}

function ListingsSection({ listings }: { listings: any[] }) {
  const router = useRouter();

  if (!listings || listings.length === 0) {
    return (
      <View className="rounded-xl overflow-hidden px-4 py-5" style={{ backgroundColor: C.white }}>
        <Text style={{ fontSize: 15, fontWeight: '700', color: C.text, marginBottom: 12 }}>
          Активные объявления
        </Text>
        <Text style={{ fontSize: 14, color: C.muted, textAlign: 'center', paddingVertical: 16 }}>
          Нет объявлений
        </Text>
      </View>
    );
  }

  return (
    <View className="rounded-xl overflow-hidden" style={{ backgroundColor: C.white }}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 pt-4 pb-2">
        <Text style={{ fontSize: 15, fontWeight: '700', color: C.text }}>Активные объявления</Text>
        <Pressable onPress={() => router.push('/dashboard/listings' as any)} style={{ minHeight: 44, justifyContent: 'center', paddingHorizontal: 4 }}>
          <Text style={{ fontSize: 13, color: C.green, fontWeight: '600' }}>
            Смотреть все ({listings.length})
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
            onPress={() => router.push('/listings/' + item.id as any)}
            className="rounded-xl overflow-hidden"
            style={{ width: 130, borderWidth: 1, borderColor: C.border }}
          >
            {item.seed ? (
              <ProtoImage seed={item.seed} width={130} height={90} />
            ) : (
              <View style={{ width: 130, height: 90, backgroundColor: C.page }} />
            )}
            <View className="p-2 gap-0.5">
              <Text style={{ fontSize: 13, color: C.text, fontWeight: '600' }} numberOfLines={2}>
                {item.title}
              </Text>
              <Text style={{ fontSize: 13, color: C.green, fontWeight: '700' }}>
                {item.price ? `${item.price} ₾` : ''}
              </Text>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

function ReviewsSection({ reviews }: { reviews: any[] }) {
  if (!reviews || reviews.length === 0) {
    return (
      <View className="rounded-xl overflow-hidden px-4 py-5" style={{ backgroundColor: C.white }}>
        <Text style={{ fontSize: 15, fontWeight: '700', color: C.text, marginBottom: 12 }}>Отзывы</Text>
        <Text style={{ fontSize: 14, color: C.muted, textAlign: 'center', paddingVertical: 16 }}>
          Нет отзывов
        </Text>
      </View>
    );
  }

  return (
    <View className="rounded-xl overflow-hidden" style={{ backgroundColor: C.white }}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 pt-4 pb-3">
        <Text style={{ fontSize: 15, fontWeight: '700', color: C.text }}>Отзывы</Text>
        <View
          className="flex-row items-center gap-1.5 px-3 py-1.5 rounded-full"
          style={{ backgroundColor: C.greenBg }}
        >
          <Text style={{ fontSize: 13, color: C.muted }}>{reviews.length} отзывов</Text>
          <Ionicons name="star" size={14} color={C.amber} />
        </View>
      </View>

      <View style={{ height: 1, backgroundColor: C.border, marginHorizontal: 16 }} />

      {/* Review items */}
      {reviews.map((r, i) => {
        const initials = r.initials ?? (r.name ? r.name[0].toUpperCase() : '?');
        return (
          <View key={r.id}>
            <View className="px-4 py-3 gap-2">
              <View className="flex-row items-center gap-3">
                <ReviewerAvatar initials={initials} />
                <View className="flex-1">
                  <Text style={{ fontSize: 14, fontWeight: '700', color: C.text }}>{r.name}</Text>
                  <View className="flex-row items-center gap-2 mt-0.5">
                    <StarRow rating={r.rating ?? 5} size={12} />
                    <Text style={{ fontSize: 13, color: C.muted }}>{r.date ?? r.createdAt ?? ''}</Text>
                  </View>
                </View>
              </View>
              <Text style={{ fontSize: 14, color: C.text, lineHeight: 20 }}>{r.text ?? r.comment ?? ''}</Text>
            </View>
            {i < reviews.length - 1 && (
              <View style={{ height: 1, backgroundColor: C.border, marginHorizontal: 16 }} />
            )}
          </View>
        );
      })}
      <View style={{ height: 8 }} />
    </View>
  );
}

function EditProfileForm({
  realUser,
  onSave,
  onCancel,
}: {
  realUser?: AuthUser | null;
  onSave?: (data: { name: string; phone?: string; city?: string }) => Promise<void>;
  onCancel?: () => void;
}) {
  const [name, setName] = useState(realUser?.name ?? '');
  const [phone, setPhone] = useState(realUser?.phone ?? '');
  const [city, setCity] = useState(realUser?.city ?? '');
  const [saving, setSaving] = useState(false);

  const fields = [
    { label: 'Имя', value: name, setter: setName, placeholder: 'Ваше имя', keyboard: 'default' as const },
    { label: 'Телефон', value: phone, setter: setPhone, placeholder: '+995 5XX XXX XXX', keyboard: 'phone-pad' as const },
    { label: 'Город', value: city, setter: setCity, placeholder: 'Тбилиси', keyboard: 'default' as const },
  ];

  const handleSave = async () => {
    if (!onSave) return;
    setSaving(true);
    try {
      await onSave({ name, phone: phone || undefined, city: city || undefined });
      onCancel?.();
    } finally {
      setSaving(false);
    }
  };

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
          onPress={handleSave}
          disabled={saving}
          className="flex-1 items-center justify-center rounded-xl py-3"
          style={{ backgroundColor: saving ? C.muted : C.green }}
        >
          <Text style={{ color: C.white, fontWeight: '700', fontSize: 15 }}>
            {saving ? 'Сохраняем...' : 'Сохранить'}
          </Text>
        </Pressable>
        <Pressable
          onPress={onCancel}
          className="flex-1 items-center justify-center rounded-xl py-3"
          style={{ borderWidth: 1, borderColor: C.border }}
        >
          <Text style={{ color: C.muted, fontWeight: '600', fontSize: 15 }}>Отмена</Text>
        </Pressable>
      </View>
    </View>
  );
}

// ---- Main Export (Own Profile) ----

export default function Profile({
  realUser,
  listings = [],
  reviews = [],
  onSave,
  showBottomNav = true,
  // legacy prop
  user,
}: ProfileProps) {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 640;
  const [editing, setEditing] = useState(false);

  // Support legacy `user` prop
  const effectiveUser = realUser ?? user ?? null;

  return (
    <View style={{ flex: 1, backgroundColor: C.white, borderRadius: 12, overflow: 'hidden' }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ padding: isDesktop ? 20 : 12, gap: 12 }}>
          <UserHeader
            showEditButton
            onEdit={() => setEditing((v) => !v)}
            realUser={effectiveUser}
            listingCount={listings.length}
            reviewCount={reviews.length}
          />
          {editing && (
            <EditProfileForm
              realUser={effectiveUser}
              onSave={onSave}
              onCancel={() => setEditing(false)}
            />
          )}
          <ListingsSection listings={listings} />
          <ReviewsSection reviews={reviews} />
          <View style={{ height: isDesktop ? 0 : 80 }} />
        </View>
      </ScrollView>
      {showBottomNav && !isDesktop && <BottomNav active="profile" />}
    </View>
  );
}

// ---- Named export for OtherUser context (legacy) ----

export function OwnProfileState({ showBottomNav = true, user }: { showBottomNav?: boolean; user?: AuthUser | null }) {
  return <Profile showBottomNav={showBottomNav} user={user} />;
}
