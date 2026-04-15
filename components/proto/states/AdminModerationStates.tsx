import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { StateSection } from '../StateSection';

const C = { green:'#00AA6C', greenBg:'#E8F9F2', white:'#FFFFFF', page:'#F5F5F5', text:'#1A1A1A', muted:'#737373', border:'#E0E0E0', error:'#D32F2F' };

function Card({ children, style }: { children: React.ReactNode; style?: any }) {
  return (
    <View
      className="bg-white rounded-lg border border-[#E0E0E0]"
      style={[{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 3,
      }, style]}
    >
      {children}
    </View>
  );
}

function FilterTab({ label, active }: { label: string; active?: boolean }) {
  return (
    <Pressable
      className="rounded-full px-4 py-2"
      style={{ backgroundColor: active ? C.green : C.white, borderWidth: active ? 0 : 1, borderColor: C.border }}
    >
      <Text className="text-sm font-semibold" style={{ color: active ? C.white : C.muted }}>{label}</Text>
    </Pressable>
  );
}

function ModerationItem({ title, category, seller, time }: { title: string; category: string; seller: string; time: string }) {
  return (
    <View className="p-4">
      <View className="flex-row" style={{ gap: 12 }}>
        {/* Image placeholder */}
        <View className="w-16 h-16 rounded-md bg-[#E0E0E0]" />
        <View className="flex-1">
          <Text className="text-[15px] font-semibold text-[#1A1A1A] mb-1" numberOfLines={1}>{title}</Text>
          <View className="flex-row items-center mb-1" style={{ gap: 6 }}>
            <View className="rounded-full bg-[#E3F2FD] px-2.5 py-0.5">
              <Text className="text-[11px] font-semibold text-[#1565C0]">{category}</Text>
            </View>
            <Text className="text-xs text-[#737373]">{seller}</Text>
          </View>
          <Text className="text-xs text-[#737373]">Опубликовано: {time}</Text>
        </View>
      </View>
      <View className="flex-row mt-3" style={{ gap: 8 }}>
        <Pressable className="flex-1 rounded-md py-2.5 items-center" style={{ backgroundColor: C.greenBg }}>
          <Text className="text-sm font-bold text-[#00AA6C]">✓ Одобрить</Text>
        </Pressable>
        <Pressable className="flex-1 rounded-md py-2.5 items-center" style={{ backgroundColor: '#FFEBEE' }}>
          <Text className="text-sm font-bold text-[#D32F2F]">✗ Отклонить</Text>
        </Pressable>
      </View>
    </View>
  );
}

function QueueState() {
  return (
    <View style={{ width: 390, backgroundColor: C.page }}>
      {/* Header */}
      <View className="bg-white px-4 py-3 border-b border-[#E0E0E0]">
        <Text className="text-lg font-bold text-[#1A1A1A]">Модерация (13)</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
        {/* Filter tabs */}
        <View className="flex-row" style={{ gap: 8 }}>
          <FilterTab label="Все (13)" active />
          <FilterTab label="Новые (8)" />
          <FilterTab label="Повторные (5)" />
        </View>

        {/* Moderation items */}
        <Card style={{ padding: 0, overflow: 'hidden' }}>
          <ModerationItem
            title="iPhone 14 Pro Max 256GB"
            category="Электроника"
            seller="Давид К."
            time="только что"
          />
          <View className="h-px bg-[#E0E0E0]" />
          <ModerationItem
            title="2-комн. квартира, центр Батуми"
            category="Недвижимость"
            seller="Нино М."
            time="5 мин назад"
          />
          <View className="h-px bg-[#E0E0E0]" />
          <ModerationItem
            title="BMW X5 2020, 35000 км"
            category="Авто"
            seller="Гиорги Б."
            time="12 мин назад"
          />
        </Card>
      </ScrollView>
    </View>
  );
}

function DetailState() {
  return (
    <View style={{ width: 390, backgroundColor: C.page }}>
      {/* Header */}
      <View className="flex-row items-center bg-white px-4 py-3 border-b border-[#E0E0E0]" style={{ gap: 12 }}>
        <Text className="text-lg text-[#737373]">←</Text>
        <Text className="text-lg font-bold text-[#1A1A1A]">Просмотр объявления</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, gap: 16 }}>
        {/* Photo placeholder */}
        <View className="w-full h-48 rounded-lg bg-[#E0E0E0] items-center justify-center">
          <Text className="text-3xl">📷</Text>
          <Text className="text-xs text-[#737373] mt-1">Фото объявления</Text>
        </View>

        {/* Listing info */}
        <Card style={{ padding: 16 }}>
          <Text className="text-xl font-bold text-[#1A1A1A] mb-1">iPhone 14 Pro Max 256GB</Text>
          <Text className="text-lg font-bold text-[#00AA6C] mb-3">$950</Text>
          <Text className="text-sm text-[#1A1A1A] leading-5 mb-3">
            Продаю iPhone 14 Pro Max 256GB в отличном состоянии. Полный комплект, коробка, чек. Гарантия до марта 2025.
          </Text>
          <View className="h-px bg-[#E0E0E0] mb-3" />
          <View style={{ gap: 6 }}>
            <View className="flex-row items-center" style={{ gap: 6 }}>
              <Text className="text-xs text-[#737373]">Продавец:</Text>
              <Text className="text-xs font-semibold text-[#1A1A1A]">Давид К.</Text>
            </View>
            <View className="flex-row items-center" style={{ gap: 6 }}>
              <Text className="text-xs text-[#737373]">Категория:</Text>
              <View className="rounded-full bg-[#E3F2FD] px-2.5 py-0.5">
                <Text className="text-[11px] font-semibold text-[#1565C0]">Электроника</Text>
              </View>
            </View>
            <View className="flex-row items-center" style={{ gap: 6 }}>
              <Text className="text-xs text-[#737373]">Город:</Text>
              <Text className="text-xs text-[#1A1A1A]">Тбилиси</Text>
            </View>
          </View>
        </Card>

        {/* Repeat rejection reason */}
        <Card style={{ padding: 14, backgroundColor: '#FFF3E0', borderColor: '#E65100', borderLeftWidth: 3 }}>
          <Text className="text-xs font-semibold" style={{ color: '#E65100' }}>Повторная подача — ранее отклонено:</Text>
          <Text className="text-xs mt-1" style={{ color: '#E65100' }}>Некорректная категория</Text>
        </Card>

        {/* Actions */}
        <View style={{ gap: 8 }}>
          <Pressable className="rounded-md py-3.5 items-center" style={{ backgroundColor: C.green }}>
            <Text className="text-[15px] font-bold text-white">Одобрить</Text>
          </Pressable>
          <Pressable className="rounded-md py-3.5 items-center" style={{ backgroundColor: '#FFEBEE' }}>
            <Text className="text-[15px] font-bold text-[#D32F2F]">Отклонить с причиной</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

function RejectModalState() {
  const [selected, setSelected] = useState('forbidden');
  const reasons = [
    { key: 'forbidden', label: 'Запрещённый контент' },
    { key: 'fraud', label: 'Мошенничество' },
    { key: 'duplicate', label: 'Дублирует объявление' },
    { key: 'wrong_category', label: 'Некорректная категория' },
  ];

  return (
    <View style={{ width: 390, backgroundColor: 'rgba(0,0,0,0.4)' }}>
      <View style={{ height: 200 }} />
      <View className="bg-white rounded-t-2xl px-4 pt-5 pb-8">
        <Text className="text-lg font-bold text-[#1A1A1A] mb-4">Причина отклонения:</Text>
        <View style={{ gap: 12 }}>
          {reasons.map((r) => (
            <Pressable
              key={r.key}
              className="flex-row items-center"
              style={{ gap: 12 }}
              onPress={() => setSelected(r.key)}
            >
              <View
                className="w-5 h-5 rounded-full border-2 items-center justify-center"
                style={{ borderColor: selected === r.key ? C.error : C.border }}
              >
                {selected === r.key && (
                  <View className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: C.error }} />
                )}
              </View>
              <Text className="text-[15px] text-[#1A1A1A]">{r.label}</Text>
            </Pressable>
          ))}
        </View>
        <Pressable className="rounded-md py-3.5 items-center mt-6" style={{ backgroundColor: C.error }}>
          <Text className="text-[15px] font-bold text-white">Отклонить</Text>
        </Pressable>
      </View>
    </View>
  );
}

function EmptyQueueState() {
  return (
    <View style={{ width: 390, backgroundColor: C.page }}>
      <View className="bg-white px-4 py-3 border-b border-[#E0E0E0]">
        <Text className="text-lg font-bold text-[#1A1A1A]">Модерация (0)</Text>
      </View>
      <View className="items-center py-16 px-4">
        <View className="w-[72px] h-[72px] rounded-full bg-[#E8F9F2] items-center justify-center mb-5">
          <Text style={{ fontSize: 32 }}>✓</Text>
        </View>
        <Text className="text-lg font-bold text-[#1A1A1A] mb-1.5">Очередь пуста</Text>
        <Text className="text-sm text-[#737373] text-center">Все объявления проверены</Text>
      </View>
    </View>
  );
}

export default function AdminModerationStates() {
  return (
    <>
      <StateSection title="ADMIN_MODERATION / Queue">
        <QueueState />
      </StateSection>
      <StateSection title="ADMIN_MODERATION / Listing detail for review">
        <DetailState />
      </StateSection>
      <StateSection title="ADMIN_MODERATION / Reject modal">
        <RejectModalState />
      </StateSection>
      <StateSection title="ADMIN_MODERATION / Empty queue">
        <EmptyQueueState />
      </StateSection>
    </>
  );
}
