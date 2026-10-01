'use client';

import { useState } from 'react';
import {
  Scale,
  Shield,
  Plus,
  CheckCircle2,
  Lock,
  Unlock,
  Code2,
  Trash2,
  AlertTriangle,
  ChevronRight,
  Database,
} from 'lucide-react';

interface RlsPolicy {
  id: string;
  name: string;
  table: string;
  command: 'SELECT' | 'INSERT' | 'UPDATE' | 'DELETE' | 'ALL';
  role: string;
  usingExpr: string;
  withCheckExpr?: string;
  enabled: boolean;
}

const mockPolicies: RlsPolicy[] = [
  {
    id: 'pol-1',
    name: 'users_can_read_own_profile',
    table: 'public.users',
    command: 'SELECT',
    role: 'authenticated',
    usingExpr: 'auth.uid() = id',
    enabled: true,
  },
  {
    id: 'pol-2',
    name: 'users_can_update_own_profile',
    table: 'public.users',
    command: 'UPDATE',
    role: 'authenticated',
    usingExpr: 'auth.uid() = id',
    withCheckExpr: 'auth.uid() = id',
    enabled: true,
  },
  {
    id: 'pol-3',
    name: 'org_members_read_documents',
    table: 'public.documents',
    command: 'SELECT',
    role: 'authenticated',
    usingExpr: 'org_id IN (SELECT org_id FROM org_members WHERE user_id = auth.uid())',
    enabled: true,
  },
  {
    id: 'pol-4',
    name: 'service_role_unrestricted_audit',
    table: 'public.audit_logs',
    command: 'ALL',
    role: 'service_role',
    usingExpr: 'true',
    enabled: true,
  },
];

export default function PoliciesPage() {
  const [policies, setPolicies] = useState<RlsPolicy[]>(mockPolicies);
  const [selectedPolicy, setSelectedPolicy] = useState<RlsPolicy>(mockPolicies[0]!);
  const [showSql, setShowSql] = useState(false);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-white font-display">
              Row Level Security Policies
            </h1>
            <span className="inline-flex items-center gap-1 text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              <Shield className="w-3.5 h-3.5" />
              Guaranteed Kernel Isolation
            </span>
          </div>
          <p className="text-sm text-white/50 mt-1">
            Declarative Postgres RLS rules enforced at the engine layer. Evaluated in zero-latency query plans.
          </p>
        </div>

        <button
          onClick={() => alert('New policy wizard opened')}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-saffron text-basalt font-semibold text-xs hover:bg-saffron/90 transition-colors self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Policy</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Policy List */}
        <div className="lg:col-span-2 space-y-3">
          {policies.map((pol) => (
            <div
              key={pol.id}
              onClick={() => setSelectedPolicy(pol)}
              className={`p-4 rounded-xl border transition-all cursor-pointer ${
                selectedPolicy.id === pol.id
                  ? 'bg-surface border-saffron/50 shadow-md'
                  : 'bg-surface/60 border-white/[0.08] hover:border-white/[0.16]'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-white/[0.06] text-white/90">
                    {pol.command}
                  </span>
                  <span className="font-mono text-sm font-semibold text-white">
                    {pol.name}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-white/40">{pol.table}</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                </div>
              </div>

              <div className="mt-2 text-xs font-mono text-white/70 bg-basalt p-2 rounded border border-white/[0.04]">
                <span className="text-saffron">USING</span> ({pol.usingExpr})
                {pol.withCheckExpr && (
                  <div className="mt-1 text-white/70">
                    <span className="text-saffron">WITH CHECK</span> ({pol.withCheckExpr})
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Policy Detail / SQL Inspector */}
        <div className="p-5 rounded-xl bg-surface border border-white/[0.08] space-y-4 h-fit">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
            <span className="text-xs font-mono font-semibold text-white">POLICY DETAILS</span>
            <button
              onClick={() => setShowSql(!showSql)}
              className="text-xs text-saffron hover:underline flex items-center gap-1 font-mono"
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>{showSql ? 'View Visual' : 'View SQL'}</span>
            </button>
          </div>

          {!showSql ? (
            <div className="space-y-3 text-xs font-mono">
              <div>
                <div className="text-white/40 text-[10px]">Target Table</div>
                <div className="text-white font-semibold mt-0.5">{selectedPolicy.table}</div>
              </div>
              <div>
                <div className="text-white/40 text-[10px]">Command</div>
                <div className="text-saffron font-semibold mt-0.5">{selectedPolicy.command}</div>
              </div>
              <div>
                <div className="text-white/40 text-[10px]">Role / Grantee</div>
                <div className="text-white font-semibold mt-0.5">{selectedPolicy.role}</div>
              </div>
              <div>
                <div className="text-white/40 text-[10px]">USING Expression</div>
                <div className="text-emerald-400 mt-0.5 p-2 bg-basalt rounded border border-white/[0.04]">
                  {selectedPolicy.usingExpr}
                </div>
              </div>
            </div>
          ) : (
            <pre className="text-[11px] font-mono text-white/80 bg-basalt p-3 rounded border border-white/[0.06] overflow-x-auto">
              <code>{`CREATE POLICY "${selectedPolicy.name}"
ON ${selectedPolicy.table}
FOR ${selectedPolicy.command}
TO ${selectedPolicy.role}
USING (${selectedPolicy.usingExpr})${
  selectedPolicy.withCheckExpr ? `\nWITH CHECK (${selectedPolicy.withCheckExpr});` : ';'
}`}</code>
            </pre>
          )}

          <div className="pt-2 border-t border-white/[0.08] flex items-center justify-between">
            <button
              onClick={() => alert(`Policy ${selectedPolicy.name} tested with simulation token: PASS (0.02ms)`)}
              className="px-3 py-1.5 rounded-lg bg-white/[0.06] text-white hover:bg-white/[0.1] text-xs font-mono"
            >
              Simulate Policy
            </button>
            <button
              onClick={() => alert(`Policy ${selectedPolicy.name} deleted`)}
              className="text-rose-400 hover:text-rose-300 p-1"
              title="Delete Policy"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
