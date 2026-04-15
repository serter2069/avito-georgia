import { View, Text, TouchableOpacity, Platform } from 'react-native';
import type { PageEntry } from '../../constants/pageRegistry';

interface ProtoCardProps {
  page: PageEntry;
  onPress: () => void;
}

const navBadgeColors: Record<string, { bg: string; text: string }> = {
  none: { bg: 'rgba(156,163,175,0.2)', text: '#6B7280' },
  public: { bg: 'rgba(16,185,129,0.15)', text: '#059669' },
  auth: { bg: 'rgba(10,123,138,0.15)', text: '#0A7B8A' },
  client: { bg: 'rgba(10,123,138,0.15)', text: '#0A7B8A' },
  admin: { bg: 'rgba(239,68,68,0.15)', text: '#DC2626' },
};

export function ProtoCard({ page, onPress }: ProtoCardProps) {
  const isWeb = Platform.OS === 'web';
  const navColors = navBadgeColors[page.nav] || navBadgeColors.client;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={{
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#C8E0E8',
        borderRadius: 12,
        padding: 16,
        ...(isWeb ? {
          // @ts-ignore web-only
          cursor: 'pointer',
          transition: 'box-shadow 0.2s, transform 0.15s',
        } : {}),
      }}
      // @ts-ignore web hover via onMouseEnter/Leave
      onMouseEnter={isWeb ? (e: any) => {
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(10,123,138,0.15)';
        e.currentTarget.style.transform = 'translateY(-1px)';
      } : undefined}
      onMouseLeave={isWeb ? (e: any) => {
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.transform = 'translateY(0)';
      } : undefined}
    >
      {/* Top row: page id + nav badge */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <Text style={{ color: '#6A8898', fontSize: 11, fontWeight: '500' }}>{page.id}</Text>
        <View style={{
          backgroundColor: navColors.bg,
          paddingHorizontal: 8,
          paddingVertical: 2,
          borderRadius: 99,
        }}>
          <Text style={{ color: navColors.text, fontSize: 10, fontWeight: '600' }}>{page.nav}</Text>
        </View>
      </View>

      {/* Title */}
      <Text style={{ color: '#0A2840', fontSize: 15, fontWeight: '600', marginBottom: 4 }}>
        {page.title}
      </Text>

      {/* States count + notes indicator */}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <Text style={{ color: '#6A8898', fontSize: 12 }}>
          {page.stateCount} states
        </Text>
        {page.notes && page.notes.length > 0 && (
          <Text style={{ color: '#9CA3AF', fontSize: 11 }}>
            {page.notes.length} note{page.notes.length > 1 ? 's' : ''}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}
