import { useEffect, useState, useRef } from 'react';
import { X, CheckCircle2, AlertCircle, Info } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

type ToastProps = {
  message: string;
  onMessageChange: (message: string) => void;
  duration?: number;
  type?: ToastType;
};

const detectToastType = (msg: string): ToastType => {
  if (/lỗi|không thể|thất bại|error|chưa lưu|hết hạn/i.test(msg)) {
    return 'error';
  }
  if (/đã|thành công|hoàn thành|success|bảo toàn/i.test(msg)) {
    return 'success';
  }
  return 'info';
};

const Toast = ({
  message,
  onMessageChange,
  duration = 5000,
  type,
}: ToastProps) => {
  const [remainingMs, setRemainingMs] = useState(duration);
  const [isHovered, setIsHovered] = useState(false);
  const isHoveredRef = useRef(false);
  isHoveredRef.current = isHovered;

  const toastType = type || detectToastType(message);
  const remaining = Math.ceil(remainingMs / 1000);
  const progress = duration > 0 ? Math.min(1, remainingMs / duration) : 0;

  useEffect(() => {
    if (!message) return;

    setRemainingMs(duration);
    let currentRemaining = duration;

    const interval = setInterval(() => {
      // Pause countdown while user hovers over toast
      if (!isHoveredRef.current) {
        currentRemaining = Math.max(0, currentRemaining - 100);
        setRemainingMs(currentRemaining);

        if (currentRemaining <= 0) {
          clearInterval(interval);
          onMessageChange('');
        }
      }
    }, 100);

    return () => clearInterval(interval);
  }, [message, duration, onMessageChange]);

  if (!message) return null;

  // Semantic styles based on toast variant
  const variantStyles = {
    success: {
      border: 'border-status-learned/35',
      iconBg: 'bg-status-learned-bg text-status-learned',
      timerColor: 'text-status-learned',
      icon: <CheckCircle2 size={18} className="shrink-0" />,
    },
    error: {
      border: 'border-status-danger/35',
      iconBg: 'bg-status-danger-bg text-status-danger',
      timerColor: 'text-status-danger',
      icon: <AlertCircle size={18} className="shrink-0" />,
    },
    info: {
      border: 'border-forest/30',
      iconBg: 'bg-forest-soft text-forest',
      timerColor: 'text-forest',
      icon: <Info size={18} className="shrink-0" />,
    },
  }[toastType];

  return (
    <div
      className={`fixed bottom-5 sm:bottom-6 right-4 sm:right-6 z-50 flex items-center gap-3.5 rounded-2xl border bg-surface/95 px-4 py-3 sm:px-5 sm:py-3.5 shadow-dropdown backdrop-blur-md max-w-[calc(100vw-32px)] sm:max-w-md transition-all duration-300 animate-in fade-in slide-in-from-bottom-5 ${variantStyles.border}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="status"
      aria-live="polite"
    >
      {/* Icon badge */}
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${variantStyles.iconBg}`}
      >
        {variantStyles.icon}
      </div>

      {/* Message content */}
      <span
        className="text-xs sm:text-sm font-medium leading-relaxed text-text flex-1 min-w-0 break-words"
        role="status"
        aria-atomic="true"
      >
        {message}
      </span>

      {/* Circular Countdown Timer (paused on hover) */}
      <span
        className={`relative grid size-8 shrink-0 place-items-center text-xs tabular-nums select-none ${variantStyles.timerColor}`}
        role="timer"
        aria-label={`Còn ${remaining} giây`}
        title={isHovered ? 'Đang tạm dừng' : `Tự đóng sau ${remaining}s`}
      >
        <svg
          viewBox="0 0 32 32"
          className="absolute inset-0 size-full -rotate-90"
          aria-hidden="true"
        >
          <circle
            cx="16"
            cy="16"
            r="13.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            opacity="0.15"
          />
          <circle
            cx="16"
            cy="16"
            r="13.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            pathLength="100"
            strokeDasharray="100"
            strokeDashoffset={100 * (1 - progress)}
            className="transition-all duration-100 ease-linear"
          />
        </svg>
        <span className="font-bold text-[10px]" aria-hidden="true">
          {remaining}
        </span>
      </span>

      {/* Close button */}
      <button
        type="button"
        className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-muted hover:bg-surface-soft hover:text-text transition-colors"
        aria-label="Đóng thông báo"
        onClick={() => onMessageChange('')}
      >
        <X size={16} />
      </button>
    </div>
  );
};

export default Toast;
