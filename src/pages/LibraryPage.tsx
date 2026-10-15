import FilterSelect from '@/components/FilterSelect';
import LessonCard from '@/components/LessonCard';
import SearchInput from '@/components/SearchInput';
import StatCard from '@/components/StatCard';
import WorkspaceFooter from '@/components/WorkspaceFooter';
import type { Lesson } from '@/db';
import { ui } from '@/styles/ui';
import { useLanguage, type MessageKey } from '@/language';
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

const statusKeys: Record<Lesson['status'], MessageKey> = {
  new: 'status.new',
  review: 'status.review',
  learned: 'status.learned',
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
  const { t } = useLanguage();
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
          <Plus size={19} /> {t('library.add')}
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
            onKindChange('all');
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
          <ArrowUpFromLine size={16} /> {t('library.import')}
        </button>
      </div>

      <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-3 xl:grid-cols-[minmax(0,1fr)_180px_180px_180px]">
        <div className="min-w-0 sm:col-span-3 xl:col-span-1">
          <SearchInput value={query} onChange={onQueryChange} />
        </div>
        <FilterSelect
          label={t('library.topicFilter')}
          value={topic}
          onChange={onTopicChange}
          options={[
            { value: 'all', label: t('library.allTopics') },
            ...topics.map((item) => ({ value: item, label: item })),
          ]}
        />
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
          <div className={ui('results-caption')}>
            {filtered.length} {t('library.lessonCount')}{' '}
            <span>{t('library.openHint')}</span>
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
            <Sparkles size={16} /> {t('library.showIntroduction')}
          </button>
        </div>
      )}
      <WorkspaceFooter />
    </>
  );
};

export default LibraryPage;
