import type { Lesson, Status } from '@/db';

const randomInteger = (
  minimum: number,
  maximum: number,
  random: () => number,
) => Math.floor(random() * (maximum - minimum + 1)) + minimum;

const addDays = (date: Date, days: number) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

export const createReviewUpdate = (
  status: Status,
  now = new Date(),
  random: () => number = Math.random,
): Pick<Lesson, 'status' | 'lastReviewedAt' | 'nextReviewAt' | 'updatedAt'> => {
  const updatedAt = now.toISOString();
  if (status === 'new') {
    return {
      status,
      lastReviewedAt: undefined,
      nextReviewAt: undefined,
      updatedAt,
    };
  }

  const days =
    status === 'review'
      ? randomInteger(1, 3, random)
      : randomInteger(3, 4, random);
  return {
    status,
    lastReviewedAt: updatedAt,
    nextReviewAt: addDays(now, days).toISOString(),
    updatedAt,
  };
};

export const isLessonDue = (lesson: Lesson, now = new Date()) => {
  if (lesson.status === 'new' || !lesson.nextReviewAt) return true;
  return Date.parse(lesson.nextReviewAt) <= now.getTime();
};

const shuffled = <T>(items: T[], random: () => number) => {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index--) {
    const target = Math.floor(random() * (index + 1));
    [result[index], result[target]] = [result[target], result[index]];
  }
  return result;
};

export const buildReviewSession = (
  lessons: Lesson[],
  topic = 'all',
  now = new Date(),
  random: () => number = Math.random,
) => {
  const due = lessons.filter(
    (lesson) =>
      isLessonDue(lesson, now) && (topic === 'all' || lesson.topic === topic),
  );
  if (!due.length) return [];

  const maximum = Math.min(15, due.length);
  const minimum = Math.min(10, maximum);
  const targetSize = randomInteger(minimum, maximum, random);
  const passages = shuffled(
    due.filter((lesson) => lesson.type === 'passage'),
    random,
  ).slice(0, Math.min(3, targetSize));
  const others = shuffled(
    due.filter((lesson) => lesson.type !== 'passage'),
    random,
  ).slice(0, targetSize - passages.length);

  return shuffled([...passages, ...others], random);
};
