import HomepageStates from '../components/proto/states/HomepageStates';
import { AppShell } from '../components/layout/AppShell';

export default function HomePage() {
  return (
    <AppShell activeTab="home" headerProps={{ showSearch: true }}>
      <HomepageStates showHeader={false} showBottomNav={false} />
    </AppShell>
  );
}
