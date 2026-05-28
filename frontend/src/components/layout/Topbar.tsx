'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useSidebarStore } from '@/store/sidebarStore';

interface TopbarProps {
  showBack?: boolean;
  crumb?: string;
  crumbIcon?: React.ReactNode;
  actions?: React.ReactNode;
}

const PAGE_CRUMBS: Record<string, { label: string; icon: React.ReactNode }> = {
  '/assignments': {
    label: 'Assignment',
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <rect x="1" y="1" width="5" height="5" rx="1" stroke="#6B7280" strokeWidth="1.3"/>
        <rect x="8" y="1" width="5" height="5" rx="1" stroke="#6B7280" strokeWidth="1.3"/>
        <rect x="1" y="8" width="5" height="5" rx="1" stroke="#6B7280" strokeWidth="1.3"/>
        <rect x="8" y="8" width="5" height="5" rx="1" stroke="#6B7280" strokeWidth="1.3"/>
      </svg>
    ),
  },
  '/groups': {
    label: 'My Groups',
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <circle cx="5" cy="4.5" r="2" stroke="#6B7280" strokeWidth="1.3"/>
        <path d="M1 11c0-2 1.79-3.5 4-3.5s4 1.5 4 3.5" stroke="#6B7280" strokeWidth="1.3" strokeLinecap="round"/>
        <circle cx="10" cy="4.5" r="1.5" stroke="#6B7280" strokeWidth="1.2"/>
        <path d="M11 7.5c1.5.5 2.5 1.8 2.5 3" stroke="#6B7280" strokeWidth="1.2" strokeLinecap="round"/>
      </svg>
    ),
  },
  '/toolkit': {
    label: "AI Teacher's Toolkit",
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <rect x="1" y="4" width="12" height="8" rx="1.5" stroke="#6B7280" strokeWidth="1.3"/>
        <path d="M4.5 4V3a2.5 2.5 0 0 1 5 0v1" stroke="#6B7280" strokeWidth="1.3" strokeLinecap="round"/>
        <circle cx="7" cy="8" r="1.2" stroke="#6B7280" strokeWidth="1.2"/>
      </svg>
    ),
  },
  '/library': {
    label: 'My Library',
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M2 1.5h10a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1Z" stroke="#6B7280" strokeWidth="1.3"/>
        <path d="M5 1.5v11M2 4.5h3M2 7h3M2 9.5h3" stroke="#6B7280" strokeWidth="1.2" strokeLinecap="round"/>
      </svg>
    ),
  },
  '/settings': {
    label: 'Settings',
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <circle cx="7" cy="7" r="2" stroke="#6B7280" strokeWidth="1.3"/>
        <path d="M7 1.5v1M7 11.5v1M1.5 7h1M11.5 7h1M3 3l.7.7M10.3 10.3l.7.7M3 11l.7-.7M10.3 3.7l.7-.7" stroke="#6B7280" strokeWidth="1.3" strokeLinecap="round"/>
      </svg>
    ),
  },
};

export default function Topbar({ showBack = false, crumb, crumbIcon, actions }: TopbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { toggle } = useSidebarStore();

  const autoPageInfo = !crumb ? Object.entries(PAGE_CRUMBS).find(([key]) => pathname.startsWith(key))?.[1] : null;
  const displayLabel = crumb ?? autoPageInfo?.label;
  const displayIcon = crumbIcon ?? autoPageInfo?.icon;

  return (
    <header className="topbar no-print">
      {/* Mobile hamburger */}
      <button className="mobile-menu-btn" onClick={toggle} aria-label="Toggle menu">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M2 4h12M2 8h12M2 12h12" stroke="#374151" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </button>

      {showBack && (
        <>
          <button className="topbar-back" onClick={() => router.back()}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M9 2L4 7L9 12" stroke="#374151" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <div className="topbar-divider" />
        </>
      )}

      {displayLabel && (
        <div className="topbar-crumb">
          {displayIcon && <span style={{ display: 'flex', alignItems: 'center' }}>{displayIcon}</span>}
          <span style={{ fontSize: '13px', color: '#374151', fontWeight: 500 }}>{displayLabel}</span>
        </div>
      )}

      {actions && <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: '8px' }}>{actions}</div>}

      <div className="topbar-right">
        {/* Bell */}
        <div className="topbar-bell">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M9 1.5a5.5 5.5 0 0 0-5.5 5.5v3L2 12h14l-1.5-2V7A5.5 5.5 0 0 0 9 1.5Z" stroke="#374151" strokeWidth="1.4" strokeLinejoin="round"/>
            <path d="M7 12v.5a2 2 0 1 0 4 0V12" stroke="#374151" strokeWidth="1.4"/>
          </svg>
          <div className="bell-dot" />
        </div>

        {/* User */}
        <div className="topbar-user">
          <div className="user-avatar">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <rect width="28" height="28" rx="14" fill="#E5E5E5"/>
              <circle cx="14" cy="11" r="4" fill="#9CA3AF"/>
              <path d="M5 24c0-4.97 4.03-9 9-9s9 4.03 9 9" fill="#9CA3AF"/>
            </svg>
          </div>
          <span className="user-name" style={{ display: 'none' }}>John Doe</span>
          <span className="user-name-desktop">John Doe</span>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 4l4 4 4-4" stroke="#6B7280" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
    </header>
  );
}
