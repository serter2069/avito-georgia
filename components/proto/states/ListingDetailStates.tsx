import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { StateSection } from '../StateSection';

// ─── Design Tokens ───────────────────────────────────────────────────────────
const C = { green:'#00AA6C', greenBg:'#E8F9F2', white:'#FFFFFF', page:'#F5F5F5', text:'#1A1A1A', muted:'#737373', border:'#E0E0E0', error:'#D32F2F' };

// ─── Photo Gallery Placeholder ───────────────────────────────────────────────
function PhotoGallery() {
  return (
    <View className="bg-[#E8E8E8] relative" style={{ height: 260, width: '100%' }}>
      <View className="flex-1 items-center justify-center">
        <Text className="text-[#B0B0B0] text-base">Фото объявления</Text>
      </View>
      {/* Counter */}
      <View className="absolute bottom-3 right-3 bg-black/60 rounded-full px-3 py-1">
        <Text className="text-white text-xs font-semibold">1 / 4</Text>
      </View>
      {/* Dots */}
      <View className="absolute bottom-3 left-0 right-0 flex-row justify-center" style={{ gap: 6 }}>
        <View className="w-2 h-2 rounded-full bg-white" />
        <View className="w-2 h-2 rounded-full bg-white/40" />
        <View className="w-2 h-2 rounded-full bg-white/40" />
        <View className="w-2 h-2 rounded-full bg-white/40" />
      </View>
    </View>
  );
}

// ─── Seller Row ──────────────────────────────────────────────────────────────
function SellerRow({ phoneRevealed }: { phoneRevealed?: boolean }) {
  return (
    <View className="bg-white rounded-lg border border-[#E0E0E0] p-4 mx-4 mt-3">
      <View className="flex-row items-center" style={{ gap: 12 }}>
        <View className="w-11 h-11 bg-[#E8F9F2] rounded-full items-center justify-center">
          <Text className="text-[#00AA6C] font-bold text-lg">М</Text>
        </View>
        <View className="flex-1">
          <Text className="text-[15px] font-semibold text-[#1A1A1A]">Михаил</Text>
          <Text className="text-xs text-[#737373] mt-0.5">На платформе с 2023</Text>
        </View>
      </View>
      <View className="flex-row mt-3" style={{ gap: 10 }}>
        <Pressable className="flex-1 bg-[#00AA6C] rounded-md py-3 items-center">
          <Text className="text-white font-bold text-sm">Написать</Text>
        </Pressable>
        {phoneRevealed ? (
          <View className="flex-1 border border-[#00AA6C] rounded-md py-3 items-center">
            <Text className="text-[#00AA6C] font-bold text-sm">+995 555 12-34-56</Text>
          </View>
        ) : (
          <Pressable className="flex-1 border border-[#E0E0E0] rounded-md py-3 items-center">
            <Text className="text-[#1A1A1A] font-semibold text-sm">Показать телефон</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

// ─── Listing Content ─────────────────────────────────────────────────────────
function ListingContent({ favorite, ownerView }: { favorite?: boolean; ownerView?: boolean }) {
  return (
    <View className="px-4 pt-4">
      {/* Badge */}
      <View className="flex-row items-center mb-2" style={{ gap: 8 }}>
        <View className="rounded-full px-3 py-1 bg-[#E8F9F2]">
          <Text className="text-xs font-bold text-[#00AA6C]">Активно</Text>
        </View>
        {/* Favorite */}
        <View className="flex-1" />
        <Pressable>
          <Text style={{ fontSize: 22 }}>{favorite ? '❤️' : '🤍'}</Text>
        </Pressable>
      </View>

      {/* Title */}
      <Text className="text-xl font-bold text-[#1A1A1A] leading-7">
        3-комнатная квартира, Батуми, вид на море
      </Text>

      {/* Price */}
      <Text className="text-2xl font-extrabold text-[#1A1A1A] mt-2">₾125 000</Text>

      {/* Location */}
      <View className="flex-row items-center mt-3 bg-[#F5F5F5] rounded-md px-3 py-2 self-start" style={{ gap: 6 }}>
        <Text style={{ fontSize: 14 }}>📍</Text>
        <Text className="text-sm text-[#1A1A1A]">Батуми, Аджара</Text>
      </View>

      {/* Description */}
      <Text className="text-base text-[#1A1A1A] leading-6 mt-4">
        Просторная 3-комнатная квартира с панорамным видом на море. Современный ремонт, полностью меблирована. 5 минут пешком до пляжа, рядом вся инфраструктура.
      </Text>

      {/* Owner actions */}
      {ownerView && (
        <View className="flex-row mt-4 border-t border-[#E0E0E0] pt-4" style={{ gap: 8 }}>
          <Pressable className="flex-1 bg-[#00AA6C] rounded-md py-3 items-center">
            <Text className="text-white font-bold text-sm">Редактировать</Text>
          </Pressable>
          <Pressable className="flex-1 bg-[#FFEBEE] rounded-md py-3 items-center">
            <Text className="text-[#D32F2F] font-bold text-sm">Удалить</Text>
          </Pressable>
          <Pressable className="flex-1 border border-[#00AA6C] rounded-md py-3 items-center">
            <Text className="text-[#00AA6C] font-bold text-sm">Продвинуть</Text>
          </Pressable>
        </View>
      )}

      {/* Report */}
      {!ownerView && (
        <Pressable className="mt-4">
          <Text className="text-sm text-[#737373] underline">Пожаловаться</Text>
        </Pressable>
      )}
    </View>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// STATE 1: Default (Guest)
// ═══════════════════════════════════════════════════════════════════════════════
function DefaultGuest() {
  return (
    <StateSection title="LISTING_DETAIL_GUEST">
      <View className="bg-[#F5F5F5] rounded-lg overflow-hidden" style={{ width: 390 }}>
        <PhotoGallery />
        <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
          <ListingContent />
          <SellerRow />
        </ScrollView>
      </View>
    </StateSection>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// STATE 2: Phone Revealed
// ═══════════════════════════════════════════════════════════════════════════════
function PhoneRevealed() {
  return (
    <StateSection title="LISTING_DETAIL_PHONE_REVEALED">
      <View className="bg-[#F5F5F5] rounded-lg overflow-hidden" style={{ width: 390 }}>
        <PhotoGallery />
        <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
          <ListingContent />
          <SellerRow phoneRevealed />
        </ScrollView>
      </View>
    </StateSection>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// STATE 3: Favorite Added
// ═══════════════════════════════════════════════════════════════════════════════
function FavoriteAdded() {
  return (
    <StateSection title="LISTING_DETAIL_FAVORITE_ADDED">
      <View className="bg-[#F5F5F5] rounded-lg overflow-hidden" style={{ width: 390 }}>
        <PhotoGallery />
        <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
          <ListingContent favorite />
          <SellerRow />
        </ScrollView>
      </View>
    </StateSection>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// STATE 4: Owner View
// ═══════════════════════════════════════════════════════════════════════════════
function OwnerView() {
  return (
    <StateSection title="LISTING_DETAIL_OWNER_VIEW">
      <View className="bg-[#F5F5F5] rounded-lg overflow-hidden" style={{ width: 390 }}>
        <PhotoGallery />
        <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
          <ListingContent ownerView />
        </ScrollView>
      </View>
    </StateSection>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN EXPORT
// ═══════════════════════════════════════════════════════════════════════════════
export default function ListingDetailStates() {
  return (
    <View style={{ gap: 32 }}>
      <DefaultGuest />
      <PhoneRevealed />
      <FavoriteAdded />
      <OwnerView />
    </View>
  );
}
