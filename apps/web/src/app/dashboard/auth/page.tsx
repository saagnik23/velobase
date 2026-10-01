'use client';

import { useState } from 'react';
import {
  Shield,
  Users,
  Key,
  Lock,
  Mail,
  Search,
  Plus,
  CheckCircle2,
  AlertCircle,
  MoreVertical,
  Fingerprint,
  Github,
  Chrome,
  KeyRound,
  Trash2,
  Ban,
  UserCheck,
} from 'lucide-react';

interface AuthUser {
  id: string;
  email: string;
  providers: ('github' | 'google' | 'email' | 'passkey')[];
  mfaEnabled: boolean;
  status: 'active' | 'banned' | 'invited';
  createdAt: string;
  lastSignIn: string;
}

const mockAuthUsers: AuthUser[] = [
  { id: 'usr_89f02a', email: 'alice.vance@acme.dev', providers: ['github', 'passkey'], mfaEnabled: true, status: 'active', createdAt: '2026-09-01', lastSignIn: '2 mins ago' },
  { id: 'usr_31c84b', email: 'marcus.chen@stripe.com', providers: ['google'], mfaEnabled: true, status: 'active', createdAt: '2026-09-04', lastSignIn: '1 hour ago' },
  { id: 'usr_72b19e', email: 'elena.rostova@datadog.io', providers: ['email', 'passkey'], mfaEnabled: true, status: 'active', createdAt: '2026-09-10', lastSignIn: 'Yesterday' },
  { id: 'usr_45d610', email: 'david.kim@anthropic.com', providers: ['github'], mfaEnabled: false, status: 'active', createdAt: '2026-09-12', lastSignIn: '3 days ago' },
  { id: 'usr_90a12e', email: 'contractor@temp.net', providers: ['email'], mfaEnabled: false, status: 'banned', createdAt: '2026-09-18', lastSignIn: 'Never' },
];

export default function AuthDashboardPage() {
  const [tab, setTab] = useState<'users' | 'providers' | 'policies'>('users');
  const [users, setUsers] = useState<AuthUser[]>(mockAuthUsers);
  const [search, setSearch] = useState('');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');

  const filteredUsers = users.filter((u) =>
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.id.toLowerCase().includes(search.toLowerCase())
  );

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail) return;
    const newUser: AuthUser = {
      id: `usr_${Math.random().toString(36).substring(2, 8)}`,
      email: inviteEmail,
      providers: ['email'],
      mfaEnabled: false,
      status: 'invited',
      createdAt: 'Just now',
      lastSignIn: 'Never',
    };
    setUsers([newUser, ...users]);
    setInviteEmail('');
    setShowInviteModal(false);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white font-display">
            Authentication & Identity
          </h1>
          <p className="text-sm text-white/50 mt-1">
            Manage user accounts, OAuth SSO providers, multi-factor authentication, and JWT signing keys.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center p-1 rounded-lg bg-surface border border-white/[0.08]">
          <button
            onClick={() => setTab('users')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              tab === 'users'
                ? 'bg-saffron text-basalt font-semibold'
                : 'text-white/60 hover:text-white'
            }`}
          >
            Users ({users.length})
          </button>
          <button
            onClick={() => setTab('providers')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              tab === 'providers'
                ? 'bg-saffron text-basalt font-semibold'
                : 'text-white/60 hover:text-white'
            }`}
          >
            Providers & SSO
          </button>
          <button
            onClick={() => setTab('policies')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              tab === 'policies'
                ? 'bg-saffron text-basalt font-semibold'
                : 'text-white/60 hover:text-white'
            }`}
          >
            JWT & Sessions
          </button>
        </div>
      </div>

      {/* Users Tab */}
      {tab === 'users' && (
        <div className="rounded-xl border border-white/[0.08] bg-surface overflow-hidden">
          {/* Action Bar */}
          <div className="p-4 border-b border-white/[0.08] flex items-center justify-between gap-4 bg-surface/50">
            <div className="relative w-64">
              <Search className="w-3.5 h-3.5 text-white/40 absolute left-2.5 top-2.5" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search user ID or email..."
                className="w-full bg-basalt border border-white/[0.08] rounded-md pl-8 pr-3 py-1.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-saffron/50"
              />
            </div>

            <button
              onClick={() => setShowInviteModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-saffron text-basalt font-semibold text-xs hover:bg-saffron/90 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Invite User</span>
            </button>
          </div>

          {/* Users Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-white/[0.02] border-b border-white/[0.08] text-white/40">
                <tr>
                  <th className="py-2.5 px-4">User</th>
                  <th className="py-2.5 px-3">Providers</th>
                  <th className="py-2.5 px-3">MFA</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Created</th>
                  <th className="py-2.5 px-3">Last Sign In</th>
                  <th className="py-2.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-sans font-medium text-white">{user.email}</div>
                      <div className="text-[10px] text-white/40">{user.id}</div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1.5">
                        {user.providers.map((p) => (
                          <span
                            key={p}
                            className="px-1.5 py-0.5 rounded text-[10px] bg-white/[0.06] text-white/80 uppercase font-bold"
                          >
                            {p}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      {user.mfaEnabled ? (
                        <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                          <CheckCircle2 className="w-3 h-3" />
                          Enabled
                        </span>
                      ) : (
                        <span className="text-[10px] text-white/30">Disabled</span>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded ${
                          user.status === 'active'
                            ? 'bg-emerald-500/10 text-emerald-400'
                            : user.status === 'invited'
                            ? 'bg-amber-500/10 text-amber-400'
                            : 'bg-rose-500/10 text-rose-400'
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-white/50">{user.createdAt}</td>
                    <td className="py-3 px-3 text-white/70">{user.lastSignIn}</td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => {
                          const action = user.status === 'banned' ? 'unbanned' : 'banned';
                          setUsers(
                            users.map((u) =>
                              u.id === user.id
                                ? { ...u, status: u.status === 'banned' ? 'active' : 'banned' }
                                : u
                            )
                          );
                        }}
                        className="text-xs text-white/40 hover:text-white"
                      >
                        {user.status === 'banned' ? 'Unban' : 'Ban'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Providers Tab */}
      {tab === 'providers' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-xl bg-surface border border-white/[0.08] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Github className="w-5 h-5 text-white" />
                <span className="font-semibold text-white text-sm">GitHub OAuth</span>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400">
                Active
              </span>
            </div>
            <p className="text-xs text-white/50">Allow users to log in with GitHub personal or enterprise accounts.</p>
            <div className="text-[11px] font-mono text-white/40">Client ID: gh_app_71829...</div>
          </div>

          <div className="p-5 rounded-xl bg-surface border border-white/[0.08] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Chrome className="w-5 h-5 text-white" />
                <span className="font-semibold text-white text-sm">Google OAuth</span>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400">
                Active
              </span>
            </div>
            <p className="text-xs text-white/50">Allow Google Workspace SSO and Consumer Google accounts.</p>
            <div className="text-[11px] font-mono text-white/40">Client ID: 948120...googleusercontent.com</div>
          </div>

          <div className="p-5 rounded-xl bg-surface border border-white/[0.08] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Fingerprint className="w-5 h-5 text-saffron" />
                <span className="font-semibold text-white text-sm">WebAuthn / Passkeys</span>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400">
                Active
              </span>
            </div>
            <p className="text-xs text-white/50">Hardware biometric authentication (Apple TouchID, Windows Hello, YubiKey).</p>
            <div className="text-[11px] font-mono text-white/40">Relying Party ID: auth.velora.internal</div>
          </div>

          <div className="p-5 rounded-xl bg-surface border border-white/[0.08] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Mail className="w-5 h-5 text-sky-400" />
                <span className="font-semibold text-white text-sm">Magic Link (Email OTP)</span>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400">
                Active
              </span>
            </div>
            <p className="text-xs text-white/50">Passwordless sign-in with 6-digit cryptographic security code.</p>
            <div className="text-[11px] font-mono text-white/40">Token expiry: 10 minutes</div>
          </div>
        </div>
      )}

      {/* Policies Tab */}
      {tab === 'policies' && (
        <div className="p-6 rounded-xl bg-surface border border-white/[0.08] space-y-6 max-w-2xl">
          <div>
            <h2 className="text-base font-semibold text-white">JWT Token Policies</h2>
            <p className="text-xs text-white/50">Configure access token lifetime and refresh rotation parameters.</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-mono text-white/70 block mb-1">Access Token Expiry (Seconds)</label>
              <input
                type="number"
                defaultValue={900}
                className="w-full bg-basalt border border-white/[0.08] rounded-md px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-saffron"
              />
              <span className="text-[11px] text-white/40">Default is 900 seconds (15 minutes). Short-lived tokens minimize replay vulnerability.</span>
            </div>

            <div>
              <label className="text-xs font-mono text-white/70 block mb-1">Refresh Token Expiry (Days)</label>
              <input
                type="number"
                defaultValue={30}
                className="w-full bg-basalt border border-white/[0.08] rounded-md px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-saffron"
              />
              <span className="text-[11px] text-white/40">Rolling refresh tokens will be rotated upon every invocation.</span>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => alert('JWT policy settings updated')}
              className="px-4 py-2 rounded-lg bg-saffron text-basalt font-semibold text-xs hover:bg-saffron/90"
            >
              Save Policy Changes
            </button>
          </div>
        </div>
      )}

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md bg-surface border border-white/[0.1] rounded-xl shadow-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <h3 className="text-sm font-semibold text-white">Invite User</h3>
              <button onClick={() => setShowInviteModal(false)} className="text-white/40 hover:text-white">
                ✕
              </button>
            </div>
            <form onSubmit={handleInvite} className="space-y-3">
              <div>
                <label className="text-xs text-white/60 font-mono block mb-1">Email address</label>
                <input
                  type="email"
                  required
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="collaborator@example.com"
                  className="w-full bg-basalt border border-white/[0.08] rounded-md px-3 py-1.5 text-xs text-white focus:outline-none focus:border-saffron"
                />
              </div>
              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="px-3 py-1.5 rounded-lg border border-white/[0.08] text-xs text-white/70 hover:bg-white/[0.04]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-lg bg-saffron text-basalt font-semibold text-xs hover:bg-saffron/90"
                >
                  Send Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
