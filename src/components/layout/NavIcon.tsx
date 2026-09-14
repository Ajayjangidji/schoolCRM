'use client';

import React from 'react';

interface NavIconProps {
  name: string;
  className?: string;
}

export default function NavIcon({ name, className }: NavIconProps) {
  const icons: Record<string, React.ReactNode> = {
    dashboard: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="7" height="8" rx="1.5" />
        <rect x="11" y="2" width="7" height="5" rx="1.5" />
        <rect x="2" y="12" width="7" height="5" rx="1.5" />
        <rect x="11" y="9" width="7" height="8" rx="1.5" />
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
    academic: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 2L2 6l8 4 8-4-8-4z" />
        <path d="M2 6v6l8 4 8-4V6" />
        <path d="M2 10l8 4 8-4" />
      </svg>
    ),
    fees: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 2v16M6 6h5.5a2.5 2.5 0 010 5H6M6 11h6.5a2.5 2.5 0 010 5H6" />
      </svg>
    ),
    notices: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 2a6 6 0 016 6c0 3.5 1 5.5 2 7H2c1-1.5 2-3.5 2-7a6 6 0 016-6z" />
        <path d="M8 15a2 2 0 004 0" />
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
    timetable: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="10" cy="10" r="8" />
        <path d="M10 5v5l3 3" />
      </svg>
    ),
    transport: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 13V5a2 2 0 012-2h8a2 2 0 012 2v8" />
        <path d="M2 13h16v2a1 1 0 01-1 1H3a1 1 0 01-1-1v-2z" />
        <circle cx="6" cy="17" r="1" />
        <circle cx="14" cy="17" r="1" />
        <path d="M4 8h12" />
      </svg>
    ),
    chat: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 4h14a1 1 0 011 1v8a1 1 0 01-1 1h-4l-3 3-3-3H3a1 1 0 01-1-1V5a1 1 0 011-1z" />
        <path d="M7 8h6M7 11h3" />
      </svg>
    ),
    documents: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 2h7l5 5v10a1 1 0 01-1 1H5a1 1 0 01-1-1V3a1 1 0 011-1z" />
        <path d="M12 2v5h5" />
        <path d="M8 10h5M8 13h5" />
      </svg>
    ),
    gallery: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="16" height="14" rx="2" />
        <circle cx="7" cy="8" r="1.5" />
        <path d="M2 14l4-4 3 3 4-5 5 6" />
      </svg>
    ),
    ai: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 2a4 4 0 014 4v2a4 4 0 01-8 0V6a4 4 0 014-4z" />
        <path d="M4 10a6 6 0 0012 0" />
        <path d="M10 16v2" />
        <path d="M6 18h8" />
        <circle cx="8" cy="7" r="0.5" fill="currentColor" />
        <circle cx="12" cy="7" r="0.5" fill="currentColor" />
      </svg>
    ),
    summary: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 3h14a1 1 0 011 1v12a1 1 0 01-1 1H3a1 1 0 01-1-1V4a1 1 0 011-1z" />
        <path d="M2 7h16" />
        <path d="M6 11h3M6 14h5" />
        <circle cx="14" cy="12.5" r="2.5" />
        <path d="M14 10v2.5l1.5 1" />
      </svg>
    ),
    emergency: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 2l8 14H2L10 2z" />
        <path d="M10 7v4" />
        <circle cx="10" cy="14" r="0.5" fill="currentColor" />
      </svg>
    ),
  };

  return (
    <span className={className}>
      {icons[name] || icons.dashboard}
    </span>
  );
}
