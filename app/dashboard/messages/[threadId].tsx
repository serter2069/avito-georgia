import ChatThreadStates from '../../../components/proto/states/ChatThreadStates';
import { AppShell } from '../../../components/layout/AppShell';

export default function ChatThreadPage() {
  return (
    <AppShell showBottomNav={false} showBack scrollable={false}>
      <ChatThreadStates />
    </AppShell>
  );
}
