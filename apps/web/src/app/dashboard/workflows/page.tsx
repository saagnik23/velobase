'use client';

import { useState } from 'react';
import {
  Workflow,
  Play,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  GitBranch,
  ArrowRight,
  Layers,
} from 'lucide-react';

interface WorkflowItem {
  id: string;
  name: string;
  trigger: string;
  stepsCount: number;
  lastRun: string;
  avgDuration: string;
  status: 'active' | 'paused';
}

const mockWorkflows: WorkflowItem[] = [
  { id: 'wf-1', name: 'user-onboarding-sequence', trigger: 'Event: auth.user.created', stepsCount: 5, lastRun: '4 mins ago', avgDuration: '1.2s', status: 'active' },
  { id: 'wf-2', name: 'monthly-invoice-generator', trigger: 'Cron: 0 0 1 * *', stepsCount: 8, lastRun: 'Oct 1, 00:00', avgDuration: '14.5s', status: 'active' },
  { id: 'wf-3', name: 'rag-vector-ingestion-pipeline', trigger: 'Event: storage.object.uploaded', stepsCount: 4, lastRun: '12 mins ago', avgDuration: '4.8s', status: 'active' },
];

export default function WorkflowsPage() {
  const [workflows, setWorkflows] = useState<WorkflowItem[]>(mockWorkflows);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-white font-display">
              Durable Workflows
            </h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              State Machine Resilient
            </span>
          </div>
          <p className="text-sm text-white/50 mt-1">
            Deterministic step functions with automatic sleep, human approval gates, and zero state loss across crashes.
          </p>
        </div>

        <button
          onClick={() => alert('New workflow visual canvas opened')}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-saffron text-basalt font-semibold text-xs hover:bg-saffron/90 transition-colors self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Create Workflow</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {workflows.map((wf) => (
          <div key={wf.id} className="p-5 rounded-xl bg-surface border border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <span className="font-mono text-sm font-semibold text-white">{wf.name}</span>
                <span className="text-[10px] font-mono bg-white/[0.06] text-white/70 px-2 py-0.5 rounded">
                  {wf.trigger}
                </span>
              </div>
              <div className="text-xs text-white/40 font-mono">
                {wf.stepsCount} steps · Avg duration: {wf.avgDuration} · Last executed {wf.lastRun}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => alert(`Triggered manual execution for ${wf.name}`)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.06] border border-white/[0.08] text-white hover:bg-white/[0.1] text-xs font-mono"
              >
                <Play className="w-3.5 h-3.5 text-saffron fill-current" />
                <span>Run Now</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
