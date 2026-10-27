import { useEffect, useRef, useState } from 'react';
import {
  Bell,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Clock,
  Cloud,
  HardDrive,
  Rocket,
  Sparkles,
  Tag,
} from 'lucide-react';
import type { AppView } from '@/navigation';

type NotificationMenuProps = {
  dueCount?: number;
  connected?: boolean;
  onNavigate?: (view: AppView) => void;
};

// Dữ liệu tĩnh các bản cập nhật phần mềm (Release Notes / Changelog)
const SOFTWARE_VERSION = 'v2.1';
const SOFTWARE_UPDATES = [
  {
    version: 'v2.1',
    date: 'Mới nhất',
    title: 'Hệ thống thông báo 2 làn & Toast thông minh',
    isNew: true,
    highlights: [
      'Phân tách 2 luồng thông báo: Hoạt động học tập cá nhân & Bản cập nhật phần mềm.',
      'Toast thông báo nổi cao cấp với chế độ tạm dừng đếm ngược khi rê chuột (Hover-to-Pause).',
      'Tự động phân loại màu sắc và biểu tượng trực quan: Thành công, Lỗi và Thông tin.',
    ],
  },
  {
    version: 'v2.0',
    date: 'Tháng 10, 2026',
    title: 'Đại tu giao diện & Trải nghiệm toàn diện',
    isNew: false,
    highlights: [
      'Chuẩn hóa Style System & Design Tokens với 3 chủ đề: Sáng, Tối và Lễ Độc lập.',
      'Phòng Flashcard 3D với bảng điểm trực tiếp, phím tắt nhanh và chúc mừng hoàn thành.',
      'Thư viện 2 chế độ hiển thị: Dạng lưới (Grid) & Danh sách (List) kèm phát âm 1-chạm.',
      'Hộp soạn thảo bài học với thanh công cụ tô sáng từ vựng động & xem trước trực tiếp.',
      'Trang Sao lưu Google Drive & vùng kéo thả JSON an toàn.',
    ],
  },
  {
    version: 'v1.5',
    date: 'Tháng 9, 2026',
    title: 'Gợi ý cấu trúc câu & Đám mây Google Drive',
    isNew: false,
    highlights: [
      'Tự động nhận diện cấu trúc câu đã lưu trong đoạn văn khi nhập liệu.',
      'Sao lưu đa thiết bị qua Google Drive AppData Folder an toàn.',
    ],
  },
];

const NotificationMenu = ({
  dueCount = 0,
  connected = false,
  onNavigate,
}: NotificationMenuProps) => {
  const menuRef = useRef<HTMLDetailsElement>(null);
  const [activeTab, setActiveTab] = useState<'activity' | 'updates'>('activity');

  // Kiểm tra xem người dùng đã đọc bản cập nhật phần mềm mới nhất chưa
  const [hasNewUpdate, setHasNewUpdate] = useState(() => {
    try {
      return (
        localStorage.getItem('phrasebook_last_seen_version') !==
        SOFTWARE_VERSION
      );
    } catch {
      return true;
    }
  });

  const [hasUnreadActivity, setHasUnreadActivity] = useState(dueCount > 0);

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
  };

  const handleSwitchToUpdates = () => {
    setActiveTab('updates');
    try {
      localStorage.setItem('phrasebook_last_seen_version', SOFTWARE_VERSION);
      setHasNewUpdate(false);
    } catch {
      // ignore
    }
  };

  const handleAction = (view: AppView) => {
    if (menuRef.current?.open) {
      menuRef.current.removeAttribute('open');
    }
    onNavigate?.(view);
  };

  // Tổng trạng thái thông báo chưa đọc
  const hasUnread = (dueCount > 0 && hasUnreadActivity) || hasNewUpdate;

  return (
    <details ref={menuRef} className="relative inline-block text-left">
      <summary
        className="list-none cursor-pointer inline-flex items-center justify-center relative h-9 w-9 rounded-xl border border-line bg-surface text-muted hover:text-text hover:bg-surface-soft hover:border-line-hover transition-all shadow-xs focus-visible:outline-2 focus-visible:outline-forest"
        aria-label="Thông báo"
        title="Thông báo hệ thống & Cập nhật"
        onClick={handleOpen}
      >
        <Bell size={17} />
        {/* Unread indicator */}
        {hasUnread && (
          <span
            className={`absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full text-[10px] font-bold text-white shadow-xs animate-pulse ${
              dueCount > 0 ? 'bg-status-danger px-1' : 'bg-forest px-1.5'
            }`}
          >
            {dueCount > 0 ? (dueCount > 99 ? '99+' : dueCount) : '•'}
          </span>
        )}
      </summary>

      {/* Dropdown Menu Panel */}
      <div className="absolute right-0 mt-2 w-84 sm:w-92 rounded-2xl border border-line bg-surface p-4 shadow-dropdown z-30 animate-in fade-in slide-in-from-top-2 duration-150 text-text">
        {/* Header với 2 tab phân loại */}
        <div className="flex items-center justify-between pb-3 border-b border-line mb-3">
          <div className="flex items-center gap-2">
            <Bell size={16} className="text-forest" />
            <span className="text-sm font-bold text-text">Thông báo</span>
          </div>

          <span className="text-[11px] font-medium text-muted">
            Phrasebook {SOFTWARE_VERSION}
          </span>
        </div>

        {/* Bộ chuyển đổi 2 làn thông báo */}
        <div className="flex rounded-xl bg-surface-soft p-1 border border-line mb-3">
          <button
            type="button"
            onClick={() => setActiveTab('activity')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'activity'
                ? 'bg-surface text-forest shadow-xs'
                : 'text-muted hover:text-text'
            }`}
          >
            <Clock size={13} />
            <span>Hoạt động</span>
            {dueCount > 0 && (
              <span className="h-1.5 w-1.5 rounded-full bg-status-danger animate-pulse" />
            )}
          </button>

          <button
            type="button"
            onClick={handleSwitchToUpdates}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'updates'
                ? 'bg-surface text-forest shadow-xs'
                : 'text-muted hover:text-text'
            }`}
          >
            <Rocket size={13} />
            <span>Cập nhật phần mềm</span>
            {hasNewUpdate && (
              <span className="rounded-full bg-forest text-white text-[9px] font-bold px-1.5 py-0.5 leading-none">
                Mới
              </span>
            )}
          </button>
        </div>

        {/* Làn 1: Hoạt động học tập cá nhân */}
        {activeTab === 'activity' && (
          <div className="space-y-2.5 animate-in fade-in duration-150">
            {/* Nhắc nhở bài học đến hạn */}
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

            {/* Trạng thái sao lưu & an toàn dữ liệu */}
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

            {/* Mẹo học tập */}
            <div className="rounded-xl border border-line bg-surface p-3 flex items-start gap-2.5">
              <Sparkles size={15} className="shrink-0 text-forest mt-0.5" />
              <p className="text-[11px] text-muted leading-relaxed">
                <strong>Mẹo:</strong> Luyện ngắt quãng (Spaced Repetition) với Flashcard mỗi ngày giúp ghi nhớ dài hạn bền vững nhất.
              </p>
            </div>
          </div>
        )}

        {/* Làn 2: Thông báo cập nhật phần mềm (Tĩnh) */}
        {activeTab === 'updates' && (
          <div className="space-y-3 max-h-80 overflow-y-auto pr-1 animate-in fade-in duration-150">
            {SOFTWARE_UPDATES.map((update) => (
              <div
                key={update.version}
                className={`rounded-xl border p-3.5 transition-colors ${
                  update.isNew
                    ? 'border-forest/30 bg-forest-soft/30'
                    : 'border-line bg-surface-soft/60'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`font-mono text-xs font-bold px-2 py-0.5 rounded-md ${
                        update.isNew
                          ? 'bg-forest text-white shadow-xs'
                          : 'bg-surface text-text-secondary border border-line'
                      }`}
                    >
                      {update.version}
                    </span>
                    {update.isNew && (
                      <span className="rounded-full bg-status-learned-bg px-2 py-0.5 text-[10px] font-bold text-status-learned border border-status-learned/25">
                        Mới
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-muted">{update.date}</span>
                </div>

                <h4 className="mt-2 text-xs font-bold text-text">
                  {update.title}
                </h4>

                <ul className="mt-2 space-y-1.5 text-[11px] text-text-secondary">
                  {update.highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-1.5 leading-snug">
                      <span className="text-forest mt-0.5">•</span>
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </details>
  );
};

export default NotificationMenu;
