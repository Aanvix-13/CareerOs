'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Search,
  Filter,
  UserCheck,
  UserX,
  Trash2,
  Eye,
  Loader2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import Link from 'next/link';

interface UserItem {
  id: string;
  email: string;
  isSuspended: boolean;
  createdAt: string;
  profile: {
    fullName: string;
    college: string | null;
    profileImageUrl: string | null;
  } | null;
  _count: {
    applications: number;
    resumes: number;
  };
}

export default function UserDirectoryPage() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter and pagination states
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<'all' | 'active' | 'suspended'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'createdAt'>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Modal / Action states
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const params: any = {
        page,
        limit,
        sortBy,
        sortOrder,
      };
      if (search) params.search = search;
      if (status !== 'all') params.status = status;

      const res = await axios.get('/api/admin_careeros/users', { params });
      setUsers(res.data.data.users);
      setTotal(res.data.data.total);
    } catch (err: any) {
      setError(err.response?.data?.error?.message || err.message || 'Failed to fetch users.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, limit, status, sortBy, sortOrder]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchUsers();
  };

  const handleToggleSuspend = async (user: UserItem) => {
    setActionLoadingId(user.id);
    setSuccessMessage(null);
    const action = user.isSuspended ? 'activate' : 'suspend';
    try {
      await axios.patch(`/api/admin_careeros/users/${user.id}/${action}`);
      setSuccessMessage(`User ${user.profile?.fullName || user.email} was successfully ${action}ed.`);
      fetchUsers();
    } catch (err: any) {
      alert(err.response?.data?.error?.message || err.message || `Failed to ${action} user.`);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    setActionLoadingId(userId);
    setSuccessMessage(null);
    try {
      await axios.delete(`/api/admin_careeros/users/${userId}`);
      setSuccessMessage('User and all associated data deleted successfully.');
      setDeleteConfirmId(null);
      fetchUsers();
    } catch (err: any) {
      alert(err.response?.data?.error?.message || err.message || 'Failed to delete user.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">User Directory</h1>
          <p className="text-sm text-zinc-400 mt-1">Manage and audit registered application users.</p>
        </div>
      </div>

      {successMessage && (
        <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-500/20 text-indigo-400 text-sm font-semibold flex items-center justify-between">
          <span>{successMessage}</span>
          <button onClick={() => setSuccessMessage(null)} className="hover:text-white">✕</button>
        </div>
      )}

      {/* Controls Card */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/20 p-4 backdrop-blur-sm">
        <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Search by name, email, or college..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-800 bg-zinc-950/40 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500 transition"
            />
          </div>

          <div className="flex flex-wrap gap-3">
            {/* Status Filter */}
            <select
              value={status}
              onChange={(e: any) => {
                setStatus(e.target.value);
                setPage(1);
              }}
              className="px-4 py-2.5 rounded-xl border border-zinc-800 bg-zinc-950/40 text-sm text-zinc-300 focus:outline-none focus:border-indigo-500"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active Accounts</option>
              <option value="suspended">Suspended Accounts</option>
            </select>

            {/* Sort Field */}
            <select
              value={sortBy}
              onChange={(e: any) => {
                setSortBy(e.target.value);
                setPage(1);
              }}
              className="px-4 py-2.5 rounded-xl border border-zinc-800 bg-zinc-950/40 text-sm text-zinc-300 focus:outline-none focus:border-indigo-500"
            >
              <option value="createdAt">Register Date</option>
              <option value="name">Full Name</option>
            </select>

            {/* Sort Order */}
            <select
              value={sortOrder}
              onChange={(e: any) => {
                setSortOrder(e.target.value);
                setPage(1);
              }}
              className="px-4 py-2.5 rounded-xl border border-zinc-800 bg-zinc-950/40 text-sm text-zinc-300 focus:outline-none focus:border-indigo-500"
            >
              <option value="desc">Newest / Z-A</option>
              <option value="asc">Oldest / A-Z</option>
            </select>

            <button
              type="submit"
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold transition"
            >
              Search
            </button>
          </div>
        </form>
      </div>

      {/* Users Table */}
      {loading ? (
        <div className="flex h-[40vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
        </div>
      ) : error ? (
        <div className="p-6 text-center border border-zinc-800 bg-zinc-900/20 text-zinc-400 rounded-2xl">
          <AlertCircle className="h-8 w-8 text-rose-500 mx-auto mb-2" />
          <p>{error}</p>
        </div>
      ) : users.length === 0 ? (
        <div className="p-12 text-center border border-zinc-800 bg-zinc-900/20 text-zinc-500 rounded-2xl">
          No users found matching the query.
        </div>
      ) : (
        <div className="space-y-4">
          <div className="overflow-x-auto rounded-2xl border border-zinc-800 bg-zinc-900/20">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-800 bg-zinc-950/40 text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">College</th>
                  <th className="px-6 py-4 text-center">Docs</th>
                  <th className="px-6 py-4">Registered</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900/80 text-sm">
                {users.map((item) => (
                  <tr key={item.id} className="hover:bg-zinc-900/20 transition">
                    <td className="px-6 py-4 flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-zinc-800 flex items-center justify-center font-bold text-white overflow-hidden shrink-0 border border-zinc-800">
                        {item.profile?.profileImageUrl ? (
                          <img src={item.profile.profileImageUrl} alt="avatar" className="h-full w-full object-cover" />
                        ) : (
                          (item.profile?.fullName || item.email).charAt(0).toUpperCase()
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-white truncate">{item.profile?.fullName || 'No Name Provided'}</p>
                        <p className="text-xs text-zinc-500 truncate">{item.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-zinc-300 font-medium max-w-[200px] truncate">
                      {item.profile?.college || <span className="text-zinc-600">—</span>}
                    </td>
                    <td className="px-6 py-4 text-center text-zinc-400 font-semibold space-y-0.5">
                      <p className="text-xs">{item._count.applications} Apps</p>
                      <p className="text-[10px] text-zinc-500">{item._count.resumes} Resumes</p>
                    </td>
                    <td className="px-6 py-4 text-zinc-400 text-xs font-medium">
                      {new Date(item.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${
                        item.isSuspended
                          ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          : 'bg-green-500/10 text-green-400 border border-green-500/20'
                      }`}>
                        {item.isSuspended ? 'Suspended' : 'Active'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin_careeros/users/${item.id}`}
                          className="p-2 rounded-lg bg-zinc-950/40 hover:bg-indigo-500/10 text-zinc-400 hover:text-indigo-400 border border-zinc-900 transition"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>

                        <button
                          onClick={() => handleToggleSuspend(item)}
                          disabled={actionLoadingId === item.id}
                          className={`p-2 rounded-lg bg-zinc-950/40 border border-zinc-900 transition cursor-pointer ${
                            item.isSuspended
                              ? 'hover:bg-green-500/10 text-green-500'
                              : 'hover:bg-rose-500/10 text-rose-400'
                          }`}
                          title={item.isSuspended ? 'Activate User' : 'Suspend User'}
                        >
                          {actionLoadingId === item.id ? (
                            <Loader2 className="h-4 w-4 animate-spin text-zinc-400" />
                          ) : item.isSuspended ? (
                            <UserCheck className="h-4 w-4" />
                          ) : (
                            <UserX className="h-4 w-4" />
                          )}
                        </button>

                        <button
                          onClick={() => setDeleteConfirmId(item.id)}
                          className="p-2 rounded-lg bg-zinc-950/40 hover:bg-rose-500/20 text-zinc-500 hover:text-rose-500 border border-zinc-900 transition cursor-pointer"
                          title="Delete User"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-zinc-500">
                Showing Page {page} of {totalPages} ({total} total users)
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white disabled:opacity-50 disabled:hover:text-zinc-400 cursor-pointer"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white disabled:opacity-50 disabled:hover:text-zinc-400 cursor-pointer"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-black/75 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 p-6 space-y-6 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto border border-rose-500/20">
              <Trash2 className="h-6 w-6" />
            </div>
            <div className="space-y-2">
              <h3 className="font-bold text-lg text-white">Delete User?</h3>
              <p className="text-sm text-zinc-400">
                This action is permanent and cannot be undone. All related user applications, resumes, interviews, and notes will be deleted.
              </p>
            </div>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2.5 rounded-xl border border-zinc-800 hover:bg-zinc-800 text-zinc-300 font-semibold text-xs transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteConfirmId && handleDeleteUser(deleteConfirmId)}
                className="px-5 py-2.5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl font-semibold text-xs transition cursor-pointer"
              >
                Delete User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
