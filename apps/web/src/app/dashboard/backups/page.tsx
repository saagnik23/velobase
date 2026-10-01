'use client';

import { useState } from 'react';
import {
  RotateCcw,
  Clock,
  CheckCircle2,
  HardDrive,
  Shield,
  Play,
} from 'lucide-react';

export default function BackupsPage() {
  const [pitrMinutes, setPitrMinutes] = useState(15);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-white font-display">
              Continuous Backups & PITR
            </h1>
            <span className="inline-flex items-center gap-1 text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Continuous WAL Archiving Active
            </span>
          </div>
          <p className="text-sm text-white/50 mt-1">
            Point-in-Time Recovery allows restoring database state to any individual millisecond in the past 30 days.
          </p>
        </div>
      </div>

      {/* PITR Interactive Slider */}
      <div className="p-6 rounded-xl bg-surface border border-white/[0.08] space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-white">Point-in-Time Recovery Slider</h2>
            <p className="text-xs text-white/50">Select time offset to simulate or branch a restored instance</p>
          </div>
          <span className="text-sm font-mono font-bold text-saffron bg-saffron/10 px-3 py-1 rounded">
            {pitrMinutes} minutes ago
          </span>
        </div>

        <div className="space-y-2">
          <input
            type="range"
            min="1"
            max="1440"
            value={pitrMinutes}
            onChange={(e) => setPitrMinutes(Number(e.target.value))}
            className="w-full accent-saffron cursor-pointer"
          />
          <div className="flex justify-between text-[11px] font-mono text-white/40">
            <span>Now (0s lag)</span>
            <span>12 hours ago</span>
            <span>24 hours ago</span>
          </div>
        </div>

        <div className="pt-2 flex items-center gap-3">
          <button
            onClick={() => alert(`Creating ephemeral sandbox clone restored to ${pitrMinutes}m ago...`)}
            className="px-4 py-2 rounded-lg bg-saffron text-basalt font-semibold text-xs hover:bg-saffron/90 transition-colors"
          >
            Launch Ephemeral Restore Branch
          </button>
        </div>
      </div>
    </div>
  );
}
