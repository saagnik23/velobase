'use client';

import { useState } from 'react';
import {
  AppWindow,
  Layers,
  Plus,
  Play,
  Monitor,
  Smartphone,
  Eye,
  Settings,
  Sparkles,
  Layout,
} from 'lucide-react';

export default function AppBuilderPage() {
  const [device, setDevice] = useState<'desktop' | 'mobile'>('desktop');

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-white font-display">
              Low-Code App Builder
            </h1>
            <span className="inline-flex items-center gap-1 text-xs font-mono text-saffron bg-saffron/10 px-2 py-0.5 rounded border border-saffron/20">
              <Sparkles className="w-3.5 h-3.5" />
              WYSIWYG Internal Tool Canvas
            </span>
          </div>
          <p className="text-sm text-white/50 mt-1">
            Build bespoke administrative portals and operations dashboards directly bound to your VELORA tables and edge queries.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center p-1 rounded-lg bg-surface border border-white/[0.08]">
            <button
              onClick={() => setDevice('desktop')}
              className={`p-1.5 rounded ${device === 'desktop' ? 'bg-white/[0.1] text-white' : 'text-white/40'}`}
              title="Desktop preview"
            >
              <Monitor className="w-4 h-4" />
            </button>
            <button
              onClick={() => setDevice('mobile')}
              className={`p-1.5 rounded ${device === 'mobile' ? 'bg-white/[0.1] text-white' : 'text-white/40'}`}
              title="Mobile preview"
            >
              <Smartphone className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => alert('New page added to app layout')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-saffron text-basalt font-semibold text-xs hover:bg-saffron/90"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Component</span>
          </button>
        </div>
      </div>

      {/* App Canvas Placeholder */}
      <div className="h-[520px] rounded-xl border border-dashed border-white/[0.15] bg-surface/30 flex flex-col items-center justify-center text-center p-6 space-y-3">
        <Layout className="w-12 h-12 text-saffron/60 stroke-[1.5]" />
        <h2 className="text-base font-semibold text-white">Visual Application Canvas Ready</h2>
        <p className="text-xs text-white/40 max-w-md">
          Drag and drop data tables, form generators, metric KPIs, and action buttons. All components communicate via direct React state and secure server actions.
        </p>
        <button
          onClick={() => alert('Default CRM template generated')}
          className="mt-2 px-4 py-2 rounded-lg bg-white/[0.08] text-white text-xs font-mono hover:bg-white/[0.12] transition-colors"
        >
          Load Template: Customer Support Admin Panel
        </button>
      </div>
    </div>
  );
}
