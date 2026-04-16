import { useRouter } from 'expo-router';
import { useAuthStore } from '../../store/auth';
import AuthOtp from '../../components/screens/AuthOtp';

export default function AuthOtpPage() {
  const router = useRouter();
  const login = useAuthStore(s => s.login);

  // Mock: confirming OTP logs user in
  const handleConfirm = () => {
    login({ name: 'Гость', email: 'user@example.com', initial: 'Г' });
    router.replace('/' as any);
  };

  return <AuthOtp onConfirm={handleConfirm} />;
}
