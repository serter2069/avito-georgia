import MapViewStates from '../../components/proto/states/MapViewStates';
import { AppShell } from '../../components/layout/AppShell';

export default function MapPage() {
  return (
    <AppShell showBottomNav={false} showBack scrollable={false}>
      <MapViewStates />
    </AppShell>
  );
}
