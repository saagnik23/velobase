'use client';

import { useState } from 'react';
import {
  ArrowLeftRight,
  Database,
  CheckCircle2,
  Play,
  Layers,
  ArrowRight,
} from 'lucide-react';

export default function MigrationPage() {
  const [source, setSource] = useState<'supabase' | 'firebase' | 'postgres'>('supabase');
  const [connectionUri, setConnectionUri] = useState('postgresql://postgres:***@db.project.supabase.co:5432/postgres');
  const [isMigrating, setIsMigrating] = useState(false);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-white font-display">
              Migration Center
            </h1>
            <span className="inline-flex items-center gap-1 text-xs font-mono text-saffron bg-saffron/10 px-2 py-0.5 rounded border border-saffron/20">
              <ArrowLeftRight className="w-3.5 h-3.5" />
              1-Click Zero Downtime Importer
            </span>
          </div>
          <p className="text-sm text-white/50 mt-1">
            Migrate from Supabase, Firebase Firestore, or raw Postgres with automated schema translation and live CDC replication.
          </p>
        </div>
      </div>

      <div className="p-6 rounded-xl bg-surface border border-white/[0.08] space-y-5 max-w-2xl">
        <h2 className="text-base font-semibold text-white">Select Migration Source</h2>

        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => setSource('supabase')}
            className={`p-3 rounded-lg border text-left text-xs font-mono transition-all ${
              source === 'supabase'
                ? 'border-saffron bg-saffron/10 text-white font-bold'
                : 'border-white/[0.08] text-white/60 hover:border-white/[0.16]'
            }`}
          >
            Supabase
          </button>
          <button
            onClick={() => setSource('firebase')}
            className={`p-3 rounded-lg border text-left text-xs font-mono transition-all ${
              source === 'firebase'
                ? 'border-saffron bg-saffron/10 text-white font-bold'
                : 'border-white/[0.08] text-white/60 hover:border-white/[0.16]'
            }`}
          >
            Firebase Firestore
          </button>
          <button
            onClick={() => setSource('postgres')}
            className={`p-3 rounded-lg border text-left text-xs font-mono transition-all ${
              source === 'postgres'
                ? 'border-saffron bg-saffron/10 text-white font-bold'
                : 'border-white/[0.08] text-white/60 hover:border-white/[0.16]'
            }`}
          >
            Postgres / AWS RDS
          </button>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-mono text-white/50 block">Source Connection URI</label>
          <input
            type="text"
            value={connectionUri}
            onChange={(e) => setConnectionUri(e.target.value)}
            className="w-full bg-basalt border border-white/[0.08] rounded-md p-2.5 text-xs font-mono text-white focus:outline-none focus:border-saffron"
          />
        </div>

        <button
          onClick={() => {
            setIsMigrating(true);
            setTimeout(() => {
              setIsMigrating(false);
              alert('Schema inspected: 14 tables found. Logical replication stream initialized!');
            }, 1200);
          }}
          disabled={isMigrating}
          className="px-4 py-2 rounded-lg bg-saffron text-basalt font-semibold text-xs hover:bg-saffron/90 flex items-center gap-2"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>{isMigrating ? 'Connecting & Analyzing Schema...' : 'Inspect & Start Migration'}</span>
        </button>
      </div>
    </div>
  );
}
