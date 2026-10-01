'use client';

import { useState } from 'react';
import {
  Lock,
  Plus,
  Eye,
  EyeOff,
  Copy,
  Check,
  Trash2,
  ShieldCheck,
} from 'lucide-react';

interface SecretItem {
  id: string;
  key: string;
  value: string;
  env: 'all' | 'production' | 'staging';
  updatedAt: string;
}

const mockSecrets: SecretItem[] = [
  { id: 'sec-1', key: 'STRIPE_WEBHOOK_SECRET', value: 'whsec_90f81248a91280cae1829', env: 'production', updatedAt: '2 days ago' },
  { id: 'sec-2', key: 'RESEND_API_KEY', value: 're_1892f0ab_91204812a', env: 'all', updatedAt: '5 days ago' },
  { id: 'sec-3', key: 'OPENAI_API_KEY', value: 'sk-proj-819208a901284a', env: 'all', updatedAt: '1 week ago' },
];

export default function SecretsPage() {
  const [secrets, setSecrets] = useState<SecretItem[]>(mockSecrets);
  const [revealedIds, setRevealedIds] = useState<string[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');

  const toggleReveal = (id: string) => {
    setRevealedIds(
      revealedIds.includes(id) ? revealedIds.filter((i) => i !== id) : [...revealedIds, id]
    );
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKey || !newValue) return;
    setSecrets([
      {
        id: `sec-${Date.now()}`,
        key: newKey.toUpperCase().replace(/\s+/g, '_'),
        value: newValue,
        env: 'production',
        updatedAt: 'Just now',
      },
      ...secrets,
    ]);
    setNewKey('');
    setNewValue('');
    setShowAddModal(false);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-white font-display">
              Encrypted Secrets & Environment Variables
            </h1>
            <span className="inline-flex items-center gap-1 text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              <ShieldCheck className="w-3.5 h-3.5" />
              AES-256-GCM Vault
            </span>
          </div>
          <p className="text-sm text-white/50 mt-1">
            Hardware-backed key encryption for edge functions, database connection pooling, and background worker jobs.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-saffron text-basalt font-semibold text-xs hover:bg-saffron/90 self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Secret</span>
        </button>
      </div>

      <div className="rounded-xl border border-white/[0.08] bg-surface overflow-hidden">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-white/[0.02] border-b border-white/[0.08] text-white/40">
            <tr>
              <th className="py-2.5 px-4">Variable Name</th>
              <th className="py-2.5 px-3">Encrypted Value</th>
              <th className="py-2.5 px-3">Environment Scope</th>
              <th className="py-2.5 px-3">Updated</th>
              <th className="py-2.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {secrets.map((sec) => {
              const isRevealed = revealedIds.includes(sec.id);
              return (
                <tr key={sec.id} className="hover:bg-white/[0.02]">
                  <td className="py-3 px-4 font-bold text-white flex items-center gap-2">
                    <Lock className="w-3.5 h-3.5 text-saffron shrink-0" />
                    <span>{sec.key}</span>
                  </td>
                  <td className="py-3 px-3 text-white/70">
                    {isRevealed ? sec.value : '••••••••••••••••••••••••'}
                  </td>
                  <td className="py-3 px-3">
                    <span className="text-[10px] bg-white/[0.06] text-white/80 px-2 py-0.5 rounded uppercase">
                      {sec.env}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-white/40">{sec.updatedAt}</td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => toggleReveal(sec.id)}
                      className="p-1 rounded text-white/40 hover:text-white mr-2"
                      title={isRevealed ? 'Hide' : 'Reveal'}
                    >
                      {isRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      onClick={() => setSecrets(secrets.filter((s) => s.id !== sec.id))}
                      className="p-1 rounded text-rose-400 hover:text-rose-300"
                      title="Delete Secret"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md bg-surface border border-white/[0.1] rounded-xl shadow-2xl p-5 space-y-4">
            <h3 className="text-sm font-semibold text-white">Add Encrypted Secret</h3>
            <form onSubmit={handleAdd} className="space-y-3 font-mono text-xs">
              <div>
                <label className="text-white/50 block mb-1">KEY (UPPERCASE)</label>
                <input
                  type="text"
                  required
                  value={newKey}
                  onChange={(e) => setNewKey(e.target.value)}
                  placeholder="STRIPE_SECRET_KEY"
                  className="w-full bg-basalt border border-white/[0.08] rounded p-2 text-white focus:outline-none focus:border-saffron"
                />
              </div>
              <div>
                <label className="text-white/50 block mb-1">SECRET VALUE</label>
                <input
                  type="password"
                  required
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  placeholder="sk_live_..."
                  className="w-full bg-basalt border border-white/[0.08] rounded p-2 text-white focus:outline-none focus:border-saffron"
                />
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 rounded border border-white/[0.08] text-white/70"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded bg-saffron text-basalt font-semibold"
                >
                  Save Secret
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
