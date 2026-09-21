'use client';

import { useState, useRef, useEffect } from 'react';
import { getChatThreads, getChatMessages, getParent, getToday } from '@/hooks/use-data';
import { getInitials, formatFileSize } from '@/lib/utils';
import { useToast } from '@/components/common/Toast';
import type { ChatMessage } from '@/types';
import styles from './chat.module.css';

const MAX_ATTACHMENT_SIZE = 10 * 1024 * 1024;
const ALLOWED_ATTACHMENT = /^(image\/|application\/(pdf|msword|vnd\.openxmlformats-officedocument\.wordprocessingml\.document)$)/;

function currentTimeLabel(): string {
  return new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }).toUpperCase();
}

export default function ChatPage() {
  const threads = getChatThreads();
  const parent = getParent();
  const [activeThread, setActiveThread] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [sentMessages, setSentMessages] = useState<Record<string, ChatMessage[]>>({});
  const [readThreads, setReadThreads] = useState<Set<string>>(new Set());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { showToast, toastNode } = useToast();

  const activeMessages = activeThread
    ? [...getChatMessages(activeThread), ...(sentMessages[activeThread] || [])]
    : [];
  const activeTeacher = threads.find((t) => t.id === activeThread);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [activeThread, activeMessages.length]);

  function openThread(id: string) {
    setActiveThread(id);
    setReadThreads((prev) => new Set(prev).add(id));
  }

  function appendMessage(message: Omit<ChatMessage, 'id' | 'senderId' | 'senderName' | 'senderRole' | 'timestamp' | 'isRead'>) {
    if (!activeThread) return;
    // TODO: POST /api/chat/messages when backend is connected
    const full: ChatMessage = {
      ...message,
      id: `MSG${Date.now()}`,
      senderId: parent.id,
      senderName: parent.name,
      senderRole: 'parent',
      timestamp: `${getToday()} ${currentTimeLabel()}`,
      isRead: false,
    };
    setSentMessages((prev) => ({ ...prev, [activeThread]: [...(prev[activeThread] || []), full] }));
  }

  function sendText() {
    const content = messageInput.trim();
    if (!content) return;
    appendMessage({ content, type: 'text' });
    setMessageInput('');
  }

  function sendAttachment(file: File | undefined) {
    if (!file) return;
    if (!ALLOWED_ATTACHMENT.test(file.type)) {
      showToast('Only images, PDF or Word documents can be sent', 'error');
      return;
    }
    if (file.size > MAX_ATTACHMENT_SIZE) {
      showToast('Attachment must be smaller than 10 MB', 'error');
      return;
    }
    const isImage = file.type.startsWith('image/');
    appendMessage({
      content: file.name,
      type: isImage ? 'image' : 'file',
      attachment: {
        id: `ATT${Date.now()}`,
        name: file.name,
        url: URL.createObjectURL(file),
        type: isImage ? 'image' : file.type === 'application/pdf' ? 'pdf' : 'doc',
        size: file.size,
      },
    });
  }

  function threadPreview(threadId: string, fallbackMessage: string, fallbackTime: string) {
    const sent = sentMessages[threadId];
    if (!sent || sent.length === 0) return { message: fallbackMessage, time: fallbackTime };
    const last = sent[sent.length - 1];
    return { message: `You: ${last.type === 'text' ? last.content : last.attachment?.name ?? 'Attachment'}`, time: last.timestamp };
  }

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
            {threads.map((thread) => {
              const preview = threadPreview(thread.id, thread.lastMessage, thread.lastMessageTime);
              const unread = readThreads.has(thread.id) ? 0 : thread.unreadCount;
              return (
              <div
                key={thread.id}
                className={`${styles.threadItem} ${activeThread === thread.id ? styles.threadItemActive : ''}`}
                onClick={() => openThread(thread.id)}
              >
                <div className={styles.threadAvatar}>
                  {getInitials(thread.teacherName)}
                  {thread.isOnline && <span className={styles.onlineDot} />}
                </div>
                <div className={styles.threadInfo}>
                  <div className={styles.threadTopRow}>
                    <span className={styles.threadName}>{thread.teacherName}</span>
                    <span className={styles.threadTime}>
                      {formatMessageTime(preview.time)}
                    </span>
                  </div>
                  <div className={styles.threadSubject}>{thread.teacherSubject}</div>
                  <div className={styles.threadPreview}>{preview.message}</div>
                </div>
                {unread > 0 && (
                  <span className={styles.unreadBadge}>{unread}</span>
                )}
              </div>
              );
            })}
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
                    <span className={styles.secureNote}> &middot; Private conversation</span>
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
                        {msg.attachment ? (
                          <a className={styles.attachmentLink} href={msg.attachment.url} target="_blank" rel="noopener noreferrer" download={msg.attachment.name}>
                            <span className={styles.attachmentName}>{msg.attachment.name}</span>
                            <span className={styles.attachmentSize}>{formatFileSize(msg.attachment.size)}</span>
                          </a>
                        ) : (
                          <div className={styles.messageText}>{msg.content}</div>
                        )}
                        <div className={styles.messageTime}>{formatMessageTime(msg.timestamp)}</div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className={styles.chatInputBar}>
                <input
                  ref={fileInputRef}
                  className={styles.fileInput}
                  type="file"
                  accept="image/*,application/pdf,.doc,.docx"
                  onChange={(e) => { sendAttachment(e.target.files?.[0]); e.target.value = ''; }}
                />
                <button className={styles.attachBtn} title="Attach file" aria-label="Attach file" onClick={() => fileInputRef.current?.click()}>
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
                    if (e.key === 'Enter') sendText();
                  }}
                />
                <button
                  className={styles.sendBtn}
                  disabled={!messageInput.trim()}
                  title="Send"
                  aria-label="Send message"
                  onClick={sendText}
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
      {toastNode}
    </div>
  );
}
