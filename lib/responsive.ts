import { useWindowDimensions } from 'react-native';

export type Breakpoint = 'mobile' | 'tablet' | 'desktop';

export function useBreakpoint(): Breakpoint {
  const { width } = useWindowDimensions();
  if (width >= 1280) return 'desktop';
  if (width >= 768) return 'tablet';
  return 'mobile';
}

export function getColumns(breakpoint: Breakpoint): number {
  switch (breakpoint) {
    case 'desktop': return 4;
    case 'tablet': return 3;
    case 'mobile': return 2;
  }
}

export function isDesktop(breakpoint: Breakpoint): boolean {
  return breakpoint === 'desktop';
}

export function isMobile(breakpoint: Breakpoint): boolean {
  return breakpoint === 'mobile';
}
