export function GET(req: Request) {
  const target = new URL('/canceled', req.url);
  return Response.redirect(target);
}
