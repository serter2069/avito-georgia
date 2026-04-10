import { View, Text, ScrollView, Platform, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { pageRegistry, pageGroups } from '../../constants/pageRegistry';
import { ProtoCard } from '../../components/proto/ProtoCard';

export default function ProtoIndex() {
  const router = useRouter();
  const { width } = useWindowDimensions();

  const isWeb = Platform.OS === 'web';
  const padding = isWeb ? 32 : 16;
  const gap = 12;
  const cols = isWeb
    ? width > 1280 ? 4 : width > 1024 ? 3 : width > 640 ? 2 : 1
    : 1;
  const contentWidth = width - padding * 2;
  const cardWidth = cols > 1 ? (contentWidth - (cols - 1) * gap) / cols : contentWidth;

  const totalStates = pageRegistry.reduce((s, p) => s + p.stateCount, 0);

  return (
    <View style={{ flex: 1, backgroundColor: '#E8F4F8' }}>
      {/* Header */}
      <View style={{ backgroundColor: '#0A7B8A', paddingHorizontal: padding, paddingVertical: 20 }}>
        <View style={{ flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between' }}>
          <Text style={{ color: '#fff', fontSize: 24, fontWeight: '700' }}>Proto Showcase</Text>
          <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14 }}>
            {pageRegistry.length} pages / {totalStates} states
          </Text>
        </View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 48, paddingHorizontal: padding, paddingTop: 24 }}
      >
        {pageGroups.map((group) => {
          const pages = pageRegistry.filter((p) => p.group === group);
          return (
            <View key={group} style={{ marginBottom: 32 }}>
              {/* Section header */}
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                <Text style={{
                  color: '#6A8898',
                  fontSize: 12,
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: 1.2,
                }}>
                  {group}
                </Text>
                <View style={{ flex: 1, height: 1, backgroundColor: '#C8E0E8', marginLeft: 12 }} />
                <Text style={{ color: '#6A8898', fontSize: 12, marginLeft: 8 }}>
                  {pages.length}
                </Text>
              </View>

              {/* Cards grid */}
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap }}>
                {pages.map((page) => (
                  <View key={page.id} style={{ width: cardWidth }}>
                    <ProtoCard
                      page={page}
                      onPress={() => router.push(`/proto/states/${page.id}` as any)}
                    />
                  </View>
                ))}
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}
