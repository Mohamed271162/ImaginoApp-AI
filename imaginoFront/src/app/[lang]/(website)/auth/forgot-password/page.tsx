import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm/ForgotPasswordForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "IMAGINO - Forget Password",
};

export default function ForgetPasswordPage() {
  return <ForgotPasswordForm />;
}
