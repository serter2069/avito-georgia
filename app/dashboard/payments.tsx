import PaymentStates from '../../components/proto/states/PaymentStates';
import { AppShell } from '../../components/layout/AppShell';

export default function PaymentsPage() {
  return (
    <AppShell showBottomNav={false} showBack scrollable={true}>
      <PaymentStates />
    </AppShell>
  );
}
