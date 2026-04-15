import { SettingsDefault } from '../../components/proto/states/SettingsStates';
import { AppShell } from '../../components/layout/AppShell';

export default function SettingsPage() {
  return <AppShell activeTab="profile"><SettingsDefault showBottomNav={false} /></AppShell>;
}
