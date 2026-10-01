'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Zap,
  Database,
  Shield,
  Radio,
  ArrowRight,
} from 'lucide-react';

/**
 * Hero section with an interactive request tracer.
 * User types or picks a request, clicks Run, watches the
 * traced timing breakdown across VELORA's subsystems.
 *
 * Spec: "hero that is a real interactive demo (type a request,
 * watch the traced timing breakdown)"
 */

interface TraceSpan {
  name: string;
  service: string;
  icon: React.ReactNode;
  duration: number;
  color: string;
}

const EXAMPLE_QUERIES = [
  'SELECT * FROM users WHERE tier = \'enterprise\'',
  'INSERT INTO orders (user_id, total) VALUES (42, 199.99)',
  'CREATE POLICY read_own ON users FOR SELECT USING (auth.uid() = id)',
];

const TRACE_SPANS: TraceSpan[] = [
  {
    name: 'Edge gateway',
    service: 'gateway',
    icon: <Zap className="w-3.5 h-3.5" />,
    duration: 0.2,
    color: 'var(--color-saffron)',
  },
  {
    name: 'Auth / policies',
    service: 'identity',
    icon: <Shield className="w-3.5 h-3.5" />,
    duration: 0.4,
    color: 'var(--color-moss)',
  },
  {
    name: 'PostgreSQL query',
    service: 'database',
    icon: <Database className="w-3.5 h-3.5" />,
    duration: 1.2,
    color: 'var(--color-saffron)',
  },
  {
    name: 'Realtime fan-out',
    service: 'realtime',
    icon: <Radio className="w-3.5 h-3.5" />,
    duration: 0.3,
    color: '#6E6E68',
  },
];

export function HeroSection() {
  const [query, setQuery] = useState(EXAMPLE_QUERIES[0] ?? '');
  const [isTracing, setIsTracing] = useState(false);
  const [activeSpan, setActiveSpan] = useState(-1);
  const [traceComplete, setTraceComplete] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const totalDuration = TRACE_SPANS.reduce(
    (sum, s) => sum + s.duration,
    0,
  );

  const clearTimers = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  useEffect(() => () => clearTimers(), [clearTimers]);

  const runTrace = useCallback(() => {
    if (isTracing) return;
    setIsTracing(true);
    setTraceComplete(false);
    setActiveSpan(0);

    let spanIndex = 0;
    const advanceSpan = () => {
      spanIndex++;
      if (spanIndex < TRACE_SPANS.length) {
        setActiveSpan(spanIndex);
        const span = TRACE_SPANS[spanIndex];
        if (span) {
          timerRef.current = setTimeout(advanceSpan, span.duration * 400);
        }
      } else {
        setTraceComplete(true);
        setIsTracing(false);
      }
    };

    const firstSpan = TRACE_SPANS[0];
    if (firstSpan) {
      timerRef.current = setTimeout(advanceSpan, firstSpan.duration * 400);
    }
  }, [isTracing]);

  return (
    <section className="relative pt-32 pb-24 overflow-hidden" id="hero">
      {/* Subtle radial glow — not a gradient wash, just depth */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(242, 169, 0, 0.06) 0%, transparent 70%)',
        }}
      />

      <div className="relative mx-auto max-w-7xl px-6">
        {/* Headline area */}
        <div className="max-w-3xl">
          <motion.h1
            className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight tracking-tight text-salt"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            Intent to production.
            <br />
            <span className="text-saffron">One platform.</span>
          </motion.h1>

          <motion.p
            className="mt-6 text-lg text-neutral-400 max-w-xl leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: 0.1,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            Database, auth, storage, realtime, queues, workflows, AI —
            managed or self-hosted. See every millisecond.
          </motion.p>

          <motion.div
            className="mt-8 flex items-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: 0.2,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <a
              href="/signup"
              className="inline-flex items-center gap-2 px-6 py-3 bg-saffron text-basalt font-semibold rounded-md hover:bg-saffron-hover active:bg-saffron-active transition-colors shadow-saffron-sm"
              style={{ transitionDuration: 'var(--duration-fast)' }}
            >
              Start building
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="/docs"
              className="inline-flex items-center gap-2 px-6 py-3 text-salt border border-border-subtle rounded-md hover:border-border-default hover:bg-surface-overlay/50 transition-colors"
              style={{ transitionDuration: 'var(--duration-fast)' }}
            >
              Read the docs
            </a>
          </motion.div>
        </div>

        {/* Interactive trace demo */}
        <motion.div
          className="mt-16 rounded-xl border border-border-subtle bg-surface-raised overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.6,
            delay: 0.3,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          {/* Query input bar */}
          <div className="flex items-center border-b border-border-subtle">
            <div className="flex-1 flex items-center">
              <span className="px-4 text-xs text-neutral-500 font-mono select-none">
                query
              </span>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 py-3.5 px-2 bg-transparent text-sm font-mono text-salt placeholder-neutral-500 focus:outline-none"
                placeholder="Type a SQL query or API request..."
                aria-label="Query to trace"
              />
            </div>
            <button
              onClick={runTrace}
              disabled={isTracing}
              className="flex items-center gap-2 px-5 py-3.5 text-sm font-semibold bg-saffron text-basalt hover:bg-saffron-hover active:bg-saffron-active disabled:opacity-50 transition-colors"
              style={{ transitionDuration: 'var(--duration-fast)' }}
            >
              <Play className="w-3.5 h-3.5" />
              Run trace
            </button>
          </div>

          {/* Query picker */}
          <div className="flex gap-2 px-4 py-2.5 border-b border-border-subtle overflow-x-auto">
            {EXAMPLE_QUERIES.map((q, i) => (
              <button
                key={i}
                onClick={() => {
                  setQuery(q);
                  setTraceComplete(false);
                  setActiveSpan(-1);
                }}
                className={`flex-shrink-0 px-3 py-1 rounded-md text-xs font-mono transition-colors ${
                  query === q
                    ? 'bg-saffron-subtle text-saffron border border-saffron/25'
                    : 'text-neutral-500 hover:text-neutral-300 border border-transparent'
                }`}
                style={{ transitionDuration: 'var(--duration-fast)' }}
              >
                {q.length > 50 ? q.slice(0, 50) + '…' : q}
              </button>
            ))}
          </div>

          {/* Trace waterfall */}
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs text-neutral-500 font-mono">
                Request trace waterfall
              </span>
              <AnimatePresence>
                {traceComplete && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono bg-moss-subtle text-moss"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-moss" />
                    {totalDuration.toFixed(1)}ms total
                  </motion.span>
                )}
              </AnimatePresence>
            </div>

            <div className="space-y-3">
              {TRACE_SPANS.map((span, i) => {
                const offset = TRACE_SPANS.slice(0, i).reduce(
                  (s, sp) => s + sp.duration,
                  0,
                );
                const widthPct = (span.duration / (totalDuration * 1.2)) * 100;
                const leftPct = (offset / (totalDuration * 1.2)) * 100;
                const isActive = i <= activeSpan;

                return (
                  <div key={i} className="flex items-center gap-4">
                    {/* Label */}
                    <div className="w-36 flex items-center gap-2 text-xs flex-shrink-0">
                      <span
                        className={`transition-colors ${
                          isActive ? 'text-salt' : 'text-neutral-600'
                        }`}
                        style={{
                          transitionDuration: 'var(--duration-fast)',
                        }}
                      >
                        {span.icon}
                      </span>
                      <span
                        className={`font-medium transition-colors ${
                          isActive ? 'text-salt' : 'text-neutral-600'
                        }`}
                        style={{
                          transitionDuration: 'var(--duration-fast)',
                        }}
                      >
                        {span.name}
                      </span>
                    </div>

                    {/* Bar */}
                    <div className="flex-1 relative h-7 bg-surface-base rounded-md overflow-hidden">
                      <motion.div
                        className="absolute top-0 bottom-0 rounded-md flex items-center justify-end pr-2"
                        style={{
                          left: `${leftPct}%`,
                          backgroundColor: isActive
                            ? span.color
                            : 'var(--color-neutral-700)',
                        }}
                        initial={{ width: 0 }}
                        animate={{
                          width: isActive ? `${widthPct}%` : 0,
                        }}
                        transition={{
                          duration: isActive
                            ? span.duration * 0.3
                            : 0,
                          ease: [0.16, 1, 0.3, 1],
                        }}
                      >
                        {isActive && (
                          <span className="text-[10px] font-mono font-semibold text-basalt whitespace-nowrap">
                            {span.duration}ms
                          </span>
                        )}
                      </motion.div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
