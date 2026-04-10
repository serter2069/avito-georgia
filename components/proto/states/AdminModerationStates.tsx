import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import { StateSection } from '../StateSection';
import { ProtoPlaceholderImage } from '../ProtoPlaceholderImage';
import { mockListings } from '../../../constants/protoMockData';

const pendingListings = mockListings.filter(l => l.status === 'pending_moderation');

function ModerationCard({ listing, onReject }: { listing: typeof mockListings[0]; onReject: () => void }) {
  return (
    <View className="border border-border rounded-lg overflow-hidden mb-3">
      <ProtoPlaceholderImage type="photo" width="100%" height={128} />
      <View className="p-3">
        <Text className="text-text-primary text-sm font-semibold mb-1">{listing.title}</Text>
        <Text className="text-text-muted text-xs mb-3">{listing.city} | {listing.category}</Text>
        <View className="flex-row gap-2">
          <TouchableOpacity className="flex-1 bg-success py-2.5 rounded-lg items-center">
            <Text className="text-white font-semibold text-sm">Одобрить</Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-1 bg-error py-2.5 rounded-lg items-center" onPress={onReject}>
            <Text className="text-white font-semibold text-sm">Отклонить</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

export default function AdminModerationStates() {
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);

  return (
    <View>
      <StateSection title="default">
        <View>
          <Text className="text-text-primary text-lg font-bold mb-4">Очередь модерации ({pendingListings.length})</Text>
          {pendingListings.map((l) => (
            <ModerationCard key={l.id} listing={l} onReject={() => setShowRejectModal(true)} />
          ))}
          {showRejectModal && (
            <View className="bg-white border border-border rounded-lg p-4 mt-2">
              <Text className="text-text-primary text-lg font-bold mb-2">Причина отклонения</Text>
              <TextInput
                className="bg-surface border border-border rounded-lg px-4 py-3 text-text-primary h-24 mb-4"
                placeholder="Укажите причину отклонения..."
                placeholderTextColor="#6A8898"
                multiline
                value={rejectReason}
                onChangeText={setRejectReason}
              />
              <View className="flex-row gap-3">
                <TouchableOpacity className="flex-1 border border-border py-3 rounded-lg items-center" onPress={() => setShowRejectModal(false)}>
                  <Text className="text-text-secondary font-semibold">Отмена</Text>
                </TouchableOpacity>
                <TouchableOpacity className="flex-1 bg-error py-3 rounded-lg items-center" onPress={() => { setShowRejectModal(false); setRejectReason(''); }}>
                  <Text className="text-white font-semibold">Отклонить</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </StateSection>

      <StateSection title="loading">
        <View className="py-16 items-center">
          <ActivityIndicator size="large" color="#0A7B8A" />
        </View>
      </StateSection>

      <StateSection title="empty_queue">
        <View className="py-16 items-center">
          <Feather name="check-circle" size={48} color="#2E7D30" />
          <Text className="text-text-primary text-lg font-semibold mt-3">Очередь пуста</Text>
          <Text className="text-text-muted text-sm mt-1">Все объявления проверены</Text>
        </View>
      </StateSection>

      <StateSection title="reject_reason_modal">
        <View className="bg-white border border-border rounded-lg p-4">
          <Text className="text-text-primary text-lg font-bold mb-2">Причина отклонения</Text>
          <Text className="text-text-muted text-sm mb-3">Объявление: "Диван угловой IKEA"</Text>
          <TextInput
            className="bg-surface border border-border rounded-lg px-4 py-3 text-text-primary h-24 mb-4"
            placeholder="Укажите причину отклонения..."
            placeholderTextColor="#6A8898"
            multiline
            value={rejectReason}
            onChangeText={setRejectReason}
          />
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
