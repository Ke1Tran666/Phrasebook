import { ui } from '@/styles/ui';
import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

type ToastProps = {
  message: string;
  onMessageChange: (message: string) => void;
  duration?: number;
};

const Toast = ({ message, onMessageChange, duration = 5000 }: ToastProps) => {
  const [remainingMs, setRemainingMs] = useState(duration);
  const remaining = Math.ceil(remainingMs / 1000);
  const progress = duration > 0 ? Math.min(1, remainingMs / duration) : 0;

  useEffect(() => {
    if (!message) return;
    const expiresAt = Date.now() + duration;
    setRemainingMs(Math.max(0, duration));
    const interval = setInterval(() => {
      setRemainingMs(Math.max(0, expiresAt - Date.now()));
    }, 100);
    const timer = setTimeout(() => onMessageChange(''), duration);
    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [message, duration, onMessageChange]);

  if (!message) return null;

  return (
    <div className={ui('toast')}>
      <span role="status" aria-atomic="true">
        {message}
      </span>
      <span
        className="relative grid size-8 shrink-0 place-items-center text-xs tabular-nums text-[#cbdbc9]"
        role="timer"
        aria-label={'Còn ' + remaining + ' giây'}
        aria-live="off"
      >
        <svg
          viewBox="0 0 32 32"
          className="absolute inset-0 size-full -rotate-90"
          aria-hidden="true"
        >
          <circle
            cx="16"
            cy="16"
            r="14"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            opacity="0.2"
          />
          <circle
            cx="16"
            cy="16"
            r="14"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            pathLength="100"
            strokeDasharray="100"
            strokeDashoffset={100 * (1 - progress)}
          />
        </svg>
        <span aria-hidden="true">{remaining}</span>
      </span>
      <button
        type="button"
        className={ui('icon-button')}
        aria-label="Đóng thông báo"
        onClick={() => onMessageChange('')}
      >
        <X size={17} />
      </button>
    </div>
  );
};

export default Toast;
