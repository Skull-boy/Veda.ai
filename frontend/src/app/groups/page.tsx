import Sidebar from '@/components/layout/Sidebar';
import Topbar from '@/components/layout/Topbar';

export default function GroupsPage() {
  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-content">
        <Topbar />
        <div style={{ padding: '28px 32px' }}>
          <h1 style={{ fontSize: '20px', fontWeight: 700, color: '#111827', marginBottom: '6px' }}>My Groups</h1>
          <p style={{ fontSize: '13px', color: '#6B7280', marginBottom: '24px' }}>Manage your student groups and classes.</p>
          {/* Empty state */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '80px 0', gap: '16px' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <circle cx="10" cy="9" r="4" stroke="#9CA3AF" strokeWidth="1.5"/>
                <circle cx="19" cy="9" r="3" stroke="#9CA3AF" strokeWidth="1.4"/>
                <path d="M2 22c0-3.866 3.582-7 8-7s8 3.134 8 7" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M19 14c2.8.8 5 3.2 5 6" stroke="#9CA3AF" strokeWidth="1.4" strokeLinecap="round"/>
              </svg>
            </div>
            <div style={{ textAlign: 'center' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#111827', marginBottom: '6px' }}>No groups yet</h3>
              <p style={{ fontSize: '13px', color: '#6B7280' }}>Create a group to organize your students.</p>
            </div>
            <button className="btn-primary" style={{ borderRadius: '20px', height: '38px', padding: '0 20px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M6 1v10M1 6h10" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
              Create Group
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
