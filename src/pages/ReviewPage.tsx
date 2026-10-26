import English from '@/components/English';
import ListenButton from '@/components/ListenButton';
import StructureSuggestions from '@/components/StructureSuggestions';
import TopicChips from '@/components/TopicChips';
import type { Lesson, Status } from '@/db';
import { isLessonDue, type ReviewMode } from '@/review-schedule';
import { ui } from '@/styles/ui';
import { useLanguage } from '@/language';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Bookmark,
  Check,
  CheckCircle2,
  CheckCheck,
  GraduationCap,
  Layers,
  ListChecks,
  RotateCcw,
  Shuffle,
  Sparkles,
  TimerReset,
  Trophy,
} from 'lucide-react';
import { useEffect, useState } from 'react';

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
}: ReviewPageProps) => {
  const { t } = useLanguage();

  // Thống kê kết quả trong phiên ôn hiện tại
  const [sessionScore, setSessionScore] = useState<{
    learned: number;
    reviewed: number;
  }>({ learned: 0, reviewed: 0 });

  // Reset thống kê phiên khi bắt đầu mới hoặc chuyển sang màn hình khác
  useEffect(() => {
    if (reviewIndex === 0 && reviewIds !== null) {
      setSessionScore({ learned: 0, reviewed: 0 });
    }
  }, [reviewIndex, reviewIds]);

  // Hỗ trợ phím tắt bàn phím (Space để lật, 1/2 để đánh giá)
  useEffect(() => {
    if (!reviewIds || finished || !current) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      if (e.code === 'Space' || e.key === 'Enter') {
        e.preventDefault();
        if (!flipped) {
          onReveal();
        }
      } else if (flipped) {
        if (e.key === '1' || e.key === 'ArrowLeft') {
          e.preventDefault();
          if (!busy) handleGrade('review');
        } else if (e.key === '2' || e.key === 'ArrowRight') {
          e.preventDefault();
          if (!busy) handleGrade('learned');
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onEnd();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [reviewIds, finished, current, flipped, busy, onReveal]);

  const handleGrade = (status: Status) => {
    setSessionScore((prev) => ({
      ...prev,
      [status === 'learned' ? 'learned' : 'reviewed']:
        prev[status === 'learned' ? 'learned' : 'reviewed'] + 1,
    }));
    onGrade(status);
  };

  const progressPercent =
    reviewIds && reviewIds.length > 0
      ? Math.round((reviewIndex / reviewIds.length) * 100)
      : 0;

  return (
    <>
      {/* Banner giới thiệu phòng luyện tập - Chỉ hiển thị khi chưa bắt đầu ôn */}
      {reviewIds === null && (
        <section className="mb-6 overflow-hidden rounded-2xl bg-linear-to-br from-forest to-forest-hover text-white shadow-sm">
          <div className="grid gap-6 px-6 py-7 sm:px-8 sm:py-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold tracking-wider text-white backdrop-blur-xs">
                <GraduationCap size={16} /> {t('review.eyebrow')}
              </span>
              <h1 className="mt-3.5 max-w-2xl text-2xl font-bold tracking-tight sm:text-3xl">
                {t('review.title')}
              </h1>
              <p className="mt-2.5 max-w-2xl text-xs sm:text-sm leading-relaxed text-white/85">
                {t('review.description')}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs text-white/95">
              <span className="rounded-xl bg-white/10 px-3 py-2.5 backdrop-blur-xs border border-white/10">
                <Shuffle className="mx-auto mb-1 opacity-90" size={17} />
                {t('review.random')}
              </span>
              <span className="rounded-xl bg-white/10 px-3 py-2.5 backdrop-blur-xs border border-white/10">
                <TimerReset className="mx-auto mb-1 opacity-90" size={17} />
                {t('review.onSchedule')}
              </span>
              <span className="rounded-xl bg-white/10 px-3 py-2.5 backdrop-blur-xs border border-white/10">
                <ListChecks className="mx-auto mb-1 opacity-90" size={17} />
                {t('review.byTopic')}
              </span>
            </div>
          </div>
        </section>
      )}

      {/* Màn hình 1: Thiết lập phiên ôn tập */}
      {reviewIds === null ? (
        <section className="grid gap-6 rounded-2xl border border-line bg-surface p-5 sm:p-7 lg:grid-cols-[minmax(0,0.85fr)_minmax(320px,1.15fr)] lg:p-8 shadow-xs transition-colors">
          {/* Cột trái: Thẻ tóm tắt số lượng bài sẵn sàng */}
          <div className="flex flex-col justify-between rounded-2xl border border-line bg-surface-soft p-5 sm:p-6 transition-colors">
            <div>
              <span className="grid size-12 place-items-center rounded-2xl bg-status-review-bg text-status-review shadow-xs">
                <GraduationCap size={24} />
              </span>
              <h2 className="mt-5 text-xl font-bold tracking-tight text-text">
                {t('review.motto')}
              </h2>
              <p className="mt-2 text-xs sm:text-sm leading-relaxed text-muted">
                {t('review.selectionDescription')}
              </p>
            </div>

            <div className="mt-6 rounded-2xl border border-line bg-surface p-5 shadow-xs transition-colors">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted">
                {t('review.ready')}
              </span>
              <strong className="mt-1 block text-4xl font-black tracking-tight text-forest">
                {reviewPoolCount}
              </strong>
              <span className="text-xs text-muted">
                {reviewTopic === 'all'
                  ? t('review.allTopicCount')
                  : `${t('review.topicCount')} "${reviewTopic}"`}
              </span>
            </div>
          </div>

          {/* Cột phải: Chọn loại ôn và chủ đề */}
          <div className="flex min-w-0 flex-col justify-center">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted">
              {t('review.setup')}
            </span>

            {/* Chọn chế độ ôn tập: Cụm từ hay Cấu trúc */}
            <div
              className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2"
              aria-label={t('review.contentLabel')}
            >
              <button
                type="button"
                className={`flex items-start gap-3 rounded-2xl border p-4 text-left transition-all ${
                  reviewMode === 'content'
                    ? 'border-forest bg-forest-soft/40 text-text ring-2 ring-forest/20 shadow-xs'
                    : 'border-line bg-surface text-text hover:border-forest/40 hover:bg-surface-soft'
                }`}
                aria-pressed={reviewMode === 'content'}
                onClick={() => onReviewModeChange('content')}
              >
                <div
                  className={`grid size-9 shrink-0 place-items-center rounded-xl ${
                    reviewMode === 'content'
                      ? 'bg-forest text-white'
                      : 'bg-surface-soft text-muted'
                  }`}
                >
                  <BookOpen size={18} />
                </div>
                <span className="min-w-0 flex-1">
                  <strong className="block text-sm font-bold text-text">
                    {t('review.contentMode')}
                  </strong>
                  <span className="mt-0.5 block text-xs leading-relaxed text-muted">
                    {t('review.contentModeDescription')}
                  </span>
                </span>
              </button>

              <button
                type="button"
                className={`flex items-start gap-3 rounded-2xl border p-4 text-left transition-all ${
                  reviewMode === 'structure'
                    ? 'border-forest bg-forest-soft/40 text-text ring-2 ring-forest/20 shadow-xs'
                    : 'border-line bg-surface text-text hover:border-forest/40 hover:bg-surface-soft'
                }`}
                aria-pressed={reviewMode === 'structure'}
                onClick={() => onReviewModeChange('structure')}
              >
                <div
                  className={`grid size-9 shrink-0 place-items-center rounded-xl ${
                    reviewMode === 'structure'
                      ? 'bg-forest text-white'
                      : 'bg-surface-soft text-muted'
                  }`}
                >
                  <Layers size={18} />
                </div>
                <span className="min-w-0 flex-1">
                  <strong className="block text-sm font-bold text-text">
                    {t('lesson.structure')}
                  </strong>
                  <span className="mt-0.5 block text-xs leading-relaxed text-muted">
                    {t('review.structureModeDescription')}
                  </span>
                </span>
              </button>
            </div>

            <div className="mt-5">
              <span className="mb-2 block text-xs font-semibold text-muted">
                {t('review.topicLabel')}
              </span>
              <TopicChips
                topics={reviewTopics}
                selectedTopic={reviewTopic}
                allLabel={t('library.allTopics')}
                onSelectTopic={onReviewTopicChange}
              />
            </div>

            <p className="mt-4 text-xs leading-relaxed text-muted">
              {reviewMode === 'content'
                ? t('review.contentSessionHint')
                : t('review.structureSessionHint')}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                type="button"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-forest px-6 text-sm font-bold text-white shadow-sm transition-all hover:bg-forest-hover hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={!reviewPoolCount}
                onClick={onStart}
              >
                {t('review.start')} <ArrowRight size={17} />
              </button>

              {!all.length && (
                <button
                  type="button"
                  className={ui('text-button')}
                  onClick={onAddFirstLesson}
                >
                  {t('review.addFirst')}
                </button>
              )}
            </div>
          </div>
        </section>
      ) : finished ? (
        /* Màn hình 2: Hoàn thành phiên ôn tập (Celebration Screen) */
        <div className="flex flex-col items-center justify-center rounded-3xl border border-line bg-surface px-6 py-12 text-center shadow-xs transition-colors">
          <span className="grid size-20 place-items-center rounded-3xl bg-forest-soft text-forest shadow-xs animate-in zoom-in-75 duration-300">
            <Trophy size={40} />
          </span>
          <h2 className="mt-5 text-2xl sm:text-3xl font-extrabold tracking-tight text-text">
            {t('review.completed')}
          </h2>
          <p className="mt-2 max-w-md text-sm text-muted leading-relaxed">
            {t('review.completedDescription')}
          </p>

          {/* Thẻ thống kê kết quả phiên học */}
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3 w-full max-w-md">
            <div className="rounded-2xl border border-line bg-surface-soft p-3.5 text-center">
              <span className="block text-2xl font-bold text-text">
                {reviewIds.length}
              </span>
              <span className="text-xs text-muted">Tổng số câu ôn</span>
            </div>
            <div className="rounded-2xl border border-status-learned/25 bg-status-learned-bg p-3.5 text-center">
              <span className="block text-2xl font-bold text-status-learned">
                {sessionScore.learned}
              </span>
              <span className="text-xs text-status-learned">
                Đã ghi nhớ tốt
              </span>
            </div>
            <div className="col-span-2 sm:col-span-1 rounded-2xl border border-status-review/25 bg-status-review-bg p-3.5 text-center">
              <span className="block text-2xl font-bold text-status-review">
                {sessionScore.reviewed}
              </span>
              <span className="text-xs text-status-review">Cần ôn lại sớm</span>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              className={ui('button primary')}
              onClick={onRestart}
            >
              <RotateCcw size={16} /> {t('review.back')}
            </button>
            <button
              type="button"
              className={ui('button secondary')}
              onClick={onOpenLibrary}
            >
              {t('review.openLibrary')} <ArrowRight size={16} />
            </button>
          </div>
        </div>
      ) : (
        /* Màn hình 3: Thẻ Flashcard luyện tập */
        current && (
          <div className="mx-auto max-w-2xl">
            {/* Header thanh tiến trình câu hỏi */}
            <div className="mb-3 flex items-center justify-between text-xs font-semibold text-muted">
              <button
                type="button"
                className="inline-flex items-center gap-1.5 transition-colors hover:text-text"
                onClick={onEnd}
                title="Bấm hoặc nhấn Escape để kết thúc"
              >
                <ArrowLeft size={15} /> {t('review.end')}
                <kbd className="hidden sm:inline-block ml-1 rounded-md border border-line bg-surface-soft px-1.5 py-0.5 font-mono text-[10px] text-muted">
                  Esc
                </kbd>
              </button>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-surface-soft border border-line px-2.5 py-0.5 text-[11px] font-bold text-text">
                  {t('review.item')} {reviewIndex + 1} / {reviewIds.length}
                </span>
                <span className="text-muted">({progressPercent}%)</span>
              </div>
            </div>

            {/* Thanh Progress bar */}
            <div className="mb-6 h-2 w-full overflow-hidden rounded-full border border-line bg-surface-soft">
              <div
                className="h-full rounded-full bg-forest transition-all duration-300"
                style={{
                  width: `${(reviewIndex / reviewIds.length) * 100}%`,
                }}
              />
            </div>

            {/* Thẻ Flashcard (Card Container) */}
            <div
              onClick={(e) => {
                const target = e.target as HTMLElement;
                if (
                  target.closest('button') ||
                  target.closest('a') ||
                  target.closest('select')
                ) {
                  return;
                }
                if (!flipped) onReveal();
              }}
              className={`relative flex flex-col rounded-3xl border border-line bg-surface p-6 sm:p-8 shadow-xs transition-all duration-200 ${
                !flipped
                  ? 'cursor-pointer hover:border-forest/50 hover:shadow-card'
                  : ''
              }`}
            >
              {/* Thanh Header của Thẻ */}
              <div className="mb-4 flex items-center justify-between">
                <span className="rounded-full border border-line bg-surface-soft px-3 py-1 text-xs font-semibold text-muted">
                  {current.topic || t('common.uncategorized')}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-forest">
                    {current.type === 'structure'
                      ? t('lesson.structure')
                      : current.type === 'phrase'
                        ? t('lesson.phrase')
                        : t('lesson.passage')}
                  </span>
                  <span className="rounded-full bg-forest-soft px-2 py-0.5 text-[10px] font-bold text-forest uppercase">
                    {flipped ? 'Đáp án' : 'Câu hỏi'}
                  </span>
                </div>
              </div>

              {/* Nội dung Tiếng Anh */}
              <h2 className="my-2 text-2xl font-bold leading-relaxed tracking-tight text-text sm:text-3xl select-text">
                <English lesson={current} />
              </h2>

              {/* Nút nghe phát âm */}
              <div className="my-2">
                <ListenButton key={current.id} text={current.english} />
              </div>

              {/* Mặt sau: Đáp án & Phân tích (Answer) */}
              {flipped ? (
                <div className="mt-5 border-t border-line pt-5 animate-in fade-in-50 zoom-in-98 duration-200">
                  <div className="rounded-2xl border border-forest/20 bg-forest-soft/40 p-4">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-forest block mb-1">
                      {current.type === 'structure'
                        ? t('review.structureAnswer')
                        : t('review.meaningAnswer')}
                    </span>
                    <p className="text-base font-bold text-text sm:text-lg leading-relaxed">
                      {current.meaning || t('review.noTranslation')}
                    </p>
                  </div>

                  {current.notes && (
                    <div className="mt-3.5 rounded-2xl border border-line bg-surface-soft p-4 text-xs sm:text-sm text-text leading-relaxed">
                      <span className="block text-[11px] font-bold uppercase tracking-wider text-muted mb-1">
                        Ghi chú
                      </span>
                      {current.notes}
                    </div>
                  )}

                  {current.highlights.length > 0 && (
                    <div className="mt-3.5 flex flex-col gap-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-muted">
                        Từ vựng & Cụm từ nổi bật
                      </span>
                      {current.highlights.map((highlight, index) => (
                        <p
                          className="rounded-xl bg-surface-soft px-3.5 py-2.5 text-xs sm:text-sm text-text border border-line flex items-baseline gap-2"
                          key={index}
                        >
                          <strong className="text-forest shrink-0 font-bold">
                            {highlight.text}
                          </strong>
                          <span className="text-muted text-xs">→</span>
                          <span className="text-text font-medium">
                            {highlight.meaning || t('review.noNote')}
                          </span>
                        </p>
                      ))}
                    </div>
                  )}

                  {current.type !== 'structure' && (
                    <div className="mt-3.5">
                      <StructureSuggestions
                        english={current.english}
                        structures={savedStructures}
                      />
                    </div>
                  )}
                </div>
              ) : (
                /* Mặt trước: Hint lật thẻ */
                <div className="mt-8 flex items-center justify-center gap-2 text-center text-xs font-medium text-muted">
                  <Sparkles size={14} className="text-forest animate-pulse" />
                  <span>
                    {current.type === 'structure'
                      ? t('review.structureRecall')
                      : t('review.contentRecall')}
                  </span>
                </div>
              )}
            </div>

            {/* Hint phím tắt dưới thẻ */}
            <div className="mt-2 text-center text-[11px] text-muted">
              {!flipped ? (
                <span>
                  Bấm vào thẻ hoặc nhấn{' '}
                  <kbd className="rounded-md border border-line bg-surface px-1.5 py-0.5 font-mono text-[10px] text-text font-semibold shadow-xs">
                    Space
                  </kbd>{' '}
                  để xem đáp án
                </span>
              ) : (
                <div className="flex items-center justify-center gap-4">
                  <span>
                    <kbd className="rounded-md border border-line bg-surface px-1.5 py-0.5 font-mono text-[10px] text-text font-semibold shadow-xs">
                      1
                    </kbd>{' '}
                    hoặc{' '}
                    <kbd className="rounded-md border border-line bg-surface px-1.5 py-0.5 font-mono text-[10px] text-text font-semibold shadow-xs">
                      ←
                    </kbd>{' '}
                    để Ôn lại
                  </span>
                  <span>·</span>
                  <span>
                    <kbd className="rounded-md border border-line bg-surface px-1.5 py-0.5 font-mono text-[10px] text-text font-semibold shadow-xs">
                      2
                    </kbd>{' '}
                    hoặc{' '}
                    <kbd className="rounded-md border border-line bg-surface px-1.5 py-0.5 font-mono text-[10px] text-text font-semibold shadow-xs">
                      →
                    </kbd>{' '}
                    khi Đã nhớ
                  </span>
                </div>
              )}
            </div>

            {/* Các nút hành động chính bên dưới thẻ Flashcard */}
            <div className="mt-5 flex justify-center">
              {flipped ? (
                <div className="flex w-full gap-3 sm:w-auto">
                  <button
                    type="button"
                    className="flex flex-1 sm:min-w-40 items-center justify-center gap-2 rounded-2xl border border-line bg-surface px-5 py-3 text-sm font-bold text-text shadow-xs transition-all hover:bg-status-review-bg hover:border-status-review/30 hover:-translate-y-0.5 disabled:opacity-50"
                    disabled={busy}
                    onClick={() => handleGrade('review')}
                  >
                    <Bookmark size={18} className="text-status-review" />
                    <span>{t('review.reviewed')}</span>
                  </button>
                  <button
                    type="button"
                    className="flex flex-1 sm:min-w-40 items-center justify-center gap-2 rounded-2xl bg-forest px-6 py-3 text-sm font-bold text-white shadow-sm transition-all hover:bg-forest-hover hover:-translate-y-0.5 disabled:opacity-50"
                    disabled={busy}
                    onClick={() => handleGrade('learned')}
                  >
                    <Check size={18} strokeWidth={2.5} />
                    <span>{t('review.remembered')}</span>
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  className="flex w-full sm:w-auto min-w-56 items-center justify-center gap-2 rounded-2xl bg-forest px-7 py-3.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-forest-hover hover:-translate-y-0.5"
                  onClick={onReveal}
                >
                  <span>{t('review.reveal')}</span>
                  <ArrowRight size={17} />
                </button>
              )}
            </div>
          </div>
        )
      )}
    </>
  );
};

export default ReviewPage;
