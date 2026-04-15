import OnboardingStates from '../components/proto/states/OnboardingStates';
import { AppShell } from '../components/layout/AppShell';

export default function OnboardingPage() {
  return (
    <AppShell showBottomNav={false} scrollable={true}>
      <OnboardingStates />
    </AppShell>
  );
}
