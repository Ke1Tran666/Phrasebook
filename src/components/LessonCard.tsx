import { useEffect, useRef, useState } from 'react';
import {
  Bookmark,
  Check,
  CircleDot,
  FileText,
  Highlighter,
  Layers,
  MoreHorizontal,
  Pencil,
  Trash2,
  Volume2,
} from 'lucide-react';
import { type Lesson, type Status } from '@/db';
import LessonDates from '@/components/LessonDates';
import { useLanguage, type MessageKey } from '@/language';

const statusKeys: Record<Status, MessageKey> = {
  new: 'status.new',
  review: 'status.review',
  learned: 'status.learned',
};

type LessonCardProps = {
  lesson: Lesson;
  onSelect: (id: string) => void;
  onEdit?: (lesson: Lesson) => void;
  onDelete?: (lesson: Lesson) => void;
  onStatusChange?: (id: string, status: Status) => void;
};

const LessonCard = ({
  lesson: l,
  onSelect,
  onEdit,
  onDelete,
  onStatusChange,
}: LessonCardProps) => {
  const { t } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Click outside listener for the quick actions menu
  useEffect(() => {
    if (!menuOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('pointerdown', handleClickOutside);
    return () => document.removeEventListener('pointerdown', handleClickOutside);
  }, [menuOpen]);

  // Quick text-to-speech audio
  const handlePlayAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(l.english.trim());
    utterance.lang = 'en-US';
    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);
    window.speechSynthesis.speak(utterance);
  };

  const getStatusBadge = () => {
    switch (l.status) {
      case 'learned':
        return {
          icon: Check,
          className:
            'bg-status-learned-bg text-status-learned border border-status-learned/25',
        };
      case 'review':
        return {
          icon: Bookmark,
          className:
            'bg-status-review-bg text-status-review border border-status-review/25',
        };
      case 'new':
      default:
        return {
          icon: CircleDot,
          className: 'bg-status-new-bg text-status-new border border-line',
        };
    }
  };

  const statusBadge = getStatusBadge();
  const StatusIcon = statusBadge.icon;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onSelect(l.id)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(l.id);
        }
      }}
      className="group relative flex min-h-[250px] flex-col rounded-2xl border border-line bg-surface p-5 text-left shadow-xs transition-all duration-200 hover:-translate-y-1 hover:border-line-hover hover:shadow-card cursor-pointer select-none"
    >
      {/* Header Thẻ: Loại bài học + Nút Nghe + Menu tác vụ nhanh */}
      <div className="mb-3.5 flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted">
          {l.type === 'structure' ? (
            <Layers size={15} className="text-forest" />
          ) : l.type === 'phrase' ? (
            <Bookmark size={15} className="text-forest" />
          ) : (
            <FileText size={15} className="text-status-info" />
          )}
          <span>
            {l.type === 'structure'
              ? t('lesson.structure')
              : l.type === 'phrase'
                ? t('lesson.phrase')
                : t('lesson.passage')}
          </span>
        </span>

        <div className="flex items-center gap-1">
          {/* Nút phát âm nhanh 1-click */}
          <button
            type="button"
            onClick={handlePlayAudio}
            aria-label="Nghe phát âm"
            title="Nghe phát âm"
            className={`grid size-8 place-items-center rounded-xl transition-colors ${
              isPlaying
                ? 'bg-forest text-white'
                : 'text-muted hover:bg-surface-soft hover:text-forest'
            }`}
          >
            <Volume2 size={16} />
          </button>

          {/* Nút menu tác vụ nhanh */}
          <div ref={menuRef} className="relative">
            <button
              type="button"
              aria-label="Tùy chọn bài học"
              aria-expanded={menuOpen}
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpen((prev) => !prev);
              }}
              className="grid size-8 place-items-center rounded-xl text-muted transition-colors hover:bg-surface-soft hover:text-text"
            >
              <MoreHorizontal size={18} />
            </button>

            {menuOpen && (
              <div
                onClick={(e) => e.stopPropagation()}
                className="absolute right-0 top-full z-30 mt-1.5 w-44 rounded-2xl border border-line bg-surface-elevated p-1.5 shadow-dropdown backdrop-blur-md animate-in fade-in-0 zoom-in-95 duration-100"
              >
                <button
                  type="button"
                  onClick={handlePlayAudio}
                  className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-text transition-colors hover:bg-surface-soft"
                >
                  <Volume2 size={14} className="text-forest" />
                  <span>Nghe phát âm</span>
                </button>

                {onEdit && (
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      onEdit(l);
                    }}
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-text transition-colors hover:bg-surface-soft"
                  >
                    <Pencil size={14} className="text-muted" />
                    <span>{t('common.edit')}</span>
                  </button>
                )}

                {onStatusChange && (
                  <div className="my-1 border-t border-line/60 pt-1">
                    <span className="block px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-muted">
                      Đổi trạng thái
                    </span>
                    {(['new', 'review', 'learned'] as Status[]).map(
                      (statusItem) => (
                        <button
                          key={statusItem}
                          type="button"
                          onClick={() => {
                            setMenuOpen(false);
                            onStatusChange(l.id, statusItem);
                          }}
                          className={`flex w-full items-center justify-between rounded-xl px-3 py-1.5 text-xs transition-colors ${
                            l.status === statusItem
                              ? 'bg-surface-soft font-bold text-forest'
                              : 'text-text hover:bg-surface-soft'
                          }`}
                        >
                          <span>{t(statusKeys[statusItem])}</span>
                          {l.status === statusItem && <Check size={13} />}
                        </button>
                      ),
                    )}
                  </div>
                )}

                {onDelete && (
                  <div className="mt-1 border-t border-line/60 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setMenuOpen(false);
                        onDelete(l);
                      }}
                      className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-status-danger transition-colors hover:bg-status-danger-bg"
                    >
                      <Trash2 size={14} />
                      <span>{t('detail.deleteLesson')}</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Nội dung chính: Câu tiếng Anh */}
      <h2
        className={`font-sans font-bold leading-snug tracking-tight text-text line-clamp-3 break-words transition-colors group-hover:text-forest ${
          l.type === 'passage' ? 'text-base sm:text-lg' : 'text-xl'
        }`}
      >
        {l.english}
      </h2>

      {/* Bản dịch tiếng Việt */}
      <p className="mt-2 line-clamp-2 text-xs sm:text-sm leading-relaxed text-text-secondary">
        {l.meaning || t('lesson.noTranslation')}
      </p>

      {/* Highlights nếu có */}
      {l.highlights.length > 0 && (
        <div className="mt-3 flex items-center gap-1.5 rounded-lg bg-forest-soft px-2.5 py-1 text-[11px] font-semibold text-forest w-fit">
          <Highlighter size={13} />
          <span>
            {l.highlights.length} {t('lesson.highlightCount')}
          </span>
        </div>
      )}

      {/* Ngày thêm / sửa */}
      <div className="mt-3">
        <LessonDates lesson={l} compact />
      </div>

      {/* Footer: Chủ đề + Trạng thái */}
      <div className="mt-auto flex items-center justify-between gap-2 border-t border-line/60 pt-3.5">
        <span className="inline-flex max-w-[140px] truncate rounded-lg border border-line bg-surface-soft px-2.5 py-1 text-xs font-medium text-muted">
          {l.topic || t('common.uncategorized')}
        </span>
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusBadge.className}`}
        >
          <StatusIcon size={13} />
          <span>{t(statusKeys[l.status])}</span>
        </span>
      </div>
    </div>
  );
};

export default LessonCard;
