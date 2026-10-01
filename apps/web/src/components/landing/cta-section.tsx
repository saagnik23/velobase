'use client';

import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export function CTASection() {
  return (
    <section className="py-32 relative overflow-hidden">
      {/* Subtle saffron radial — not a gradient wash */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 50% 100%, rgba(242, 169, 0, 0.04) 0%, transparent 60%)',
        }}
      />

      <div className="relative mx-auto max-w-7xl px-6 text-center">
        <motion.h2
          className="font-display text-4xl sm:text-5xl font-bold text-salt"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          Ship your next project
          <br />
          <span className="text-saffron">on VELORA</span>
        </motion.h2>

        <motion.p
          className="mt-6 text-lg text-neutral-400 max-w-lg mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.5,
            delay: 0.1,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          Free tier, no credit card. Features open, resources metered.
          Deploy managed or self-hosted.
        </motion.p>

        <motion.div
          className="mt-10 flex items-center justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.5,
            delay: 0.2,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          <a
            href="/signup"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-saffron text-basalt font-semibold rounded-md hover:bg-saffron-hover active:bg-saffron-active transition-colors shadow-saffron text-base"
            style={{ transitionDuration: 'var(--duration-fast)' }}
          >
            Start building
            <ArrowRight className="w-4 h-4" />
          </a>
          <a
            href="/docs"
            className="inline-flex items-center gap-2 px-8 py-3.5 text-salt border border-border-subtle rounded-md hover:border-border-default hover:bg-surface-overlay/50 transition-colors text-base"
            style={{ transitionDuration: 'var(--duration-fast)' }}
          >
            Documentation
          </a>
        </motion.div>
      </div>
    </section>
  );
}
