'use client';

import { useState } from 'react';
import {
  Eye,
  Activity,
  Zap,
  TrendingDown,
  Clock,
  CheckCircle2,
  AlertCircle,
  Search,
  Filter,
} from 'lucide-react';

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
  const [traces, setTraces] = useState<TraceItem[]>(mockTraces);
  const [selectedTrace, setSelectedTrace] = useState<TraceItem>(mockTraces[0]);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-white font-display">
              Observability & Distributed Traces
            </h1>
            <span className="inline-flex items-center gap-1 text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              <Activity className="w-3.5 h-3.5" />
              OpenTelemetry v1.30 Native
            </span>
          </div>
          <p className="text-sm text-white/50 mt-1">
            Real-time latency budgeting, flame graphs, and kernel span timings across every edge invocation and database query.
          </p>
        </div>
      </div>

      {/* Latency Percentiles */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-surface border border-white/[0.08]">
          <div className="text-xs font-mono text-white/40">P50 MEDIAN LATENCY</div>
          <div className="text-2xl font-mono font-bold text-white mt-1">0.48ms</div>
          <div className="text-[11px] font-mono text-emerald-400 mt-1">Excellent</div>
        </div>
        <div className="p-4 rounded-xl bg-surface border border-white/[0.08]">
          <div className="text-xs font-mono text-white/40">P95 LATENCY</div>
          <div className="text-2xl font-mono font-bold text-emerald-400 mt-1">1.18ms</div>
          <div className="text-[11px] font-mono text-emerald-400 mt-1">&lt; 5.0ms Budget PASS</div>
        </div>
        <div className="p-4 rounded-xl bg-surface border border-white/[0.08]">
          <div className="text-xs font-mono text-white/40">P99 TAIL LATENCY</div>
          <div className="text-2xl font-mono font-bold text-saffron mt-1">3.42ms</div>
          <div className="text-[11px] font-mono text-emerald-400 mt-1">&lt; 15.0ms Budget PASS</div>
        </div>
        <div className="p-4 rounded-xl bg-surface border border-white/[0.08]">
          <div className="text-xs font-mono text-white/40">ERROR RATE</div>
          <div className="text-2xl font-mono font-bold text-white mt-1">0.001%</div>
          <div className="text-[11px] font-mono text-emerald-400 mt-1">99.999% SLA</div>
        </div>
      </div>

      {/* Traces Table & Span Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-xl bg-surface border border-white/[0.08] overflow-hidden">
          <div className="p-3 border-b border-white/[0.08] bg-surface/50 flex items-center justify-between text-xs font-mono text-white/50">
            <span>RECENT REQUEST TRACES</span>
            <span>Live Stream</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-white/[0.02] border-b border-white/[0.08] text-white/40">
                <tr>
                  <th className="py-2.5 px-3">Method & Path</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Duration</th>
                  <th className="py-2.5 px-3">Spans</th>
                  <th className="py-2.5 px-3 text-right">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {traces.map((tr) => (
                  <tr
                    key={tr.id}
                    onClick={() => setSelectedTrace(tr)}
                    className={`cursor-pointer transition-colors ${
                      selectedTrace.id === tr.id ? 'bg-saffron/10' : 'hover:bg-white/[0.02]'
                    }`}
                  >
                    <td className="py-2.5 px-3 flex items-center gap-2">
                      <span className="text-[10px] font-bold text-saffron bg-saffron/10 px-1.5 py-0.5 rounded">
                        {tr.method}
                      </span>
                      <span className="text-white truncate max-w-[200px]">{tr.path}</span>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="text-emerald-400">{tr.status}</span>
                    </td>
                    <td className="py-2.5 px-3 text-white font-bold">{tr.durationMs}ms</td>
                    <td className="py-2.5 px-3 text-white/60">{tr.spans}</td>
                    <td className="py-2.5 px-3 text-right text-white/40">{tr.timestamp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Trace Waterfall Breakdown */}
        <div className="p-5 rounded-xl bg-surface border border-white/[0.08] space-y-4">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
            <span className="text-xs font-mono font-semibold text-white">SPAN WATERFALL</span>
            <span className="text-[10px] font-mono text-saffron">{selectedTrace.id}</span>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] text-white/70">
                <span>1. TLS Termination & Edge Gateway</span>
                <span className="text-emerald-400">0.12ms</span>
              </div>
              <div className="w-full bg-white/[0.06] h-1 rounded-full">
                <div className="bg-sky-400 h-full rounded-full" style={{ width: '15%' }} />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[11px] text-white/70">
                <span>2. JWT & Policy RLS Verification</span>
                <span className="text-emerald-400">0.08ms</span>
              </div>
              <div className="w-full bg-white/[0.06] h-1 rounded-full">
                <div className="bg-saffron h-full rounded-full" style={{ width: '10%' }} />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[11px] text-white/70">
                <span>3. Postgres Connection Pool & Query</span>
                <span className="text-emerald-400">0.68ms</span>
              </div>
              <div className="w-full bg-white/[0.06] h-1 rounded-full">
                <div className="bg-purple-400 h-full rounded-full" style={{ width: '68%' }} />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[11px] text-white/70">
                <span>4. JSON Serialization & HTTP Response</span>
                <span className="text-emerald-400">0.06ms</span>
              </div>
              <div className="w-full bg-white/[0.06] h-1 rounded-full">
                <div className="bg-emerald-400 h-full rounded-full" style={{ width: '7%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
