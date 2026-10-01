'use client';

import {
  Database,
  Shield,
  HardDrive,
  Radio,
  Workflow,
  Cpu,
  Search,
  Brain,
  Eye,
  DollarSign,
  RotateCcw,
  Ship,
} from 'lucide-react';
import { motion } from 'framer-motion';

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    icon: <Database className="w-5 h-5" />,
    title: 'Multi-model database',
    description:
      'PostgreSQL core with key-value, document, vector, time-series, and graph — one query language, one pool.',
  },
  {
    icon: <Shield className="w-5 h-5" />,
    title: 'Auth and policies',
    description:
      'Visual policy builder, one authorization engine across DB, API, storage, and workflows. SSO from day one.',
  },
  {
    icon: <HardDrive className="w-5 h-5" />,
    title: 'Storage',
    description:
      'S3-compatible with public/private clarity, exposure warnings, signed URLs, and CDN edge caching.',
  },
  {
    icon: <Radio className="w-5 h-5" />,
    title: 'Realtime engine',
    description:
      'One event bus feeding realtime, workflows, webhooks, analytics, and AI. p95 under 50ms in-region.',
  },
  {
    icon: <Workflow className="w-5 h-5" />,
    title: 'Workflows and queues',
    description:
      'DAG engine with human approval steps, retries, dead-letter, idempotency, and cron in plain English.',
  },
  {
    icon: <Cpu className="w-5 h-5" />,
    title: 'Functions',
    description:
      'Auto-route to function, worker, or container. No cold starts, no limits you didn\'t set.',
  },
  {
    icon: <Search className="w-5 h-5" />,
    title: 'Search and vectors',
    description:
      'Full-text and semantic search as first-class. pgvector for embeddings, hybrid ranking built in.',
  },
  {
    icon: <Brain className="w-5 h-5" />,
    title: 'AI gateway',
    description:
      'Multi-model routing with fallback, caching, budgets, and prompt-injection safety. Data is never a command.',
  },
  {
    icon: <Eye className="w-5 h-5" />,
    title: 'Observability',
    description:
      'One trace per request. Logs with business context. Automatic root-cause, N+1 detection, index advisor.',
  },
  {
    icon: <DollarSign className="w-5 h-5" />,
    title: 'Cost engine',
    description:
      'Human-readable cost breakdown, forecast at 10× users, AI cost forecast. Features open, resources metered.',
  },
  {
    icon: <RotateCcw className="w-5 h-5" />,
    title: 'Backups and recovery',
    description:
      'Recovery center, scheduled restore tests, DR explanation, dependency-aware rollback.',
  },
  {
    icon: <Ship className="w-5 h-5" />,
    title: 'Deploy anywhere',
    description:
      'Managed, private cloud, or self-hosted from the same architecture. Export everything as one bundle.',
  },
];

export function FeaturesGrid() {
  return (
    <section className="py-24 relative" id="features">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-2xl mb-16">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-salt">
            Everything your app needs.
            <br />
            Nothing it doesn&apos;t.
          </h2>
          <p className="mt-4 text-neutral-400 text-lg">
            One platform replaces your toolchain. Unified secrets,
            integrations, permissions, logs, and billing.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border-subtle rounded-xl overflow-hidden">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              className="bg-surface-raised p-6 hover:bg-surface-overlay/50 transition-colors group"
              style={{ transitionDuration: 'var(--duration-normal)' }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{
                duration: 0.4,
                delay: i * 0.04,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <div className="w-9 h-9 rounded-md bg-saffron-subtle text-saffron flex items-center justify-center mb-4 group-hover:bg-saffron group-hover:text-basalt transition-colors"
                style={{ transitionDuration: 'var(--duration-normal)' }}
              >
                {feature.icon}
              </div>
              <h3 className="font-display font-semibold text-salt text-base mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-neutral-400 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
