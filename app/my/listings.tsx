import { MyListingsInteractive } from '../../components/proto/states/MyListingsStates';
import { AppShell } from '../../components/layout/AppShell';

export default function MyListingsPage() {
  return <AppShell activeTab="profile"><MyListingsInteractive showBottomNav={false} /></AppShell>;
}
