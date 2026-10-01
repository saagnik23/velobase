'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  Database,
  Terminal,
  Shield,
  HardDrive,
  Cpu,
  Brain,
  Plus,
  Key,
  Flame,
  ArrowRight,
  Workflow,
  Radio,
  Settings,
  X,
} from 'lucide-react';

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
}

interface CommandItem {
  id: string;
  category: 'Navigation' | 'Actions' | 'Copilot';
  label: string;
  sublabel?: string;
  icon: React.ReactNode;
  href?: string;
  action?: () => void;
}

export function CommandPalette({ open, onClose }: CommandPaletteProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const items: CommandItem[] = [
    {
      id: 'nav-tables',
      category: 'Navigation',
      label: 'Table editor',
      sublabel: 'View, edit and mutate database rows',
      icon: <Database className="w-4 h-4 text-saffron" />,
      href: '/dashboard/tables',
    },
    {
      id: 'nav-sql',
      category: 'Navigation',
      label: 'SQL query studio',
      sublabel: 'Monaco editor with zero-latency execution',
      icon: <Terminal className="w-4 h-4 text-emerald-400" />,
      href: '/dashboard/sql',
    },
    {
      id: 'nav-auth',
      category: 'Navigation',
      label: 'Authentication & users',
      sublabel: 'Manage user directories, providers & sessions',
      icon: <Shield className="w-4 h-4 text-sky-400" />,
      href: '/dashboard/auth',
    },
    {
      id: 'nav-storage',
      category: 'Navigation',
      label: 'Object storage',
      sublabel: 'S3-compatible buckets with CDN replication',
      icon: <HardDrive className="w-4 h-4 text-amber-400" />,
      href: '/dashboard/storage',
    },
    {
      id: 'nav-functions',
      category: 'Navigation',
      label: 'Serverless functions',
      sublabel: 'Edge & node execution with sub-5ms cold start',
      icon: <Cpu className="w-4 h-4 text-purple-400" />,
      href: '/dashboard/functions',
    },
    {
      id: 'nav-ai',
      category: 'Navigation',
      label: 'AI gateway & embeddings',
      sublabel: 'Unified LLM routing, caching & vector stores',
      icon: <Brain className="w-4 h-4 text-rose-400" />,
      href: '/dashboard/ai',
    },
    {
      id: 'action-create-table',
      category: 'Actions',
      label: 'Create new table',
      sublabel: 'Define columns, constraints, and RLS policies',
      icon: <Plus className="w-4 h-4 text-saffron" />,
      href: '/dashboard/tables?action=create',
    },
    {
      id: 'action-create-key',
      category: 'Actions',
      label: 'Generate API key',
      sublabel: 'Publishable or secret service-role token',
      icon: <Key className="w-4 h-4 text-amber-400" />,
      href: '/dashboard/settings/api-keys',
    },
    {
      id: 'action-copilot',
      category: 'Copilot',
      label: 'Ask VELORA Copilot: "Generate vector search migration"',
      sublabel: 'AI architectural synthesis engine',
      icon: <Flame className="w-4 h-4 text-saffron animate-pulse" />,
      action: () => {
        alert('VELORA Copilot synthesis triggered.');
      },
    },
  ];

  const filtered = items.filter((item) =>
    item.label.toLowerCase().includes(query.toLowerCase()) ||
    (item.sublabel && item.sublabel.toLowerCase().includes(query.toLowerCase())) ||
    item.category.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelectedIndex(0);
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
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl bg-basalt border border-white/[0.12] rounded-xl shadow-2xl overflow-hidden flex flex-col z-10 animate-in fade-in zoom-in-95 duration-150">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-white/[0.08] gap-3">
          <Search className="w-5 h-5 text-saffron shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Type a command, search tables, or ask Copilot..."
            className="flex-1 bg-transparent text-white placeholder-white/40 text-sm focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-white/40 hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono text-white/40 bg-white/[0.06] rounded border border-white/[0.08]">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-[380px] overflow-y-auto p-2 space-y-1">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-sm text-white/40">
              No results found for &ldquo;{query}&rdquo;
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
                  className={`w-full text-left px-3 py-2.5 rounded-lg flex items-center justify-between transition-colors ${
                    isSelected
                      ? 'bg-saffron/15 text-white border border-saffron/30'
                      : 'hover:bg-white/[0.04] text-white/80 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-1.5 rounded-md bg-white/[0.06] shrink-0">
                      {item.icon}
                    </div>
                    <div className="truncate">
                      <div className="text-xs font-medium text-white flex items-center gap-2">
                        <span>{item.label}</span>
                        <span className="text-[10px] font-mono text-white/40 bg-white/[0.06] px-1.5 py-0.2 rounded">
                          {item.category}
                        </span>
                      </div>
                      {item.sublabel && (
                        <div className="text-[11px] text-white/40 truncate">
                          {item.sublabel}
                        </div>
                      )}
                    </div>
                  </div>
                  {isSelected && (
                    <ArrowRight className="w-4 h-4 text-saffron shrink-0 ml-2" />
                  )}
                </button>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2.5 bg-white/[0.02] border-t border-white/[0.06] flex items-center justify-between text-[11px] text-white/40 font-mono">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <kbd className="px-1 py-0.5 bg-white/[0.06] rounded">↑</kbd>
              <kbd className="px-1 py-0.5 bg-white/[0.06] rounded">↓</kbd>
              <span>to navigate</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1 py-0.5 bg-white/[0.06] rounded">↵</kbd>
              <span>to select</span>
            </span>
          </div>
          <div>
            <span>VELORA Command Palette</span>
          </div>
        </div>
      </div>
    </div>
  );
}
