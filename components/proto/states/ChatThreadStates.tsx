import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, Pressable, Modal, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StateSection } from '../StateSection';
import BottomNav from '../BottomNav';
import ProtoImage from '../ProtoPlaceholderImage';

// Photo seeds pool
const PHOTO_SEEDS = [101, 102, 103, 104, 105, 106, 107, 108];

type PhotoMsg = { seeds: number[] };

interface Message {
  id: number;
  text?: string;
  photos?: PhotoMsg;
  mine: boolean;
  time: string;
  read?: boolean;
}

const INITIAL_MESSAGES: Message[] = [
  { id: 1, text: 'Здравствуйте, машина ещё продаётся?', mine: true,  time: '14:10', read: true },
  { id: 2, text: 'Да, ещё продаётся. Что вас интересует?', mine: false, time: '14:12' },
  { id: 3, text: 'Можно посмотреть завтра? Я из Тбилиси.', mine: true,  time: '14:14', read: true },
  { id: 4, text: 'Конечно, приходите в первой половине дня.', mine: false, time: '14:15' },
  // Photo message from other person (1 photo)
  { id: 5, photos: { seeds: [101] }, mine: false, time: '14:16' },
  { id: 6, text: 'Вот фото салона, всё в отличном состоянии.', mine: false, time: '14:16' },
  { id: 7, text: 'Отлично! А двигатель как?', mine: true, time: '14:17', read: false },
  // Photo message from me (3 photos)
  { id: 8, photos: { seeds: [102, 103, 104] }, mine: true, time: '14:18', read: false },
  { id: 9, text: 'Прислал фото из объявления', mine: true, time: '14:18', read: false },
  { id: 10, text: 'Хорошо, жду вас около 11:00.', mine: false, time: '14:19' },
];

// ─── Photo grid inside bubble ────────────────────────────────────────────────
function PhotoGrid({ seeds, onPress }: { seeds: number[]; onPress: (idx: number) => void }) {
  if (seeds.length === 1) {
    return (
      <Pressable
        onPress={() => onPress(0)}
        className="rounded-[10px] overflow-hidden"
        style={{ width: 200, height: 150 }}
      >
        <ProtoImage seed={seeds[0]} width={200} height={150} />
      </Pressable>
    );
  }
  if (seeds.length === 2) {
    return (
      <View className="flex-row rounded-[10px] overflow-hidden" style={{ gap: 3 }}>
        {seeds.map((s, i) => (
          <Pressable
            key={i}
            onPress={() => onPress(i)}
            className="rounded-lg overflow-hidden"
            style={{ width: 120, height: 120 }}
          >
            <ProtoImage seed={s} width={120} height={120} />
          </Pressable>
        ))}
      </View>
    );
  }
  // 3+: main + 2 side
  return (
    <View className="flex-row rounded-[10px] overflow-hidden" style={{ gap: 3, maxWidth: 240 }}>
      <Pressable
        onPress={() => onPress(0)}
        className="rounded-lg overflow-hidden"
        style={{ width: 155, height: 155 }}
      >
        <ProtoImage seed={seeds[0]} width={155} height={155} />
      </Pressable>
      <View style={{ gap: 3 }}>
        {seeds.slice(1, 3).map((s, i) => (
          <Pressable
            key={i}
            onPress={() => onPress(i + 1)}
            className="rounded-md overflow-hidden"
            style={{ width: 78, height: 75 }}
          >
            <ProtoImage seed={s} width={78} height={75} />
            {i === 1 && seeds.length > 3 && (
              <View className="absolute inset-0 bg-black/50 items-center justify-center">
                <Text className="text-white font-bold text-base">+{seeds.length - 3}</Text>
              </View>
            )}
          </Pressable>
        ))}
      </View>
    </View>
  );
}

// ─── Photo Lightbox ───────────────────────────────────────────────────────────
function PhotoLightbox({ seeds, initialIdx, onClose }: {
  seeds: number[];
  initialIdx: number;
  onClose: () => void;
}) {
  const [idx, setIdx] = useState(initialIdx);
  const { width } = useWindowDimensions();
  React.useEffect(() => setIdx(initialIdx), [initialIdx]);

  return (
    <Modal visible transparent animationType="fade" onRequestClose={onClose}>
      <View className="flex-1 bg-black/95 items-center justify-center">
        {/* Close */}
        <Pressable
          onPress={onClose}
          className="absolute top-5 right-5 z-10 w-10 h-10 rounded-full bg-white/20 items-center justify-center"
        >
          <Ionicons name="close" size={28} color="#fff" />
        </Pressable>

        {/* Counter */}
        {seeds.length > 1 && (
          <View className="absolute top-7 left-0 right-0 items-center">
            <Text className="text-white text-sm font-semibold">{idx + 1} / {seeds.length}</Text>
          </View>
        )}

        {/* Image */}
        <View
          className="rounded-[10px] overflow-hidden"
          style={{ width: Math.min(width - 40, 700), aspectRatio: 4 / 3 }}
        >
          <ProtoImage seed={seeds[idx]} width="100%" height={400} />
        </View>

        {/* Prev arrow */}
        {idx > 0 && (
          <Pressable
            onPress={() => setIdx(idx - 1)}
            className="absolute left-3 w-12 h-12 rounded-full bg-white/20 items-center justify-center"
            style={{ top: '50%', transform: [{ translateY: -24 }] }}
          >
            <Ionicons name="chevron-back" size={32} color="#fff" />
          </Pressable>
        )}

        {/* Next arrow */}
        {idx < seeds.length - 1 && (
          <Pressable
            onPress={() => setIdx(idx + 1)}
            className="absolute right-3 w-12 h-12 rounded-full bg-white/20 items-center justify-center"
            style={{ top: '50%', transform: [{ translateY: -24 }] }}
          >
            <Ionicons name="chevron-forward" size={32} color="#fff" />
          </Pressable>
        )}

        {/* Thumbnails */}
        {seeds.length > 1 && (
          <View className="absolute bottom-5 flex-row" style={{ gap: 8 }}>
            {seeds.map((s, i) => (
              <Pressable
                key={i}
                onPress={() => setIdx(i)}
                className="rounded overflow-hidden"
                style={{
                  width: 48,
                  height: 36,
                  borderWidth: 2,
                  borderColor: i === idx ? '#00AA6C' : 'rgba(255,255,255,0.25)',
                }}
              >
                <ProtoImage seed={s} width={48} height={36} />
              </Pressable>
            ))}
          </View>
        )}
      </View>
    </Modal>
  );
}

// ─── Message Bubble ───────────────────────────────────────────────────────────
function MessageBubble({ msg, onPhotoPress }: {
  msg: Message;
  onPhotoPress: (seeds: number[], idx: number) => void;
}) {
  const hasPhotos = msg.photos && msg.photos.seeds.length > 0;
  const hasText = !!msg.text;

  const bubbleClass = msg.mine
    ? 'bg-[#E8F9F2] rounded-[14px] rounded-br px-3 py-2 max-w-[260px]'
    : 'bg-white border border-[#E8E8E8] rounded-[14px] rounded-bl px-3 py-2 max-w-[260px]';

  const content = (
    <View>
      {hasPhotos && (
        <View className={hasText ? 'mb-1.5' : ''}>
          <PhotoGrid
            seeds={msg.photos!.seeds}
            onPress={(i) => onPhotoPress(msg.photos!.seeds, i)}
          />
        </View>
      )}
      {hasText && (
        <View className={bubbleClass}>
          <Text className="text-sm text-[#1A1A1A] leading-5">{msg.text}</Text>
        </View>
      )}
    </View>
  );

  if (msg.mine) {
    return (
      <View className="items-end px-4 mb-1.5">
        {content}
        <View className="flex-row items-center mt-0.5" style={{ gap: 3 }}>
          <Text className="text-[10px] text-[#9E9E9E]">{msg.time}</Text>
          <Ionicons
            name="checkmark-done"
            size={14}
            color={msg.read ? '#00AA6C' : '#9E9E9E'}
          />
        </View>
      </View>
    );
  }

  return (
    <View className="items-start px-4 mb-1.5">
      {content}
      <Text className="text-[10px] text-[#9E9E9E] mt-0.5">{msg.time}</Text>
    </View>
  );
}

// ─── Photo attachment preview strip ──────────────────────────────────────────
function AttachPreview({ seeds, onRemove }: { seeds: number[]; onRemove: (i: number) => void }) {
  if (seeds.length === 0) return null;
  return (
    <View className="flex-row flex-wrap px-3 pt-2" style={{ gap: 6 }}>
      {seeds.map((s, i) => (
        <View key={i} className="relative">
          <View
            className="rounded-lg overflow-hidden border border-[#E8E8E8]"
            style={{ width: 56, height: 56 }}
          >
            <ProtoImage seed={s} width={56} height={56} />
          </View>
          <Pressable
            onPress={() => onRemove(i)}
            className="absolute -top-1.5 -right-1.5 items-center justify-center"
          >
            <Ionicons name="close-circle" size={18} color="#fff" />
          </Pressable>
        </View>
      ))}
    </View>
  );
}

// ─── Interactive Chat ─────────────────────────────────────────────────────────
function InteractiveChat() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [attachSeeds, setAttachSeeds] = useState<number[]>([]);
  const [lightbox, setLightbox] = useState<{ seeds: number[]; idx: number } | null>(null);

  const pool = [105, 106, 107, 108, 109, 110, 111, 112];

  function addPhoto() {
    setAttachSeeds(prev => [...prev, pool[prev.length % pool.length]]);
  }

  function removeAttach(i: number) {
    setAttachSeeds(prev => prev.filter((_, idx) => idx !== i));
  }

  function sendMessage() {
    const text = input.trim();
    if (!text && attachSeeds.length === 0) return;
    const now = new Date();
    const time = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;
    const newMsg: Message = { id: Date.now(), mine: true, time, read: false };
    if (attachSeeds.length > 0) newMsg.photos = { seeds: [...attachSeeds] };
    if (text) newMsg.text = text;
    setMessages(prev => [...prev, newMsg]);
    setInput('');
    setAttachSeeds([]);
  }

  const canSend = input.trim().length > 0 || attachSeeds.length > 0;

  return (
    <View className="flex-1 bg-[#F5F5F5]">
      <ScrollView
        contentContainerStyle={{ paddingTop: 12, paddingBottom: 8 }}
        showsVerticalScrollIndicator={false}
      >
        {messages.map(msg => (
          <MessageBubble
            key={msg.id}
            msg={msg}
            onPhotoPress={(seeds, idx) => setLightbox({ seeds, idx })}
          />
        ))}
      </ScrollView>

      {/* Attach preview strip */}
      <AttachPreview seeds={attachSeeds} onRemove={removeAttach} />

      {/* Input bar */}
      <View className="flex-row items-center px-2.5 py-2 border-t border-[#E8E8E8] bg-white" style={{ gap: 8 }}>
        {/* Image attach button */}
        <Pressable
          onPress={addPhoto}
          className="w-9 h-9 rounded-full bg-[#F0F0F0] items-center justify-center"
        >
          <Ionicons name="image-outline" size={24} color="#9E9E9E" />
        </Pressable>

        {/* Text input */}
        <View className="flex-1 flex-row items-center border border-[#E8E8E8] rounded-[20px] px-3.5">
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Написать..."
            placeholderTextColor="#9E9E9E"
            style={{ flex: 1, fontSize: 15, color: '#1A1A1A', paddingVertical: 10, outlineWidth: 0 } as any}
            onSubmitEditing={sendMessage}
            returnKeyType="send"
          />
        </View>

        {/* Send button */}
        <Pressable onPress={sendMessage}>
          <Ionicons
            name="arrow-up-circle"
            size={32}
            color={canSend ? '#00AA6C' : '#D0D0D0'}
          />
        </Pressable>
      </View>

      {/* Lightbox */}
      {lightbox && (
        <PhotoLightbox
          seeds={lightbox.seeds}
          initialIdx={lightbox.idx}
          onClose={() => setLightbox(null)}
        />
      )}
    </View>
  );
}

// ─── Header ───────────────────────────────────────────────────────────────────
function Header() {
  return (
    <View className="flex-row items-center px-4 py-3 border-b border-[#E8E8E8] bg-white" style={{ gap: 12 }}>
      {/* Back button */}
      <Pressable className="w-8 h-8 items-center justify-center">
        <Ionicons name="chevron-back" size={26} color="#1A1A1A" />
      </Pressable>

      {/* Avatar */}
      <View className="w-10 h-10 rounded-full bg-[#5B8DEF] items-center justify-center">
        <Text className="text-white font-bold text-base">М</Text>
      </View>

      {/* Name + status */}
      <View className="flex-1">
        <Text className="text-[15px] font-semibold text-[#1A1A1A]">Михаил</Text>
        <View className="flex-row items-center" style={{ gap: 4 }}>
          <View className="w-2 h-2 rounded-full bg-[#00AA6C]" />
          <Text className="text-xs text-[#00AA6C]">онлайн</Text>
        </View>
      </View>
    </View>
  );
}

// ─── Main state ───────────────────────────────────────────────────────────────
function ChatThreadDefault() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 640;

  const inner = (
    <View className="flex-1" style={{ minHeight: 560 }}>
      <Header />
      <InteractiveChat />
      {!isDesktop && <BottomNav active="messages" />}
    </View>
  );

  if (isDesktop) {
    return (
      <StateSection title="CHAT_THREAD / Default (with photo attach)">
        <View className="max-w-[800px] self-center w-full bg-white rounded-xl border border-[#E8E8E8] overflow-hidden">
          {inner}
        </View>
      </StateSection>
    );
  }

  return (
    <StateSection title="CHAT_THREAD / Default (with photo attach)">
      <View className="bg-white">
        {inner}
      </View>
    </StateSection>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
export default function ChatThreadStates() {
  return (
    <View>
      <ChatThreadDefault />
    </View>
  );
}
