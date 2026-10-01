'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Activity,
  Zap,
  TrendingDown,
  Database,
  Cpu,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  LineChart,
  Network,
  RefreshCw,
} from 'lucide-react';
import { useToast } from '@/components/ui/toast';

interface TraceItem {
  id: string;
  method: string;
  path: string;
  status: number;
  durationMs: number;
  timestamp: string;
  spans: number;
}

const mockTraces: TraceItem[] = [
  { id: 'tr_8f912a', method: 'GET', path: '/api/v1/users/me', status: 200, durationMs: 0.94, timestamp: '14:50:11', spans: 4 },
  { id: 'tr_3b418c', method: 'POST', path: '/api/v1/embeddings/query', status: 200, durationMs: 3.21, timestamp: '14:50:09', spans: 6 },
  { id: 'tr_7e290f', method: 'GET', path: '/api/v1/documents?limit=20', status: 200, durationMs: 1.12, timestamp: '14:50:04', spans: 3 },
  { id: 'tr_11a84d', method: 'POST', path: '/functions/v1/stripe-webhook', status: 200, durationMs: 1.45, timestamp: '14:49:58', spans: 5 },
  { id: 'tr_99c301', method: 'GET', path: '/storage/v1/avatars/u_9f81a7b', status: 304, durationMs: 0.42, timestamp: '14:49:52', spans: 2 },
];

export default function ObservabilityPage() {
  return (
    <Suspense fallback={<div className="p-6 text-xs font-mono text-neutral-500">Loading monitor diagnostics...</div>}>
      <ObservabilityContent />
    </Suspense>
  );
}

function ObservabilityContent() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') || 'performance';
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState<'health' | 'performance' | 'logs' | 'traces'>(
    initialTab === 'health' || initialTab === 'performance' || initialTab === 'logs' || initialTab === 'traces'
      ? initialTab
      : 'performance'
  );

  const [traces] = useState<TraceItem[]>(mockTraces);
  const [selectedTrace, setSelectedTrace] = useState<TraceItem>(mockTraces[0]!);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [latencyVal, setLatencyVal] = useState(1.18);

  const refreshTelemetry = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setLatencyVal(Number((1.1 + Math.random() * 0.15).toFixed(2)));
      setIsRefreshing(false);
      toast('Telemetry benchmarks refreshed', 'info');
    }, 400);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border-default">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-salt font-display">
              Monitor & Diagnostics
            </h1>
            <span className="inline-flex items-center gap-1.5 text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              OpenTelemetry Native
            </span>
          </div>
          <p className="text-xs text-neutral-400 mt-1">
            System performance telemetry, query plans, trace waterfalls, and runtime event streams.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center p-1 rounded-lg bg-surface-raised border border-border-default self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('health')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              activeTab === 'health'
                ? 'bg-saffron text-basalt font-semibold shadow-sm'
                : 'text-neutral-400 hover:text-salt'
            }`}
          >
            Health
          </button>
          <button
            onClick={() => setActiveTab('performance')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              activeTab === 'performance'
                ? 'bg-saffron text-basalt font-semibold shadow-sm'
                : 'text-neutral-400 hover:text-salt'
            }`}
          >
            Performance
          </button>
          <button
            onClick={() => setActiveTab('traces')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              activeTab === 'traces'
                ? 'bg-saffron text-basalt font-semibold shadow-sm'
                : 'text-neutral-400 hover:text-salt'
            }`}
          >
            Traces
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              activeTab === 'logs'
                ? 'bg-saffron text-basalt font-semibold shadow-sm'
                : 'text-neutral-400 hover:text-salt'
            }`}
          >
            Logs
          </button>
        </div>
      </div>

      {/* TAB 1: HEALTH */}
      {activeTab === 'health' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-surface-raised border border-border-default space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-neutral-400">PostgreSQL Core</span>
                <span className="text-emerald-400 font-mono text-[11px] flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> 100% Up
                </span>
              </div>
              <div className="text-lg font-bold text-salt font-mono">Healthy</div>
              <div className="text-xs text-neutral-500">Active WAL replication · 0 replica lag</div>
            </div>

            <div className="p-4 rounded-xl bg-surface-raised border border-border-default space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-neutral-400">WASM Edge Gateway</span>
                <span className="text-emerald-400 font-mono text-[11px] flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> 180 PoPs
                </span>
              </div>
              <div className="text-lg font-bold text-salt font-mono">Operational</div>
              <div className="text-xs text-neutral-500">Global anycast routing · TLS 1.3</div>
            </div>

            <div className="p-4 rounded-xl bg-surface-raised border border-border-default space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-neutral-400">S3 Object Storage</span>
                <span className="text-emerald-400 font-mono text-[11px] flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> 11 9s Durability
                </span>
              </div>
              <div className="text-lg font-bold text-salt font-mono">Connected</div>
              <div className="text-xs text-neutral-500">Multi-AZ replicated · MinIO compatible</div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PERFORMANCE (Relocated p50, p95, p99, connection pool, vector ANN) */}
      {activeTab === 'performance' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-neutral-400">
              Low-Latency Telemetry & Pool Saturation
            </span>
            <button
              onClick={refreshTelemetry}
              className={`p-1.5 rounded-md hover:bg-surface-raised border border-border-subtle text-neutral-400 hover:text-saffron transition-all ${
                isRefreshing ? 'animate-spin text-saffron' : ''
              }`}
              title="Refresh"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Metric 1: P50 / P95 Latency */}
            <div className="p-4 rounded-xl bg-surface-raised border border-border-default space-y-2">
              <div className="text-[11px] font-mono text-neutral-400">P95 READ LATENCY</div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-mono font-bold text-salt">{latencyVal}</span>
                <span className="text-xs font-mono text-neutral-500">ms</span>
                <span className="ml-auto inline-flex items-center text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                  <TrendingDown className="w-3 h-3 mr-0.5" />
                  PASS
                </span>
              </div>
              <div className="w-full bg-surface-base h-1.5 rounded-full overflow-hidden">
                <div className="bg-emerald-400 h-full rounded-full" style={{ width: '24%' }} />
              </div>
              <div className="flex justify-between text-[10px] font-mono text-neutral-500">
                <span>p50: 0.48ms</span>
                <span>Budget: &lt;5.0ms</span>
              </div>
            </div>

            {/* Metric 2: Edge Cache */}
            <div className="p-4 rounded-xl bg-surface-raised border border-border-default space-y-2">
              <div className="text-[11px] font-mono text-neutral-400">CACHE HIT RATIO</div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-mono font-bold text-salt">99.4%</span>
                <span className="ml-auto inline-flex items-center text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                  Optimal
                </span>
              </div>
              <div className="w-full bg-surface-base h-1.5 rounded-full overflow-hidden">
                <div className="bg-saffron h-full rounded-full" style={{ width: '99.4%' }} />
              </div>
              <div className="flex justify-between text-[10px] font-mono text-neutral-500">
                <span>Hits: 2.41M/hr</span>
                <span>Misses: 14.5k</span>
              </div>
            </div>

            {/* Metric 3: Connection Pool */}
            <div className="p-4 rounded-xl bg-surface-raised border border-border-default space-y-2">
              <div className="text-[11px] font-mono text-neutral-400">CONNECTION POOL</div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-mono font-bold text-salt">18</span>
                <span className="text-xs font-mono text-neutral-500">/ 250 max</span>
                <span className="ml-auto inline-flex items-center text-[11px] font-mono text-sky-400 bg-sky-500/10 px-1.5 py-0.5 rounded">
                  PgBouncer
                </span>
              </div>
              <div className="w-full bg-surface-base h-1.5 rounded-full overflow-hidden">
                <div className="bg-sky-400 h-full rounded-full" style={{ width: '7.2%' }} />
              </div>
              <div className="flex justify-between text-[10px] font-mono text-neutral-500">
                <span>Queue: 0.04ms</span>
                <span>Leases: 320</span>
              </div>
            </div>

            {/* Metric 4: Vector Search */}
            <div className="p-4 rounded-xl bg-surface-raised border border-border-default space-y-2">
              <div className="text-[11px] font-mono text-neutral-400">VECTOR ANN P99</div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-mono font-bold text-salt">3.4</span>
                <span className="text-xs font-mono text-neutral-500">ms</span>
                <span className="ml-auto inline-flex items-center text-[11px] font-mono text-purple-400 bg-purple-500/10 px-1.5 py-0.5 rounded">
                  HNSW Index
                </span>
              </div>
              <div className="w-full bg-surface-base h-1.5 rounded-full overflow-hidden">
                <div className="bg-purple-400 h-full rounded-full" style={{ width: '34%' }} />
              </div>
              <div className="flex justify-between text-[10px] font-mono text-neutral-500">
                <span>1536-dim</span>
                <span>1.2M vectors</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: TRACES */}
      {activeTab === 'traces' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 rounded-xl bg-surface-raised border border-border-default overflow-hidden">
            <div className="p-3 border-b border-border-default bg-surface-base flex items-center justify-between text-xs font-mono text-neutral-400">
              <span>RECENT REQUEST TRACES</span>
              <span className="text-emerald-400">Live Stream</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-surface-base/50 border-b border-border-subtle text-neutral-500">
                  <tr>
                    <th className="py-2.5 px-3">Method & Path</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3">Duration</th>
                    <th className="py-2.5 px-3">Spans</th>
                    <th className="py-2.5 px-3 text-right">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle">
                  {traces.map((tr) => (
                    <tr
                      key={tr.id}
                      onClick={() => setSelectedTrace(tr)}
                      className={`cursor-pointer transition-colors ${
                        selectedTrace.id === tr.id ? 'bg-saffron-subtle/30' : 'hover:bg-surface-overlay'
                      }`}
                    >
                      <td className="py-2.5 px-3 flex items-center gap-2">
                        <span className="text-[10px] font-bold text-saffron bg-saffron/10 px-1.5 py-0.5 rounded">
                          {tr.method}
                        </span>
                        <span className="text-salt truncate max-w-[200px]">{tr.path}</span>
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="text-emerald-400">{tr.status}</span>
                      </td>
                      <td className="py-2.5 px-3 text-salt font-bold">{tr.durationMs}ms</td>
                      <td className="py-2.5 px-3 text-neutral-400">{tr.spans}</td>
                      <td className="py-2.5 px-3 text-right text-neutral-500">{tr.timestamp}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Trace Waterfall Breakdown */}
          <div className="p-5 rounded-xl bg-surface-raised border border-border-default space-y-4">
            <div className="flex items-center justify-between border-b border-border-default pb-3">
              <span className="text-xs font-mono font-semibold text-salt">SPAN WATERFALL</span>
              <span className="text-[10px] font-mono text-saffron">{selectedTrace.id}</span>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-neutral-300">
                  <span>1. TLS Termination & Edge Gateway</span>
                  <span className="text-emerald-400">0.12ms</span>
                </div>
                <div className="w-full bg-surface-base h-1 rounded-full">
                  <div className="bg-sky-400 h-full rounded-full" style={{ width: '15%' }} />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-neutral-300">
                  <span>2. JWT & Policy RLS Verification</span>
                  <span className="text-emerald-400">0.08ms</span>
                </div>
                <div className="w-full bg-surface-base h-1 rounded-full">
                  <div className="bg-saffron h-full rounded-full" style={{ width: '10%' }} />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-neutral-300">
                  <span>3. Postgres Connection Pool & Query</span>
                  <span className="text-emerald-400">0.68ms</span>
                </div>
                <div className="w-full bg-surface-base h-1 rounded-full">
                  <div className="bg-purple-400 h-full rounded-full" style={{ width: '68%' }} />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-neutral-300">
                  <span>4. JSON Serialization & HTTP Response</span>
                  <span className="text-emerald-400">0.06ms</span>
                </div>
                <div className="w-full bg-surface-base h-1 rounded-full">
                  <div className="bg-emerald-400 h-full rounded-full" style={{ width: '7%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: LOGS */}
      {activeTab === 'logs' && (
        <div className="p-4 rounded-xl bg-surface-raised border border-border-default space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between border-b border-border-default pb-3">
            <span className="text-neutral-400">RUNTIME EXECUTION LOGS</span>
            <span className="text-[10px] text-emerald-400">Filtering: stdout & stderr</span>
          </div>
          <div className="p-4 rounded-lg bg-surface-base border border-border-subtle space-y-1 text-[11px] text-neutral-300">
            <div><span className="text-neutral-500">[14:51:02]</span> <span className="text-sky-400">INFO</span> [gateway] Ingress connection opened from 192.241.14.8</div>
            <div><span className="text-neutral-500">[14:51:02]</span> <span className="text-emerald-400">SUCCESS</span> [pg-pool] Checkout client lease in 0.04ms</div>
            <div><span className="text-neutral-500">[14:51:02]</span> <span className="text-neutral-400">DEBUG</span> [rls] Enforcing tenant policy org_id = &apos;org_9124&apos;</div>
            <div><span className="text-neutral-500">[14:51:03]</span> <span className="text-sky-400">INFO</span> [wasm-worker] process-webhooks completed in 1.45ms</div>
            <div><span className="text-neutral-500">[14:51:04]</span> <span className="text-amber-400">WARN</span> [storage] Client requested non-cached asset /avatars/u_default.png</div>
          </div>
        </div>
      )}
    </div>
  );
}
