import { redirect } from "next/navigation";

export default async function Home({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const param = await params;
  const lang = param.lang || "en";
  redirect(`/${lang}`);
}
