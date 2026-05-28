import Sidebar from '@/components/layout/Sidebar';
import Topbar from '@/components/layout/Topbar';

export default function SettingsPage() {
  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-content">
        <Topbar />
        <div style={{ padding: '28px 32px', maxWidth: '640px' }}>
          <div style={{ marginBottom: '28px' }}>
            <h1 style={{ fontSize: '20px', fontWeight: 700, color: '#111827', marginBottom: '4px' }}>Settings</h1>
            <p style={{ fontSize: '13px', color: '#6B7280' }}>Manage your account and preferences.</p>
          </div>

          {/* Profile section */}
          <div style={{ background: '#fff', border: '1px solid #E8EAED', borderRadius: '12px', padding: '20px', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '14px', fontWeight: 600, color: '#111827', marginBottom: '16px' }}>Profile</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#E5E5E5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <circle cx="16" cy="12" r="5" fill="#9CA3AF"/>
                  <path d="M6 28c0-5.523 4.477-10 10-10s10 4.477 10 10" fill="#9CA3AF"/>
                </svg>
              </div>
              <div>
                <div style={{ fontSize: '15px', fontWeight: 600, color: '#111827' }}>John Doe</div>
                <div style={{ fontSize: '13px', color: '#6B7280' }}>john.doe@delhipublicschool.edu</div>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 500, color: '#374151', marginBottom: '6px', display: 'block' }}>Full Name</label>
                <input className="form-input" defaultValue="John Doe" />
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 500, color: '#374151', marginBottom: '6px', display: 'block' }}>Email</label>
                <input className="form-input" defaultValue="john.doe@delhipublicschool.edu" />
              </div>
            </div>
          </div>

          {/* School section */}
          <div style={{ background: '#fff', border: '1px solid #E8EAED', borderRadius: '12px', padding: '20px', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '14px', fontWeight: 600, color: '#111827', marginBottom: '16px' }}>School</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 500, color: '#374151', marginBottom: '6px', display: 'block' }}>School Name</label>
                <input className="form-input" defaultValue="Delhi Public School" />
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 500, color: '#374151', marginBottom: '6px', display: 'block' }}>Location</label>
                <input className="form-input" defaultValue="Bokaro Steel City" />
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button className="btn-primary">Save Changes</button>
          </div>
        </div>
      </div>
    </div>
  );
}
