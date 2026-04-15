import React from 'react';
import { View, useWindowDimensions } from 'react-native';
import { Header } from './Header';
import BottomNav from '../proto/BottomNav';

interface AppShellProps {
  children: React.ReactNode;
  activeTab?: 'home' | 'browse' | 'post' | 'messages' | 'profile';
  showBottomNav?: boolean;
  headerProps?: {
    showSearch?: boolean;
  };
}

export function AppShell({
  children,
  activeTab,
  showBottomNav = true,
  headerProps,
}: AppShellProps) {
  const { width } = useWindowDimensions();
  const isMobile = width < 640;

  return (
    <View style={{ flex: 1 }}>
      <Header showSearch={headerProps?.showSearch} />
      {children}
      {isMobile && showBottomNav && <BottomNav active={activeTab} />}
    </View>
  );
}
