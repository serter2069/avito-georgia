import FavoritesStates from '../../components/proto/states/FavoritesStates';
import { AppShell } from '../../components/layout/AppShell';

export default function FavoritesPage() {
  return (
    <AppShell activeTab="profile" scrollable={false}>
      <FavoritesStates />
    </AppShell>
  );
}
