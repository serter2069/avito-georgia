import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, Pressable, Modal, useWindowDimensions } from 'react-native';
import { StateSection } from '../StateSection';
import BottomNav from '../BottomNav';
import ProtoImage from '../ProtoPlaceholderImage';

const C = {
  green: '#00AA6C',
  greenBg: '#E8F9F2',
  white: '#FFFFFF',
  text: '#1A1A1A',
  muted: '#9E9E9E',
  border: '#E8E8E8',
};

// Photo seeds pool — each "attached" photo gets a unique seed
const PHOTO_SEEDS = [101, 102, 103, 104, 105, 106, 107, 108];

type PhotoMsg = { seeds: number[] };

interface Message {
  id: number;
  text?: string;
  photos?: PhotoMsg;
  mine: boolean;
  time: string;
}

const INITIAL_MESSAGES: Message[] = [
  { id: 1, text: 'Здравствуйте, машина ещё продаётся?', mine: true,  time: '14:10' },
  { id: 2, text: 'Да, ещё продаётся. Что вас интересует?', mine: false, time: '14:12' },
  { id: 3, text: 'Можно посмотреть завтра? Я из Тбилиси.', mine: true,  time: '14:14' },
  { id: 4, text: 'Конечно, приходите в первой половине дня.', mine: false, time: '14:15' },
  // Photo message from other person (1 photo)
  { id: 5, photos: { seeds: [101] }, mine: false, time: '14:16' },
  { id: 6, text: 'Вот фото салона, всё в отличном состоянии.', mine: false, time: '14:16' },
  { id: 7, text: 'Отлично! А двигатель как?', mine: true, time: '14:17' },
  // Photo message from me (3 photos)
  { id: 8, photos: { seeds: [102, 103, 104] }, mine: true, time: '14:18' },
  { id: 9, text: 'Прислал фото из объявления', mine: true, time: '14:18' },
  { id: 10, text: 'Хорошо, жду вас около 11:00.', mine: false, time: '14:19' },
];

// ─── Photo grid inside bubble ────────────────────────────────────────────────
function PhotoGrid({ seeds, onPress }: { seeds: number[]; onPress: (idx: number) => void }) {
  if (seeds.length === 1) {
    return (
      <Pressable onPress={() => onPress(0)} style={{ borderRadius: 10, overflow: 'hidden', width: 200, height: 150 }}>
        <ProtoImage seed={seeds[0]} width={200} height={150} />
      </Pressable>
    );
  }
  if (seeds.length === 2) {
    return (
      <View style={{ flexDirection: 'row', gap: 3, borderRadius: 10, overflow: 'hidden' }}>
        {seeds.map((s, i) => (
          <Pressable key={i} onPress={() => onPress(i)} style={{ width: 120, height: 120, borderRadius: 8, overflow: 'hidden' }}>
            <ProtoImage seed={s} width={120} height={120} />
          </Pressable>
        ))}
      </View>
    );
  }
  // 3+: main + 2 side
  return (
    <View style={{ flexDirection: 'row', gap: 3, borderRadius: 10, overflow: 'hidden', maxWidth: 240 }}>
      <Pressable onPress={() => onPress(0)} style={{ width: 155, height: 155, borderRadius: 8, overflow: 'hidden' }}>
        <ProtoImage seed={seeds[0]} width={155} height={155} />
      </Pressable>
      <View style={{ gap: 3 }}>
        {seeds.slice(1, 3).map((s, i) => (
          <Pressable key={i} onPress={() => onPress(i + 1)} style={{ width: 78, height: 75, borderRadius: 6, overflow: 'hidden', position: 'relative' }}>
            <ProtoImage seed={s} width={78} height={75} />
            {/* +N overlay on last tile if more photos */}
            {i === 1 && seeds.length > 3 && (
              <View style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ color: '#fff', fontWeight: '700', fontSize: 16 }}>+{seeds.length - 3}</Text>
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
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.93)', alignItems: 'center', justifyContent: 'center' }}>
        {/* Close */}
        <Pressable onPress={onClose} style={{ position: 'absolute', top: 20, right: 20, zIndex: 10, width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: '#fff', fontSize: 22 }}>×</Text>
        </Pressable>

        {/* Counter */}
        {seeds.length > 1 && (
          <View style={{ position: 'absolute', top: 28, left: 0, right: 0, alignItems: 'center' }}>
            <Text style={{ color: '#fff', fontSize: 14, fontWeight: '600' }}>{idx + 1} / {seeds.length}</Text>
          </View>
        )}

        {/* Image */}
        <View style={{ width: Math.min(width - 40, 700), aspectRatio: 4/3, borderRadius: 10, overflow: 'hidden' }}>
          <ProtoImage seed={seeds[idx]} width="100%" height={400} />
        </View>

        {/* Arrows */}
        {idx > 0 && (
          <Pressable onPress={() => setIdx(idx - 1)} style={{ position: 'absolute', left: 12, top: '50%', transform: [{ translateY: -24 }], width: 48, height: 48, borderRadius: 24, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: '#fff', fontSize: 26 }}>‹</Text>
          </Pressable>
        )}
        {idx < seeds.length - 1 && (
          <Pressable onPress={() => setIdx(idx + 1)} style={{ position: 'absolute', right: 12, top: '50%', transform: [{ translateY: -24 }], width: 48, height: 48, borderRadius: 24, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: '#fff', fontSize: 26 }}>›</Text>
          </Pressable>
        )}

        {/* Thumbnails */}
        {seeds.length > 1 && (
          <View style={{ position: 'absolute', bottom: 20, flexDirection: 'row', gap: 8 }}>
            {seeds.map((s, i) => (
              <Pressable key={i} onPress={() => setIdx(i)} style={{ width: 48, height: 36, borderRadius: 5, overflow: 'hidden', borderWidth: 2, borderColor: i === idx ? C.green : 'rgba(255,255,255,0.25)' }}>
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

  const bubbleStyle = msg.mine
    ? { backgroundColor: C.greenBg, borderRadius: 14, borderBottomRightRadius: 4 }
    : { backgroundColor: C.white, borderRadius: 14, borderBottomLeftRadius: 4, borderWidth: 1, borderColor: C.border };

  const content = (
    <View>
      {hasPhotos && (
        <View style={{ marginBottom: hasText ? 6 : 0 }}>
          <PhotoGrid
            seeds={msg.photos!.seeds}
            onPress={(idx) => onPhotoPress(msg.photos!.seeds, idx)}
          />
        </View>
      )}
      {hasText && (
        <View style={[bubbleStyle, { paddingHorizontal: 12, paddingVertical: 8, maxWidth: 260 }]}>
          <Text style={{ fontSize: 14, color: C.text, lineHeight: 20 }}>{msg.text}</Text>
        </View>
      )}
      {hasPhotos && !hasText && null}
    </View>
  );

  if (msg.mine) {
    return (
      <View style={{ alignItems: 'flex-end', paddingHorizontal: 16, marginBottom: 6 }}>
        {content}
        <Text style={{ fontSize: 10, color: C.muted, marginTop: 3 }}>{msg.time} ✓✓</Text>
      </View>
    );
  }
  return (
    <View style={{ alignItems: 'flex-start', paddingHorizontal: 16, marginBottom: 6 }}>
      {content}
      <Text style={{ fontSize: 10, color: C.muted, marginTop: 3 }}>{msg.time}</Text>
    </View>
  );
}

// ─── Photo attachment preview strip ──────────────────────────────────────────
function AttachPreview({ seeds, onRemove }: { seeds: number[]; onRemove: (i: number) => void }) {
  if (seeds.length === 0) return null;
  return (
    <View style={{ flexDirection: 'row', gap: 6, paddingHorizontal: 12, paddingTop: 8, flexWrap: 'wrap' }}>
      {seeds.map((s, i) => (
        <View key={i} style={{ position: 'relative' }}>
          <View style={{ width: 56, height: 56, borderRadius: 8, overflow: 'hidden', borderWidth: 1, borderColor: C.border }}>
            <ProtoImage seed={s} width={56} height={56} />
          </View>
          <Pressable
            onPress={() => onRemove(i)}
            style={{ position: 'absolute', top: -6, right: -6, width: 18, height: 18, borderRadius: 9, backgroundColor: '#333', alignItems: 'center', justifyContent: 'center' }}
          >
            <Text style={{ color: '#fff', fontSize: 10, lineHeight: 11 }}>×</Text>
          </Pressable>
        </View>
      ))}
    </View>
  );
}

// ─── Paperclip (camera) icon drawn with Views ─────────────────────────────────
function CameraIcon({ color }: { color: string }) {
  return (
    <View style={{ width: 22, height: 18, position: 'relative', alignItems: 'center', justifyContent: 'center' }}>
      {/* Body */}
      <View style={{ position: 'absolute', bottom: 0, width: 22, height: 13, borderRadius: 4, borderWidth: 2, borderColor: color }} />
      {/* Lens */}
      <View style={{ position: 'absolute', bottom: 2, width: 8, height: 8, borderRadius: 4, borderWidth: 2, borderColor: color }} />
      {/* Bump top */}
      <View style={{ position: 'absolute', top: 0, left: 6, width: 7, height: 5, borderTopLeftRadius: 3, borderTopRightRadius: 3, borderWidth: 2, borderColor: color, borderBottomWidth: 0 }} />
    </View>
  );
}

// ─── Interactive Chat ─────────────────────────────────────────────────────────
function InteractiveChat() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [attachSeeds, setAttachSeeds] = useState<number[]>([]);
  const [lightbox, setLightbox] = useState<{ seeds: number[]; idx: number } | null>(null);

  let nextSeed = PHOTO_SEEDS.length + 10;

  function addPhoto() {
    // Simulate attaching: pick next seed from pool
    const pool = [105, 106, 107, 108, 109, 110, 111, 112];
    const used = attachSeeds.length % pool.length;
    setAttachSeeds(prev => [...prev, pool[used + prev.length % (pool.length - used)] ?? pool[0]]);
  }

  function removeAttach(i: number) {
    setAttachSeeds(prev => prev.filter((_, idx) => idx !== i));
  }

  function sendMessage() {
    const text = input.trim();
    if (!text && attachSeeds.length === 0) return;
    const now = new Date();
    const time = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;
    const newMsg: Message = { id: Date.now(), mine: true, time };
    if (attachSeeds.length > 0) newMsg.photos = { seeds: [...attachSeeds] };
    if (text) newMsg.text = text;
    setMessages(prev => [...prev, newMsg]);
    setInput('');
    setAttachSeeds([]);
  }

  return (
    <View style={{ flex: 1, backgroundColor: C.white }}>
      <ScrollView contentContainerStyle={{ paddingTop: 12, paddingBottom: 8 }} showsVerticalScrollIndicator={false}>
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
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 8, borderTopWidth: 1, borderTopColor: C.border, backgroundColor: C.white, gap: 8 }}>
        {/* Camera button */}
        <Pressable
          onPress={addPhoto}
          style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: '#F0F0F0', alignItems: 'center', justifyContent: 'center' }}
        >
          <CameraIcon color={C.muted} />
        </Pressable>

        {/* Text input */}
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: C.border, borderRadius: 20, paddingHorizontal: 14 }}>
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Написать..."
            placeholderTextColor={C.muted}
            style={{ flex: 1, fontSize: 15, color: C.text, paddingVertical: 10, borderWidth: 0, backgroundColor: 'transparent', outlineWidth: 0 } as any}
            onSubmitEditing={sendMessage}
            returnKeyType="send"
          />
        </View>

        {/* Send */}
        <Pressable
          onPress={sendMessage}
          style={{ width: 38, height: 38, borderRadius: 19, backgroundColor: (input.trim() || attachSeeds.length > 0) ? C.green : '#E0E0E0', alignItems: 'center', justifyContent: 'center' }}
        >
          <Text style={{ color: C.white, fontSize: 16, fontWeight: '700', marginLeft: 2 }}>›</Text>
        </Pressable>
      </View>

      {/* Lightbox */}
      {lightbox && (
        <PhotoLightbox seeds={lightbox.seeds} initialIdx={lightbox.idx} onClose={() => setLightbox(null)} />
      )}
    </View>
  );
}

// ─── Header ───────────────────────────────────────────────────────────────────
function Header() {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: C.border, backgroundColor: C.white, gap: 12 }}>
      <Pressable>
        <Text style={{ fontSize: 22, color: C.muted, lineHeight: 22 }}>{'<'}</Text>
      </Pressable>
      <View style={{ width: 38, height: 38, borderRadius: 19, backgroundColor: '#5B8DEF', alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: C.white, fontWeight: '700', fontSize: 15 }}>М</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 15, fontWeight: '600', color: C.text }}>Михаил</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <View style={{ width: 7, height: 7, borderRadius: 3.5, backgroundColor: C.green }} />
          <Text style={{ fontSize: 12, color: C.green }}>онлайн</Text>
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
    <View style={{ flex: 1, minHeight: 560 }}>
      <Header />
      <InteractiveChat />
      {!isDesktop && <BottomNav active="messages" />}
    </View>
  );

  if (isDesktop) {
    return (
      <StateSection title="CHAT_THREAD / Default (with photo attach)">
        <View style={{ maxWidth: 800, alignSelf: 'center', width: '100%', backgroundColor: C.white, borderRadius: 12, borderWidth: 1, borderColor: C.border, overflow: 'hidden' }}>
          {inner}
        </View>
      </StateSection>
    );
  }

  return (
    <StateSection title="CHAT_THREAD / Default (with photo attach)">
      <View style={{ backgroundColor: C.white }}>
        {inner}
      </View>
    </StateSection>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
export default function ChatThreadStates() {
  return (
    <View style={{ gap: 0 }}>
      <ChatThreadDefault />
    </View>
  );
}
