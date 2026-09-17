import { ui } from '@/styles/ui';
import Logo from '@/components/Logo';
import {
  BookOpen,
  ChevronRight,
  GraduationCap,
  HardDrive,
  ShieldCheck,
} from 'lucide-react';
import { type Lesson } from '@/db';

const Sidebar = ({
  view,
  nav,
  all,
  counts,
  topics,
  topic,
  setTopic,
  setStatus,
  setKind,
}: {
  view: 'library' | 'review' | 'backup';
  nav: (view: 'library' | 'review' | 'backup') => void;
  all: Lesson[];
  counts: { review: number };
  topics: string[];
  topic: string;
  setTopic: (value: string) => void;
  setStatus: (value: string) => void;
  setKind: (value: string) => void;
}) => {
  return (
    <aside className={ui('sidebar')}>
      <Logo onClick={() => nav('library')} />
      <span className={ui('sidebar-caption')}>GÓC HỌC CỦA BẠN</span>
      <nav aria-label="Điều hướng chính">
        <button
          className={ui(view === 'library' ? 'nav-item selected' : 'nav-item')}
          onClick={() => {
            nav('library');
            setTopic('all');
          }}
        >
          <BookOpen size={20} /> Sổ bài học <span>{all.length}</span>
        </button>
        <button
          className={ui(view === 'review' ? 'nav-item selected' : 'nav-item')}
          onClick={() => nav('review')}
        >
          <GraduationCap size={21} /> Ôn tập{' '}
          {counts.review > 0 && <span>{counts.review}</span>}
        </button>
        <button
          className={ui(view === 'backup' ? 'nav-item selected' : 'nav-item')}
          onClick={() => nav('backup')}
        >
          <HardDrive size={20} /> Sao lưu dữ liệu
        </button>
      </nav>
      <div className={ui('sidebar-topics')}>
        <span className={ui('sidebar-caption')}>CHỦ ĐỀ</span>
        {topics.length ? (
          topics.map((t) => (
            <button
              className={ui(
                'topic-nav ' +
                  (topic === t && view === 'library' ? 'chosen' : ''),
              )}
              key={t}
              onClick={() => {
                setTopic(t);
                setStatus('all');
                setKind('all');
                nav('library');
              }}
            >
              <span className="size-2 shrink-0 rounded-full border border-[#94a78b]" />

              <span className="min-w-0 flex-1 truncate" title={t}>
                {t}
              </span>

              <span className="shrink-0 text-xs text-[#8b968f]">
                {all.filter((lesson) => lesson.topic === t).length}
              </span>
            </button>
          ))
        ) : (
          <p>Chủ đề xuất hiện khi bạn thêm bài học.</p>
        )}
      </div>
      <div className={ui('local-card')}>
        <span className={ui('local-icon')}>
          <ShieldCheck size={21} />
        </span>
        <strong>Kiến thức của riêng bạn</strong>
        <p>
          Bài học lưu trên trình duyệt này. Xuất file để sao lưu hoặc chuyển
          máy.
        </p>
        <button onClick={() => nav('backup')}>
          Quản lý bản sao lưu <ChevronRight size={15} />
        </button>
      </div>
      <div className={ui('sidebar-bottom')}>
        <span className={ui('avatar')}>K</span>
        <div>
          Sổ tay cá nhân<small>Học một chút, mỗi ngày</small>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
