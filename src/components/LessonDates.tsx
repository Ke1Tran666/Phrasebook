import { CalendarClock } from 'lucide-react';
import type { Lesson } from '@/db';
import { useLanguage } from '@/language';

const formatDate = (value: string, locale: string) =>
  new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(value));

const LessonDates = ({
  lesson,
  compact = false,
}: {
  lesson: Lesson;
  compact?: boolean;
}) => {
  const { language, t } = useLanguage();
  const locale = language === 'vi' ? 'vi-VN' : 'en-GB';
  if (compact) {
    return (
      <p className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[#918895]">
        <CalendarClock size={14} aria-hidden="true" />
        <span>
          {t('dates.added')} {formatDate(lesson.createdAt, locale)}
        </span>
        <span aria-hidden="true">·</span>
        <span>
          {t('dates.edited')} {formatDate(lesson.updatedAt, locale)}
        </span>
      </p>
    );
  }

  return (
    <dl className="grid gap-3 text-sm text-[#756b7a] sm:grid-cols-3">
      <div>
        <dt className="text-xs font-semibold tracking-wide text-[#857d89]">
          {t('dates.addedLabel')}
        </dt>
        <dd className="mt-1">{formatDate(lesson.createdAt, locale)}</dd>
      </div>
      <div>
        <dt className="text-xs font-semibold tracking-wide text-[#857d89]">
          {t('dates.editedLabel')}
        </dt>
        <dd className="mt-1">{formatDate(lesson.updatedAt, locale)}</dd>
      </div>
      <div>
        <dt className="text-xs font-semibold tracking-wide text-[#857d89]">
          {t('dates.nextReview')}
        </dt>
        <dd className="mt-1">
          {lesson.nextReviewAt
            ? formatDate(lesson.nextReviewAt, locale)
            : t('dates.reviewNow')}
        </dd>
      </div>
    </dl>
  );
};

export default LessonDates;
