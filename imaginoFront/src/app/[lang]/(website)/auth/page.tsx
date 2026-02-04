import { redirect } from "next/navigation";

export default async function AuthPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  redirect(`/${lang}/auth/login`);
}
