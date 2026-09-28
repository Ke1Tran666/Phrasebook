import FilterSelect from '@/components/FilterSelect';
import LessonCard from '@/components/LessonCard';
import SearchInput from '@/components/SearchInput';
import StatCard from '@/components/StatCard';
import WorkspaceFooter from '@/components/WorkspaceFooter';
import type { Lesson } from '@/db';
import { statusText } from '@/lesson-status';
import { ui } from '@/styles/ui';
import {
  ArrowUpFromLine,
  Bookmark,
  CheckCheck,
  Layers,
  LoaderCircle,
  Plus,
  Search,
  Sparkles,
} from 'lucide-react';

type LibraryPageProps = {
  lessons?: Lesson[];
  all: Lesson[];
  filtered: Lesson[];
  topics: string[];
  counts: { review: number; learned: number };
  query: string;
  kind: string;
  status: string;
  topic: string;
  sort: string;
  showIntroduction: boolean;
  busy: boolean;
  dbError: string;
  onAddLesson: () => void;
  onImportFile: () => void;
  onAddExamples: () => void;
  onSelectLesson: (id: string) => void;
  onQueryChange: (value: string) => void;
  onKindChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onTopicChange: (value: string) => void;
  onSortChange: (value: string) => void;
  onShowIntroductionChange: (value: boolean) => void;
};

const LibraryPage = ({
  lessons,
  all,
  filtered,
  topics,
  counts,
  query,
  kind,
  status,
  topic,
  sort,
  showIntroduction,
  busy,
  dbError,
  onAddLesson,
  onImportFile,
  onAddExamples,
  onSelectLesson,
  onQueryChange,
  onKindChange,
  onStatusChange,
  onTopicChange,
  onSortChange,
  onShowIntroductionChange,
}: LibraryPageProps) => {
  const clearFilters = () => {
    onQueryChange('');
    onKindChange('all');
    onStatusChange('all');
    onTopicChange('all');
  };

  return (
    <>
      <div className={ui('page-heading')}>
        <div>
          <span className={ui('eyebrow')}>YOUR WORDS, YOUR WORLD</span>
          <h1>
            Sổ bài học<span>.</span>
          </h1>
          <p>Giữ lại những câu hay. Biến chúng thành tiếng Anh của bạn.</p>
        </div>
        <button
          className={ui('button primary')}
          onClick={onAddLesson}
          disabled={!lessons || !!dbError}
        >
          <Plus size={19} /> Thêm bài học
        </button>
      </div>

      <div className={ui('stats')}>
        <StatCard
          label="Tổng bài học"
          value={all.length}
          icon={Layers}
          color="green"
          description="Trong sổ của bạn"
          onClick={() => {
            onStatusChange('all');
            onKindChange('all');
            onTopicChange('all');
          }}
        />
        <StatCard
          label="Cần ôn tập"
          value={counts.review}
          icon={Bookmark}
          color="amber"
          description="Thêm một lần để nhớ"
          onClick={() => onStatusChange('review')}
        />
        <StatCard
          label="Đã ghi nhớ"
          value={counts.learned}
          icon={CheckCheck}
          color="blue"
          description="Từng chút tiến bộ"
          onClick={() => onStatusChange('learned')}
        />
      </div>

      <div className={ui('library-toolbar')}>
        <div className={ui('tab-group')} role="group" aria-label="Loại bài học">
          {[
            ['all', 'Tất cả'],
            ['phrase', 'Cụm từ / câu'],
            ['passage', 'Đoạn văn'],
            ['structure', 'Cấu trúc câu'],
          ].map(([value, label]) => (
            <button
              key={value}
              className={ui(kind === value ? 'active' : '')}
              onClick={() => onKindChange(value)}
            >
              {label}
              {value === 'all' && <span>{all.length}</span>}
            </button>
          ))}
        </div>
        <button
          className={ui('text-button')}
          onClick={onImportFile}
          disabled={busy}
        >
          <ArrowUpFromLine size={16} /> Nhập file
        </button>
      </div>

      <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-3 xl:grid-cols-[minmax(0,1fr)_180px_180px_180px]">
        <div className="min-w-0 sm:col-span-3 xl:col-span-1">
          <SearchInput value={query} onChange={onQueryChange} />
        </div>
        <FilterSelect
          label="Lọc chủ đề"
          value={topic}
          onChange={onTopicChange}
          options={[
            { value: 'all', label: 'Tất cả chủ đề' },
            ...topics.map((item) => ({ value: item, label: item })),
          ]}
        />
        <FilterSelect
          label="Lọc trạng thái"
          value={status}
          onChange={onStatusChange}
          options={[
            { value: 'all', label: 'Mọi trạng thái' },
            ...Object.entries(statusText).map(([value, label]) => ({
              value,
              label,
            })),
          ]}
        />
        <FilterSelect
          label="Sắp xếp"
          value={sort}
          onChange={onSortChange}
          options={[
            { value: 'latest', label: 'Mới cập nhật' },
            { value: 'az', label: 'Tiếng Anh A–Z' },
          ]}
        />
      </div>

      {!lessons ? (
        <div className={ui('empty')}>
          <LoaderCircle className={ui('spin')} />
          Đang mở sổ bài học…
        </div>
      ) : all.length === 0 || showIntroduction ? (
        <div className={ui('first-lesson')}>
          <div className={ui('first-copy')}>
            <span className={ui('eyebrow')}>TRANG ĐẦU TIÊN CỦA BẠN</span>
            <h2>
              Một câu mới.
              <br />
              Một bước tiến nhỏ.
            </h2>
            <p>
              Bắt đầu với một cụm từ bạn vừa gặp, một câu trong bộ phim yêu
              thích hoặc một đoạn văn muốn hiểu rõ hơn.
            </p>
            <button className={ui('button primary')} onClick={onAddLesson}>
              <Plus size={18} />{' '}
              {all.length ? 'Viết bài học mới' : 'Viết bài học đầu tiên'}
            </button>
            <button
              className={ui('text-button examples-button')}
              onClick={onAddExamples}
            >
              <Sparkles size={16} /> Hoặc thử với 3 bài mẫu
            </button>
          </div>
          <div className={ui('sample-note')}>
            <div className={ui('sample-label')}>
              <Bookmark size={16} /> VÍ DỤ MỘT BÀI HỌC
            </div>
            <p className={ui('sample-english')}>
              I’m going to
              <br />
              <mark>go home.</mark>
            </p>
            <p className={ui('sample-meaning')}>Tôi định về nhà.</p>
            <div className={ui('sample-rule')}>
              <span>CẤU TRÚC</span>
              <strong>be going to + V nguyên mẫu</strong>
              <p>Nói về một dự định.</p>
            </div>
            <span className={ui('topic-chip')}>Cuộc sống</span>
          </div>
        </div>
      ) : filtered.length === 0 ? (
        <div className={ui('empty')}>
          <Search size={32} />
          <h2>Chưa tìm thấy bài học</h2>
          <p>Thử từ khóa khác hoặc bỏ bớt bộ lọc.</p>
          <button className={ui('button secondary')} onClick={clearFilters}>
            Xóa bộ lọc
          </button>
        </div>
      ) : (
        <>
          <div className={ui('results-caption')}>
            {filtered.length} bài học <span>Bấm vào bài để xem và ghi chú</span>
          </div>
          <div className={ui('lesson-grid')}>
            {filtered.map((lesson) => (
              <LessonCard
                key={lesson.id}
                lesson={lesson}
                onSelect={onSelectLesson}
              />
            ))}
          </div>
        </>
      )}

      {all.length > 0 && !showIntroduction && (
        <div className="mt-5 flex justify-center">
          <button
            type="button"
            className={ui('text-button')}
            onClick={() => onShowIntroductionChange(true)}
          >
            <Sparkles size={16} /> Xem lại giới thiệu
          </button>
        </div>
      )}
      <WorkspaceFooter />
    </>
  );
};

export default LibraryPage;
