import { useMemo, useState } from 'react';
import FilterSelect from '@/components/FilterSelect';
import LessonCard from '@/components/LessonCard';
import SearchInput from '@/components/SearchInput';
import StatCard from '@/components/StatCard';
import TopicChips from '@/components/TopicChips';
import WorkspaceFooter from '@/components/WorkspaceFooter';
import type { Lesson, Status } from '@/db';
import { ui } from '@/styles/ui';
import { useLanguage, type MessageKey } from '@/language';
import {
  ArrowUpFromLine,
  Bookmark,
  Check,
  CheckCheck,
  CircleDot,
  FileText,
  Layers,
  LayoutGrid,
  List,
  LoaderCircle,
  MoreHorizontal,
  Pencil,
  Plus,
  RotateCcw,
  Search,
  Sparkles,
  Trash2,
  Volume2,
} from 'lucide-react';
import { LessonProgressSection } from '@/components/LessonProgressSection';

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
  onEditLesson?: (lesson: Lesson) => void;
  onDeleteLesson?: (lesson: Lesson) => void;
  onQuickStatusChange?: (id: string, status: Status) => Promise<void>;
  onQueryChange: (value: string) => void;
  onKindChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onTopicChange: (value: string) => void;
  onSortChange: (value: string) => void;
  onShowIntroductionChange: (value: boolean) => void;
};

const statusKeys: Record<Lesson['status'], MessageKey> = {
  new: 'status.new',
  review: 'status.review',
  learned: 'status.learned',
};

const LibraryPage = ({
  lessons,
  all,
  filtered,
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
  onEditLesson,
  onDeleteLesson,
  onQuickStatusChange,
  onQueryChange,
  onKindChange,
  onStatusChange,
  onTopicChange,
  onSortChange,
  onShowIntroductionChange,
}: LibraryPageProps) => {
  const { t } = useLanguage();

  // Chế độ xem: Dạng Lưới (Grid) hay Dạng Danh sách (List)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>(() => {
    const stored = window.localStorage.getItem('phrasebook-library-view');
    return stored === 'list' ? 'list' : 'grid';
  });

  const changeViewMode = (mode: 'grid' | 'list') => {
    setViewMode(mode);
    window.localStorage.setItem('phrasebook-library-view', mode);
  };

  // State cho Quick Action Menu trong List View
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Danh sách chủ đề ĐỘNG theo loại bài học đang xem (kind)
  const currentCategoryTopics = useMemo(() => {
    const lessonsInKind =
      kind === 'all' ? all : all.filter((l) => l.type === kind);
    return [...new Set(lessonsInKind.map((l) => l.topic).filter(Boolean))].sort(
      (a, b) => a.localeCompare(b, 'vi'),
    );
  }, [all, kind]);

  // Đổi loại bài: tự động reset topic về 'all' nếu tab mới không chứa topic cũ
  const handleTabChange = (newKind: string) => {
    onKindChange(newKind);
    if (topic !== 'all') {
      const lessonsInNewKind =
        newKind === 'all' ? all : all.filter((l) => l.type === newKind);
      const hasTopic = lessonsInNewKind.some((l) => l.topic === topic);
      if (!hasTopic) {
        onTopicChange('all');
      }
    }
  };

  const isFiltering =
    Boolean(query.trim()) ||
    kind !== 'all' ||
    status !== 'all' ||
    topic !== 'all';

  const clearFilters = () => {
    onQueryChange('');
    onKindChange('all');
    onStatusChange('all');
    onTopicChange('all');
  };

  // Phát âm nhanh cho dòng trong List View
  const handleQuickPlay = (e: React.MouseEvent, text: string) => {
    e.stopPropagation();
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text.trim());
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
  };

  return (
    <>
      <div className={ui('page-heading')}>
        <div>
          <span className={ui('eyebrow')}>{t('library.eyebrow')}</span>
          <h1>
            {t('library.title')}
            <span>.</span>
          </h1>
          <p>{t('library.description')}</p>
        </div>
        <button
          className={ui('button primary')}
          onClick={onAddLesson}
          disabled={!lessons || !!dbError}
        >
          <Plus size={18} /> {t('library.add')}
        </button>
      </div>

      <div className={ui('stats')}>
        <StatCard
          label={t('dashboard.totalLessons')}
          value={all.length}
          icon={Layers}
          color="green"
          description={t('library.inNotebook')}
          onClick={() => {
            onStatusChange('all');
            handleTabChange('all');
            onTopicChange('all');
          }}
        />
        <StatCard
          label={t('status.review')}
          value={counts.review}
          icon={Bookmark}
          color="amber"
          description={t('library.reviewHint')}
          onClick={() => onStatusChange('review')}
        />
        <StatCard
          label={t('status.learned')}
          value={counts.learned}
          icon={CheckCheck}
          color="blue"
          description={t('library.progressHint')}
          onClick={() => onStatusChange('learned')}
        />
      </div>

      {/* Banner Tiến độ tổng quan */}
      <LessonProgressSection all={all} />

      {/* Toolbar Loại bài học (Tab group) */}
      <div className={ui('library-toolbar')}>
        <div
          className={ui('tab-group')}
          role="group"
          aria-label={t('library.type')}
        >
          {[
            ['all', t('library.all')],
            ['phrase', t('lesson.phrase')],
            ['passage', t('lesson.passage')],
            ['structure', t('lesson.structure')],
          ].map(([value, label]) => (
            <button
              key={value}
              className={ui(kind === value ? 'active' : '')}
              onClick={() => handleTabChange(value)}
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
          <ArrowUpFromLine size={16} /> {t('library.import')}
        </button>
      </div>

      {/* Danh sách chủ đề (Topic chips) */}
      {currentCategoryTopics.length > 0 && (
        <div className="mb-4">
          <TopicChips
            topics={currentCategoryTopics}
            selectedTopic={topic}
            allLabel={t('library.allTopics')}
            onSelectTopic={onTopicChange}
          />
        </div>
      )}

      {/* Thanh tìm kiếm và bộ lọc Trạng thái / Sắp xếp */}
      <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-[minmax(0,1fr)_180px_180px]">
        <div className="min-w-0 sm:col-span-2 xl:col-span-1">
          <SearchInput value={query} onChange={onQueryChange} />
        </div>
        <FilterSelect
          label={t('library.statusFilter')}
          value={status}
          onChange={onStatusChange}
          options={[
            { value: 'all', label: t('library.allStatuses') },
            ...Object.entries(statusKeys).map(([value, key]) => ({
              value,
              label: t(key),
            })),
          ]}
        />
        <FilterSelect
          label={t('library.sort')}
          value={sort}
          onChange={onSortChange}
          options={[
            { value: 'latest', label: t('library.latest') },
            { value: 'az', label: t('library.englishAZ') },
          ]}
        />
      </div>

      {!lessons ? (
        <div className={ui('empty')}>
          <LoaderCircle className={ui('spin')} />
          {t('library.loading')}
        </div>
      ) : all.length === 0 || showIntroduction ? (
        <div className={ui('first-lesson')}>
          <div className={ui('first-copy')}>
            <span className={ui('eyebrow')}>{t('library.firstEyebrow')}</span>
            <h2>{t('library.firstTitle')}</h2>
            <p>{t('library.firstDescription')}</p>
            <button className={ui('button primary')} onClick={onAddLesson}>
              <Plus size={18} />{' '}
              {all.length ? t('library.writeNew') : t('library.writeFirst')}
            </button>
            <button
              className={ui('text-button examples-button')}
              onClick={onAddExamples}
            >
              <Sparkles size={16} /> {t('library.tryExamples')}
            </button>
          </div>
          <div className={ui('sample-note')}>
            <div className={ui('sample-label')}>
              <Bookmark size={16} /> {t('library.example')}
            </div>
            <p className={ui('sample-english')}>
              I’m going to
              <br />
              <mark>go home.</mark>
            </p>
            <p className={ui('sample-meaning')}>
              {t('library.exampleMeaning')}
            </p>
            <div className={ui('sample-rule')}>
              <span>{t('library.structure')}</span>
              <strong>be going to + V nguyên mẫu</strong>
              <p>{t('library.structureDescription')}</p>
            </div>
            <span className={ui('topic-chip')}>{t('library.lifeTopic')}</span>
          </div>
        </div>
      ) : filtered.length === 0 ? (
        <div className={ui('empty')}>
          <Search size={32} />
          <h2>{t('library.notFound')}</h2>
          <p>{t('library.notFoundDescription')}</p>
          <button className={ui('button secondary')} onClick={clearFilters}>
            {t('library.clearFilters')}
          </button>
        </div>
      ) : (
        <>
          {/* Thanh số lượng kết quả và nút chuyển đổi Grid / List View */}
          <div className="mt-6 mb-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-muted">
              <span className="font-bold text-text">
                {filtered.length} {t('library.lessonCount')}
              </span>
              {isFiltering && (
                <>
                  <span>·</span>
                  <span>(lọc từ {all.length} bài)</span>
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="inline-flex items-center gap-1 text-forest hover:underline font-semibold ml-1"
                  >
                    <RotateCcw size={12} />
                    <span>Xóa bộ lọc</span>
                  </button>
                </>
              )}
            </div>

            {/* Nút Toggle Grid / List View */}
            <div className="flex items-center rounded-xl border border-line bg-surface p-1 shadow-xs">
              <button
                type="button"
                onClick={() => changeViewMode('grid')}
                aria-label="Xem dạng lưới"
                title="Xem dạng lưới (Cards)"
                className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-forest text-white shadow-xs'
                    : 'text-muted hover:text-text'
                }`}
              >
                <LayoutGrid size={15} />
                <span className="hidden sm:inline">Lưới</span>
              </button>
              <button
                type="button"
                onClick={() => changeViewMode('list')}
                aria-label="Xem dạng danh sách"
                title="Xem dạng danh sách (List)"
                className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors ${
                  viewMode === 'list'
                    ? 'bg-forest text-white shadow-xs'
                    : 'text-muted hover:text-text'
                }`}
              >
                <List size={15} />
                <span className="hidden sm:inline">Danh sách</span>
              </button>
            </div>
          </div>

          {/* Hiển thị Dạng Lưới (Grid View) */}
          {viewMode === 'grid' ? (
            <div className={ui('lesson-grid')}>
              {filtered.map((lesson) => (
                <LessonCard
                  key={lesson.id}
                  lesson={lesson}
                  onSelect={onSelectLesson}
                  onEdit={onEditLesson}
                  onDelete={onDeleteLesson}
                  onStatusChange={onQuickStatusChange}
                />
              ))}
            </div>
          ) : (
            /* Hiển thị Dạng Danh sách gọn (List View) */
            <div className="overflow-hidden rounded-2xl border border-line bg-surface shadow-xs divide-y divide-line">
              {filtered.map((lesson) => {
                const isMenuOpen = activeMenuId === lesson.id;
                return (
                  <div
                    key={lesson.id}
                    onClick={() => onSelectLesson(lesson.id)}
                    className="group relative flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 transition-colors hover:bg-surface-soft/60 cursor-pointer"
                  >
                    {/* Cột trái: Loại bài + Câu Tiếng Anh + Bản dịch */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-forest">
                          {lesson.type === 'structure' ? (
                            <Layers size={13} />
                          ) : lesson.type === 'phrase' ? (
                            <Bookmark size={13} />
                          ) : (
                            <FileText size={13} className="text-status-info" />
                          )}
                          <span>
                            {lesson.type === 'structure'
                              ? t('lesson.structure')
                              : lesson.type === 'phrase'
                                ? t('lesson.phrase')
                                : t('lesson.passage')}
                          </span>
                        </span>
                        <span className="text-muted text-xs">·</span>
                        <span className="text-xs font-medium text-muted">
                          {lesson.topic || t('common.uncategorized')}
                        </span>
                        {lesson.highlights.length > 0 && (
                          <span className="hidden sm:inline-flex rounded bg-forest-soft px-1.5 py-0.5 text-[10px] font-bold text-forest">
                            {lesson.highlights.length} cụm từ
                          </span>
                        )}
                      </div>

                      <h3 className="text-base font-bold text-text truncate group-hover:text-forest transition-colors">
                        {lesson.english}
                      </h3>
                      <p className="text-xs sm:text-sm text-text-secondary truncate mt-0.5">
                        {lesson.meaning || t('lesson.noTranslation')}
                      </p>
                    </div>

                    {/* Cột phải: Badge trạng thái + Nút phát âm + Nút Tác vụ */}
                    <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-center">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          lesson.status === 'learned'
                            ? 'bg-status-learned-bg text-status-learned border border-status-learned/25'
                            : lesson.status === 'review'
                              ? 'bg-status-review-bg text-status-review border border-status-review/25'
                              : 'bg-status-new-bg text-status-new border border-line'
                        }`}
                      >
                        {lesson.status === 'learned' ? (
                          <Check size={12} />
                        ) : lesson.status === 'review' ? (
                          <Bookmark size={12} />
                        ) : (
                          <CircleDot size={12} />
                        )}
                        <span>{t(statusKeys[lesson.status])}</span>
                      </span>

                      {/* Nút phát âm nhanh */}
                      <button
                        type="button"
                        onClick={(e) => handleQuickPlay(e, lesson.english)}
                        title="Nghe phát âm"
                        className="grid size-8 place-items-center rounded-xl text-muted hover:bg-surface-soft hover:text-forest transition-colors"
                      >
                        <Volume2 size={16} />
                      </button>

                      {/* Dropdown Menu Tác vụ */}
                      <div className="relative">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveMenuId(isMenuOpen ? null : lesson.id);
                          }}
                          title="Tác vụ"
                          className="grid size-8 place-items-center rounded-xl text-muted hover:bg-surface-soft hover:text-text transition-colors"
                        >
                          <MoreHorizontal size={18} />
                        </button>

                        {isMenuOpen && (
                          <div
                            onClick={(e) => e.stopPropagation()}
                            className="absolute right-0 top-full z-30 mt-1 w-44 rounded-2xl border border-line bg-surface-elevated p-1.5 shadow-dropdown backdrop-blur-md animate-in fade-in-0 zoom-in-95 duration-100"
                          >
                            <button
                              type="button"
                              onClick={(e) => {
                                handleQuickPlay(e, lesson.english);
                                setActiveMenuId(null);
                              }}
                              className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-text hover:bg-surface-soft transition-colors"
                            >
                              <Volume2 size={14} className="text-forest" />
                              <span>Nghe phát âm</span>
                            </button>

                            {onEditLesson && (
                              <button
                                type="button"
                                onClick={() => {
                                  setActiveMenuId(null);
                                  onEditLesson(lesson);
                                }}
                                className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-text hover:bg-surface-soft transition-colors"
                              >
                                <Pencil size={14} className="text-muted" />
                                <span>{t('common.edit')}</span>
                              </button>
                            )}

                            {onQuickStatusChange && (
                              <div className="my-1 border-t border-line/60 pt-1">
                                <span className="block px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-muted">
                                  Đổi trạng thái
                                </span>
                                {(
                                  ['new', 'review', 'learned'] as Status[]
                                ).map((statusItem) => (
                                  <button
                                    key={statusItem}
                                    type="button"
                                    onClick={() => {
                                      setActiveMenuId(null);
                                      onQuickStatusChange(
                                        lesson.id,
                                        statusItem,
                                      );
                                    }}
                                    className={`flex w-full items-center justify-between rounded-xl px-3 py-1.5 text-xs transition-colors ${
                                      lesson.status === statusItem
                                        ? 'bg-surface-soft font-bold text-forest'
                                        : 'text-text hover:bg-surface-soft'
                                    }`}
                                  >
                                    <span>{t(statusKeys[statusItem])}</span>
                                    {lesson.status === statusItem && (
                                      <Check size={13} />
                                    )}
                                  </button>
                                ))}
                              </div>
                            )}

                            {onDeleteLesson && (
                              <div className="mt-1 border-t border-line/60 pt-1">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setActiveMenuId(null);
                                    onDeleteLesson(lesson);
                                  }}
                                  className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-status-danger hover:bg-status-danger-bg transition-colors"
                                >
                                  <Trash2 size={14} />
                                  <span>{t('detail.deleteLesson')}</span>
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {all.length > 0 && !showIntroduction && (
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            className={ui('text-button')}
            onClick={() => onShowIntroductionChange(true)}
          >
            <Sparkles size={16} /> {t('library.showIntroduction')}
          </button>
        </div>
      )}
      <WorkspaceFooter />
    </>
  );
};

export default LibraryPage;
