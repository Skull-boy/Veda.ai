import Sidebar from '@/components/layout/Sidebar';
import Topbar from '@/components/layout/Topbar';
import Link from 'next/link';

export default function ToolkitPage() {
  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-content">
        <Topbar />
        <div style={{ padding: '28px 32px' }}>
          <div style={{ marginBottom: '28px' }}>
            <h1 style={{ fontSize: '20px', fontWeight: 700, color: '#111827', marginBottom: '4px' }}>AI Teacher&apos;s Toolkit</h1>
            <p style={{ fontSize: '13px', color: '#6B7280' }}>Powerful AI tools to streamline your teaching workflow.</p>
          </div>

          {/* Tool cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
            {/* Assignment Creator */}
            <Link href="/assignments/create" style={{ textDecoration: 'none' }}>
              <div className="assignment-card" style={{ padding: '20px' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: '#FFF7ED', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
                  <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                    <rect x="3" y="2" width="16" height="18" rx="3" stroke="#F97316" strokeWidth="1.5"/>
                    <path d="M7 7h8M7 11h8M7 15h5" stroke="#F97316" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </div>
                <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#111827', marginBottom: '6px' }}>AI Question Paper</h3>
                <p style={{ fontSize: '12px', color: '#6B7280', lineHeight: '1.5' }}>Generate customized question papers with AI based on your curriculum.</p>
              </div>
            </Link>

            {/* Rubric Generator */}
            <div className="assignment-card" style={{ padding: '20px', opacity: 0.6, cursor: 'not-allowed' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: '#F0F2F5', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                  <path d="M4 4h14v14H4V4Z" stroke="#9CA3AF" strokeWidth="1.5"/>
                  <path d="M4 8h14M4 12h14M8 4v14" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
              <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#111827', marginBottom: '6px' }}>Rubric Generator</h3>
              <p style={{ fontSize: '12px', color: '#6B7280', lineHeight: '1.5' }}>Create detailed marking rubrics for assignments. <span style={{ color: '#F97316', fontWeight: 500 }}>Coming soon</span></p>
            </div>

            {/* Auto Grader */}
            <div className="assignment-card" style={{ padding: '20px', opacity: 0.6, cursor: 'not-allowed' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: '#F0F2F5', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                  <circle cx="11" cy="11" r="8" stroke="#9CA3AF" strokeWidth="1.5"/>
                  <path d="M7 11l3 3 5-5" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#111827', marginBottom: '6px' }}>Auto Grader</h3>
              <p style={{ fontSize: '12px', color: '#6B7280', lineHeight: '1.5' }}>Automatically grade student submissions with AI feedback. <span style={{ color: '#F97316', fontWeight: 500 }}>Coming soon</span></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
