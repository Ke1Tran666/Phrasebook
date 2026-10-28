import { useEffect, useRef, useState } from 'react';
import {
  Bell,
  BookOpen,
  CheckCheck,
  ChevronRight,
  Clock,
  Cloud,
  FileText,
  HardDrive,
  Pencil,
  Plus,
  Rocket,
  Sparkles,
  Trash2,
} from 'lucide-react';
import type { AppView } from '@/navigation';
import {
  formatRelativeTime,
  clearActivities,
  getActivities,
  type ActivityItem,
} from '@/services/activity-log';
import {
  CURRENT_VERSION,
  getAllReleases,
  hasUnseenRelease,
  markReleaseAsSeen,
  type ReleaseNote,
} from '@/data/changelog';

type NotificationMenuProps = {
  dueCount?: number;
  connected?: boolean;
  isAdmin?: boolean;
  onNavigate?: (view: AppView) => void;
};

const NotificationMenu = ({
  dueCount = 0,
  connected = false,
  isAdmin = false,
  onNavigate,
}: NotificationMenuProps) => {
  const menuRef = useRef<HTMLDetailsElement>(null);
  const [activeTab, setActiveTab] = useState<'activity' | 'updates'>('activity');
  const [expandedVersion, setExpandedVersion] = useState<string | null>('2.1.0');
  const [activities, setActivities] = useState<ActivityItem[]>(getActivities);
  const [releasesList, setReleasesList] = useState<ReleaseNote[]>(getAllReleases);

  // Lắng nghe sự kiện ghi nhận hoạt động mới & cập nhật phiên bản theo thời gian thực
  useEffect(() => {
    const handleActivityUpdate = () => {
      setActivities(getActivities());
    };
    const handleUpdatesChange = () => {
      setReleasesList(getAllReleases());
    };
    window.addEventListener('phrasebook_activity_logged', handleActivityUpdate);
    window.addEventListener('phrasebook_updates_changed', handleUpdatesChange);
    return () => {
      window.removeEventListener(
        'phrasebook_activity_logged',
        handleActivityUpdate,
      );
      window.removeEventListener(
        'phrasebook_updates_changed',
        handleUpdatesChange,
      );
    };
  }, []);

  // Kiểm tra xem người dùng đã đọc bản cập nhật phần mềm mới nhất chưa
  const [hasNewUpdate, setHasNewUpdate] = useState(hasUnseenRelease);

  const [hasUnreadActivity, setHasUnreadActivity] = useState(
    dueCount > 0 || activities.length > 0,
  );

  useEffect(() => {
    if (dueCount > 0) setHasUnreadActivity(true);
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
    return () =>
      document.removeEventListener('pointerdown', handleClickOutside);
  }, []);

  const handleOpen = () => {
    setHasUnreadActivity(false);
    setActivities(getActivities());
    setReleasesList(getAllReleases());
  };

  const handleSwitchToUpdates = () => {
    setActiveTab('updates');
    markReleaseAsSeen();
    setHasNewUpdate(false);
  };

  const handleAction = (view: AppView) => {
    if (menuRef.current?.open) {
      menuRef.current.removeAttribute('open');
    }
    onNavigate?.(view);
  };

  const toggleExpand = (ver: string) => {
    setExpandedVersion((curr) => (curr === ver ? null : ver));
  };

  // Tổng trạng thái thông báo chưa đọc
  const hasUnread = (dueCount > 0 && hasUnreadActivity) || hasNewUpdate;

  // Icon theo từng loại hoạt động
  const getActivityIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'lesson_added':
        return (
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-status-learned-bg text-status-learned border border-status-learned/30 mt-0.5">
            <Plus size={16} />
          </div>
        );
      case 'lesson_updated':
        return (
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-status-info-bg text-status-info border border-status-info/30 mt-0.5">
            <Pencil size={15} />
          </div>
        );
      case 'lesson_deleted':
        return (
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-status-danger-bg text-status-danger border border-status-danger/30 mt-0.5">
            <Trash2 size={15} />
          </div>
        );
      case 'review_completed':
        return (
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-forest-soft text-forest border border-forest/30 mt-0.5">
            <CheckCheck size={16} />
          </div>
        );
      case 'backup_exported':
        return (
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface text-text border border-line mt-0.5">
            {connected ? <Cloud size={16} /> : <HardDrive size={16} />}
          </div>
        );
      case 'backup_imported':
        return (
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface text-forest border border-line mt-0.5">
            <BookOpen size={16} />
          </div>
        );
      default:
        return (
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface-soft text-muted border border-line mt-0.5">
            <Clock size={16} />
          </div>
        );
    }
  };

  return (
    <details ref={menuRef} className="relative inline-block text-left">
      <summary
        onClick={handleOpen}
        aria-label="Thông báo & Hoạt động"
        className="relative flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl border border-line bg-surface text-text-secondary transition-colors hover:bg-surface-soft hover:text-text list-none [&::-webkit-details-marker]:hidden"
      >
        <Bell size={17} />
        {/* Unread indicator */}
        {hasUnread && (
          <span
            className={`absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full text-[10px] font-bold text-white shadow-xs leading-none select-none ${
              dueCount > 0 ? 'bg-status-danger px-1' : 'bg-forest px-1'
            }`}
          >
            {dueCount > 0 ? (
              <span className="inline-block translate-y-[0.5px] leading-none">
                {dueCount > 99 ? '99+' : dueCount}
              </span>
            ) : (
              <span className="h-1.5 w-1.5 rounded-full bg-white" />
            )}
          </span>
        )}
      </summary>

      {/* Dropdown Menu Panel */}
      <div className="absolute right-0 mt-2 w-88 sm:w-96 max-w-[calc(100vw-24px)] rounded-2xl border border-line bg-surface p-4 shadow-dropdown z-30 animate-in fade-in slide-in-from-top-2 duration-150 text-text">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-line mb-3">
          <div className="flex items-center gap-2">
            <Bell size={16} className="text-forest" />
            <span className="text-sm font-bold text-text">Thông báo</span>
          </div>

          <span className="text-[11px] font-medium text-muted">
            Phrasebook {CURRENT_VERSION}
          </span>
        </div>

        {/* Bộ chuyển đổi 2 làn thông báo (Hiển thị cho tất cả người dùng) */}
        <div className="flex rounded-xl bg-surface-soft p-1 border border-line mb-3">
          <button
            type="button"
            onClick={() => setActiveTab('activity')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
              activeTab === 'activity'
                ? 'bg-surface text-forest shadow-xs'
                : 'text-muted hover:text-text'
            }`}
          >
            <Clock size={13} className="shrink-0" />
            <span>Hoạt động</span>
            {dueCount > 0 && (
              <span className="h-1.5 w-1.5 rounded-full bg-status-danger animate-pulse shrink-0" />
            )}
          </button>

          <button
            type="button"
            onClick={handleSwitchToUpdates}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
              activeTab === 'updates'
                ? 'bg-surface text-forest shadow-xs'
                : 'text-muted hover:text-text'
            }`}
          >
            <Rocket size={13} className="shrink-0" />
            <span>Cập nhật</span>
            {hasNewUpdate && (
              <span className="rounded-full bg-forest text-white text-[9px] font-bold px-1.5 py-0.5 leading-none shrink-0">
                Mới
              </span>
            )}
          </button>
        </div>

        {/* Làn 1: Hoạt động học tập cá nhân & Lịch sử hoạt động thật */}
        {activeTab === 'activity' && (
          <div className="space-y-2.5 max-h-84 overflow-y-auto pr-0.5 animate-in fade-in duration-150">
            {/* Nhắc nhở bài học đến hạn (Ghim lên đầu nếu có) */}
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
            ) : null}

            {/* Danh sách các hoạt động thực tế vừa diễn ra */}
            {activities.length > 0 ? (
              <>
                <div className="flex items-center justify-between pt-1 px-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-muted">
                    Hoạt động gần đây ({activities.length})
                  </span>
                  <button
                    type="button"
                    onClick={clearActivities}
                    className="text-[11px] text-muted hover:text-status-danger transition-colors"
                  >
                    Xóa nhật ký
                  </button>
                </div>

                {activities.map((act) => (
                  <div
                    key={act.id}
                    className="rounded-xl border border-line bg-surface-soft/60 p-3 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      {getActivityIcon(act.type)}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <h4 className="text-xs font-bold text-text">
                            {act.title}
                          </h4>
                          <span className="text-[10px] text-muted shrink-0">
                            {formatRelativeTime(act.timestamp)}
                          </span>
                        </div>
                        {act.description && (
                          <p className="mt-0.5 text-xs text-text-secondary line-clamp-2 leading-relaxed">
                            {act.description}
                          </p>
                        )}
                        {act.view && (
                          <button
                            type="button"
                            onClick={() => handleAction(act.view!)}
                            className="mt-1.5 inline-flex items-center gap-1 text-xs font-bold text-forest hover:underline"
                          >
                            <span>{act.linkText || 'Xem chi tiết'}</span>
                            <ChevronRight size={13} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <div className="rounded-xl border border-dashed border-line p-6 text-center text-muted">
                <FileText size={24} className="mx-auto mb-2 opacity-50" />
                <p className="text-xs font-medium">Chưa có hoạt động nào được ghi nhận.</p>
                <p className="text-[11px] mt-0.5 opacity-80">
                  Các thao tác thêm bài, sửa, ôn tập và sao lưu sẽ tự động ghi nhật ký tại đây.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Làn 2: Cập nhật phần mềm (Mọi người đều xem được nội dung phát hành) */}
        {activeTab === 'updates' && (
          <div className="space-y-2.5 max-h-84 overflow-y-auto pr-0.5 animate-in fade-in duration-150">
            {releasesList.map((update) => {
              const isExpanded = expandedVersion === update.version;

              return (
                <div
                  key={update.version}
                  className={`rounded-xl border p-3 transition-colors ${
                    update.isNew
                      ? 'border-forest/30 bg-forest-soft/40'
                      : 'border-line bg-surface-soft/60'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border mt-0.5 ${
                        update.isNew
                          ? 'bg-forest text-white border-forest shadow-xs'
                          : 'bg-forest-soft text-forest border-line'
                      }`}
                    >
                      {update.isNew ? (
                        <Rocket size={16} />
                      ) : update.displayVersion === 'v2.0' ? (
                        <Sparkles size={16} />
                      ) : (
                        <Cloud size={16} />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h4 className="text-xs font-bold text-text">
                          {update.title}
                        </h4>
                        {update.isNew && (
                          <span className="rounded-full bg-status-learned-bg px-2 py-0.5 text-[9px] font-bold text-status-learned border border-status-learned/25">
                            Mới
                          </span>
                        )}
                        {update.isCustom && (
                          <span className="rounded-full bg-forest-soft text-forest px-2 py-0.5 text-[9px] font-bold border border-forest/20">
                            Tự tạo
                          </span>
                        )}
                      </div>

                      <p className="mt-0.5 text-xs text-text-secondary leading-snug">
                        {update.summary}
                      </p>

                      {isExpanded && (
                        <ul className="mt-2 pt-2 border-t border-line/60 space-y-1.5 text-[11px] text-text-secondary animate-in fade-in duration-100">
                          {update.highlights.map((h, i) => (
                            <li key={i} className="flex items-start gap-1.5 leading-snug">
                              <span className="text-forest font-bold mt-0.5">•</span>
                              <span>{h}</span>
                            </li>
                          ))}
                        </ul>
                      )}

                      <button
                        type="button"
                        onClick={() => toggleExpand(update.version)}
                        className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-forest hover:underline"
                      >
                        <span>{isExpanded ? 'Thu gọn' : 'Xem chi tiết'}</span>
                        <ChevronRight
                          size={13}
                          className={`transition-transform duration-150 ${
                            isExpanded ? 'rotate-90' : ''
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Nút chuyển đến Trang Cập nhật */}
            <button
              type="button"
              onClick={() => handleAction('updates')}
              className="w-full mt-2.5 py-2.5 px-3 rounded-xl border border-line bg-surface hover:bg-surface-soft hover:border-forest/40 text-xs font-bold text-forest flex items-center justify-center gap-1.5 transition-all shadow-xs"
            >
              <Rocket size={14} />
              <span>
                {isAdmin
                  ? 'Xem trang Cập nhật & Viết nội dung'
                  : 'Xem tất cả bản cập nhật'}
              </span>
              <ChevronRight size={13} />
            </button>
          </div>
        )}
      </div>
    </details>
  );
};

export default NotificationMenu;