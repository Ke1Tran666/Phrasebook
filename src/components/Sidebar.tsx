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
    <aside className="sidebar">
      <Logo onClick={() => nav('library')} />
      <span className="sidebar-caption">GÓC HỌC CỦA BẠN</span>
      <nav aria-label="Điều hướng chính">
        <button
          className={view === 'library' ? 'nav-item selected' : 'nav-item'}
          onClick={() => {
            nav('library');
            setTopic('all');
          }}
        >
          <BookOpen size={20} /> Sổ bài học <span>{all.length}</span>
        </button>
        <button
          className={view === 'review' ? 'nav-item selected' : 'nav-item'}
          onClick={() => nav('review')}
        >
          <GraduationCap size={21} /> Ôn tập{' '}
          {counts.review > 0 && <span>{counts.review}</span>}
        </button>
        <button
          className={view === 'backup' ? 'nav-item selected' : 'nav-item'}
          onClick={() => nav('backup')}
        >
          <HardDrive size={20} /> Sao lưu dữ liệu
        </button>
      </nav>
      <div className="sidebar-topics">
        <span className="sidebar-caption">CHỦ ĐỀ</span>
        {topics.length ? (
          topics.map((t) => (
            <button
              className={
                'topic-nav ' +
                (topic === t && view === 'library' ? 'chosen' : '')
              }
              key={t}
              onClick={() => {
                setTopic(t);
                setStatus('all');
                setKind('all');
                nav('library');
              }}
            >
              <span className="topic-dot" />
              {t}
              <span>{all.filter((l) => l.topic === t).length}</span>
            </button>
          ))
        ) : (
          <p>Chủ đề xuất hiện khi bạn thêm bài học.</p>
        )}
      </div>
      <div className="local-card">
        <span className="local-icon">
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
      <div className="sidebar-bottom">
        <span className="avatar">K</span>
        <div>
          Sổ tay cá nhân<small>Học một chút, mỗi ngày</small>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
