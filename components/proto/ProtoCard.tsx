import { View, Text, TouchableOpacity } from 'react-native';
import type { ProtoPage } from '../../constants/protoRegistry';

interface ProtoCardProps {
  page: ProtoPage;
  onPress: () => void;
}

const roleBadgeColors: Record<string, string> = {
  PUBLIC: 'bg-success/20',
  USER: 'bg-primary/20',
  ADMIN: 'bg-error/20',
};

const roleTextColors: Record<string, string> = {
  PUBLIC: 'text-success',
  USER: 'text-primary',
  ADMIN: 'text-error',
};

export function ProtoCard({ page, onPress }: ProtoCardProps) {
  return (
    <TouchableOpacity
      className="bg-white border border-border rounded-lg p-4 mb-3"
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View className="flex-row items-center justify-between mb-2">
        <Text className="text-text-muted text-xs font-medium">{page.pagId}</Text>
        <View className="flex-row gap-1">
          {page.roles.map((role) => (
            <View key={role} className={`${roleBadgeColors[role] || 'bg-primary/20'} px-2 py-0.5 rounded-full`}>
              <Text className={`${roleTextColors[role] || 'text-primary'} text-[10px] font-medium`}>{role}</Text>
            </View>
          ))}
        </View>
      </View>
      <Text className="text-text-primary text-base font-semibold mb-1">{page.title}</Text>
      <Text className="text-text-muted text-xs">{page.states.length} states</Text>
    </TouchableOpacity>
  );
}
