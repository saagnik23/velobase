'use client';

import { useState } from 'react';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <div className="space-y-6">
        <div className="w-12 h-12 rounded-lg bg-moss-subtle flex items-center justify-center">
          <svg className="w-6 h-6 text-moss" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>

        <div>
          <h1 className="font-display text-2xl font-bold text-salt">
            Check your email
          </h1>
          <p className="mt-2 text-sm text-neutral-400">
            We sent a password reset link to{' '}
            <span className="text-salt font-medium">{email}</span>.
            Click the link to set a new password.
          </p>
        </div>

        <div className="space-y-3">
          <button
            type="button"
            onClick={() => setSent(false)}
            className="w-full px-4 py-2.5 rounded-md border border-border-default text-sm text-neutral-300 hover:text-salt hover:border-border-strong transition-colors text-center"
            style={{ transitionDuration: 'var(--duration-fast)' }}
          >
            Try a different email
          </button>

          <Link
            href="/login"
            className="flex items-center justify-center gap-2 text-sm text-neutral-400 hover:text-salt transition-colors"
            style={{ transitionDuration: 'var(--duration-fast)' }}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to sign in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Mobile logo */}
      <div className="lg:hidden flex items-center gap-3 mb-4">
        <div className="w-8 h-8 rounded-md bg-saffron flex items-center justify-center shadow-saffron-sm">
          <svg width="18" height="18" viewBox="0 0 32 32" fill="none">
            <path
              d="M8 8L16 24L24 8"
              stroke="var(--color-basalt)"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <span className="font-display text-lg font-bold tracking-wide text-salt">
          VELORA
        </span>
      </div>

      <div>
        <h1 className="font-display text-2xl font-bold text-salt">
          Reset your password
        </h1>
        <p className="mt-2 text-sm text-neutral-400">
          Enter the email associated with your account and we&apos;ll send a reset link.
        </p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          setSent(true);
        }}
        className="space-y-4"
      >
        <div>
          <label htmlFor="reset-email" className="block text-sm font-medium text-neutral-300 mb-1.5">
            Email
          </label>
          <input
            id="reset-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2.5 rounded-md border border-border-default bg-surface-base text-sm text-salt placeholder-neutral-500 focus:outline-none focus:border-saffron focus:ring-1 focus:ring-saffron/40 transition-colors"
            style={{ transitionDuration: 'var(--duration-fast)' }}
            placeholder="you@company.com"
          />
        </div>

        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-saffron text-basalt font-semibold text-sm rounded-md hover:bg-saffron-hover active:bg-saffron-active transition-colors shadow-saffron-sm"
          style={{ transitionDuration: 'var(--duration-fast)' }}
        >
          Send reset link
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      <Link
        href="/login"
        className="flex items-center justify-center gap-2 text-sm text-neutral-400 hover:text-salt transition-colors"
        style={{ transitionDuration: 'var(--duration-fast)' }}
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to sign in
      </Link>
    </div>
  );
}
