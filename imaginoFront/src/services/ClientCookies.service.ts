export function setCookie(key: string, value: string, days = 7) {
  if (typeof document === 'undefined') return;

  const maxAge = days * 24 * 60 * 60;

  document.cookie =
    `${encodeURIComponent(key)}=${encodeURIComponent(value)}` +
    `; path=/` +
    `; max-age=${maxAge}` +
    `; samesite=lax` +
    (location.protocol === 'https:' ? '; secure' : '');
}

export function getCookie(key: string): string | null {
  if (typeof document === 'undefined') return null;

  const match = document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${encodeURIComponent(key)}=`));

  if (!match) return null;

  return decodeURIComponent(match.split('=')[1] || '');
}

export function removeCookie(key: string) {
  if (typeof document === 'undefined') return;

  document.cookie =
    `${encodeURIComponent(key)}=; path=/; max-age=0; samesite=lax` +
    (location.protocol === 'https:' ? '; secure' : '');
}
