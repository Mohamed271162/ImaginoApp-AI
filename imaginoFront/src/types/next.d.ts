declare module 'next/server' {
  interface RouteHandlerContext<
    P extends Record<string, string | string[] | undefined> = Record<
      string,
      string | string[] | undefined
    >
  > {
    params: P;
  }
}
