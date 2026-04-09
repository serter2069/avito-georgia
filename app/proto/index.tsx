import { View, Text, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { protoPages, protoGroups } from '../../constants/protoRegistry';
import { ProtoCard } from '../../components/proto/ProtoCard';

export default function ProtoIndex() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-surface" style={{ maxWidth: 430 }}>
      <View className="bg-primary px-4 py-6">
        <Text className="text-white text-2xl font-bold">Proto Showcase</Text>
        <Text className="text-white/80 text-sm mt-1">
          {protoPages.length} pages / {protoPages.reduce((s, p) => s + p.states.length, 0)} states
        </Text>
      </View>
      <ScrollView className="flex-1 px-4 pt-4" contentContainerStyle={{ paddingBottom: 48 }}>
        {protoGroups.map((group) => {
          const pages = protoPages.filter((p) => p.group === group);
          return (
            <View key={group} className="mb-6">
              <Text className="text-text-secondary text-sm font-semibold mb-2 uppercase tracking-wide">
                {group}
              </Text>
              {pages.map((page) => (
                <ProtoCard
                  key={page.id}
                  page={page}
                  onPress={() => router.push(`/proto/states/${page.id}` as any)}
                />
              ))}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}
