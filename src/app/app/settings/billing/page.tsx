'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, Button, Badge } from '@/components/ui';
import { CreditCard, Calendar, ArrowUpRight, History, FileText, ChevronLeft, ChevronRight } from 'lucide-react';

interface BillingRecord {
  id: string;
  plan: 'FREE' | 'PRO' | 'ELITE';
  billingCycle: 'MONTHLY' | 'YEARLY';
  amount: number;
  status: 'PENDING' | 'PAID' | 'FAILED';
  invoiceNumber: string | null;
  receiptNumber: string | null;
  createdAt: string;
}

interface SubscriptionData {
  plan: 'FREE' | 'PRO' | 'ELITE';
  billingCycle: 'MONTHLY' | 'YEARLY';
  status: string;
  expiresAt: string | null;
}

export default function BillingDashboard() {
  const router = useRouter();
  
  const [sub, setSub] = useState<SubscriptionData | null>(null);
  const [history, setHistory] = useState<BillingRecord[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // Load subscription details
  useEffect(() => {
    async function loadSub() {
      try {
        const subRes = await fetch('/api/subscription');
        if (subRes.ok) {
          const subData = await subRes.json();
          setSub(subData.data);
        }
      } catch (err) {
        console.error('Failed to load subscription:', err);
      }
    }
    loadSub();
  }, []);

  // Load billing history page
  useEffect(() => {
    async function loadHistory() {
      setLoading(true);
      try {
        const historyRes = await fetch(`/api/payments/history?page=${page}&limit=5`);
        if (historyRes.ok) {
          const historyData = await historyRes.json();
          setHistory(historyData.data.data);
          setTotalPages(historyData.data.totalPages);
        }
      } catch (err) {
        console.error('Failed to load history:', err);
      } finally {
        setLoading(false);
      }
    }
    loadHistory();
  }, [page]);

  const formatDate = (dateStr: string | null | undefined) => {
    if (!dateStr) return 'Never';
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusBadge = (status: string) => {
    if (status === 'PAID') return <Badge variant="success">Paid</Badge>;
    if (status === 'PENDING') return <Badge variant="warning">Pending</Badge>;
    return <Badge variant="danger">Failed</Badge>;
  };

  if (loading && !sub) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 font-[--font-sans]">
        <div className="w-8 h-8 border-4 border-[#6D5EF5] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-400 text-sm font-semibold">Loading billing configuration...</p>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto font-[--font-sans] bg-[#FAFAFA] min-h-screen">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Billing & Subscriptions</h1>
          <p className="text-sm text-slate-500 mt-1">Manage active plans, billing details, payments cycle, and download past invoice records.</p>
        </div>
        
        {sub?.plan !== 'ELITE' && (
          <Button 
            variant="primary" 
            icon={<ArrowUpRight className="w-4 h-4" />}
            onClick={() => router.push('/pricing')}
          >
            Upgrade Plan
          </Button>
        )}
      </div>

      {/* Plan Details Card */}
      <Card className="bg-white border border-slate-200/80 p-6 md:p-8 rounded-2xl mb-8 flex flex-col md:flex-row justify-between gap-6 hover:shadow-sm transition-shadow">
        <div className="flex gap-4 items-start">
          <div className="w-12 h-12 bg-[#F3F1FF] text-[#6D5EF5] flex items-center justify-center rounded-xl shrink-0">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">Active Subscription</span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black bg-[#6D5EF5]/10 text-[#6D5EF5] border border-[#6D5EF5]/10 uppercase">
                {sub?.plan || 'FREE'}
              </span>
            </div>

            <h2 className="text-xl font-black text-slate-900 mt-1">
              {sub?.plan === 'FREE' ? 'Free Starter Tier' : `${sub?.plan} Plan`}
            </h2>

            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              {sub?.plan === 'FREE' 
                ? 'Unlock limits for high volume resume uploads and professional tracking tools with Pro or Elite.' 
                : `Thank you for your support! Your account will renew next on ${formatDate(sub?.expiresAt)}.`}
            </p>
          </div>
        </div>

        <div className="flex flex-col justify-between items-start md:items-end border-t md:border-t-0 border-slate-100 pt-4 md:pt-0 shrink-0">
          <div className="text-left md:text-right">
            <span className="text-xs font-bold text-slate-400 block uppercase tracking-wider">Renewal Date</span>
            <div className="flex items-center gap-1.5 text-sm font-black text-slate-900 mt-1">
              <Calendar className="w-4 h-4 text-slate-400" />
              {formatDate(sub?.expiresAt)}
            </div>
          </div>

          <div className="mt-4 text-xs font-bold text-slate-500 uppercase tracking-widest">
            Cycle: {sub?.billingCycle || 'N/A'}
          </div>
        </div>
      </Card>

      {/* Payment History Table */}
      <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center gap-2">
          <History className="w-5 h-5 text-slate-400" />
          <h2 className="text-base font-black text-slate-900">Payment & Transaction Receipts</h2>
        </div>

        {history.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-sm font-medium">
            No previous transaction records found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50/50 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                  <th className="p-4 pl-6">Date</th>
                  <th className="p-4">Plan / Cycle</th>
                  <th className="p-4">Amount Paid</th>
                  <th className="p-4">Invoice No</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {history.map((h) => (
                  <tr key={h.id} className="hover:bg-slate-50/30 transition-colors">
                    <td className="p-4 pl-6 font-semibold text-slate-800">
                      {new Date(h.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-slate-800">{h.plan}</div>
                      <div className="text-[10px] text-slate-400 font-semibold uppercase">{h.billingCycle.toLowerCase()}</div>
                    </td>
                    <td className="p-4 font-black text-slate-900">₹{h.amount}</td>
                    <td className="p-4 font-mono text-xs text-slate-500">
                      <div className="flex items-center gap-1">
                        <FileText className="w-3.5 h-3.5 text-slate-400" />
                        {h.invoiceNumber || 'N/A'}
                      </div>
                    </td>
                    <td className="p-4">{getStatusBadge(h.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500 font-semibold">
              Page {page} of {totalPages}
            </span>
            
            <div className="flex gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed text-slate-500"
                aria-label="Previous page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed text-slate-500"
                aria-label="Next page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
