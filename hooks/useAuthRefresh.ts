import { useEffect, useRef } from 'react';
import { Platform, AppState, AppStateStatus } from 'react-native';
import { refreshTokens } from '../lib/api';

const PROACTIVE_INTERVAL_MS = 20 * 60 * 1000; // 20 minutes
const VISIBILITY_THRESHOLD_MS = 15 * 60 * 1000; // refresh on tab focus if >= 15 min elapsed

/**
 * Proactive token refresh hook — mounts at app root.
 * Level 2 of the three-tier refresh strategy from auth.md:
 *   Level 1: Reactive (401 interceptor in api.ts)
 *   Level 2: Proactive — this hook (every 20 min + on app/tab focus)
 *   Level 3: On app start (hydrate() in authStore.ts)
 */
export function useAuthRefresh() {
  const lastRefreshRef = useRef<number>(Date.now());

  useEffect(() => {
    // Interval: refresh every 20 minutes regardless of activity
    const interval = setInterval(async () => {
      await refreshTokens();
      lastRefreshRef.current = Date.now();
    }, PROACTIVE_INTERVAL_MS);

    if (Platform.OS === 'web') {
      // Web: refresh on tab visibility change if >= 15 min elapsed
      const onVisibility = async () => {
        if (
          document.visibilityState === 'visible' &&
          Date.now() - lastRefreshRef.current >= VISIBILITY_THRESHOLD_MS
        ) {
          await refreshTokens();
          lastRefreshRef.current = Date.now();
        }
      };
      document.addEventListener('visibilitychange', onVisibility);

      return () => {
        clearInterval(interval);
        document.removeEventListener('visibilitychange', onVisibility);
      };
    }

    // Native: refresh when app comes back to foreground after >= 15 min in background
    const subscription = AppState.addEventListener('change', async (state: AppStateStatus) => {
      if (
        state === 'active' &&
        Date.now() - lastRefreshRef.current >= VISIBILITY_THRESHOLD_MS
      ) {
        await refreshTokens();
        lastRefreshRef.current = Date.now();
      }
    });

    return () => {
      clearInterval(interval);
      subscription.remove();
    };
  }, []);
}
