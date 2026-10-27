import { useEffect, useRef, useState } from 'react';
import {
  Bell,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Clock,
  Cloud,
  HardDrive,
  Sparkles,
} from 'lucide-react';
import type { AppView } from '@/navigation';

type NotificationMenuProps = {
  dueCount?: number;
  connected?: boolean;
  onNavigate?: (view: AppView) => void;
};

const NotificationMenu = ({
  dueCount = 0,
  connected = false,
  onNavigate,
}: NotificationMenuProps) => {
  const menuRef = useRef<HTMLDetailsElement>(null);
  const [unread, setUnread] = useState(dueCount > 0);

  // Sync unread status when dueCount changes
  useEffect(() => {
    if (dueCount > 0) setUnread(true);
  }, [dueCount]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (menuRef.current?.open && !menuRef.current.contains(target)) {
        menuRef.current.removeAttribute('open');
      }
    };
    document.addEventListener('pointerdown', handleClickOutside);
    return () => document.removeEventListener('pointerdown', handleClickOutside);
  }, []);

  const handleOpen = () => {
    setUnread(false);
  };

  const handleAction = (view: AppView) => {
    if (menuRef.current?.open) {
      menuRef.current.removeAttribute('open');
    }
    onNavigate?.(view);
  };

  return (
    <details ref={menuRef} className="relative inline-block text-left">
      <summary
        className="list-none cursor-pointer inline-flex items-center justify-center relative h-9 w-9 rounded-xl border border-line bg-surface text-muted hover:text-text hover:bg-surface-soft hover:border-line-hover transition-all shadow-xs focus-visible:outline-2 focus-visible:outline-forest"
        aria-label="Thông báo"
        title="Thông báo hệ thống"
        onClick={handleOpen}
      >
        <Bell size={17} />
        {/* Unread indicator */}
        {unread && (
          <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-status-danger px-1 text-[10px] font-bold text-white shadow-xs animate-pulse">
            {dueCount > 99 ? '99+' : dueCount || '!'}
          </span>
        )}
      </summary>

      {/* Dropdown Menu Panel */}
      <div className="absolute right-0 mt-2 w-80 sm:w-88 rounded-2xl border border-line bg-surface p-4 shadow-dropdown z-30 animate-in fade-in slide-in-from-top-2 duration-150 text-text">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-line mb-3">
          <div className="flex items-center gap-2">
            <Bell size={16} className="text-forest" />
            <span className="text-sm font-bold text-text">Thông báo</span>
          </div>
          {dueCount > 0 ? (
            <span className="rounded-full bg-status-review-bg px-2 py-0.5 text-[11px] font-semibold text-status-review border border-status-review/25">
              {dueCount} bài đến hạn
            </span>
          ) : (
            <span className="rounded-full bg-status-learned-bg px-2 py-0.5 text-[11px] font-semibold text-status-learned border border-status-learned/25">
              Đã cập nhật
            </span>
          )}
        </div>

        {/* Notifications list */}
        <div className="space-y-2.5">
          {/* Due Review Notification */}
          {dueCount > 0 ? (
            <div className="group rounded-xl border border-status-review/25 bg-status-review-bg/50 p-3 transition-colors">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-status-review-bg text-status-review border border-status-review/30 mt-0.5">
                  <Clock size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-text">
                    Bài học đến hạn ôn tập
                  </h4>
                  <p className="mt-0.5 text-xs text-text-secondary leading-snug">
                    Hôm nay bạn có <strong>{dueCount}</strong> bài học cần ôn luyện để duy trì trí nhớ.
                  </p>
                  <button
                    type="button"
                    onClick={() => handleAction('exam-practice')}
                    className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-forest hover:underline"
                  >
                    <span>Luyện tập ngay</span>
                    <ChevronRight size={13} />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-line bg-surface-soft p-3">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-status-learned-bg text-status-learned border border-status-learned/30 mt-0.5">
                  <CheckCircle2 size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-text">
                    Đã hoàn thành ôn tập
                  </h4>
                  <p className="mt-0.5 text-xs text-text-secondary leading-snug">
                    Không có bài học nào đang đến hạn. Bạn có thể mở thư viện để thêm từ mới.
                  </p>
                  <button
                    type="button"
                    onClick={() => handleAction('lessons')}
                    className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-forest hover:underline"
                  >
                    <span>Xem thư viện bài học</span>
                    <ChevronRight size={13} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Backup & Storage Status Notification */}
          <div className="rounded-xl border border-line bg-surface-soft/60 p-3">
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-forest-soft text-forest border border-line mt-0.5">
                {connected ? <Cloud size={16} /> : <HardDrive size={16} />}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-bold text-text">
                  {connected ? 'Google Drive đã kết nối' : 'Lưu trữ cục bộ'}
                </h4>
                <p className="mt-0.5 text-xs text-text-secondary leading-snug">
                  {connected
                    ? 'Dữ liệu được sao lưu và đồng bộ lên tài khoản Google Drive cá nhân.'
                    : 'Bài học đang lưu trên trình duyệt này. Nhớ xuất file JSON để lưu giữ an toàn.'}
                </p>
                <button
                  type="button"
                  onClick={() => handleAction('backup')}
                  className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-forest hover:underline"
                >
                  <span>Quản lý sao lưu</span>
                  <ChevronRight size={13} />
                </button>
              </div>
            </div>
          </div>

          {/* Learning Tip */}
          <div className="rounded-xl border border-line bg-surface p-3 flex items-start gap-2.5">
            <Sparkles size={15} className="shrink-0 text-forest mt-0.5" />
            <p className="text-[11px] text-muted leading-relaxed">
              <strong>Mẹo:</strong> Luyện ngắt quãng (Spaced Repetition) với Flashcard mỗi ngày giúp ghi nhớ dài hạn bền vững nhất.
            </p>
          </div>
        </div>
      </div>
    </details>
  );
};

export default NotificationMenu;
