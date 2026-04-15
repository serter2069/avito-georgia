import MessagesListStates from '../../../components/proto/states/MessagesListStates';
import { AppShell } from '../../../components/layout/AppShell';

export default function MessagesPage() {
  return (
    <AppShell activeTab="messages">
      <MessagesListStates showHeader={false} showBottomNav={false} />
    </AppShell>
  );
}
