interface AdminNavIconProps {
  icon: string;
  size?: number;
}

export default function AdminNavIcon({ icon, size = 20 }: AdminNavIconProps) {
  const s = { width: size, height: size };

  switch (icon) {
    case 'dashboard':
      return (
        <svg {...s} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="2" width="7" height="8" rx="1" />
          <rect x="11" y="2" width="7" height="5" rx="1" />
          <rect x="2" y="12" width="7" height="6" rx="1" />
          <rect x="11" y="9" width="7" height="9" rx="1" />
        </svg>
      );
    case 'students':
      return (
        <svg {...s} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="7" cy="6" r="3" />
          <path d="M2 16c0-3 2.5-5 5-5s5 2 5 5" />
          <circle cx="14" cy="7" r="2" />
          <path d="M14 11c2 0 4 1.5 4 4" />
        </svg>
      );
    case 'teachers':
      return (
        <svg {...s} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="10" cy="5" r="3" />
          <path d="M4 17c0-3.5 2.7-6 6-6s6 2.5 6 6" />
          <path d="M10 11v3M8 13h4" />
        </svg>
      );
    case 'classes':
      return (
        <svg {...s} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="3" width="16" height="12" rx="1" />
          <path d="M2 7h16M7 7v8M13 7v8" />
        </svg>
      );
    case 'fees':
      return (
        <svg {...s} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="4" width="16" height="12" rx="2" />
          <path d="M2 8h16" />
          <path d="M6 12h3M13 12h1" />
        </svg>
      );
    case 'attendance':
      return (
        <svg {...s} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="14" height="14" rx="1" />
          <path d="M3 7h14M7 3v4M13 3v4" />
          <path d="M7 11l2 2 4-4" />
        </svg>
      );
    case 'exams':
      return (
        <svg {...s} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 2h12v16H4z" />
          <path d="M7 6h6M7 9h6M7 12h4" />
          <path d="M13 14l2-2-2-2" />
        </svg>
      );
    case 'notices':
      return (
        <svg {...s} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10 2a6 6 0 016 6c0 3.5 1 5.5 2 7H2c1-1.5 2-3.5 2-7a6 6 0 016-6z" />
          <path d="M8 15a2 2 0 004 0" />
        </svg>
      );
    case 'staff':
      return (
        <svg {...s} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="6" cy="5" r="2.5" />
          <circle cx="14" cy="5" r="2.5" />
          <path d="M1 15c0-3 2-4.5 5-4.5s5 1.5 5 4.5" />
          <path d="M10 15c0-3 2-4.5 5-4.5s4 1.5 4 4.5" />
        </svg>
      );
    case 'reports':
      return (
        <svg {...s} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 17V7l4-4h8v14H4z" />
          <path d="M8 3v4H4" />
          <path d="M7 10h6M7 13h4" />
        </svg>
      );
    case 'documents':
      return (
        <svg {...s} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 3h5l2 2h7v12H3V3z" />
          <path d="M7 9h6M7 12h4" />
        </svg>
      );
    case 'roles':
      return (
        <svg {...s} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="14" height="14" rx="2" />
          <path d="M7 7h2v2H7zM11 7h2v2h-2zM7 11h2v2H7zM11 11h2v2h-2z" />
        </svg>
      );
    case 'inventory':
      return (
        <svg {...s} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 4l8-2 8 2v3H2V4z" />
          <path d="M2 7v9a1 1 0 001 1h14a1 1 0 001-1V7" />
          <path d="M8 10h4" />
        </svg>
      );
    case 'messages':
      return (
        <svg {...s} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 4h14a1 1 0 011 1v8a1 1 0 01-1 1H6l-3 3V5a1 1 0 011-1z" />
          <path d="M7 8h6M7 11h3" />
        </svg>
      );
    case 'ai-insights':
      return (
        <svg {...s} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10 2l2 4 4.5.7-3.2 3.2.8 4.5L10 12.2 5.9 14.4l.8-4.5L3.5 6.7 8 6z" />
          <path d="M3 17h14" />
        </svg>
      );
    case 'settings':
      return (
        <svg {...s} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="10" cy="10" r="3" />
          <path d="M10 1v3M10 16v3M1 10h3M16 10h3M3.5 3.5l2 2M14.5 14.5l2 2M3.5 16.5l2-2M14.5 5.5l2-2" />
        </svg>
      );
    default:
      return (
        <svg {...s} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="10" cy="10" r="8" />
        </svg>
      );
  }
}
