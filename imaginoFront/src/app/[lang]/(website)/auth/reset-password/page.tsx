import { ResetPasswordForm } from '@/components/auth/ResetPasswordForm/ResetPasswordForm';
import { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'IMAGINO - Reset Password',
};
export default function ResetPasswordPage() {
  return <ResetPasswordForm />;
}
