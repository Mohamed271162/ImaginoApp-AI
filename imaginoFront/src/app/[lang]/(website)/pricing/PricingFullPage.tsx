'use client';
import { useState } from 'react';
import PricingCard from './pricingCard';

const faqItems = [
  {
    q: 'Can I get a free trial?',
    a: 'We do not offer free trials at the moment. We have included more than 40 themes, including necklace and interiors, so you can try various backgrounds before subscribing.',
  },
  {
    q: 'Are there any discounts?',
    a: 'If you get the annual plan, you get ~2 months free (about 20% discount).',
  },
  {
    q: 'Can I use the photos for my business?',
    a: 'Yes — you own the photos you generate. See our terms for details.',
  },
  {
    q: 'Do you use my uploads and results for training?',
    a: 'No, uploaded images and generated images are not used to train our models.',
  },
  {
    q: 'What does the 90-day and unlimited storage mean?',
    a: 'We store generated images for 90 days for inactive users. Paid plans include unlimited storage.',
  },
];

export default function PricingFullPage() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [loadingPlan, setLoadingPlan] = useState<'basic' | 'pro' | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubscribe = async (plan: 'basic' | 'pro') => {
    setError(null);
    setLoadingPlan(plan);
    try {
      const res = await fetch('/api/pay-with-stripe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.message || 'Failed to create checkout session');
      }

      const checkoutUrl: string | undefined = data?.result?.checkoutSession?.url;
      if (!checkoutUrl) {
        throw new Error('Checkout URL not returned');
      }

      window.location.href = checkoutUrl;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unable to start checkout';
      setError(message);
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <section className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-6 tracking-tight">
          Get beautiful product photos in seconds
        </h2>

        <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-8">
          Choose a plan that fits your business — monthly or yearly billing available.
        </p>

        {/* Billing toggle */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex gap-1 rounded-full p-1 bg-[color:var(--muted)]/10 border border-[color:var(--border)]">
            <button
              className="px-4 py-2 rounded-full text-sm font-medium bg-card text-card-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)]"
              aria-pressed="true"
            >
              Monthly
            </button>
            <button
              className="px-4 py-2 rounded-full text-sm font-medium bg-card text-card-foreground opacity-95 hover:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)]"
              aria-pressed="false"
            >
              Yearly — 2+ months free
            </button>
          </div>
        </div>

        {/* Pricing grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <PricingCard
            title="Free"
            price="US$0"
            features={[
              '40 images every month',
              '1024×1024 images',
              '40+ background themes',
              '90-day storage for inactive users',
            ]}
            buttonText="Start Useing Free"
          />

          <PricingCard
            title="Basic"
            price="US$15"
            description="Billed $179 annually"
            features={[
              'Every feature in Free',
              '1,000 images every month',
              'Custom sizes up to 2048×2048',
              'Create custom backgrounds',
              'Use reference images',
              'Generate with multiple products',
              'Edit generated images',
              'Reuse backgrounds',
              'Bulk generate images',
              'Add logo or badge',
              'Unlimited storage',
            ]}
            buttonText="Subscribe Basic"
            onSubscribe={() => handleSubscribe('basic')}
            loading={loadingPlan === 'basic'}
            disabled={!!loadingPlan && loadingPlan !== 'basic'}
          />

          <PricingCard
            title="Pro"
            price="US$32"
            description="Billed $379 annually"
            highlight
            features={['Every feature in Basic', 'Unlimited images', 'Priority support']}
            buttonText="Subscribe Pro"
            onSubscribe={() => handleSubscribe('pro')}
            loading={loadingPlan === 'pro'}
            disabled={!!loadingPlan && loadingPlan !== 'pro'}
          />
        </div>

        {error && (
          <div className="mt-6 text-center text-sm text-red-600" role="alert">
            {error}
          </div>
        )}

        {/* FAQ */}
        <div className="max-w-4xl mx-auto mt-14 px-2">
          <h3 className="text-2xl md:text-3xl font-bold text-center mb-6">
            Frequently asked questions
          </h3>

          <div className="space-y-3">
            {faqItems.map((item, index) => {
              const open = openFAQ === index;
              return (
                <div
                  key={index}
                  className="rounded-xl transition hover:shadow-md px-3"
                  aria-expanded={open}
                >
                  <button
                    onClick={() => setOpenFAQ(open ? null : index)}
                    className="w-full flex justify-between items-center text-left text-lg font-medium py-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)] rounded-md"
                    aria-controls={`faq-${index}`}
                    aria-expanded={open}
                  >
                    <span className="text-foreground">{item.q}</span>
                    <span
                      className={`transition-transform duration-200 inline-block text-muted-foreground ${
                        open ? 'rotate-180' : ''
                      }`}
                      aria-hidden
                    >
                      ▾
                    </span>
                  </button>

                  {open && (
                    <div
                      id={`faq-${index}`}
                      className="mt-2 pr-2 text-sm text-[color:var(--muted-foreground)]"
                    >
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* CTA Banner */}
      <div
        className="relative w-full py-20 flex items-center justify-center"
        style={{
          backgroundImage: "url('/BackgroundIMG.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-[color:rgba(0,0,0,0.28)]"></div>
        <div className="relative text-center px-4">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Grow your business with AI
          </h1>
          <button className="inline-block bg-[color:var(--main-color)] hover:bg-[color:var(--main-hover-color)] text-black font-semibold px-6 py-3 rounded-lg transition focus-visible:ring-2 focus-visible:ring-[color:var(--ring)]">
            Try Imagino free
          </button>
        </div>
      </div>
    </section>
  );
}
