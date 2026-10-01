'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  Database,
  Terminal,
  Shield,
  Scale,
  HardDrive,
  Radio,
  Cpu,
  ListTodo,
  Workflow,
  Search,
  Brain,
  AppWindow,
  GitBranch,
  Plug,
  Eye,
  DollarSign,
  RotateCcw,
  Lightbulb,
  ArrowLeftRight,
  Lock,
  Settings,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

const navigation: NavGroup[] = [
  {
    title: 'Platform',
    items: [
      { label: 'Home', href: '/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
      { label: 'Table editor', href: '/dashboard/tables', icon: <Database className="w-4 h-4" /> },
      { label: 'SQL editor', href: '/dashboard/sql', icon: <Terminal className="w-4 h-4" /> },
      { label: 'Authentication', href: '/dashboard/auth', icon: <Shield className="w-4 h-4" /> },
      { label: 'Policies', href: '/dashboard/policies', icon: <Scale className="w-4 h-4" /> },
      { label: 'Storage', href: '/dashboard/storage', icon: <HardDrive className="w-4 h-4" /> },
      { label: 'Realtime', href: '/dashboard/realtime', icon: <Radio className="w-4 h-4" /> },
      { label: 'Functions', href: '/dashboard/functions', icon: <Cpu className="w-4 h-4" /> },
      { label: 'Queues', href: '/dashboard/queues', icon: <ListTodo className="w-4 h-4" /> },
      { label: 'Workflows', href: '/dashboard/workflows', icon: <Workflow className="w-4 h-4" /> },
      { label: 'Search and vectors', href: '/dashboard/search', icon: <Search className="w-4 h-4" /> },
      { label: 'AI gateway', href: '/dashboard/ai', icon: <Brain className="w-4 h-4" /> },
      { label: 'App builder', href: '/dashboard/app-builder', icon: <AppWindow className="w-4 h-4" /> },
    ],
  },
  {
    title: 'Operate',
    items: [
      { label: 'Environments', href: '/dashboard/environments', icon: <GitBranch className="w-4 h-4" /> },
      { label: 'Integrations', href: '/dashboard/integrations', icon: <Plug className="w-4 h-4" /> },
      { label: 'Observability', href: '/dashboard/observability', icon: <Eye className="w-4 h-4" /> },
      { label: 'Cost', href: '/dashboard/cost', icon: <DollarSign className="w-4 h-4" /> },
      { label: 'Backups and recovery', href: '/dashboard/backups', icon: <RotateCcw className="w-4 h-4" /> },
      { label: 'Advisors', href: '/dashboard/advisors', icon: <Lightbulb className="w-4 h-4" /> },
      { label: 'Migration center', href: '/dashboard/migration', icon: <ArrowLeftRight className="w-4 h-4" /> },
      { label: 'Secrets', href: '/dashboard/secrets', icon: <Lock className="w-4 h-4" /> },
      { label: 'Settings', href: '/dashboard/settings', icon: <Settings className="w-4 h-4" /> },
    ],
  },
];

export function Sidebar({
  collapsed,
  onToggleCollapse,
}: {
  collapsed: boolean;
  onToggleCollapse: () => void;
}) {
  const pathname = usePathname();

  return (
    <aside
      className={`flex flex-col bg-surface-raised border-r border-border-subtle transition-all flex-shrink-0 ${
        collapsed ? 'w-16' : 'w-60'
      }`}
      style={{ transitionDuration: 'var(--duration-normal)' }}
    >
      {/* Brand */}
      <div className="h-14 flex items-center px-4 border-b border-border-subtle gap-3">
        <div className="w-7 h-7 rounded-md bg-saffron flex items-center justify-center flex-shrink-0 shadow-saffron-sm">
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
          <span className="font-display text-sm font-bold tracking-wide text-salt">
            VELORA
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-6">
        {navigation.map((group) => (
          <div key={group.title}>
            {!collapsed && (
              <div className="px-2 mb-2 text-[10px] font-semibold uppercase tracking-wider text-neutral-500">
                {group.title}
              </div>
            )}
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const isActive =
                  item.href === '/dashboard'
                    ? pathname === '/dashboard'
                    : pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-[13px] font-medium transition-colors group ${
                      isActive
                        ? 'bg-saffron-subtle text-saffron'
                        : 'text-neutral-400 hover:text-salt hover:bg-surface-overlay/50'
                    } ${collapsed ? 'justify-center' : ''}`}
                    style={{ transitionDuration: 'var(--duration-fast)' }}
                    title={collapsed ? item.label : undefined}
                  >
                    <span
                      className={`flex-shrink-0 ${
                        isActive ? 'text-saffron' : 'text-neutral-500 group-hover:text-neutral-300'
                      }`}
                    >
                      {item.icon}
                    </span>
                    {!collapsed && <span>{item.label}</span>}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer: environment + collapse toggle */}
      <div className="border-t border-border-subtle px-3 py-3 space-y-2">
        {!collapsed && (
          <div className="flex items-center gap-2 px-1">
            <div className="w-2 h-2 rounded-full bg-moss shadow-[0_0_6px_rgba(47,107,79,0.6)]" />
            <span className="text-[11px] font-mono text-moss">
              prod-core (v1.0)
            </span>
          </div>
        )}
        <button
          onClick={onToggleCollapse}
          className="w-full flex items-center justify-center gap-2 px-2 py-1.5 rounded-md text-neutral-500 hover:text-salt hover:bg-surface-overlay/50 transition-colors"
          style={{ transitionDuration: 'var(--duration-fast)' }}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? (
            <PanelLeftOpen className="w-4 h-4" />
          ) : (
            <>
              <PanelLeftClose className="w-4 h-4" />
              <span className="text-xs">Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
