'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Database,
  Terminal,
  Layers,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  Server,
  Workflow,
  Plus,
  GitBranch,
  ExternalLink,
  ChevronRight,
  Info,
  Shield,
  Activity,
  HardDrive,
  Rocket,
} from 'lucide-react';
import { useToast } from '@/components/ui/toast';

export function DashboardOverview() {
  const router = useRouter();
  const { toast } = useToast();
  const [deployModalOpen, setDeployModalOpen] = useState(false);

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-200">
      {/* 1. What is my project? Top Project Identity & Simple Health Status */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-border-default">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-salt font-display">
              velora-core
            </h1>
            <span className="px-2 py-0.5 rounded text-xs font-mono font-medium bg-surface-raised border border-border-default text-neutral-300">
              production
            </span>
            <span className="px-2 py-0.5 rounded text-xs font-mono text-neutral-500 bg-surface-base border border-border-subtle">
              us-east-1 (iad1)
            </span>
            <span className="px-2 py-0.5 rounded text-[11px] font-mono text-amber-400/90 bg-amber-500/10 border border-amber-500/20">
              DEMO DATA VISIBLE
            </span>
          </div>
          <p className="text-xs text-neutral-400 mt-1.5">
            Application Operating System tenant · Database, Auth, Storage, and Realtime Engine.
          </p>
        </div>

        {/* Simple Health Status Badge */}
        <div className="flex items-center gap-3 self-start md:self-auto">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>All Systems Operational</span>
          </div>
          <Link
            href="/dashboard/observability"
            className="text-xs text-neutral-400 hover:text-salt flex items-center gap-1 transition-colors"
          >
            <span>Monitor</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* 2. What can I do next? Primary Actions Grid */}
      <div className="space-y-3">
        <h2 className="text-xs font-mono uppercase tracking-wider text-neutral-400">
          Primary Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* Action 1: Create Table */}
          <Link
            href="/dashboard/tables?action=new"
            className="p-4 rounded-xl border border-border-default bg-surface-raised hover:bg-surface-overlay hover:border-saffron/40 transition-all group flex flex-col justify-between"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="p-2 rounded-lg bg-surface-base border border-border-subtle text-saffron">
                <Database className="w-4 h-4" />
              </div>
              <Plus className="w-4 h-4 text-neutral-500 group-hover:text-saffron transition-colors" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-salt group-hover:text-white">
                Create Table
              </h3>
              <p className="text-xs text-neutral-400 mt-1">
                Define schema, column types, constraints, and RLS policies
              </p>
            </div>
          </Link>

          {/* Action 2: Query Studio */}
          <Link
            href="/dashboard/sql"
            className="p-4 rounded-xl border border-border-default bg-surface-raised hover:bg-surface-overlay hover:border-saffron/40 transition-all group flex flex-col justify-between"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="p-2 rounded-lg bg-surface-base border border-border-subtle text-emerald-400">
                <Terminal className="w-4 h-4" />
              </div>
              <ArrowRight className="w-4 h-4 text-neutral-500 group-hover:text-emerald-400 transition-colors" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-salt group-hover:text-white">
                Query Studio
              </h3>
              <p className="text-xs text-neutral-400 mt-1">
                Execute SQL queries, analyze query plans, and export results
              </p>
            </div>
          </Link>

          {/* Action 3: Build Workflow */}
          <Link
            href="/dashboard/workflows"
            className="p-4 rounded-xl border border-border-default bg-surface-raised hover:bg-surface-overlay hover:border-saffron/40 transition-all group flex flex-col justify-between"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="p-2 rounded-lg bg-surface-base border border-border-subtle text-sky-400">
                <Workflow className="w-4 h-4" />
              </div>
              <ArrowRight className="w-4 h-4 text-neutral-500 group-hover:text-sky-400 transition-colors" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-salt group-hover:text-white">
                Automate Workflow
              </h3>
              <p className="text-xs text-neutral-400 mt-1">
                Build event-triggered logic, webhooks, and background queues
              </p>
            </div>
          </Link>

          {/* Action 4: Deploy Preview */}
          <button
            type="button"
            onClick={() => {
              setDeployModalOpen(true);
              toast('Deploy preview environment initialized for branch main', 'info');
            }}
            className="p-4 rounded-xl border border-border-default bg-surface-raised hover:bg-surface-overlay hover:border-saffron/40 transition-all group flex flex-col justify-between text-left"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="p-2 rounded-lg bg-surface-base border border-border-subtle text-purple-400">
                <Rocket className="w-4 h-4" />
              </div>
              <GitBranch className="w-4 h-4 text-neutral-500 group-hover:text-purple-400 transition-colors" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-salt group-hover:text-white">
                Deploy Preview
              </h3>
              <p className="text-xs text-neutral-400 mt-1">
                Spin up ephemeral isolated staging branch with zero downtime
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* 3. Summaries: Data Summary & Application Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Data Summary */}
        <div className="p-5 rounded-xl bg-surface-raised border border-border-default space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-saffron" />
              <h3 className="text-sm font-semibold text-salt">Data Summary</h3>
            </div>
            <Link
              href="/dashboard/tables"
              className="text-xs text-saffron hover:underline font-medium"
            >
              View Tables →
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-surface-base border border-border-subtle">
              <div className="text-[11px] text-neutral-400">Total Tables</div>
              <div className="text-xl font-bold font-mono text-salt mt-0.5">4</div>
              <div className="text-[10px] text-neutral-500 mt-1">users, orgs, docs, logs</div>
            </div>
            <div className="p-3 rounded-lg bg-surface-base border border-border-subtle">
              <div className="text-[11px] text-neutral-400">Total Records</div>
              <div className="text-xl font-bold font-mono text-salt mt-0.5">1,330,471</div>
              <div className="text-[10px] text-neutral-500 mt-1">Across all partitions</div>
            </div>
            <div className="p-3 rounded-lg bg-surface-base border border-border-subtle">
              <div className="text-[11px] text-neutral-400">RLS Security Policies</div>
              <div className="text-xl font-bold font-mono text-emerald-400 mt-0.5">9 Active</div>
              <div className="text-[10px] text-neutral-500 mt-1">100% tables protected</div>
            </div>
            <div className="p-3 rounded-lg bg-surface-base border border-border-subtle">
              <div className="text-[11px] text-neutral-400">Storage Buckets</div>
              <div className="text-xl font-bold font-mono text-salt mt-0.5">2 Buckets</div>
              <div className="text-[10px] text-neutral-500 mt-1">avatars, exports (S3)</div>
            </div>
          </div>
        </div>

        {/* Application Summary */}
        <div className="p-5 rounded-xl bg-surface-raised border border-border-default space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-sky-400" />
              <h3 className="text-sm font-semibold text-salt">Application Summary</h3>
            </div>
            <Link
              href="/dashboard/functions"
              className="text-xs text-sky-400 hover:underline font-medium"
            >
              View Functions →
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-surface-base border border-border-subtle">
              <div className="text-[11px] text-neutral-400">Edge Functions</div>
              <div className="text-xl font-bold font-mono text-salt mt-0.5">3 Active</div>
              <div className="text-[10px] text-neutral-500 mt-1">WASM runtime (0 cold start)</div>
            </div>
            <div className="p-3 rounded-lg bg-surface-base border border-border-subtle">
              <div className="text-[11px] text-neutral-400">API Gateway Endpoints</div>
              <div className="text-xl font-bold font-mono text-salt mt-0.5">14 Routes</div>
              <div className="text-[10px] text-neutral-500 mt-1">REST & GraphQL unified</div>
            </div>
            <div className="p-3 rounded-lg bg-surface-base border border-border-subtle">
              <div className="text-[11px] text-neutral-400">Event Queues</div>
              <div className="text-xl font-bold font-mono text-salt mt-0.5">2 Running</div>
              <div className="text-[10px] text-neutral-500 mt-1">emails, thumbnail-gen</div>
            </div>
            <div className="p-3 rounded-lg bg-surface-base border border-border-subtle">
              <div className="text-[11px] text-neutral-400">AI Embeddings Engine</div>
              <div className="text-xl font-bold font-mono text-purple-400 mt-0.5">pgvector 17</div>
              <div className="text-[10px] text-neutral-500 mt-1">HNSW indexing active</div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Recent Activity & 5. Helpful Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity (Left 2 cols) */}
        <div className="lg:col-span-2 p-5 rounded-xl bg-surface-raised border border-border-default space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-neutral-400" />
              <h3 className="text-sm font-semibold text-salt">Recent Activity</h3>
            </div>
            <span className="text-[11px] font-mono text-neutral-500">Realtime Event Log</span>
          </div>

          <div className="space-y-2.5">
            <div className="p-3 rounded-lg bg-surface-base border border-border-subtle flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
                <div>
                  <div className="text-xs font-medium text-salt">
                    Schema migration <code className="text-neutral-400 font-mono text-[11px]">20261001_users_v2</code> executed
                  </div>
                  <div className="text-[10px] text-neutral-500 mt-0.5">Applied to table public.users by console</div>
                </div>
              </div>
              <span className="text-[10px] font-mono text-neutral-500">14m ago</span>
            </div>

            <div className="p-3 rounded-lg bg-surface-base border border-border-subtle flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-sky-400" />
                <div>
                  <div className="text-xs font-medium text-salt">
                    Edge function <code className="text-neutral-400 font-mono text-[11px]">process-webhook</code> deployed to 180 PoPs
                  </div>
                  <div className="text-[10px] text-neutral-500 mt-0.5">Version v1.4.2 active</div>
                </div>
              </div>
              <span className="text-[10px] font-mono text-neutral-500">2h ago</span>
            </div>

            <div className="p-3 rounded-lg bg-surface-base border border-border-subtle flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-amber-400" />
                <div>
                  <div className="text-xs font-medium text-salt">
                    Automated backup snapshot verified (94.2 MB)
                  </div>
                  <div className="text-[10px] text-neutral-500 mt-0.5">Checksum validated · Point-in-time recovery active</div>
                </div>
              </div>
              <span className="text-[10px] font-mono text-neutral-500">4h ago</span>
            </div>

            <div className="p-3 rounded-lg bg-surface-base border border-border-subtle flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-purple-400" />
                <div>
                  <div className="text-xs font-medium text-salt">
                    Row Level Security policy created on <code className="text-neutral-400 font-mono text-[11px]">public.documents</code>
                  </div>
                  <div className="text-[10px] text-neutral-500 mt-0.5">Enforces tenant isolation by org_id</div>
                </div>
              </div>
              <span className="text-[10px] font-mono text-neutral-500">Yesterday</span>
            </div>
          </div>
        </div>

        {/* Helpful Recommendations (Right 1 col) */}
        <div className="p-5 rounded-xl bg-surface-raised border border-border-default space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-saffron" />
            <h3 className="text-sm font-semibold text-salt">Helpful Recommendations</h3>
          </div>

          <div className="space-y-3">
            <div className="p-3.5 rounded-lg bg-surface-base border border-border-subtle space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-salt">Enforce Multi-Factor Auth</span>
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400">Security</span>
              </div>
              <p className="text-[11px] text-neutral-400 leading-relaxed">
                Protect administrative access by requiring TOTP or hardware passkeys for team members.
              </p>
              <Link
                href="/dashboard/auth"
                className="inline-flex items-center gap-1 text-[11px] text-saffron hover:underline font-medium pt-1"
              >
                Configure MFA →
              </Link>
            </div>

            <div className="p-3.5 rounded-lg bg-surface-base border border-border-subtle space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-salt">Custom Production Domain</span>
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-sky-500/10 text-sky-400">Domain</span>
              </div>
              <p className="text-[11px] text-neutral-400 leading-relaxed">
                Connect your custom apex domain (e.g. <code className="text-neutral-300">api.yourbrand.com</code>) with automated SSL.
              </p>
              <Link
                href="/dashboard/settings"
                className="inline-flex items-center gap-1 text-[11px] text-sky-400 hover:underline font-medium pt-1"
              >
                Add Custom Domain →
              </Link>
            </div>

            <div className="p-3.5 rounded-lg bg-surface-base border border-border-subtle space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-salt">Performance Diagnostics</span>
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400">Diagnostics</span>
              </div>
              <p className="text-[11px] text-neutral-400 leading-relaxed">
                Deep dive into connection pools, p95 read latency, and vector search indexing.
              </p>
              <Link
                href="/dashboard/observability?tab=performance"
                className="inline-flex items-center gap-1 text-[11px] text-emerald-400 hover:underline font-medium pt-1"
              >
                Open Performance Tab →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Deploy Preview Modal */}
      {deployModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="max-w-md w-full rounded-xl bg-surface-raised border border-border-default p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-md bg-purple-500/10 text-purple-400">
                  <Rocket className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-salt">Deploy Preview Environment</h3>
              </div>
              <button
                type="button"
                onClick={() => setDeployModalOpen(false)}
                className="text-neutral-400 hover:text-salt text-sm"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-neutral-400">
              Create an isolated container preview branch with cloned database schemas and an ephemeral preview URL.
            </p>
            <div className="p-3 rounded-lg bg-surface-base border border-border-subtle space-y-1 text-xs font-mono">
              <div className="text-neutral-400">Branch: <span className="text-salt">main</span></div>
              <div className="text-neutral-400">Preview Host: <span className="text-purple-400">velora-preview-pr14.velora.app</span></div>
              <div className="text-neutral-400">Database Clone: <span className="text-emerald-400">Copy-on-write active</span></div>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeployModalOpen(false)}
                className="px-3 py-1.5 rounded-lg border border-border-default text-xs text-neutral-400 hover:text-salt"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setDeployModalOpen(false);
                  toast('Preview environment deployment triggered! Generating ephemeral build...', 'success');
                }}
                className="px-4 py-1.5 rounded-lg bg-saffron text-basalt font-semibold text-xs hover:bg-saffron-hover"
              >
                Launch Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
