export function decodeJwtPayload<T = unknown>(token: string): T | null {
  try {
    const [, payload] = token.split('.');
    if (!payload) return null;

    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');

    let json: string;

    if (typeof window === 'undefined') {
      json = Buffer.from(padded, 'base64').toString('utf8');
    } else {
      const binary = atob(padded);
      json = decodeURIComponent(
        Array.from(binary)
          .map((c) => '%' + c.charCodeAt(0).toString(16).padStart(2, '0'))
          .join('')
      );
    }

    return JSON.parse(json) as T;
  } catch (err) {
    console.error('decodeJwtPayload error', err);
    return null;
  }
}
