import English from '@/components/English';
import ListenButton from '@/components/ListenButton';
import StructureSuggestions from '@/components/StructureSuggestions';
import TopicChips from '@/components/TopicChips';
import type { Lesson, Status } from '@/db';
import type { ReviewMode } from '@/review-schedule';
import { ui } from '@/styles/ui';
import { useLanguage } from '@/language';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Bookmark,
  Check,
  CheckCheck,
  GraduationCap,
  Layers,
  ListChecks,
  RotateCcw,
  Shuffle,
  TimerReset,
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
}: ReviewPageProps) => {
  const { t } = useLanguage();

  return (
    <>
      {/* Banner giới thiệu phòng luyện tập */}
      <section className="mb-6 overflow-hidden rounded-2xl bg-forest text-white shadow-sm">
        <div className="grid gap-6 px-6 py-7 sm:px-8 sm:py-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold tracking-wider text-white">
              <GraduationCap size={16} /> {t('review.eyebrow')}
            </span>
            <h1 className="mt-3.5 max-w-2xl text-2xl font-bold tracking-tight sm:text-3xl">
              {t('review.title')}
            </h1>
            <p className="mt-2.5 max-w-2xl text-xs sm:text-sm leading-relaxed text-white/80">
              {t('review.description')}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs text-white/90">
            <span className="rounded-xl bg-white/10 px-3 py-2.5 backdrop-blur-xs">
              <Shuffle className="mx-auto mb-1 opacity-80" size={17} />
              {t('review.random')}
            </span>
            <span className="rounded-xl bg-white/10 px-3 py-2.5 backdrop-blur-xs">
              <TimerReset className="mx-auto mb-1 opacity-80" size={17} />
              {t('review.onSchedule')}
            </span>
            <span className="rounded-xl bg-white/10 px-3 py-2.5 backdrop-blur-xs">
              <ListChecks className="mx-auto mb-1 opacity-80" size={17} />
              {t('review.byTopic')}
            </span>
          </div>
        </div>
      </section>

      {/* Màn hình 1: Thiết lập phiên ôn tập */}
      {reviewIds === null ? (
        <section className="grid gap-6 rounded-2xl border border-line bg-surface p-5 sm:p-7 lg:grid-cols-[minmax(0,0.85fr)_minmax(320px,1.15fr)] lg:p-8 transition-colors">
          {/* Cột trái: Thẻ tóm tắt số lượng bài sẵn sàng */}
          <div className="flex flex-col justify-between rounded-2xl border border-line bg-surface-soft p-5 sm:p-6 transition-colors">
            <div>
              <span className="grid size-12 place-items-center rounded-2xl bg-status-review-bg text-status-review shadow-xs">
                <GraduationCap size={24} />
              </span>
              <h2 className="mt-5 text-xl font-bold tracking-tight text-text">
                {t('review.motto')}
              </h2>
              <p className="mt-2.5 text-xs sm:text-sm leading-relaxed text-muted">
                {t('review.selectionDescription')}
              </p>
            </div>

            <div className="mt-6 rounded-xl border border-line bg-surface p-4 transition-colors">
              <span className="text-xs font-medium text-muted">
                {t('review.ready')}
              </span>
              <strong className="mt-1 block text-3xl font-bold tracking-tight text-forest">
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
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted">
              {t('review.setup')}
            </span>

            {/* Chọn chế độ ôn tập: Cụm từ hay Cấu trúc */}
            <div
              className="mt-3.5 grid grid-cols-1 gap-3 sm:grid-cols-2"
              aria-label={t('review.contentLabel')}
            >
              <button
                type="button"
                className={`flex items-start gap-3 rounded-xl border p-4 text-left transition-all ${
                  reviewMode === 'content'
                    ? 'border-forest bg-surface-soft text-forest ring-1 ring-forest'
                    : 'border-line bg-surface text-text hover:border-forest/40 hover:bg-surface-soft'
                }`}
                aria-pressed={reviewMode === 'content'}
                onClick={() => onReviewModeChange('content')}
              >
                <BookOpen size={20} className="mt-0.5 shrink-0" />
                <span className="min-w-0">
                  <strong className="block text-sm font-semibold">
                    {t('review.contentMode')}
                  </strong>
                  <span className="mt-1 block text-xs leading-relaxed text-muted">
                    {t('review.contentModeDescription')}
                  </span>
                </span>
              </button>

              <button
                type="button"
                className={`flex items-start gap-3 rounded-xl border p-4 text-left transition-all ${
                  reviewMode === 'structure'
                    ? 'border-forest bg-surface-soft text-forest ring-1 ring-forest'
                    : 'border-line bg-surface text-text hover:border-forest/40 hover:bg-surface-soft'
                }`}
                aria-pressed={reviewMode === 'structure'}
                onClick={() => onReviewModeChange('structure')}
              >
                <Layers size={20} className="mt-0.5 shrink-0" />
                <span className="min-w-0">
                  <strong className="block text-sm font-semibold">
                    {t('lesson.structure')}
                  </strong>
                  <span className="mt-1 block text-xs leading-relaxed text-muted">
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
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-forest px-6 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
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
        /* Màn hình 2: Hoàn thành phiên ôn tập */
        <div className="flex flex-col items-center justify-center rounded-2xl border border-line bg-surface px-6 py-12 text-center transition-colors">
          <span className="grid size-16 place-items-center rounded-2xl bg-status-info-bg text-status-info shadow-xs">
            <CheckCheck size={36} />
          </span>
          <h2 className="mt-5 text-2xl font-bold tracking-tight text-text">
            {t('review.completed')}
          </h2>
          <p className="mt-2 max-w-md text-sm text-muted">
            {t('review.completedDescription')}
          </p>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
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
            <div className="mb-2 flex items-center justify-between text-xs font-medium text-muted">
              <button
                type="button"
                className="inline-flex items-center gap-1.5 transition hover:text-text"
                onClick={onEnd}
              >
                <ArrowLeft size={16} /> {t('review.end')}
              </button>
              <span>
                {t('review.item')} {reviewIndex + 1} / {reviewIds.length}
              </span>
            </div>

            {/* Thanh Progress bar đồng bộ theme */}
            <div className="mb-6 h-2 w-full overflow-hidden rounded-full border border-line bg-surface-soft">
              <div
                className="h-full rounded-full bg-forest transition-all duration-300"
                style={{
                  width: `${(reviewIndex / reviewIds.length) * 100}%`,
                }}
              />
            </div>

            {/* Thẻ bài tập (Card) */}
            <div className="relative flex flex-col rounded-2xl border border-line bg-surface p-6 sm:p-8 shadow-xs transition-colors">
              <div className="mb-4 flex items-center justify-between">
                <span className="rounded-full border border-line bg-surface-soft px-3 py-1 text-xs font-semibold text-muted">
                  {current.topic || t('common.uncategorized')}
                </span>
                <span className="text-xs font-semibold uppercase tracking-wider text-forest">
                  {current.type === 'structure'
                    ? t('lesson.structure')
                    : current.type === 'phrase'
                      ? t('lesson.phrase')
                      : t('lesson.passage')}
                </span>
              </div>

              <h2 className="my-2 text-2xl font-bold leading-relaxed tracking-tight text-text sm:text-3xl">
                <English lesson={current} />
              </h2>

              <div className="my-3">
                <ListenButton key={current.id} text={current.english} />
              </div>

              {flipped ? (
                <div className="mt-5 border-t border-line pt-5 animate-in fade-in-50 duration-200">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-muted">
                    {current.type === 'structure'
                      ? t('review.structureAnswer')
                      : t('review.meaningAnswer')}
                  </span>
                  <p className="mt-1.5 text-base font-medium text-text sm:text-lg">
                    {current.meaning || t('review.noTranslation')}
                  </p>

                  {current.notes && (
                    <div className="mt-4 rounded-xl border border-line bg-surface-soft p-3.5 text-xs sm:text-sm text-text">
                      {current.notes}
                    </div>
                  )}

                  {current.highlights.length > 0 && (
                    <div className="mt-4 flex flex-col gap-2">
                      {current.highlights.map((highlight, index) => (
                        <p
                          className="rounded-lg bg-surface-soft px-3 py-2 text-xs sm:text-sm text-text border border-line"
                          key={index}
                        >
                          <strong className="text-forest">
                            {highlight.text}
                          </strong>
                          {' — '}
                          {highlight.meaning || t('review.noNote')}
                        </p>
                      ))}
                    </div>
                  )}

                  {current.type !== 'structure' && (
                    <div className="mt-4">
                      <StructureSuggestions
                        english={current.english}
                        structures={savedStructures}
                      />
                    </div>
                  )}
                </div>
              ) : (
                <p className="mt-8 text-center text-xs font-medium text-muted">
                  {current.type === 'structure'
                    ? t('review.structureRecall')
                    : t('review.contentRecall')}
                </p>
              )}
            </div>

            {/* Các nút hành động bên dưới thẻ Flashcard */}
            <div className="mt-6 flex justify-center">
              {flipped ? (
                <div className="flex w-full gap-3 sm:w-auto">
                  <button
                    type="button"
                    className="flex flex-1 sm:min-w-35 items-center justify-center gap-2 rounded-xl border border-line bg-surface px-4 py-2.5 text-sm font-semibold text-text transition hover:bg-surface-soft disabled:opacity-50"
                    disabled={busy}
                    onClick={() => onGrade('review')}
                  >
                    <Bookmark size={17} className="text-status-review" />
                    {t('review.reviewed')}
                  </button>
                  <button
                    type="button"
                    className="flex flex-1 sm:min-w-35 items-center justify-center gap-2 rounded-xl bg-forest px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
                    disabled={busy}
                    onClick={() => onGrade('learned')}
                  >
                    <Check size={17} />
                    {t('review.remembered')}
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  className="flex w-full sm:w-auto min-w-50 items-center justify-center gap-2 rounded-xl bg-forest px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
                  onClick={onReveal}
                >
                  {t('review.reveal')} <ArrowRight size={17} />
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
