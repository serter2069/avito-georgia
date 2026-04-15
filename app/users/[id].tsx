import SellerProfileStates from '../../components/proto/states/SellerProfileStates';
import { AppShell } from '../../components/layout/AppShell';

export default function SellerProfilePage() {
  return (
    <AppShell showBottomNav={false} showBack scrollable={false}>
      <SellerProfileStates />
    </AppShell>
  );
}
