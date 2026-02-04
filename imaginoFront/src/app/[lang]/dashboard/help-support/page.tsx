'use client';

import { FormEvent, useState } from 'react';
import { Mail, MessageSquare, PhoneCall } from 'lucide-react';
import { toast } from 'sonner';

const categories = [
  'Billing',
  'Account & Login',
  'Image Generation',
  'Uploads & Storage',
  'Bug Report',
  'Feature Request',
  'Other',
];

export default function HelpSupportPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState('Billing');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      toast.error('Please fill in name, email, and message.');
      return;
    }

    setSubmitting(true);
    try {
      // TODO: wire to real support endpoint
      await new Promise((res) => setTimeout(res, 700));
      toast.success('Thanks! We received your request and will reply soon.');
      setMessage('');
    } catch (err) {
      console.error('Failed to submit support request', err);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-6">
      <header className="rounded-2xl bg-gradient-to-r from-main/10 via-main/5 to-transparent p-6 border border-border">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Support</p>
            <h1 className="text-2xl font-semibold text-foreground">How can we help?</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Submit a ticket and our team will get back within 24 hours.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/70 dark:bg-card px-3 py-2 text-xs font-medium shadow-sm ring-1 ring-border">
              <PhoneCall className="h-4 w-4 text-main" /> Priority support for PRO
            </span>
          </div>
        </div>
      </header>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card/60 p-5 shadow-sm lg:col-span-1 space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Quick contacts</h2>
          <div className="space-y-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-3 rounded-xl surface-quiet p-3">
              <Mail className="h-4 w-4 text-main" /> support@imagino.ai
            </div>
            <div className="flex items-center gap-3 rounded-xl surface-quiet p-3">
              <PhoneCall className="h-4 w-4 text-main" /> +1 (555) 011-2233
            </div>
            <div className="flex items-center gap-3 rounded-xl surface-quiet p-3">
              <MessageSquare className="h-4 w-4 text-main" /> Live chat — weekdays 9am–6pm
            </div>
          </div>

          <div className="rounded-xl surface-quiet p-4 space-y-2">
            <div className="text-sm font-semibold text-foreground">Status</div>
            <p className="text-xs text-muted-foreground">All systems operational</p>
            <div className="mt-2 flex items-center gap-2 text-xs">
              <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              <span className="text-muted-foreground">Updated a few seconds ago</span>
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="lg:col-span-2 rounded-2xl border border-border bg-card/80 p-6 shadow-sm space-y-4"
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <label className="space-y-2 text-sm font-medium text-foreground">
              Full name
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground shadow-sm focus:border-main focus:ring-2 focus:ring-main/30"
                placeholder="Your name"
              />
            </label>

            <label className="space-y-2 text-sm font-medium text-foreground">
              Email
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground shadow-sm focus:border-main focus:ring-2 focus:ring-main/30"
                placeholder="you@example.com"
              />
            </label>
          </div>

          <label className="space-y-2 text-sm font-medium text-foreground">
            Category
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground shadow-sm focus:border-main focus:ring-2 focus:ring-main/30"
            >
              {categories.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2 text-sm font-medium text-foreground">
            Message
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={6}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground shadow-sm focus:border-main focus:ring-2 focus:ring-main/30"
              placeholder="Tell us what you need help with..."
            />
          </label>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-muted-foreground">
              Our team replies within 1 business day. Attach screenshots or links in your message if
              needed.
            </p>
            <button type="submit" className="primary-btn" disabled={submitting}>
              {submitting ? 'Sending…' : 'Submit request'}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
