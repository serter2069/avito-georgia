import MessagesListStates from '../../../components/proto/states/MessagesListStates';
import { AppShell } from '../../../components/layout/AppShell';

export default function MessagesPage() {
  return (
    <AppShell activeTab="messages" scrollable={false}>
      <MessagesListStates />
    </AppShell>
  );
}
