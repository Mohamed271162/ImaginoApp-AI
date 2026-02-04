import Link from 'next/link';

export default function PaymentSuccessPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-8 shadow-sm text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
          <svg
            aria-hidden="true"
            focusable="false"
            className="h-7 w-7"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </div>
        <h1 className="text-2xl font-semibold text-foreground">Payment successful</h1>
        <p className="mt-2 text-muted-foreground">
          Your payment was processed and your subscription is now active. You will receive a receipt
          by email.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted"
          >
            Go to dashboard
          </Link>
          <Link
            href="/en/upgrade"
            className="inline-flex items-center justify-center rounded-lg bg-main px-4 py-2.5 text-sm font-semibold text-black hover:bg-main/90"
          >
            Manage plan
          </Link>
        </div>
      </div>
    </main>
  );
}
