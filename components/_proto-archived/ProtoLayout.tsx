import { View, ScrollView, Platform, useWindowDimensions } from 'react-native';
import React, { Children, isValidElement } from 'react';
import type { ReactNode } from 'react';
import type { NavVariant } from '../../constants/pageRegistry';
import { ProtoNav } from './ProtoNav';

interface ProtoLayoutProps {
  pagId: string;
  title: string;
  route: string;
  nav?: NavVariant;
  children: ReactNode;
}

/** Shared constraint: max content width for PC layout */
export const PC_MAX_WIDTH = 960;

export function ProtoLayout({ pagId, title, route, nav, children }: ProtoLayoutProps) {
  const { width } = useWindowDimensions();
  const isWeb = Platform.OS === 'web';
  const isDesktop = width >= 768;

  const padding = isWeb ? (isDesktop ? 48 : 16) : 16;
  const gap = 16;

  // Single column — each StateSection is already full-width inside the max-width container
  const contentWidth = Math.min(width, PC_MAX_WIDTH + padding * 2) - padding * 2;
  const itemWidth = contentWidth;

  // Flatten children to extract StateSection elements for grid layout
  const childArray = flattenChildren(children);

  const showNav = nav && nav !== 'none';
  const isBottomNav = nav === 'client';
  const isAdminNav = nav === 'admin';

  const statesGrid = (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ paddingBottom: 48, paddingTop: 20, alignItems: 'center' }}
    >
      <View style={{ width: '100%', maxWidth: PC_MAX_WIDTH + padding * 2, paddingHorizontal: padding }}>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap }}>
          {childArray.map((child, i) => (
            <View key={i} style={{ width: itemWidth }}>
              {child}
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );

  if (isAdminNav) {
    // Admin: sidebar on the left, content on the right
    return (
      <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
        {showNav && <ProtoNav variant={nav!} />}
        <View style={{ flex: 1, flexDirection: 'row' }}>
          {statesGrid}
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      {showNav && !isBottomNav && <ProtoNav variant={nav!} />}
      {statesGrid}
      {showNav && isBottomNav && <ProtoNav variant={nav!} />}
    </View>
  );
}

/**
 * Recursively flatten React children to get individual StateSection elements.
 * State components wrap StateSections in a plain <View>, so we unwrap them.
 */
function flattenChildren(children: ReactNode): ReactNode[] {
  const result: ReactNode[] = [];
  Children.forEach(children, (child) => {
    if (!isValidElement(child)) return;
    // If it's a View wrapper (from state components), recurse into its children
    if (child.type === View) {
      const nested = (child.props as { children?: ReactNode }).children;
      if (nested) {
        result.push(...flattenChildren(nested));
      }
    } else {
      result.push(child);
    }
  });
  return result;
}
