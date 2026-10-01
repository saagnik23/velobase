'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/toast';
import {
  Database,
  Terminal,
  Activity,
  Cpu,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  Zap,
  TrendingDown,
  Sparkles,
  Server,
  HardDrive,
  GitBranch,
  RefreshCw,
  Play,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ChevronRight,
  Plus,
} from 'lucide-react';

type SystemMode = 'developer' | 'beginner' | 'infrastructure';

export function DashboardOverview() {
  const router = useRouter();
  const { toast } = useToast();
  const [activeMode, setActiveMode] = useState<SystemMode>('developer');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [latencyValue, setLatencyValue] = useState(1.18);

  const triggerRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setLatencyValue(Number((1.1 + Math.random() * 0.15).toFixed(2)));
      setIsRefreshing(false);
    }, 400);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Top Banner: Project Title + Mode Switcher + Live Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-white font-display">
              System Overview
            </h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Healthy · Sub-2ms Active
            </span>
          </div>
          <p className="text-sm text-white/50 mt-1">
            Cluster <code className="text-xs font-mono text-saffron bg-saffron/10 px-1.5 py-0.5 rounded">velora-iad1-prod</code> running distributed PostgreSQL 17 + WASM Edge Workers.
          </p>
        </div>

        {/* Triple Mode Selector: Beginner, Developer, Infrastructure */}
        <div className="flex items-center p-1 rounded-lg bg-surface border border-white/[0.08] self-start sm:self-auto">
          <button
            onClick={() => setActiveMode('beginner')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              activeMode === 'beginner'
                ? 'bg-saffron text-basalt font-semibold shadow-sm'
                : 'text-white/60 hover:text-white'
            }`}
          >
            Beginner
          </button>
          <button
            onClick={() => setActiveMode('developer')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              activeMode === 'developer'
                ? 'bg-saffron text-basalt font-semibold shadow-sm'
                : 'text-white/60 hover:text-white'
            }`}
          >
            Developer (SQL)
          </button>
          <button
            onClick={() => setActiveMode('infrastructure')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              activeMode === 'infrastructure'
                ? 'bg-saffron text-basalt font-semibold shadow-sm'
                : 'text-white/60 hover:text-white'
            }`}
          >
            Infrastructure
          </button>
        </div>
      </div>

      {/* Latency Budget & Telemetry Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: p95 Read Latency */}
        <div className="p-4 rounded-xl bg-surface border border-white/[0.08] relative overflow-hidden group hover:border-white/[0.16] transition-all">
          <div className="flex items-center justify-between text-xs text-white/50 mb-2">
            <span className="font-mono">P95 READ LATENCY</span>
            <button
              onClick={triggerRefresh}
              className={`p-1 rounded hover:bg-white/[0.06] text-white/40 hover:text-saffron transition-transform ${
                isRefreshing ? 'animate-spin text-saffron' : ''
              }`}
              title="Refresh telemetry"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-mono font-bold text-white tracking-tight">
              {latencyValue}
            </span>
            <span className="text-xs font-mono text-white/40">ms</span>
            <span className="ml-auto inline-flex items-center text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
              <TrendingDown className="w-3 h-3 mr-0.5" />
              -14% vs budget (5ms)
            </span>
          </div>
          <div className="mt-3 w-full bg-white/[0.06] h-1.5 rounded-full overflow-hidden">
            <div className="bg-emerald-400 h-full rounded-full" style={{ width: '24%' }} />
          </div>
          <div className="mt-2 flex justify-between text-[10px] font-mono text-white/40">
            <span>Current: {latencyValue}ms</span>
            <span>Target: &lt;5.0ms</span>
          </div>
        </div>

        {/* Metric 2: Edge Cache Hit Ratio */}
        <div className="p-4 rounded-xl bg-surface border border-white/[0.08] hover:border-white/[0.16] transition-all">
          <div className="flex items-center justify-between text-xs text-white/50 mb-2">
            <span className="font-mono">EDGE CACHE HIT RATE</span>
            <Zap className="w-3.5 h-3.5 text-saffron" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-mono font-bold text-white tracking-tight">
              99.4%
            </span>
            <span className="ml-auto inline-flex items-center text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
              Optimal
            </span>
          </div>
          <div className="mt-3 w-full bg-white/[0.06] h-1.5 rounded-full overflow-hidden">
            <div className="bg-saffron h-full rounded-full" style={{ width: '99.4%' }} />
          </div>
          <div className="mt-2 flex justify-between text-[10px] font-mono text-white/40">
            <span>Hits: 2.41M / hr</span>
            <span>Misses: 14.5k</span>
          </div>
        </div>

        {/* Metric 3: Active DB Connections & Pool */}
        <div className="p-4 rounded-xl bg-surface border border-white/[0.08] hover:border-white/[0.16] transition-all">
          <div className="flex items-center justify-between text-xs text-white/50 mb-2">
            <span className="font-mono">CONNECTION POOL</span>
            <Database className="w-3.5 h-3.5 text-sky-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-mono font-bold text-white tracking-tight">
              18
            </span>
            <span className="text-xs font-mono text-white/40">/ 250 max</span>
            <span className="ml-auto inline-flex items-center text-[11px] font-mono text-sky-400 bg-sky-500/10 px-1.5 py-0.5 rounded">
              PgBouncer 2.1
            </span>
          </div>
          <div className="mt-3 w-full bg-white/[0.06] h-1.5 rounded-full overflow-hidden">
            <div className="bg-sky-400 h-full rounded-full" style={{ width: '7.2%' }} />
          </div>
          <div className="mt-2 flex justify-between text-[10px] font-mono text-white/40">
            <span>Queue wait: 0.04ms</span>
            <span>Client leases: 320</span>
          </div>
        </div>

        {/* Metric 4: AI Vector Search Latency */}
        <div className="p-4 rounded-xl bg-surface border border-white/[0.08] hover:border-white/[0.16] transition-all">
          <div className="flex items-center justify-between text-xs text-white/50 mb-2">
            <span className="font-mono">VECTOR ANN P99</span>
            <Cpu className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-mono font-bold text-white tracking-tight">
              3.4
            </span>
            <span className="text-xs font-mono text-white/40">ms</span>
            <span className="ml-auto inline-flex items-center text-[11px] font-mono text-purple-400 bg-purple-500/10 px-1.5 py-0.5 rounded">
              HNSW index
            </span>
          </div>
          <div className="mt-3 w-full bg-white/[0.06] h-1.5 rounded-full overflow-hidden">
            <div className="bg-purple-400 h-full rounded-full" style={{ width: '34%' }} />
          </div>
          <div className="mt-2 flex justify-between text-[10px] font-mono text-white/40">
            <span>1536-dim (text-embedding-3)</span>
            <span>1.2M vectors</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Architecture Topology + Copilot Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Mode-Specific View */}
        <div className="lg:col-span-2 space-y-6">
          {/* Developer Mode View: Tables & SQL snippets */}
          {activeMode === 'developer' && (
            <div className="p-5 rounded-xl bg-surface border border-white/[0.08] space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-semibold text-white">Database Tables & Schemas</h2>
                  <p className="text-xs text-white/50">PostgreSQL with Row Level Security enforced</p>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    href="/dashboard/tables"
                    className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-saffron text-basalt font-medium text-xs hover:bg-saffron/90 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>New Table</span>
                  </Link>
                  <Link
                    href="/dashboard/sql"
                    className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/[0.06] border border-white/[0.08] hover:bg-white/[0.1] text-xs font-mono text-white transition-colors"
                  >
                    <Terminal className="w-3.5 h-3.5 text-saffron" />
                    <span>SQL Editor</span>
                  </Link>
                </div>
              </div>

              {/* Table List */}
              <div className="overflow-x-auto rounded-lg border border-white/[0.06]">
                <table className="w-full text-left text-xs">
                  <thead className="bg-white/[0.02] border-b border-white/[0.06] text-white/40 font-mono">
                    <tr>
                      <th className="py-2.5 px-3">Table Name</th>
                      <th className="py-2.5 px-3">Columns</th>
                      <th className="py-2.5 px-3">RLS Status</th>
                      <th className="py-2.5 px-3">Row Count</th>
                      <th className="py-2.5 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.04]">
                    <tr className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-2.5 px-3 font-mono font-medium text-white flex items-center gap-2">
                        <Database className="w-3.5 h-3.5 text-saffron" />
                        <span>public.users</span>
                      </td>
                      <td className="py-2.5 px-3 text-white/70">12 cols (id, email, role, ...)</td>
                      <td className="py-2.5 px-3">
                        <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                          <ShieldCheck className="w-3 h-3" />
                          Enabled (4 policies)
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-mono text-white/70">48,219</td>
                      <td className="py-2.5 px-3 text-right">
                        <Link href="/dashboard/tables?table=users" className="text-saffron hover:underline font-mono">
                          Browse →
                        </Link>
                      </td>
                    </tr>
                    <tr className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-2.5 px-3 font-mono font-medium text-white flex items-center gap-2">
                        <Database className="w-3.5 h-3.5 text-saffron" />
                        <span>public.organizations</span>
                      </td>
                      <td className="py-2.5 px-3 text-white/70">8 cols (id, slug, tier, ...)</td>
                      <td className="py-2.5 px-3">
                        <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                          <ShieldCheck className="w-3 h-3" />
                          Enabled (2 policies)
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-mono text-white/70">1,842</td>
                      <td className="py-2.5 px-3 text-right">
                        <Link href="/dashboard/tables?table=organizations" className="text-saffron hover:underline font-mono">
                          Browse →
                        </Link>
                      </td>
                    </tr>
                    <tr className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-2.5 px-3 font-mono font-medium text-white flex items-center gap-2">
                        <Database className="w-3.5 h-3.5 text-saffron" />
                        <span>public.documents</span>
                      </td>
                      <td className="py-2.5 px-3 text-white/70">7 cols (id, embedding vector, ...)</td>
                      <td className="py-2.5 px-3">
                        <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                          <ShieldCheck className="w-3 h-3" />
                          Enabled (3 policies)
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-mono text-white/70">1,280,410</td>
                      <td className="py-2.5 px-3 text-right">
                        <Link href="/dashboard/tables?table=documents" className="text-saffron hover:underline font-mono">
                          Browse →
                        </Link>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Beginner Mode View: Spreadsheet-like Visual View */}
          {activeMode === 'beginner' && (
            <div className="p-5 rounded-xl bg-surface border border-white/[0.08] space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-semibold text-white">Visual Spreadsheet View</h2>
                  <p className="text-xs text-white/50">Edit your data directly with no SQL required</p>
                </div>
                <button
                  onClick={() => router.push('/dashboard/tables')}
                  className="px-3 py-1.5 rounded-lg bg-saffron text-basalt font-medium text-xs hover:bg-saffron/90 transition-colors"
                >
                </button>
              </div>
              <div className="p-6 rounded-lg bg-basalt border border-white/[0.06] text-center space-y-2">
                <p className="text-sm text-white/80">Interactive spreadsheet grid enabled for non-technical teammates.</p>
                <p className="text-xs text-white/40">Columns are auto-typed with validations, relations, and full undo/redo history.</p>
                <div className="pt-2">
                  <Link
                    href="/dashboard/tables"
                    className="inline-flex items-center gap-1 text-xs text-saffron hover:underline font-medium"
                  >
                    Open Full Data Grid →
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Infrastructure Mode View: Pods, Replicas, Traces */}
          {activeMode === 'infrastructure' && (
            <div className="p-5 rounded-xl bg-surface border border-white/[0.08] space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-semibold text-white">Infrastructure Mesh</h2>
                  <p className="text-xs text-white/50">Pod instances, read replicas, and distributed edge routers</p>
                </div>
                <span className="text-xs font-mono text-emerald-400">All 14 Nodes Healthy</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                <div className="p-3 rounded-lg bg-basalt border border-white/[0.06]">
                  <div className="text-white/40">Primary Node</div>
                  <div className="text-white font-bold mt-1">pg-primary-01</div>
                  <div className="text-emerald-400 text-[10px] mt-1">CPU: 18% · RAM: 2.1GB</div>
                </div>
                <div className="p-3 rounded-lg bg-basalt border border-white/[0.06]">
                  <div className="text-white/40">Read Replica 1</div>
                  <div className="text-white font-bold mt-1">pg-replica-iad1</div>
                  <div className="text-emerald-400 text-[10px] mt-1">Lag: 0.1ms · CPU: 12%</div>
                </div>
                <div className="p-3 rounded-lg bg-basalt border border-white/[0.06]">
                  <div className="text-white/40">Read Replica 2</div>
                  <div className="text-white font-bold mt-1">pg-replica-fra1</div>
                  <div className="text-emerald-400 text-[10px] mt-1">Lag: 0.2ms · CPU: 14%</div>
                </div>
                <div className="p-3 rounded-lg bg-basalt border border-white/[0.06]">
                  <div className="text-white/40">Edge Gateway</div>
                  <div className="text-white font-bold mt-1">wasm-mesh-global</div>
                  <div className="text-emerald-400 text-[10px] mt-1">180 PoPs · 0 cold start</div>
                </div>
              </div>
            </div>
          )}

          {/* Architecture Layer Topology */}
          <div className="p-5 rounded-xl bg-surface border border-white/[0.08] space-y-4">
            <h2 className="text-base font-semibold text-white">Full Stack Architecture Pipeline</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-lg bg-basalt border border-white/[0.06] flex flex-col justify-between">
                <div>
                  <div className="text-[10px] font-mono text-saffron">LAYER 1</div>
                  <div className="text-xs font-semibold text-white mt-1">Client SDKs</div>
                </div>
                <div className="text-[10px] text-white/40 mt-2 font-mono">React / Node / Python</div>
              </div>
              <div className="p-3 rounded-lg bg-basalt border border-white/[0.06] flex flex-col justify-between">
                <div>
                  <div className="text-[10px] font-mono text-saffron">LAYER 2</div>
                  <div className="text-xs font-semibold text-white mt-1">Auth & Policies</div>
                </div>
                <div className="text-[10px] text-white/40 mt-2 font-mono">JWT + RLS Guard</div>
              </div>
              <div className="p-3 rounded-lg bg-basalt border border-white/[0.06] flex flex-col justify-between">
                <div>
                  <div className="text-[10px] font-mono text-saffron">LAYER 3</div>
                  <div className="text-xs font-semibold text-white mt-1">Data Storage</div>
                </div>
                <div className="text-[10px] text-white/40 mt-2 font-mono">Postgres + S3</div>
              </div>
              <div className="p-3 rounded-lg bg-basalt border border-white/[0.06] flex flex-col justify-between">
                <div>
                  <div className="text-[10px] font-mono text-saffron">LAYER 4</div>
                  <div className="text-xs font-semibold text-white mt-1">Observability</div>
                </div>
                <div className="text-[10px] text-white/40 mt-2 font-mono">OTel Distributed Traces</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Col: VELORA Copilot Advisor & Quick Actions */}
        <div className="space-y-6">
          {/* Copilot Card */}
          <div className="p-5 rounded-xl bg-gradient-to-b from-surface to-basalt border border-saffron/30 relative overflow-hidden">
            <div className="flex items-center gap-2 text-saffron mb-3">
              <Sparkles className="w-4 h-4 animate-spin" style={{ animationDuration: '3s' }} />
              <span className="text-xs font-mono font-bold tracking-wider uppercase">VELORA Copilot Advisor</span>
            </div>
            <h3 className="text-sm font-semibold text-white">
              Index recommendation available
            </h3>
            <p className="text-xs text-white/60 mt-1 leading-relaxed">
              Query on <code className="text-saffron font-mono text-[11px]">documents(org_id, created_at)</code> was executed 142k times with a sequential scan. Adding a composite B-tree index will reduce p95 latency from 4.2ms to 0.4ms.
            </p>
            <div className="mt-4 pt-3 border-t border-white/[0.08] flex items-center justify-between">
              <button
                onClick={() => toast('Index migration queued: CREATE INDEX CONCURRENTLY idx_docs_org_created ON documents(org_id, created_at DESC)', 'success')}
                className="px-3 py-1.5 rounded-lg bg-saffron text-basalt font-semibold text-xs hover:bg-saffron/90 transition-colors"
              >
                Apply Index (Zero Downtime)
              </button>
              <Link href="/dashboard/advisors" className="text-xs text-white/40 hover:text-white">
                View all (3)
              </Link>
            </div>
          </div>

          {/* Quick Shortcuts */}
          <div className="p-5 rounded-xl bg-surface border border-white/[0.08] space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-wider text-white/40">
              Quick Operations
            </h3>
            <div className="space-y-1">
              <Link
                href="/dashboard/tables"
                className="flex items-center justify-between p-2 rounded-lg hover:bg-white/[0.04] text-xs text-white/80 group transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Database className="w-4 h-4 text-saffron" />
                  <span>Browse Table Editor</span>
                </div>
                <ChevronRight className="w-4 h-4 text-white/30 group-hover:text-white transition-colors" />
              </Link>
              <Link
                href="/dashboard/sql"
                className="flex items-center justify-between p-2 rounded-lg hover:bg-white/[0.04] text-xs text-white/80 group transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Terminal className="w-4 h-4 text-emerald-400" />
                  <span>Execute SQL Query</span>
                </div>
                <ChevronRight className="w-4 h-4 text-white/30 group-hover:text-white transition-colors" />
              </Link>
              <Link
                href="/dashboard/storage"
                className="flex items-center justify-between p-2 rounded-lg hover:bg-white/[0.04] text-xs text-white/80 group transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <HardDrive className="w-4 h-4 text-amber-400" />
                  <span>Upload Storage Bucket</span>
                </div>
                <ChevronRight className="w-4 h-4 text-white/30 group-hover:text-white transition-colors" />
              </Link>
              <Link
                href="/dashboard/functions"
                className="flex items-center justify-between p-2 rounded-lg hover:bg-white/[0.04] text-xs text-white/80 group transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Cpu className="w-4 h-4 text-purple-400" />
                  <span>Deploy Edge Function</span>
                </div>
                <ChevronRight className="w-4 h-4 text-white/30 group-hover:text-white transition-colors" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
