import ListingsFeedStates from '../../components/proto/states/ListingsFeedStates';
import { AppShell } from '../../components/layout/AppShell';

export default function ListingsPage() {
  return (
    <AppShell activeTab="browse">
      <ListingsFeedStates showHeader={false} showBottomNav={false} />
    </AppShell>
  );
}
