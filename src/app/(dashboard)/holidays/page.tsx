'use client';

import { useMemo, useState } from 'react';
import { getHolidays, getToday } from '@/hooks/use-data';
import { buildHolidayListHtml, openPrintable } from '@/lib/print';
import { formatDate } from '@/lib/utils';
import { useToast } from '@/components/common/Toast';
import type { Holiday } from '@/types';
import styles from './holidays.module.css';

type TypeFilter = 'all' | Holiday['type'];
type View = 'calendar' | 'list';

const TYPE_LABELS: Record<Holiday['type'], string> = {
  national: 'National',
  festival: 'Festival',
  school: 'School',
  vacation: 'Vacation',
};
const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function pad(n: number): string {
  return String(n).padStart(2, '0');
}

function dayDiff(from: string, to: string): number {
  return Math.round((new Date(`${to}T00:00:00`).getTime() - new Date(`${from}T00:00:00`).getTime()) / 86400000);
}

function lastDate(h: Holiday): string {
  return h.endDate ?? h.date;
}

export default function HolidaysPage() {
  const holidays = getHolidays();
  const today = getToday();
  const { showToast, toastNode } = useToast();
  const [view, setView] = useState<View>('calendar');
  const [filter, setFilter] = useState<TypeFilter>('all');
  const [cursor, setCursor] = useState(() => ({ year: Number(today.slice(0, 4)), month: Number(today.slice(5, 7)) - 1 }));

  const sorted = useMemo(() => [...holidays].sort((a, b) => a.date.localeCompare(b.date)), [holidays]);
  const visible = sorted.filter((h) => filter === 'all' || h.type === filter);
  const next = sorted.find((h) => lastDate(h) >= today);
  const daysOff = sorted.reduce((sum, h) => sum + dayDiff(h.date, lastDate(h)) + 1, 0);
  const upcomingCount = sorted.filter((h) => lastDate(h) >= today).length;

  const monthStart = new Date(cursor.year, cursor.month, 1);
  const daysInMonth = new Date(cursor.year, cursor.month + 1, 0).getDate();
  const monthLabel = monthStart.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
  const cells: Array<number | null> = [
    ...Array.from({ length: monthStart.getDay() }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  function holidayOn(iso: string): Holiday | undefined {
    return visible.find((h) => iso >= h.date && iso <= lastDate(h));
  }

  function shiftMonth(delta: number) {
    setCursor((c) => {
      const d = new Date(c.year, c.month + delta, 1);
      return { year: d.getFullYear(), month: d.getMonth() };
    });
  }

  function download() {
    const ok = openPrintable('Holiday Calendar 2026-27', buildHolidayListHtml(sorted));
    if (ok) showToast('Choose "Save as PDF" in the print dialog to download');
    else showToast('Pop-up blocked. Please allow pop-ups to download.', 'error');
  }

  const monthHolidays = visible.filter((h) => {
    const prefix = `${cursor.year}-${pad(cursor.month + 1)}`;
    return h.date.slice(0, 7) <= prefix && lastDate(h).slice(0, 7) >= prefix;
  });

  return (
    <div className={styles.page}>
      <div className={styles.topGrid}>
        <div className={styles.nextCard}>
          <div className={styles.nextLabel}>Next holiday</div>
          {next ? (
            <>
              <div className={styles.nextName}>{next.name}</div>
              <div className={styles.nextDate}>
                {next.endDate ? `${formatDate(next.date)} - ${formatDate(next.endDate)}` : formatDate(next.date)}
              </div>
              <div className={styles.nextCount}>
                {today >= next.date ? 'Ongoing now' : `In ${dayDiff(today, next.date)} day${dayDiff(today, next.date) === 1 ? '' : 's'}`}
              </div>
            </>
          ) : (
            <div className={styles.nextName}>No more holidays this year</div>
          )}
        </div>
        <div className={styles.statCard}><div className={styles.statValue}>{sorted.length}</div><div className={styles.statLabel}>Holidays &amp; breaks</div></div>
        <div className={styles.statCard}><div className={styles.statValue}>{daysOff}</div><div className={styles.statLabel}>Total days off</div></div>
        <div className={styles.statCard}><div className={styles.statValue}>{upcomingCount}</div><div className={styles.statLabel}>Still to come</div></div>
      </div>

      <div className={styles.toolbar}>
        <div className={styles.filters}>
          {(['all', 'national', 'festival', 'school', 'vacation'] as TypeFilter[]).map((f) => (
            <button key={f} className={`${styles.filterBtn} ${filter === f ? styles.filterActive : ''}`} onClick={() => setFilter(f)}>
              {f === 'all' ? 'All' : TYPE_LABELS[f]}
            </button>
          ))}
        </div>
        <div className={styles.toolbarRight}>
          <div className={styles.viewToggle}>
            <button className={`${styles.viewBtn} ${view === 'calendar' ? styles.viewActive : ''}`} onClick={() => setView('calendar')}>Calendar</button>
            <button className={`${styles.viewBtn} ${view === 'list' ? styles.viewActive : ''}`} onClick={() => setView('list')}>List</button>
          </div>
          <button className={styles.downloadBtn} onClick={download}>Download PDF</button>
        </div>
      </div>

      {view === 'calendar' && (
        <div className={styles.calLayout}>
          <div className={styles.card}>
            <div className={styles.calHeader}>
              <button className={styles.navBtn} onClick={() => shiftMonth(-1)} aria-label="Previous month">&lsaquo;</button>
              <span className={styles.calTitle}>{monthLabel}</span>
              <button className={styles.navBtn} onClick={() => shiftMonth(1)} aria-label="Next month">&rsaquo;</button>
            </div>
            <div className={styles.calGrid}>
              {WEEKDAYS.map((d) => <div key={d} className={styles.weekday}>{d}</div>)}
              {cells.map((day, i) => {
                if (day === null) return <div key={`e${i}`} className={styles.emptyCell} />;
                const iso = `${cursor.year}-${pad(cursor.month + 1)}-${pad(day)}`;
                const h = holidayOn(iso);
                const isSunday = new Date(cursor.year, cursor.month, day).getDay() === 0;
                return (
                  <div
                    key={iso}
                    title={h?.name}
                    className={`${styles.dayCell} ${h ? styles[`day_${h.type}`] : ''} ${isSunday && !h ? styles.daySunday : ''} ${iso === today ? styles.dayToday : ''}`}
                  >
                    <span className={styles.dayNum}>{day}</span>
                    {h && <span className={styles.dayName}>{h.name}</span>}
                  </div>
                );
              })}
            </div>
            <div className={styles.legend}>
              {(Object.keys(TYPE_LABELS) as Array<Holiday['type']>).map((t) => (
                <span key={t} className={styles.legendItem}><span className={`${styles.legendDot} ${styles[`day_${t}`]}`} />{TYPE_LABELS[t]}</span>
              ))}
              <span className={styles.legendItem}><span className={`${styles.legendDot} ${styles.daySunday}`} />Sunday</span>
            </div>
          </div>

          <div className={styles.card}>
            <div className={styles.sideHeader}>{monthLabel} holidays</div>
            {monthHolidays.length === 0 ? (
              <div className={styles.empty}>No holidays this month.</div>
            ) : (
              monthHolidays.map((h) => <HolidayRow key={h.id} holiday={h} today={today} />)
            )}
          </div>
        </div>
      )}

      {view === 'list' && (
        <div className={styles.card}>
          {visible.length === 0 ? <div className={styles.empty}>No holidays match this filter.</div> : visible.map((h) => <HolidayRow key={h.id} holiday={h} today={today} showYear />)}
        </div>
      )}
      {toastNode}
    </div>
  );
}

function HolidayRow({ holiday: h, today, showYear }: { holiday: Holiday; today: string; showYear?: boolean }) {
  const past = lastDate(h) < today;
  const start = new Date(`${h.date}T00:00:00`);
  return (
    <div className={`${styles.row} ${past ? styles.rowPast : ''}`}>
      <div className={`${styles.rowDate} ${styles[`day_${h.type}`]}`}>
        <strong>{start.getDate()}</strong>
        <span>{start.toLocaleDateString('en-IN', { month: 'short', ...(showYear ? { year: '2-digit' } : {}) })}</span>
      </div>
      <div className={styles.rowBody}>
        <div className={styles.rowName}>{h.name}<span className={styles.typeTag}>{TYPE_LABELS[h.type]}</span></div>
        <div className={styles.rowMeta}>
          {h.endDate ? `${formatDate(h.date)} - ${formatDate(h.endDate)} (${dayDiff(h.date, h.endDate) + 1} days)` : start.toLocaleDateString('en-IN', { weekday: 'long' })}
        </div>
        {h.description && <div className={styles.rowDesc}>{h.description}</div>}
      </div>
    </div>
  );
}
