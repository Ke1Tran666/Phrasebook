import { type ReactNode } from 'react';
import { type Lesson } from '@/db';

const English = ({ lesson }: { lesson: Lesson }) => {
  const spans = [...lesson.highlights].sort((a, b) => a.start - b.start);
  let pos = 0;
  const out: ReactNode[] = [];
  spans.forEach((h, i) => {
    if (h.start < pos) return;
    out.push(lesson.english.slice(pos, h.start));
    out.push(
      <mark key={i} title={h.meaning}>
        {lesson.english.slice(h.start, h.end)}
      </mark>,
    );
    pos = h.end;
  });
  out.push(lesson.english.slice(pos));
  return <>{out}</>;
};

export default English;
