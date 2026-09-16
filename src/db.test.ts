import 'fake-indexeddb/auto';
import assert from 'node:assert/strict';
import { after, beforeEach, describe, it } from 'node:test';
import {
  db,
  exampleLessons,
  importLessons,
  keyOf,
  normalize,
  parseBackup,
  saveLesson,
  serializeBackup,
  validateLesson,
  type Lesson,
} from '@/db';

const lesson = (overrides: Partial<Lesson> = {}): Lesson => ({
  id: crypto.randomUUID(),
  type: 'phrase',
  english: 'Go home.',
  meaning: 'Về nhà.',
  notes: 'A useful phrase.',
  topic: 'Daily life',
  status: 'new',
  highlights: [{ text: 'Go home', meaning: 'Về nhà', start: 0, end: 7 }],
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
  ...overrides,
});

const envelope = (lessons: unknown[]) =>
  JSON.stringify({ app: 'phrasebook', version: 1, lessons });

describe('lesson validation and duplicate keys', () => {
  it('normalizes Unicode, case and whitespace without merging lesson types', () => {
    assert.equal(normalize('  CAFE\u0301\n  TIME\t'), 'café time');
    assert.equal(
      keyOf({ type: 'phrase', english: 'CAFÉ time' }),
      keyOf({ type: 'phrase', english: ' cafe\u0301  TIME ' }),
    );
    assert.notEqual(
      keyOf({ type: 'phrase', english: 'hello' }),
      keyOf({ type: 'passage', english: 'hello' }),
    );
  });

  it('trims the topic but preserves English spacing and highlight offsets', () => {
    const input = lesson({
      topic: '  Daily life  ',
      english: '  Go home.  ',
      highlights: [{ text: 'Go home', meaning: '', start: 2, end: 9 }],
    });
    const result = validateLesson(input);
    assert.equal(result.topic, 'Daily life');
    assert.equal(result.english, input.english);
    assert.deepEqual(result.highlights, input.highlights);
    assert.equal(input.topic, '  Daily life  ');
    assert.notEqual(result.highlights, input.highlights);
  });

  it('rejects missing fields, wrong types, invalid dates and empty English', () => {
    const invalid: unknown[] = [
      null,
      false,
      [],
      {},
      lesson({ english: ' \n\t ' }),
      { ...lesson(), meaning: 1 },
      { ...lesson(), type: 'word' },
      { ...lesson(), status: 'done' },
      lesson({ createdAt: 'invalid' }),
      lesson({ updatedAt: 'invalid' }),
      { ...lesson(), highlights: null },
    ];
    for (const input of invalid) assert.throws(() => validateLesson(input));
    for (const field of [
      'id',
      'english',
      'meaning',
      'notes',
      'topic',
      'createdAt',
      'updatedAt',
    ]) {
      const input: Record<string, unknown> = { ...lesson() };
      delete input[field];
      assert.throws(() => validateLesson(input), { name: 'Error' }, field);
    }
  });

  it('accepts field length limits and rejects the next character', () => {
    for (const [field, limit] of [
      ['english', 50000],
      ['meaning', 50000],
      ['notes', 50000],
      ['topic', 100],
      ['id', 200],
    ] as const) {
      assert.doesNotThrow(() =>
        validateLesson(lesson({ [field]: 'a'.repeat(limit), highlights: [] })),
      );
      assert.throws(() =>
        validateLesson(
          lesson({ [field]: 'a'.repeat(limit + 1), highlights: [] }),
        ),
      );
    }
  });

  it('rejects malformed or out-of-range highlights', () => {
    const valid = lesson().highlights[0];
    for (const highlight of [
      null,
      { ...valid, start: -1 },
      { ...valid, start: 0.5 },
      { ...valid, end: 0 },
      { ...valid, end: 99 },
      { ...valid, text: 'wrong' },
      { ...valid, meaning: 1 },
      { ...valid, meaning: 'a'.repeat(10001) },
    ]) {
      assert.throws(() =>
        validateLesson({ ...lesson(), highlights: [highlight] }),
      );
    }
    assert.doesNotThrow(() =>
      validateLesson(
        lesson({ highlights: [{ ...valid, meaning: 'a'.repeat(10000) }] }),
      ),
    );
  });

  it('enforces the highlight count limit', () => {
    const highlights = Array.from({ length: 1000 }, (_, i) => ({
      text: 'a',
      meaning: '',
      start: i,
      end: i + 1,
    }));
    assert.doesNotThrow(() =>
      validateLesson(lesson({ english: 'a'.repeat(1001), highlights })),
    );
    assert.throws(() =>
      validateLesson(
        lesson({
          english: 'a'.repeat(1001),
          highlights: [
            ...highlights,
            { text: 'a', meaning: '', start: 1000, end: 1001 },
          ],
        }),
      ),
    );
  });

  it('generates three valid examples with distinct IDs on each call', () => {
    const first = exampleLessons(),
      second = exampleLessons();
    assert.equal(first.length, 3);
    [...first, ...second].forEach((item) =>
      assert.doesNotThrow(() => validateLesson(item)),
    );
    assert.equal(new Set([...first, ...second].map((item) => item.id)).size, 6);
  });
});

describe('backup files', () => {
  it('round-trips all lesson fields and writes valid metadata', () => {
    const records = [lesson({ status: 'learned' })];
    const text = serializeBackup(records);
    const metadata = JSON.parse(text);
    assert.equal(metadata.app, 'phrasebook');
    assert.equal(metadata.version, 1);
    assert.ok(Number.isFinite(Date.parse(metadata.exportedAt)));
    assert.deepEqual(parseBackup(text), records);
    assert.deepEqual(parseBackup(serializeBackup([])), []);
  });

  it('rejects invalid JSON and incompatible backup structures', () => {
    assert.throws(() => parseBackup('{bad'), /JSON/);
    for (const input of [
      null,
      [],
      {},
      { app: 'other', version: 1, lessons: [] },
      { app: 'phrasebook', version: 2, lessons: [] },
      { app: 'phrasebook', version: 1, lessons: {} },
    ]) {
      assert.throws(() => parseBackup(JSON.stringify(input)), /phiên bản/);
    }
    assert.throws(() =>
      parseBackup(envelope([lesson(), { english: 'incomplete' }])),
    );
  });

  it('accepts 10,000 lessons and rejects 10,001', () => {
    const records = Array.from({ length: 10000 }, () =>
      lesson({ highlights: [] }),
    );
    assert.equal(parseBackup(envelope(records)).length, 10000);
    assert.throws(
      () => parseBackup(envelope([...records, lesson()])),
      /10.000/,
    );
  });
});

describe('IndexedDB persistence and imports', { concurrency: false }, () => {
  beforeEach(async () => {
    await db.open();
    await db.lessons.clear();
  });
  after(async () => {
    await db.delete();
  });

  it('starts empty, saves, reopens, updates and deletes a lesson', async () => {
    assert.equal(await db.lessons.count(), 0);
    const original = lesson();
    await saveLesson(original);
    db.close();
    await db.open();
    assert.deepEqual(await db.lessons.get(original.id), original);
    const updated = {
      ...original,
      status: 'learned' as const,
      notes: 'Updated',
    };
    await saveLesson(updated);
    assert.deepEqual(await db.lessons.get(original.id), updated);
    assert.equal(await db.lessons.count(), 1);
    await db.lessons.delete(original.id);
    assert.equal(await db.lessons.get(original.id), undefined);
  });

  it('rejects duplicate saves and conflicting edits without changing either record', async () => {
    const original = lesson();
    const other = lesson({ english: 'Different.', highlights: [] });
    await saveLesson(original);
    await saveLesson(other);
    await assert.rejects(
      () => saveLesson(lesson({ english: ' GO  HOME. ', highlights: [] })),
      /đã có/,
    );
    await assert.rejects(
      () => saveLesson({ ...other, english: original.english, highlights: [] }),
      /đã có/,
    );
    assert.deepEqual(await db.lessons.get(original.id), original);
    assert.deepEqual(await db.lessons.get(other.id), other);
    assert.equal(await db.lessons.count(), 2);
  });

  it('rejects invalid saves without writing to the database', async () => {
    await assert.rejects(() => saveLesson(lesson({ english: '' })));
    assert.equal(await db.lessons.count(), 0);
  });

  it('keeps notes, progress and highlights when importing a normalized duplicate', async () => {
    const original = lesson({ status: 'learned' });
    await saveLesson(original);
    const duplicate = lesson({
      english: '  GO\n HOME. ',
      highlights: [],
      notes: 'Replacement',
      status: 'new',
    });
    assert.deepEqual(await importLessons([duplicate]), {
      added: 0,
      skipped: 1,
    });
    assert.deepEqual(await db.lessons.toArray(), [original]);
  });

  it('skips duplicates inside one import but allows the same text with another type', async () => {
    const original = lesson();
    assert.deepEqual(
      await importLessons([
        original,
        { ...original, id: crypto.randomUUID() },
        { ...original, id: crypto.randomUUID(), type: 'passage' },
      ]),
      { added: 2, skipped: 1 },
    );
    assert.equal(await db.lessons.count(), 2);
  });

  it('assigns fresh IDs for collisions and missing IDs without overwriting existing records', async () => {
    const original = lesson();
    await saveLesson(original);
    const incoming = [
      lesson({ id: original.id, english: 'Second', highlights: [] }),
      lesson({ id: original.id, english: 'Third', highlights: [] }),
      lesson({ id: '', english: 'Fourth', highlights: [] }),
    ];
    assert.deepEqual(await importLessons(incoming), { added: 3, skipped: 0 });
    const stored = await db.lessons.toArray();
    assert.equal(stored.length, 4);
    assert.equal(new Set(stored.map((item) => item.id)).size, 4);
    assert.ok(stored.every((item) => item.id));
    assert.deepEqual(await db.lessons.get(original.id), original);
    assert.equal(incoming[2].id, '');
  });

  it('validates the entire import before adding any records', async () => {
    const original = lesson();
    await saveLesson(original);
    await assert.rejects(() =>
      importLessons([
        lesson({ english: 'Valid new lesson', highlights: [] }),
        lesson({ english: '' }),
      ]),
    );
    assert.deepEqual(await db.lessons.toArray(), [original]);
  });

  it('rolls back earlier writes if a later database write fails', async () => {
    const original = lesson();
    await saveLesson(original);
    const failOnSecond = (_key: unknown, value: Lesson) => {
      if (value.english === 'Fail this write')
        throw new Error('Simulated write failure');
    };
    db.lessons.hook('creating', failOnSecond);
    try {
      await assert.rejects(
        () =>
          importLessons([
            lesson({ english: 'First write', highlights: [] }),
            lesson({ english: 'Fail this write', highlights: [] }),
          ]),
        /Simulated write failure/,
      );
      assert.deepEqual(await db.lessons.toArray(), [original]);
    } finally {
      db.lessons.hook('creating').unsubscribe(failOnSecond);
    }
  });

  it('imports an empty list without changing stored lessons', async () => {
    const original = lesson();
    await saveLesson(original);
    assert.deepEqual(await importLessons([]), { added: 0, skipped: 0 });
    assert.deepEqual(await db.lessons.toArray(), [original]);
  });
});

describe('sentence structure lessons', () => {
  it('validates and round-trips a structure independently of phrase lessons', () => {
    const structure = lesson({
      type: 'structure',
      english: 'S + be going to + V',
      meaning: 'Diễn tả dự định',
      notes: 'I am going to study.',
      highlights: [],
    });
    assert.deepEqual(validateLesson(structure), structure);
    assert.deepEqual(parseBackup(serializeBackup([structure])), [structure]);
    assert.notEqual(keyOf(structure), keyOf({ ...structure, type: 'phrase' }));
  });
});
