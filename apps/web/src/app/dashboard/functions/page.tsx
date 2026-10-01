'use client';

import { useState } from 'react';
import {
  Cpu,
  Play,
  Plus,
  Terminal,
  Clock,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Code2,
  Layers,
  Settings,
  Zap,
} from 'lucide-react';

interface EdgeFunction {
  id: string;
  name: string;
  entrypoint: string;
  runtime: 'edge-wasm' | 'node-22';
  memoryMb: number;
  avgLatency: string;
  coldStart: string;
  status: 'active' | 'deploying';
  code: string;
}

const mockFunctions: EdgeFunction[] = [
  {
    id: 'fn-1',
    name: 'stripe-webhook',
    entrypoint: 'functions/stripe-webhook.ts',
    runtime: 'edge-wasm',
    memoryMb: 128,
    avgLatency: '1.4ms',
    coldStart: '2.1ms',
    status: 'active',
    code: `import { serve } from '@velora/edge';
import Stripe from 'stripe';

export default serve(async (req) => {
  const sig = req.headers.get('stripe-signature');
  const body = await req.text();
  
  // Verify signature with zero-latency WASM crypto
  const event = Stripe.webhooks.constructEvent(body, sig!, process.env.STRIPE_WEBHOOK_SECRET!);
  
  if (event.type === 'checkout.session.completed') {
    // Fulfill order in DB
    return new Response(JSON.stringify({ received: true, status: 'ok' }), {
      status: 200,
      headers: { 'content-type': 'application/json' }
    });
  }
  
  return new Response('Event unhandled', { status: 200 });
});`,
  },
  {
    id: 'fn-2',
    name: 'generate-embeddings',
    entrypoint: 'functions/embeddings.ts',
    runtime: 'edge-wasm',
    memoryMb: 256,
    avgLatency: '18.2ms',
    coldStart: '3.4ms',
    status: 'active',
    code: `import { serve } from '@velora/edge';
import { ai } from '@velora/ai';

export default serve(async (req) => {
  const { text } = await req.json();
  const vector = await ai.embeddings.create({
    model: 'text-embedding-3-small',
    input: text
  });
  return Response.json({ dimensions: 1536, vector: vector.data[0].embedding });
});`,
  },
  {
    id: 'fn-3',
    name: 'slack-notifier',
    entrypoint: 'functions/slack-notify.ts',
    runtime: 'node-22',
    memoryMb: 128,
    avgLatency: '4.8ms',
    coldStart: '12.0ms',
    status: 'active',
    code: `export default async function handler(req, res) {
  const { channel, message } = req.body;
  await fetch(process.env.SLACK_INCOMING_URL, {
    method: 'POST',
    body: JSON.stringify({ channel, text: message })
  });
  return res.status(200).json({ delivered: true });
}`,
  },
];

export default function FunctionsPage() {
  const [selectedFn, setSelectedFn] = useState<EdgeFunction>(mockFunctions[0]);
  const [testPayload, setTestPayload] = useState('{\n  "event": "checkout.session.completed",\n  "amount_total": 4900\n}');
  const [isExecuting, setIsExecuting] = useState(false);
  const [testOutput, setTestOutput] = useState<string | null>(null);
  const [copiedUrl, setCopiedUrl] = useState(false);

  const handleTestInvoke = () => {
    setIsExecuting(true);
    setTestOutput(null);
    setTimeout(() => {
      setTestOutput(JSON.stringify({
        status: 200,
        ok: true,
        duration_ms: 1.34,
        region: 'iad1',
        data: { received: true, status: 'ok' },
        trace_id: `tr_${Math.random().toString(36).substring(2, 10)}`
      }, null, 2));
      setIsExecuting(false);
    }, 350);
  };

  return (
    <div className="flex h-[calc(100vh-6.5rem)] rounded-xl border border-white/[0.08] overflow-hidden bg-basalt">
      {/* Functions Sidebar */}
      <div className="w-64 border-r border-white/[0.08] bg-surface flex flex-col shrink-0">
        <div className="p-3 border-b border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono font-semibold text-white">
            <Cpu className="w-4 h-4 text-saffron" />
            <span>FUNCTIONS ({mockFunctions.length})</span>
          </div>
          <button
            onClick={() => alert('New function scaffold wizard')}
            className="p-1 rounded hover:bg-white/[0.06] text-saffron"
            title="Create Function"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {mockFunctions.map((fn) => (
            <button
              key={fn.id}
              onClick={() => {
                setSelectedFn(fn);
                setTestOutput(null);
              }}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-xs flex flex-col gap-1 transition-colors ${
                selectedFn.id === fn.id
                  ? 'bg-saffron/15 text-white border border-saffron/30'
                  : 'text-white/70 hover:bg-white/[0.04] border border-transparent'
              }`}
            >
              <div className="flex items-center justify-between font-mono">
                <span className="font-semibold text-white">{fn.name}</span>
                <span className="text-[10px] text-emerald-400 font-bold">{fn.avgLatency}</span>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-white/40 font-mono">
                <span>{fn.runtime}</span>
                <span>·</span>
                <span>{fn.memoryMb}MB</span>
              </div>
            </button>
          ))}
        </div>

        <div className="p-3 border-t border-white/[0.08] bg-basalt text-[11px] font-mono text-white/50 flex items-center justify-between">
          <span>Global Anycast</span>
          <span className="text-emerald-400">0 cold starts</span>
        </div>
      </div>

      {/* Main Function Editor & Test Console */}
      <div className="flex-1 flex flex-col min-w-0 bg-basalt">
        {/* Function Header */}
        <div className="h-14 border-b border-white/[0.08] px-4 flex items-center justify-between gap-4 bg-surface/50">
          <div className="flex items-center gap-3">
            <div className="font-mono text-sm font-bold text-white flex items-center gap-2">
              <Cpu className="w-4 h-4 text-saffron" />
              <span>{selectedFn.name}</span>
            </div>
            <span className="text-[10px] font-mono bg-saffron/10 text-saffron px-2 py-0.5 rounded border border-saffron/20">
              {selectedFn.runtime}
            </span>
            <span className="text-xs font-mono text-white/40">
              Cold start: {selectedFn.coldStart}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                navigator.clipboard.writeText(`https://fn.velora.internal/${selectedFn.name}`);
                setCopiedUrl(true);
                setTimeout(() => setCopiedUrl(false), 2000);
              }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-white/[0.08] text-xs font-mono text-white/70 hover:text-white hover:bg-white/[0.04] transition-colors"
            >
              {copiedUrl ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedUrl ? 'Copied URL' : 'Copy Endpoint'}</span>
            </button>

            <button
              onClick={() => alert('Function deployed to all 180 Edge PoPs in 184ms.')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-saffron text-basalt font-semibold text-xs hover:bg-saffron/90 transition-colors"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Deploy</span>
            </button>
          </div>
        </div>

        {/* Code & Test Split View */}
        <div className="flex-1 flex flex-col lg:flex-row min-h-0">
          {/* Code View */}
          <div className="flex-1 p-4 bg-basalt border-b lg:border-b-0 lg:border-r border-white/[0.08] overflow-auto">
            <div className="text-[11px] font-mono text-white/40 mb-2 flex items-center justify-between">
              <span>{selectedFn.entrypoint}</span>
              <span>TypeScript (ES2024)</span>
            </div>
            <pre className="font-mono text-xs text-white/90 leading-relaxed selection:bg-saffron/30">
              <code>{selectedFn.code}</code>
            </pre>
          </div>

          {/* Test Runner & Output Console */}
          <div className="w-full lg:w-96 flex flex-col bg-surface/30">
            <div className="p-3 border-b border-white/[0.08] bg-surface flex items-center justify-between">
              <span className="text-xs font-mono font-semibold text-white">TEST INVOCATION</span>
              <button
                onClick={handleTestInvoke}
                disabled={isExecuting}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-saffron text-basalt font-semibold text-xs hover:bg-saffron/90 transition-colors disabled:opacity-50"
              >
                <Play className="w-3 h-3 fill-current" />
                <span>{isExecuting ? 'Invoking...' : 'Send Test'}</span>
              </button>
            </div>

            {/* Request Body Payload */}
            <div className="p-3 border-b border-white/[0.08] flex flex-col">
              <span className="text-[10px] font-mono text-white/40 mb-1">HTTP Request Body (JSON)</span>
              <textarea
                value={testPayload}
                onChange={(e) => setTestPayload(e.target.value)}
                rows={4}
                className="w-full bg-basalt border border-white/[0.08] rounded p-2 text-xs font-mono text-white focus:outline-none focus:border-saffron"
              />
            </div>

            {/* Execution Output */}
            <div className="flex-1 p-3 overflow-auto font-mono text-xs">
              <span className="text-[10px] text-white/40 block mb-2">Execution Log & Response</span>
              {testOutput ? (
                <pre className="text-emerald-400 text-[11px] bg-basalt p-3 rounded border border-white/[0.08] overflow-x-auto">
                  {testOutput}
                </pre>
              ) : (
                <div className="text-white/30 text-xs py-8 text-center">
                  Click &ldquo;Send Test&rdquo; to execute function in edge sandbox.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
