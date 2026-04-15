import React from 'react';
import { View, ScrollView, useWindowDimensions } from 'react-native';
import { Header } from './Header';
import BottomNav from '../proto/BottomNav';

interface AppShellProps {
  children: React.ReactNode;
  activeTab?: 'home' | 'browse' | 'post' | 'messages' | 'profile';
  showBottomNav?: boolean;
  headerTitle?: string;
  showBack?: boolean;
  scrollable?: boolean;
}

export function AppShell({
  children,
  activeTab,
  showBottomNav = true,
  headerTitle,
  showBack = false,
  scrollable = true,
}: AppShellProps) {
  const { width } = useWindowDimensions();
  const isMobile = width < 640;

  return (
    <View style={{ flex: 1 }}>
      <Header title={headerTitle} showBack={showBack} />
      {scrollable ? (
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }}>
          {children}
        </ScrollView>
      ) : (
        <View style={{ flex: 1 }}>
          {children}
        </View>
      )}
      {showBottomNav && isMobile && <BottomNav active={activeTab} />}
    </View>
  );
}
