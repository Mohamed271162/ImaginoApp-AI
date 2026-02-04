import LoginForm from '@/components/auth/LoginForm/LoginForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'IMAGINO - Login',
  description: 'Welcome Back, Sign in to your account Now!',
};
type LoginPageProps = {
  searchParams?: Promise<{
    authExpired?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const authExpired = params?.authExpired === '1';
  return <LoginForm authExpired={authExpired} />;
}
