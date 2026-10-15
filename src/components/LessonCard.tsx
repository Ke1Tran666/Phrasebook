import { ui } from '@/styles/ui';
import {
  Bookmark,
  Check,
  FileText,
  Highlighter,
  MoreHorizontal,
} from 'lucide-react';
import { type Lesson, type Status } from '@/db';
import LessonDates from '@/components/LessonDates';
import { useLanguage, type MessageKey } from '@/language';

const statusKeys: Record<Status, MessageKey> = {
  new: 'status.new',
  review: 'status.review',
  learned: 'status.learned',
};

const LessonCard = ({
  lesson: l,
  onSelect,
}: {
  lesson: Lesson;
  onSelect: (id: string) => void;
}) => {
  const { t } = useLanguage();
  return (
    <button className={ui('lesson-card')} onClick={() => onSelect(l.id)}>
      <div className={ui('card-top')}>
        <span className={ui('type-label ' + l.type)}>
          {l.type === 'phrase' ? (
            <Bookmark size={15} />
          ) : (
            <FileText size={15} />
          )}{' '}
          {l.type === 'structure'
            ? t('lesson.structure')
            : l.type === 'phrase'
              ? t('lesson.phrase')
              : t('lesson.passage')}
        </span>
        <MoreHorizontal size={20} />
      </div>
      <h2 className={ui(l.type === 'passage' ? 'passage-title' : '')}>
        {l.english}
      </h2>
      <p className={ui('card-meaning')}>
        {l.meaning || t('lesson.noTranslation')}
      </p>
      <LessonDates lesson={l} compact />
      {l.highlights.length > 0 && (
        <div className={ui('card-highlights')}>
          <Highlighter size={14} />
          {l.highlights.length} {t('lesson.highlightCount')}
        </div>
      )}
      <div className={ui('card-footer')}>
        <span className={ui('topic-chip')}>
          {l.topic || t('common.uncategorized')}
        </span>
        <span className={ui('status ' + l.status)}>
          {l.status === 'learned' && <Check size={13} />}{' '}
          {t(statusKeys[l.status])}
        </span>
      </div>
    </button>
  );
};

export default LessonCard;
