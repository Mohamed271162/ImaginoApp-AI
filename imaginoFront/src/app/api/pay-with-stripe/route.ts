// Using the Web Fetch API types for compatibility
import { getServerCookies } from '@/services/ServerCookies.service';
import { ACCESS_TOKEN_COOKIE_KEY } from '@/utils/Cookies.keys';
import { fetchApi } from '@/utils/fetchApi';

export async function POST(req: Request) {
  const { plan, userCoupon } = await req.json().catch(() => ({ plan: undefined }));

  if (!plan) {
    return new Response(JSON.stringify({ message: 'plan is required' }), {
      status: 400,
      headers: { 'content-type': 'application/json' },
    });
  }

  const token = await getServerCookies(ACCESS_TOKEN_COOKIE_KEY);
  if (!token) {
    return new Response(JSON.stringify({ message: 'unauthenticated' }), {
      status: 401,
      headers: { 'content-type': 'application/json' },
    });
  }

  try {
    const response = await fetchApi<unknown>('user/pay-with-stripe', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `hamada ${token}`,
      },
      body: JSON.stringify({ plan, userCoupon }),
      cache: 'no-cache',
    });

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    });
  } catch (error) {
    console.error('pay-with-stripe proxy error:', error);
    const status = (error as { status?: number })?.status || 500;
    return new Response(JSON.stringify({ message: 'Failed to create checkout session' }), {
      status,
      headers: { 'content-type': 'application/json' },
    });
  }
}
