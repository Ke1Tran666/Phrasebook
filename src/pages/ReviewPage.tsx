import English from '@/components/English';
import ListenButton from '@/components/ListenButton';
import StructureSuggestions from '@/components/StructureSuggestions';
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
      <section className="mb-6 overflow-hidden rounded-2xl bg-[#67258f] text-white shadow-[0_18px_50px_#68258f1c]">
        <div className="grid gap-7 px-6 py-7 sm:px-8 sm:py-9 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold tracking-[0.12em] text-[#eddff3]">
              <GraduationCap size={16} /> {t('review.eyebrow')}
            </span>
            <h1 className="mt-4 max-w-2xl text-3xl leading-tight font-semibold tracking-[-0.04em] sm:text-[42px]">
              {t('review.title')}
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[#eadced] sm:text-base">
              {t('review.description')}
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center text-xs text-[#d5e0d7]">
            <span className="rounded-xl bg-white/8 px-3 py-3">
              <Shuffle className="mx-auto mb-1.5" size={18} />{' '}
              {t('review.random')}
            </span>
            <span className="rounded-xl bg-white/8 px-3 py-3">
              <TimerReset className="mx-auto mb-1.5" size={18} />{' '}
              {t('review.onSchedule')}
            </span>
            <span className="rounded-xl bg-white/8 px-3 py-3">
              <ListChecks className="mx-auto mb-1.5" size={18} />{' '}
              {t('review.byTopic')}
            </span>
          </div>
        </div>
      </section>

      {reviewIds === null ? (
        <section className="grid gap-6 rounded-2xl border border-line bg-surface p-5 sm:p-7 lg:grid-cols-[minmax(0,0.8fr)_minmax(320px,1.2fr)] lg:p-8">
          <div className="flex flex-col justify-between rounded-2xl bg-[#f8f1fc] p-5 sm:p-6">
            <div>
              <span className="grid size-12 place-items-center rounded-2xl bg-surface text-forest shadow-sm">
                <GraduationCap size={24} />
              </span>
              <h2 className="mt-5 text-2xl font-semibold tracking-[-0.03em]">
                {t('review.motto')}
              </h2>
              <p className="mt-3 text-sm leading-6 text-[#7b7180]">
                {t('review.selectionDescription')}
              </p>
            </div>
            <div className="mt-7 rounded-xl border border-[#e8d9f0] bg-surface p-4">
              <span className="text-xs text-[#867b8a]">
                {t('review.ready')}
              </span>
              <strong className="mt-1 block text-3xl tracking-[-0.04em] text-forest">
                {reviewPoolCount}
              </strong>
              <span className="text-xs text-[#867b8a]">
                {reviewTopic === 'all'
                  ? t('review.allTopicCount')
                  : `${t('review.topicCount')} ${reviewTopic}`}
              </span>
            </div>
          </div>

          <div className="flex min-w-0 flex-col justify-center">
            <span className="text-xs font-bold tracking-[0.14em] text-[#837788]">
              {t('review.setup')}
            </span>
            <div
              className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2"
              aria-label={t('review.contentLabel')}
            >
              <button
                type="button"
                className={`flex items-start gap-3 rounded-xl border p-4 text-left ${
                  reviewMode === 'content'
                    ? 'border-[#a65bd0] bg-[#faf3fd] text-forest shadow-[0_0_0_2px_#8b2bd117]'
                    : 'border-line bg-surface text-[#706775] hover:bg-surface-soft'
                }`}
                aria-pressed={reviewMode === 'content'}
                onClick={() => onReviewModeChange('content')}
              >
                <BookOpen size={20} className="mt-0.5" />
                <span>
                  <strong className="block text-sm">
                    {t('review.contentMode')}
                  </strong>
                  <span className="mt-1 block text-xs leading-5 opacity-75">
                    {t('review.contentModeDescription')}
                  </span>
                </span>
              </button>
              <button
                type="button"
                className={`flex items-start gap-3 rounded-xl border p-4 text-left ${
                  reviewMode === 'structure'
                    ? 'border-[#a65bd0] bg-[#faf3fd] text-forest shadow-[0_0_0_2px_#8b2bd117]'
                    : 'border-line bg-surface text-[#706775] hover:bg-surface-soft'
                }`}
                aria-pressed={reviewMode === 'structure'}
                onClick={() => onReviewModeChange('structure')}
              >
                <Layers size={20} className="mt-0.5" />
                <span>
                  <strong className="block text-sm">
                    {t('lesson.structure')}
                  </strong>
                  <span className="mt-1 block text-xs leading-5 opacity-75">
                    {t('review.structureModeDescription')}
                  </span>
                </span>
              </button>
            </div>
            <label className="mt-5 text-sm">
              {t('review.topicLabel')}
              <select
                className="min-h-11 w-full"
                value={reviewTopic}
                onChange={(event) => onReviewTopicChange(event.target.value)}
              >
                <option value="all">{t('library.allTopics')}</option>
                {reviewTopics.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
            <p className="mt-4 text-xs leading-5 text-[#887d8c]">
              {reviewMode === 'content'
                ? t('review.contentSessionHint')
                : t('review.structureSessionHint')}
            </p>
            <button
              className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 self-start rounded-xl bg-forest px-5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
              disabled={!reviewPoolCount}
              onClick={onStart}
            >
              {t('review.start')} <ArrowRight size={18} />
            </button>
            {!all.length && (
              <button
                className={`${ui('text-button')} mt-2 self-start`}
                onClick={onAddFirstLesson}
              >
                {t('review.addFirst')}
              </button>
            )}
          </div>
        </section>
      ) : finished ? (
        <div className={ui('review-start')}>
          <span className={ui('review-symbol')}>
            <CheckCheck size={42} />
          </span>
          <h2>{t('review.completed')}</h2>
          <p>{t('review.completedDescription')}</p>
          <button className={ui('button primary')} onClick={onRestart}>
            {t('review.back')}
          </button>
          <button className={ui('text-button')} onClick={onOpenLibrary}>
            {t('review.openLibrary')} <ArrowRight size={17} />
          </button>
        </div>
      ) : (
        current && (
          <div className={ui('review-session')}>
            <div className={ui('review-progress')}>
              <button className={ui('text-button')} onClick={onEnd}>
                <ArrowLeft size={17} /> {t('review.end')}
              </button>
              <span>
                {t('review.item')} {reviewIndex + 1} / {reviewIds.length}
              </span>
            </div>
            <progress max={reviewIds.length} value={reviewIndex} />
            <div className={ui('flashcard')}>
              <span className={ui('topic-chip')}>
                {current.topic || t('common.uncategorized')}
              </span>
              <h2>
                <English lesson={current} />
              </h2>
              <ListenButton key={current.id} text={current.english} />
              {flipped ? (
                <div className={ui('answer')}>
                  <span className={ui('eyebrow')}>
                    {current.type === 'structure'
                      ? t('review.structureAnswer')
                      : t('review.meaningAnswer')}
                  </span>
                  <p>{current.meaning || t('review.noTranslation')}</p>
                  {current.notes && (
                    <div className={ui('review-notes')}>{current.notes}</div>
                  )}
                  {current.highlights.map((highlight, index) => (
                    <p className="review-phrase" key={index}>
                      <strong>{highlight.text}</strong> —{' '}
                      {highlight.meaning || t('review.noNote')}
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
                    ? t('review.structureRecall')
                    : t('review.contentRecall')}
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
                  <Bookmark size={18} /> {t('review.reviewed')}
                </button>
                <button
                  className={ui('button primary')}
                  disabled={busy}
                  onClick={() => onGrade('learned')}
                >
                  <Check size={18} /> {t('review.remembered')}
                </button>
              </div>
            ) : (
              <button
                className={ui('button primary reveal-button')}
                onClick={onReveal}
              >
                {t('review.reveal')} <ArrowRight size={17} />
              </button>
            )}
          </div>
        )
      )}
    </>
  );
};

export default ReviewPage;
