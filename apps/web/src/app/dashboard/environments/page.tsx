'use client';

import { useState } from 'react';
import {
  GitBranch,
  Plus,
  CheckCircle2,
  ExternalLink,
  Layers,
  ArrowRight,
  Database,
  RefreshCw,
} from 'lucide-react';

interface Environment {
  id: string;
  name: string;
  branch: string;
  isProd: boolean;
  region: string;
  schemaDiff: string;
  lastDeployed: string;
}

const mockEnvs: Environment[] = [
  { id: 'env-1', name: 'production', branch: 'main', isProd: true, region: 'iad1 (us-east)', schemaDiff: 'Up to date', lastDeployed: '12 mins ago' },
  { id: 'env-2', name: 'staging-v2.4', branch: 'release/v2.4', isProd: false, region: 'iad1 (us-east)', schemaDiff: '1 migration pending', lastDeployed: '1 hour ago' },
  { id: 'env-3', name: 'feat-vector-search', branch: 'feat/pgvector-hnsw', isProd: false, region: 'sfo1 (us-west)', schemaDiff: 'Branch snapshot isolated', lastDeployed: '3 hours ago' },
];

export default function EnvironmentsPage() {
  const [envs, setEnvs] = useState<Environment[]>(mockEnvs);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-white font-display">
              Environments & Database Branching
            </h1>
            <span className="inline-flex items-center gap-1 text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              <GitBranch className="w-3.5 h-3.5" />
              Copy-on-Write Instant Clones
            </span>
          </div>
          <p className="text-sm text-white/50 mt-1">
            Zero-storage ephemeral database branches created per Git pull request in under 500ms.
          </p>
        </div>

        <button
          onClick={() => alert('New branch environment wizard')}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-saffron text-basalt font-semibold text-xs hover:bg-saffron/90 self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Branch</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {envs.map((env) => (
          <div key={env.id} className="p-5 rounded-xl bg-surface border border-white/[0.08] space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="font-mono text-sm font-bold text-white">{env.name}</span>
              </div>
              {env.isProd ? (
                <span className="text-[10px] font-mono text-saffron bg-saffron/10 px-1.5 py-0.5 rounded font-bold">
                  PRODUCTION
                </span>
              ) : (
                <span className="text-[10px] font-mono text-white/40 bg-white/[0.06] px-1.5 py-0.5 rounded">
                  EPHEMERAL
                </span>
              )}
            </div>

            <div className="space-y-1 text-xs font-mono text-white/60">
              <div>Git Branch: <span className="text-white font-medium">{env.branch}</span></div>
              <div>Region: <span className="text-white">{env.region}</span></div>
              <div>Schema Status: <span className="text-emerald-400">{env.schemaDiff}</span></div>
              <div>Deployed: <span className="text-white/40">{env.lastDeployed}</span></div>
            </div>

            <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between">
              <button
                onClick={() => alert(`Connecting to branch ${env.name}`)}
                className="text-xs font-mono text-saffron hover:underline"
              >
                Connect String →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
