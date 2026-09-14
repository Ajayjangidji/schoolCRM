'use client';

import { useState, useRef, useEffect } from 'react';
import {
  getStudent,
  getExamResult,
  getFeeDetails,
  getDailySummary,
  getAttendanceStats,
  getHomeworkList,
  getExamSchedule,
  getTransportInfo,
  getNotices,
} from '@/hooks/use-data';
import { formatCurrency, formatDate } from '@/lib/utils';
import type { AIMessage } from '@/types';
import styles from './ai-assistant.module.css';

interface QuickAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  query: string;
  category: string;
  color: string;
}

const QUICK_ACTIONS: QuickAction[] = [
  {
    id: 'attendance',
    label: 'Today\'s Attendance',
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 12l2 2 4-4"/><rect x="3" y="4" width="18" height="16" rx="2"/></svg>,
    query: 'Is my child present in school today?',
    category: 'Attendance',
    color: 'var(--success)',
  },
  {
    id: 'homework',
    label: 'Pending Homework',
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 5h14v16H5z"/><path d="M8 9h8M8 12h8M8 15h4"/></svg>,
    query: 'What homework is pending for my child?',
    category: 'Homework',
    color: 'var(--warning)',
  },
  {
    id: 'fees',
    label: 'Fee Status',
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2v20M7 7h6.5a2.5 2.5 0 010 5H7M7 12h7.5a2.5 2.5 0 010 5H7"/></svg>,
    query: 'What is my child\'s fee status? How much is pending?',
    category: 'Fees',
    color: 'var(--primary)',
  },
  {
    id: 'exam',
    label: 'Upcoming Exams',
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 7v8l10 5 10-5V7"/></svg>,
    query: 'When is the next exam? What is the schedule?',
    category: 'Exams',
    color: 'var(--danger)',
  },
  {
    id: 'result',
    label: 'Academic Report',
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 4h4v12H4zM10 8h4v8h-4zM16 2h4v14h-4"/></svg>,
    query: 'How is my child performing academically? Show the latest result.',
    category: 'Academics',
    color: '#8B5CF6',
  },
  {
    id: 'transport',
    label: 'Bus / Transport',
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 15V6a2 2 0 012-2h10a2 2 0 012 2v9"/><path d="M3 15h18v3a1 1 0 01-1 1H4a1 1 0 01-1-1v-3z"/><circle cx="7" cy="20" r="1"/><circle cx="17" cy="20" r="1"/></svg>,
    query: 'What is my child\'s bus timing and driver details?',
    category: 'Transport',
    color: 'var(--info)',
  },
];

const SUGGESTED_QUESTIONS = [
  'Which subject is my child weakest in?',
  'How many days has my child been absent this year?',
  'What is the PTM date?',
  'Is there any overdue homework?',
  'Download fee receipt for Q2',
  'When is the next holiday?',
  'Compare my child\'s marks with class average',
  'How to improve my child\'s Hindi marks?',
];

function generateAIResponse(query: string, data: {
  student: ReturnType<typeof getStudent>;
  exam: ReturnType<typeof getExamResult>;
  fees: ReturnType<typeof getFeeDetails>;
  summary: ReturnType<typeof getDailySummary>;
  attendance: ReturnType<typeof getAttendanceStats>;
  homework: ReturnType<typeof getHomeworkList>;
  examSchedule: ReturnType<typeof getExamSchedule>;
  transport: ReturnType<typeof getTransportInfo>;
  notices: ReturnType<typeof getNotices>;
}): string {
  const q = query.toLowerCase();

  if (q.includes('present') || q.includes('attendance') && q.includes('today')) {
    const status = data.summary.attendance.status;
    const time = data.summary.attendance.checkInTime;
    if (status === 'present') {
      return `✅ **${data.student.name} is present in school today!**\n\nCheck-in time: **${time}**\n\n📊 **Attendance Summary (This Year):**\n• Total school days: ${data.attendance.totalDays}\n• Present: ${data.attendance.present} days\n• Absent: ${data.attendance.absent} days\n• Late: ${data.attendance.late} times\n• Attendance rate: **${data.attendance.percentage}%**\n\n${data.attendance.percentage >= 90 ? '🌟 Great attendance! Keep it up.' : '⚠️ Attendance is below 90%. Regular attendance helps in better learning.'}`;
    }
    return `❌ ${data.student.name} is marked **${status}** today.\n\nIf this is unexpected, please contact the class teacher immediately.`;
  }

  if (q.includes('homework') || q.includes('pending')) {
    const pending = data.homework.filter(h => h.status === 'pending');
    const overdue = data.homework.filter(h => h.status === 'overdue');
    let response = `📚 **Homework Status for ${data.student.name}:**\n\n`;

    if (overdue.length > 0) {
      response += `🔴 **OVERDUE (${overdue.length}):**\n`;
      overdue.forEach(h => {
        response += `• **${h.subject}** — ${h.title}\n  Due: ${formatDate(h.dueDate)} (OVERDUE!)\n`;
      });
      response += '\n';
    }

    if (pending.length > 0) {
      response += `🟡 **Pending (${pending.length}):**\n`;
      pending.forEach(h => {
        response += `• **${h.subject}** — ${h.title}\n  Due: ${formatDate(h.dueDate)}\n`;
      });
    }

    if (pending.length === 0 && overdue.length === 0) {
      response += '🎉 All homework is completed! No pending tasks.';
    } else {
      response += `\n💡 **Tip:** Help ${data.student.name} prioritize overdue work first. Set a daily study routine of 2 hours after school.`;
    }
    return response;
  }

  if (q.includes('fee') || q.includes('payment') || q.includes('pending')) {
    const f = data.fees;
    const paidPercent = Math.round((f.totalPaid / f.totalAnnualFee) * 100);
    const nextDue = f.installments.find(i => i.status === 'pending');
    let response = `💰 **Fee Status for ${data.student.name} (2026-27):**\n\n`;
    response += `• Annual Fee: **${formatCurrency(f.totalAnnualFee)}**\n`;
    response += `• Paid: **${formatCurrency(f.totalPaid)}** (${paidPercent}%)\n`;
    response += `• Balance: **${formatCurrency(f.totalBalance)}**\n\n`;

    if (nextDue) {
      response += `📅 **Next Due:**\n• ${nextDue.label}: **${formatCurrency(nextDue.amount)}**\n• Due Date: **${formatDate(nextDue.dueDate)}**\n\n`;
    }

    response += `📋 **Installment Summary:**\n`;
    f.installments.forEach(i => {
      const icon = i.status === 'paid' ? '✅' : i.status === 'overdue' ? '🔴' : '⏳';
      response += `${icon} ${i.label} — ${formatCurrency(i.amount)} — ${i.status.toUpperCase()}\n`;
    });

    if (f.totalBalance > 0) {
      response += `\n💡 **Tip:** Pay fees on time to avoid late fee charges. You can pay online via UPI, card, or net banking.`;
    }
    return response;
  }

  if ((q.includes('exam') && (q.includes('next') || q.includes('schedule') || q.includes('when'))) || q.includes('upcoming exam')) {
    const exams = data.examSchedule;
    let response = `📝 **Upcoming Exam Schedule for ${data.student.name}:**\n\n`;
    response += `**${exams[0]?.examType || 'Unit Test'}** (${exams.length} subjects)\n\n`;
    exams.forEach(e => {
      response += `📌 **${e.subject}**\n`;
      response += `   📅 ${formatDate(e.date)} | ⏰ ${e.startTime} - ${e.endTime}\n`;
      if (e.syllabus) {
        response += `   📖 ${e.syllabus}\n`;
      }
      response += '\n';
    });
    response += `💡 **Study Tips:**\n• Start revision at least 1 week before each exam\n• Focus on weak subjects first (Hindi needs more practice)\n• Practice previous year papers\n• Take short breaks every 45 minutes`;
    return response;
  }

  if (q.includes('result') || q.includes('academic') || q.includes('marks') || q.includes('performing') || q.includes('report')) {
    const e = data.exam;
    let response = `📊 **Academic Report — ${e.examName}**\n\n`;
    response += `🏆 Overall: **${e.totalPercentage}%** (Grade: **${e.overallGrade}**) | Rank: **#${e.rank}**\n\n`;
    response += `**Subject-wise Marks:**\n`;

    const sorted = [...e.subjects].sort((a, b) => b.percentage - a.percentage);
    sorted.forEach((s, i) => {
      const icon = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : '📘';
      response += `${icon} **${s.subject}**: ${s.total}/${s.maxMarks} (${s.percentage}%) — ${s.grade}\n`;
    });

    const best = sorted[0];
    const weak = sorted[sorted.length - 1];

    response += `\n✅ **Strongest Subject:** ${best.subject} (${best.percentage}%)\n`;
    response += `⚠️ **Needs Improvement:** ${weak.subject} (${weak.percentage}%)\n\n`;
    response += `💡 **AI Recommendation:**\n`;
    response += `• ${weak.subject} needs focused attention — consider extra tutoring\n`;
    response += `• ${best.subject} is excellent! Encourage participation in Olympiads\n`;
    response += `• Teacher's remark: "${e.remarks}"`;
    return response;
  }

  if (q.includes('bus') || q.includes('transport') || q.includes('driver')) {
    const t = data.transport;
    let response = `🚌 **Transport Details for ${data.student.name}:**\n\n`;
    response += `**Bus:** ${t.busNumber}\n`;
    response += `**Route:** ${t.routeName}\n\n`;
    response += `📍 **Pickup:** ${t.pickupStop} at **${t.pickupTime}**\n`;
    response += `📍 **Drop:** ${t.dropStop} at **${t.dropTime}**\n\n`;
    response += `👨‍✈️ **Driver:** ${t.driverName}\n📞 ${t.driverPhone}\n\n`;
    if (t.attendantName) {
      response += `👩 **Attendant:** ${t.attendantName}\n📞 ${t.attendantPhone}\n\n`;
    }
    response += `💡 Please ensure ${data.student.name} is at the pickup point 5 minutes before ${t.pickupTime}.`;
    return response;
  }

  if (q.includes('weak') || q.includes('improve') || q.includes('hindi')) {
    const e = data.exam;
    const sorted = [...e.subjects].sort((a, b) => a.percentage - b.percentage);
    const weak = sorted[0];
    let response = `📉 **${data.student.name}'s Weakest Subject: ${weak.subject} (${weak.percentage}%)**\n\n`;
    response += `**Marks Breakdown:**\n`;
    response += `• Theory: ${weak.theory}/${weak.maxMarks - (weak.internal || 0) - (weak.practical || 0)}\n`;
    if (weak.internal) response += `• Internal: ${weak.internal}/20\n`;
    if (weak.practical) response += `• Practical: ${weak.practical}/25\n`;
    response += `\n**🎯 Improvement Plan for ${weak.subject}:**\n\n`;
    response += `1. **Daily Practice (30 min)** — Revise grammar rules and vocabulary daily\n`;
    response += `2. **Read Aloud** — Practice reading Hindi stories or newspaper for 15 min\n`;
    response += `3. **Writing Practice** — Write one paragraph in Hindi daily\n`;
    response += `4. **Past Papers** — Solve last 3 years' question papers\n`;
    response += `5. **Teacher Support** — Request extra help from ${weak.subject} teacher\n\n`;
    response += `📈 With consistent effort, ${data.student.name} can improve by 15-20% in the next exam!`;
    return response;
  }

  if (q.includes('absent') || (q.includes('attendance') && q.includes('year'))) {
    const a = data.attendance;
    return `📊 **Attendance Report for ${data.student.name} (This Year):**\n\n• Total school days: **${a.totalDays}**\n• Present: **${a.present}** days ✅\n• Absent: **${a.absent}** days ❌\n• Late arrivals: **${a.late}** times ⏰\n• Attendance rate: **${a.percentage}%**\n\n${a.percentage >= 90 ? '🌟 Attendance is above 90% — excellent!' : '⚠️ Attendance is below 90%. Schools require minimum 75% attendance for exam eligibility.'}\n\n💡 **Tip:** Regular attendance improves academic performance by 20-30% as per studies.`;
  }

  if (q.includes('ptm') || q.includes('parent teacher') || q.includes('meeting')) {
    const ptm = data.notices.find(n => n.title.toLowerCase().includes('ptm') || n.title.toLowerCase().includes('parent-teacher'));
    if (ptm) {
      return `📅 **Parent-Teacher Meeting:**\n\n${ptm.content}\n\n📝 Posted on: ${formatDate(ptm.postedDate)}\n\n💡 **Prepare for PTM:**\n• Note down specific questions about ${data.student.name}'s progress\n• Ask about weak areas and improvement strategies\n• Discuss homework habits and classroom behavior\n• Bring the homework diary`;
    }
    return `ℹ️ No PTM is currently scheduled. The school usually announces PTMs 2 weeks in advance via the Notices section. I'll alert you as soon as one is announced!`;
  }

  if (q.includes('holiday') || q.includes('leave') && q.includes('school')) {
    const holidays = data.notices.filter(n => n.category === 'holiday');
    if (holidays.length > 0) {
      let response = `🎉 **Upcoming Holidays:**\n\n`;
      holidays.forEach(h => {
        response += `📅 **${h.title}**\n${h.content}\n\n`;
      });
      return response;
    }
    return `ℹ️ No holidays are currently announced. Check the **Notices** section for updates.`;
  }

  if (q.includes('compare') || q.includes('average') || q.includes('class average')) {
    const e = data.exam;
    let response = `📊 **${data.student.name}'s Performance vs Class Average:**\n\n`;
    response += `Overall: **${e.totalPercentage}%** (Class Avg: ~72%) — ✅ **Above Average**\n\n`;
    e.subjects.forEach(s => {
      const classAvg = Math.round(s.percentage * 0.85);
      const diff = s.percentage - classAvg;
      const icon = diff > 0 ? '📈' : '📉';
      response += `${icon} **${s.subject}**: ${s.percentage}% vs ${classAvg}% (${diff > 0 ? '+' : ''}${diff}%)\n`;
    });
    response += `\n🏆 **Rank: #${e.rank}** out of 45 students\n\n💡 ${data.student.name} is performing above class average in most subjects. Focus on ${e.subjects.sort((a, b) => a.percentage - b.percentage)[0].subject} to climb higher in rank!`;
    return response;
  }

  if (q.includes('receipt') || q.includes('download')) {
    return `📄 **Fee Receipts Available:**\n\n✅ Q1 (Apr-Jun) — Paid on ${formatDate('2026-04-10')} — TXN: TXN20260410001\n✅ Q2 (Jul-Sep) — Paid on ${formatDate('2026-07-12')} — TXN: TXN20260712002\n\n📥 You can download receipts from the **Documents** section.\n\n💡 Go to **Documents → Fee Receipts** to view and download PDF receipts.`;
  }

  return `🤖 I understand you're asking about "${query}"\n\nHere's what I can help you with:\n\n📊 **Academics** — Results, marks, weak subjects, improvement tips\n📅 **Attendance** — Daily status, monthly report, trends\n📚 **Homework** — Pending, overdue, submission status\n💰 **Fees** — Payment status, due dates, receipts\n📝 **Exams** — Schedule, syllabus, study tips\n🚌 **Transport** — Bus timing, driver contact, route info\n📢 **Notices** — PTM, holidays, events\n\nTry asking something specific like:\n• "Is my child present today?"\n• "What homework is pending?"\n• "How much fee is due?"\n• "Which subject needs improvement?"`;
}

export default function AIAssistantPage() {
  const student = getStudent();
  const exam = getExamResult();
  const fees = getFeeDetails();
  const summary = getDailySummary();
  const attendance = getAttendanceStats();
  const homework = getHomeworkList();
  const examSchedule = getExamSchedule();
  const transport = getTransportInfo();
  const notices = getNotices();

  const allData = { student, exam, fees, summary, attendance, homework, examSchedule, transport, notices };

  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const overdue = homework.filter(h => h.status === 'overdue').length;
  const pendingHW = homework.filter(h => h.status === 'pending').length;
  const weakSubject = [...exam.subjects].sort((a, b) => a.percentage - b.percentage)[0];
  const nextExam = examSchedule[0];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  function sendMessage(query: string) {
    const userMsg: AIMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);
    setShowSuggestions(false);

    setTimeout(() => {
      const response = generateAIResponse(query, allData);
      const aiMsg: AIMessage = {
        id: `a-${Date.now()}`,
        role: 'assistant',
        content: response,
        timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 800 + Math.random() * 700);
  }

  function renderMarkdown(text: string) {
    return text.split('\n').map((line, i) => {
      let processed = line
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.+?)\*/g, '<em>$1</em>');
      return <div key={i} dangerouslySetInnerHTML={{ __html: processed || '&nbsp;' }} />;
    });
  }

  return (
    <div className={styles.page}>
      {/* Hero / Welcome */}
      {messages.length === 0 && (
        <div className={styles.welcome}>
          <div className={styles.welcomeIcon}>
            <svg width="56" height="56" viewBox="0 0 56 56" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="28" cy="20" r="10" />
              <path d="M14 28a14 14 0 0028 0" />
              <circle cx="24" cy="18" r="1.5" fill="var(--primary)" stroke="none" />
              <circle cx="32" cy="18" r="1.5" fill="var(--primary)" stroke="none" />
              <path d="M24 23c1 2 6 2 8 0" />
              <path d="M18 8l-3-4M38 8l3-4M12 18H6M44 18h6" />
            </svg>
          </div>
          <h1 className={styles.welcomeTitle}>
            Namaste, {student.name.split(' ')[0]}&#39;s Parent!
          </h1>
          <p className={styles.welcomeDesc}>
            I&#39;m your AI School Assistant. Ask me anything about {student.name}&#39;s attendance, homework, exams, fees, transport — I know it all!
          </p>

          {/* Smart Insights */}
          <div className={styles.insightsRow}>
            {summary.attendance.status === 'present' && (
              <div className={`${styles.insightCard} ${styles.insightGreen}`}>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6.5 9l2 2 4-4"/><circle cx="9" cy="9" r="7"/></svg>
                <span>Present today at {summary.attendance.checkInTime}</span>
              </div>
            )}
            {overdue > 0 && (
              <div className={`${styles.insightCard} ${styles.insightRed}`} onClick={() => sendMessage('What homework is pending for my child?')}>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="9" cy="9" r="7"/><path d="M9 5v4M9 12h.01"/></svg>
                <span>{overdue} homework overdue!</span>
              </div>
            )}
            {pendingHW > 0 && (
              <div className={`${styles.insightCard} ${styles.insightYellow}`} onClick={() => sendMessage('What homework is pending for my child?')}>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="9" cy="9" r="7"/><path d="M9 5v5l2.5 2.5"/></svg>
                <span>{pendingHW} homework pending</span>
              </div>
            )}
            {fees.totalBalance > 0 && (
              <div className={`${styles.insightCard} ${styles.insightBlue}`} onClick={() => sendMessage('What is my child\'s fee status? How much is pending?')}>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 2v14M6 5h4a2 2 0 010 4H6M6 9h5a2 2 0 010 4H6"/></svg>
                <span>Fee due: {formatCurrency(fees.totalBalance)}</span>
              </div>
            )}
            {nextExam && (
              <div className={`${styles.insightCard} ${styles.insightPurple}`} onClick={() => sendMessage('When is the next exam? What is the schedule?')}>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 2v2M12 2v2M3 7h12M3 4h12a1 1 0 011 1v10a1 1 0 01-1 1H3a1 1 0 01-1-1V5a1 1 0 011-1z"/></svg>
                <span>Exam in {summary.upcomingExam?.daysLeft} days</span>
              </div>
            )}
            <div className={`${styles.insightCard} ${styles.insightOrange}`} onClick={() => sendMessage('Which subject is my child weakest in?')}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 14l4-6 3 3 5-8"/></svg>
              <span>Weak: {weakSubject.subject} ({weakSubject.percentage}%)</span>
            </div>
          </div>

          {/* Quick Actions Grid */}
          <div className={styles.quickActionsTitle}>Quick Actions</div>
          <div className={styles.quickActions}>
            {QUICK_ACTIONS.map((action) => (
              <button
                key={action.id}
                className={styles.actionCard}
                onClick={() => sendMessage(action.query)}
              >
                <div className={styles.actionIcon} style={{ color: action.color }}>
                  {action.icon}
                </div>
                <span className={styles.actionLabel}>{action.label}</span>
              </button>
            ))}
          </div>

          {/* Suggested Questions */}
          <div className={styles.suggestionsTitle}>Try asking me...</div>
          <div className={styles.suggestions}>
            {SUGGESTED_QUESTIONS.map((q, i) => (
              <button
                key={i}
                className={styles.suggestionChip}
                onClick={() => sendMessage(q)}
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Chat Messages */}
      {messages.length > 0 && (
        <div className={styles.chatArea}>
          <div className={styles.messagesContainer}>
            {messages.map((msg) => (
              <div key={msg.id} className={`${styles.messageRow} ${msg.role === 'user' ? styles.messageUser : styles.messageAI}`}>
                {msg.role === 'assistant' && (
                  <div className={styles.aiAvatar}>
                    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M10 2a4 4 0 014 4v2a4 4 0 01-8 0V6a4 4 0 014-4z"/><path d="M4 10a6 6 0 0012 0"/><circle cx="8" cy="7" r="0.5" fill="currentColor"/><circle cx="12" cy="7" r="0.5" fill="currentColor"/></svg>
                  </div>
                )}
                <div className={`${styles.messageBubble} ${msg.role === 'user' ? styles.bubbleUser : styles.bubbleAI}`}>
                  <div className={styles.messageContent}>{renderMarkdown(msg.content)}</div>
                  <div className={styles.messageTime}>{msg.timestamp}</div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className={`${styles.messageRow} ${styles.messageAI}`}>
                <div className={styles.aiAvatar}>
                  <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M10 2a4 4 0 014 4v2a4 4 0 01-8 0V6a4 4 0 014-4z"/><path d="M4 10a6 6 0 0012 0"/></svg>
                </div>
                <div className={`${styles.messageBubble} ${styles.bubbleAI}`}>
                  <div className={styles.typingDots}>
                    <span /><span /><span />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick re-ask suggestions */}
          {showSuggestions === false && !isTyping && messages.length > 0 && (
            <div className={styles.reAskRow}>
              {SUGGESTED_QUESTIONS.slice(0, 4).map((q, i) => (
                <button key={i} className={styles.reAskChip} onClick={() => sendMessage(q)}>
                  {q}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Input Bar — always visible */}
      <div className={styles.inputBar}>
        <div className={styles.inputWrap}>
          <svg className={styles.inputIcon} width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M10 2a4 4 0 014 4v2a4 4 0 01-8 0V6a4 4 0 014-4z"/><path d="M4 10a6 6 0 0012 0"/><circle cx="8" cy="7" r="0.5" fill="currentColor"/><circle cx="12" cy="7" r="0.5" fill="currentColor"/></svg>
          <input
            type="text"
            className={styles.chatInput}
            placeholder={`Ask about ${student.name}'s school life...`}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && input.trim()) {
                sendMessage(input.trim());
              }
            }}
          />
          <button
            className={styles.sendBtn}
            disabled={!input.trim() || isTyping}
            onClick={() => {
              if (input.trim()) sendMessage(input.trim());
            }}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 10h12M10 4l6 6-6 6" />
            </svg>
          </button>
        </div>
        <div className={styles.inputHint}>
          AI responses are generated from school data. For urgent matters, contact the school directly.
        </div>
      </div>
    </div>
  );
}
