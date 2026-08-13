'use client';

import { useState, useMemo } from 'react';
import { getLessonPlans, getTeacherTasks, getTeacherClasses } from '@/hooks/use-teacher-data';
import { formatDate } from '@/lib/utils';
import styles from './planner.module.css';

type ActiveTab = 'lessons' | 'tasks';

const STATUS_STYLES: Record<string, { card: string; badge: string }> = {
  planned: { card: styles.lessonPlanned, badge: styles.statusPlanned },
  'in-progress': { card: styles.lessonInProgress, badge: styles.statusInProgress },
  completed: { card: styles.lessonCompleted, badge: styles.statusCompleted },
  rescheduled: { card: styles.lessonRescheduled, badge: styles.statusRescheduled },
};

const PRIORITY_STYLES: Record<string, string> = {
  high: styles.priorityHigh,
  medium: styles.priorityMedium,
  low: styles.priorityLow,
};

function isOverdue(dateStr: string): boolean {
  return new Date(dateStr) < new Date('2026-08-13');
}

export default function TeacherPlannerPage() {
  const lessons = getLessonPlans();
  const tasks = getTeacherTasks();
  const classes = getTeacherClasses();
  const [activeTab, setActiveTab] = useState<ActiveTab>('lessons');
  const [showLessonModal, setShowLessonModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);

  const upcomingLessons = lessons.filter((l) => l.status === 'planned' || l.status === 'in-progress');
  const completedLessons = lessons.filter((l) => l.status === 'completed');
  const pendingTasks = tasks.filter((t) => t.status !== 'completed');
  const completedTasks = tasks.filter((t) => t.status === 'completed');
  const overdueTasks = tasks.filter((t) => t.status !== 'completed' && isOverdue(t.dueDate));

  return (
    <div className={styles.page}>
      {/* ── Header ── */}
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Task & Lesson Planner</h1>
        <div className={styles.headerActions}>
          <button className={styles.addBtn} onClick={() => setShowLessonModal(true)}>
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M10 4v12M4 10h12" />
            </svg>
            New Lesson Plan
          </button>
          <button className={styles.addBtn} style={{ background: 'var(--success)' }} onClick={() => setShowTaskModal(true)}>
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M10 4v12M4 10h12" />
            </svg>
            New Task
          </button>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: '#e3f2fd', color: '#1565c0' }}>
            <svg width="22" height="22" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="2" width="14" height="16" rx="2" />
              <path d="M7 6h6M7 10h6M7 14h3" />
            </svg>
          </div>
          <div className={styles.statContent}>
            <div className={styles.statLabel}>Lesson Plans</div>
            <div className={styles.statValue}>{lessons.length}</div>
            <div className={styles.statSub}>{upcomingLessons.length} upcoming</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: '#e8f5e9', color: '#2e7d32' }}>
            <svg width="22" height="22" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 10l2.5 2.5L14 7" />
              <circle cx="10" cy="10" r="8" />
            </svg>
          </div>
          <div className={styles.statContent}>
            <div className={styles.statLabel}>Completed</div>
            <div className={styles.statValue}>{completedLessons.length}</div>
            <div className={styles.statSub}>Lessons done</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: '#fff3e0', color: '#e65100' }}>
            <svg width="22" height="22" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 3h10a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z" />
              <path d="M9 7h2v6H9z" fill="currentColor" opacity="0.3" />
              <path d="M7 7h6M7 10h6M7 13h6" />
            </svg>
          </div>
          <div className={styles.statContent}>
            <div className={styles.statLabel}>Pending Tasks</div>
            <div className={styles.statValue}>{pendingTasks.length}</div>
            <div className={styles.statSub}>{overdueTasks.length} overdue</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: overdueTasks.length > 0 ? '#ffebee' : '#e8f5e9', color: overdueTasks.length > 0 ? '#c62828' : '#2e7d32' }}>
            <svg width="22" height="22" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="10" cy="10" r="8" />
              <path d="M10 6v4l2.5 2.5" />
            </svg>
          </div>
          <div className={styles.statContent}>
            <div className={styles.statLabel}>Overdue</div>
            <div className={styles.statValue}>{overdueTasks.length}</div>
            <div className={styles.statSub}>Need attention</div>
          </div>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className={styles.tabRow}>
        <button className={`${styles.tab} ${activeTab === 'lessons' ? styles.tabActive : ''}`} onClick={() => setActiveTab('lessons')}>
          Lesson Plans
          <span className={styles.tabBadge}>{lessons.length}</span>
        </button>
        <button className={`${styles.tab} ${activeTab === 'tasks' ? styles.tabActive : ''}`} onClick={() => setActiveTab('tasks')}>
          Tasks
          <span className={styles.tabBadge}>{tasks.length}</span>
        </button>
      </div>

      {/* ── Content ── */}
      {activeTab === 'lessons' ? (
        <div className={styles.contentGrid}>
          {/* Upcoming */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <div>
                <div className={styles.sectionTitle}>Upcoming & In Progress</div>
                <div className={styles.sectionSub}>{upcomingLessons.length} lessons</div>
              </div>
            </div>
            <div className={styles.lessonList}>
              {upcomingLessons.map((lesson) => {
                const st = STATUS_STYLES[lesson.status] || STATUS_STYLES.planned;
                return (
                  <div key={lesson.id} className={`${styles.lessonCard} ${st.card}`}>
                    <div className={styles.lessonHeader}>
                      <div className={styles.lessonTitle}>{lesson.title}</div>
                      <span className={`${styles.statusBadge} ${st.badge}`}>{lesson.status.replace('-', ' ')}</span>
                    </div>
                    <div className={styles.lessonMeta}>
                      <span className={styles.metaItem}>
                        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="4" width="14" height="12" rx="1" />
                          <path d="M7 2v4M13 2v4M3 8h14" />
                        </svg>
                        {formatDate(lesson.date)}
                      </span>
                      <span className={styles.metaItem}>
                        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="10" cy="10" r="8" />
                          <path d="M10 5v5l3 3" />
                        </svg>
                        Period {lesson.period}
                      </span>
                      <span>Class {lesson.class}-{lesson.section}</span>
                      <span>{lesson.chapter}</span>
                    </div>
                    <div className={styles.topicChips}>
                      {lesson.topics.map((t, i) => (
                        <span key={i} className={styles.topicChip}>{t}</span>
                      ))}
                    </div>
                    <div className={styles.lessonObjective}>{lesson.objectives}</div>
                  </div>
                );
              })}
              {upcomingLessons.length === 0 && <div className={styles.emptyState}>No upcoming lessons.</div>}
            </div>
          </div>

          {/* Completed */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <div>
                <div className={styles.sectionTitle}>Completed</div>
                <div className={styles.sectionSub}>{completedLessons.length} lessons</div>
              </div>
            </div>
            <div className={styles.lessonList}>
              {completedLessons.map((lesson) => (
                <div key={lesson.id} className={`${styles.lessonCard} ${styles.lessonCompleted}`}>
                  <div className={styles.lessonHeader}>
                    <div className={styles.lessonTitle}>{lesson.title}</div>
                    <span className={`${styles.statusBadge} ${styles.statusCompleted}`}>completed</span>
                  </div>
                  <div className={styles.lessonMeta}>
                    <span className={styles.metaItem}>
                      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="4" width="14" height="12" rx="1" />
                        <path d="M7 2v4M13 2v4M3 8h14" />
                      </svg>
                      {formatDate(lesson.date)}
                    </span>
                    <span className={styles.metaItem}>
                      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="10" cy="10" r="8" />
                        <path d="M10 5v5l3 3" />
                      </svg>
                      Period {lesson.period}
                    </span>
                    <span>Class {lesson.class}-{lesson.section}</span>
                    <span>{lesson.chapter}</span>
                  </div>
                  <div className={styles.topicChips}>
                    {lesson.topics.map((t, i) => (
                      <span key={i} className={styles.topicChip}>{t}</span>
                    ))}
                  </div>
                </div>
              ))}
              {completedLessons.length === 0 && <div className={styles.emptyState}>No completed lessons yet.</div>}
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.contentGrid}>
          {/* Pending Tasks */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <div>
                <div className={styles.sectionTitle}>Pending Tasks</div>
                <div className={styles.sectionSub}>{pendingTasks.length} tasks</div>
              </div>
            </div>
            <div className={styles.taskList}>
              {pendingTasks.map((task) => (
                <div key={task.id} className={styles.taskCard}>
                  <div className={styles.taskCheck}>
                    {task.status === 'in-progress' && (
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <circle cx="5" cy="5" r="3" fill="var(--primary)" />
                      </svg>
                    )}
                  </div>
                  <div className={styles.taskContent}>
                    <div className={styles.taskTitle}>{task.title}</div>
                    <div className={styles.taskDesc}>{task.description}</div>
                    <div className={styles.taskFooter}>
                      <span className={`${styles.taskDue} ${isOverdue(task.dueDate) ? styles.taskOverdue : ''}`}>
                        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="4" width="14" height="12" rx="1" />
                          <path d="M7 2v4M13 2v4M3 8h14" />
                        </svg>
                        {formatDate(task.dueDate)}
                        {isOverdue(task.dueDate) && ' (Overdue)'}
                      </span>
                      <span className={`${styles.priorityBadge} ${PRIORITY_STYLES[task.priority]}`}>{task.priority}</span>
                      <span className={styles.categoryBadge}>{task.category}</span>
                    </div>
                  </div>
                </div>
              ))}
              {pendingTasks.length === 0 && <div className={styles.emptyState}>All tasks completed!</div>}
            </div>
          </div>

          {/* Completed Tasks */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <div>
                <div className={styles.sectionTitle}>Completed Tasks</div>
                <div className={styles.sectionSub}>{completedTasks.length} tasks</div>
              </div>
            </div>
            <div className={styles.taskList}>
              {completedTasks.map((task) => (
                <div key={task.id} className={styles.taskCard}>
                  <div className={`${styles.taskCheck} ${styles.taskCheckDone}`}>
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M2 5l2.5 2.5L8 3" />
                    </svg>
                  </div>
                  <div className={styles.taskContent}>
                    <div className={`${styles.taskTitle} ${styles.taskTitleDone}`}>{task.title}</div>
                    <div className={styles.taskDesc}>{task.description}</div>
                    <div className={styles.taskFooter}>
                      <span className={styles.taskDue}>
                        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="4" width="14" height="12" rx="1" />
                          <path d="M7 2v4M13 2v4M3 8h14" />
                        </svg>
                        {formatDate(task.dueDate)}
                      </span>
                      <span className={`${styles.priorityBadge} ${PRIORITY_STYLES[task.priority]}`}>{task.priority}</span>
                      <span className={styles.categoryBadge}>{task.category}</span>
                    </div>
                  </div>
                </div>
              ))}
              {completedTasks.length === 0 && <div className={styles.emptyState}>No completed tasks yet.</div>}
            </div>
          </div>
        </div>
      )}

      {/* ── New Lesson Plan Modal ── */}
      {showLessonModal && (
        <div className={styles.modalOverlay} onClick={() => setShowLessonModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>New Lesson Plan</h2>
              <button className={styles.modalClose} onClick={() => setShowLessonModal(false)}>
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M5 5l10 10M15 5L5 15" />
                </svg>
              </button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Lesson Title</label>
                <input className={styles.formInput} type="text" placeholder="e.g. Introduction to Tenses" />
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Class</label>
                  <select className={styles.formSelect}>
                    <option value="">Select Class</option>
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>Class {c.class}-{c.section}</option>
                    ))}
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Period</label>
                  <select className={styles.formSelect}>
                    <option value="">Select Period</option>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((p) => (
                      <option key={p} value={p}>Period {p}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Date</label>
                  <input className={styles.formInput} type="date" />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Chapter</label>
                  <input className={styles.formInput} type="text" placeholder="e.g. Grammar" />
                </div>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Topics (comma separated)</label>
                <input className={styles.formInput} type="text" placeholder="e.g. Present Tense, Past Tense" />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Learning Objectives</label>
                <textarea className={styles.formTextarea} placeholder="What students should learn from this lesson" rows={2} />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Teaching Methodology</label>
                <textarea className={styles.formTextarea} placeholder="How you plan to teach this lesson" rows={2} />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Materials Required</label>
                <input className={styles.formInput} type="text" placeholder="e.g. Whiteboard, worksheets, textbook" />
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button className={styles.cancelBtn} onClick={() => setShowLessonModal(false)}>Cancel</button>
              <button className={styles.submitBtn} onClick={() => setShowLessonModal(false)}>Create Lesson Plan</button>
            </div>
          </div>
        </div>
      )}

      {/* ── New Task Modal ── */}
      {showTaskModal && (
        <div className={styles.modalOverlay} onClick={() => setShowTaskModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>New Task</h2>
              <button className={styles.modalClose} onClick={() => setShowTaskModal(false)}>
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M5 5l10 10M15 5L5 15" />
                </svg>
              </button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Task Title</label>
                <input className={styles.formInput} type="text" placeholder="e.g. Submit question papers" />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Description</label>
                <textarea className={styles.formTextarea} placeholder="Task details..." rows={3} />
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Due Date</label>
                  <input className={styles.formInput} type="date" />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Priority</label>
                  <select className={styles.formSelect}>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Category</label>
                <select className={styles.formSelect}>
                  <option value="academic">Academic</option>
                  <option value="administrative">Administrative</option>
                  <option value="exam">Exam</option>
                  <option value="event">Event</option>
                </select>
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button className={styles.cancelBtn} onClick={() => setShowTaskModal(false)}>Cancel</button>
              <button className={styles.submitBtn} style={{ background: 'var(--success)' }} onClick={() => setShowTaskModal(false)}>Create Task</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
