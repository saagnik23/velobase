'use client';

import { useState, useCallback } from 'react';
import { useToast } from '@/components/ui/toast';
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
  Pencil,
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

type RowData = Record<string, string | boolean | number>;

const allMockData: Record<string, RowData[]> = {
  users: [
    { id: 'u_9f81a7b', email: 'alice.vance@acme.dev', full_name: 'Alice Vance', role: 'owner', created_at: '2026-09-28 14:22:01', is_active: true },
    { id: 'u_2c4180d', email: 'marcus.chen@stripe.com', full_name: 'Marcus Chen', role: 'admin', created_at: '2026-09-28 15:40:19', is_active: true },
    { id: 'u_7a39e12', email: 'elena.rostova@datadog.io', full_name: 'Elena Rostova', role: 'member', created_at: '2026-09-29 09:12:44', is_active: true },
    { id: 'u_18bf450', email: 'david.kim@anthropic.com', full_name: 'David Kim', role: 'developer', created_at: '2026-09-29 11:05:32', is_active: false },
    { id: 'u_53e89bc', email: 'sarah.connor@defense.gov', full_name: 'Sarah Connor', role: 'member', created_at: '2026-09-30 08:30:10', is_active: true },
    { id: 'u_6201f9a', email: 'james.holden@roci.org', full_name: 'James Holden', role: 'admin', created_at: '2026-09-30 16:45:00', is_active: true },
  ],
  organizations: [
    { id: 'org_8a1b2c', name: 'Acme Corporation', slug: 'acme-corp', plan: 'enterprise', created_at: '2026-08-01 10:00:00' },
    { id: 'org_3d4e5f', name: 'Stripe Inc', slug: 'stripe', plan: 'scale', created_at: '2026-08-10 14:30:00' },
    { id: 'org_6g7h8i', name: 'Datadog Labs', slug: 'datadog', plan: 'pro', created_at: '2026-08-20 09:15:00' },
  ],
  documents: [
    { id: 'doc_a1b2c3', title: 'System Architecture v3', org_id: 'org_8a1b2c', embedding: '[0.012, -0.043, ...]', created_at: '2026-09-25 08:00:00' },
    { id: 'doc_d4e5f6', title: 'API Design Guidelines', org_id: 'org_3d4e5f', embedding: '[0.089, 0.031, ...]', created_at: '2026-09-26 11:30:00' },
    { id: 'doc_g7h8i9', title: 'Deployment Runbook', org_id: 'org_6g7h8i', embedding: '[-0.018, 0.077, ...]', created_at: '2026-09-27 15:45:00' },
  ],
  api_keys: [
    { id: 'key_x1y2z3', key_hash: 'sha256:a1b2c3d4...', prefix: 'vk_live_', user_id: 'u_9f81a7b', last_used_at: '2026-09-30 14:22:01' },
    { id: 'key_w4v5u6', key_hash: 'sha256:e5f6g7h8...', prefix: 'vk_test_', user_id: 'u_2c4180d', last_used_at: '2026-09-29 09:00:00' },
  ],
};

export default function TableEditorPage() {
  const { toast } = useToast();
  const [selectedTable, setSelectedTable] = useState<TableDef>(tables[0]);
  const [tableData, setTableData] = useState<Record<string, RowData[]>>(allMockData);
  const [searchQuery, setSearchQuery] = useState('');
  const [tableFilterQuery, setTableFilterQuery] = useState('');
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([]);
  const [showInsertModal, setShowInsertModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingRow, setEditingRow] = useState<RowData | null>(null);
  const [newRowFields, setNewRowFields] = useState<Record<string, string>>({});

  const currentRows = tableData[selectedTable.name] || [];
  const filteredRows = currentRows.filter((r) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return Object.values(r).some((v) => String(v).toLowerCase().includes(q));
  });

  const filteredTables = tables.filter((t) =>
    t.name.toLowerCase().includes(tableFilterQuery.toLowerCase())
  );

  const toggleSelectAll = () => {
    if (selectedRowIds.length === filteredRows.length) {
      setSelectedRowIds([]);
    } else {
      setSelectedRowIds(filteredRows.map((r) => String(r.id)));
    }
  };

  const toggleSelectRow = (id: string) => {
    setSelectedRowIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const openInsertModal = () => {
    const fields: Record<string, string> = {};
    selectedTable.columns.forEach((col) => {
      if (!col.isPrimary) fields[col.name] = '';
    });
    setNewRowFields(fields);
    setShowInsertModal(true);
  };

  const handleInsertRow = (e: React.FormEvent) => {
    e.preventDefault();
    const added: RowData = {
      id: `${selectedTable.name.charAt(0)}_${Math.random().toString(36).substring(2, 9)}`,
      ...newRowFields,
    };
    setTableData((prev) => ({
      ...prev,
      [selectedTable.name]: [added, ...(prev[selectedTable.name] || [])],
    }));
    setShowInsertModal(false);
    toast(`Row inserted into ${selectedTable.name}`, 'success');
  };

  const openEditModal = (row: RowData) => {
    setEditingRow({ ...row });
    setShowEditModal(true);
  };

  const handleEditRow = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRow) return;
    setTableData((prev) => ({
      ...prev,
      [selectedTable.name]: (prev[selectedTable.name] || []).map((r) =>
        r.id === editingRow.id ? editingRow : r
      ),
    }));
    setShowEditModal(false);
    setEditingRow(null);
    toast(`Row ${editingRow.id} updated`, 'success');
  };

  const handleDeleteSelected = () => {
    if (selectedRowIds.length === 0) return;
    setTableData((prev) => ({
      ...prev,
      [selectedTable.name]: (prev[selectedTable.name] || []).filter(
        (r) => !selectedRowIds.includes(String(r.id))
      ),
    }));
    toast(`${selectedRowIds.length} row(s) deleted from ${selectedTable.name}`, 'success');
    setSelectedRowIds([]);
  };

  const handleExportCSV = () => {
    const cols = selectedTable.columns.map((c) => c.name);
    const header = cols.join(',');
    const rows = filteredRows.map((r) => cols.map((c) => String(r[c] ?? '')).join(','));
    const csv = [header, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedTable.name}_export.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast(`Exported ${filteredRows.length} rows as CSV`, 'success');
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
            onClick={() => toast('Table creation wizard coming in Slice 4', 'info')}
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
              value={tableFilterQuery}
              onChange={(e) => setTableFilterQuery(e.target.value)}
              className="w-full bg-basalt border border-white/[0.08] rounded-md pl-8 pr-3 py-1.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-saffron/50"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {filteredTables.map((tbl) => (
            <button
              key={tbl.name}
              onClick={() => {
                setSelectedTable(tbl);
                setSelectedRowIds([]);
                setSearchQuery('');
              }}
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
            {/* Bulk Delete */}
            {selectedRowIds.length > 0 && (
              <button
                onClick={handleDeleteSelected}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/20 border border-rose-500/30 text-rose-400 font-semibold text-xs hover:bg-rose-500/30 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete ({selectedRowIds.length})</span>
              </button>
            )}

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
              onClick={openInsertModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-saffron text-basalt font-semibold text-xs hover:bg-saffron/90 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Insert Row</span>
            </button>

            <button
              onClick={handleExportCSV}
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
                <th className="py-2.5 px-3 w-16 text-center font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {filteredRows.length > 0 ? (
                filteredRows.map((row) => {
                  const rowId = String(row.id);
                  const isSelected = selectedRowIds.includes(rowId);
                  return (
                    <tr
                      key={rowId}
                      className={`hover:bg-white/[0.02] transition-colors ${
                        isSelected ? 'bg-saffron/10' : ''
                      }`}
                    >
                      <td className="py-2 px-3 border-r border-white/[0.06]">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectRow(rowId)}
                          className="rounded border-white/20 bg-basalt text-saffron focus:ring-0 cursor-pointer"
                        />
                      </td>
                      {selectedTable.columns.map((col) => {
                        const val = row[col.name];
                        const isBoolean = typeof val === 'boolean';
                        return (
                          <td
                            key={col.name}
                            className={`py-2 px-3 border-r border-white/[0.06] ${
                              col.isPrimary ? 'text-saffron' : 'text-white/90'
                            }`}
                          >
                            {isBoolean ? (
                              <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                                val ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                              }`}>
                                {val ? 'true' : 'false'}
                              </span>
                            ) : col.name === 'role' || col.name === 'plan' ? (
                              <span className="text-[11px] px-1.5 py-0.5 rounded bg-white/[0.06] text-white/80">
                                {String(val)}
                              </span>
                            ) : col.name.includes('created_at') || col.name.includes('last_used') ? (
                              <span className="text-white/40">{String(val)}</span>
                            ) : (
                              String(val ?? '')
                            )}
                          </td>
                        );
                      })}
                      <td className="py-2 px-3 text-center">
                        <button
                          onClick={() => openEditModal(row)}
                          className="p-1 rounded hover:bg-white/[0.06] text-white/40 hover:text-saffron transition-colors"
                          title="Edit row"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={selectedTable.columns.length + 2} className="py-12 text-center text-white/40">
                    {searchQuery
                      ? `No rows matching "${searchQuery}" in ${selectedTable.name}.`
                      : `No rows in ${selectedTable.name}. Click "Insert Row" to add data.`}
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

      {/* Insert Row Modal — Dynamic per table */}
      {showInsertModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={() => setShowInsertModal(false)}>
          <div className="w-full max-w-md bg-surface border border-white/[0.1] rounded-xl shadow-2xl p-5 space-y-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <h3 className="text-sm font-semibold text-white">Insert row into {selectedTable.name}</h3>
              <button onClick={() => setShowInsertModal(false)} className="text-white/40 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleInsertRow} className="space-y-3">
              {selectedTable.columns
                .filter((col) => !col.isPrimary)
                .map((col) => (
                  <div key={col.name}>
                    <label className="text-xs text-white/60 font-mono block mb-1">
                      {col.name} ({col.type})
                    </label>
                    <input
                      type="text"
                      value={newRowFields[col.name] || ''}
                      onChange={(e) =>
                        setNewRowFields((prev) => ({ ...prev, [col.name]: e.target.value }))
                      }
                      placeholder={`Enter ${col.name}...`}
                      className="w-full bg-basalt border border-white/[0.08] rounded-md px-3 py-1.5 text-xs text-white focus:outline-none focus:border-saffron"
                    />
                  </div>
                ))}
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

      {/* Edit Row Modal */}
      {showEditModal && editingRow && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={() => { setShowEditModal(false); setEditingRow(null); }}>
          <div className="w-full max-w-md bg-surface border border-white/[0.1] rounded-xl shadow-2xl p-5 space-y-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <h3 className="text-sm font-semibold text-white">Edit row {String(editingRow.id)}</h3>
              <button onClick={() => { setShowEditModal(false); setEditingRow(null); }} className="text-white/40 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleEditRow} className="space-y-3">
              {selectedTable.columns
                .filter((col) => !col.isPrimary)
                .map((col) => (
                  <div key={col.name}>
                    <label className="text-xs text-white/60 font-mono block mb-1">
                      {col.name} ({col.type})
                    </label>
                    <input
                      type="text"
                      value={String(editingRow[col.name] ?? '')}
                      onChange={(e) =>
                        setEditingRow((prev) => prev ? { ...prev, [col.name]: e.target.value } : prev)
                      }
                      className="w-full bg-basalt border border-white/[0.08] rounded-md px-3 py-1.5 text-xs text-white focus:outline-none focus:border-saffron"
                    />
                  </div>
                ))}
              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => { setShowEditModal(false); setEditingRow(null); }}
                  className="px-3 py-1.5 rounded-lg border border-white/[0.08] text-xs text-white/70 hover:bg-white/[0.04]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-lg bg-saffron text-basalt font-semibold text-xs hover:bg-saffron/90"
                >
                  Update Row
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
