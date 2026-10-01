'use client';

import { useState } from 'react';
import {
  ListTodo,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Plus,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

interface JobQueue {
  name: string;
  activeJobs: number;
  completedJobs: number;
  failedJobs: number;
  concurrency: number;
  ratePerSec: number;
  status: 'running' | 'paused';
}

const mockQueues: JobQueue[] = [
  { name: 'email-dispatch-queue', activeJobs: 14, completedJobs: 89120, failedJobs: 2, concurrency: 25, ratePerSec: 120, status: 'running' },
  { name: 'video-transcoding-queue', activeJobs: 3, completedJobs: 4120, failedJobs: 0, concurrency: 5, ratePerSec: 8, status: 'running' },
  { name: 'ai-embedding-generation', activeJobs: 82, completedJobs: 1240500, failedJobs: 11, concurrency: 50, ratePerSec: 340, status: 'running' },
  { name: 'audit-log-flush', activeJobs: 0, completedJobs: 3890120, failedJobs: 0, concurrency: 10, ratePerSec: 50, status: 'running' },
];

export default function QueuesPage() {
  const [queues, setQueues] = useState<JobQueue[]>(mockQueues);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-white font-display">
              Background Queues & Workers
            </h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              All 4 Queues Processing
            </span>
          </div>
          <p className="text-sm text-white/50 mt-1">
            Durable message queues backed by Postgres SKIP LOCKED with automatic retries and dead-letter handling.
          </p>
        </div>

        <button
          onClick={() => alert('New queue wizard opened')}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-saffron text-basalt font-semibold text-xs hover:bg-saffron/90 transition-colors self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Queue</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {queues.map((q) => (
          <div key={q.name} className="p-5 rounded-xl bg-surface border border-white/[0.08] space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-white truncate max-w-[180px]">{q.name}</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono text-white/60">
              <div>
                <span className="text-[10px] text-white/40 block">In Flight</span>
                <span className="text-saffron font-bold text-base">{q.activeJobs}</span>
              </div>
              <div>
                <span className="text-[10px] text-white/40 block">Rate</span>
                <span className="text-emerald-400 font-bold text-base">{q.ratePerSec}/s</span>
              </div>
            </div>

            <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-mono text-white/40">
              <span>Completed: {(q.completedJobs / 1000).toFixed(0)}k</span>
              <span className={q.failedJobs > 0 ? 'text-rose-400' : 'text-white/40'}>
                Dead: {q.failedJobs}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
