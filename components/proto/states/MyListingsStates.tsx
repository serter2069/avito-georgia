import { View, Text, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { StateSection } from '../StateSection';
import { mockListings } from '../../../constants/protoMockData';

const statusBadge: Record<string, { bg: string; text: string; label: string }> = {
  active: { bg: 'bg-success/20', text: 'text-success', label: 'Активно' },
  pending_moderation: { bg: 'bg-warning/20', text: 'text-warning', label: 'На модерации' },
  draft: { bg: 'bg-info/20', text: 'text-info', label: 'Черновик' },
  sold: { bg: 'bg-primary/20', text: 'text-primary', label: 'Продано' },
  removed: { bg: 'bg-error/20', text: 'text-error', label: 'Удалено' },
};

function CompactListingCard({ listing }: { listing: typeof mockListings[0] }) {
  const badge = statusBadge[listing.status] || statusBadge.active;
  return (
    <View className="flex-row bg-white border border-border rounded-lg overflow-hidden mb-3">
      <Image source={{ uri: 'https://picsum.photos/seed/listing1/96/96' }} style={{ width: 96, height: 96 }} />
      <View className="flex-1 p-3">
        <View className="flex-row items-center justify-between mb-1">
          <Text className="text-text-primary text-sm font-semibold flex-1" numberOfLines={1}>{listing.title}</Text>
          <View className={`${badge.bg} px-2 py-0.5 rounded-full ml-2`}>
            <Text className={`${badge.text} text-[10px] font-medium`}>{badge.label}</Text>
          </View>
        </View>
        <Text className="text-primary font-bold text-sm">{listing.price ? `${listing.price.toLocaleString()} ${listing.currency}` : 'Договорная'}</Text>
        <View className="flex-row gap-2 mt-2">
          <TouchableOpacity className="border border-primary px-2 py-1 rounded-md">
            <Text className="text-primary text-xs font-medium">Редактировать</Text>
          </TouchableOpacity>
          <TouchableOpacity className="border border-error px-2 py-1 rounded-md">
            <Text className="text-error text-xs font-medium">Удалить</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

export default function MyListingsStates() {
  return (
    <View style={{ maxWidth: 430, alignSelf: 'center', width: '100%' }}>
      <StateSection title="default">
        <View>
          <View className="flex-row gap-2 mb-4 flex-wrap">
            {['Активные', 'На модерации', 'Черновики', 'Проданные', 'Удалённые'].map((tab, i) => (
              <TouchableOpacity key={tab} className={`px-3 py-2 rounded-lg ${i === 0 ? 'bg-primary' : 'bg-surface border border-border'}`}>
                <Text className={`text-sm font-medium ${i === 0 ? 'text-white' : 'text-text-secondary'}`}>{tab}</Text>
              </TouchableOpacity>
            ))}
          </View>
          {mockListings.slice(0, 4).map((l) => (
            <CompactListingCard key={l.id} listing={l} />
          ))}
          <TouchableOpacity className="bg-primary py-3 rounded-lg items-center mt-2">
            <Text className="text-white font-semibold">Создать объявление</Text>
          </TouchableOpacity>
        </View>
      </StateSection>

      <StateSection title="empty">
        <View className="py-12 items-center">
          <Feather name="file-text" size={48} color="#6A8898" />
          <Text className="text-text-primary text-lg font-semibold mt-3">У вас пока нет объявлений</Text>
          <Text className="text-text-muted text-sm mt-1">Создайте первое объявление!</Text>
          <TouchableOpacity className="bg-primary py-3 px-6 rounded-lg mt-4">
            <Text className="text-white font-semibold">Создать объявление</Text>
          </TouchableOpacity>
        </View>
      </StateSection>

      <StateSection title="loading">
        <View className="py-12 items-center">
          <ActivityIndicator size="large" color="#0A7B8A" />
        </View>
      </StateSection>

      <StateSection title="confirm_delete_modal">
        <View className="bg-white border border-border rounded-lg p-4">
          <Text className="text-text-primary text-lg font-bold mb-2">Удалить объявление?</Text>
          <Text className="text-text-muted text-sm mb-4">Объявление "Toyota Camry 2020" будет удалено. Это действие нельзя отменить.</Text>
          <View className="flex-row gap-3">
            <TouchableOpacity className="flex-1 border border-border py-3 rounded-lg items-center">
              <Text className="text-text-secondary font-semibold">Отмена</Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex-1 bg-error py-3 rounded-lg items-center">
              <Text className="text-white font-semibold">Удалить</Text>
            </TouchableOpacity>
          </View>
        </View>
      </StateSection>
    </View>
  );
}
