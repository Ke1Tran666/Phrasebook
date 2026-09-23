import { CalendarClock } from 'lucide-react';
import type { Lesson } from '@/db';

const dateFormatter = new Intl.DateTimeFormat('vi-VN', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
});

const formatDate = (value: string) => dateFormatter.format(new Date(value));

const LessonDates = ({
  lesson,
  compact = false,
}: {
  lesson: Lesson;
  compact?: boolean;
}) => {
  if (compact) {
    return (
      <p className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[#8b968f]">
        <CalendarClock size={14} aria-hidden="true" />
        <span>Thêm {formatDate(lesson.createdAt)}</span>
        <span aria-hidden="true">·</span>
        <span>Sửa {formatDate(lesson.updatedAt)}</span>
      </p>
    );
  }

  return (
    <dl className="grid gap-3 text-sm text-[#65756b] sm:grid-cols-3">
      <div>
        <dt className="text-xs font-semibold tracking-wide text-[#87928b]">
          NGÀY THÊM
        </dt>
        <dd className="mt-1">{formatDate(lesson.createdAt)}</dd>
      </div>
      <div>
        <dt className="text-xs font-semibold tracking-wide text-[#87928b]">
          CHỈNH SỬA
        </dt>
        <dd className="mt-1">{formatDate(lesson.updatedAt)}</dd>
      </div>
      <div>
        <dt className="text-xs font-semibold tracking-wide text-[#87928b]">
          ÔN TIẾP THEO
        </dt>
        <dd className="mt-1">
          {lesson.nextReviewAt
            ? formatDate(lesson.nextReviewAt)
            : 'Có thể ôn ngay'}
        </dd>
      </div>
    </dl>
  );
};

export default LessonDates;
