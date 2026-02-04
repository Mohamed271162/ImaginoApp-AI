import { VerifyEmailForResetForm } from "@/components/auth/VerifyEmailForResetForm/VerifyEmailForResetForm";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "IMAGINO - Verify Account",
};

export default function VerifyAccountPage() {
  return <VerifyEmailForResetForm />;
}
