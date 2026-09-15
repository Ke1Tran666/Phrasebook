import Dexie, { type Table } from 'dexie';
export type Status = 'new' | 'review' | 'learned';
export type Highlight = {
  text: string;
  meaning: string;
  start: number;
  end: number;
};
export type Lesson = {
  id: string;
  type: 'phrase' | 'passage';
  english: string;
  meaning: string;
  notes: string;
  topic: string;
  status: Status;
  highlights: Highlight[];
  createdAt: string;
  updatedAt: string;
};
class PhraseDB extends Dexie {
  lessons!: Table<Lesson, string>;
  constructor() {
    super('phrasebook-local-v1');
    this.version(1).stores({ lessons: 'id,type,topic,status,updatedAt' });
  }
}
export const db = new PhraseDB();
export const normalize = (s: string) =>
  s.normalize('NFC').trim().toLowerCase().replace(/\s+/g, ' ');
export const keyOf = (l: Pick<Lesson, 'type' | 'english'>) =>
  l.type + ':' + normalize(l.english);
export const validateLesson = (value: unknown): Lesson => {
  if (!value || typeof value !== 'object') throw Error('Bài học không hợp lệ.');
  const x = value as Record<string, unknown>;
  for (const k of [
    'id',
    'english',
    'meaning',
    'notes',
    'topic',
    'createdAt',
    'updatedAt',
  ])
    if (typeof x[k] !== 'string')
      throw Error('Bài học thiếu thông tin: ' + k + '.');
  if (
    !String(x.english).trim() ||
    String(x.english).length > 50000 ||
    String(x.notes).length > 50000 ||
    String(x.meaning).length > 50000 ||
    String(x.topic).length > 100 ||
    String(x.id).length > 200
  )
    throw Error('Nội dung trống hoặc quá dài.');
  if (
    !['phrase', 'passage'].includes(String(x.type)) ||
    !['new', 'review', 'learned'].includes(String(x.status))
  )
    throw Error('Loại bài học hoặc trạng thái không hợp lệ.');
  if (
    !Number.isFinite(Date.parse(String(x.createdAt))) ||
    !Number.isFinite(Date.parse(String(x.updatedAt)))
  )
    throw Error('Ngày lưu bài học không hợp lệ.');
  if (!Array.isArray(x.highlights) || x.highlights.length > 1000)
    throw Error('Danh sách cụm từ không hợp lệ.');
  const hs: Highlight[] = x.highlights.map((h: unknown) => {
    if (!h || typeof h !== 'object')
      throw Error('Cụm từ được đánh dấu không hợp lệ.');
    const a = h as Highlight;
    if (
      typeof a.text !== 'string' ||
      typeof a.meaning !== 'string' ||
      a.meaning.length > 10000 ||
      !Number.isInteger(a.start) ||
      !Number.isInteger(a.end) ||
      a.start < 0 ||
      a.end <= a.start ||
      a.end > String(x.english).length ||
      String(x.english).slice(a.start, a.end) !== a.text
    )
      throw Error('Vị trí cụm từ trong bài học không hợp lệ.');
    return { text: a.text, meaning: a.meaning, start: a.start, end: a.end };
  });
  return {
    id: String(x.id),
    type: x.type as Lesson['type'],
    english: String(x.english),
    meaning: String(x.meaning),
    notes: String(x.notes),
    topic: String(x.topic).trim(),
    status: x.status as Status,
    highlights: hs,
    createdAt: String(x.createdAt),
    updatedAt: String(x.updatedAt),
  };
};
export const saveLesson = async (l: Lesson) => {
  const valid = validateLesson(l);
  await db.transaction('rw', db.lessons, async () => {
    const all = await db.lessons.toArray();
    if (all.some((a) => a.id !== valid.id && keyOf(a) === keyOf(valid)))
      throw Error('Bài học này đã có trong sổ của bạn.');
    await db.lessons.put(valid);
  });
};
export const parseBackup = (text: string): Lesson[] => {
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    throw Error('File không phải JSON hợp lệ.');
  }
  if (
    data?.app !== 'phrasebook' ||
    data?.version !== 1 ||
    !Array.isArray(data.lessons)
  )
    throw Error('Hãy chọn file sao lưu Phrasebook phiên bản 1.');
  if (data.lessons.length > 10000)
    throw Error('Mỗi lần nhập tối đa 10.000 bài học.');
  return data.lessons.map(validateLesson);
};
export const serializeBackup = (lessons: Lesson[]) => {
  return JSON.stringify(
    {
      app: 'phrasebook',
      version: 1,
      exportedAt: new Date().toISOString(),
      lessons,
    },
    null,
    2,
  );
};
export const importLessons = async (lessons: Lesson[]) => {
  const safe = lessons.map(validateLesson);
  return db.transaction('rw', db.lessons, async () => {
    const existing = await db.lessons.toArray();
    const seen = new Set(existing.map(keyOf));
    const ids = new Set(existing.map((l) => l.id));
    let added = 0,
      skipped = 0;
    for (const l of safe) {
      if (seen.has(keyOf(l))) {
        skipped++;
        continue;
      }
      const id = ids.has(l.id) || !l.id ? crypto.randomUUID() : l.id;
      await db.lessons.add({ ...l, id });
      seen.add(keyOf(l));
      ids.add(id);
      added++;
    }
    return { added, skipped };
  });
};
export const exampleLessons = (): Lesson[] => {
  const now = new Date().toISOString();
  const base = {
    notes: '',
    status: 'new' as Status,
    highlights: [],
    createdAt: now,
    updatedAt: now,
  };
  return [
    {
      ...base,
      id: crypto.randomUUID(),
      type: 'phrase',
      english: 'I’m going to go home.',
      meaning: 'Tôi định về nhà.',
      topic: 'Cuộc sống',
      notes:
        'Cấu trúc: be going to + động từ nguyên mẫu.\nDùng để nói về một dự định.\n\nVí dụ: I’m going to study English tonight.',
      highlights: [
        {
          text: 'go home',
          meaning: 'Về nhà; không dùng “to” trước “home”.',
          start: 13,
          end: 20,
        },
      ],
    },
    {
      ...base,
      id: crypto.randomUUID(),
      type: 'phrase',
      english: 'Could you give me a hand?',
      meaning: 'Bạn có thể giúp tôi một tay không?',
      topic: 'Giao tiếp',
      notes:
        'give someone a hand = giúp đỡ ai đó.\n“Could you…?” là cách nhờ giúp đỡ lịch sự.',
    },
    {
      ...base,
      id: crypto.randomUUID(),
      type: 'passage',
      english:
        'Learning a language takes time. Try to pick up a few useful phrases every day and put them into practice. Little by little, you will feel more confident.',
      meaning:
        'Học một ngôn ngữ cần có thời gian. Hãy thử học thêm một vài cụm từ hữu ích mỗi ngày và áp dụng chúng. Dần dần, bạn sẽ cảm thấy tự tin hơn.',
      topic: 'Học tập',
      notes: 'Tự đặt một câu với “little by little”.',
      highlights: [
        {
          text: 'pick up',
          meaning: 'Học được, tiếp thu một cách tự nhiên.',
          start: 39,
          end: 46,
        },
      ],
    },
  ] as Lesson[];
};
