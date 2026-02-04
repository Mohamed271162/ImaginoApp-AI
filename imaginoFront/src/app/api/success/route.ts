export function GET(req: Request) {
  const target = new URL('/success', req.url);
  return Response.redirect(target);
}
