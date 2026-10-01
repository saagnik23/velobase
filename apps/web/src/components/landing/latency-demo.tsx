'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Activity, Gauge } from 'lucide-react';

/**
 * Live latency demo — shows VELORA's performance budgets
 * as animated counters that the user can see ticking.
 */

interface LatencyMetric {
  label: string;
  value: number;
  unit: string;
  budget: number;
  budgetLabel: string;
}

const metrics: LatencyMetric[] = [
  {
    label: 'API p95 read',
    value: 12,
    unit: 'ms',
    budget: 100,
    budgetLabel: '< 100ms',
  },
  {
    label: 'API p95 write',
    value: 34,
    unit: 'ms',
    budget: 200,
    budgetLabel: '< 200ms',
  },
  {
    label: 'Gateway overhead',
    value: 0.8,
    unit: 'ms',
    budget: 5,
    budgetLabel: '< 5ms',
  },
  {
    label: 'Realtime delivery',
    value: 8,
    unit: 'ms',
    budget: 50,
    budgetLabel: '< 50ms p95',
  },
  {
    label: 'Landing LCP',
    value: 0.9,
    unit: 's',
    budget: 1.5,
    budgetLabel: '< 1.5s',
  },
  {
    label: 'Route change',
    value: 42,
    unit: 'ms',
    budget: 100,
    budgetLabel: '< 100ms',
  },
];

function AnimatedCounter({
  target,
  unit,
  inView,
}: {
  target: number;
  unit: string;
  inView: boolean;
}) {
  const [count, setCount] = useState(0);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    if (!inView) return;

    const duration = 1200;
    const start = performance.now();

    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(target * eased);
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      }
    };

    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, [target, inView]);

  const displayValue = target < 10 ? count.toFixed(1) : Math.round(count);

  return (
    <span className="font-mono text-3xl font-bold text-salt tabular-nums">
      {displayValue}
      <span className="text-lg text-neutral-500 ml-1">{unit}</span>
    </span>
  );
}

export function LatencyDemo() {
  const [inView, setInView] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-24" id="latency">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex items-center gap-3 mb-4">
          <Gauge className="w-5 h-5 text-saffron" />
          <span className="text-sm font-semibold text-saffron font-mono">
            Performance budgets
          </span>
        </div>
        <h2 className="font-display text-3xl sm:text-4xl font-bold text-salt mb-4">
          Speed is a feature
        </h2>
        <p className="text-neutral-400 text-lg mb-12 max-w-xl">
          Latency budgets are tests, not goals. A release that misses
          budget doesn&apos;t ship.
        </p>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-px bg-border-subtle rounded-xl overflow-hidden">
          {metrics.map((metric, i) => (
            <motion.div
              key={metric.label}
              className="bg-surface-raised p-6"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <div className="text-xs text-neutral-500 mb-3 uppercase tracking-wider">
                {metric.label}
              </div>
              <AnimatedCounter
                target={metric.value}
                unit={metric.unit}
                inView={inView}
              />
              <div className="mt-3 flex items-center gap-2">
                <div className="flex-1 h-1 rounded-full bg-surface-active overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-moss"
                    initial={{ width: 0 }}
                    animate={
                      inView
                        ? {
                            width: `${(metric.value / metric.budget) * 100}%`,
                          }
                        : {}
                    }
                    transition={{ duration: 1, delay: 0.3 + i * 0.05 }}
                  />
                </div>
                <span className="text-[10px] font-mono text-moss">
                  {metric.budgetLabel}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-6 flex items-center gap-2 text-xs text-neutral-500">
          <Activity className="w-3.5 h-3.5" />
          <span>
            Measured with k6 against a warm instance in us-east-1.
            CI enforces a 10% regression threshold.
          </span>
        </div>
      </div>
    </section>
  );
}
