import English from '@/components/English';
import ListenButton from '@/components/ListenButton';
import StructureSuggestions from '@/components/StructureSuggestions';
import type { Lesson, Status } from '@/db';
import type { ReviewMode } from '@/review-schedule';
import { ui } from '@/styles/ui';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Bookmark,
  Check,
  CheckCheck,
  GraduationCap,
  Layers,
} from 'lucide-react';

type ReviewPageProps = {
  all: Lesson[];
  savedStructures: Lesson[];
  reviewPoolCount: number;
  reviewTopics: string[];
  reviewTopic: string;
  reviewMode: ReviewMode;
  reviewIds: string[] | null;
  reviewIndex: number;
  current: Lesson | null | undefined;
  finished: boolean;
  flipped: boolean;
  busy: boolean;
  onReviewTopicChange: (value: string) => void;
  onReviewModeChange: (value: ReviewMode) => void;
  onStart: () => void;
  onRestart: () => void;
  onEnd: () => void;
  onOpenLibrary: () => void;
  onAddFirstLesson: () => void;
  onReveal: () => void;
  onGrade: (status: Status) => void;
};

const ReviewPage = ({
  all,
  savedStructures,
  reviewPoolCount,
  reviewTopics,
  reviewTopic,
  reviewMode,
  reviewIds,
  reviewIndex,
  current,
  finished,
  flipped,
  busy,
  onReviewTopicChange,
  onReviewModeChange,
  onStart,
  onRestart,
  onEnd,
  onOpenLibrary,
  onAddFirstLesson,
  onReveal,
  onGrade,
}: ReviewPageProps) => (
  <>
    <div className={ui('page-heading')}>
      <div>
        <span className={ui('eyebrow')}>A LITTLE PRACTICE, EVERY DAY</span>
        <h1>
          Ôn tập<span>.</span>
        </h1>
        <p>Đọc tiếng Anh, thử nhớ nghĩa, rồi kiểm tra lại.</p>
      </div>
    </div>

    {reviewIds === null ? (
      <div className={ui('review-start')}>
        <span className={ui('review-symbol')}>
          <GraduationCap size={42} />
        </span>
        <h2>Một lần gặp lại, nhớ lâu hơn.</h2>
        <p>
          Có <strong>{reviewPoolCount} bài đến hạn</strong>
          {reviewTopic === 'all'
            ? ' trong tất cả chủ đề.'
            : ` thuộc chủ đề ${reviewTopic}.`}
        </p>
        <div className={ui('segmented')} aria-label="Nội dung muốn ôn">
          <button
            type="button"
            className={reviewMode === 'content' ? 'active' : ''}
            aria-pressed={reviewMode === 'content'}
            onClick={() => onReviewModeChange('content')}
          >
            <BookOpen size={17} /> Cụm từ & đoạn văn
          </button>
          <button
            type="button"
            className={reviewMode === 'structure' ? 'active' : ''}
            aria-pressed={reviewMode === 'structure'}
            onClick={() => onReviewModeChange('structure')}
          >
            <Layers size={17} /> Cấu trúc câu
          </button>
        </div>
        <label className="w-full max-w-sm text-left">
          Chủ đề muốn ôn hôm nay
          <select
            value={reviewTopic}
            onChange={(event) => onReviewTopicChange(event.target.value)}
          >
            <option value="all">Tất cả chủ đề</option>
            {reviewTopics.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
        <p className="text-sm!">
          {reviewMode === 'content'
            ? 'Mỗi lượt chọn ngẫu nhiên tối đa 10–15 bài, gồm tối đa 3 đoạn văn.'
            : 'Mỗi lượt chọn ngẫu nhiên tối đa 10–15 cấu trúc đến hạn.'}
        </p>
        <button
          className={ui('button primary')}
          disabled={!reviewPoolCount}
          onClick={onStart}
        >
          Bắt đầu ôn tập <ArrowRight size={18} />
        </button>
        {!all.length && (
          <button className={ui('text-button')} onClick={onAddFirstLesson}>
            Thêm bài học đầu tiên
          </button>
        )}
      </div>
    ) : finished ? (
      <div className={ui('review-start')}>
        <span className={ui('review-symbol')}>
          <CheckCheck size={42} />
        </span>
        <h2>Bạn đã hoàn thành lượt ôn!</h2>
        <p>Tiến độ và lịch ôn tiếp theo đã được lưu cho từng bài.</p>
        <button className={ui('button primary')} onClick={onRestart}>
          Về trang ôn tập
        </button>
        <button className={ui('text-button')} onClick={onOpenLibrary}>
          Mở sổ bài học <ArrowRight size={17} />
        </button>
      </div>
    ) : (
      current && (
        <div className={ui('review-session')}>
          <div className={ui('review-progress')}>
            <button className={ui('text-button')} onClick={onEnd}>
              <ArrowLeft size={17} /> Kết thúc lượt ôn
            </button>
            <span>
              Bài {reviewIndex + 1} / {reviewIds.length}
            </span>
          </div>
          <progress max={reviewIds.length} value={reviewIndex} />
          <div className={ui('flashcard')}>
            <span className={ui('topic-chip')}>
              {current.topic || 'Chưa phân loại'}
            </span>
            <h2>
              <English lesson={current} />
            </h2>
            <ListenButton key={current.id} text={current.english} />
            {flipped ? (
              <div className={ui('answer')}>
                <span className={ui('eyebrow')}>
                  {current.type === 'structure'
                    ? 'CÁCH DÙNG / Ý NGHĨA'
                    : 'NGHĨA TIẾNG VIỆT'}
                </span>
                <p>{current.meaning || 'Bài học chưa có bản dịch.'}</p>
                {current.notes && (
                  <div className={ui('review-notes')}>{current.notes}</div>
                )}
                {current.highlights.map((highlight, index) => (
                  <p className="review-phrase" key={index}>
                    <strong>{highlight.text}</strong> —{' '}
                    {highlight.meaning || 'Chưa có ghi chú'}
                  </p>
                ))}
                {current.type !== 'structure' && (
                  <StructureSuggestions
                    english={current.english}
                    structures={savedStructures}
                  />
                )}
              </div>
            ) : (
              <p className={ui('recall-hint')}>
                {current.type === 'structure'
                  ? 'Bạn có nhớ ý nghĩa và cách dùng của cấu trúc này?'
                  : 'Bạn có nhớ nghĩa và cách dùng của câu này?'}
              </p>
            )}
          </div>
          {flipped ? (
            <div className={ui('grade-buttons')}>
              <button
                className={ui('button secondary')}
                disabled={busy}
                onClick={() => onGrade('review')}
              >
                <Bookmark size={18} /> Đã ôn
              </button>
              <button
                className={ui('button primary')}
                disabled={busy}
                onClick={() => onGrade('learned')}
              >
                <Check size={18} /> Đã nhớ
              </button>
            </div>
          ) : (
            <button
              className={ui('button primary reveal-button')}
              onClick={onReveal}
            >
              Hiện đáp án <ArrowRight size={17} />
            </button>
          )}
        </div>
      )
    )}
  </>
);

export default ReviewPage;
