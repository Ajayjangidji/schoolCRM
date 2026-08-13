'use client';

import { useState } from 'react';
import { getChatThreads, getChatMessages, getParent } from '@/hooks/use-data';
import { getInitials } from '@/lib/utils';
import styles from './chat.module.css';

export default function ChatPage() {
  const threads = getChatThreads();
  const parent = getParent();
  const [activeThread, setActiveThread] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState('');

  const activeMessages = activeThread ? getChatMessages(activeThread) : [];
  const activeTeacher = threads.find((t) => t.id === activeThread);

  function formatMessageTime(timestamp: string): string {
    const parts = timestamp.split(' ');
    return parts.slice(1).join(' ');
  }

  return (
    <div className={styles.page}>
      <div className={styles.chatLayout}>
        {/* Thread List */}
        <div className={`${styles.threadList} ${activeThread ? styles.threadListHidden : ''}`}>
          <div className={styles.threadListHeader}>
            <span className={styles.threadListTitle}>Messages</span>
            <span className={styles.threadCount}>{threads.length} conversations</span>
          </div>
          <div className={styles.threads}>
            {threads.map((thread) => (
              <div
                key={thread.id}
                className={`${styles.threadItem} ${activeThread === thread.id ? styles.threadItemActive : ''}`}
                onClick={() => setActiveThread(thread.id)}
              >
                <div className={styles.threadAvatar}>
                  {getInitials(thread.teacherName)}
                  {thread.isOnline && <span className={styles.onlineDot} />}
                </div>
                <div className={styles.threadInfo}>
                  <div className={styles.threadTopRow}>
                    <span className={styles.threadName}>{thread.teacherName}</span>
                    <span className={styles.threadTime}>
                      {formatMessageTime(thread.lastMessageTime)}
                    </span>
                  </div>
                  <div className={styles.threadSubject}>{thread.teacherSubject}</div>
                  <div className={styles.threadPreview}>{thread.lastMessage}</div>
                </div>
                {thread.unreadCount > 0 && (
                  <span className={styles.unreadBadge}>{thread.unreadCount}</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Chat Window */}
        <div className={`${styles.chatWindow} ${activeThread ? styles.chatWindowActive : ''}`}>
          {!activeThread ? (
            <div className={styles.emptyChatState}>
              <div className={styles.emptyChatIcon}>
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 8h28a2 2 0 012 2v16a2 2 0 01-2 2h-8l-6 6-6-6H6a2 2 0 01-2-2V10a2 2 0 012-2z" />
                  <path d="M14 16h12M14 20h6" />
                </svg>
              </div>
              <div className={styles.emptyChatTitle}>Select a conversation</div>
              <div className={styles.emptyChatDesc}>Choose a teacher to start chatting</div>
            </div>
          ) : (
            <>
              {/* Chat Header */}
              <div className={styles.chatHeader}>
                <button className={styles.backBtn} onClick={() => setActiveThread(null)}>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M13 4l-6 6 6 6" /></svg>
                </button>
                <div className={styles.chatHeaderAvatar}>
                  {getInitials(activeTeacher?.teacherName || '')}
                  {activeTeacher?.isOnline && <span className={styles.onlineDot} />}
                </div>
                <div className={styles.chatHeaderInfo}>
                  <div className={styles.chatHeaderName}>{activeTeacher?.teacherName}</div>
                  <div className={styles.chatHeaderStatus}>
                    {activeTeacher?.teacherSubject}
                    {activeTeacher?.isOnline && <span className={styles.onlineText}> &middot; Online</span>}
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className={styles.messages}>
                {activeMessages.map((msg) => {
                  const isOwn = msg.senderRole === 'parent';
                  return (
                    <div key={msg.id} className={`${styles.messageRow} ${isOwn ? styles.messageRowOwn : ''}`}>
                      {!isOwn && (
                        <div className={styles.messageAvatar}>
                          {getInitials(msg.senderName)}
                        </div>
                      )}
                      <div className={`${styles.messageBubble} ${isOwn ? styles.messageBubbleOwn : ''}`}>
                        <div className={styles.messageText}>{msg.content}</div>
                        <div className={styles.messageTime}>{formatMessageTime(msg.timestamp)}</div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Input */}
              <div className={styles.chatInputBar}>
                <button className={styles.attachBtn} title="Attach file">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 7l-6.5 6.5a2.12 2.12 0 01-3-3L12 4a3.54 3.54 0 015 5l-6.5 6.5a4.95 4.95 0 01-7-7L10 2" />
                  </svg>
                </button>
                <input
                  type="text"
                  className={styles.chatInput}
                  placeholder="Type a message..."
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && messageInput.trim()) {
                      setMessageInput('');
                    }
                  }}
                />
                <button
                  className={styles.sendBtn}
                  disabled={!messageInput.trim()}
                  title="Send"
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 10l7-7v5h9v4H9v5z" transform="rotate(-90 10 10)" />
                  </svg>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
