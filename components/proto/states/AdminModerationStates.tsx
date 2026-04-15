import { View, Text, TextInput, TouchableOpacity, Image,
  useWindowDimensions} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import { StateSection } from '../StateSection';
import { SkeletonBlock, SkeletonRow, SkeletonCard } from '../SkeletonBlock';
import { mockListings } from '../../../constants/protoMockData';

const pendingListings = mockListings.filter(l => l.status === 'pending_moderation');

function ModerationCard({ listing, onReject }: { listing: typeof mockListings[0]; onReject: () => void }) {
  return (
    <View className="border border-border rounded-lg overflow-hidden mb-3">
      <Image source={{ uri: `https://picsum.photos/seed/${listing.id}/400/128` }} style={{ width: '100%', height: 128 }} />
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
  const { width } = useWindowDimensions();

  const isDesktop = width >= 768;

  const containerStyle = isDesktop ? { maxWidth: 960, alignSelf: 'center' as const, width: '100%' } : {};


  return (
    <View>
      <StateSection title="DEFAULT">
        <View style={[{ minHeight: 844 }, containerStyle]}>
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
                placeholderTextColor="#737373"
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

      <StateSection title="LOADING">
        <View style={[{ minHeight: 844 }, containerStyle]}>
          <SkeletonBlock width={200} height={20} style={{ marginBottom: 16 }} />
          {[1, 2].map(i => (
            <View key={i} style={{ borderRadius: 8, borderWidth: 1, borderColor: '#E8EDF0', overflow: 'hidden', marginBottom: 12 }}>
              <SkeletonBlock height={128} radius={0} />
              <View style={{ padding: 12, gap: 8 }}>
                <SkeletonBlock width="60%" height={14} />
                <SkeletonBlock width="40%" height={10} />
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  <SkeletonBlock height={36} radius={8} style={{ flex: 1 }} />
                  <SkeletonBlock height={36} radius={8} style={{ flex: 1 }} />
                </View>
              </View>
            </View>
          ))}
        </View>
      </StateSection>

      <StateSection title="EMPTY_QUEUE">
        <View style={[{ minHeight: 844 }, containerStyle]} className="py-16 items-center">
          <Feather name="check-circle" size={48} color="#2E7D30" />
          <Text className="text-text-primary text-lg font-semibold mt-3">Очередь пуста</Text>
          <Text className="text-text-muted text-sm mt-1">Все объявления проверены</Text>
        </View>
      </StateSection>

      <StateSection title="REJECT_REASON_MODAL">
        <View style={[{ minHeight: 844 }, containerStyle]} className="bg-white border border-border rounded-lg p-4">
          <Text className="text-text-primary text-lg font-bold mb-2">Причина отклонения</Text>
          <Text className="text-text-muted text-sm mb-3">Объявление: "Диван угловой IKEA"</Text>
          <TextInput
            className="bg-surface border border-border rounded-lg px-4 py-3 text-text-primary h-24 mb-4"
            placeholder="Укажите причину отклонения..."
            placeholderTextColor="#737373"
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
