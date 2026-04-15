import CreateListingStates from '../../components/proto/states/CreateListingStates';
import { AppShell } from '../../components/layout/AppShell';

export default function CreateListingPage() {
  return (
    <AppShell showBottomNav={false} showBack scrollable={true}>
      <CreateListingStates />
    </AppShell>
  );
}
