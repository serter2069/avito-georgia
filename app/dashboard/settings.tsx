import SettingsStates from '../../components/proto/states/SettingsStates';
import { AppShell } from '../../components/layout/AppShell';

export default function SettingsPage() {
  return (
    <AppShell activeTab="profile">
      <SettingsStates showBottomNav={false} />
    </AppShell>
  );
}
