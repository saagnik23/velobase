'use client';

import { motion } from 'framer-motion';
import {
  Layers,
  ArrowRight,
  Database,
  Shield,
  Zap,
  Radio,
  Brain,
  HardDrive,
  Eye,
} from 'lucide-react';

/**
 * Architecture section — shows the layered system architecture
 * from edge to database. Not a diagram image — rendered elements
 * the user can hover for details.
 */

interface ArchLayer {
  icon: React.ReactNode;
  name: string;
  tech: string;
  detail: string;
}

const layers: ArchLayer[] = [
  {
    icon: <Zap className="w-4 h-4" />,
    name: 'Edge gateway',
    tech: 'Go · rate limiting · routing',
    detail: 'Under 5ms overhead. Pooling, leak detection, read-replica routing.',
  },
  {
    icon: <Shield className="w-4 h-4" />,
    name: 'Auth and policies',
    tech: 'TypeScript · RLS · RBAC/ABAC',
    detail: 'One engine across DB, API, storage, workflows. Visual policy builder.',
  },
  {
    icon: <Layers className="w-4 h-4" />,
    name: 'Control plane',
    tech: 'Fastify · TypeScript',
    detail: 'Project lifecycle, environment isolation, secrets vault.',
  },
  {
    icon: <Database className="w-4 h-4" />,
    name: 'PostgreSQL core',
    tech: 'pgvector · pgBouncer · NATS',
    detail: 'Multi-model data. Relational, document, key-value, vector, time-series, graph.',
  },
  {
    icon: <Radio className="w-4 h-4" />,
    name: 'Event bus',
    tech: 'NATS JetStream',
    detail: 'Feeds realtime, workflows, webhooks, analytics, and AI subsystems.',
  },
  {
    icon: <HardDrive className="w-4 h-4" />,
    name: 'Object storage',
    tech: 'S3-compatible · MinIO',
    detail: 'Private by default. Signed URLs, CDN edge caching, exposure warnings.',
  },
  {
    icon: <Brain className="w-4 h-4" />,
    name: 'AI gateway',
    tech: 'Multi-model · fallback · caching',
    detail: 'Prompt-injection safe. Data is never a command. Budgets and cost forecast.',
  },
  {
    icon: <Eye className="w-4 h-4" />,
    name: 'Observability',
    tech: 'OpenTelemetry · end to end',
    detail: 'One trace per request. Logs, metrics, traces in one store.',
  },
];

export function ArchitectureSection() {
  return (
    <section className="py-24 bg-surface-raised" id="architecture">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-2xl mb-16">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-salt">
            Built to be understood
          </h2>
          <p className="mt-4 text-neutral-400 text-lg">
            Every layer is observable, replaceable, and runs the same
            whether managed, private cloud, or self-hosted.
          </p>
        </div>

        <div className="space-y-2">
          {layers.map((layer, i) => (
            <motion.div
              key={layer.name}
              className="group flex items-center gap-4 p-4 rounded-lg border border-transparent hover:border-border-subtle hover:bg-surface-overlay/30 transition-all cursor-default"
              style={{ transitionDuration: 'var(--duration-normal)' }}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.4,
                delay: i * 0.05,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <div className="w-9 h-9 rounded-md bg-saffron-muted text-saffron flex items-center justify-center flex-shrink-0 group-hover:bg-saffron group-hover:text-basalt transition-colors"
                style={{ transitionDuration: 'var(--duration-normal)' }}
              >
                {layer.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3">
                  <span className="font-display font-semibold text-salt text-sm">
                    {layer.name}
                  </span>
                  <span className="text-xs text-neutral-500 font-mono">
                    {layer.tech}
                  </span>
                </div>
                <p className="text-xs text-neutral-400 mt-0.5 group-hover:text-neutral-300 transition-colors"
                  style={{ transitionDuration: 'var(--duration-fast)' }}
                >
                  {layer.detail}
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-neutral-600 group-hover:text-saffron transition-colors opacity-0 group-hover:opacity-100"
                style={{ transitionDuration: 'var(--duration-normal)' }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
