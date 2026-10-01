import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  Database,
  Layers,
  Workflow,
  GitBranch,
  Activity,
  Settings,
  Terminal,
  Plug,
  Cpu,
  Radio,
  ListTodo,
  Search,
  Brain,
  FileText,
  LineChart,
  Network,
  Server,
  Scale,
  Lock,
  ChevronDown,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
  Code2,
} from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: string;
}

const primaryNav: NavItem[] = [
  { label: 'Home', href: '/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
  { label: 'Data', href: '/dashboard/tables', icon: <Database className="w-4 h-4" /> },
  { label: 'Build', href: '/dashboard/app-builder', icon: <Layers className="w-4 h-4" /> },
  { label: 'Automate', href: '/dashboard/workflows', icon: <Workflow className="w-4 h-4" /> },
  { label: 'Deploy', href: '/dashboard/environments', icon: <GitBranch className="w-4 h-4" /> },
  { label: 'Monitor', href: '/dashboard/observability', icon: <Activity className="w-4 h-4" /> },
  { label: 'Settings', href: '/dashboard/settings', icon: <Settings className="w-4 h-4" /> },
];

const developerTools: NavItem[] = [
  { label: 'SQL Editor', href: '/dashboard/sql', icon: <Terminal className="w-4 h-4 text-saffron" /> },
  { label: 'API Explorer', href: '/dashboard/integrations', icon: <Plug className="w-4 h-4" /> },
  { label: 'Functions', href: '/dashboard/functions', icon: <Cpu className="w-4 h-4" /> },
  { label: 'Realtime', href: '/dashboard/realtime', icon: <Radio className="w-4 h-4" /> },
  { label: 'Queues', href: '/dashboard/queues', icon: <ListTodo className="w-4 h-4" /> },
  { label: 'Search & Vectors', href: '/dashboard/search', icon: <Search className="w-4 h-4" /> },
  { label: 'AI Gateway', href: '/dashboard/ai', icon: <Brain className="w-4 h-4" /> },
  { label: 'Logs', href: '/dashboard/observability?tab=logs', icon: <FileText className="w-4 h-4" /> },
  { label: 'Metrics', href: '/dashboard/observability?tab=metrics', icon: <LineChart className="w-4 h-4" /> },
  { label: 'Traces', href: '/dashboard/observability?tab=traces', icon: <Network className="w-4 h-4" /> },
  { label: 'Infrastructure', href: '/dashboard/backups', icon: <Server className="w-4 h-4" /> },
  { label: 'Policies', href: '/dashboard/policies', icon: <Scale className="w-4 h-4" /> },
  { label: 'Secrets', href: '/dashboard/secrets', icon: <Lock className="w-4 h-4" /> },
];

export function Sidebar({
  collapsed,
  onToggleCollapse,
}: {
  collapsed: boolean;
  onToggleCollapse: () => void;
}) {
  const pathname = usePathname();
  const [devToolsOpen, setDevToolsOpen] = useState(false);

  // Auto-expand dev tools if user is directly on one of the developer tool pages
  useEffect(() => {
    const isDevPage = developerTools.some((tool) => {
      const toolBase = tool.href.split('?')[0];
      return pathname.startsWith(toolBase!) && toolBase !== '/dashboard';
    });
    if (isDevPage) {
      setDevToolsOpen(true);
    }
  }, [pathname]);

  return (
    <aside
      className={`flex flex-col bg-surface-raised border-r border-border-subtle transition-all flex-shrink-0 select-none ${
        collapsed ? 'w-16' : 'w-60'
      }`}
      style={{ transitionDuration: 'var(--duration-normal)' }}
    >
      {/* Brand Header */}
      <div className="h-14 flex items-center px-4 border-b border-border-subtle gap-3">
        <Link href="/dashboard" className="flex items-center gap-2.5 group">
          <div className="w-7 h-7 rounded-md bg-saffron flex items-center justify-center flex-shrink-0 shadow-saffron-sm group-hover:bg-saffron-hover transition-colors">
            <svg width="14" height="14" viewBox="0 0 32 32" fill="none">
              <path
                d="M8 8L16 24L24 8"
                stroke="var(--color-basalt)"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          {!collapsed && (
            <div className="flex items-center gap-2">
              <span className="font-display text-sm font-bold tracking-wide text-salt">
                VELORA
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-medium bg-saffron/10 text-saffron border border-saffron/20">
                Console
              </span>
            </div>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-6">
        {/* Simple Mode: Primary Navigation */}
        <div>
          {!collapsed && (
            <div className="px-2.5 mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-neutral-500">
              Workspace
            </div>
          )}
          <div className="space-y-0.5">
            {primaryNav.map((item) => {
              const isActive =
                item.href === '/dashboard'
                  ? pathname === '/dashboard'
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium transition-colors group ${
                    isActive
                      ? 'bg-saffron-subtle text-saffron font-semibold'
                      : 'text-neutral-400 hover:text-salt hover:bg-surface-overlay/50'
                  } ${collapsed ? 'justify-center' : ''}`}
                  title={collapsed ? item.label : undefined}
                >
                  <span
                    className={`flex-shrink-0 ${
                      isActive ? 'text-saffron' : 'text-neutral-500 group-hover:text-neutral-300'
                    }`}
                  >
                    {item.icon}
                  </span>
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Progressive Disclosure: Collapsible Developer Tools */}
        <div>
          {!collapsed ? (
            <button
              type="button"
              onClick={() => setDevToolsOpen(!devToolsOpen)}
              className="w-full flex items-center justify-between px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-neutral-500 hover:text-neutral-300 transition-colors group"
            >
              <div className="flex items-center gap-1.5">
                <Code2 className="w-3 h-3 text-neutral-500 group-hover:text-saffron transition-colors" />
                <span>Developer Tools</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-surface-base border border-border-subtle text-neutral-400">
                  {developerTools.length}
                </span>
                {devToolsOpen ? (
                  <ChevronDown className="w-3 h-3 text-neutral-500" />
                ) : (
                  <ChevronRight className="w-3 h-3 text-neutral-500" />
                )}
              </div>
            </button>
          ) : (
            <div className="h-px bg-border-subtle my-2 mx-1" />
          )}

          {/* Dev tools items */}
          {(!collapsed ? devToolsOpen : true) && (
            <div className="space-y-0.5 mt-1 animate-in fade-in duration-150">
              {developerTools.map((tool) => {
                const toolBase = tool.href.split('?')[0];
                const isActive = pathname === toolBase;

                return (
                  <Link
                    key={tool.href}
                    href={tool.href}
                    className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors group ${
                      isActive
                        ? 'bg-saffron-subtle text-saffron font-semibold'
                        : 'text-neutral-400 hover:text-salt hover:bg-surface-overlay/50'
                    } ${collapsed ? 'justify-center' : ''}`}
                    title={collapsed ? tool.label : undefined}
                  >
                    <span
                      className={`flex-shrink-0 ${
                        isActive ? 'text-saffron' : 'text-neutral-500 group-hover:text-neutral-300'
                      }`}
                    >
                      {tool.icon}
                    </span>
                    {!collapsed && <span className="truncate">{tool.label}</span>}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </nav>

      {/* Footer: Demo badge & Collapse toggle */}
      <div className="border-t border-border-subtle px-3 py-3 space-y-2">
        {!collapsed && (
          <div className="p-2 rounded-lg bg-surface-base border border-border-subtle space-y-1">
            <div className="flex items-center justify-between text-[10px] font-mono">
              <span className="text-neutral-400">Environment</span>
              <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Core
              </span>
            </div>
            <div className="text-[10px] font-mono text-neutral-500 truncate">
              project: velora-core
            </div>
          </div>
        )}

        <button
          onClick={onToggleCollapse}
          className="w-full flex items-center justify-center gap-2 px-2 py-1.5 rounded-md text-neutral-500 hover:text-salt hover:bg-surface-overlay/50 transition-colors"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? (
            <PanelLeftOpen className="w-4 h-4" />
          ) : (
            <>
              <PanelLeftClose className="w-4 h-4" />
              <span className="text-xs">Collapse Sidebar</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
