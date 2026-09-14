'use client';

import { useState } from 'react';
import { getAIInsights } from '@/hooks/use-admin-data';
import { formatDate } from '@/lib/utils';
import styles from './ai-insights.module.css';

type FilterType = 'all' | 'performance' | 'attendance' | 'fee' | 'risk' | 'recommendation' | 'prediction';

const CAT_STYLES: Record<string, { cls: string; label: string }> = {
  performance: { cls: styles.catPerformance, label: 'Performance' },
  attendance: { cls: styles.catAttendance, label: 'Attendance' },
  fee: { cls: styles.catFee, label: 'Fee' },
  risk: { cls: styles.catRisk, label: 'Risk' },
  recommendation: { cls: styles.catRecommendation, label: 'Recommendation' },
  prediction: { cls: styles.catPrediction, label: 'Prediction' },
};

const SEV_CARD: Record<string, string> = { info: styles.severityInfo, warning: styles.severityWarning, critical: styles.severityCritical, success: styles.severitySuccess };
const SEV_BADGE: Record<string, { cls: string; label: string }> = {
  info: { cls: styles.badgeSevInfo, label: 'Info' },
  warning: { cls: styles.badgeSevWarning, label: 'Warning' },
  critical: { cls: styles.badgeSevCritical, label: 'Critical' },
  success: { cls: styles.badgeSevSuccess, label: 'Positive' },
};
const SEV_ICON_BG: Record<string, { bg: string; color: string }> = {
  info: { bg: '#e3f2fd', color: '#1565c0' },
  warning: { bg: '#fff3e0', color: '#e65100' },
  critical: { bg: '#ffebee', color: '#c62828' },
  success: { bg: '#e8f5e9', color: '#2e7d32' },
};

export default function AdminAIInsightsPage() {
  const insights = getAIInsights();
  const [filter, setFilter] = useState<FilterType>('all');

  const criticalCount = insights.filter((i) => i.severity === 'critical').length;
  const warningCount = insights.filter((i) => i.severity === 'warning').length;
  const actionableCount = insights.filter((i) => i.actionable).length;

  const filtered = filter === 'all' ? insights : insights.filter((i) => i.category === filter);

  function getTrendIcon(trend?: string) {
    if (trend === 'up') return { symbol: '↑', cls: styles.trendUp };
    if (trend === 'down') return { symbol: '↓', cls: styles.trendDown };
    return { symbol: '→', cls: styles.trendStable };
  }

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div className={styles.headerLeft}>
          <h1 className={styles.pageTitle}>AI Insights</h1>
          <span className={styles.aiBadge}>
            <svg width="12" height="12" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M10 2l2 4 4.5.7-3.2 3.2.8 4.5L10 12.2 5.9 14.4l.8-4.5L3.5 6.7 8 6z" /></svg>
            AI Powered
          </span>
        </div>
        <button className={styles.refreshBtn} onClick={() => alert('Insights refreshed!')}>
          <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17 10a7 7 0 01-14 0 7 7 0 0114 0z" /><path d="M17 3v4h-4" /></svg>
          Refresh Insights
        </button>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: '#ede9fe', color: '#7c3aed' }}>
            <svg width="22" height="22" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M10 2l2 4 4.5.7-3.2 3.2.8 4.5L10 12.2 5.9 14.4l.8-4.5L3.5 6.7 8 6z" /></svg>
          </div>
          <div className={styles.statContent}>
            <div className={styles.statLabel}>Total Insights</div>
            <div className={styles.statValue}>{insights.length}</div>
            <div className={styles.statSub}>AI-generated</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: '#ffebee', color: '#c62828' }}>
            <svg width="22" height="22" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M10 2v6M10 14h.01" /><circle cx="10" cy="10" r="8" /></svg>
          </div>
          <div className={styles.statContent}>
            <div className={styles.statLabel}>Critical</div>
            <div className={styles.statValue}>{criticalCount}</div>
            <div className={styles.statSub}>Needs immediate action</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: '#fff3e0', color: '#e65100' }}>
            <svg width="22" height="22" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M10 3l7 12H3L10 3z" /><path d="M10 8v3M10 14h.01" /></svg>
          </div>
          <div className={styles.statContent}>
            <div className={styles.statLabel}>Warnings</div>
            <div className={styles.statValue}>{warningCount}</div>
            <div className={styles.statSub}>Attention needed</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: '#e8f5e9', color: '#2e7d32' }}>
            <svg width="22" height="22" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 10l2.5 2.5L14 7" /><circle cx="10" cy="10" r="8" /></svg>
          </div>
          <div className={styles.statContent}>
            <div className={styles.statLabel}>Actionable</div>
            <div className={styles.statValue}>{actionableCount}</div>
            <div className={styles.statSub}>With suggested actions</div>
          </div>
        </div>
      </div>

      <div className={styles.filtersBar}>
        <div className={styles.filterTabs}>
          {(['all', 'risk', 'performance', 'attendance', 'fee', 'recommendation', 'prediction'] as FilterType[]).map((f) => (
            <button key={f} className={`${styles.filterTab} ${filter === f ? styles.filterTabActive : ''}`} onClick={() => setFilter(f)}>
              {f === 'all' ? `All (${insights.length})` : CAT_STYLES[f]?.label || f}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.insightList}>
        {filtered.length === 0 && <div className={styles.emptyState}>No insights found.</div>}
        {filtered.map((insight) => {
          const cat = CAT_STYLES[insight.category];
          const sev = SEV_BADGE[insight.severity];
          const iconBg = SEV_ICON_BG[insight.severity] || SEV_ICON_BG.info;
          const trend = getTrendIcon(insight.trend);
          return (
            <div key={insight.id} className={`${styles.insightCard} ${SEV_CARD[insight.severity] || ''}`}>
              <div className={styles.insightHeader}>
                <div className={styles.insightLeft}>
                  <div className={styles.insightIcon} style={{ background: iconBg.bg, color: iconBg.color }}>
                    <svg width="22" height="22" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M10 2l2 4 4.5.7-3.2 3.2.8 4.5L10 12.2 5.9 14.4l.8-4.5L3.5 6.7 8 6z" /></svg>
                  </div>
                  <div className={styles.insightInfo}>
                    <div className={styles.insightTitle}>{insight.title}</div>
                    <div className={styles.insightMeta}>
                      <span className={styles.metaItem}>
                        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="4" width="14" height="12" rx="1" /><path d="M7 2v4M13 2v4M3 8h14" /></svg>
                        {formatDate(insight.generatedAt)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className={styles.badgeRow}>
                  <span className={`${styles.categoryBadge} ${cat?.cls || ''}`}>{cat?.label || insight.category}</span>
                  <span className={`${styles.severityBadge} ${sev?.cls || ''}`}>{sev?.label || insight.severity}</span>
                </div>
              </div>

              <div className={styles.insightBody}>
                <div className={styles.insightDesc}>{insight.description}</div>

                {(insight.metric || insight.affectedCount) && (
                  <div className={styles.metricRow}>
                    {insight.metric && (
                      <div className={styles.metricBox}>
                        <span className={styles.metricLabel}>{insight.metric}:</span>
                        <span className={styles.metricVal}>{insight.metricValue}</span>
                        {insight.trend && <span className={trend.cls}>{trend.symbol}</span>}
                      </div>
                    )}
                    {insight.affectedCount !== undefined && insight.affectedCount > 0 && (
                      <div className={styles.affectedBox}>
                        {insight.affectedCount} affected
                      </div>
                    )}
                  </div>
                )}

                {insight.actionable && insight.suggestedAction && (
                  <div className={styles.actionBox}>
                    <div className={styles.actionLabel}>Suggested Action</div>
                    <div className={styles.actionText}>{insight.suggestedAction}</div>
                  </div>
                )}
              </div>

              <div className={styles.insightFooter}>
                <div className={styles.footerLeft}>
                  <span className={styles.footerItem}>
                    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M10 2l2 4 4.5.7-3.2 3.2.8 4.5L10 12.2 5.9 14.4l.8-4.5L3.5 6.7 8 6z" /></svg>
                    AI Generated
                  </span>
                </div>
                <div className={styles.actionBtns}>
                  {insight.actionable && <button className={`${styles.actionBtn} ${styles.takeActionBtn}`} onClick={() => alert('Action initiated!')}>Take Action</button>}
                  <button className={styles.actionBtn} onClick={() => alert('Insight dismissed.')}>Dismiss</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
