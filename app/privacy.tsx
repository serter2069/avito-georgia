import LegalStates from '../components/proto/states/LegalStates';
import { AppShell } from '../components/layout/AppShell';

export default function PrivacyPage() {
  return (
    <AppShell showBottomNav={false} showBack scrollable={false}>
      <LegalStates />
    </AppShell>
  );
}
