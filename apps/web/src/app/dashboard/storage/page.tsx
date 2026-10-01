'use client';

import { useState } from 'react';
import {
  HardDrive,
  Folder,
  File,
  UploadCloud,
  Plus,
  Lock,
  Globe,
  MoreVertical,
  Download,
  Trash2,
  Copy,
  Check,
  Search,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';

interface Bucket {
  id: string;
  name: string;
  isPublic: boolean;
  sizeBytes: string;
  fileCount: number;
}

interface StorageFile {
  id: string;
  name: string;
  type: string;
  size: string;
  updatedAt: string;
}

const mockBuckets: Bucket[] = [
  { id: 'b-1', name: 'avatars', isPublic: true, sizeBytes: '142 MB', fileCount: 4820 },
  { id: 'b-2', name: 'project-assets', isPublic: true, sizeBytes: '1.8 GB', fileCount: 1240 },
  { id: 'b-3', name: 'documents-raw', isPublic: false, sizeBytes: '14.2 GB', fileCount: 89400 },
  { id: 'b-4', name: 'database-backups', isPublic: false, sizeBytes: '42.1 GB', fileCount: 64 },
];

const mockFiles: Record<string, StorageFile[]> = {
  avatars: [
    { id: 'f-1', name: 'user_u9f81a7b_thumb.webp', type: 'image/webp', size: '24 KB', updatedAt: '2026-09-30 11:20' },
    { id: 'f-2', name: 'user_u2c4180d_thumb.webp', type: 'image/webp', size: '18 KB', updatedAt: '2026-09-30 12:05' },
    { id: 'f-3', name: 'user_u7a39e12_thumb.webp', type: 'image/webp', size: '31 KB', updatedAt: '2026-09-30 14:40' },
    { id: 'f-4', name: 'default_avatar.svg', type: 'image/svg+xml', size: '3.4 KB', updatedAt: '2026-09-20 08:00' },
  ],
  'project-assets': [
    { id: 'f-5', name: 'brand_logo_master.svg', type: 'image/svg+xml', size: '12 KB', updatedAt: '2026-09-25 10:15' },
    { id: 'f-6', name: 'architecture_diagram_v2.png', type: 'image/png', size: '420 KB', updatedAt: '2026-09-29 17:30' },
  ],
};

export default function StoragePage() {
  const [buckets, setBuckets] = useState<Bucket[]>(mockBuckets);
  const [selectedBucket, setSelectedBucket] = useState<Bucket>(mockBuckets[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const files = mockFiles[selectedBucket.name] || [
    { id: 'f-default', name: 'manifest.json', type: 'application/json', size: '1.2 KB', updatedAt: '2026-09-28 10:00' },
  ];

  const filteredFiles = files.filter((f) =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const copyUrl = (fileName: string, id: string) => {
    const url = `https://storage.velora.internal/${selectedBucket.name}/${fileName}`;
    navigator.clipboard?.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex h-[calc(100vh-6.5rem)] rounded-xl border border-white/[0.08] overflow-hidden bg-basalt">
      {/* Bucket List Sidebar */}
      <div className="w-64 border-r border-white/[0.08] bg-surface flex flex-col shrink-0">
        <div className="p-3 border-b border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono font-semibold text-white">
            <HardDrive className="w-4 h-4 text-saffron" />
            <span>BUCKETS ({buckets.length})</span>
          </div>
          <button
            onClick={() => alert('New bucket creation wizard')}
            className="p-1 rounded hover:bg-white/[0.06] text-saffron"
            title="Create Bucket"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {buckets.map((b) => (
            <button
              key={b.id}
              onClick={() => setSelectedBucket(b)}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-xs flex items-center justify-between transition-colors ${
                selectedBucket.id === b.id
                  ? 'bg-saffron/15 text-white font-medium border border-saffron/30'
                  : 'text-white/70 hover:bg-white/[0.04] border border-transparent'
              }`}
            >
              <div className="flex items-center gap-2 truncate">
                {b.isPublic ? (
                  <Globe className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                ) : (
                  <Lock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                )}
                <span className="truncate font-mono">{b.name}</span>
              </div>
              <span className="text-[10px] font-mono text-white/40 shrink-0">
                {b.sizeBytes}
              </span>
            </button>
          ))}
        </div>

        <div className="p-3 border-t border-white/[0.08] bg-basalt text-[11px] font-mono text-white/50 flex items-center justify-between">
          <span>S3-Compatible API</span>
          <span className="text-saffron">Edge CDN on</span>
        </div>
      </div>

      {/* Main Files Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-basalt">
        {/* Header Bar */}
        <div className="h-14 border-b border-white/[0.08] px-4 flex items-center justify-between gap-4 bg-surface/50">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 font-mono text-sm text-white font-semibold">
              <HardDrive className="w-4 h-4 text-saffron" />
              <span>{selectedBucket.name}</span>
            </div>
            <span
              className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                selectedBucket.isPublic
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
              }`}
            >
              {selectedBucket.isPublic ? 'Public CDN' : 'Private (Signed URLs)'}
            </span>
            <span className="text-xs font-mono text-white/40">
              {filteredFiles.length} files
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative w-48">
              <Search className="w-3.5 h-3.5 text-white/40 absolute left-2.5 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search files..."
                className="w-full bg-basalt border border-white/[0.08] rounded-md pl-8 pr-2 py-1.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-saffron/50"
              />
            </div>

            <button
              onClick={() => alert('File upload drawer opened')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-saffron text-basalt font-semibold text-xs hover:bg-saffron/90 transition-colors"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Upload File</span>
            </button>
          </div>
        </div>

        {/* Files Grid */}
        <div className="flex-1 overflow-auto">
          <table className="w-full text-left text-xs border-collapse font-mono">
            <thead className="sticky top-0 bg-surface border-b border-white/[0.08] text-white/40">
              <tr>
                <th className="py-2.5 px-4">Name</th>
                <th className="py-2.5 px-3">Content Type</th>
                <th className="py-2.5 px-3">Size</th>
                <th className="py-2.5 px-3">Last Modified</th>
                <th className="py-2.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {filteredFiles.map((file) => (
                <tr key={file.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 px-4 flex items-center gap-2.5 text-white font-medium">
                    <File className="w-4 h-4 text-saffron shrink-0" />
                    <span>{file.name}</span>
                  </td>
                  <td className="py-3 px-3 text-white/60">{file.type}</td>
                  <td className="py-3 px-3 text-white/80">{file.size}</td>
                  <td className="py-3 px-3 text-white/40">{file.updatedAt}</td>
                  <td className="py-3 px-4 text-right">
                    <div className="inline-flex items-center gap-2">
                      <button
                        onClick={() => copyUrl(file.name, file.id)}
                        className="p-1 rounded text-white/50 hover:text-saffron transition-colors"
                        title="Copy Public URL"
                      >
                        {copiedId === file.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                      <button
                        onClick={() => alert(`Downloading ${file.name}`)}
                        className="p-1 rounded text-white/50 hover:text-white"
                        title="Download"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
