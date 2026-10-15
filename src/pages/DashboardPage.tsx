import type { Lesson } from '@/db';
import { statusText } from '@/lesson-status';
import {
  ArrowRight,
  BookOpen,
  BookmarkCheck,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  FileText,
  Flame,
  Layers3,
  Plus,
  Sparkles,
  Target,
} from 'lucide-react';

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

const formatDate = (value: string) =>
  new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
  }).format(new Date(value));

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

  return (
    <section aria-labelledby="dashboard-title" className="min-w-0">
      <div className="mb-7 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
        <div>
          <span className="text-xs font-bold tracking-[0.16em] text-[#846b92]">
            DASHBOARD
          </span>
          <h1
            id="dashboard-title"
            className="mt-2 text-3xl leading-tight font-semibold tracking-[-0.04em] text-[#352c3a] sm:text-[42px]"
          >
            Chào {accountName?.split(' ')[0] || 'bạn'}, sẵn sàng học chưa?
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#7c7381] sm:text-base">
            Theo dõi tiến độ, tiếp tục bài đang đến hạn và chọn nội dung phù hợp
            cho hôm nay.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={onAddLesson}
            disabled={!lessons}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[#e5dce9] bg-[var(--color-surface)] px-4 text-sm font-semibold text-[#624d6d] hover:bg-[var(--color-surface-soft)]"
          >
            <Plus size={18} /> Thêm bài học
          </button>
          <button
            type="button"
            onClick={dueLessons.length ? onOpenExamPractice : onOpenLessons}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-forest px-4 text-sm font-semibold text-white shadow-[0_8px_24px_#8b2bd126] hover:bg-[#7120ae]"
          >
            {dueLessons.length ? 'Luyện tập ngay' : 'Mở Lessons'}
            <ArrowRight size={18} />
          </button>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-3 xl:grid-cols-4">
        {[
          {
            label: 'Tổng bài học',
            value: all.length,
            note: 'Trong thư viện',
            icon: Layers3,
            color: 'bg-[#eaf2ff] text-[#4c75a3]',
          },
          {
            label: 'Cần luyện tập',
            value: dueLessons.length,
            note: 'Đang đến hạn',
            icon: Flame,
            color: 'bg-[#fff1e8] text-[#b36c3c]',
          },
          {
            label: 'Đã ghi nhớ',
            value: counts.learned,
            note: `${learnedPercent}% tổng số bài`,
            icon: CheckCircle2,
            color: 'bg-[#eee5ff] text-[#7657a5]',
          },
          {
            label: 'Chủ đề',
            value: topics.length,
            note: 'Đang theo học',
            icon: Target,
            color: 'bg-[#f3edff] text-[#7657a5]',
          },
        ].map(({ label, value, note, icon: Icon, color }) => (
          <article
            key={label}
            className="min-w-0 rounded-2xl border border-line bg-[var(--color-surface)] p-4 sm:p-5"
          >
            <span
              className={`mb-4 grid size-10 place-items-center rounded-xl ${color}`}
            >
              <Icon size={20} aria-hidden="true" />
            </span>
            <strong className="block text-2xl font-semibold tracking-[-0.04em] sm:text-3xl">
              {String(value).padStart(2, '0')}
            </strong>
            <span className="mt-1 block truncate text-sm font-medium text-[#6e6473]">
              {label}
            </span>
            <span className="mt-1 block truncate text-xs text-[#918895]">
              {note}
            </span>
          </article>
        ))}
      </div>

      <div className="grid items-stretch gap-5 xl:grid-cols-[minmax(0,1.45fr)_minmax(290px,0.55fr)]">
        <article className="overflow-hidden rounded-2xl border border-line bg-[var(--color-surface)]">
          <div className="flex items-start justify-between gap-4 border-b border-line px-5 py-5 sm:px-6">
            <div>
              <span className="text-xs font-bold tracking-[0.14em] text-[#85798a]">
                TIẾP TỤC HỌC
              </span>
              <h2 className="mt-1 text-xl font-semibold text-[#3b3041]">
                Bài học tiếp theo của bạn
              </h2>
            </div>
            <span className="rounded-full bg-[#f6ecfc] px-3 py-1.5 text-xs font-semibold text-[#7d3c9f]">
              {dueLessons.length} bài đến hạn
            </span>
          </div>
          {nextLesson ? (
            <div className="p-5 sm:p-6">
              <div className="rounded-2xl bg-[#f8f1fc] p-5 sm:p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="inline-flex items-center gap-2 text-xs font-semibold text-[#7a6187]">
                    {nextLesson.type === 'structure' ? (
                      <Layers3 size={16} />
                    ) : nextLesson.type === 'passage' ? (
                      <FileText size={16} />
                    ) : (
                      <BookmarkCheck size={16} />
                    )}
                    {nextLesson.type === 'structure'
                      ? 'Cấu trúc câu'
                      : nextLesson.type === 'passage'
                        ? 'Đoạn văn'
                        : 'Cụm từ / câu'}
                  </span>
                  <span className="rounded-md bg-[var(--color-surface)] px-2.5 py-1 text-xs text-[#827887]">
                    {nextLesson.topic || 'Chưa phân loại'}
                  </span>
                </div>
                <h3 className="mt-5 line-clamp-3 text-2xl leading-snug font-medium tracking-tight text-[#382f3d] sm:text-3xl">
                  {nextLesson.english}
                </h3>
                <p className="mt-3 line-clamp-2 text-sm leading-6 text-[#7c7281]">
                  {nextLesson.meaning ||
                    'Mở bài học để bổ sung nghĩa và ghi chú.'}
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={onOpenExamPractice}
                    className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-forest px-4 text-sm font-semibold text-white"
                  >
                    Bắt đầu luyện <ArrowRight size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => onSelectLesson(nextLesson.id)}
                    className="inline-flex min-h-10 items-center justify-center rounded-lg border border-[#e4dbe9] bg-[var(--color-surface)] px-4 text-sm font-semibold text-[#66566f]"
                  >
                    Xem chi tiết
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid min-h-64 place-items-center p-6 text-center">
              <div>
                <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-[#f4eafa] text-[#8330b8]">
                  <Sparkles size={23} />
                </span>
                <h3 className="mt-4 font-semibold">Chưa có bài cần ôn</h3>
                <p className="mt-2 text-sm text-[#817985]">
                  Thêm bài học mới để bắt đầu lộ trình cá nhân.
                </p>
              </div>
            </div>
          )}
        </article>

        <article className="rounded-2xl border border-line bg-[#5f2387] p-5 text-white sm:p-6">
          <span className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.14em] text-[#eadcf2]">
            <Target size={16} /> TIẾN ĐỘ CỦA BẠN
          </span>
          <div className="mt-6 flex items-end justify-between gap-4">
            <div>
              <strong className="text-5xl font-semibold tracking-[-0.06em]">
                {learnedPercent}%
              </strong>
              <p className="mt-2 text-sm text-[#e7d9ed]">Bài đã ghi nhớ</p>
            </div>
            <span className="grid size-12 place-items-center rounded-2xl bg-white/10 text-lime">
              <CheckCircle2 size={25} />
            </span>
          </div>
          <div className="mt-6 h-2 overflow-hidden rounded-full bg-white/15">
            <div
              className="h-full rounded-full bg-lime transition-[width]"
              style={{ width: `${learnedPercent}%` }}
            />
          </div>
          <dl className="mt-7 divide-y divide-white/10 text-sm">
            <div className="flex justify-between gap-4 py-3">
              <dt className="text-[#e7d9ed]">Chưa học</dt>
              <dd className="font-semibold">{counts.new}</dd>
            </div>
            <div className="flex justify-between gap-4 py-3">
              <dt className="text-[#e7d9ed]">Nội dung</dt>
              <dd className="font-semibold">{contentCount}</dd>
            </div>
            <div className="flex justify-between gap-4 py-3">
              <dt className="text-[#e7d9ed]">Cấu trúc</dt>
              <dd className="font-semibold">{structureCount}</dd>
            </div>
          </dl>
        </article>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <button
          type="button"
          onClick={onOpenLessons}
          className="group flex min-w-0 items-center gap-4 rounded-2xl border border-line bg-[var(--color-surface)] p-5 text-left hover:border-[#caa8dd] hover:shadow-[0_10px_32px_#6f26840d] sm:p-6"
        >
          <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-[#eaf2ff] text-[#4c75a3]">
            <BookOpen size={23} />
          </span>
          <span className="min-w-0 flex-1">
            <strong className="block text-base font-semibold">Lessons</strong>
            <span className="mt-1 block text-sm leading-5 text-[#817985]">
              Quản lý câu, đoạn văn và cấu trúc bạn đã lưu.
            </span>
          </span>
          <ChevronRight
            size={19}
            className="shrink-0 text-[#9c91a1] transition-transform group-hover:translate-x-1"
          />
        </button>
        <button
          type="button"
          onClick={onOpenExamPractice}
          className="group flex min-w-0 items-center gap-4 rounded-2xl border border-line bg-[var(--color-surface)] p-5 text-left hover:border-[#caa8dd] hover:shadow-[0_10px_32px_#6f26840d] sm:p-6"
        >
          <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-[#f3edff] text-[#7657a5]">
            <ClipboardCheck size={23} />
          </span>
          <span className="min-w-0 flex-1">
            <strong className="block text-base font-semibold">
              Exam Practice
            </strong>
            <span className="mt-1 block text-sm leading-5 text-[#817985]">
              Luyện những bài đến hạn theo chủ đề bạn chọn.
            </span>
          </span>
          <ChevronRight
            size={19}
            className="shrink-0 text-[#9c91a1] transition-transform group-hover:translate-x-1"
          />
        </button>
      </div>

      <section className="mt-6 rounded-2xl border border-line bg-[var(--color-surface)]">
        <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-4 sm:px-6">
          <div>
            <h2 className="font-semibold">Bài học gần đây</h2>
            <p className="mt-1 text-xs text-[#8d8491]">
              Những nội dung vừa được cập nhật
            </p>
          </div>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-forest"
            onClick={onOpenLessons}
          >
            Xem tất cả <ArrowRight size={16} />
          </button>
        </div>
        {recentLessons.length ? (
          <div className="divide-y divide-line px-5 sm:px-6">
            {recentLessons.map((lesson) => (
              <button
                type="button"
                key={lesson.id}
                onClick={() => onSelectLesson(lesson.id)}
                className="flex w-full min-w-0 items-center gap-4 bg-transparent py-4 text-left"
              >
                <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-[#f5f0f7] text-[#765f80]">
                  {lesson.type === 'structure' ? (
                    <Layers3 size={18} />
                  ) : (
                    <BookOpen size={18} />
                  )}
                </span>
                <span className="min-w-0 flex-1">
                  <strong className="block truncate text-sm font-medium">
                    {lesson.english}
                  </strong>
                  <span className="mt-1 block truncate text-xs text-[#908692]">
                    {lesson.topic || 'Chưa phân loại'} ·{' '}
                    {statusText[lesson.status]}
                  </span>
                </span>
                <span className="shrink-0 text-xs text-[#9a919d]">
                  {formatDate(lesson.updatedAt)}
                </span>
              </button>
            ))}
          </div>
        ) : (
          <div className="px-6 py-10 text-center text-sm text-[#817985]">
            Chưa có bài học gần đây.
          </div>
        )}
      </section>
    </section>
  );
};

export default DashboardPage;
