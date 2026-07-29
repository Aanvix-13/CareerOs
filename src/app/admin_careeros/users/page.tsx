'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Search, UserCheck, UserX, Trash2, Eye,
  Loader2, AlertCircle, ChevronLeft, ChevronRight,
} from 'lucide-react';
import Link from 'next/link';
import { Card, Badge, Button } from '@/components/ui';

interface UserItem {
  id: string;
  email: string;
  isSuspended: boolean;
  createdAt: string;
  profile: { fullName: string; college: string | null; profileImageUrl: string | null; } | null;
  _count: { applications: number; resumes: number; };
}

export default function UserDirectoryPage() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<'all' | 'active' | 'suspended'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'createdAt'>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true); setError(null);
    try {
      const params: any = { page, limit, sortBy, sortOrder };
      if (search) params.search = search;
      if (status !== 'all') params.status = status;
      const res = await axios.get('/api/admin_careeros/users', { params });
      setUsers(res.data.data.users);
      setTotal(res.data.data.total);
    } catch (err: any) {
      setError(err.response?.data?.error?.message || err.message || 'Failed to fetch users.');
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchUsers(); }, [page, limit, status, sortBy, sortOrder]);

  const handleSearchSubmit = (e: React.FormEvent) => { e.preventDefault(); setPage(1); fetchUsers(); };

  const handleToggleSuspend = async (user: UserItem) => {
    setActionLoadingId(user.id); setSuccessMessage(null);
    const action = user.isSuspended ? 'activate' : 'suspend';
    try {
      await axios.patch(`/api/admin_careeros/users/${user.id}/${action}`);
      setSuccessMessage(`User ${user.profile?.fullName || user.email} was successfully ${action}d.`);
      fetchUsers();
    } catch (err: any) { alert(err.response?.data?.error?.message || `Failed to ${action} user.`);
    } finally { setActionLoadingId(null); }
  };

  const handleDeleteUser = async (userId: string) => {
    setActionLoadingId(userId); setSuccessMessage(null);
    try {
      await axios.delete(`/api/admin_careeros/users/${userId}`);
      setSuccessMessage('User and all associated data deleted successfully.');
      setDeleteConfirmId(null); fetchUsers();
    } catch (err: any) { alert(err.response?.data?.error?.message || 'Failed to delete user.');
    } finally { setActionLoadingId(null); }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 font-[--font-sans]">
      <div>
        <h1 className="text-3xl font-black text-[#111827] tracking-tight">User Directory</h1>
        <p className="text-sm text-[#6B7280] font-semibold mt-1">Manage and audit registered application users.</p>
      </div>

      {successMessage && (
        <div className="p-4 rounded-xl bg-[#F0FDF4] border border-[#BBF7D0] text-[#166534] text-sm font-bold flex items-center justify-between">
          <span>{successMessage}</span>
          <button onClick={() => setSuccessMessage(null)} className="text-[#166534] hover:text-[#14532D] ml-4">✕</button>
        </div>
      )}

      {/* Filters */}
      <Card className="p-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6B7280]" />
            <input
              type="text"
              placeholder="Search by name, email, or college..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 h-11 rounded-xl border border-[#E5E7EB] bg-white text-sm text-[#111827] placeholder-[#6B7280] focus:outline-none focus:border-[#6D5EF5] focus:ring-2 focus:ring-[#6D5EF5]/10 transition"
            />
          </div>
          <div className="flex flex-wrap gap-3">
            {[
              { value: status, setter: (v: any) => { setStatus(v); setPage(1); }, options: [['all','All Statuses'],['active','Active'],['suspended','Suspended']] },
              { value: sortBy, setter: (v: any) => { setSortBy(v); setPage(1); }, options: [['createdAt','Register Date'],['name','Name']] },
              { value: sortOrder, setter: (v: any) => { setSortOrder(v); setPage(1); }, options: [['desc','Newest'],['asc','Oldest']] },
            ].map((sel, i) => (
              <select key={i} value={sel.value} onChange={(e) => sel.setter(e.target.value as any)}
                className="h-11 px-3 rounded-xl border border-[#E5E7EB] bg-white text-sm text-[#111827] focus:outline-none focus:border-[#6D5EF5] cursor-pointer">
                {sel.options.map(([val, label]) => <option key={val} value={val}>{label}</option>)}
              </select>
            ))}
            <Button type="submit" size="sm">Search</Button>
          </div>
        </form>
      </Card>

      {/* Table */}
      {loading ? (
        <div className="flex h-[40vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#6D5EF5]" />
        </div>
      ) : error ? (
        <Card className="p-8 text-center">
          <AlertCircle className="h-8 w-8 text-[#EF4444] mx-auto mb-2" />
          <p className="text-[#4B5563] text-sm">{error}</p>
        </Card>
      ) : users.length === 0 ? (
        <Card className="p-12 text-center text-[#6B7280] text-sm font-semibold">
          No users found matching the query.
        </Card>
      ) : (
        <div className="space-y-4">
          <div className="ds-table-container overflow-x-auto">
            <table className="ds-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>College</th>
                  <th className="text-center">Activity</th>
                  <th>Registered</th>
                  <th className="text-center">Status</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-[#F3F1FF] text-[#6D5EF5] flex items-center justify-center font-bold text-sm overflow-hidden shrink-0 border border-[#E5E7EB]">
                          {item.profile?.profileImageUrl ? (
                            <img src={item.profile.profileImageUrl} alt="avatar" className="h-full w-full object-cover" />
                          ) : (
                            (item.profile?.fullName || item.email).charAt(0).toUpperCase()
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-[#111827] text-sm truncate">{item.profile?.fullName || 'No Name'}</p>
                          <p className="text-xs text-[#6B7280] truncate">{item.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="text-[#4B5563] text-sm font-medium max-w-[180px] truncate">
                      {item.profile?.college || <span className="text-[#D1D5DB]">—</span>}
                    </td>
                    <td className="text-center">
                      <p className="text-xs font-bold text-[#111827]">{item._count.applications} Apps</p>
                      <p className="text-[10px] text-[#6B7280]">{item._count.resumes} Resumes</p>
                    </td>
                    <td className="text-xs text-[#6B7280] font-semibold">
                      {new Date(item.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="text-center">
                      <Badge variant={item.isSuspended ? 'danger' : 'success'}>
                        {item.isSuspended ? 'Suspended' : 'Active'}
                      </Badge>
                    </td>
                    <td>
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/admin_careeros/users/${item.id}`}
                          className="p-2 rounded-lg bg-[#F8FAFC] hover:bg-[#F3F1FF] text-[#6B7280] hover:text-[#6D5EF5] border border-[#E5E7EB] transition" title="View Details">
                          <Eye className="h-4 w-4" />
                        </Link>
                        <button onClick={() => handleToggleSuspend(item)} disabled={actionLoadingId === item.id}
                          className={`p-2 rounded-lg border border-[#E5E7EB] transition cursor-pointer ${item.isSuspended ? 'bg-[#F8FAFC] hover:bg-[#F0FDF4] text-[#22C55E]' : 'bg-[#F8FAFC] hover:bg-[#FEF2F2] text-[#EF4444]'}`}
                          title={item.isSuspended ? 'Activate' : 'Suspend'}>
                          {actionLoadingId === item.id ? <Loader2 className="h-4 w-4 animate-spin" /> : item.isSuspended ? <UserCheck className="h-4 w-4" /> : <UserX className="h-4 w-4" />}
                        </button>
                        <button onClick={() => setDeleteConfirmId(item.id)}
                          className="p-2 rounded-lg bg-[#F8FAFC] hover:bg-[#FEF2F2] text-[#6B7280] hover:text-[#EF4444] border border-[#E5E7EB] transition cursor-pointer" title="Delete">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-[#6B7280] font-semibold">Page {page} of {totalPages} ({total} users)</span>
              <div className="flex items-center gap-1">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                  className="p-2 rounded-xl bg-white border border-[#E5E7EB] text-[#4B5563] hover:bg-[#F8FAFC] disabled:opacity-50 cursor-pointer">
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                  className="p-2 rounded-xl bg-white border border-[#E5E7EB] text-[#4B5563] hover:bg-[#F8FAFC] disabled:opacity-50 cursor-pointer">
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-black/30 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-[24px] border border-[#E5E7EB] bg-white shadow-[0_20px_60px_rgba(15,23,42,0.12)] p-8 space-y-6 text-center">
            <div className="w-12 h-12 rounded-[16px] bg-[#FEF2F2] text-[#EF4444] flex items-center justify-center mx-auto">
              <Trash2 className="h-6 w-6" />
            </div>
            <div className="space-y-2">
              <h3 className="font-bold text-lg text-[#111827]">Delete User?</h3>
              <p className="text-sm text-[#4B5563]">This is permanent. All applications, resumes, and interviews will be deleted.</p>
            </div>
            <div className="flex gap-3 justify-center">
              <Button variant="secondary" size="sm" onClick={() => setDeleteConfirmId(null)}>Cancel</Button>
              <Button variant="danger" size="sm" onClick={() => deleteConfirmId && handleDeleteUser(deleteConfirmId)}>Delete User</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
