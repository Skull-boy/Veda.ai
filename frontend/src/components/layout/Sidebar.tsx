'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSidebarStore } from '@/store/sidebarStore';

const navItems = [
  {
    label: 'Home',
    href: '/',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="1" y="1" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
        <rect x="9" y="1" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
        <rect x="1" y="9" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
        <rect x="9" y="9" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
      </svg>
    ),
  },
  {
    label: 'My Groups',
    href: '/groups',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="6" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.4"/>
        <circle cx="11" cy="5" r="2" stroke="currentColor" strokeWidth="1.3"/>
        <path d="M1 13c0-2.21 2.239-4 5-4s5 1.79 5 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
        <path d="M11.5 9.5c1.933 0 3.5 1.343 3.5 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    label: 'Assignments',
    href: '/assignments',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="2" y="1" width="12" height="14" rx="2" stroke="currentColor" strokeWidth="1.4"/>
        <path d="M5 5h6M5 8h6M5 11h4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    label: "AI Teacher's Toolkit",
    href: '/toolkit',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="1" y="4" width="14" height="9" rx="2" stroke="currentColor" strokeWidth="1.4"/>
        <path d="M5 4V3a3 3 0 0 1 6 0v1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
        <circle cx="8" cy="8.5" r="1.5" stroke="currentColor" strokeWidth="1.3"/>
      </svg>
    ),
  },
  {
    label: 'My Library',
    href: '/library',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M3 2h10a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1Z" stroke="currentColor" strokeWidth="1.4"/>
        <path d="M6 2v12M3 5h3M3 8h3M3 11h3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
      </svg>
    ),
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { isOpen, close } = useSidebarStore();
  const isAssignmentsPage = pathname.startsWith('/assignments');

  return (
    <>
      {/* Mobile overlay backdrop */}
      <div
        className={`sidebar-overlay${isOpen ? ' visible' : ''}`}
        onClick={close}
      />

      <aside className={`sidebar${isOpen ? ' mobile-open' : ''}`}>
        {/* Logo */}
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="24" height="24" rx="6" fill="#1e1e1e"/>
              <path d="M8.5 7L12 16L17 7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M7 7L10.5 16" stroke="#F97316" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="sidebar-logo-text">VedaAI</span>

          {/* Close button on mobile */}
          <button
            onClick={close}
            style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280', padding: '4px' }}
            className="mobile-close-btn"
            aria-label="Close menu"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* CTA */}
        <Link
          href={isAssignmentsPage ? '/assignments/create' : '/toolkit'}
          style={{ textDecoration: 'none' }}
          onClick={close}
        >
          <button className="sidebar-cta">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 1L7.8 5.2L12 6L7.8 6.8L7 11L6.2 6.8L2 6L6.2 5.2L7 1Z" fill="white"/>
              <path d="M11.5 2L11.9 3.6L13.5 4L11.9 4.4L11.5 6L11.1 4.4L9.5 4L11.1 3.6L11.5 2Z" fill="white" opacity="0.7"/>
            </svg>
            {isAssignmentsPage ? 'Create Assignment' : "AI Teacher's Toolkit"}
          </button>
        </Link>

        {/* Nav */}
        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const isActive =
              item.href === '/'
                ? pathname === '/'
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-item${isActive ? ' active' : ''}`}
                style={{ textDecoration: 'none' }}
                onClick={close}
              >
                <span style={{ color: isActive ? '#111827' : '#6B7280', flexShrink: 0 }}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom: Settings + School */}
        <div className="sidebar-bottom">
          <Link
            href="/settings"
            className="nav-item"
            style={{ textDecoration: 'none', marginBottom: '10px' }}
            onClick={close}
          >
            <span style={{ color: '#6B7280' }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.4"/>
                <path d="M8 1.5v1M8 13.5v1M1.5 8h1M13.5 8h1M3.4 3.4l.7.7M11.9 11.9l.7.7M3.4 12.6l.7-.7M11.9 4.1l.7-.7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
              </svg>
            </span>
            Settings
          </Link>

          <div className="sidebar-school-card">
            <div className="school-avatar">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 3L20 7V12C20 16.418 16.418 20.5 12 21.5C7.582 20.5 4 16.418 4 12V7L12 3Z" fill="#E8F4FD" stroke="#93C5FD" strokeWidth="1.5" strokeLinejoin="round"/>
                <path d="M9 12L11 14L15 10" stroke="#3B82F6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="school-info">
              <div className="name">Delhi Public School</div>
              <div className="sub">Bokaro Steel City</div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
