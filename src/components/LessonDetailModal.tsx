import English from '@/components/English';
import LessonDates from '@/components/LessonDates';
import ListenButton from '@/components/ListenButton';
import Modal from '@/components/Modal';
import StructureSuggestions from '@/components/StructureSuggestions';
import type { Lesson } from '@/db';
import { useLanguage } from '@/language';
import { ui } from '@/styles/ui';
import { Bookmark, Check, CircleDot, Pencil, Trash2, X } from 'lucide-react';

interface LessonDetailModalProps {
  detail: Lesson | null | undefined;
  savedStructures: Lesson[];
  onClose: () => void;
  onEdit: (lesson: Lesson) => void;
  onDelete: (lesson: Lesson) => void;
}

export const LessonDetailModal = ({
  detail,
  savedStructures,
  onClose,
  onEdit,
  onDelete,
}: LessonDetailModalProps) => {
  const { t } = useLanguage();

  if (!detail) return null;

  // Cấu hình hiển thị Badge trạng thái (Read-only) bằng Design Tokens chuẩn
  const getStatusBadge = () => {
    switch (detail.status) {
      case 'learned':
        return {
          label: t('status.learned'),
          icon: Check,
          className:
            'bg-status-learned-bg text-status-learned border-status-learned/25',
        };
      case 'review':
        return {
          label: t('status.review'),
          icon: Bookmark,
          className:
            'bg-status-review-bg text-status-review border-status-review/25',
        };
      case 'new':
      default:
        return {
          label: t('status.new'),
          icon: CircleDot,
          className: 'bg-status-new-bg text-status-new border-line',
        };
    }
  };

  const statusBadge = getStatusBadge();
  const StatusIcon = statusBadge.icon;

  return (
    <Modal open={!!detail} label={t('detail.label')} onClose={onClose} wide>
      <div className={ui('modal-heading')}>
        <div>
          <span className={ui('eyebrow')}>
            {detail.type === 'structure'
              ? t('lesson.structure').toLocaleUpperCase()
              : detail.type === 'phrase'
                ? t('lesson.phrase').toLocaleUpperCase()
                : t('lesson.passage').toLocaleUpperCase()}
          </span>
          <span className={ui('detail-topic')}>
            {detail.topic || t('common.uncategorized')}
          </span>
        </div>
        <button
          className={ui('icon-button')}
          aria-label={t('common.close')}
          onClick={onClose}
        >
          <X />
        </button>
      </div>

      <div className={ui('detail-body')}>
        <h2 className={ui('detail-english')}>
          <English lesson={detail} />
        </h2>

        <div className="my-3">
          <ListenButton key={detail.id} text={detail.english} />
        </div>

        {detail.type !== 'structure' && (
          <StructureSuggestions
            english={detail.english}
            structures={savedStructures}
          />
        )}

        <div className={ui('detail-section')}>
          <span className={ui('eyebrow')}>{t('detail.meaning')}</span>
          <p>{detail.meaning || t('detail.noTranslation')}</p>
        </div>

        {detail.highlights.length > 0 && (
          <div className={ui('detail-section')}>
            <span className={ui('eyebrow')}>{t('detail.highlights')}</span>
            {detail.highlights.map((h, i) => (
              <div className={ui('phrase-row')} key={i}>
                <strong>{h.text}</strong>
                <p>{h.meaning || t('review.noNote')}</p>
              </div>
            ))}
          </div>
        )}

        {detail.notes && (
          <div className={ui('detail-section notes-box')}>
            <span className={ui('eyebrow')}>{t('detail.notes')}</span>
            <p>{detail.notes}</p>
          </div>
        )}

        <div className={ui('detail-section')}>
          <span className={ui('eyebrow')}>{t('detail.history')}</span>
          <LessonDates lesson={detail} />
        </div>

        {/* Trạng thái học: Hiển thị dạng Badge chỉ đọc */}
        <div className="flex items-center justify-between pt-4 mt-6 border-t border-line">
          <span className="text-sm font-semibold text-muted">
            {t('detail.status')}
          </span>
          <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${statusBadge.className}`}
          >
            <StatusIcon size={14} />
            {statusBadge.label}
          </span>
        </div>
      </div>

      <footer className={ui('modal-footer')}>
        <button
          className={ui('text-button danger')}
          onClick={() => onDelete(detail)}
        >
          <Trash2 size={16} /> {t('detail.deleteLesson')}
        </button>
        <button className={ui('button primary')} onClick={() => onEdit(detail)}>
          <Pencil size={15} /> {t('common.edit')}
        </button>
      </footer>
    </Modal>
  );
};

export default LessonDetailModal;
