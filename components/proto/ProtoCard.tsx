import { View, Text, TouchableOpacity, Platform } from 'react-native';
import type { ProtoPage } from '../../constants/protoRegistry';

interface ProtoCardProps {
  page: ProtoPage;
  onPress: () => void;
}

const roleBadgeColors: Record<string, { bg: string; text: string }> = {
  PUBLIC: { bg: 'rgba(16,185,129,0.15)', text: '#059669' },
  USER: { bg: 'rgba(10,123,138,0.15)', text: '#0A7B8A' },
  ADMIN: { bg: 'rgba(239,68,68,0.15)', text: '#DC2626' },
};

export function ProtoCard({ page, onPress }: ProtoCardProps) {
  const isWeb = Platform.OS === 'web';

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
      {/* Top row: PAG-ID + role badges */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <Text style={{ color: '#6A8898', fontSize: 11, fontWeight: '500' }}>{page.pagId}</Text>
        <View style={{ flexDirection: 'row', gap: 4 }}>
          {page.roles.map((role) => {
            const colors = roleBadgeColors[role] || roleBadgeColors.USER;
            return (
              <View key={role} style={{
                backgroundColor: colors.bg,
                paddingHorizontal: 8,
                paddingVertical: 2,
                borderRadius: 99,
              }}>
                <Text style={{ color: colors.text, fontSize: 10, fontWeight: '600' }}>{role}</Text>
              </View>
            );
          })}
        </View>
      </View>

      {/* Title */}
      <Text style={{ color: '#0A2840', fontSize: 15, fontWeight: '600', marginBottom: 4 }}>
        {page.title}
      </Text>

      {/* States count */}
      <Text style={{ color: '#6A8898', fontSize: 12 }}>
        {page.states.length} states
      </Text>
    </TouchableOpacity>
  );
}
