'use client';

import { useState } from 'react';
import { useToast } from '@/components/ui/toast';
import {
  Play,
  Save,
  Download,
  Terminal,
  Clock,
  CheckCircle2,
  FileCode,
  Sparkles,
  Copy,
  ChevronDown,
  Layers,
  History,
  RotateCcw,
  Loader2,
} from 'lucide-react';

interface Tab {
  id: string;
  name: string;
  query: string;
}

const defaultTabs: Tab[] = [
  {
    id: 'tab-1',
    name: 'top_users.sql',
    query: `-- Query active users ordered by creation date
SELECT 
  u.id,
  u.email,
  u.role,
  u.created_at,
  COUNT(d.id) AS document_count
FROM users u
LEFT JOIN documents d ON d.org_id = u.id
WHERE u.is_active = true
GROUP BY u.id, u.email, u.role, u.created_at
ORDER BY u.created_at DESC
LIMIT 10;`,
  },
  {
    id: 'tab-2',
    name: 'vector_search.sql',
    query: `-- Sub-5ms cosine vector similarity query using pgvector
SELECT 
  id,
  title,
  1 - (embedding <=> '[0.012, -0.043, 0.089, ...]'::vector) AS similarity
FROM documents
WHERE org_id = 'org_9f81a7b'
ORDER BY embedding <=> '[0.012, -0.043, 0.089, ...]'::vector
LIMIT 5;`,
  },
  {
    id: 'tab-3',
    name: 'cache_stats.sql',
    query: `-- Buffer cache hit ratio
SELECT 
  sum(heap_blks_read) as heap_read,
  sum(heap_blks_hit)  as heap_hit,
  round((sum(heap_blks_hit) / (sum(heap_blks_hit) + sum(heap_blks_read))::numeric) * 100, 2) as hit_ratio
FROM pg_statio_user_tables;`,
  },
];

const mockResultsData = [
  { id: 'u_9f81a7b', email: 'alice.vance@acme.dev', role: 'owner', created_at: '2026-09-28 14:22:01', document_count: 142 },
  { id: 'u_2c4180d', email: 'marcus.chen@stripe.com', role: 'admin', created_at: '2026-09-28 15:40:19', document_count: 89 },
  { id: 'u_7a39e12', email: 'elena.rostova@datadog.io', role: 'member', created_at: '2026-09-29 09:12:44', document_count: 34 },
  { id: 'u_18bf450', email: 'david.kim@anthropic.com', role: 'developer', created_at: '2026-09-29 11:05:32', document_count: 612 },
  { id: 'u_53e89bc', email: 'sarah.connor@defense.gov', role: 'member', created_at: '2026-09-30 08:30:10', document_count: 5 },
];

export default function SqlEditorPage() {
  const { toast } = useToast();
  const [tabs, setTabs] = useState(defaultTabs);
  const [activeTabId, setActiveTabId] = useState('tab-1');
  const [isRunning, setIsRunning] = useState(false);
  const [executionTime, setExecutionTime] = useState<number | null>(1.14);
  const [results, setResults] = useState<any[]>(mockResultsData);
  const [viewMode, setViewMode] = useState<'results' | 'explain'>('results');

  const activeTab = tabs.find((t) => t.id === activeTabId) || tabs[0];

  const handleQueryChange = (val: string) => {
    setTabs(tabs.map((t) => (t.id === activeTabId ? { ...t, query: val } : t)));
  };

  const handleRunQuery = () => {
    setIsRunning(true);
    setTimeout(() => {
      setExecutionTime(Number((0.9 + Math.random() * 0.5).toFixed(2)));
      setIsRunning(false);
    }, 280);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-6.5rem)] rounded-xl border border-white/[0.08] overflow-hidden bg-basalt">
      {/* Editor Header Bar */}
      <div className="h-12 border-b border-white/[0.08] px-4 bg-surface flex items-center justify-between gap-4 shrink-0">
        {/* Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTabId(tab.id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-mono transition-colors ${
                tab.id === activeTabId
                  ? 'bg-basalt text-white border border-white/[0.1] font-semibold'
                  : 'text-white/50 hover:text-white hover:bg-white/[0.03]'
              }`}
            >
              <FileCode className="w-3.5 h-3.5 text-saffron" />
              <span>{tab.name}</span>
            </button>
          ))}
          <button
            onClick={() => {
              const newId = `tab-${tabs.length + 1}`;
              setTabs([...tabs, { id: newId, name: `query_${tabs.length + 1}.sql`, query: 'SELECT * FROM users LIMIT 10;' }]);
              setActiveTabId(newId);
            }}
            className="px-2 py-1 text-xs text-white/40 hover:text-white font-mono"
            title="New Query Tab"
          >
            +
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => toast('Query saved to team snippet library', 'success')}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-white/[0.08] text-xs font-mono text-white/70 hover:text-white hover:bg-white/[0.04] transition-colors"
          >
            <Save className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Save</span>
          </button>

          <button
            onClick={handleRunQuery}
            disabled={isRunning}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-saffron text-basalt font-semibold text-xs hover:bg-saffron/90 transition-colors shadow-sm disabled:opacity-50"
          >
            <Play className={`w-3.5 h-3.5 fill-current ${isRunning ? 'animate-spin' : ''}`} />
            <span>{isRunning ? 'Running...' : 'Run (⌘↵)'}</span>
          </button>
        </div>
      </div>

      {/* Editor Body Split: Code Area + Results Pane */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* SQL Code Input Area */}
        <div className="h-1/2 p-3 bg-basalt border-b border-white/[0.08] flex flex-col font-mono text-xs relative">
          <textarea
            value={activeTab.query}
            onChange={(e) => handleQueryChange(e.target.value)}
            onKeyDown={(e) => {
              if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
                e.preventDefault();
                handleRunQuery();
              }
            }}
            spellCheck={false}
            className="w-full h-full bg-transparent text-white/90 resize-none focus:outline-none font-mono text-xs leading-relaxed selection:bg-saffron/30"
          />
          <div className="absolute right-3 bottom-2 text-[10px] font-mono text-white/30">
            PostgreSQL 17 dialect · Cmd+Enter to execute
          </div>
        </div>

        {/* Results Pane */}
        <div className="h-1/2 flex flex-col bg-surface/30 min-h-0">
          {/* Results Toolbar */}
          <div className="h-10 border-b border-white/[0.08] px-4 flex items-center justify-between bg-surface shrink-0 text-xs">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 border-r border-white/[0.08] pr-4">
                <button
                  onClick={() => setViewMode('results')}
                  className={`px-2.5 py-1 rounded text-xs font-mono font-medium ${
                    viewMode === 'results' ? 'bg-white/[0.08] text-white' : 'text-white/40 hover:text-white'
                  }`}
                >
                  Results ({results.length})
                </button>
                <button
                  onClick={() => setViewMode('explain')}
                  className={`px-2.5 py-1 rounded text-xs font-mono font-medium ${
                    viewMode === 'explain' ? 'bg-white/[0.08] text-white' : 'text-white/40 hover:text-white'
                  }`}
                >
                  Explain Visualizer
                </button>
              </div>

              {executionTime !== null && (
                <div className="flex items-center gap-1.5 font-mono text-xs text-white/60">
                  <Clock className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Executed in</span>
                  <span className="text-emerald-400 font-bold">{executionTime}ms</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(
                    results.map((r) => Object.values(r).join('\t')).join('\n')
                  );
                  toast('Results copied to clipboard', 'success');
                }}
                className="p-1 rounded text-white/40 hover:text-white"
                title="Copy TSV"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => toast('CSV download initiated', 'success')}
                className="p-1 rounded text-white/40 hover:text-white"
                title="Download CSV"
              >
                <Download className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Results Grid or Explain Plan */}
          <div className="flex-1 overflow-auto">
            {viewMode === 'results' ? (
              <table className="w-full text-left text-xs border-collapse font-mono">
                <thead className="sticky top-0 bg-surface border-b border-white/[0.08] text-white/40">
                  <tr>
                    <th className="py-2 px-3 border-r border-white/[0.06]">#</th>
                    <th className="py-2 px-3 border-r border-white/[0.06]">id</th>
                    <th className="py-2 px-3 border-r border-white/[0.06]">email</th>
                    <th className="py-2 px-3 border-r border-white/[0.06]">role</th>
                    <th className="py-2 px-3 border-r border-white/[0.06]">created_at</th>
                    <th className="py-2 px-3">document_count</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {results.map((row, idx) => (
                    <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-2 px-3 border-r border-white/[0.06] text-white/30">{idx + 1}</td>
                      <td className="py-2 px-3 border-r border-white/[0.06] text-saffron">{row.id}</td>
                      <td className="py-2 px-3 border-r border-white/[0.06] text-white/90">{row.email}</td>
                      <td className="py-2 px-3 border-r border-white/[0.06] text-white/70">{row.role}</td>
                      <td className="py-2 px-3 border-r border-white/[0.06] text-white/40">{row.created_at}</td>
                      <td className="py-2 px-3 text-white/90">{row.document_count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-4 space-y-3 font-mono text-xs">
                <div className="p-3 rounded-lg bg-basalt border border-white/[0.08] text-white/80 space-y-1">
                  <div className="text-saffron font-bold">Limit (cost=0.29..4.81 rows=10 width=84) (actual time=0.015..0.022 rows=5 loops=1)</div>
                  <div className="text-white/60 pl-4">-&gt; Sort (cost=0.29..0.30 rows=5 width=84)</div>
                  <div className="text-white/60 pl-8">-&gt; HashAggregate (cost=0.18..0.23 rows=5 width=84)</div>
                  <div className="text-white/60 pl-12">-&gt; Index Scan using users_pkey on users u (cost=0.15..0.17 rows=5 width=76)</div>
                  <div className="text-emerald-400 text-[11px] pt-2">Planning Time: 0.051 ms · Execution Time: 0.038 ms</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
