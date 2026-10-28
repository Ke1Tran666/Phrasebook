import { db, type Lesson, type Status } from '@/db';
import {
  buildReviewSession,
  createReviewUpdate,
  isLessonDue,
  type ReviewMode,
} from '@/review-schedule';
import { logActivity } from '@/services/activity-log';
import { useMemo, useState, type Dispatch, type SetStateAction } from 'react';

type UseReviewSessionOptions = {
  lessons: Lesson[];
  busy: boolean;
  setBusy: Dispatch<SetStateAction<boolean>>;
  notify: (message: string) => void;
};

export const useReviewSession = ({
  lessons,
  busy,
  setBusy,
  notify,
}: UseReviewSessionOptions) => {
  const [reviewIds, setReviewIds] = useState<string[] | null>(null);
  const [reviewIndex, setReviewIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [reviewTopic, setReviewTopic] = useState('all');
  const [reviewMode, setReviewMode] = useState<ReviewMode>('content');

  const reviewLessons = useMemo(
    () =>
      lessons.filter((lesson) =>
        reviewMode === 'structure'
          ? lesson.type === 'structure'
          : lesson.type === 'phrase' || lesson.type === 'passage',
      ),
    [lessons, reviewMode],
  );
  const reviewTopics = useMemo(
    () =>
      [
        ...new Set(reviewLessons.map((lesson) => lesson.topic).filter(Boolean)),
      ].sort((a, b) => a.localeCompare(b, 'vi')),
    [reviewLessons],
  );
  const reviewPool = useMemo(
    () =>
      reviewLessons.filter(
        (lesson) =>
          isLessonDue(lesson) &&
          (reviewTopic === 'all' || lesson.topic === reviewTopic),
      ),
    [reviewLessons, reviewTopic],
  );
  const current = reviewIds
    ? lessons.find((lesson) => lesson.id === reviewIds[reviewIndex])
    : null;
  const finished =
    reviewIds !== null && (reviewIndex >= reviewIds.length || !current);

  const changeMode = (mode: ReviewMode) => {
    setReviewMode(mode);
    setReviewTopic('all');
  };

  const start = () => {
    setReviewIds(
      buildReviewSession(
        lessons,
        reviewTopic,
        new Date(),
        Math.random,
        reviewMode,
      ).map((lesson) => lesson.id),
    );
    setReviewIndex(0);
    setFlipped(false);
  };

  const reset = () => setReviewIds(null);

  const grade = async (next: Status) => {
    if (!current || busy) return;
    setBusy(true);
    try {
      await db.lessons.update(current.id, createReviewUpdate(next, current));
      if (reviewIds && reviewIndex + 1 >= reviewIds.length) {
        logActivity({
          type: 'review_completed',
          title: 'Hoàn thành lượt ôn tập',
          description: `Đã hoàn thành phiên luyện Flashcard (${reviewIds.length} bài học).`,
          view: 'dashboard',
          linkText: 'Xem tiến độ',
        });
      }
      setReviewIndex((index) => index + 1);
      setFlipped(false);
    } catch {
      notify('Chưa lưu được tiến độ. Hãy thử lại.');
    } finally {
      setBusy(false);
    }
  };

  return {
    reviewIds,
    reviewIndex,
    flipped,
    reviewTopic,
    reviewMode,
    reviewTopics,
    reviewPool,
    current,
    finished,
    setReviewTopic,
    setFlipped,
    changeMode,
    start,
    reset,
    grade,
  };
};
