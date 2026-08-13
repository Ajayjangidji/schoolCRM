'use client';

import { useState } from 'react';
import { getParentMessages } from '@/hooks/use-teacher-data';
import { getInitials } from '@/lib/utils';
import type { ParentMessage } from '@/hooks/use-teacher-data';
import styles from './messages.module.css';

interface ChatMessage {
  id: string;
  text: string;
  sender: 'teacher' | 'parent';
  time: string;
}

const mockChats: Record<string, ChatMessage[]> = {
  PM001: [
    { id: '1', text: 'Good morning Mr. Sharma. I wanted to update you about Aarav\'s progress in English.', sender: 'teacher', time: '09:00 AM' },
    { id: '2', text: 'Good morning Ma\'am. Yes please, we were curious about how he\'s doing.', sender: 'parent', time: '09:05 AM' },
    { id: '3', text: 'Aarav has shown significant improvement in comprehension. His essay writing is getting better too. He scored 42/50 in the last unit test.', sender: 'teacher', time: '09:10 AM' },
    { id: '4', text: 'That\'s great to hear! He\'s been practicing at home regularly.', sender: 'parent', time: '09:15 AM' },
    { id: '5', text: 'I would suggest focusing on grammar exercises. I\'ll send some practice sheets.', sender: 'teacher', time: '09:20 AM' },
    { id: '6', text: 'Thank you for the update on Aarav\'s progress.', sender: 'parent', time: '09:30 AM' },
  ],
  PM002: [
    { id: '1', text: 'Hello Mrs. Patel, how can I help you?', sender: 'teacher', time: '03:30 PM' },
    { id: '2', text: 'Hi Ma\'am. Priya mentioned there is a PTM coming up?', sender: 'parent', time: '03:35 PM' },
    { id: '3', text: 'Yes, the PTM is scheduled for 20th August. You\'ll receive the formal notice soon.', sender: 'teacher', time: '03:45 PM' },
    { id: '4', text: 'When is the PTM scheduled?', sender: 'parent', time: '04:00 PM' },
  ],
  PM003: [
    { id: '1', text: 'Mr. Gupta, Rohan needs to bring project materials for the English activity next week.', sender: 'teacher', time: '10:30 AM' },
    { id: '2', text: 'Sure Ma\'am, what materials does he need?', sender: 'parent', time: '10:40 AM' },
    { id: '3', text: 'Chart paper, color pens, and printed photos for the collage project on "My Favorite Author".', sender: 'teacher', time: '10:45 AM' },
    { id: '4', text: 'Noted, will send the project materials.', sender: 'parent', time: '11:00 AM' },
  ],
};

export default function TeacherMessagesPage() {
  const conversations = getParentMessages();
  const [activeConv, setActiveConv] = useState<ParentMessage | null>(conversations[0] || null);
  const [searchQuery, setSearchQuery] = useState('');
  const [msgInput, setMsgInput] = useState('');

  const totalUnread = conversations.reduce((s, m) => s + m.unreadCount, 0);
  const onlineCount = conversations.filter((m) => m.isOnline).length;

  const filteredConvs = searchQuery.trim()
    ? conversations.filter((c) =>
        c.parentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.studentName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : conversations;

  const chatMessages = activeConv ? (mockChats[activeConv.id] || []) : [];

  function extractTime(timeStr: string): string {
    const parts = timeStr.split(' ');
    return parts.length >= 2 ? parts[1] + (parts[2] ? ' ' + parts[2] : '') : timeStr;
  }

  return (
    <div className={styles.page}>
      {/* ── Header ── */}
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Parent Communication</h1>
        <button className={styles.newMsgBtn}>
          <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M10 4v12M4 10h12" />
          </svg>
          New Message
        </button>
      </div>

      {/* ── Stats ── */}
      <div className={styles.statsRow}>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>
            <svg width="22" height="22" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 4h14a1 1 0 011 1v8a1 1 0 01-1 1h-4l-3 3-3-3H3a1 1 0 01-1-1V5a1 1 0 011-1z" />
            </svg>
          </div>
          <div className={styles.statContent}>
            <div className={styles.statLabel}>Conversations</div>
            <div className={styles.statValue}>{conversations.length}</div>
            <div className={styles.statSub}>Active threads</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: totalUnread > 0 ? 'var(--danger-light)' : 'var(--success-light)', color: totalUnread > 0 ? 'var(--danger)' : 'var(--success)' }}>
            <svg width="22" height="22" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 2a6 6 0 016 6c0 3.5 1 5.5 2 7H2c1-1.5 2-3.5 2-7a6 6 0 016-6z" />
              <path d="M8 15a2 2 0 004 0" />
            </svg>
          </div>
          <div className={styles.statContent}>
            <div className={styles.statLabel}>Unread</div>
            <div className={styles.statValue}>{totalUnread}</div>
            <div className={styles.statSub}>Messages to read</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: 'var(--success-light)', color: 'var(--success)' }}>
            <svg width="22" height="22" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="10" cy="10" r="4" fill="currentColor" opacity="0.3" />
              <circle cx="10" cy="10" r="8" />
            </svg>
          </div>
          <div className={styles.statContent}>
            <div className={styles.statLabel}>Online Now</div>
            <div className={styles.statValue}>{onlineCount}</div>
            <div className={styles.statSub}>Parents online</div>
          </div>
        </div>
      </div>

      {/* ── Chat Layout ── */}
      <div className={styles.chatLayout}>
        {/* Conversation List */}
        <div className={styles.convList}>
          <div className={styles.convSearch}>
            <div className={styles.searchWrap}>
              <svg className={styles.searchIcon} width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <circle cx="9" cy="9" r="6" />
                <path d="M14 14l4 4" />
              </svg>
              <input
                className={styles.searchInput}
                type="text"
                placeholder="Search parents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className={styles.convItems}>
            {filteredConvs.map((conv) => (
              <div
                key={conv.id}
                className={`${styles.convItem} ${activeConv?.id === conv.id ? styles.convItemActive : ''}`}
                onClick={() => setActiveConv(conv)}
              >
                <div className={styles.convAvatar}>
                  {getInitials(conv.parentName)}
                  {conv.isOnline && <span className={styles.onlineDot} />}
                </div>
                <div className={styles.convInfo}>
                  <div className={styles.convName}>
                    {conv.parentName}
                    <span className={styles.convTime}>{extractTime(conv.lastMessageTime)}</span>
                  </div>
                  <div className={styles.convStudent}>
                    {conv.studentName} &middot; {conv.classSection}
                  </div>
                  <div className={styles.convPreview}>{conv.lastMessage}</div>
                </div>
                {conv.unreadCount > 0 && (
                  <span className={styles.convBadge}>{conv.unreadCount}</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Chat Panel */}
        <div className={`${styles.chatPanel} ${activeConv ? styles.chatPanelActive : ''}`}>
          {activeConv ? (
            <>
              <div className={styles.chatHeader}>
                <div className={styles.convAvatar}>
                  {getInitials(activeConv.parentName)}
                  {activeConv.isOnline && <span className={styles.onlineDot} />}
                </div>
                <div className={styles.chatHeaderInfo}>
                  <div className={styles.chatHeaderName}>{activeConv.parentName}</div>
                  <div className={styles.chatHeaderSub}>
                    Parent of {activeConv.studentName} ({activeConv.classSection})
                    {activeConv.isOnline ? ' · Online' : ''}
                  </div>
                </div>
                <div className={styles.chatHeaderActions}>
                  <button className={styles.iconBtn}>
                    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="10" cy="10" r="8" />
                      <path d="M10 6v4l2.5 2.5" />
                    </svg>
                  </button>
                  <button className={styles.iconBtn}>
                    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="10" cy="5" r="1.5" fill="currentColor" />
                      <circle cx="10" cy="10" r="1.5" fill="currentColor" />
                      <circle cx="10" cy="15" r="1.5" fill="currentColor" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className={styles.chatMessages}>
                <div className={styles.dateSep}>
                  <span className={styles.dateSepLine}>Today</span>
                </div>
                {chatMessages.map((msg) => (
                  <div key={msg.id}>
                    <div className={`${styles.msgRow} ${msg.sender === 'teacher' ? styles.msgRowSent : ''}`}>
                      <div className={`${styles.msgBubble} ${msg.sender === 'teacher' ? styles.msgBubbleSent : ''}`}>
                        {msg.text}
                      </div>
                    </div>
                    <div className={`${styles.msgTime} ${msg.sender === 'teacher' ? styles.msgTimeSent : ''}`}>
                      {msg.time}
                    </div>
                  </div>
                ))}
              </div>

              <div className={styles.chatInput}>
                <input
                  className={styles.chatTextInput}
                  type="text"
                  placeholder="Type a message..."
                  value={msgInput}
                  onChange={(e) => setMsgInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') setMsgInput(''); }}
                />
                <button className={styles.sendBtn} onClick={() => setMsgInput('')}>
                  <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 2L9 11" />
                    <path d="M18 2l-7 18-3-8-8-3 18-7z" />
                  </svg>
                </button>
              </div>
            </>
          ) : (
            <div className={styles.emptyChat}>
              <svg width="48" height="48" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1">
                <path d="M3 4h14a1 1 0 011 1v8a1 1 0 01-1 1h-4l-3 3-3-3H3a1 1 0 01-1-1V5a1 1 0 011-1z" />
              </svg>
              <div className={styles.emptyChatText}>
                Select a conversation to start messaging
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
