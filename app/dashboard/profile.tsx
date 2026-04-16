import { useEffect } from 'react';
import Profile from '../../components/screens/Profile';
import { useAuthStore } from '../../store/auth';

export default function ProfilePage() {
  const { user, fetchMe } = useAuthStore();
  useEffect(() => { fetchMe(); }, []);
  return <Profile showBottomNav={false} user={user} />;
}
