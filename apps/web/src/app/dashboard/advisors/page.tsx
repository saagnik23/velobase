'use client';

import { useState } from 'react';
import {
  Lightbulb,
  Sparkles,
  Zap,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

interface Recommendation {
  id: string;
  category: 'Performance' | 'Security' | 'Cost';
  title: string;
  impact: string;
  description: string;
  actionLabel: string;
  actionCode: string;
}

const mockRecommendations: Recommendation[] = [
  {
    id: 'rec-1',
    category: 'Performance',
    title: 'Missing Composite Index on documents',
    impact: 'Reduces p95 query latency by 86% (4.2ms → 0.4ms)',
    description: '142,000 queries matched against (org_id, created_at) executed a sequential scan over 1.2M rows.',
    actionLabel: 'Apply Index Concurrently',
    actionCode: 'CREATE INDEX CONCURRENTLY idx_docs_org_created ON documents(org_id, created_at DESC);',
  },
  {
    id: 'rec-2',
    category: 'Security',
    title: 'Overly permissive RLS policy on storage_buckets',
    impact: 'Hardens multi-tenant isolation against IDOR vulnerabilities',
    description: 'Bucket policies currently allow unauthenticated metadata queries from public IPs.',
    actionLabel: 'Restrict Policy to Authenticated Roles',
    actionCode: 'ALTER POLICY "public_bucket_read" ON storage_buckets TO authenticated;',
  },
  {
    id: 'rec-3',
    category: 'Cost',
    title: 'Uncompressed JSONB fields in audit_logs',
    impact: 'Reduces NVMe storage footprint by 4.2 GB ($0.63 / mo)',
    description: 'Applying TOAST compression with zstd algorithm reduces table physical page consumption.',
    actionLabel: 'Enable Zstandard Column Compression',
    actionCode: 'ALTER TABLE audit_logs ALTER COLUMN metadata SET COMPRESSION zstd;',
  },
];

export default function AdvisorsPage() {
  const [appliedIds, setAppliedIds] = useState<string[]>([]);

  const handleApply = (id: string, code: string) => {
    alert(`Applied advisory migration:\n${code}`);
    setAppliedIds([...appliedIds, id]);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-white font-display">
              Copilot & Performance Advisors
            </h1>
            <span className="inline-flex items-center gap-1 text-xs font-mono text-saffron bg-saffron/10 px-2 py-0.5 rounded border border-saffron/20">
              <Sparkles className="w-3.5 h-3.5" />
              Continuous Heuristic Analysis
            </span>
          </div>
          <p className="text-sm text-white/50 mt-1">
            Automated recommendations for query indexing, security hardening, and storage efficiency.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {mockRecommendations.map((rec) => {
          const isApplied = appliedIds.includes(rec.id);
          return (
            <div
              key={rec.id}
              className={`p-5 rounded-xl border transition-all ${
                isApplied
                  ? 'bg-surface/40 border-white/[0.04] opacity-60'
                  : 'bg-surface border-white/[0.08] hover:border-white/[0.16]'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase font-bold ${
                      rec.category === 'Performance'
                        ? 'bg-saffron/10 text-saffron'
                        : rec.category === 'Security'
                        ? 'bg-rose-500/10 text-rose-400'
                        : 'bg-emerald-500/10 text-emerald-400'
                    }`}
                  >
                    {rec.category}
                  </span>
                  <h3 className="text-sm font-semibold text-white">{rec.title}</h3>
                </div>

                <span className="text-xs font-mono text-emerald-400">{rec.impact}</span>
              </div>

              <p className="text-xs text-white/60 mt-2 leading-relaxed">{rec.description}</p>

              <pre className="mt-3 p-2.5 rounded bg-basalt border border-white/[0.06] text-[11px] font-mono text-saffron overflow-x-auto">
                <code>{rec.actionCode}</code>
              </pre>

              <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between">
                <span className="text-[11px] font-mono text-white/40">
                  Zero downtime DDL execution
                </span>

                <button
                  disabled={isApplied}
                  onClick={() => handleApply(rec.id, rec.actionCode)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    isApplied
                      ? 'bg-white/[0.06] text-white/40 cursor-not-allowed'
                      : 'bg-saffron text-basalt hover:bg-saffron/90'
                  }`}
                >
                  {isApplied ? 'Applied' : rec.actionLabel}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
