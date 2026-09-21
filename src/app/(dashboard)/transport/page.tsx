'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import {
  getTransportInfo,
  getBusStops,
  subscribeBusLocation,
  getEmergencyAlerts,
  getStudent,
  getCurrentHour,
  getTransportOpted,
} from '@/hooks/use-data';
import { useToast } from '@/components/common/Toast';
import type { BusLiveState, BusStop, BusTripKey } from '@/types';
import styles from './transport.module.css';

interface TripAlert {
  id: string;
  message: string;
  time: string;
  tone: 'info' | 'success';
}

const MINUTES_PER_STOP = 4;
const TRIP_LABELS: Record<BusTripKey, string> = { morning: 'Morning pickup', afternoon: 'Afternoon drop' };

function clockLabel(): string {
  return new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
}

function interpolate(stops: BusStop[], progress: number): { x: number; y: number } {
  const index = Math.min(Math.floor(progress), stops.length - 1);
  const next = stops[Math.min(index + 1, stops.length - 1)];
  const current = stops[index];
  const t = progress - index;
  return { x: current.x + (next.x - current.x) * t, y: current.y + (next.y - current.y) * t };
}

export default function TransportPage() {
  if (!getTransportOpted()) {
    return (
      <div className={styles.page}>
        <div className={styles.card}>
          <div className={styles.cardBody}>
            <div className={styles.alertEmpty}>
              Your child has not opted for the school transport service. To enrol, please contact the school transport office or submit a request from the front desk.
            </div>
          </div>
        </div>
      </div>
    );
  }
  return <TransportTracker />;
}

function TransportTracker() {
  const info = getTransportInfo();
  const student = getStudent();
  const routeStops = getBusStops();
  const delayAlert = getEmergencyAlerts().find((a) => a.isActive && a.type === 'transport');
  const { showToast, toastNode } = useToast();

  const [trip, setTrip] = useState<BusTripKey>(() => (getCurrentHour() < 12 ? 'morning' : 'afternoon'));
  const [feed, setFeed] = useState<{ trip: BusTripKey; state: BusLiveState } | null>(null);
  const [alerts, setAlerts] = useState<TripAlert[]>([]);
  const [alertDistance, setAlertDistance] = useState(2);
  const fired = useRef<Set<string>>(new Set());

  const stops = useMemo(() => (trip === 'morning' ? routeStops : [...routeStops].reverse()), [trip, routeStops]);
  const childIndex = stops.findIndex((s) => s.isChildStop);
  const childStop = stops[childIndex];
  const live = feed && feed.trip === trip ? feed.state : null;
  const progress = live?.progress ?? 0;
  const lastIndex = stops.length - 1;
  const tripDone = progress >= lastIndex;
  const remainingToChild = childIndex - progress;
  const etaMinutes = remainingToChild > 0 ? Math.max(1, Math.round(remainingToChild * MINUTES_PER_STOP)) : 0;
  const busPosition = interpolate(stops, progress);
  const stopTime = (s: BusStop) => (trip === 'morning' ? s.pickupTime : s.dropTime);

  useEffect(() => {
    fired.current = new Set();
    setAlerts([]);
    return subscribeBusLocation(trip, stops.length, (state) => setFeed({ trip, state }));
  }, [trip, stops.length]);

  useEffect(() => {
    if (!live) return;
    const name = student.name.split(' ')[0];
    const pending: Array<{ key: string; message: string; tone: TripAlert['tone'] }> = [];

    pending.push({ key: 'start', message: `Live tracking started for ${info.busNumber}.`, tone: 'info' });

    const stopsAway = Math.ceil(childIndex - live.progress);
    if (live.progress < childIndex - 0.05 && stopsAway <= alertDistance) {
      pending.push({
        key: `near-${stopsAway}`,
        message: `Bus is ${stopsAway} ${stopsAway === 1 ? 'stop' : 'stops'} away from ${childStop.name} (about ${Math.max(1, Math.round((childIndex - live.progress) * MINUTES_PER_STOP))} min).`,
        tone: 'info',
      });
    }
    if (live.progress >= childIndex - 0.02) {
      pending.push({
        key: 'at-stop',
        message: trip === 'morning' ? `Bus has reached ${childStop.name}. Please send ${name} to the bus now.` : `Bus has reached ${childStop.name}. ${name} is being dropped off.`,
        tone: 'success',
      });
    }
    if (live.progress >= childIndex + 0.15) {
      pending.push({
        key: 'boarded',
        message: trip === 'morning' ? `${name} boarded the bus at ${childStop.name}.` : `${name} got off the bus at ${childStop.name}.`,
        tone: 'success',
      });
    }
    if (live.progress >= lastIndex) {
      pending.push({
        key: 'end',
        message: trip === 'morning' ? `Bus reached the school gate. ${name} has arrived safely.` : 'Bus has completed the afternoon route.',
        tone: 'success',
      });
    }

    const fresh = pending.filter((p) => !fired.current.has(p.key));
    if (fresh.length === 0) return;
    fresh.forEach((p) => fired.current.add(p.key));
    setAlerts((prev) => [...fresh.map((p) => ({ id: `${p.key}-${Date.now()}`, message: p.message, time: clockLabel(), tone: p.tone })).reverse(), ...prev]);
    const latest = fresh[fresh.length - 1];
    if (latest.key !== 'start') showToast(latest.message, 'info');
  }, [live, trip, childIndex, childStop, lastIndex, alertDistance, student.name, info.busNumber, showToast]);

  const travelledPoints = [
    ...stops.slice(0, Math.floor(progress) + 1).map((s) => `${s.x},${s.y}`),
    ...(progress < lastIndex ? [`${busPosition.x},${busPosition.y}`] : []),
  ].join(' ');
  const routePoints = stops.map((s) => `${s.x},${s.y}`).join(' ');

  const statusLabel = !live
    ? 'Connecting...'
    : tripDone
      ? 'Trip completed'
      : live.status === 'stopped'
        ? 'Stopped at stop'
        : 'On the move';
  const nextStopIndex = stops.findIndex((_, i) => i > progress + 0.01);

  return (
    <div className={styles.page}>
      {delayAlert && (
        <div className={styles.delayBanner} role="alert">
          <div>
            <div className={styles.delayTitle}>{delayAlert.title}</div>
            <div className={styles.delayText}>{delayAlert.actionRequired ?? delayAlert.message}</div>
          </div>
          <Link href="/emergency" className={styles.delayLink}>View alert</Link>
        </div>
      )}

      <div className={styles.tripTabs} role="tablist" aria-label="Trip">
        {(Object.keys(TRIP_LABELS) as BusTripKey[]).map((key) => (
          <button
            key={key}
            role="tab"
            aria-selected={trip === key}
            className={`${styles.tripTab} ${trip === key ? styles.tripTabActive : ''}`}
            onClick={() => setTrip(key)}
          >
            {TRIP_LABELS[key]}
            <span className={styles.tripTime}>{key === 'morning' ? info.pickupTime : info.dropTime}</span>
          </button>
        ))}
      </div>

      <div className={styles.timingGrid}>
        <div className={styles.timingTile}>
          <div className={styles.timingLabel}>Estimated pickup</div>
          <div className={styles.timingValue}>{info.pickupTime}</div>
          <div className={styles.timingSub}>{info.pickupStop}</div>
        </div>
        <div className={styles.timingTile}>
          <div className={styles.timingLabel}>Reaches school</div>
          <div className={styles.timingValue}>{routeStops.find((s) => s.isSchool)?.pickupTime ?? '-'}</div>
          <div className={styles.timingSub}>Main Gate</div>
        </div>
        <div className={styles.timingTile}>
          <div className={styles.timingLabel}>Estimated drop</div>
          <div className={styles.timingValue}>{info.dropTime}</div>
          <div className={styles.timingSub}>{info.dropStop}</div>
        </div>
        <div className={styles.timingNote}>Timings are estimates and may vary by 5-10 minutes with traffic or weather. Use live tracking below for the current position.</div>
      </div>

      <div className={styles.mainGrid}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <span className={styles.cardTitle}>Live Location</span>
            <span className={`${styles.liveBadge} ${live && live.status === 'moving' && !tripDone ? styles.liveMoving : styles.liveStopped}`}>
              <span className={styles.liveDot} />
              {statusLabel}
            </span>
          </div>
          <div className={styles.cardBody}>
            <svg viewBox="0 0 100 60" className={styles.map} role="img" aria-label="Bus route map with live bus position">
              <rect x="0" y="0" width="100" height="60" fill="var(--gray-50)" />
              {[10, 20, 30, 40, 50].map((y) => <line key={`h${y}`} x1="0" x2="100" y1={y} y2={y} stroke="var(--gray-100)" strokeWidth="0.3" />)}
              {[10, 20, 30, 40, 50, 60, 70, 80, 90].map((x) => <line key={`v${x}`} x1={x} x2={x} y1="0" y2="60" stroke="var(--gray-100)" strokeWidth="0.3" />)}
              <polyline points={routePoints} fill="none" stroke="var(--gray-300)" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
              <polyline points={travelledPoints} fill="none" stroke="var(--primary)" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
              {stops.map((s, i) => (
                <g key={s.id}>
                  <circle cx={s.x} cy={s.y} r={s.isChildStop ? 3 : 2.2} fill={s.isSchool ? 'var(--success)' : s.isChildStop ? 'var(--danger)' : 'var(--white)'} stroke={i <= progress + 0.01 ? 'var(--primary)' : 'var(--gray-400)'} strokeWidth="0.8">
                    <title>{`${s.name} - ${stopTime(s)}`}</title>
                  </circle>
                  <text x={s.x} y={s.y + 0.7} textAnchor="middle" fontSize="2" fontWeight="700" fill={s.isSchool || s.isChildStop ? 'var(--white)' : 'var(--text-secondary)'}>{i + 1}</text>
                  {(s.isChildStop || s.isSchool) && (
                    <text x={s.x} y={s.y - 4.4} textAnchor="middle" fontSize="2.2" fontWeight="700" fill="var(--text-primary)">
                      {s.isSchool ? 'School' : `${student.name.split(' ')[0]}'s stop`}
                    </text>
                  )}
                </g>
              ))}
              <g transform={`translate(${busPosition.x} ${busPosition.y})`}>
                <circle r="4.2" fill="var(--warning)" opacity="0.25" className={live && live.status === 'moving' ? styles.pulse : undefined} />
                <rect x="-3" y="-1.9" width="6" height="3.8" rx="0.9" fill="var(--warning)" stroke="var(--white)" strokeWidth="0.4" />
                <rect x="-2.2" y="-1.2" width="1.6" height="1.2" rx="0.2" fill="var(--white)" />
                <rect x="-0.2" y="-1.2" width="1.6" height="1.2" rx="0.2" fill="var(--white)" />
                <rect x="1.7" y="-1.2" width="0.9" height="1.2" rx="0.2" fill="var(--white)" />
                <circle cx="-1.7" cy="1.9" r="0.7" fill="var(--gray-800)" />
                <circle cx="1.7" cy="1.9" r="0.7" fill="var(--gray-800)" />
              </g>
            </svg>

            <div className={styles.liveStats}>
              <div className={styles.liveStat}>
                <div className={styles.liveStatValue}>{tripDone ? 'Done' : etaMinutes > 0 ? `${etaMinutes} min` : 'Passed'}</div>
                <div className={styles.liveStatLabel}>ETA to {childStop?.name}</div>
              </div>
              <div className={styles.liveStat}>
                <div className={styles.liveStatValue}>{live ? `${live.speedKmph} km/h` : '—'}</div>
                <div className={styles.liveStatLabel}>Speed</div>
              </div>
              <div className={styles.liveStat}>
                <div className={styles.liveStatValue}>{tripDone ? '—' : stops[nextStopIndex]?.name ?? '—'}</div>
                <div className={styles.liveStatLabel}>Next stop</div>
              </div>
              <div className={styles.liveStat}>
                <div className={styles.liveStatValue}>{live?.lastUpdated ?? '—'}</div>
                <div className={styles.liveStatLabel}>Last updated</div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.sideColumn}>
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <span className={styles.cardTitle}>Driver, Vehicle &amp; Route</span>
            </div>
            <div className={styles.cardBody}>
              <div className={styles.infoRow}><span>Bus</span><strong>{info.busNumber}</strong></div>
              <div className={styles.infoRow}><span>Vehicle No.</span><strong>{info.vehicleNumber}</strong></div>
              <div className={styles.infoRow}><span>Vehicle</span><strong>{info.vehicleModel}</strong></div>
              <div className={styles.infoRow}><span>Capacity</span><strong>{info.vehicleCapacity} seats</strong></div>
              <div className={styles.infoRow}><span>Route</span><strong>{info.routeName}</strong></div>
              <div className={styles.infoRow}><span>Pickup</span><strong>{info.pickupStop} · {info.pickupTime}</strong></div>
              <div className={styles.infoRow}><span>Drop</span><strong>{info.dropStop} · {info.dropTime}</strong></div>
              <div className={styles.contactRow}>
                <div>
                  <div className={styles.contactRole}>Driver</div>
                  <div className={styles.contactName}>{info.driverName}</div>
                  <div className={styles.contactDetail}>{info.driverPhone}</div>
                  <div className={styles.contactDetail}>{info.driverAddress}</div>
                  <div className={styles.contactDetail}>Licence {info.driverLicenseNo} · {info.driverExperienceYears} yrs experience</div>
                </div>
                <a className={styles.callBtn} href={`tel:${info.driverPhone.replace(/\s/g, '')}`}>Call</a>
              </div>
              {info.attendantName && info.attendantPhone && (
                <div className={styles.contactRow}>
                  <div>
                    <div className={styles.contactRole}>Attendant</div>
                    <div className={styles.contactName}>{info.attendantName}</div>
                    <div className={styles.contactDetail}>{info.attendantPhone}</div>
                    {info.attendantAddress && <div className={styles.contactDetail}>{info.attendantAddress}</div>}
                  </div>
                  <a className={styles.callBtn} href={`tel:${info.attendantPhone.replace(/\s/g, '')}`}>Call</a>
                </div>
              )}
            </div>
          </div>

          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <span className={styles.cardTitle}>Route Stops</span>
            </div>
            <div className={styles.cardBody}>
              <ol className={styles.stopList}>
                {stops.map((s, i) => {
                  const reached = i <= progress + 0.01;
                  const isNext = i === nextStopIndex && !tripDone;
                  return (
                    <li key={s.id} className={`${styles.stopItem} ${reached ? styles.stopReached : ''} ${isNext ? styles.stopNext : ''}`}>
                      <span className={styles.stopMarker}>{reached ? '✓' : i + 1}</span>
                      <span className={styles.stopName}>
                        {s.name}
                        {s.isChildStop && <span className={styles.stopTag}>{student.name.split(' ')[0]}</span>}
                      </span>
                      <span className={styles.stopTime}>{stopTime(s)}</span>
                    </li>
                  );
                })}
              </ol>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <span className={styles.cardTitle}>Pickup &amp; Drop Alerts</span>
          <label className={styles.alertSetting}>
            Alert me when the bus is
            <select className={styles.alertSelect} value={alertDistance} onChange={(e) => setAlertDistance(Number(e.target.value))}>
              <option value={1}>1 stop</option>
              <option value={2}>2 stops</option>
              <option value={3}>3 stops</option>
            </select>
            away
          </label>
        </div>
        <div className={styles.cardBody}>
          {alerts.length === 0 ? (
            <div className={styles.alertEmpty}>Waiting for live updates...</div>
          ) : (
            <div className={styles.alertList}>
              {alerts.map((a) => (
                <div key={a.id} className={styles.alertItem}>
                  <span className={`${styles.alertDot} ${a.tone === 'success' ? styles.alertDotSuccess : ''}`} />
                  <div className={styles.alertText}>{a.message}</div>
                  <span className={styles.alertTime}>{a.time}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {toastNode}
    </div>
  );
}
