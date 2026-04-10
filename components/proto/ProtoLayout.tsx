import { View, Text, ScrollView, TouchableOpacity, Platform, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
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

export function ProtoLayout({ pagId, title, route, nav, children }: ProtoLayoutProps) {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isWeb = Platform.OS === 'web';

  const padding = isWeb ? 32 : 16;
  const gap = 16;
  const cols = isWeb
    ? width > 1280 ? 3 : width > 768 ? 2 : 1
    : 1;
  const contentWidth = width - padding * 2;
  const itemWidth = cols > 1 ? (contentWidth - (cols - 1) * gap) / cols : contentWidth;

  // Flatten children to extract StateSection elements for grid layout
  const childArray = flattenChildren(children);

  const showNav = nav && nav !== 'none';
  const isBottomNav = nav === 'client';
  const isAdminNav = nav === 'admin';

  const backBar = (
    <View style={{
      backgroundColor: '#fff',
      borderBottomWidth: 1,
      borderBottomColor: '#C8E0E8',
      paddingHorizontal: padding,
      paddingVertical: 12,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    }}>
      <TouchableOpacity onPress={() => router.push('/proto' as any)} activeOpacity={0.7}>
        <Ionicons name="arrow-back" size={22} color="#0A2840" />
      </TouchableOpacity>
      <View style={{ flex: 1 }}>
        <Text style={{ color: '#0A2840', fontSize: 16, fontWeight: '600' }}>
          {pagId} — {title}
        </Text>
        <Text style={{ color: '#6A8898', fontSize: 12, marginTop: 2 }}>{route}</Text>
      </View>
    </View>
  );

  const statesGrid = (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ paddingBottom: 48, paddingHorizontal: padding, paddingTop: 20 }}
    >
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap }}>
        {childArray.map((child, i) => (
          <View key={i} style={{ width: itemWidth }}>
            {child}
          </View>
        ))}
      </View>
    </ScrollView>
  );

  if (isAdminNav) {
    // Admin: sidebar on the left, content on the right
    return (
      <View style={{ flex: 1, backgroundColor: '#E8F4F8' }}>
        {showNav && <ProtoNav variant={nav!} />}
        {backBar}
        <View style={{ flex: 1, flexDirection: 'row' }}>
          {statesGrid}
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#E8F4F8' }}>
      {showNav && !isBottomNav && <ProtoNav variant={nav!} />}
      {backBar}
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
