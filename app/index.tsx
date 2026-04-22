import { useState, useCallback } from 'react';
import { ScrollView, RefreshControl, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Homepage from '../components/screens/Homepage';
import { colors } from '../lib/theme';

export default function IndexPage() {
  const [refreshing, setRefreshing] = useState(false);
  const [refreshFn, setRefreshFn] = useState<(() => Promise<void>) | null>(null);

  const handleRefreshStateChange = useCallback((isRefreshing: boolean, fn: () => Promise<void>) => {
    setRefreshing(isRefreshing);
    // Store the latest refresh function without triggering a refresh on state change
    setRefreshFn(() => fn);
  }, []);

  const onRefresh = useCallback(async () => {
    if (refreshFn) await refreshFn();
  }, [refreshFn]);

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1 }}>
      <ScrollView
        refreshControl={
          Platform.OS !== 'web' ? (
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.primary}
              colors={[colors.primary]}
            />
          ) : undefined
        }
      >
        <Homepage
          showHeader={false}
          showBottomNav={false}
          onRefreshStateChange={handleRefreshStateChange}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
