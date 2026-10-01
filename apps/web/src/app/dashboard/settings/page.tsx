'use client';

import { useState } from 'react';
import {
  Settings,
  Key,
  Database,
  Copy,
  Check,
  Trash2,
  ShieldAlert,
} from 'lucide-react';

export default function SettingsPage() {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="pb-4 border-b border-white/[0.08]">
        <h1 className="text-2xl font-bold tracking-tight text-white font-display">
          Project Settings
        </h1>
        <p className="text-sm text-white/50 mt-1">
          Configure API credentials, database direct and transaction pooled connection strings.
        </p>
      </div>

      {/* General Settings */}
      <div className="p-6 rounded-xl bg-surface border border-white/[0.08] space-y-4">
        <h2 className="text-base font-semibold text-white">General Information</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
          <div>
            <label className="text-white/40 block mb-1">Project Name</label>
            <input
              type="text"
              defaultValue="velora-core"
              className="w-full bg-basalt border border-white/[0.08] rounded p-2 text-white"
            />
          </div>
          <div>
            <label className="text-white/40 block mb-1">Project Ref ID</label>
            <input
              type="text"
              readOnly
              defaultValue="vlr_iad1_94812a"
              className="w-full bg-basalt border border-white/[0.08] rounded p-2 text-white/60 cursor-not-allowed"
            />
          </div>
        </div>
      </div>

      {/* API Keys */}
      <div className="p-6 rounded-xl bg-surface border border-white/[0.08] space-y-4">
        <h2 className="text-base font-semibold text-white">API Credentials</h2>
        <div className="space-y-4 font-mono text-xs">
          <div>
            <div className="flex justify-between text-white/60 mb-1">
              <span>anon public key (Client Side)</span>
              <span className="text-emerald-400">Safe for browsers</span>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value="eyJh...vlr_anon_public_key_718294a"
                className="flex-1 bg-basalt border border-white/[0.08] rounded p-2 text-white/80"
              />
              <button
                onClick={() => copyToClipboard('eyJh...vlr_anon_public_key_718294a', 'anon')}
                className="px-3 py-2 bg-white/[0.06] hover:bg-white/[0.1] rounded text-white flex items-center gap-1.5"
              >
                {copiedKey === 'anon' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>Copy</span>
              </button>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-white/60 mb-1">
              <span>service_role secret (Server Side Only)</span>
              <span className="text-rose-400">Bypasses Row Level Security</span>
            </div>
            <div className="flex gap-2">
              <input
                type="password"
                readOnly
                value="eyJh...vlr_service_role_secret_9941a"
                className="flex-1 bg-basalt border border-white/[0.08] rounded p-2 text-white/80"
              />
              <button
                onClick={() => copyToClipboard('eyJh...vlr_service_role_secret_9941a', 'service')}
                className="px-3 py-2 bg-white/[0.06] hover:bg-white/[0.1] rounded text-white flex items-center gap-1.5"
              >
                {copiedKey === 'service' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>Copy</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Database Connection Pooling */}
      <div className="p-6 rounded-xl bg-surface border border-white/[0.08] space-y-4">
        <h2 className="text-base font-semibold text-white">Database Connection Strings</h2>
        <div className="space-y-4 font-mono text-xs">
          <div>
            <div className="text-white/60 mb-1">Transaction Pooler (Port 6543 - PgBouncer)</div>
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value="postgres://postgres.vlr_iad1:[PASSWORD]@pooler.velora.internal:6543/postgres?pgbouncer=true"
                className="flex-1 bg-basalt border border-white/[0.08] rounded p-2 text-white/80"
              />
              <button
                onClick={() => copyToClipboard('postgres://postgres.vlr_iad1:[PASSWORD]@pooler.velora.internal:6543/postgres?pgbouncer=true', 'pooler')}
                className="px-3 py-2 bg-white/[0.06] hover:bg-white/[0.1] rounded text-white flex items-center gap-1.5"
              >
                {copiedKey === 'pooler' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>Copy</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="p-6 rounded-xl bg-rose-500/5 border border-rose-500/20 space-y-3">
        <div className="flex items-center gap-2 text-rose-400 font-semibold text-sm">
          <ShieldAlert className="w-4 h-4" />
          <span>Danger Zone</span>
        </div>
        <p className="text-xs text-white/50">
          Permanently delete this project and all associated data, edge buckets, and embeddings.
        </p>
        <button
          onClick={() => alert('Project deletion requires 2FA confirmation.')}
          className="px-3 py-1.5 rounded-lg bg-rose-500/20 border border-rose-500/40 text-rose-400 hover:bg-rose-500/30 text-xs font-mono transition-colors"
        >
          Delete Project velora-core
        </button>
      </div>
    </div>
  );
}
