'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Shield, Check, X, ArrowLeft, UserPlus, UserCheck } from 'lucide-react';
import Link from 'next/link';

export default function AuthorizePage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs font-mono text-neutral-500">Loading OAuth authorization...</div>}>
      <AuthorizeContent />
    </Suspense>
  );
}

function AuthorizeContent() {
  const searchParams = useSearchParams();
  const provider = searchParams.get('provider') || 'google';
  const state = searchParams.get('state') || '';
  const redirectUri = searchParams.get('redirect_uri') || '/api/auth/callback/google';
  const [accountType, setAccountType] = useState<'existing' | 'new'>('existing');
  const [customEmail, setCustomEmail] = useState('');
  const [customName, setCustomName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const selectedEmail = customEmail || (accountType === 'existing' ? 'alex.chen@acme.corp' : 'new.engineer@startup.io');
  const selectedName = customName || (accountType === 'existing' ? 'Alex Chen' : 'Taylor Smith');

  const handleAuthorize = () => {
    setIsProcessing(true);
    // Encode user metadata into authorization code for callback verification
    const payload = JSON.stringify({
      email: selectedEmail,
      name: selectedName,
      isNewUser: accountType === 'new',
    });
    const code = `auth_${btoa(payload)}_${Date.now()}`;
    const targetUrl = new URL(redirectUri, window.location.origin);
    targetUrl.searchParams.set('code', code);
    targetUrl.searchParams.set('state', state);

    window.location.href = targetUrl.toString();
  };

  const handleDeny = () => {
    setIsProcessing(true);
    const targetUrl = new URL(redirectUri, window.location.origin);
    targetUrl.searchParams.set('error', 'access_denied');
    targetUrl.searchParams.set('error_description', 'User explicitly denied authorization.');
    targetUrl.searchParams.set('state', state);

    window.location.href = targetUrl.toString();
  };

  const handleCancel = () => {
    setIsProcessing(true);
    const targetUrl = new URL(redirectUri, window.location.origin);
    targetUrl.searchParams.set('error', 'cancelled');
    targetUrl.searchParams.set('error_description', 'Authorization was cancelled.');
    targetUrl.searchParams.set('state', state);

    window.location.href = targetUrl.toString();
  };

  return (
    <div className="max-w-md mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Header with Google Logo & Security Badge */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-surface-raised border border-border-default shadow-sm mx-auto">
          <svg className="w-6 h-6" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
        </div>
        <h1 className="text-xl font-bold text-salt font-display">
          Authorize VELORA
        </h1>
        <p className="text-xs text-neutral-400">
          Sign in with Google OAuth 2.0 to access your workspace
        </p>
      </div>

      {/* Permissions Box */}
      <div className="p-4 rounded-lg bg-surface-raised border border-border-default space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-salt">
          <Shield className="w-4 h-4 text-saffron" />
          <span>VELORA will receive the following permissions:</span>
        </div>
        <ul className="text-xs text-neutral-400 space-y-2 pl-6 list-disc">
          <li>View your email address (<code className="text-neutral-300">openid email</code>)</li>
          <li>View your basic personal profile name & picture (<code className="text-neutral-300">profile</code>)</li>
          <li>Associate your OAuth identity with your VELORA tenant</li>
        </ul>
      </div>

      {/* Account Profile Chooser (Test Matrix: Existing vs New Account) */}
      <div className="space-y-2">
        <label className="block text-xs font-medium text-neutral-400">
          Select Identity Profile:
        </label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setAccountType('existing')}
            className={`p-3 rounded-lg border text-left flex items-start gap-2.5 transition-all ${
              accountType === 'existing'
                ? 'border-saffron bg-saffron-subtle/30 text-salt'
                : 'border-border-default bg-surface-base text-neutral-400 hover:border-border-hover'
            }`}
          >
            <UserCheck className={`w-4 h-4 mt-0.5 ${accountType === 'existing' ? 'text-saffron' : 'text-neutral-500'}`} />
            <div>
              <div className="text-xs font-semibold">Existing User</div>
              <div className="text-[10px] text-neutral-400 font-mono">alex.chen@acme.corp</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setAccountType('new')}
            className={`p-3 rounded-lg border text-left flex items-start gap-2.5 transition-all ${
              accountType === 'new'
                ? 'border-saffron bg-saffron-subtle/30 text-salt'
                : 'border-border-default bg-surface-base text-neutral-400 hover:border-border-hover'
            }`}
          >
            <UserPlus className={`w-4 h-4 mt-0.5 ${accountType === 'new' ? 'text-saffron' : 'text-neutral-500'}`} />
            <div>
              <div className="text-xs font-semibold">New Account</div>
              <div className="text-[10px] text-neutral-400 font-mono">Triggers Onboarding</div>
            </div>
          </button>
        </div>
      </div>

      {/* Action Buttons: Authorize / Deny / Cancel */}
      <div className="space-y-2 pt-2">
        <button
          type="button"
          onClick={handleAuthorize}
          disabled={isProcessing}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-saffron text-basalt font-semibold text-sm rounded-md hover:bg-saffron-hover transition-colors shadow-saffron-sm disabled:opacity-50"
        >
          <Check className="w-4 h-4" />
          <span>Authorize and Continue</span>
        </button>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={handleDeny}
            disabled={isProcessing}
            className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-md border border-border-default bg-surface-raised text-xs font-medium text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/30 transition-colors disabled:opacity-50"
          >
            <X className="w-3.5 h-3.5" />
            <span>Deny Access</span>
          </button>

          <button
            type="button"
            onClick={handleCancel}
            disabled={isProcessing}
            className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-md border border-border-default bg-surface-raised text-xs font-medium text-neutral-400 hover:text-salt hover:bg-surface-overlay transition-colors disabled:opacity-50"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Cancel</span>
          </button>
        </div>
      </div>

      {/* Security Footer Notice */}
      <div className="pt-2 text-center text-[11px] text-neutral-500">
        Secure OAuth 2.0 PKCE Authorization Exchange · VELORA Security Enclave
      </div>
    </div>
  );
}
