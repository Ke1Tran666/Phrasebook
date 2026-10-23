import type { Lesson, Status } from '@/db';

export type ReviewMode = 'content' | 'structure';

/**
 * Các mốc giãn cách ôn tập (Spaced Repetition intervals tính theo ngày)
 * Lần 1: 1 ngày -> Lần 2: 3 ngày -> Lần 3: 7 ngày -> Lần 4: 14 ngày -> Lần 5: 30 ngày
 */
const INTERVAL_LADDER = [1, 3, 7, 14, 30, 60];

const DAY_IN_MILLISECONDS = 24 * 60 * 60 * 1000;

const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setUTCDate(result.getUTCDate() + days);
  return result;
};

const shuffle = <T>(items: T[], random: () => number): T[] => {
  const result = [...items];

  for (let index = result.length - 1; index > 0; index--) {
    const target = Math.floor(random() * (index + 1));
    [result[index], result[target]] = [result[target], result[index]];
  }

  return result;
};

/**
 * Kiểm tra xem bài học đã đến hạn ôn tập hay chưa
 */
export const isLessonDue = (
  lesson: Lesson,
  now: Date = new Date(),
): boolean => {
  // Bài mới tạo chưa học cũng được coi là có thể đưa vào danh sách học/ôn
  if (lesson.status === 'new') return true;
  if (!lesson.nextReviewAt) return true;

  const dueDate = new Date(lesson.nextReviewAt);
  // So sánh mốc thời gian (bài có hạn ôn <= thời điểm hiện tại)
  return dueDate.getTime() <= now.getTime();
};

/**
 * Tạo dữ liệu cập nhật khi chấm điểm/chuyển trạng thái bài tập
 */
export const createReviewUpdate = (
  nextStatus: Status,
  lesson?: Lesson,
  now: Date = new Date(),
): Partial<Lesson> => {
  const currentDateStr = now.toISOString();

  // 1. Nếu chuyển về bài mới (Chưa học)
  if (nextStatus === 'new') {
    return {
      status: 'new',
      updatedAt: currentDateStr,
      lastReviewedAt: undefined,
      nextReviewAt: undefined,
    };
  }

  // 2. Nếu người dùng chọn "Cần ôn tập" (Chưa thuộc / Cần xem lại)
  if (nextStatus === 'review') {
    // Hẹn ôn lại vào ngày mai (1 ngày)
    const nextDate = addDays(now, 1);

    return {
      status: 'review',
      updatedAt: currentDateStr,
      lastReviewedAt: currentDateStr,
      nextReviewAt: nextDate.toISOString(),
    };
  }

  // 3. Nếu người dùng chọn "Đã nhớ" (learned)
  // Tính toán thời gian giãn cách tiếp theo dựa trên ngày ôn trước đó
  let daysToAdd = INTERVAL_LADDER[0]; // Mặc định 1 ngày

  if (lesson?.lastReviewedAt && lesson.nextReviewAt) {
    const prevDiffDays = Math.round(
      (new Date(lesson.nextReviewAt).getTime() -
        new Date(lesson.lastReviewedAt).getTime()) /
        DAY_IN_MILLISECONDS,
    );

    // Tìm bậc tiếp theo trong thang giãn cách
    const currentStepIndex = INTERVAL_LADDER.findIndex(
      (d) => d >= prevDiffDays,
    );
    if (
      currentStepIndex !== -1 &&
      currentStepIndex < INTERVAL_LADDER.length - 1
    ) {
      daysToAdd = INTERVAL_LADDER[currentStepIndex + 1];
    } else {
      daysToAdd = INTERVAL_LADDER[INTERVAL_LADDER.length - 1]; // Tối đa 60 ngày
    }
  }

  const nextDate = addDays(now, daysToAdd);

  return {
    status: 'learned',
    updatedAt: currentDateStr,
    lastReviewedAt: currentDateStr,
    nextReviewAt: nextDate.toISOString(),
  };
};

/**
 * Xây dựng phiên luyện tập ngẫu nhiên từ kho bài học đến hạn
 */
export const buildReviewSession = (
  all: Lesson[],
  selectedTopic: string,
  now: Date = new Date(),
  randomFn = Math.random,
  mode: ReviewMode = 'content',
  limit = 15,
): Lesson[] => {
  // Lọc theo chế độ
  const poolByMode = all.filter((l) =>
    mode === 'structure'
      ? l.type === 'structure'
      : l.type === 'phrase' || l.type === 'passage',
  );

  // Lọc theo chủ đề và bài đến hạn
  const eligible = poolByMode.filter(
    (l) =>
      isLessonDue(l, now) &&
      (selectedTopic === 'all' || l.topic === selectedTopic),
  );

  if (mode === 'structure') {
    return shuffle(eligible, randomFn).slice(0, limit);
  }

  // Một phiên nội dung ưu tiên tối đa 3 đoạn văn, phần còn lại là cụm từ.
  const passages = shuffle(
    eligible.filter((lesson) => lesson.type === 'passage'),
    randomFn,
  ).slice(0, Math.min(3, limit));
  const phrases = shuffle(
    eligible.filter((lesson) => lesson.type === 'phrase'),
    randomFn,
  ).slice(0, Math.max(0, limit - passages.length));

  return shuffle([...passages, ...phrases], randomFn);
};
