import ListingDetailStates from '../../components/proto/states/ListingDetailStates';
import { AppShell } from '../../components/layout/AppShell';

export default function ListingDetailPage() {
  return (
    <AppShell showBottomNav={false} showBack scrollable={false}>
      <ListingDetailStates />
    </AppShell>
  );
}
