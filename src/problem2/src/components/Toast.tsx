import { useEffect } from 'react';
import { AlertIcon, CheckIcon, CloseIcon } from './Icons';
import styles from './Toast.module.css';

export interface Notice {
  id: number;
  tone: 'success' | 'error';
  title: string;
  message: string;
}

interface ToastProps {
  notice: Notice | null;
  onDismiss: () => void;
}

const TOAST_DURATION_MS = 6000;

const Toast = ({ notice, onDismiss }: ToastProps) => {
  useEffect(() => {
    if (!notice) {
      return;
    }
    const timer = setTimeout(onDismiss, TOAST_DURATION_MS);
    return () => clearTimeout(timer);
  }, [notice, onDismiss]);

  return (
    <div className={styles.region} role="status" aria-live="polite">
      {notice && (
        <div key={notice.id} className={styles.toast} data-tone={notice.tone}>
          <span className={styles.badge}>
            {notice.tone === 'success' ? <CheckIcon className={styles.icon} /> : <AlertIcon className={styles.icon} />}
          </span>
          <div className={styles.text}>
            <p className={styles.title}>{notice.title}</p>
            <p className={styles.message}>{notice.message}</p>
          </div>
          <button type="button" className={styles.dismiss} onClick={onDismiss} aria-label="Dismiss">
            <CloseIcon className={styles.dismissIcon} />
          </button>
        </div>
      )}
    </div>
  );
};

export default Toast;
