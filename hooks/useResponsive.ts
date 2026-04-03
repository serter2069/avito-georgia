import { useWindowDimensions, Platform } from 'react-native';

export type Breakpoint = 'mobile' | 'tablet' | 'desktop';

export function useResponsive() {
  const { width } = useWindowDimensions();

  const isWeb = Platform.OS === 'web';
  const breakpoint: Breakpoint = !isWeb || width < 768
    ? 'mobile'
    : width < 1024
      ? 'tablet'
      : 'desktop';

  const isMobile = breakpoint === 'mobile';
  const isTablet = breakpoint === 'tablet';
  const isDesktop = breakpoint === 'desktop';

  // Number of columns for listing grids
  const listingColumns = isDesktop ? 3 : isTablet ? 2 : 2;

  // Content max width (matches _layout.tsx)
  const maxWidth = isMobile ? 430 : isTablet ? 700 : 1200;

  // Sidebar width on desktop
  const sidebarWidth = isDesktop ? 280 : 0;

  return {
    width,
    breakpoint,
    isMobile,
    isTablet,
    isDesktop,
    listingColumns,
    maxWidth,
    sidebarWidth,
  };
}
