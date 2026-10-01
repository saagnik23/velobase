'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search,
  Bell,
  ChevronDown,
  Layers,
  GitBranch,
  Activity,
  Plus,
  HelpCircle,
  ExternalLink,
  CheckCircle2,
  X,
  User,
  Settings,
  LogOut,
  CreditCard,
  Shield,
} from 'lucide-react';

interface TopBarProps {
  onOpenCmd: () => void;
}

function useClickOutside(ref: React.RefObject<HTMLElement | null>, handler: () => void) {
  useEffect(() => {
    const listener = (e: MouseEvent) => {
      if (!ref.current || ref.current.contains(e.target as Node)) return;
      handler();
    };
    document.addEventListener('mousedown', listener);
    return () => document.removeEventListener('mousedown', listener);
  }, [ref, handler]);
}

export function TopBar({ onOpenCmd }: TopBarProps) {
  const router = useRouter();
  const [projectOpen, setProjectOpen] = useState(false);
  const [envOpen, setEnvOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [selectedEnv, setSelectedEnv] = useState('production');

  const projectRef = useRef<HTMLDivElement>(null);
  const envRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useClickOutside(projectRef, () => setProjectOpen(false));
  useClickOutside(envRef, () => setEnvOpen(false));
  useClickOutside(notifRef, () => setNotifOpen(false));
  useClickOutside(profileRef, () => setProfileOpen(false));

  // Global Escape key handler for all dropdowns
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setProjectOpen(false);
        setEnvOpen(false);
        setNotifOpen(false);
        setProfileOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const environments = [
    { id: 'production', label: 'production', region: 'iad1 (us-east)', p95: '1.2ms', isProd: true },
    { id: 'staging', label: 'staging-v2.4', region: 'iad1 (us-east)', p95: '1.5ms', isProd: false },
    { id: 'dev-preview', label: 'feat-vector-search', region: 'sfo1 (us-west)', p95: '2.1ms', isProd: false },
  ];

  const notifications = [
    { id: 'n1', title: 'Backup completed', desc: 'Full WAL archive snapshot restored successfully', time: '2 mins ago', read: false },
    { id: 'n2', title: 'New deployment ready', desc: 'v2.4.1 passed CI and is staged for preview', time: '15 mins ago', read: false },
    { id: 'n3', title: 'Index migration finished', desc: 'idx_docs_org_created applied with zero downtime', time: '1 hour ago', read: true },
  ];

  return (
    <header className="h-14 border-b border-white/[0.08] bg-basalt/80 backdrop-blur-md px-4 flex items-center justify-between gap-4 select-none shrink-0 z-20">
      {/* Left side: Project & Environment Switcher */}
      <div className="flex items-center gap-2">
        {/* Project Selector */}
        <div className="relative" ref={projectRef}>
          <button
            onClick={() => {
              setProjectOpen(!projectOpen);
              setEnvOpen(false);
            }}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-md hover:bg-white/[0.05] transition-colors text-sm font-medium text-white/90"
          >
            <div className="w-5 h-5 rounded bg-saffron/20 border border-saffron/40 flex items-center justify-center text-saffron text-xs font-mono font-bold">
              V
            </div>
            <span className="font-semibold text-white">velora-core</span>
            <span className="text-white/40">/</span>
            <span className="text-white/70">main</span>
            <ChevronDown className={`w-3.5 h-3.5 text-white/40 ml-0.5 transition-transform ${projectOpen ? 'rotate-180' : ''}`} />
          </button>

          {projectOpen && (
            <div className="absolute left-0 mt-1.5 w-64 rounded-lg bg-surface border border-white/[0.1] shadow-2xl p-1 z-50">
              <div className="px-2 py-1.5 text-[11px] font-mono uppercase tracking-wider text-white/40">
                Switch project
              </div>
              <button
                onClick={() => setProjectOpen(false)}
                className="w-full text-left px-2.5 py-1.5 rounded text-xs text-white bg-white/[0.06] flex items-center justify-between"
              >
                <span className="font-medium">velora-core</span>
                <span className="text-[10px] font-mono text-saffron bg-saffron/10 px-1.5 py-0.5 rounded">Active</span>
              </button>
              <button
                onClick={() => setProjectOpen(false)}
                className="w-full text-left px-2.5 py-1.5 rounded text-xs text-white/70 hover:bg-white/[0.04] flex items-center justify-between"
              >
                <span>payments-engine</span>
                <span className="text-[10px] font-mono text-white/30">Free</span>
              </button>
              <div className="my-1 border-t border-white/[0.06]" />
              <button
                onClick={() => setProjectOpen(false)}
                className="w-full text-left px-2.5 py-1.5 rounded text-xs text-saffron hover:bg-saffron/10 flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create new project</span>
              </button>
            </div>
          )}
        </div>

        <span className="text-white/20">/</span>

        {/* Environment selector */}
        <div className="relative" ref={envRef}>
          <button
            onClick={() => {
              setEnvOpen(!envOpen);
              setProjectOpen(false);
            }}
            className="flex items-center gap-1.5 px-2 py-1 rounded text-xs font-mono bg-white/[0.04] border border-white/[0.08] hover:border-white/[0.15] text-white/80 transition-colors"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>{selectedEnv}</span>
            <ChevronDown className={`w-3 h-3 text-white/40 transition-transform ${envOpen ? 'rotate-180' : ''}`} />
          </button>

          {envOpen && (
            <div className="absolute left-0 mt-1.5 w-60 rounded-lg bg-surface border border-white/[0.1] shadow-2xl p-1 z-50">
              <div className="px-2 py-1.5 text-[11px] font-mono uppercase tracking-wider text-white/40">
                Environments
              </div>
              {environments.map((env) => (
                <button
                  key={env.id}
                  onClick={() => {
                    setSelectedEnv(env.id);
                    setEnvOpen(false);
                  }}
                  className={`w-full text-left px-2.5 py-2 rounded text-xs flex items-center justify-between transition-colors ${
                    selectedEnv === env.id ? 'bg-white/[0.08] text-white' : 'text-white/70 hover:bg-white/[0.04]'
                  }`}
                >
                  <div className="flex flex-col">
                    <span className="font-mono font-medium">{env.label}</span>
                    <span className="text-[10px] text-white/40">{env.region}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-mono text-emerald-400">{env.p95}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Center: Command Palette Trigger */}
      <div className="flex-1 max-w-md">
        <button
          onClick={onOpenCmd}
          className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] hover:border-white/[0.16] hover:bg-white/[0.06] transition-all text-xs text-white/50 group cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-white/40 group-hover:text-saffron transition-colors" />
            <span>Search docs, tables, APIs, commands...</span>
          </div>
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-mono bg-white/[0.06] border border-white/[0.08] text-white/60">
            <span>⌘</span>
            <span>K</span>
          </kbd>
        </button>
      </div>

      {/* Right side: Global Health + Actions + Profile */}
      <div className="flex items-center gap-3">
        {/* Latency Indicator */}
        <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-md bg-white/[0.03] border border-white/[0.06] text-xs font-mono">
          <Activity className="w-3.5 h-3.5 text-saffron" />
          <span className="text-white/40">p95</span>
          <span className="text-emerald-400 font-bold">1.2ms</span>
          <span className="text-white/20">|</span>
          <span className="text-white/40">QPS</span>
          <span className="text-white/90">24.8k</span>
        </div>

        {/* Documentation Link */}
        <Link
          href="/dashboard/settings"
          className="hidden sm:flex items-center gap-1 text-xs text-white/60 hover:text-white transition-colors px-2 py-1"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Docs</span>
        </Link>

        {/* Notification Bell */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => {
              setNotifOpen(!notifOpen);
              setProfileOpen(false);
            }}
            className="relative p-1.5 rounded-md hover:bg-white/[0.06] text-white/60 hover:text-white transition-colors"
          >
            <Bell className="w-4 h-4" />
            {notifications.some((n) => !n.read) && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-saffron" />
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-1.5 w-80 rounded-lg bg-surface border border-white/[0.1] shadow-2xl z-50 overflow-hidden">
              <div className="px-4 py-2.5 border-b border-white/[0.08] flex items-center justify-between">
                <span className="text-xs font-mono font-semibold text-white">Notifications</span>
                <button
                  onClick={() => setNotifOpen(false)}
                  className="text-white/40 hover:text-white p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`px-4 py-3 border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors cursor-pointer ${
                      !n.read ? 'bg-saffron/5' : ''
                    }`}
                    onClick={() => setNotifOpen(false)}
                  >
                    <div className="flex items-center gap-2">
                      {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-saffron shrink-0" />}
                      <span className="text-xs font-medium text-white">{n.title}</span>
                    </div>
                    <p className="text-[11px] text-white/50 mt-0.5 ml-3.5">{n.desc}</p>
                    <span className="text-[10px] font-mono text-white/30 mt-1 ml-3.5 block">{n.time}</span>
                  </div>
                ))}
              </div>
              <div className="px-4 py-2 bg-white/[0.02] border-t border-white/[0.06]">
                <button className="text-xs text-saffron hover:underline font-medium w-full text-center">
                  View all notifications
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Avatar & Profile */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => {
              setProfileOpen(!profileOpen);
              setNotifOpen(false);
            }}
            className="flex items-center gap-2 pl-2 border-l border-white/[0.08]"
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-saffron to-amber-200 text-basalt flex items-center justify-center font-bold text-xs ring-1 ring-white/20 hover:ring-white/40 transition-all cursor-pointer">
              SD
            </div>
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-1.5 w-56 rounded-lg bg-surface border border-white/[0.1] shadow-2xl p-1 z-50">
              <div className="px-3 py-2 border-b border-white/[0.06]">
                <div className="text-xs font-medium text-white">Saagnik Dey</div>
                <div className="text-[11px] text-white/40 font-mono">saagnik@velora.dev</div>
              </div>
              <div className="py-1">
                <button
                  onClick={() => { setProfileOpen(false); router.push('/dashboard/settings'); }}
                  className="w-full text-left px-3 py-1.5 rounded text-xs text-white/70 hover:bg-white/[0.04] flex items-center gap-2"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Profile</span>
                </button>
                <button
                  onClick={() => { setProfileOpen(false); router.push('/dashboard/settings'); }}
                  className="w-full text-left px-3 py-1.5 rounded text-xs text-white/70 hover:bg-white/[0.04] flex items-center gap-2"
                >
                  <Settings className="w-3.5 h-3.5" />
                  <span>Settings</span>
                </button>
                <button
                  onClick={() => { setProfileOpen(false); router.push('/dashboard/cost'); }}
                  className="w-full text-left px-3 py-1.5 rounded text-xs text-white/70 hover:bg-white/[0.04] flex items-center gap-2"
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Billing</span>
                </button>
              </div>
              <div className="border-t border-white/[0.06] pt-1">
                <button
                  onClick={() => { setProfileOpen(false); router.push('/login'); }}
                  className="w-full text-left px-3 py-1.5 rounded text-xs text-rose-400 hover:bg-rose-500/10 flex items-center gap-2"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
