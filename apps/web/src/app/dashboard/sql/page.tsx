'use client';

import { useState, useRef, useEffect } from 'react';
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
  Layers,
  History,
  AlertCircle,
  Bookmark,
  ChevronRight,
  Database,
  Search,
  Code2,
  RotateCcw,
} from 'lucide-react';

interface Tab {
  id: string;
  name: string;
  query: string;
}

interface SavedQuery {
  id: string;
  name: string;
  query: string;
  description: string;
  updatedAt: string;
}

interface HistoryItem {
  id: string;
  query: string;
  timestamp: string;
  durationMs: number;
  rowsCount: number;
  status: 'success' | 'error';
  errorMsg?: string;
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
  sum(heap_blks_hit) as heap_hit,
  round((sum(heap_blks_hit) / (sum(heap_blks_hit) + sum(heap_blks_read))::numeric) * 100, 2) as hit_ratio
FROM pg_statio_user_tables;`,
  },
];

const mockSavedQueries: SavedQuery[] = [
  {
    id: 'sq-1',
    name: 'User Retention Cohort',
    query: `SELECT date_trunc('week', created_at) as cohort, count(*) FROM users GROUP BY 1 ORDER BY 1 DESC;`,
    description: 'Weekly user registrations cohort',
    updatedAt: '2 days ago',
  },
  {
    id: 'sq-2',
    name: 'Storage Size by Org',
    query: `SELECT org_id, pg_size_pretty(sum(byte_size)) FROM documents GROUP BY 1;`,
    description: 'Calculates storage allocation per tenant',
    updatedAt: '5 days ago',
  },
  {
    id: 'sq-3',
    name: 'Orphaned RLS Policies',
    query: `SELECT polname, tablename FROM pg_policies WHERE schemaname = 'public';`,
    description: 'Audits tenant security policies',
    updatedAt: '1 week ago',
  },
];

const mockInitialResults = [
  { id: 'u_9f81a7b', email: 'alice.vance@acme.dev', role: 'owner', created_at: '2026-09-28 14:22:01', document_count: 142 },
  { id: 'u_2c4180d', email: 'marcus.chen@stripe.com', role: 'admin', created_at: '2026-09-28 15:40:19', document_count: 89 },
  { id: 'u_7a39e12', email: 'elena.rostova@datadog.io', role: 'member', created_at: '2026-09-29 09:12:44', document_count: 34 },
  { id: 'u_18bf450', email: 'david.kim@anthropic.com', role: 'developer', created_at: '2026-09-29 11:05:32', document_count: 612 },
  { id: 'u_53e89bc', email: 'sarah.connor@defense.gov', role: 'member', created_at: '2026-09-30 08:30:10', document_count: 5 },
];

export default function SqlEditorPage() {
  const { toast } = useToast();
  const [tabs, setTabs] = useState<Tab[]>(defaultTabs);
  const [activeTabId, setActiveTabId] = useState('tab-1');
  const [isRunning, setIsRunning] = useState(false);
  const [executionTime, setExecutionTime] = useState<number | null>(1.14);
  const [results, setResults] = useState<Record<string, unknown>[]>(mockInitialResults);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'results' | 'explain' | 'saved' | 'history'>('results');
  const [savedQueries, setSavedQueries] = useState<SavedQuery[]>(mockSavedQueries);
  const [queryHistory, setQueryHistory] = useState<HistoryItem[]>([
    {
      id: 'h-1',
      query: 'SELECT * FROM users LIMIT 10;',
      timestamp: '14:52:10',
      durationMs: 1.14,
      rowsCount: 5,
      status: 'success',
    },
    {
      id: 'h-2',
      query: 'SELECT embedding FROM documents WHERE org_id = 99;',
      timestamp: '14:48:02',
      durationMs: 0.88,
      rowsCount: 20,
      status: 'success',
    },
  ]);

  const activeTab = tabs.find((t) => t.id === activeTabId) || tabs[0]!;

  const handleQueryChange = (val: string) => {
    setTabs(tabs.map((t) => (t.id === activeTabId ? { ...t, query: val } : t)));
    if (errorDetails) setErrorDetails(null);
  };

  const handleRunQuery = () => {
    setIsRunning(true);
    setErrorDetails(null);

    // Simulated query parsing & execution
    setTimeout(() => {
      const q = activeTab.query.trim().toLowerCase();

      if (q.includes('syntax error') || q.includes('from non_existent_table')) {
        setErrorDetails('ERROR: relation "non_existent_table" does not exist at character 15');
        setIsRunning(false);
        toast('Query failed with syntax error', 'error');

        setQueryHistory((prev) => [
          {
            id: `h-${Date.now()}`,
            query: activeTab.query,
            timestamp: new Date().toLocaleTimeString(),
            durationMs: 0.42,
            rowsCount: 0,
            status: 'error',
            errorMsg: 'relation does not exist',
          },
          ...prev,
        ]);
        return;
      }

      const elapsed = Number((0.85 + Math.random() * 0.45).toFixed(2));
      setExecutionTime(elapsed);
      setIsRunning(false);
      toast(`Executed in ${elapsed}ms (${results.length} rows returned)`, 'success');

      setQueryHistory((prev) => [
        {
          id: `h-${Date.now()}`,
          query: activeTab.query,
          timestamp: new Date().toLocaleTimeString(),
          durationMs: elapsed,
          rowsCount: results.length,
          status: 'success',
        },
        ...prev,
      ]);
    }, 280);
  };

  const handleExportCsv = () => {
    if (results.length === 0) {
      toast('No results to export', 'error');
      return;
    }
    const headers = Object.keys(results[0]!);
    const csvRows = [
      headers.join(','),
      ...results.map((row) => headers.map((h) => JSON.stringify(row[h] ?? '')).join(',')),
    ];
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${activeTab.name.replace('.sql', '')}_export.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast('CSV file downloaded', 'success');
  };

  const handleSaveCurrentQuery = () => {
    const newSaved: SavedQuery = {
      id: `sq-${Date.now()}`,
      name: activeTab.name,
      query: activeTab.query,
      description: 'Saved from Query Studio',
      updatedAt: 'Just now',
    };
    setSavedQueries([newSaved, ...savedQueries]);
    toast(`Query "${activeTab.name}" saved to library`, 'success');
  };

  return (
    <div className="flex flex-col h-[calc(100vh-6.5rem)] rounded-xl border border-border-default overflow-hidden bg-basalt animate-in fade-in duration-200">
      {/* Top Header Bar */}
      <div className="h-12 border-b border-border-default px-4 bg-surface-raised flex items-center justify-between gap-4 shrink-0">
        {/* Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTabId(tab.id);
                setErrorDetails(null);
              }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-mono transition-colors ${
                tab.id === activeTabId
                  ? 'bg-surface-base text-salt border border-border-default font-semibold'
                  : 'text-neutral-400 hover:text-salt hover:bg-surface-overlay'
              }`}
            >
              <FileCode className="w-3.5 h-3.5 text-saffron" />
              <span>{tab.name}</span>
            </button>
          ))}
          <button
            onClick={() => {
              const newId = `tab-${tabs.length + 1}`;
              setTabs([
                ...tabs,
                { id: newId, name: `query_${tabs.length + 1}.sql`, query: 'SELECT * FROM users LIMIT 10;' },
              ]);
              setActiveTabId(newId);
            }}
            className="px-2 py-1 text-xs text-neutral-400 hover:text-salt font-mono"
            title="New Tab"
          >
            +
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleSaveCurrentQuery}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-border-default text-xs font-mono text-neutral-300 hover:text-salt hover:bg-surface-overlay transition-colors"
          >
            <Bookmark className="w-3.5 h-3.5 text-saffron" />
            <span className="hidden sm:inline">Save Query</span>
          </button>

          <button
            onClick={handleRunQuery}
            disabled={isRunning}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-saffron text-basalt font-semibold text-xs hover:bg-saffron-hover transition-colors shadow-saffron-sm disabled:opacity-50"
          >
            <Play className={`w-3.5 h-3.5 fill-current ${isRunning ? 'animate-spin' : ''}`} />
            <span>{isRunning ? 'Executing...' : 'Run (⌘↵)'}</span>
          </button>
        </div>
      </div>

      {/* Editor Body Split */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* SQL Code Input Area */}
        <div className="h-1/2 p-3 bg-surface-base border-b border-border-default flex flex-col font-mono text-xs relative">
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
            className="w-full h-full bg-transparent text-salt resize-none focus:outline-none font-mono text-xs leading-relaxed selection:bg-saffron/30"
          />

          {/* Autocomplete Helper Pills */}
          <div className="flex items-center gap-2 pt-2 border-t border-border-subtle overflow-x-auto text-[11px] font-mono">
            <span className="text-neutral-500">Suggested:</span>
            {['SELECT', 'WHERE', 'JOIN', 'LIMIT 10', 'GROUP BY'].map((keyword) => (
              <button
                key={keyword}
                type="button"
                onClick={() => handleQueryChange(`${activeTab.query}\n${keyword} `)}
                className="px-1.5 py-0.5 rounded bg-surface-raised border border-border-subtle text-neutral-300 hover:text-saffron hover:border-saffron/40 transition-colors"
              >
                +{keyword}
              </button>
            ))}
            <span className="ml-auto text-[10px] text-neutral-500">
              PostgreSQL 17 dialect · Cmd+Enter to run
            </span>
          </div>
        </div>

        {/* Results Pane */}
        <div className="h-1/2 flex flex-col bg-surface-raised min-h-0">
          {/* Results Toolbar */}
          <div className="h-10 border-b border-border-default px-4 flex items-center justify-between bg-surface-base shrink-0 text-xs">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 border-r border-border-default pr-4">
                <button
                  onClick={() => setViewMode('results')}
                  className={`px-2.5 py-1 rounded text-xs font-mono font-medium ${
                    viewMode === 'results' ? 'bg-surface-raised text-salt border border-border-default' : 'text-neutral-400 hover:text-salt'
                  }`}
                >
                  Results ({results.length})
                </button>
                <button
                  onClick={() => setViewMode('explain')}
                  className={`px-2.5 py-1 rounded text-xs font-mono font-medium ${
                    viewMode === 'explain' ? 'bg-surface-raised text-salt border border-border-default' : 'text-neutral-400 hover:text-salt'
                  }`}
                >
                  Explain Plan
                </button>
                <button
                  onClick={() => setViewMode('saved')}
                  className={`px-2.5 py-1 rounded text-xs font-mono font-medium ${
                    viewMode === 'saved' ? 'bg-surface-raised text-salt border border-border-default' : 'text-neutral-400 hover:text-salt'
                  }`}
                >
                  Saved Queries ({savedQueries.length})
                </button>
                <button
                  onClick={() => setViewMode('history')}
                  className={`px-2.5 py-1 rounded text-xs font-mono font-medium ${
                    viewMode === 'history' ? 'bg-surface-raised text-salt border border-border-default' : 'text-neutral-400 hover:text-salt'
                  }`}
                >
                  History ({queryHistory.length})
                </button>
              </div>

              {executionTime !== null && !errorDetails && (
                <div className="flex items-center gap-1.5 font-mono text-xs text-neutral-400">
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
                  toast('Results copied to clipboard (TSV)', 'success');
                }}
                className="p-1 rounded text-neutral-400 hover:text-salt"
                title="Copy TSV"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleExportCsv}
                className="p-1 rounded text-neutral-400 hover:text-salt"
                title="Download CSV"
              >
                <Download className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Results Grid / Explain Plan / Saved / History */}
          <div className="flex-1 overflow-auto">
            {errorDetails ? (
              <div className="p-4 space-y-2">
                <div className="p-3.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-mono flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold">PostgreSQL Execution Error</div>
                    <div className="text-[11px] text-rose-400/90 mt-1">{errorDetails}</div>
                  </div>
                </div>
              </div>
            ) : viewMode === 'results' ? (
              <table className="w-full text-left text-xs border-collapse font-mono">
                <thead className="sticky top-0 bg-surface-base border-b border-border-default text-neutral-400">
                  <tr>
                    <th className="py-2 px-3 border-r border-border-subtle">#</th>
                    <th className="py-2 px-3 border-r border-border-subtle">id</th>
                    <th className="py-2 px-3 border-r border-border-subtle">email</th>
                    <th className="py-2 px-3 border-r border-border-subtle">role</th>
                    <th className="py-2 px-3 border-r border-border-subtle">created_at</th>
                    <th className="py-2 px-3">document_count</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle">
                  {results.map((row, idx) => (
                    <tr key={idx} className="hover:bg-surface-overlay transition-colors">
                      <td className="py-2 px-3 border-r border-border-subtle text-neutral-500">{idx + 1}</td>
                      <td className="py-2 px-3 border-r border-border-subtle text-saffron">{String(row.id)}</td>
                      <td className="py-2 px-3 border-r border-border-subtle text-salt">{String(row.email)}</td>
                      <td className="py-2 px-3 border-r border-border-subtle text-neutral-400">{String(row.role)}</td>
                      <td className="py-2 px-3 border-r border-border-subtle text-neutral-500">{String(row.created_at)}</td>
                      <td className="py-2 px-3 text-salt">{String(row.document_count)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : viewMode === 'explain' ? (
              <div className="p-4 space-y-3 font-mono text-xs">
                <div className="p-3 rounded-lg bg-surface-base border border-border-default text-neutral-300 space-y-1">
                  <div className="text-saffron font-bold">
                    Limit (cost=0.29..4.81 rows=10 width=84) (actual time=0.015..0.022 rows=5 loops=1)
                  </div>
                  <div className="text-neutral-400 pl-4">-&gt; Sort (cost=0.29..0.30 rows=5 width=84)</div>
                  <div className="text-neutral-400 pl-8">-&gt; HashAggregate (cost=0.18..0.23 rows=5 width=84)</div>
                  <div className="text-neutral-400 pl-12">
                    -&gt; Index Scan using users_pkey on users u (cost=0.15..0.17 rows=5 width=76)
                  </div>
                  <div className="text-emerald-400 text-[11px] pt-2">
                    Planning Time: 0.051 ms · Execution Time: 0.038 ms · Buffer hit: 100%
                  </div>
                </div>
              </div>
            ) : viewMode === 'saved' ? (
              <div className="p-4 space-y-2">
                {savedQueries.map((sq) => (
                  <div
                    key={sq.id}
                    className="p-3 rounded-lg bg-surface-base border border-border-subtle flex items-center justify-between hover:border-border-default transition-all"
                  >
                    <div>
                      <div className="text-xs font-semibold text-salt">{sq.name}</div>
                      <div className="text-[11px] text-neutral-400 mt-0.5">{sq.description}</div>
                      <code className="text-[10px] font-mono text-saffron mt-1 block truncate max-w-md">
                        {sq.query}
                      </code>
                    </div>
                    <button
                      onClick={() => {
                        handleQueryChange(sq.query);
                        setViewMode('results');
                        toast(`Loaded saved query: ${sq.name}`, 'info');
                      }}
                      className="px-2.5 py-1 rounded bg-surface-raised border border-border-default text-xs font-mono text-neutral-300 hover:text-salt hover:bg-surface-overlay transition-colors"
                    >
                      Load Query →
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 space-y-2 font-mono text-xs">
                {queryHistory.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-lg bg-surface-base border border-border-subtle flex items-center justify-between"
                  >
                    <div className="min-w-0 pr-4">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[9px] px-1.5 py-0.2 rounded font-bold ${
                            item.status === 'success'
                              ? 'bg-emerald-500/10 text-emerald-400'
                              : 'bg-rose-500/10 text-rose-400'
                          }`}
                        >
                          {item.status.toUpperCase()}
                        </span>
                        <span className="text-[11px] text-neutral-400">{item.timestamp}</span>
                        <span className="text-[11px] text-neutral-500">· {item.durationMs}ms</span>
                        <span className="text-[11px] text-neutral-500">· {item.rowsCount} rows</span>
                      </div>
                      <code className="text-[11px] text-salt mt-1 block truncate max-w-xl">
                        {item.query}
                      </code>
                    </div>
                    <button
                      onClick={() => {
                        handleQueryChange(item.query);
                        setViewMode('results');
                        toast('Restored query from history', 'info');
                      }}
                      className="px-2 py-1 rounded bg-surface-raised border border-border-default text-xs text-neutral-300 hover:text-salt"
                    >
                      Rerun
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
