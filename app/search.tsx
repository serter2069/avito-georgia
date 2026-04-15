import { SearchDefault } from '../components/proto/states/SearchStates';
import { AppShell } from '../components/layout/AppShell';

export default function SearchPage() {
  return <AppShell activeTab="browse"><SearchDefault /></AppShell>;
}
