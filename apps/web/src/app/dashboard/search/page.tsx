'use client';

import { useState } from 'react';
import {
  Search,
  Cpu,
  Database,
  Sparkles,
  Zap,
  Sliders,
  CheckCircle2,
  Play,
  Layers,
} from 'lucide-react';

interface VectorIndex {
  name: string;
  table: string;
  column: string;
  metric: 'cosine' | 'l2' | 'inner_product';
  dimensions: number;
  hnsw_m: number;
  ef_construction: number;
  totalVectors: number;
  p99SearchMs: string;
}

const mockIndices: VectorIndex[] = [
  {
    name: 'idx_docs_embedding_hnsw',
    table: 'public.documents',
    column: 'embedding',
    metric: 'cosine',
    dimensions: 1536,
    hnsw_m: 16,
    ef_construction: 64,
    totalVectors: 1280410,
    p99SearchMs: '3.4ms',
  },
  {
    name: 'idx_kb_articles_hnsw',
    table: 'public.kb_articles',
    column: 'vector_representation',
    metric: 'cosine',
    dimensions: 768,
    hnsw_m: 24,
    ef_construction: 128,
    totalVectors: 24510,
    p99SearchMs: '1.2ms',
  },
];

export default function SearchVectorsPage() {
  const [queryText, setQueryText] = useState('How does Velora achieve sub-2ms query latency?');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[] | null>([
    {
      id: 'doc_194a',
      title: 'Architectural Blueprint: Shared-Nothing Memory & WASM Cache',
      similarity: 0.9412,
      snippet: 'Velora compiles query plans directly into WASM edge bytecode and stores hot cache blocks in unified NVMe tiered memory...',
    },
    {
      id: 'doc_812c',
      title: 'PgBouncer 2.1 Connection Pooling and Zero-Latency Sharding',
      similarity: 0.8845,
      snippet: 'Connection handshakes are pre-negotiated at the edge layer, eliminating TCP/TLS roundtrips on database queries...',
    },
    {
      id: 'doc_340b',
      title: 'Latency Budgets and P95 Test Suites',
      similarity: 0.8230,
      snippet: 'Latency budgets are not aspirational goals, but rigid build-gate tests. If a commit exceeds budget, CI fails...',
    },
  ]);

  const handleRunSearch = () => {
    setIsSearching(true);
    setTimeout(() => {
      setIsSearching(false);
    }, 250);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-white font-display">
              Search & Vector Indexes
            </h1>
            <span className="inline-flex items-center gap-1 text-xs font-mono text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
              <Sparkles className="w-3.5 h-3.5" />
              pgvector HNSW Acceleration
            </span>
          </div>
          <p className="text-sm text-white/50 mt-1">
            Zero-latency semantic search over multi-million dimensional vector embeddings.
          </p>
        </div>
      </div>

      {/* Vector Indexes Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mockIndices.map((idx) => (
          <div key={idx.name} className="p-5 rounded-xl bg-surface border border-white/[0.08] space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-white">{idx.name}</span>
              <span className="text-xs font-mono text-purple-400 font-bold bg-purple-500/10 px-2 py-0.5 rounded">
                p99: {idx.p99SearchMs}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono text-white/60">
              <div>Table: <span className="text-white">{idx.table}</span></div>
              <div>Metric: <span className="text-white">{idx.metric}</span></div>
              <div>Dimensions: <span className="text-white">{idx.dimensions}</span></div>
              <div>Vectors: <span className="text-white">{idx.totalVectors.toLocaleString()}</span></div>
            </div>
            <div className="pt-2 border-t border-white/[0.06] text-[11px] font-mono text-white/40 flex items-center justify-between">
              <span>HNSW (m={idx.hnsw_m}, ef={idx.ef_construction})</span>
              <span className="text-emerald-400">Index Built & In-Memory</span>
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Semantic Search Tester */}
      <div className="p-5 rounded-xl bg-surface border border-white/[0.08] space-y-4">
        <div className="flex items-center gap-2 text-xs font-mono font-semibold text-white">
          <Search className="w-4 h-4 text-saffron" />
          <span>INTERACTIVE SEMANTIC QUERY TESTER</span>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={queryText}
            onChange={(e) => setQueryText(e.target.value)}
            className="flex-1 bg-basalt border border-white/[0.08] rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-saffron"
            placeholder="Type a natural language query..."
          />
          <button
            onClick={handleRunSearch}
            disabled={isSearching}
            className="px-4 py-2 rounded-lg bg-saffron text-basalt font-semibold text-xs hover:bg-saffron/90 transition-colors flex items-center gap-1.5 shrink-0"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{isSearching ? 'Embedding...' : 'Search Vector'}</span>
          </button>
        </div>

        {/* Search Results */}
        {searchResults && (
          <div className="space-y-3 pt-2">
            <div className="text-xs font-mono text-white/40">
              Top 3 Nearest Neighbors (Calculated in 2.1ms via HNSW index)
            </div>
            {searchResults.map((res, i) => (
              <div key={i} className="p-4 rounded-lg bg-basalt border border-white/[0.06] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-white font-mono">{res.title}</span>
                  <span className="text-xs font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded">
                    Score: {(res.similarity * 100).toFixed(1)}%
                  </span>
                </div>
                <p className="text-xs text-white/60 leading-relaxed">{res.snippet}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
