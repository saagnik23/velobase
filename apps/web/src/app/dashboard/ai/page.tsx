'use client';

import { useState } from 'react';
import {
  Brain,
  Zap,
  TrendingDown,
  Shield,
  Send,
  Sparkles,
  Layers,
  CheckCircle2,
  DollarSign,
  Activity,
} from 'lucide-react';

interface GatewayRoute {
  model: string;
  provider: string;
  fallback: string;
  promptCaching: boolean;
  rateLimitRpm: number;
  costPer1mTokens: string;
  status: 'healthy' | 'degraded';
}

const mockRoutes: GatewayRoute[] = [
  { model: 'claude-3-5-sonnet', provider: 'Anthropic', fallback: 'gpt-4o', promptCaching: true, rateLimitRpm: 1000, costPer1mTokens: '$3.00', status: 'healthy' },
  { model: 'gpt-4o', provider: 'OpenAI', fallback: 'gemini-1.5-pro', promptCaching: true, rateLimitRpm: 2000, costPer1mTokens: '$2.50', status: 'healthy' },
  { model: 'gemini-1.5-flash', provider: 'Google Vertex', fallback: 'gpt-4o-mini', promptCaching: true, rateLimitRpm: 5000, costPer1mTokens: '$0.35', status: 'healthy' },
];

export default function AiGatewayPage() {
  const [prompt, setPrompt] = useState('Write an optimized SQL query for finding dormant accounts.');
  const [selectedModel, setSelectedModel] = useState('claude-3-5-sonnet');
  const [isGenerating, setIsGenerating] = useState(false);
  const [completion, setCompletion] = useState<string | null>(null);

  const handleGenerate = () => {
    setIsGenerating(true);
    setCompletion(null);
    setTimeout(() => {
      setCompletion(`-- Generated via VELORA AI Gateway (Cached in 14ms)
SELECT 
  id, 
  email, 
  last_sign_in_at 
FROM users 
WHERE last_sign_in_at < NOW() - INTERVAL '90 days'
  AND is_active = true;`);
      setIsGenerating(false);
    }, 450);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-white font-display">
              AI Gateway & Model Mesh
            </h1>
            <span className="inline-flex items-center gap-1 text-xs font-mono text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
              <Brain className="w-3.5 h-3.5" />
              Unified API & Automated Failover
            </span>
          </div>
          <p className="text-sm text-white/50 mt-1">
            Universal AI proxy with sub-millisecond edge prompt caching, token budgets, and zero-downtime provider fallback.
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-surface border border-white/[0.08]">
          <div className="text-xs text-white/50 font-mono">PROMPT CACHE HIT RATIO</div>
          <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">84.2%</div>
          <div className="text-[11px] text-white/40 mt-1">Saved $1,420 in LLM API fees this week</div>
        </div>

        <div className="p-4 rounded-xl bg-surface border border-white/[0.08]">
          <div className="text-xs text-white/50 font-mono">P95 PROXY LATENCY</div>
          <div className="text-2xl font-bold font-mono text-saffron mt-1">0.8ms</div>
          <div className="text-[11px] text-white/40 mt-1">Edge WASM routing overhead</div>
        </div>

        <div className="p-4 rounded-xl bg-surface border border-white/[0.08]">
          <div className="text-xs text-white/50 font-mono">ACTIVE PROVIDER HEALTH</div>
          <div className="text-2xl font-bold font-mono text-white mt-1">3 / 3 Online</div>
          <div className="text-[11px] text-emerald-400 mt-1">Zero failovers triggered in last 24h</div>
        </div>
      </div>

      {/* Routes Grid */}
      <div className="p-5 rounded-xl bg-surface border border-white/[0.08] space-y-4">
        <h2 className="text-base font-semibold text-white">Configured Model Routes</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-white/[0.02] border-b border-white/[0.08] text-white/40">
              <tr>
                <th className="py-2.5 px-3">Model</th>
                <th className="py-2.5 px-3">Primary Provider</th>
                <th className="py-2.5 px-3">Automatic Fallback</th>
                <th className="py-2.5 px-3">Prompt Caching</th>
                <th className="py-2.5 px-3">Rate Limit</th>
                <th className="py-2.5 px-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {mockRoutes.map((r) => (
                <tr key={r.model} className="hover:bg-white/[0.02]">
                  <td className="py-2.5 px-3 font-semibold text-white">{r.model}</td>
                  <td className="py-2.5 px-3 text-white/70">{r.provider}</td>
                  <td className="py-2.5 px-3 text-saffron">{r.fallback}</td>
                  <td className="py-2.5 px-3 text-emerald-400">Enabled (Edge NVMe)</td>
                  <td className="py-2.5 px-3 text-white/60">{r.rateLimitRpm} RPM</td>
                  <td className="py-2.5 px-3 text-right">
                    <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Gateway Playground */}
      <div className="p-5 rounded-xl bg-surface border border-white/[0.08] space-y-4">
        <div className="flex items-center gap-2 text-xs font-mono font-semibold text-white">
          <Sparkles className="w-4 h-4 text-saffron" />
          <span>GATEWAY TEST PLAYGROUND</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div>
              <label className="text-xs font-mono text-white/40 block mb-1">Select Target Model</label>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="w-full bg-basalt border border-white/[0.08] rounded-md px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-saffron"
              >
                <option value="claude-3-5-sonnet">claude-3-5-sonnet (Anthropic)</option>
                <option value="gpt-4o">gpt-4o (OpenAI)</option>
                <option value="gemini-1.5-flash">gemini-1.5-flash (Google Vertex)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-mono text-white/40 block mb-1">User Prompt</label>
              <textarea
                rows={4}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full bg-basalt border border-white/[0.08] rounded-md p-3 text-xs font-mono text-white focus:outline-none focus:border-saffron"
              />
            </div>

            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="px-4 py-2 rounded-lg bg-saffron text-basalt font-semibold text-xs hover:bg-saffron/90 transition-colors flex items-center gap-2"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isGenerating ? 'Routing through Gateway...' : 'Execute Request'}</span>
            </button>
          </div>

          <div className="bg-basalt border border-white/[0.08] rounded-xl p-4 flex flex-col font-mono text-xs">
            <span className="text-[10px] text-white/40 mb-2">Gateway Response (Streamed via Edge Proxy)</span>
            {completion ? (
              <pre className="text-white/90 whitespace-pre-wrap leading-relaxed flex-1">
                {completion}
              </pre>
            ) : (
              <div className="text-white/30 py-12 text-center">
                Response will appear here with execution latency metrics.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
