'use client';

import { useState } from 'react';
import { Eye, EyeOff, ArrowRight, Check, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/toast';

export default function SignupPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const passwordChecks = [
    { label: 'At least 8 characters', met: password.length >= 8 },
    { label: 'Contains a number', met: /\d/.test(password) },
    { label: 'Contains uppercase', met: /[A-Z]/.test(password) },
  ];

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
          Create your account
        </h1>
        <p className="mt-2 text-sm text-neutral-400">
          Already have an account?{' '}
          <Link
            href="/login"
            className="text-saffron hover:text-saffron-hover transition-colors font-medium"
            style={{ transitionDuration: 'var(--duration-fast)' }}
          >
            Sign in
          </Link>
        </p>
      </div>

      {/* SSO */}
      <div className="space-y-2.5">
        <button
          type="button"
          onClick={() => {
            setIsLoading(true);
            toast('Redirecting to Google OAuth...', 'info');
            setTimeout(() => router.push('/dashboard'), 800);
          }}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-md border border-border-default bg-surface-raised text-sm font-medium text-salt hover:bg-surface-overlay transition-colors disabled:opacity-50"
          style={{ transitionDuration: 'var(--duration-fast)' }}
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          Continue with Google
        </button>

        <button
          type="button"
          onClick={() => {
            setIsLoading(true);
            toast('Redirecting to GitHub OAuth...', 'info');
            setTimeout(() => router.push('/dashboard'), 800);
          }}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-md border border-border-default bg-surface-raised text-sm font-medium text-salt hover:bg-surface-overlay transition-colors disabled:opacity-50"
          style={{ transitionDuration: 'var(--duration-fast)' }}
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
          </svg>
          Continue with GitHub
        </button>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-border-subtle" />
        <span className="text-xs text-neutral-500">or</span>
        <div className="flex-1 h-px bg-border-subtle" />
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!name || !email || !password) return;
          setIsLoading(true);
          toast('Creating account...', 'info');
          setTimeout(() => {
            toast('Account created successfully', 'success');
            router.push('/dashboard');
          }, 800);
        }}
        className="space-y-4"
      >
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-neutral-300 mb-1.5">
            Full name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2.5 rounded-md border border-border-default bg-surface-base text-sm text-salt placeholder-neutral-500 focus:outline-none focus:border-saffron focus:ring-1 focus:ring-saffron/40 transition-colors"
            style={{ transitionDuration: 'var(--duration-fast)' }}
            placeholder="Jane Smith"
          />
        </div>

        <div>
          <label htmlFor="signup-email" className="block text-sm font-medium text-neutral-300 mb-1.5">
            Email
          </label>
          <input
            id="signup-email"
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

        <div>
          <label htmlFor="signup-password" className="block text-sm font-medium text-neutral-300 mb-1.5">
            Password
          </label>
          <div className="relative">
            <input
              id="signup-password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2.5 pr-10 rounded-md border border-border-default bg-surface-base text-sm text-salt placeholder-neutral-500 focus:outline-none focus:border-saffron focus:ring-1 focus:ring-saffron/40 transition-colors"
              style={{ transitionDuration: 'var(--duration-fast)' }}
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-salt transition-colors"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {/* Password strength indicators */}
          {password.length > 0 && (
            <div className="mt-2 space-y-1">
              {passwordChecks.map((check) => (
                <div key={check.label} className="flex items-center gap-2">
                  <div
                    className={`w-3.5 h-3.5 rounded-full flex items-center justify-center transition-colors ${
                      check.met ? 'bg-moss text-basalt' : 'bg-surface-overlay'
                    }`}
                  >
                    {check.met && <Check className="w-2.5 h-2.5" />}
                  </div>
                  <span
                    className={`text-xs transition-colors ${
                      check.met ? 'text-moss' : 'text-neutral-500'
                    }`}
                  >
                    {check.label}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-saffron text-basalt font-semibold text-sm rounded-md hover:bg-saffron-hover active:bg-saffron-active transition-colors shadow-saffron-sm disabled:opacity-50"
          style={{ transitionDuration: 'var(--duration-fast)' }}
        >
          {isLoading ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Creating...</>
          ) : (
            <>Create account <ArrowRight className="w-4 h-4" /></>
          )}
        </button>
      </form>

      <p className="text-xs text-neutral-500 text-center">
        By creating an account you agree to our{' '}
        <a href="/terms" className="text-neutral-400 hover:text-salt transition-colors underline">
          Terms
        </a>{' '}
        and{' '}
        <a href="/privacy" className="text-neutral-400 hover:text-salt transition-colors underline">
          Privacy policy
        </a>
        .
      </p>
    </div>
  );
}
