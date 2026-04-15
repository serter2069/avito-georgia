import ProfileStates from '../../components/proto/states/ProfileStates';
import { AppShell } from '../../components/layout/AppShell';

export default function ProfilePage() {
  return (
    <AppShell activeTab="profile" scrollable={false}>
      <ProfileStates />
    </AppShell>
  );
}
