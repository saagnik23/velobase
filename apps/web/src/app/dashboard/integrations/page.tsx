'use client';

import { useState } from 'react';
import {
  Plug,
  CheckCircle2,
  ExternalLink,
  Plus,
  Shield,
  Layers,
} from 'lucide-react';

interface Integration {
  id: string;
  name: string;
  description: string;
  category: 'Billing' | 'Auth' | 'Messaging' | 'Telemetry';
  connected: boolean;
}

const mockIntegrations: Integration[] = [
  { id: 'int-1', name: 'Stripe Payments', description: 'Real-time billing webhooks and subscription syncing.', category: 'Billing', connected: true },
  { id: 'int-2', name: 'GitHub CI/CD', description: 'Automated database migrations on pull request merge.', category: 'Telemetry', connected: true },
  { id: 'int-3', name: 'Resend Transactional', description: 'Deliver transactional emails with sub-100ms API dispatch.', category: 'Messaging', connected: true },
  { id: 'int-4', name: 'Slack Alerts', description: 'Broadcast incident alerts and migration logs to team channel.', category: 'Messaging', connected: false },
  { id: 'int-5', name: 'Datadog APM', description: 'Forward OTel spans and database telemetry to Datadog dashboard.', category: 'Telemetry', connected: false },
];

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState<Integration[]>(mockIntegrations);

  const toggleConnect = (id: string) => {
    setIntegrations(
      integrations.map((i) => (i.id === id ? { ...i, connected: !i.connected } : i))
    );
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-white font-display">
              Ecosystem Integrations
            </h1>
            <span className="inline-flex items-center gap-1 text-xs font-mono text-saffron bg-saffron/10 px-2 py-0.5 rounded border border-saffron/20">
              <Plug className="w-3.5 h-3.5" />
              Verified Connectors
            </span>
          </div>
          <p className="text-sm text-white/50 mt-1">
            Connect third-party developer services with pre-configured webhooks, token exchanges, and IAM roles.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {integrations.map((item) => (
          <div key={item.id} className="p-5 rounded-xl bg-surface border border-white/[0.08] space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-white text-sm">{item.name}</span>
                <span className="text-[10px] font-mono text-white/40 bg-white/[0.06] px-1.5 py-0.5 rounded">
                  {item.category}
                </span>
              </div>
              <p className="text-xs text-white/60 leading-relaxed">{item.description}</p>
            </div>

            <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between">
              <span className={`text-xs font-mono flex items-center gap-1 ${item.connected ? 'text-emerald-400' : 'text-white/40'}`}>
                {item.connected && <CheckCircle2 className="w-3.5 h-3.5" />}
                {item.connected ? 'Connected' : 'Not installed'}
              </span>
              <button
                onClick={() => toggleConnect(item.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  item.connected
                    ? 'border border-white/[0.08] text-white/70 hover:bg-white/[0.04]'
                    : 'bg-saffron text-basalt font-semibold hover:bg-saffron/90'
                }`}
              >
                {item.connected ? 'Configure' : 'Connect'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
