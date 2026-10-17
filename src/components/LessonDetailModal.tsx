import English from '@/components/English';
import FilterSelect from '@/components/FilterSelect';
import LessonDates from '@/components/LessonDates';
import ListenButton from '@/components/ListenButton';
import Modal from '@/components/Modal';
import StructureSuggestions from '@/components/StructureSuggestions';
import type { Lesson, Status } from '@/db';
import { useLanguage } from '@/language';
import { ui } from '@/styles/ui';
import { Pencil, Trash2, X } from 'lucide-react';

interface LessonDetailModalProps {
  detail: Lesson | null | undefined;
  savedStructures: Lesson[];
  onClose: () => void;
  onEdit: (lesson: Lesson) => void;
  onDelete: (lesson: Lesson) => void;
  onStatusChange: (newStatus: Status) => void;
}

export const LessonDetailModal = ({
  detail,
  savedStructures,
  onClose,
  onEdit,
  onDelete,
  onStatusChange,
}: LessonDetailModalProps) => {
  const { t } = useLanguage();

  if (!detail) return null;

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

        <ListenButton key={detail.id} text={detail.english} />

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

        {/* Trạng thái học với FilterSelect mới */}
        <div className="flex flex-col gap-2 pt-2 min-[761px]:flex-row min-[761px]:items-center min-[761px]:justify-between">
          <span className="text-sm font-semibold text-muted">
            {t('detail.status')}
          </span>
          <div className="w-full min-[761px]:w-45">
            <FilterSelect
              label={t('detail.status')}
              value={detail.status}
              onChange={(value) => onStatusChange(value as Status)}
              options={[
                { value: 'new', label: t('status.new') },
                { value: 'review', label: t('review.reviewed') },
                { value: 'learned', label: t('review.remembered') },
              ]}
            />
          </div>
        </div>
      </div>

      <footer className={ui('modal-footer')}>
        <button
          className={ui('text-button danger')}
          onClick={() => onDelete(detail)}
        >
          <Trash2 size={17} /> {t('detail.deleteLesson')}
        </button>
        <button className={ui('button primary')} onClick={() => onEdit(detail)}>
          <Pencil size={16} /> {t('common.edit')}
        </button>
      </footer>
    </Modal>
  );
};

export default LessonDetailModal;
