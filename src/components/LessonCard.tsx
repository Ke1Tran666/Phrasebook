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
    <button className="lesson-card" onClick={() => onSelect(l.id)}>
      <div className="card-top">
        <span className={'type-label ' + l.type}>
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
      <h2 className={l.type === 'passage' ? 'passage-title' : ''}>
        {l.english}
      </h2>
      <p className="card-meaning">{l.meaning || 'Chưa có bản dịch'}</p>
      {l.highlights.length > 0 && (
        <div className="card-highlights">
          <Highlighter size={14} />
          {l.highlights.length} cụm từ được đánh dấu
        </div>
      )}
      <div className="card-footer">
        <span className="topic-chip">{l.topic || 'Chưa phân loại'}</span>
        <span className={'status ' + l.status}>
          {l.status === 'learned' && <Check size={13} />} {statusText[l.status]}
        </span>
      </div>
    </button>
  );
};

export default LessonCard;
