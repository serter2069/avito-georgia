import { useRouter } from 'expo-router';
import { useAuthStore } from '../../store/auth';
import AuthEmail from '../../components/screens/AuthEmail';

export default function AuthEmailPage() {
  const router = useRouter();
  const login = useAuthStore(s => s.login);

  // Mock: pressing "Получить код" goes to OTP screen
  // In real app this would send OTP to email
  return <AuthEmail onSubmit={() => router.push('/auth/otp' as any)} />;
}
