'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/toast';
import {
  Search,
  Database,
  Terminal,
  Layers,
  Workflow,
  GitBranch,
  Activity,
  Settings,
  Plus,
  Rocket,
  AlertTriangle,
  FolderSync,
  Sparkles,
  ArrowRight,
  X,
  Code2,
  Lock,
  Cpu,
  Radio,
  ListTodo,
  FileText,
} from 'lucide-react';

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
}

interface CommandItem {
  id: string;
  category: 'Navigation' | 'Quick Actions' | 'Environment' | 'Ask VELORA';
  label: string;
  sublabel?: string;
  icon: React.ReactNode;
  keywords?: string;
  href?: string;
  action?: () => void;
}

export function CommandPalette({ open, onClose }: CommandPaletteProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const items: CommandItem[] = [
    // Phase 6 Required Core Actions
    {
      id: 'action-create-table',
      category: 'Quick Actions',
      label: 'Create Table',
      sublabel: 'Add a new PostgreSQL table with schema & RLS rules',
      icon: <Plus className="w-4 h-4 text-saffron" />,
      keywords: 'create table new schema database postgres',
      action: () => {
        toast('Navigating to Table Editor (Create Table mode)', 'info');
        router.push('/dashboard/tables?action=new');
      },
    },
    {
      id: 'action-query-data',
      category: 'Quick Actions',
      label: 'Query Data (Query Studio)',
      sublabel: 'Open real SQL Query Studio with execution and explain plan',
      icon: <Terminal className="w-4 h-4 text-emerald-400" />,
      keywords: 'query data sql studio run execute explain',
      action: () => {
        toast('Opening SQL Query Studio', 'info');
        router.push('/dashboard/sql');
      },
    },
    {
      id: 'action-deploy',
      category: 'Quick Actions',
      label: 'Deploy Preview',
      sublabel: 'Spin up ephemeral staging branch with isolated database',
      icon: <Rocket className="w-4 h-4 text-purple-400" />,
      keywords: 'deploy preview staging container branch k8s',
      action: () => {
        toast('Deploy Preview triggered for main branch: ephemeral host generating', 'success');
        router.push('/dashboard/environments');
      },
    },
    {
      id: 'action-create-workflow',
      category: 'Quick Actions',
      label: 'Create Workflow',
      sublabel: 'Construct automated event trigger pipeline or queue consumer',
      icon: <Workflow className="w-4 h-4 text-sky-400" />,
      keywords: 'create workflow automate cron queue webhook pipeline',
      action: () => {
        toast('Opening Workflow Studio', 'info');
        router.push('/dashboard/workflows');
      },
    },
    {
      id: 'action-inspect-errors',
      category: 'Quick Actions',
      label: 'Inspect Errors & Logs',
      sublabel: 'Jump straight to runtime error stack traces and exceptions',
      icon: <AlertTriangle className="w-4 h-4 text-rose-400" />,
      keywords: 'inspect errors logs fail exception crash trace',
      action: () => {
        toast('Filtering runtime logs by ERROR severity', 'info');
        router.push('/dashboard/observability?tab=logs&filter=error');
      },
    },
    {
      id: 'action-switch-project',
      category: 'Environment',
      label: 'Switch Project',
      sublabel: 'Switch between velora-core and velora-staging workspaces',
      icon: <FolderSync className="w-4 h-4 text-amber-400" />,
      keywords: 'switch project tenant workspace',
      action: () => {
        toast('Active project verified: velora-core (production)', 'success');
      },
    },
    {
      id: 'action-switch-env',
      category: 'Environment',
      label: 'Switch Environment',
      sublabel: 'Toggle active context: Production / Staging / Preview',
      icon: <GitBranch className="w-4 h-4 text-emerald-400" />,
      keywords: 'switch environment prod staging dev preview',
      action: () => {
        toast('Environment context: Production (Live Core iad1)', 'info');
        router.push('/dashboard/environments');
      },
    },
    {
      id: 'action-ask-velora',
      category: 'Ask VELORA',
      label: 'Ask VELORA: "How do I add a vector embedding column?"',
      sublabel: 'Natural language architecture and SQL copilot',
      icon: <Sparkles className="w-4 h-4 text-saffron animate-pulse" />,
      keywords: 'ask velora ai copilot help assistant prompt',
      action: () => {
        toast('VELORA Assistant: "ALTER TABLE docs ADD COLUMN embedding vector(1536); CREATE INDEX ON docs USING hnsw (embedding vector_cosine_ops);"', 'info');
      },
    },

    // Navigation - Primary
    {
      id: 'nav-home',
      category: 'Navigation',
      label: 'Home',
      sublabel: 'Workspace overview, simple health, and recommendations',
      icon: <Activity className="w-4 h-4 text-salt" />,
      href: '/dashboard',
      keywords: 'home dashboard system overview status',
    },
    {
      id: 'nav-data',
      category: 'Navigation',
      label: 'Data (Table Editor)',
      sublabel: 'Browse, edit, and insert rows across all database tables',
      icon: <Database className="w-4 h-4 text-saffron" />,
      href: '/dashboard/tables',
      keywords: 'data tables database rows postgres',
    },
    {
      id: 'nav-build',
      category: 'Navigation',
      label: 'Build (App Builder)',
      sublabel: 'Visual UI builder and rapid full-stack scaffolding',
      icon: <Layers className="w-4 h-4 text-amber-400" />,
      href: '/dashboard/app-builder',
      keywords: 'build app visual scaffolding frontend',
    },
    {
      id: 'nav-automate',
      category: 'Navigation',
      label: 'Automate (Workflows)',
      sublabel: 'Automated background execution, queues, and cron jobs',
      icon: <Workflow className="w-4 h-4 text-sky-400" />,
      href: '/dashboard/workflows',
      keywords: 'automate workflows queues jobs cron',
    },
    {
      id: 'nav-deploy',
      category: 'Navigation',
      label: 'Deploy (Environments)',
      sublabel: 'Manage deployments, Kubernetes clusters, and git branches',
      icon: <GitBranch className="w-4 h-4 text-emerald-400" />,
      href: '/dashboard/environments',
      keywords: 'deploy environments staging production git branches',
    },
    {
      id: 'nav-monitor',
      category: 'Navigation',
      label: 'Monitor (Observability)',
      sublabel: 'Latency percentiles, connection pools, and distributed traces',
      icon: <Activity className="w-4 h-4 text-purple-400" />,
      href: '/dashboard/observability',
      keywords: 'monitor observability traces p95 latency logs metrics',
    },
    {
      id: 'nav-settings',
      category: 'Navigation',
      label: 'Settings',
      sublabel: 'API keys, organization members, and billing tier',
      icon: <Settings className="w-4 h-4 text-neutral-400" />,
      href: '/dashboard/settings',
      keywords: 'settings api keys org members billing config',
    },

    // Developer Tools
    {
      id: 'nav-functions',
      category: 'Navigation',
      label: 'Edge Functions',
      sublabel: 'WASM edge microservices with sub-5ms cold start',
      icon: <Cpu className="w-4 h-4 text-purple-400" />,
      href: '/dashboard/functions',
      keywords: 'functions edge wasm serverless lambda',
    },
    {
      id: 'nav-realtime',
      category: 'Navigation',
      label: 'Realtime WebSocket',
      sublabel: 'Presence, broadcast channels, and Postgres CDC replication',
      icon: <Radio className="w-4 h-4 text-sky-400" />,
      href: '/dashboard/realtime',
      keywords: 'realtime websocket broadcast presence pubsub',
    },
    {
      id: 'nav-queues',
      category: 'Navigation',
      label: 'Message Queues',
      sublabel: 'Dead-letter queues, retries, and async workers',
      icon: <ListTodo className="w-4 h-4 text-amber-400" />,
      href: '/dashboard/queues',
      keywords: 'queues messages async workers rabbitmq redis',
    },
    {
      id: 'nav-secrets',
      category: 'Navigation',
      label: 'Vault & Secrets',
      sublabel: 'Encrypted environment variables and KMS certificates',
      icon: <Lock className="w-4 h-4 text-rose-400" />,
      href: '/dashboard/secrets',
      keywords: 'secrets vault environment variables keys env',
    },
  ];

  const filtered = items.filter((item) => {
    const q = query.toLowerCase().trim();
    if (!q) return true;
    return (
      item.label.toLowerCase().includes(q) ||
      (item.sublabel && item.sublabel.toLowerCase().includes(q)) ||
      item.category.toLowerCase().includes(q) ||
      (item.keywords && item.keywords.toLowerCase().includes(q))
    );
  });

  useEffect(() => {
    if (open) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!open) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % (filtered.length || 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filtered.length) % (filtered.length || 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const selected = filtered[selectedIndex];
        if (selected) {
          if (selected.action) {
            selected.action();
            onClose();
          } else if (selected.href) {
            router.push(selected.href);
            onClose();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, filtered, selectedIndex, router, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl bg-surface-raised border border-border-default rounded-xl shadow-2xl overflow-hidden flex flex-col z-10 animate-in fade-in zoom-in-95 duration-150">
        {/* Search Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-border-default gap-3 bg-surface-base">
          <Search className="w-4 h-4 text-saffron shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Type a command, query, deploy, create table, or ask VELORA..."
            className="flex-1 bg-transparent text-salt placeholder-neutral-500 text-xs focus:outline-none font-mono"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-neutral-400 hover:text-salt p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono text-neutral-400 bg-surface-raised rounded border border-border-subtle">
            ESC
          </kbd>
        </div>

        {/* Dynamic Ask VELORA Banner if user types a question */}
        {query.endsWith('?') && (
          <div
            onClick={() => {
              toast(`VELORA Copilot analyzing intent: "${query}"`, 'info');
              onClose();
            }}
            className="px-4 py-2 bg-saffron-subtle/40 border-b border-saffron/20 flex items-center justify-between text-xs cursor-pointer hover:bg-saffron-subtle/60 transition-colors"
          >
            <div className="flex items-center gap-2 text-saffron font-medium">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              <span>Ask VELORA Copilot: &ldquo;{query}&rdquo;</span>
            </div>
            <span className="text-[10px] font-mono text-saffron/80">Press ↵</span>
          </div>
        )}

        {/* Results List */}
        <div className="max-h-[380px] overflow-y-auto p-2 space-y-1">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-xs text-neutral-500 font-mono">
              No matching command found for &ldquo;{query}&rdquo;
            </div>
          ) : (
            filtered.map((item, index) => {
              const isSelected = index === selectedIndex;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.action) {
                      item.action();
                      onClose();
                    } else if (item.href) {
                      router.push(item.href);
                      onClose();
                    }
                  }}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`w-full text-left px-3 py-2 rounded-lg flex items-center justify-between transition-colors ${
                    isSelected
                      ? 'bg-saffron-subtle/40 text-salt border border-saffron/30'
                      : 'hover:bg-surface-overlay text-neutral-300 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-1.5 rounded-md bg-surface-base border border-border-subtle shrink-0">
                      {item.icon}
                    </div>
                    <div className="truncate">
                      <div className="text-xs font-medium text-salt flex items-center gap-2">
                        <span>{item.label}</span>
                        <span className="text-[9px] font-mono text-neutral-400 bg-surface-base px-1.5 py-0.2 rounded border border-border-subtle">
                          {item.category}
                        </span>
                      </div>
                      {item.sublabel && (
                        <div className="text-[11px] text-neutral-400 truncate">
                          {item.sublabel}
                        </div>
                      )}
                    </div>
                  </div>
                  {isSelected && (
                    <ArrowRight className="w-3.5 h-3.5 text-saffron shrink-0 ml-2" />
                  )}
                </button>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2.5 bg-surface-base border-t border-border-default flex items-center justify-between text-[11px] text-neutral-500 font-mono">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <kbd className="px-1 py-0.5 bg-surface-raised rounded border border-border-subtle">↑</kbd>
              <kbd className="px-1 py-0.5 bg-surface-raised rounded border border-border-subtle">↓</kbd>
              <span>navigate</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1 py-0.5 bg-surface-raised rounded border border-border-subtle">↵</kbd>
              <span>select</span>
            </span>
          </div>
          <div>
            <span>Cmd/Ctrl+K</span>
          </div>
        </div>
      </div>
    </div>
  );
}
