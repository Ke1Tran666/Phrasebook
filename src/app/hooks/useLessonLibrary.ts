import { db, type Lesson } from '@/db';
import { isLessonDue } from '@/review-schedule';
import { useLiveQuery } from 'dexie-react-hooks';
import { useMemo, useState } from 'react';

export const useLessonLibrary = () => {
  const [dbError, setDbError] = useState('');
  const [showIntroduction, setShowIntroduction] = useState(false);
  const [query, setQuery] = useState('');
  const [kind, setKind] = useState('all');
  const [status, setStatus] = useState('all');
  const [topic, setTopic] = useState('all');
  const [sort, setSort] = useState('latest');

  const lessons = useLiveQuery(
    () =>
      db.lessons.toArray().catch(() => {
        setDbError(
          'Không thể mở dữ liệu. Hãy cho phép trình duyệt lưu dữ liệu trang web rồi tải lại.',
        );
        return [];
      }),
    [],
  );

  const all = lessons ?? [];
  const savedStructures = useMemo(
    () => all.filter((lesson) => lesson.type === 'structure'),
    [all],
  );
  const topics = useMemo(
    () =>
      [...new Set(all.map((lesson) => lesson.topic).filter(Boolean))].sort(
        (a, b) => a.localeCompare(b, 'vi'),
      ),
    [all],
  );
  const counts = useMemo(
    () => ({
      new: all.filter((lesson) => lesson.status === 'new').length,
      review: all.filter((lesson) => isLessonDue(lesson)).length,
      learned: all.filter((lesson) => lesson.status === 'learned').length,
    }),
    [all],
  );
  const filtered = useMemo(
    () =>
      all
        .filter(
          (lesson) =>
            (kind === 'all' || lesson.type === kind) &&
            (status === 'all' || lesson.status === status) &&
            (topic === 'all' || lesson.topic === topic) &&
            `${lesson.english} ${lesson.meaning} ${lesson.notes} ${lesson.topic}`
              .toLocaleLowerCase()
              .includes(query.toLocaleLowerCase().trim()),
        )
        .sort((a: Lesson, b: Lesson) =>
          sort === 'az'
            ? a.english.localeCompare(b.english)
            : b.updatedAt.localeCompare(a.updatedAt),
        ),
    [all, kind, query, sort, status, topic],
  );

  return {
    lessons,
    all,
    savedStructures,
    topics,
    counts,
    filtered,
    dbError,
    showIntroduction,
    query,
    kind,
    status,
    topic,
    sort,
    setShowIntroduction,
    setQuery,
    setKind,
    setStatus,
    setTopic,
    setSort,
  };
};
