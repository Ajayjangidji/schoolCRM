'use client';

interface TeacherNavIconProps {
  name: string;
  className?: string;
}

export default function TeacherNavIcon({ name, className }: TeacherNavIconProps) {
  const icons: Record<string, JSX.Element> = {
    dashboard: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="7" height="8" rx="1.5" />
        <rect x="11" y="2" width="7" height="5" rx="1.5" />
        <rect x="2" y="12" width="7" height="5" rx="1.5" />
        <rect x="11" y="9" width="7" height="8" rx="1.5" />
      </svg>
    ),
    classes: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="16" height="14" rx="2" />
        <path d="M2 7h16" />
        <path d="M6 3v4M10 3v4M14 3v4" />
        <path d="M5 11h2M9 11h2M13 11h2" />
      </svg>
    ),
    attendance: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 10l2.5 2.5L14 7" />
        <rect x="2" y="3" width="16" height="14" rx="2" />
      </svg>
    ),
    homework: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h12v14H4z" />
        <path d="M7 8h6M7 11h6M7 14h3" />
        <path d="M4 4l2-2h8l2 2" />
      </svg>
    ),
    exams: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 2L2 6l8 4 8-4-8-4z" />
        <path d="M2 6v6l8 4 8-4V6" />
        <path d="M2 10l8 4 8-4" />
      </svg>
    ),
    students: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="7" cy="6" r="3" />
        <path d="M2 16c0-3 2.5-5 5-5s5 2 5 5" />
        <circle cx="14" cy="7" r="2" />
        <path d="M14 11c2 0 4 1.5 4 4" />
      </svg>
    ),
    timetable: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="10" cy="10" r="8" />
        <path d="M10 5v5l3 3" />
      </svg>
    ),
    leave: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="14" height="14" rx="2" />
        <path d="M3 7h14" />
        <path d="M7 2v2M13 2v2" />
        <path d="M7 11h2v2H7z" fill="currentColor" />
      </svg>
    ),
    chat: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 4h14a1 1 0 011 1v8a1 1 0 01-1 1h-4l-3 3-3-3H3a1 1 0 01-1-1V5a1 1 0 011-1z" />
        <path d="M7 8h6M7 11h3" />
      </svg>
    ),
    notices: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 2a6 6 0 016 6c0 3.5 1 5.5 2 7H2c1-1.5 2-3.5 2-7a6 6 0 016-6z" />
        <path d="M8 15a2 2 0 004 0" />
      </svg>
    ),
    planner: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="2" width="14" height="16" rx="2" />
        <path d="M7 6h6M7 10h6M7 14h3" />
        <path d="M14 10l2 2-2 2" />
      </svg>
    ),
  };

  return (
    <span className={className}>
      {icons[name] || icons.dashboard}
    </span>
  );
}
