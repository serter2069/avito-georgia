import React from 'react';
import { View, Text, ScrollView, Pressable, useWindowDimensions } from 'react-native';
import { StateSection } from '../StateSection';

const C = { green:'#00AA6C', greenBg:'#E8F9F2', white:'#FFFFFF', page:'#F5F5F5', text:'#1A1A1A', muted:'#737373', border:'#E0E0E0', error:'#D32F2F' };

function PhoneFrame({ children }: { children: React.ReactNode }) {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 640;
  return (
    <View
      className="bg-white rounded-xl border border-[#E0E0E0] overflow-hidden"
      style={isDesktop ? { width: 390, alignSelf: 'center' } : { width: '100%' }}
    >
      {children}
    </View>
  );
}

function Header() {
  return (
    <View className="flex-row items-center justify-between px-4 py-3 bg-white border-b border-[#E0E0E0]">
      <Text className="text-base font-semibold text-[#1A1A1A]">← Назад</Text>
      <Text className="text-sm text-[#737373]">Поделиться</Text>
    </View>
  );
}

function PhotoGallery() {
  return (
    <View className="bg-[#E8E8E8] relative" style={{ height: 220, width: '100%' }}>
      <View className="flex-1 items-center justify-center">
        <Text className="text-[#B0B0B0] text-base">Фото объявления</Text>
      </View>
      <View className="absolute bottom-3 right-3 bg-black/60 rounded-full px-3 py-1">
        <Text className="text-white text-xs font-semibold">1 / 4</Text>
      </View>
      <View className="absolute bottom-3 left-0 right-0 flex-row justify-center" style={{ gap: 6 }}>
        <View className="w-2 h-2 rounded-full bg-white" />
        <View className="w-2 h-2 rounded-full bg-white/40" />
        <View className="w-2 h-2 rounded-full bg-white/40" />
        <View className="w-2 h-2 rounded-full bg-white/40" />
      </View>
    </View>
  );
}

function SellerRow({ phoneRevealed }: { phoneRevealed?: boolean }) {
  return (
    <View className="bg-white rounded-lg border border-[#E0E0E0] p-4 mx-4 mt-3">
      <View className="flex-row items-center" style={{ gap: 12 }}>
        <View className="w-11 h-11 bg-[#737373] rounded-full items-center justify-center">
          <Text className="text-white font-bold text-lg">M</Text>
        </View>
        <View className="flex-1">
          <Text className="text-[15px] font-semibold text-[#1A1A1A]">Михаил</Text>
          <Text className="text-xs text-[#737373] mt-0.5">На сайте с 2023</Text>
        </View>
      </View>
      <View className="flex-row mt-3" style={{ gap: 10 }}>
        <Pressable className="flex-1 bg-[#00AA6C] rounded-md py-3 items-center">
          <Text className="text-white font-bold text-sm">Написать</Text>
        </Pressable>
        {phoneRevealed ? (
          <View className="flex-1 border border-[#00AA6C] rounded-md py-3 items-center">
            <Text style={{ color: '#00AA6C', fontWeight: '600', fontSize: 14 }}>+995 555 XX-XX-XX</Text>
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

function ListingContent({ favorite, ownerView }: { favorite?: boolean; ownerView?: boolean }) {
  return (
    <View className="px-4 pt-4">
      {/* Badge */}
      <View className="rounded-full px-3 py-1 bg-[#E8F9F2] self-start mb-2">
        <Text className="text-xs font-bold text-[#00AA6C]">Активно</Text>
      </View>

      {/* Title */}
      <Text className="text-xl font-bold text-[#1A1A1A] leading-7">
        3-комнатная квартира, Батуми, вид на море
      </Text>

      {/* Price */}
      <Text className="text-2xl font-bold text-[#1A1A1A] mt-2">₾125 000</Text>

      {/* Location */}
      <Text className="text-sm text-[#737373] mt-2">Батуми, Аджара</Text>

      {/* Description */}
      <Text className="text-base text-[#1A1A1A] leading-6 mt-4">
        Просторная 3-комнатная квартира с панорамным видом на море. Современный ремонт, полностью меблирована. 5 минут пешком до пляжа, рядом вся инфраструктура.
      </Text>

      {/* Divider */}
      <View className="h-px bg-[#E0E0E0] my-4" />

      {/* Seller or Owner actions */}
      {ownerView ? (
        <View className="flex-row" style={{ gap: 8 }}>
          <Pressable className="flex-1 bg-[#00AA6C] rounded-md py-3 items-center">
            <Text className="text-white font-bold text-sm">Редактировать</Text>
          </Pressable>
          <Pressable className="flex-1 bg-[#FFEBEE] rounded-md py-3 items-center">
            <Text className="text-[#D32F2F] font-bold text-sm">Удалить</Text>
          </Pressable>
          <Pressable className="flex-1 border border-[#00AA6C] rounded-md py-3 items-center">
            <Text className="text-[#00AA6C] font-bold text-sm">Продлить</Text>
          </Pressable>
        </View>
      ) : null}

      {/* Favorite row */}
      {!ownerView && (
        <Pressable className="flex-row items-center py-2">
          <Text style={{ fontSize: 18, color: favorite ? '#e03131' : C.text }}>
            {favorite ? '\u2665' : '\u2661'}
          </Text>
          <Text className="text-sm text-[#1A1A1A] ml-2">В избранное</Text>
        </Pressable>
      )}

      {/* Report */}
      {!ownerView && (
        <Pressable className="mt-2 mb-2">
          <Text className="text-sm text-[#737373] underline">Пожаловаться</Text>
        </Pressable>
      )}
    </View>
  );
}

function ReportModal() {
  const reasons = ['Спам', 'Мошенничество', 'Запрещённый контент', 'Другое'];
  return (
    <View className="bg-black/40 p-6 rounded-lg">
      <View className="bg-white rounded-xl p-5" style={{ gap: 16 }}>
        <Text className="text-lg font-bold text-[#1A1A1A]">Пожаловаться на объявление</Text>
        <View style={{ gap: 12 }}>
          {reasons.map((r, i) => (
            <Pressable key={r} className="flex-row items-center" style={{ gap: 10 }}>
              <View
                className="w-5 h-5 rounded-full border-2 items-center justify-center"
                style={{ borderColor: i === 0 ? C.green : C.border }}
              >
                {i === 0 && <View className="w-2.5 h-2.5 rounded-full bg-[#00AA6C]" />}
              </View>
              <Text className="text-base text-[#1A1A1A]">{r}</Text>
            </Pressable>
          ))}
        </View>
        <View className="flex-row" style={{ gap: 10 }}>
          <Pressable className="flex-1 bg-[#00AA6C] rounded-md py-3 items-center">
            <Text className="text-white font-bold text-sm">Отправить</Text>
          </Pressable>
          <Pressable className="flex-1 border border-[#E0E0E0] rounded-md py-3 items-center">
            <Text className="text-[#1A1A1A] font-semibold text-sm">Отмена</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

// State 1: Default (Guest)
function DefaultGuest() {
  return (
    <StateSection title="LISTING_DETAIL_GUEST">
      <PhoneFrame>
        <Header />
        <PhotoGallery />
        <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
          <ListingContent />
          <SellerRow />
        </ScrollView>
      </PhoneFrame>
    </StateSection>
  );
}

// State 2: Phone Revealed
function PhoneRevealed() {
  return (
    <StateSection title="LISTING_DETAIL_PHONE_REVEALED">
      <PhoneFrame>
        <Header />
        <PhotoGallery />
        <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
          <ListingContent />
          <SellerRow phoneRevealed />
        </ScrollView>
      </PhoneFrame>
    </StateSection>
  );
}

// State 3: Favorite Added
function FavoriteAdded() {
  return (
    <StateSection title="LISTING_DETAIL_FAVORITE_ADDED">
      <PhoneFrame>
        <Header />
        <PhotoGallery />
        <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
          <ListingContent favorite />
          <SellerRow />
        </ScrollView>
      </PhoneFrame>
    </StateSection>
  );
}

// State 4: Owner View
function OwnerView() {
  return (
    <StateSection title="LISTING_DETAIL_OWNER_VIEW">
      <PhoneFrame>
        <Header />
        <PhotoGallery />
        <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
          <ListingContent ownerView />
        </ScrollView>
      </PhoneFrame>
    </StateSection>
  );
}

// State 5: Report Modal
function ReportState() {
  return (
    <StateSection title="LISTING_DETAIL_REPORT_MODAL">
      <PhoneFrame>
        <Header />
        <ReportModal />
      </PhoneFrame>
    </StateSection>
  );
}

export default function ListingDetailStates() {
  return (
    <View style={{ gap: 32 }}>
      <DefaultGuest />
      <PhoneRevealed />
      <FavoriteAdded />
      <OwnerView />
      <ReportState />
    </View>
  );
}
