import type { Lesson } from '@/db';
import { isLessonDue } from '@/review-schedule';
import { useLanguage, type MessageKey } from '@/language';
import {
  ArrowRight,
  BookOpen,
  BookmarkCheck,
  Calendar,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  Clock,
  FileText,
  Flame,
  Layers3,
  Plus,
  Sparkles,
  Target,
  Volume2,
  Zap,
} from 'lucide-react';
import { useState } from 'react';

type DashboardPageProps = {
  lessons?: Lesson[];
  all: Lesson[];
  dueLessons: Lesson[];
  topics: string[];
  counts: { new: number; review: number; learned: number };
  accountName?: string;
  onOpenLessons: () => void;
  onOpenExamPractice: () => void;
  onAddLesson: () => void;
  onSelectLesson: (id: string) => void;
};

const statusKeys: Record<Lesson['status'], MessageKey> = {
  new: 'status.new',
  review: 'status.review',
  learned: 'status.learned',
};

const formatDate = (value: string, locale: string) =>
  new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: '2-digit',
  }).format(new Date(value));

// Tính streak dựa trên các ngày có tương tác (ôn tập, thêm mới, sửa bài)
const computeStreak = (lessons: Lesson[]) => {
  const dates = new Set<string>();
  lessons.forEach((l) => {
    if (l.lastReviewedAt) dates.add(l.lastReviewedAt.slice(0, 10));
    if (l.updatedAt) dates.add(l.updatedAt.slice(0, 10));
    if (l.createdAt) dates.add(l.createdAt.slice(0, 10));
  });

  const today = new Date();
  const todayStr = today.toISOString().slice(0, 10);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().slice(0, 10);

  let streak = 0;
  let checkDate = new Date(today);
  if (!dates.has(todayStr) && dates.has(yesterdayStr)) {
    checkDate = yesterday;
  }

  while (dates.has(checkDate.toISOString().slice(0, 10))) {
    streak++;
    checkDate.setDate(checkDate.getDate() - 1);
  }

  return streak;
};

// Tính 7 ngày gần nhất để vẽ mini tracker tuần
const getLast7Days = (lessons: Lesson[]) => {
  const activeDates = new Set<string>();
  lessons.forEach((l) => {
    if (l.lastReviewedAt) activeDates.add(l.lastReviewedAt.slice(0, 10));
    if (l.updatedAt) activeDates.add(l.updatedAt.slice(0, 10));
    if (l.createdAt) activeDates.add(l.createdAt.slice(0, 10));
  });

  const days = [];
  const dayLabels = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().slice(0, 10);
    days.push({
      label: dayLabels[d.getDay()],
      dayNum: d.getDate(),
      active: activeDates.has(dateStr),
      isToday: i === 0,
    });
  }
  return days;
};

// Dự báo lịch ôn tập Spaced Repetition sắp tới
const getScheduleForecast = (lessons: Lesson[]) => {
  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;
  let dueToday = 0;
  let dueTomorrow = 0;
  let dueThisWeek = 0;
  let dueLater = 0;

  lessons.forEach((l) => {
    if (isLessonDue(l)) {
      dueToday++;
    } else if (l.nextReviewAt) {
      const diffDays = Math.ceil(
        (new Date(l.nextReviewAt).getTime() - now) / dayMs,
      );
      if (diffDays <= 1) dueTomorrow++;
      else if (diffDays <= 7) dueThisWeek++;
      else dueLater++;
    }
  });

  return { dueToday, dueTomorrow, dueThisWeek, dueLater };
};

const DashboardPage = ({
  lessons,
  all,
  dueLessons,
  topics,
  counts,
  accountName,
  onOpenLessons,
  onOpenExamPractice,
  onAddLesson,
  onSelectLesson,
}: DashboardPageProps) => {
  const { language, t } = useLanguage();
  const [playingId, setPlayingId] = useState<string | null>(null);

  const learnedPercent = all.length
    ? Math.round((counts.learned / all.length) * 100)
    : 0;

  const recentLessons = [...all]
    .sort((first, second) => second.updatedAt.localeCompare(first.updatedAt))
    .slice(0, 4);

  const nextLesson = dueLessons[0];
  const structureCount = all.filter(
    (lesson) => lesson.type === 'structure',
  ).length;
  const contentCount = all.length - structureCount;

  const streak = computeStreak(all);
  const weekDays = getLast7Days(all);
  const forecast = getScheduleForecast(all);

  const handleQuickPlay = (e: React.MouseEvent, id: string, text: string) => {
    e.stopPropagation();
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text.trim());
    utterance.lang = 'en-US';
    setPlayingId(id);
    utterance.onend = () => setPlayingId(null);
    utterance.onerror = () => setPlayingId(null);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <section aria-labelledby="dashboard-title" className="min-w-0">
      {/* Header Chào mừng & Hành động chính */}
      <div className="mb-7 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
        <div>
          <span className="text-xs font-bold tracking-[0.16em] uppercase text-forest">
            {t('dashboard.eyebrow')}
          </span>
          <h1
            id="dashboard-title"
            className="mt-2 text-3xl leading-tight font-extrabold tracking-tight text-text sm:text-4xl"
          >
            {t('dashboard.greeting')}{' '}
            {accountName?.split(' ')[0] || t('dashboard.you')},{' '}
            {t('dashboard.greetingSuffix')}
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
            {t('dashboard.description')}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={onAddLesson}
            disabled={!lessons}
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-line bg-surface px-4.5 text-sm font-semibold text-text shadow-xs transition-colors hover:bg-surface-soft hover:border-line-hover"
          >
            <Plus size={18} /> {t('dashboard.addLesson')}
          </button>
          <button
            type="button"
            onClick={dueLessons.length ? onOpenExamPractice : onOpenLessons}
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-forest px-5 text-sm font-bold text-white shadow-sm transition-all hover:bg-forest-hover hover:-translate-y-0.5"
          >
            {dueLessons.length
              ? t('dashboard.practiceNow')
              : t('dashboard.openLessons')}
            <ArrowRight size={17} />
          </button>
        </div>
      </div>

      {/* Grid 4 Thẻ Thống kê Cốt lõi */}
      <div className="mb-6 grid grid-cols-2 gap-3 xl:grid-cols-4">
        {[
          {
            label: t('dashboard.totalLessons'),
            value: all.length,
            note: t('dashboard.inLibrary'),
            icon: Layers3,
            color: 'bg-status-info-bg text-status-info',
          },
          {
            label: t('dashboard.needPractice'),
            value: dueLessons.length,
            note: t('dashboard.dueNow'),
            icon: Flame,
            color: 'bg-status-review-bg text-status-review',
          },
          {
            label: t('dashboard.remembered'),
            value: counts.learned,
            note: `${learnedPercent}% ${t('dashboard.totalSuffix')}`,
            icon: CheckCircle2,
            color: 'bg-status-learned-bg text-status-learned',
          },
          {
            label: t('dashboard.topics'),
            value: topics.length,
            note: t('dashboard.learning'),
            icon: Target,
            color: 'bg-forest-soft text-forest',
          },
        ].map(({ label, value, note, icon: Icon, color }) => (
          <article
            key={label}
            className="min-w-0 rounded-2xl border border-line bg-surface p-4 sm:p-5 shadow-xs transition-all duration-180 hover:border-line-hover hover:shadow-card hover:-translate-y-0.5"
          >
            <span
              className={`mb-4 grid size-10 place-items-center rounded-xl transition-colors ${color}`}
            >
              <Icon size={20} aria-hidden="true" />
            </span>
            <strong className="block text-2xl font-bold tracking-tight text-text sm:text-3xl">
              {String(value).padStart(2, '0')}
            </strong>
            <span className="mt-1 block truncate text-sm font-semibold text-text">
              {label}
            </span>
            <span className="mt-0.5 block truncate text-xs text-muted">
              {note}
            </span>
          </article>
        ))}
      </div>

      {/* Widget Chuỗi ngày học tập (Streak) & 7 ngày gần nhất */}
      <div className="mb-6 overflow-hidden rounded-2xl border border-line bg-surface p-5 shadow-xs sm:p-6 transition-colors">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-amber-500/10 text-amber-500 shadow-xs">
              <Flame size={26} className="animate-pulse" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                  Chuỗi ngày học tập
                </span>
                <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-600 dark:text-amber-400">
                  {streak > 0 ? 'Đang duy trì' : 'Bắt đầu ngay'}
                </span>
              </div>
              <h2 className="mt-0.5 text-xl font-bold text-text flex items-baseline gap-2">
                <span>{streak} ngày liên tục</span>
                <span className="text-xs font-normal text-muted">
                  {streak >= 3
                    ? '🔥 Phong độ học tập rất tuyệt vời!'
                    : 'Học mỗi ngày để tích lũy phản xạ tự nhiên.'}
                </span>
              </h2>
            </div>
          </div>

          {/* Mini Tracker 7 ngày trong tuần */}
          <div className="flex items-center gap-2 self-start lg:self-center">
            {weekDays.map((day, idx) => (
              <div
                key={idx}
                className={`flex flex-col items-center justify-center rounded-xl px-2.5 py-1.5 min-w-9 transition-colors ${
                  day.isToday
                    ? 'border-2 border-forest bg-forest-soft/40 font-bold'
                    : 'border border-line bg-surface-soft'
                }`}
                title={`${day.label}: ${day.active ? 'Có học tập' : 'Chưa có hoạt động'}`}
              >
                <span className="text-[10px] uppercase font-semibold text-muted">
                  {day.label}
                </span>
                <div className="mt-1 flex items-center justify-center">
                  {day.active ? (
                    <span className="grid size-4 place-items-center rounded-full bg-forest text-white text-[9px]">
                      ✓
                    </span>
                  ) : (
                    <span className="size-2 rounded-full bg-line" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Khối Bài học tiếp theo & Thẻ Tiến độ tổng quan */}
      <div className="grid items-stretch gap-5 xl:grid-cols-[minmax(0,1.45fr)_minmax(300px,0.55fr)]">
        {/* Cột Trái: Bài học cần ôn tiếp theo */}
        <article className="overflow-hidden rounded-2xl border border-line bg-surface shadow-xs">
          <div className="flex items-start justify-between gap-4 border-b border-line px-5 py-4 sm:px-6">
            <div>
              <span className="text-xs font-bold tracking-wider uppercase text-forest">
                {t('dashboard.continue')}
              </span>
              <h2 className="mt-1 text-lg sm:text-xl font-bold text-text">
                {t('dashboard.nextLesson')}
              </h2>
            </div>
            <span className="rounded-full bg-forest-soft px-3 py-1 text-xs font-semibold text-forest">
              {dueLessons.length} {t('dashboard.dueLessons')}
            </span>
          </div>

          {nextLesson ? (
            <div className="p-5 sm:p-6">
              <div className="rounded-2xl border border-line bg-surface-soft p-5 sm:p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted">
                    {nextLesson.type === 'structure' ? (
                      <Layers3 size={15} />
                    ) : nextLesson.type === 'passage' ? (
                      <FileText size={15} />
                    ) : (
                      <BookmarkCheck size={15} />
                    )}
                    {nextLesson.type === 'structure'
                      ? t('lesson.structure')
                      : nextLesson.type === 'passage'
                        ? t('lesson.passage')
                        : t('lesson.phrase')}
                  </span>
                  <span className="rounded-md border border-line bg-surface px-2.5 py-1 text-xs font-medium text-muted">
                    {nextLesson.topic || t('common.uncategorized')}
                  </span>
                </div>

                <div className="mt-4 flex items-start justify-between gap-3">
                  <h3 className="line-clamp-3 text-2xl leading-snug font-bold tracking-tight text-text sm:text-3xl flex-1">
                    {nextLesson.english}
                  </h3>
                  <button
                    type="button"
                    onClick={(e) =>
                      handleQuickPlay(e, nextLesson.id, nextLesson.english)
                    }
                    title="Nghe phát âm"
                    className={`grid size-9 shrink-0 place-items-center rounded-xl transition-colors ${
                      playingId === nextLesson.id
                        ? 'bg-forest text-white'
                        : 'border border-line bg-surface text-muted hover:text-forest hover:bg-surface-soft'
                    }`}
                  >
                    <Volume2 size={17} />
                  </button>
                </div>

                <p className="mt-2.5 line-clamp-2 text-sm leading-relaxed text-text-secondary">
                  {nextLesson.meaning || t('dashboard.missingMeaning')}
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={onOpenExamPractice}
                    className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-forest px-5 text-sm font-bold text-white shadow-sm transition hover:bg-forest-hover hover:-translate-y-0.5"
                  >
                    {t('dashboard.startPractice')} <ArrowRight size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => onSelectLesson(nextLesson.id)}
                    className="inline-flex min-h-10 items-center justify-center rounded-xl border border-line bg-surface px-4 text-sm font-semibold text-text shadow-xs transition hover:bg-surface-soft hover:border-line-hover"
                  >
                    {t('dashboard.viewDetails')}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid min-h-64 place-items-center p-6 text-center">
              <div>
                <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-forest-soft text-forest">
                  <Sparkles size={22} />
                </span>
                <h3 className="mt-4 font-bold text-text">
                  {t('dashboard.noReview')}
                </h3>
                <p className="mt-1 text-sm text-muted">
                  {t('dashboard.noReviewDescription')}
                </p>
              </div>
            </div>
          )}
        </article>

        {/* Cột Phải: Tiến độ tổng quan */}
        <article className="rounded-2xl border border-line bg-forest p-5 text-white shadow-xs sm:p-6 transition-colors flex flex-col justify-between">
          <div>
            <span className="inline-flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-white/80">
              <Target size={16} /> {t('dashboard.progress')}
            </span>
            <div className="mt-5 flex items-end justify-between gap-4">
              <div>
                <strong className="text-5xl font-extrabold tracking-tight">
                  {learnedPercent}%
                </strong>
                <p className="mt-1.5 text-sm text-white/80">
                  {t('dashboard.rememberedLessons')}
                </p>
              </div>
              <span className="grid size-12 place-items-center rounded-2xl bg-white/15 text-lime">
                <CheckCircle2 size={26} />
              </span>
            </div>

            <div className="mt-5 h-2.5 overflow-hidden rounded-full bg-white/20">
              <div
                className="h-full rounded-full bg-lime transition-[width] duration-300"
                style={{ width: `${learnedPercent}%` }}
              />
            </div>
          </div>

          <dl className="mt-6 divide-y divide-white/15 text-sm">
            <div className="flex justify-between gap-4 py-2.5">
              <dt className="text-white/80">{t('status.new')}</dt>
              <dd className="font-bold">{counts.new}</dd>
            </div>
            <div className="flex justify-between gap-4 py-2.5">
              <dt className="text-white/80">{t('dashboard.content')}</dt>
              <dd className="font-bold">{contentCount}</dd>
            </div>
            <div className="flex justify-between gap-4 py-2.5">
              <dt className="text-white/80">{t('dashboard.structures')}</dt>
              <dd className="font-bold">{structureCount}</dd>
            </div>
          </dl>
        </article>
      </div>

      {/* Widget Dự báo Lịch ôn tập Spaced Repetition sắp tới */}
      <div className="mt-6 rounded-2xl border border-line bg-surface p-5 sm:p-6 shadow-xs">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <Clock size={18} className="text-forest" />
            <h2 className="text-base font-bold text-text">
              Dự báo Lịch ôn tập (Spaced Repetition)
            </h2>
          </div>
          <span className="text-xs text-muted">Lũy tiến ngắt quãng</span>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-xl border border-status-review/25 bg-status-review-bg p-3.5 text-center">
            <span className="text-[11px] font-bold uppercase tracking-wider text-status-review block">
              Hôm nay
            </span>
            <strong className="mt-1 block text-2xl font-black text-status-review">
              {forecast.dueToday}
            </strong>
            <span className="text-[11px] text-status-review opacity-80">
              cần ôn ngay
            </span>
          </div>

          <div className="rounded-xl border border-line bg-surface-soft p-3.5 text-center">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted block">
              Ngày mai
            </span>
            <strong className="mt-1 block text-2xl font-black text-text">
              {forecast.dueTomorrow}
            </strong>
            <span className="text-[11px] text-muted">sắp đến hạn</span>
          </div>

          <div className="rounded-xl border border-line bg-surface-soft p-3.5 text-center">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted block">
              7 ngày tới
            </span>
            <strong className="mt-1 block text-2xl font-black text-text">
              {forecast.dueThisWeek}
            </strong>
            <span className="text-[11px] text-muted">trong tuần</span>
          </div>

          <div className="rounded-xl border border-status-learned/25 bg-status-learned-bg p-3.5 text-center">
            <span className="text-[11px] font-bold uppercase tracking-wider text-status-learned block">
              Dài hạn
            </span>
            <strong className="mt-1 block text-2xl font-black text-status-learned">
              {forecast.dueLater}
            </strong>
            <span className="text-[11px] text-status-learned opacity-80">
              nhớ trên 1 tuần
            </span>
          </div>
        </div>
      </div>

      {/* 2 Thẻ điều hướng tắt */}
      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <button
          type="button"
          onClick={onOpenLessons}
          className="group flex min-w-0 items-center gap-4 rounded-2xl border border-line bg-surface p-5 text-left shadow-xs transition-all duration-180 hover:border-line-hover hover:shadow-card hover:-translate-y-0.5 sm:p-6"
        >
          <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-status-info-bg text-status-info transition-colors">
            <BookOpen size={22} />
          </span>
          <span className="min-w-0 flex-1">
            <strong className="block text-base font-bold text-text">
              {t('nav.lessons')}
            </strong>
            <span className="mt-1 block text-sm leading-relaxed text-muted">
              {t('dashboard.lessonsDescription')}
            </span>
          </span>
          <ChevronRight
            size={18}
            className="shrink-0 text-muted transition-transform group-hover:translate-x-1"
          />
        </button>
        <button
          type="button"
          onClick={onOpenExamPractice}
          className="group flex min-w-0 items-center gap-4 rounded-2xl border border-line bg-surface p-5 text-left shadow-xs transition-all duration-180 hover:border-line-hover hover:shadow-card hover:-translate-y-0.5 sm:p-6"
        >
          <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-forest-soft text-forest transition-colors">
            <ClipboardCheck size={22} />
          </span>
          <span className="min-w-0 flex-1">
            <strong className="block text-base font-bold text-text">
              {t('nav.examPractice')}
            </strong>
            <span className="mt-1 block text-sm leading-relaxed text-muted">
              {t('dashboard.practiceDescription')}
            </span>
          </span>
          <ChevronRight
            size={18}
            className="shrink-0 text-muted transition-transform group-hover:translate-x-1"
          />
        </button>
      </div>

      {/* Danh sách bài học gần đây */}
      <section className="mt-6 rounded-2xl border border-line bg-surface shadow-xs">
        <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-4 sm:px-6">
          <div>
            <h2 className="font-bold text-text">{t('dashboard.recent')}</h2>
            <p className="mt-0.5 text-xs text-muted">
              {t('dashboard.recentDescription')}
            </p>
          </div>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-forest hover:underline"
            onClick={onOpenLessons}
          >
            {t('dashboard.viewAll')} <ArrowRight size={15} />
          </button>
        </div>
        {recentLessons.length ? (
          <div className="divide-y divide-line px-5 sm:px-6">
            {recentLessons.map((lesson) => (
              <div
                key={lesson.id}
                onClick={() => onSelectLesson(lesson.id)}
                className="group flex w-full min-w-0 items-center justify-between gap-4 bg-transparent py-3.5 text-left transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3.5 min-w-0 flex-1">
                  <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-surface-soft text-muted border border-line">
                    {lesson.type === 'structure' ? (
                      <Layers3 size={17} />
                    ) : (
                      <BookOpen size={17} />
                    )}
                  </span>
                  <div className="min-w-0 flex-1">
                    <strong className="block truncate text-sm font-semibold text-text group-hover:text-forest transition-colors">
                      {lesson.english}
                    </strong>
                    <span className="mt-0.5 block truncate text-xs text-muted">
                      {lesson.topic || t('common.uncategorized')} ·{' '}
                      {t(statusKeys[lesson.status])}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <button
                    type="button"
                    onClick={(e) =>
                      handleQuickPlay(e, lesson.id, lesson.english)
                    }
                    title="Nghe phát âm"
                    className={`grid size-8 place-items-center rounded-xl transition-colors ${
                      playingId === lesson.id
                        ? 'bg-forest text-white'
                        : 'text-muted hover:bg-surface-soft hover:text-forest'
                    }`}
                  >
                    <Volume2 size={15} />
                  </button>
                  <span className="text-xs text-muted">
                    {formatDate(
                      lesson.updatedAt,
                      language === 'vi' ? 'vi-VN' : 'en-GB',
                    )}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="px-6 py-10 text-center text-sm text-muted">
            {t('dashboard.noRecent')}
          </div>
        )}
      </section>
    </section>
  );
};

export default DashboardPage;
