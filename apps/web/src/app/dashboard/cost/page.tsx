'use client';

import { useState } from 'react';
import {
  DollarSign,
  TrendingDown,
  Cpu,
  HardDrive,
  Globe,
  Database,
  Calendar,
} from 'lucide-react';

export default function CostPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-white font-display">
              Cost & Resource Metering
            </h1>
            <span className="inline-flex items-center gap-1 text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              <DollarSign className="w-3.5 h-3.5" />
              Pro Tier · Usage-Based
            </span>
          </div>
          <p className="text-sm text-white/50 mt-1">
            Real-time granular cost accounting with transparent micro-unit billing and zero surprise invoices.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-xl bg-surface border border-white/[0.08]">
          <div className="text-xs font-mono text-white/40">CURRENT MONTH PROJECTED</div>
          <div className="text-3xl font-mono font-bold text-white mt-2">$42.80</div>
          <div className="text-[11px] font-mono text-emerald-400 mt-1">Within $50.00 spend alert budget</div>
        </div>
        <div className="p-5 rounded-xl bg-surface border border-white/[0.08]">
          <div className="text-xs font-mono text-white/40">EDGE COMPUTE TIME</div>
          <div className="text-3xl font-mono font-bold text-saffron mt-2">1,842,000</div>
          <div className="text-[11px] font-mono text-white/40 mt-1">vCPU-seconds utilized ($18.42)</div>
        </div>
        <div className="p-5 rounded-xl bg-surface border border-white/[0.08]">
          <div className="text-xs font-mono text-white/40">STORAGE & EGRESS</div>
          <div className="text-3xl font-mono font-bold text-sky-400 mt-2">56.2 GB</div>
          <div className="text-[11px] font-mono text-white/40 mt-1">Object storage + CDN bandwidth ($8.38)</div>
        </div>
      </div>

      {/* Itemized Line Items */}
      <div className="p-5 rounded-xl bg-surface border border-white/[0.08] space-y-4">
        <h2 className="text-base font-semibold text-white">Itemized Resource Breakdown</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-white/[0.02] border-b border-white/[0.08] text-white/40">
              <tr>
                <th className="py-2.5 px-3">Resource Category</th>
                <th className="py-2.5 px-3">Usage Volume</th>
                <th className="py-2.5 px-3">Unit Price</th>
                <th className="py-2.5 px-3 text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              <tr>
                <td className="py-2.5 px-3 text-white font-medium">PostgreSQL Compute (Dedicated IAD1)</td>
                <td className="py-2.5 px-3 text-white/60">720 hours</td>
                <td className="py-2.5 px-3 text-white/40">$0.022 / hr</td>
                <td className="py-2.5 px-3 text-right text-white font-bold">$16.00</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 text-white font-medium">Edge Functions Invocation</td>
                <td className="py-2.5 px-3 text-white/60">3.4M requests</td>
                <td className="py-2.5 px-3 text-white/40">$0.50 / 1M</td>
                <td className="py-2.5 px-3 text-right text-white font-bold">$1.70</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 text-white font-medium">S3 Compatible Storage (Multi-region)</td>
                <td className="py-2.5 px-3 text-white/60">56.2 GB</td>
                <td className="py-2.5 px-3 text-white/40">$0.015 / GB-mo</td>
                <td className="py-2.5 px-3 text-right text-white font-bold">$0.84</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 text-white font-medium">AI Gateway Model Proxy Tokens</td>
                <td className="py-2.5 px-3 text-white/60">5.8M tokens</td>
                <td className="py-2.5 px-3 text-white/40">Passthrough + 0%</td>
                <td className="py-2.5 px-3 text-right text-white font-bold">$24.26</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
