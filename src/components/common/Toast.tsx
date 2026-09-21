'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import styles from './Toast.module.css';

type ToastType = 'success' | 'error' | 'info';

export function useToast() {
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((message: string, type: ToastType = 'success') => {
    if (timer.current) clearTimeout(timer.current);
    setToast({ message, type });
    timer.current = setTimeout(() => setToast(null), 3200);
  }, []);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const toastNode = toast ? (
    <div className={`${styles.toast} ${styles[toast.type]}`} role="status" aria-live="polite">
      <span className={styles.dot} />
      {toast.message}
    </div>
  ) : null;

  return { showToast, toastNode };
}
