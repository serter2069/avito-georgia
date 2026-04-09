import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StateSection } from '../StateSection';
import { mockListings } from '../../../constants/protoMockData';

const pendingListings = mockListings.filter(l => l.status === 'pending_moderation');

function ModerationCard({ listing }: { listing: typeof mockListings[0] }) {
  return (
    <View className="border border-border rounded-lg overflow-hidden mb-3">
      <Image source={{ uri: listing.photos[0] }} className="w-full h-32" resizeMode="cover" />
      <View className="p-3">
        <Text className="text-text-primary text-sm font-semibold mb-1">{listing.title}</Text>
        <Text className="text-text-muted text-xs mb-3">{listing.city} | {listing.category}</Text>
        <View className="flex-row gap-2">
          <TouchableOpacity className="flex-1 bg-success py-2.5 rounded-lg items-center">
            <Text className="text-white font-semibold text-sm">Одобрить</Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-1 bg-error py-2.5 rounded-lg items-center">
            <Text className="text-white font-semibold text-sm">Отклонить</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

export default function AdminModerationStates() {
  return (
    <View>
      <StateSection title="default">
        <View>
          <Text className="text-text-primary text-lg font-bold mb-4">Очередь модерации ({pendingListings.length})</Text>
          {pendingListings.map((l) => (
            <ModerationCard key={l.id} listing={l} />
          ))}
        </View>
      </StateSection>

      <StateSection title="loading">
        <View className="py-16 items-center">
          <ActivityIndicator size="large" color="#0A7B8A" />
        </View>
      </StateSection>

      <StateSection title="empty_queue">
        <View className="py-16 items-center">
          <Ionicons name="checkmark-done-circle" size={48} color="#2E7D30" />
          <Text className="text-text-primary text-lg font-semibold mt-3">Очередь пуста</Text>
          <Text className="text-text-muted text-sm mt-1">Все объявления проверены</Text>
        </View>
      </StateSection>

      <StateSection title="reject_reason_modal">
        <View className="bg-white border border-border rounded-lg p-4">
          <Text className="text-text-primary text-lg font-bold mb-2">Причина отклонения</Text>
          <Text className="text-text-muted text-sm mb-3">Объявление: "Диван угловой IKEA"</Text>
          <TextInput className="bg-surface border border-border rounded-lg px-4 py-3 text-text-primary h-24 mb-4" placeholder="Укажите причину отклонения..." placeholderTextColor="#6A8898" multiline editable={false} />
          <View className="flex-row gap-3">
            <TouchableOpacity className="flex-1 border border-border py-3 rounded-lg items-center">
              <Text className="text-text-secondary font-semibold">Отмена</Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex-1 bg-error py-3 rounded-lg items-center">
              <Text className="text-white font-semibold">Отклонить</Text>
            </TouchableOpacity>
          </View>
        </View>
      </StateSection>
    </View>
  );
}
