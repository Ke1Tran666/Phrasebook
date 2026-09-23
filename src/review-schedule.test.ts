import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import type { Lesson } from '@/db';
import {
  buildReviewSession,
  createReviewUpdate,
  isLessonDue,
} from '@/review-schedule';

const now = new Date('2026-09-23T08:00:00.000Z');
const lesson = (overrides: Partial<Lesson> = {}): Lesson => ({
  id: crypto.randomUUID(),
  type: 'phrase',
  english: 'Example',
  meaning: 'Ví dụ',
  notes: '',
  topic: 'Xe cộ',
  status: 'new',
  highlights: [],
  createdAt: '2026-09-20T08:00:00.000Z',
  updatedAt: '2026-09-20T08:00:00.000Z',
  ...overrides,
});

describe('review scheduling', () => {
  it('schedules reviewed lessons after 1–3 days', () => {
    assert.equal(
      createReviewUpdate('review', now, () => 0).nextReviewAt,
      '2026-09-24T08:00:00.000Z',
    );
    assert.equal(
      createReviewUpdate('review', now, () => 0.999).nextReviewAt,
      '2026-09-26T08:00:00.000Z',
    );
  });

  it('schedules remembered lessons after 3–4 days', () => {
    const earliest = createReviewUpdate('learned', now, () => 0);
    const latest = createReviewUpdate('learned', now, () => 0.999);
    assert.equal(earliest.lastReviewedAt, now.toISOString());
    assert.equal(earliest.nextReviewAt, '2026-09-26T08:00:00.000Z');
    assert.equal(latest.nextReviewAt, '2026-09-27T08:00:00.000Z');
  });

  it('treats new and legacy lessons as due, then waits until the scheduled time', () => {
    assert.equal(isLessonDue(lesson(), now), true);
    assert.equal(
      isLessonDue(lesson({ status: 'review', nextReviewAt: undefined }), now),
      true,
    );
    assert.equal(
      isLessonDue(
        lesson({
          status: 'learned',
          nextReviewAt: '2026-09-24T08:00:00.000Z',
        }),
        now,
      ),
      false,
    );
    assert.equal(
      isLessonDue(
        lesson({
          status: 'learned',
          nextReviewAt: '2026-09-23T08:00:00.000Z',
        }),
        now,
      ),
      true,
    );
  });

  it('selects 10–15 due lessons in one topic with exactly 3 passages', () => {
    const vehicles = [
      ...Array.from({ length: 5 }, (_, index) =>
        lesson({ id: `passage-${index}`, type: 'passage' }),
      ),
      ...Array.from({ length: 15 }, (_, index) =>
        lesson({ id: `phrase-${index}` }),
      ),
      lesson({ id: 'future', nextReviewAt: '2026-09-24T08:00:00.000Z' }),
    ];
    const otherTopic = Array.from({ length: 5 }, (_, index) =>
      lesson({ id: `other-${index}`, topic: 'Cuộc sống' }),
    );
    const session = buildReviewSession(
      [...vehicles, ...otherTopic],
      'Xe cộ',
      now,
      () => 0.999,
    );
    assert.equal(session.length, 15);
    assert.equal(session.filter((item) => item.type === 'passage').length, 3);
    assert.ok(session.every((item) => item.topic === 'Xe cộ'));
    assert.ok(!session.some((item) => item.id === 'future'));
  });

  it('returns every available due lesson when fewer than 10 exist', () => {
    const lessons = Array.from({ length: 7 }, (_, index) =>
      lesson({ id: String(index), type: index < 2 ? 'passage' : 'phrase' }),
    );
    assert.equal(buildReviewSession(lessons, 'Xe cộ', now).length, 7);
  });
});
