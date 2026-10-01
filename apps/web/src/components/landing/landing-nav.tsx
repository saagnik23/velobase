'use client';

import { useState, useEffect } from 'react';
import { Command, ChevronRight } from 'lucide-react';

export function LandingNav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all ${
        scrolled
          ? 'bg-basalt/90 backdrop-blur-xl border-b border-border-subtle'
          : 'bg-transparent'
      }`}
      style={{ transitionDuration: 'var(--duration-normal)' }}
    >
      <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <a href="/" className="flex items-center gap-3 group" aria-label="VELORA home">
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
        </a>

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-8">
          <a
            href="#features"
            className="text-sm text-neutral-400 hover:text-salt transition-colors"
            style={{ transitionDuration: 'var(--duration-fast)' }}
          >
            Features
          </a>
          <a
            href="#latency"
            className="text-sm text-neutral-400 hover:text-salt transition-colors"
            style={{ transitionDuration: 'var(--duration-fast)' }}
          >
            Performance
          </a>
          <a
            href="#architecture"
            className="text-sm text-neutral-400 hover:text-salt transition-colors"
            style={{ transitionDuration: 'var(--duration-fast)' }}
          >
            Architecture
          </a>
          <a
            href="/docs"
            className="text-sm text-neutral-400 hover:text-salt transition-colors"
            style={{ transitionDuration: 'var(--duration-fast)' }}
          >
            Docs
          </a>
          <a
            href="/pricing"
            className="text-sm text-neutral-400 hover:text-salt transition-colors"
            style={{ transitionDuration: 'var(--duration-fast)' }}
          >
            Pricing
          </a>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-md border border-border-subtle text-xs text-neutral-400 hover:text-salt hover:border-border-default transition-colors"
            style={{ transitionDuration: 'var(--duration-fast)' }}
            aria-label="Open command palette"
          >
            <Command className="w-3.5 h-3.5" />
            <span className="font-mono">⌘K</span>
          </button>
          <a
            href="/login"
            className="text-sm text-neutral-400 hover:text-salt transition-colors px-3 py-1.5"
            style={{ transitionDuration: 'var(--duration-fast)' }}
          >
            Sign in
          </a>
          <a
            href="/signup"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-saffron text-basalt text-sm font-semibold rounded-md hover:bg-saffron-hover active:bg-saffron-active transition-colors shadow-saffron-sm"
            style={{ transitionDuration: 'var(--duration-fast)' }}
          >
            Start building
            <ChevronRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </nav>
  );
}
