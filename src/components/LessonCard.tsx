import { ui } from '@/styles/ui';
import { statusText } from '@/lesson-status';
import {
  Bookmark,
  Check,
  FileText,
  Highlighter,
  MoreHorizontal,
} from 'lucide-react';
import { type Lesson, type Status } from '@/db';

const LessonCard = ({
  lesson: l,
  onSelect,
}: {
  lesson: Lesson;
  onSelect: (id: string) => void;
}) => {
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
            ? 'Cấu trúc câu'
            : l.type === 'phrase'
              ? 'Cụm từ / câu'
              : 'Đoạn văn'}
        </span>
        <MoreHorizontal size={20} />
      </div>
      <h2 className={ui(l.type === 'passage' ? 'passage-title' : '')}>
        {l.english}
      </h2>
      <p className={ui('card-meaning')}>{l.meaning || 'Chưa có bản dịch'}</p>
      {l.highlights.length > 0 && (
        <div className={ui('card-highlights')}>
          <Highlighter size={14} />
          {l.highlights.length} cụm từ được đánh dấu
        </div>
      )}
      <div className={ui('card-footer')}>
        <span className={ui('topic-chip')}>{l.topic || 'Chưa phân loại'}</span>
        <span className={ui('status ' + l.status)}>
          {l.status === 'learned' && <Check size={13} />} {statusText[l.status]}
        </span>
      </div>
    </button>
  );
};

export default LessonCard;
