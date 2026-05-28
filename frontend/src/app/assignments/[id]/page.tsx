'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';
import Topbar from '@/components/layout/Topbar';
import { useAssignmentStore } from '@/store/assignmentStore';
import { useJobWebSocket } from '@/hooks/useJobWebSocket';
import { api } from '@/lib/api';
import GenerationProgress from '@/components/ui/GenerationProgress';
import QuestionPaper from '@/components/paper/QuestionPaper';

export default function AssignmentResultPage() {
  const params = useParams<{ id: string }>();
  const assignmentId = params.id;

  const {
    jobStatus, jobProgress, generatedPaper, errorMessage,
    currentAssignmentId, setCurrentAssignmentId,
    setJobStatus, setGeneratedPaper, setIsRegenerating, isRegenerating,
  } = useAssignmentStore();

  useJobWebSocket(assignmentId);

  useEffect(() => {
    if (currentAssignmentId !== assignmentId) {
      setCurrentAssignmentId(assignmentId);
      api.getAssignment(assignmentId).then((a) => {
        setJobStatus(a.status);
        if (a.generatedPaper) setGeneratedPaper(a.generatedPaper);
      });
    }
  }, [assignmentId, currentAssignmentId, setCurrentAssignmentId, setJobStatus, setGeneratedPaper]);

  const handleRegenerate = async () => {
    try {
      setIsRegenerating(true);
      setJobStatus('pending');
      await api.regenerateAssignment(assignmentId);
    } catch {
      setJobStatus('failed');
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleDownloadPDF = () => {
    window.print();
  };

  const isLoading = jobStatus === 'pending' || jobStatus === 'processing';

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-content">
        <Topbar
          showBack
          crumb="Add to Quiz Assign"
          crumbIcon={
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <circle cx="7" cy="7" r="5.5" stroke="#6B7280" strokeWidth="1.3"/>
              <path d="M5 7l1.5 1.5L9.5 5" stroke="#6B7280" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          }
          actions={
            jobStatus === 'completed' && generatedPaper ? (
              <div style={{ display: 'flex', gap: '8px' }}>
                <button className="btn-secondary" onClick={handleRegenerate} disabled={isRegenerating}
                  style={{ height: '34px', fontSize: '13px', padding: '0 14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                    <path d="M1 6.5A5.5 5.5 0 0 0 6.5 12M1 6.5A5.5 5.5 0 0 1 6.5 1M1 6.5H3M6.5 1a5.5 5.5 0 0 1 5.5 5.5M6.5 1V3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                  </svg>
                  {isRegenerating ? 'Regenerating...' : 'Regenerate'}
                </button>
                <button className="btn-orange" onClick={handleDownloadPDF}
                  style={{ height: '34px', fontSize: '13px', padding: '0 14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                    <path d="M6.5 8.5V2M6.5 8.5L4 6M6.5 8.5L9 6" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M1.5 10v.5A1.5 1.5 0 0 0 3 12h7a1.5 1.5 0 0 0 1.5-1.5V10" stroke="white" strokeWidth="1.4" strokeLinecap="round"/>
                  </svg>
                  Download PDF
                </button>
              </div>
            ) : null
          }
        />

        <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', gap: '20px', overflowY: 'auto' }}>
          {isLoading && <GenerationProgress progress={jobProgress} status={jobStatus!} />}

          {jobStatus === 'failed' && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 0', gap: '16px' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#FEE2E2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M12 8v5M12 16v.5" stroke="#DC2626" strokeWidth="2" strokeLinecap="round"/>
                  <circle cx="12" cy="12" r="10" stroke="#DC2626" strokeWidth="1.5"/>
                </svg>
              </div>
              <div style={{ textAlign: 'center' }}>
                <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#111827', marginBottom: '6px' }}>Generation Failed</h3>
                <p style={{ fontSize: '13px', color: '#6B7280', maxWidth: '300px' }}>{errorMessage ?? 'Something went wrong. Please try again.'}</p>
              </div>
              <button className="btn-orange" onClick={handleRegenerate}>Try Again</button>
            </div>
          )}

          {jobStatus === 'completed' && generatedPaper && (
            <>
              {/* AI Banner — matching the dark banner in the screenshot */}
              <div className="ai-banner no-print">
                <p style={{ fontSize: '14px', lineHeight: '1.7', marginBottom: '16px', color: '#F9FAFB' }}>
                  Certainly, Lakshya! Here are customized Question Paper for your CBSE Grade 8 Science classes on the NCERT chapters:
                </p>
                <button
                  onClick={handleDownloadPDF}
                  style={{
                    background: 'rgba(255,255,255,0.12)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    color: '#fff',
                    height: '36px',
                    fontSize: '13px',
                    padding: '0 16px',
                    borderRadius: '8px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                    transition: 'background 0.15s',
                    fontWeight: 500,
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.2)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.12)')}
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M7 9.5V2M7 9.5L4.5 7M7 9.5L9.5 7" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M1.5 10.5v1A1.5 1.5 0 0 0 3 13h8a1.5 1.5 0 0 0 1.5-1.5v-1" stroke="white" strokeWidth="1.4" strokeLinecap="round"/>
                  </svg>
                  Download as PDF
                </button>
              </div>

              {/* Paper */}
              <QuestionPaper paper={generatedPaper} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
