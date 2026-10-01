'use client';

import { useState } from 'react';
import {
  Radio,
  Send,
  Users,
  Activity,
  Zap,
  CheckCircle2,
  Clock,
  Layers,
  ArrowRight,
} from 'lucide-react';

interface RealtimeMessage {
  id: string;
  channel: string;
  event: string;
  sender: string;
  timestamp: string;
  payload: any;
}

const mockMessages: RealtimeMessage[] = [
  { id: 'm-1', channel: 'room:collaborators', event: 'presence.join', sender: 'usr_89f02a', timestamp: '14:48:02', payload: { cursor: { x: 340, y: 120 } } },
  { id: 'm-2', channel: 'room:collaborators', event: 'broadcast.cursor', sender: 'usr_31c84b', timestamp: '14:48:05', payload: { cursor: { x: 410, y: 195 } } },
  { id: 'm-3', channel: 'postgres_changes:documents', event: 'UPDATE', sender: 'pg_logical_replication', timestamp: '14:48:10', payload: { id: 'doc_18f', title: 'New System Specs' } },
];

export default function RealtimePage() {
  const [messages, setMessages] = useState<RealtimeMessage[]>(mockMessages);
  const [channelInput, setChannelInput] = useState('room:collaborators');
  const [eventInput, setEventInput] = useState('broadcast.ping');
  const [payloadInput, setPayloadInput] = useState('{\n  "msg": "Hello Realtime",\n  "ts": 1790844\n}');

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    let parsed = {};
    try {
      parsed = JSON.parse(payloadInput);
    } catch {
      parsed = { raw: payloadInput };
    }
    const newMsg: RealtimeMessage = {
      id: `m-${Date.now()}`,
      channel: channelInput,
      event: eventInput,
      sender: 'current_client',
      timestamp: new Date().toTimeString().substring(0, 8),
      payload: parsed,
    };
    setMessages([newMsg, ...messages]);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-white font-display">
              Realtime Engine
            </h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Connected · 4.1k sockets active
            </span>
          </div>
          <p className="text-sm text-white/50 mt-1">
            Global WebSocket mesh for multiplayer sync, presence tracking, and Postgres logical replication streams.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Interactive Broadcaster */}
        <div className="p-5 rounded-xl bg-surface border border-white/[0.08] space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono font-semibold text-white">
            <Radio className="w-4 h-4 text-saffron" />
            <span>BROADCAST TEST EVENT</span>
          </div>

          <form onSubmit={handleBroadcast} className="space-y-3 font-mono text-xs">
            <div>
              <label className="text-[10px] text-white/40 block mb-1">Channel Name</label>
              <input
                type="text"
                value={channelInput}
                onChange={(e) => setChannelInput(e.target.value)}
                className="w-full bg-basalt border border-white/[0.08] rounded p-2 text-white focus:outline-none focus:border-saffron"
              />
            </div>
            <div>
              <label className="text-[10px] text-white/40 block mb-1">Event Type</label>
              <input
                type="text"
                value={eventInput}
                onChange={(e) => setEventInput(e.target.value)}
                className="w-full bg-basalt border border-white/[0.08] rounded p-2 text-white focus:outline-none focus:border-saffron"
              />
            </div>
            <div>
              <label className="text-[10px] text-white/40 block mb-1">JSON Payload</label>
              <textarea
                rows={4}
                value={payloadInput}
                onChange={(e) => setPayloadInput(e.target.value)}
                className="w-full bg-basalt border border-white/[0.08] rounded p-2 text-white focus:outline-none focus:border-saffron"
              />
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-saffron text-basalt font-semibold text-xs hover:bg-saffron/90 transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Broadcast to Mesh</span>
            </button>
          </form>
        </div>

        {/* Right: Live Message Stream Feed */}
        <div className="lg:col-span-2 rounded-xl bg-surface border border-white/[0.08] flex flex-col h-[520px] overflow-hidden">
          <div className="p-3 border-b border-white/[0.08] bg-surface/50 flex items-center justify-between text-xs font-mono text-white/50">
            <span>LIVE EVENT STREAM</span>
            <span className="text-emerald-400">Sub-5ms End-to-End</span>
          </div>

          <div className="flex-1 p-4 overflow-y-auto space-y-2 font-mono text-xs">
            {messages.map((m) => (
              <div
                key={m.id}
                className="p-3 rounded-lg bg-basalt border border-white/[0.06] space-y-1 hover:border-white/[0.12] transition-colors"
              >
                <div className="flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-2">
                    <span className="text-saffron font-bold">{m.channel}</span>
                    <span className="text-white/40">·</span>
                    <span className="text-emerald-400">{m.event}</span>
                  </div>
                  <span className="text-white/30 text-[10px]">{m.timestamp}</span>
                </div>
                <div className="text-[11px] text-white/60">
                  from: <span className="text-white/90">{m.sender}</span>
                </div>
                <pre className="text-[10px] text-white/80 bg-white/[0.02] p-2 rounded overflow-x-auto">
                  {JSON.stringify(m.payload, null, 2)}
                </pre>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
