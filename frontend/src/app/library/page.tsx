'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';
import Topbar from '@/components/layout/Topbar';
import { api } from '@/lib/api';
import type { Assignment } from '@/types';
import { format, parseISO } from 'date-fns';

export default function LibraryPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);

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

  // Only show completed/generated ones in Library
  const completedAssignments = useMemo(() => {
    return assignments.filter(a => a.status === 'completed');
  }, [assignments]);

  // Group by Due Date
  const groupedByDate = useMemo(() => {
    const groups: Record<string, Assignment[]> = {};
    completedAssignments.forEach(a => {
      const dateStr = format(new Date(a.dueDate), 'MMMM d, yyyy');
      if (!groups[dateStr]) groups[dateStr] = [];
      groups[dateStr].push(a);
    });
    // Sort dates (descending)
    return Object.entries(groups).sort((a, b) => {
      return new Date(b[0]).getTime() - new Date(a[0]).getTime();
    });
  }, [completedAssignments]);

  const isEmpty = !loading && completedAssignments.length === 0;

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-content">
        <Topbar />
        
        <div style={{ padding: '0', flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '24px 32px 12px' }}>
            <h1 style={{ fontSize: '20px', fontWeight: 700, color: '#111827', marginBottom: '4px' }}>My Library</h1>
            <p style={{ fontSize: '13px', color: '#6B7280' }}>Your generated question papers, organized by due date.</p>
          </div>

          {loading && (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
              <div className="spinner" style={{ borderTopColor: '#F97316', borderColor: '#E5E5E5', width: '24px', height: '24px' }} />
            </div>
          )}

          {isEmpty && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '60px 0', gap: '16px', flex: 1 }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                  <path d="M4 3h20a1 1 0 0 1 1 1v20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" stroke="#9CA3AF" strokeWidth="1.5"/>
                  <path d="M9 3v22M4 8h5M4 13h5M4 18h5" stroke="#9CA3AF" strokeWidth="1.4" strokeLinecap="round"/>
                </svg>
              </div>
              <div style={{ textAlign: 'center' }}>
                <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#111827', marginBottom: '6px' }}>Library is empty</h3>
                <p style={{ fontSize: '13px', color: '#6B7280', maxWidth: '280px' }}>Your generated question papers will appear here once saved.</p>
              </div>
              <Link href="/assignments/create" style={{ textDecoration: 'none', marginTop: '10px' }}>
                <button className="btn-primary" style={{ height: '36px', fontSize: '13px', padding: '0 20px', borderRadius: '18px' }}>
                  Create Paper
                </button>
              </Link>
            </div>
          )}

          {!loading && !isEmpty && (
            <div style={{ padding: '10px 32px 40px' }}>
              {groupedByDate.map(([date, items]) => (
                <div key={date} style={{ marginBottom: '36px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                    <h2 style={{ fontSize: '15px', fontWeight: 600, color: '#111827' }}>Due: {date}</h2>
                    <div style={{ flex: 1, height: '1px', background: '#E5E7EB' }} />
                  </div>

                  <div className="library-grid">
                    {items.map(a => (
                      <PadCard key={a._id} assignment={a} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function PadCard({ assignment }: { assignment: Assignment }) {
  const router = useRouter();
  
  return (
    <div
      onClick={() => router.push(`/assignments/${assignment._id}`)}
      className="pad-card"
      style={{
        position: 'relative',
        background: '#fff',
        borderRadius: '6px 16px 16px 6px',
        border: '1px solid #E5E7EB',
        borderLeft: '10px solid #2563EB', // Blue spine
        boxShadow: '3px 4px 14px rgba(0,0,0,0.06)',
        padding: '24px 20px 20px 28px',
        cursor: 'pointer',
        minHeight: '160px',
        display: 'flex',
        flexDirection: 'column',
        backgroundImage: 'repeating-linear-gradient(transparent, transparent 27px, #F1F5F9 28px)',
        backgroundPosition: '0 12px',
        transition: 'transform 0.2s, box-shadow 0.2s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-3px)';
        e.currentTarget.style.boxShadow = '5px 8px 20px rgba(0,0,0,0.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'none';
        e.currentTarget.style.boxShadow = '3px 4px 14px rgba(0,0,0,0.06)';
      }}
    >
      {/* 3 punched holes on the left */}
      <div style={{ position: 'absolute', left: '-5px', top: '24px', width: '10px', height: '10px', background: '#F0F2F5', borderRadius: '50%', boxShadow: 'inset 1px 1px 3px rgba(0,0,0,0.2)' }} />
      <div style={{ position: 'absolute', left: '-5px', top: '50%', transform: 'translateY(-50%)', width: '10px', height: '10px', background: '#F0F2F5', borderRadius: '50%', boxShadow: 'inset 1px 1px 3px rgba(0,0,0,0.2)' }} />
      <div style={{ position: 'absolute', left: '-5px', bottom: '24px', width: '10px', height: '10px', background: '#F0F2F5', borderRadius: '50%', boxShadow: 'inset 1px 1px 3px rgba(0,0,0,0.2)' }} />
      
      {/* Vertical red margin line */}
      <div style={{ position: 'absolute', left: '22px', top: 0, bottom: 0, width: '1px', background: 'rgba(239, 68, 68, 0.3)' }} />
      <div style={{ position: 'absolute', left: '25px', top: 0, bottom: 0, width: '1px', background: 'rgba(239, 68, 68, 0.3)' }} />
      
      {/* Subject badge (like a sticky note) */}
      <div style={{ position: 'absolute', top: '-10px', right: '16px', background: '#FDE047', color: '#854D0E', fontSize: '11px', fontWeight: 700, padding: '4px 10px', borderRadius: '2px', boxShadow: '1px 2px 4px rgba(0,0,0,0.1)', transform: 'rotate(2deg)' }}>
        {assignment.subject}
      </div>

      <div style={{ position: 'relative', zIndex: 2 }}>
        <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#111827', marginBottom: '8px', lineHeight: '1.4', background: '#fff', display: 'inline-block' }}>
          {assignment.title}
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#4B5563', background: '#fff', width: 'fit-content', padding: '0 4px' }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" transform="rotate(45 7 7)"/></svg>
            <span style={{ fontWeight: 600, color: '#1F2937' }}>{assignment.grade}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#4B5563', background: '#fff', width: 'fit-content', padding: '0 4px' }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5"/><path d="M7 4v3l2 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
            <span>{assignment.totalMarks} Marks</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#4B5563', background: '#fff', width: 'fit-content', padding: '0 4px' }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="2" y="3" width="10" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.5"/><path d="M2 6h10M4 1.5v3M10 1.5v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
            <span>Created {format(new Date(assignment.createdAt), 'MMM d')}</span>
          </div>
        </div>
      </div>
      
      <div style={{ marginTop: 'auto', paddingTop: '16px', display: 'flex', justifyContent: 'flex-end', position: 'relative', zIndex: 2 }}>
        <button style={{ background: '#fff', border: '1px solid #D1D5DB', borderRadius: '20px', padding: '4px 12px', fontSize: '12px', fontWeight: 600, color: '#374151', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
          Open Paper
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2.5 6h7M6.5 2.5l3.5 3.5-3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
      </div>
    </div>
  );
}
