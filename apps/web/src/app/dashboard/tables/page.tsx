'use client';

import { useState } from 'react';
import {
  Database,
  Plus,
  Filter,
  ArrowUpDown,
  Download,
  RefreshCw,
  Search,
  ShieldCheck,
  MoreHorizontal,
  Table as TableIcon,
  Trash2,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface Column {
  name: string;
  type: string;
  isPrimary?: boolean;
}

interface TableDef {
  name: string;
  schema: string;
  rowCount: number;
  columns: Column[];
}

const tables: TableDef[] = [
  {
    name: 'users',
    schema: 'public',
    rowCount: 48219,
    columns: [
      { name: 'id', type: 'uuid', isPrimary: true },
      { name: 'email', type: 'text' },
      { name: 'full_name', type: 'text' },
      { name: 'role', type: 'varchar(32)' },
      { name: 'created_at', type: 'timestamptz' },
      { name: 'is_active', type: 'boolean' },
    ],
  },
  {
    name: 'organizations',
    schema: 'public',
    rowCount: 1842,
    columns: [
      { name: 'id', type: 'uuid', isPrimary: true },
      { name: 'name', type: 'text' },
      { name: 'slug', type: 'text' },
      { name: 'plan', type: 'varchar(32)' },
      { name: 'created_at', type: 'timestamptz' },
    ],
  },
  {
    name: 'documents',
    schema: 'public',
    rowCount: 1280410,
    columns: [
      { name: 'id', type: 'uuid', isPrimary: true },
      { name: 'title', type: 'text' },
      { name: 'org_id', type: 'uuid' },
      { name: 'embedding', type: 'vector(1536)' },
      { name: 'created_at', type: 'timestamptz' },
    ],
  },
  {
    name: 'api_keys',
    schema: 'public',
    rowCount: 290,
    columns: [
      { name: 'id', type: 'uuid', isPrimary: true },
      { name: 'key_hash', type: 'text' },
      { name: 'prefix', type: 'varchar(12)' },
      { name: 'user_id', type: 'uuid' },
      { name: 'last_used_at', type: 'timestamptz' },
    ],
  },
];

const mockUsersData = [
  { id: 'u_9f81a7b', email: 'alice.vance@acme.dev', full_name: 'Alice Vance', role: 'owner', created_at: '2026-09-28 14:22:01', is_active: true },
  { id: 'u_2c4180d', email: 'marcus.chen@stripe.com', full_name: 'Marcus Chen', role: 'admin', created_at: '2026-09-28 15:40:19', is_active: true },
  { id: 'u_7a39e12', email: 'elena.rostova@datadog.io', full_name: 'Elena Rostova', role: 'member', created_at: '2026-09-29 09:12:44', is_active: true },
  { id: 'u_18bf450', email: 'david.kim@anthropic.com', full_name: 'David Kim', role: 'developer', created_at: '2026-09-29 11:05:32', is_active: false },
  { id: 'u_53e89bc', email: 'sarah.connor@defense.gov', full_name: 'Sarah Connor', role: 'member', created_at: '2026-09-30 08:30:10', is_active: true },
  { id: 'u_6201f9a', email: 'james.holden@roci.org', full_name: 'James Holden', role: 'admin', created_at: '2026-09-30 16:45:00', is_active: true },
];

export default function TableEditorPage() {
  const [selectedTable, setSelectedTable] = useState<TableDef>(tables[0]);
  const [rows, setRows] = useState(mockUsersData);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([]);
  const [showInsertModal, setShowInsertModal] = useState(false);
  const [newRow, setNewRow] = useState({ email: '', full_name: '', role: 'member' });

  const filteredRows = rows.filter((r) =>
    r.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleSelectAll = () => {
    if (selectedRowIds.length === filteredRows.length) {
      setSelectedRowIds([]);
    } else {
      setSelectedRowIds(filteredRows.map((r) => r.id));
    }
  };

  const toggleSelectRow = (id: string) => {
    setSelectedRowIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleInsertRow = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRow.email || !newRow.full_name) return;
    const added = {
      id: `u_${Math.random().toString(36).substring(2, 9)}`,
      email: newRow.email,
      full_name: newRow.full_name,
      role: newRow.role,
      created_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
      is_active: true,
    };
    setRows([added, ...rows]);
    setNewRow({ email: '', full_name: '', role: 'member' });
    setShowInsertModal(false);
  };

  return (
    <div className="flex h-[calc(100vh-6.5rem)] rounded-xl border border-white/[0.08] overflow-hidden bg-basalt">
      {/* Table Sidebar */}
      <div className="w-64 border-r border-white/[0.08] bg-surface flex flex-col shrink-0">
        <div className="p-3 border-b border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono font-semibold text-white">
            <Database className="w-4 h-4 text-saffron" />
            <span>TABLES ({tables.length})</span>
          </div>
          <button
            onClick={() => alert('New table wizard opened')}
            className="p-1 rounded hover:bg-white/[0.06] text-saffron"
            title="Create new table"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        <div className="p-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-white/40 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Filter tables..."
              className="w-full bg-basalt border border-white/[0.08] rounded-md pl-8 pr-3 py-1.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-saffron/50"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {tables.map((tbl) => (
            <button
              key={tbl.name}
              onClick={() => setSelectedTable(tbl)}
              className={`w-full text-left px-2.5 py-2 rounded-lg text-xs flex items-center justify-between transition-colors ${
                selectedTable.name === tbl.name
                  ? 'bg-saffron/15 text-white font-medium border border-saffron/30'
                  : 'text-white/70 hover:bg-white/[0.04] border border-transparent'
              }`}
            >
              <div className="flex items-center gap-2 truncate">
                <TableIcon className="w-3.5 h-3.5 text-white/40 shrink-0" />
                <span className="truncate font-mono">{tbl.name}</span>
              </div>
              <span className="text-[10px] font-mono text-white/40 ml-2">
                {tbl.rowCount > 1000 ? `${(tbl.rowCount / 1000).toFixed(0)}k` : tbl.rowCount}
              </span>
            </button>
          ))}
        </div>

        {/* Schema Status Footer */}
        <div className="p-3 border-t border-white/[0.08] bg-basalt text-[11px] font-mono text-white/50 flex items-center justify-between">
          <span>Schema: public</span>
          <span className="text-emerald-400">PostgreSQL 17</span>
        </div>
      </div>

      {/* Main Table Content */}
      <div className="flex-1 flex flex-col min-w-0 bg-basalt">
        {/* Table Header Bar */}
        <div className="h-14 border-b border-white/[0.08] px-4 flex items-center justify-between gap-4 bg-surface/50">
          <div className="flex items-center gap-3">
            <span className="font-mono text-base font-bold text-white">
              {selectedTable.schema}.{selectedTable.name}
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              <ShieldCheck className="w-3 h-3" />
              RLS Enabled
            </span>
            <span className="text-xs font-mono text-white/40">
              {selectedTable.rowCount.toLocaleString()} rows
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative w-48">
              <Search className="w-3.5 h-3.5 text-white/40 absolute left-2.5 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search rows..."
                className="w-full bg-basalt border border-white/[0.08] rounded-md pl-8 pr-2 py-1.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-saffron/50"
              />
            </div>

            <button
              onClick={() => setShowInsertModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-saffron text-basalt font-semibold text-xs hover:bg-saffron/90 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Insert Row</span>
            </button>

            <button
              onClick={() => alert('Exporting CSV...')}
              className="p-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white/70 hover:text-white hover:bg-white/[0.08] transition-colors"
              title="Export CSV"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Data Grid Table */}
        <div className="flex-1 overflow-auto">
          <table className="w-full text-left text-xs border-collapse font-mono">
            <thead className="sticky top-0 bg-surface border-b border-white/[0.08] text-white/50 z-10">
              <tr>
                <th className="py-2.5 px-3 w-10 border-r border-white/[0.06]">
                  <input
                    type="checkbox"
                    checked={selectedRowIds.length === filteredRows.length && filteredRows.length > 0}
                    onChange={toggleSelectAll}
                    className="rounded border-white/20 bg-basalt text-saffron focus:ring-0 cursor-pointer"
                  />
                </th>
                {selectedTable.columns.map((col) => (
                  <th
                    key={col.name}
                    className="py-2.5 px-3 border-r border-white/[0.06] font-medium"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <span className="text-white font-semibold">{col.name}</span>
                        {col.isPrimary && (
                          <span className="text-[9px] text-saffron bg-saffron/10 px-1 rounded">PK</span>
                        )}
                      </div>
                      <span className="text-[10px] text-white/30">{col.type}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {selectedTable.name === 'users' ? (
                filteredRows.map((row) => {
                  const isSelected = selectedRowIds.includes(row.id);
                  return (
                    <tr
                      key={row.id}
                      className={`hover:bg-white/[0.02] transition-colors ${
                        isSelected ? 'bg-saffron/10' : ''
                      }`}
                    >
                      <td className="py-2 px-3 border-r border-white/[0.06]">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectRow(row.id)}
                          className="rounded border-white/20 bg-basalt text-saffron focus:ring-0 cursor-pointer"
                        />
                      </td>
                      <td className="py-2 px-3 border-r border-white/[0.06] text-saffron">
                        {row.id}
                      </td>
                      <td className="py-2 px-3 border-r border-white/[0.06] text-white/90">
                        {row.email}
                      </td>
                      <td className="py-2 px-3 border-r border-white/[0.06] text-white/90">
                        {row.full_name}
                      </td>
                      <td className="py-2 px-3 border-r border-white/[0.06]">
                        <span className="text-[11px] px-1.5 py-0.5 rounded bg-white/[0.06] text-white/80">
                          {row.role}
                        </span>
                      </td>
                      <td className="py-2 px-3 border-r border-white/[0.06] text-white/40">
                        {row.created_at}
                      </td>
                      <td className="py-2 px-3 border-r border-white/[0.06]">
                        <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                          row.is_active ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                        }`}>
                          {row.is_active ? 'true' : 'false'}
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={selectedTable.columns.length + 1} className="py-12 text-center text-white/40">
                    No rows displayed for {selectedTable.name}. Click &ldquo;Insert Row&rdquo; to add data.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table Pagination Bar */}
        <div className="h-11 border-t border-white/[0.08] px-4 bg-surface flex items-center justify-between text-xs font-mono text-white/50">
          <div>
            Showing 1-{filteredRows.length} of {selectedTable.rowCount.toLocaleString()} rows
            {selectedRowIds.length > 0 && ` (${selectedRowIds.length} selected)`}
          </div>
          <div className="flex items-center gap-1">
            <button disabled className="p-1 rounded hover:bg-white/[0.04] text-white/20 disabled:cursor-not-allowed">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2 text-white">1</span>
            <button className="p-1 rounded hover:bg-white/[0.04] text-white/70">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Insert Row Modal */}
      {showInsertModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md bg-surface border border-white/[0.1] rounded-xl shadow-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <h3 className="text-sm font-semibold text-white">Insert row into {selectedTable.name}</h3>
              <button onClick={() => setShowInsertModal(false)} className="text-white/40 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleInsertRow} className="space-y-3">
              <div>
                <label className="text-xs text-white/60 font-mono block mb-1">email (text)</label>
                <input
                  type="email"
                  required
                  value={newRow.email}
                  onChange={(e) => setNewRow({ ...newRow, email: e.target.value })}
                  placeholder="dev@example.com"
                  className="w-full bg-basalt border border-white/[0.08] rounded-md px-3 py-1.5 text-xs text-white focus:outline-none focus:border-saffron"
                />
              </div>
              <div>
                <label className="text-xs text-white/60 font-mono block mb-1">full_name (text)</label>
                <input
                  type="text"
                  required
                  value={newRow.full_name}
                  onChange={(e) => setNewRow({ ...newRow, full_name: e.target.value })}
                  placeholder="Jane Doe"
                  className="w-full bg-basalt border border-white/[0.08] rounded-md px-3 py-1.5 text-xs text-white focus:outline-none focus:border-saffron"
                />
              </div>
              <div>
                <label className="text-xs text-white/60 font-mono block mb-1">role (varchar)</label>
                <select
                  value={newRow.role}
                  onChange={(e) => setNewRow({ ...newRow, role: e.target.value })}
                  className="w-full bg-basalt border border-white/[0.08] rounded-md px-3 py-1.5 text-xs text-white focus:outline-none focus:border-saffron"
                >
                  <option value="member">member</option>
                  <option value="developer">developer</option>
                  <option value="admin">admin</option>
                  <option value="owner">owner</option>
                </select>
              </div>
              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowInsertModal(false)}
                  className="px-3 py-1.5 rounded-lg border border-white/[0.08] text-xs text-white/70 hover:bg-white/[0.04]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-lg bg-saffron text-basalt font-semibold text-xs hover:bg-saffron/90"
                >
                  Save Row
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
