'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';
import Topbar from '@/components/layout/Topbar';
import { api } from '@/lib/api';
import type { Assignment } from '@/types';
import { format } from 'date-fns';

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Assignment | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchAssignments = useCallback(() => {
    setLoading(true);
    api.listAssignments()
      .then(setAssignments)
      .catch(() => setAssignments([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchAssignments();
  }, [fetchAssignments]);

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    setDeleting(true);
    try {
      await api.deleteAssignment(deleteConfirm._id);
      setAssignments((prev) => prev.filter((a) => a._id !== deleteConfirm._id));
      setDeleteConfirm(null);
    } catch {
      // still close on error — user can refresh
      setDeleteConfirm(null);
    } finally {
      setDeleting(false);
    }
  };

  const isEmpty = !loading && assignments.length === 0;

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-content">
        <Topbar
          actions={
            <Link href="/assignments/create" style={{ textDecoration: 'none' }}>
              <button className="topbar-create-btn">
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                  <path d="M6.5 1v11M1 6.5h11" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
                </svg>
                Create Assignment
              </button>
            </Link>
          }
        />

        <div style={{ padding: '0', flex: 1, display: 'flex', flexDirection: 'column' }}>
          {loading && (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
              <div className="spinner" style={{ borderTopColor: '#F97316', borderColor: '#E5E5E5', width: '24px', height: '24px' }} />
            </div>
          )}

          {isEmpty && <EmptyState />}

          {!loading && assignments.length > 0 && (
            <div style={{ padding: '20px 24px' }}>
              {/* Header row */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
                <p style={{ fontSize: '13px', color: '#6B7280' }}>
                  {assignments.length} assignment{assignments.length !== 1 ? 's' : ''}
                </p>
                <Link href="/assignments/create" style={{ textDecoration: 'none' }}>
                  <button className="btn-orange" style={{ height: '34px', fontSize: '13px', padding: '0 14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M6 1v10M1 6h10" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
                    </svg>
                    New
                  </button>
                </Link>
              </div>

              <div className="assignments-grid">
                {assignments.map((a) => (
                  <AssignmentCard
                    key={a._id}
                    assignment={a}
                    menuOpen={menuOpen === a._id}
                    onMenuToggle={() => setMenuOpen(menuOpen === a._id ? null : a._id)}
                    onMenuClose={() => setMenuOpen(null)}
                    onDeleteRequest={() => { setMenuOpen(null); setDeleteConfirm(a); }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 100,
            background: 'rgba(0,0,0,0.45)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '16px',
          }}
          onClick={() => !deleting && setDeleteConfirm(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#fff', borderRadius: '16px',
              padding: '28px 28px 24px',
              width: '100%', maxWidth: '380px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
            }}
          >
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#FEE2E2', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <path d="M3 5.5h16M8.5 5.5V4a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 .5.5v1.5M6.5 5.5l.8 12h7.4l.8-12" stroke="#DC2626" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#111827', marginBottom: '8px' }}>
              Delete Assignment?
            </h3>
            <p style={{ fontSize: '13px', color: '#6B7280', lineHeight: '1.6', marginBottom: '24px' }}>
              <strong style={{ color: '#111827' }}>{deleteConfirm.title}</strong> will be permanently deleted. This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => setDeleteConfirm(null)}
                disabled={deleting}
                style={{ flex: 1, height: '40px', background: '#F5F5F5', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: 600, color: '#374151', cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                style={{ flex: 1, height: '40px', background: '#DC2626', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: 600, color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
              >
                {deleting ? (
                  <><div className="spinner" /> Deleting...</>
                ) : (
                  'Delete'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
      padding: '60px 24px',
      gap: '0',
    }}>
      <div style={{ position: 'relative', width: '200px', height: '180px', marginBottom: '24px' }}>
        <svg width="200" height="180" viewBox="0 0 200 180" fill="none">
          <circle cx="100" cy="95" r="72" fill="#EEF2F7"/>
          <rect x="60" y="30" width="80" height="100" rx="6" fill="#D8E0EC" opacity="0.5"/>
          <rect x="55" y="25" width="80" height="100" rx="6" fill="#E8EEF7" stroke="#D1D9E8" strokeWidth="1"/>
          <rect x="48" y="18" width="82" height="106" rx="7" fill="white" stroke="#D1D9E8" strokeWidth="1.5"/>
          <path d="M62 40h54M62 52h54M62 64h42" stroke="#E2E8F0" strokeWidth="2.5" strokeLinecap="round"/>
          <path d="M116 22 C126 18, 134 26, 126 36 C120 44, 114 38, 118 30" stroke="#374151" strokeWidth="2" strokeLinecap="round" fill="none"/>
          <circle cx="136" cy="118" r="30" fill="#EEF2F7" stroke="#D8E2F0" strokeWidth="2"/>
          <circle cx="131" cy="113" r="20" fill="white" stroke="#D0D8E8" strokeWidth="2"/>
          <path d="M122 104l18 18M140 104l-18 18" stroke="#EF4444" strokeWidth="3" strokeLinecap="round"/>
          <path d="M146 128l12 12" stroke="#9CA3AF" strokeWidth="3.5" strokeLinecap="round"/>
          <path d="M50 130L52 126L54 130L52 134L50 130Z" fill="#60A5FA"/>
          <circle cx="160" cy="45" r="4" fill="#93C5FD"/>
          <path d="M38 55L40 51L42 55L40 59L38 55Z" fill="#93C5FD" opacity="0.6"/>
        </svg>
      </div>

      <div style={{ textAlign: 'center', maxWidth: '360px', marginBottom: '28px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#111827', marginBottom: '10px' }}>
          No assignments yet
        </h3>
        <p style={{ fontSize: '13px', color: '#6B7280', lineHeight: '1.6' }}>
          Create your first assignment to start collecting and grading student submissions.
        </p>
      </div>

      <Link href="/assignments/create" style={{ textDecoration: 'none' }}>
        <button className="btn-primary" style={{ height: '42px', fontSize: '14px', padding: '0 24px', borderRadius: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 1v12M1 7h12" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          Create Your First Assignment
        </button>
      </Link>
    </div>
  );
}

function AssignmentCard({
  assignment,
  menuOpen,
  onMenuToggle,
  onMenuClose,
  onDeleteRequest,
}: {
  assignment: Assignment;
  menuOpen: boolean;
  onMenuToggle: () => void;
  onMenuClose: () => void;
  onDeleteRequest: () => void;
}) {
  const router = useRouter();

  const statusColor =
    assignment.status === 'completed' ? '#16A34A' :
    assignment.status === 'processing' ? '#D97706' :
    assignment.status === 'failed' ? '#DC2626' : '#6B7280';

  const statusLabel =
    assignment.status === 'completed' ? 'Completed' :
    assignment.status === 'processing' ? 'Generating...' :
    assignment.status === 'failed' ? 'Failed' : 'Pending';

  const canView = assignment.status === 'completed';

  return (
    <div
      className="assignment-card"
      style={{ position: 'relative' }}
      onClick={() => { onMenuClose(); if (canView) router.push(`/assignments/${assignment._id}`); }}
    >
      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '10px' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: '14px', fontWeight: 600, color: '#111827', marginBottom: '3px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {assignment.title}
          </div>
          <div style={{ fontSize: '12px', color: '#6B7280' }}>{assignment.subject} · {assignment.grade}</div>
        </div>
        {/* 3-dot menu */}
        <button
          onClick={(e) => { e.stopPropagation(); onMenuToggle(); }}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px 4px', borderRadius: '4px', color: '#6B7280', flexShrink: 0 }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <circle cx="8" cy="3.5" r="1.2"/><circle cx="8" cy="8" r="1.2"/><circle cx="8" cy="12.5" r="1.2"/>
          </svg>
        </button>

        {/* Dropdown menu */}
        {menuOpen && (
          <>
            <div style={{ position: 'fixed', inset: 0, zIndex: 10 }} onClick={(e) => { e.stopPropagation(); onMenuClose(); }} />
            <div style={{ position: 'absolute', right: '8px', top: '36px', background: '#fff', border: '1px solid #E5E5E5', borderRadius: '10px', boxShadow: '0px 4px 16px rgba(0,0,0,0.12)', zIndex: 20, minWidth: '160px', padding: '4px' }}>
              {canView && (
                <div
                  onClick={(e) => { e.stopPropagation(); onMenuClose(); router.push(`/assignments/${assignment._id}`); }}
                  style={{ padding: '8px 12px', fontSize: '13px', color: '#111827', cursor: 'pointer', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#F5F5F5')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'none')}
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 7s2.5-5 6-5 6 5 6 5-2.5 5-6 5-6-5-6-5Z" stroke="currentColor" strokeWidth="1.3"/><circle cx="7" cy="7" r="2" stroke="currentColor" strokeWidth="1.3"/></svg>
                  View Paper
                </div>
              )}
              <div
                onClick={(e) => { e.stopPropagation(); onDeleteRequest(); }}
                style={{ padding: '8px 12px', fontSize: '13px', color: '#DC2626', cursor: 'pointer', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}
                onMouseEnter={e => (e.currentTarget.style.background = '#FFF1F2')}
                onMouseLeave={e => (e.currentTarget.style.background = 'none')}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 3.5h10M5.5 3.5V2h3v1.5M4 3.5l.5 8h5l.5-8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
                Delete
              </div>
            </div>
          </>
        )}
      </div>

      {/* Meta row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '12px', color: '#6B7280', marginBottom: '12px' }}>
        <span>Due: {format(new Date(assignment.dueDate), 'dd/MM/yyyy')}</span>
        <span>·</span>
        <span>{assignment.totalMarks} marks</span>
      </div>

      {/* Status + action */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '11px', fontWeight: 500, color: statusColor, background: `${statusColor}15`, padding: '2px 8px', borderRadius: '4px' }}>
          {statusLabel}
        </span>
        {canView && (
          <button
            onClick={(e) => { e.stopPropagation(); router.push(`/assignments/${assignment._id}`); }}
            className="btn-secondary"
            style={{ height: '28px', fontSize: '12px', padding: '0 10px' }}
          >
            View
          </button>
        )}
      </div>
    </div>
  );
}
