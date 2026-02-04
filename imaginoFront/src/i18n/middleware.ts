import { languages, defaultLang } from "@/i18n/settings";

export function middleware(req: Request) {
  const url = new URL(req.url);
  const pathname = url.pathname;

  // Check if the URL already starts with a supported language
  const hasLang = languages.some((lng) => pathname.startsWith(`/${lng}`));

  if (!hasLang) {
    // redirect to default language
    url.pathname = `/${defaultLang}${pathname}`;
    return Response.redirect(url);
  }

  // continue the request
  return new Response(null, { status: 200 });
}
