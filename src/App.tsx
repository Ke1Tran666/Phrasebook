import BackupPage from '@/pages/BackupPage';
import DashboardPage from '@/pages/DashboardPage';
import LibraryPage from '@/pages/LibraryPage';
import ProfilePage from '@/pages/ProfilePage';
import ReviewPage from '@/pages/ReviewPage';
import type { AppView } from '@/navigation';
import { useGoogleDrive } from '@/hooks/useGoogleDrive';
import { ui } from '@/styles/ui';
import {
  buildReviewSession,
  createReviewUpdate,
  isLessonDue,
  type ReviewMode,
} from '@/review-schedule';
import { useLiveQuery } from 'dexie-react-hooks';
import { ArrowUpFromLine, Check, LoaderCircle, Trash2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import LessonForm from '@/components/LessonForm';
import LessonDetailModal from '@/components/LessonDetailModal';
import Toast from '@/components/Toast';
import Modal from '@/components/Modal';
import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';
import {
  db,
  exampleLessons,
  importLessons,
  parseBackup,
  serializeBackup,
  type Lesson,
  type Status,
} from '@/db';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import { useLanguage } from '@/language';

const App = () => {
  const { t } = useLanguage();
  if (window.location.pathname === '/privacy') {
    return <PrivacyPolicyPage />;
  }

  const drive = useGoogleDrive();
  const [dbError, setDbError] = useState('');
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
  const savedStructures = all.filter((lesson) => lesson.type === 'structure');
  const [view, setView] = useState<AppView>('dashboard');
  const [showIntroduction, setShowIntroduction] = useState(false);
  const [query, setQuery] = useState('');
  const [kind, setKind] = useState('all');
  const [status, setStatus] = useState('all');
  const [topic, setTopic] = useState('all');
  const [sort, setSort] = useState('latest');
  const [editing, setEditing] = useState<Lesson | null | undefined>(undefined);
  const [detailId, setDetailId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<Lesson | null>(null);
  const [toast, setToast] = useState('');
  const [pendingImport, setPendingImport] = useState<Lesson[] | null>(null);
  const [busy, setBusy] = useState(false);
  const [reviewIds, setReviewIds] = useState<string[] | null>(null);
  const [reviewIndex, setReviewIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [reviewTopic, setReviewTopic] = useState('all');
  const [reviewMode, setReviewMode] = useState<ReviewMode>('content');
  const [importResult, setImportResult] = useState<{
    added: number;
    skipped: number;
  } | null>(null);
  const inputFile = useRef<HTMLInputElement>(null);
  const detail = all.find((l) => l.id === detailId);
  const topics = [...new Set(all.map((l) => l.topic).filter(Boolean))].sort(
    (a, b) => a.localeCompare(b, 'vi'),
  );
  const counts = {
    new: all.filter((l) => l.status === 'new').length,
    review: all.filter((l) => isLessonDue(l)).length,
    learned: all.filter((l) => l.status === 'learned').length,
  };
  const filtered = all
    .filter(
      (l) =>
        (kind === 'all' || l.type === kind) &&
        (status === 'all' || l.status === status) &&
        (topic === 'all' || l.topic === topic) &&
        `${l.english} ${l.meaning} ${l.notes} ${l.topic}`
          .toLocaleLowerCase()
          .includes(query.toLocaleLowerCase().trim()),
    )
    .sort((a, b) =>
      sort === 'az'
        ? a.english.localeCompare(b.english)
        : b.updatedAt.localeCompare(a.updatedAt),
    );
  const notify = (m: string) => setToast(m);

  const act = async (fn: () => Promise<unknown>, success?: string) => {
    try {
      await fn();
      if (success) notify(success);
    } catch (e) {
      notify(
        (e as Error).message || 'Không thể lưu thay đổi. Vui lòng thử lại.',
      );
    }
  };

  useEffect(() => {
    const ctx = (
      document as Document & {
        modelContext?: {
          registerTool: (tool: unknown, options: unknown) => unknown;
        };
      }
    ).modelContext;
    if (!ctx?.registerTool) return;
    const lifecycle = new AbortController();
    try {
      Promise.resolve(
        ctx.registerTool(
          {
            name: 'list_phrasebook_lessons',
            description:
              'Read the lessons stored in this browser without changing them.',
            inputSchema: {
              type: 'object',
              properties: {},
              additionalProperties: false,
            },
            annotations: { readOnlyHint: true, untrustedContentHint: true },
            execute: async (input: unknown) => {
              if (
                !input ||
                typeof input !== 'object' ||
                Object.keys(input).length
              )
                throw Error('Expected an empty object.');
              return { lessons: await db.lessons.toArray() };
            },
          },
          { signal: lifecycle.signal },
        ),
      ).catch(() => {});
    } catch {}
    return () => lifecycle.abort();
  }, []);

  const exportFile = async () => {
    try {
      const records = await db.lessons.toArray();
      const url = URL.createObjectURL(
        new Blob([serializeBackup(records)], { type: 'application/json' }),
      );
      const a = document.createElement('a');
      a.href = url;
      a.download = `phrasebook-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 30000);
      notify('Đã tạo file sao lưu. Kiểm tra thư mục tải xuống.');
    } catch {
      notify('Không thể xuất dữ liệu. Vui lòng thử lại.');
    }
  };

  const readFile = async (file?: File) => {
    if (!file) return;
    setBusy(true);
    try {
      if (file.size > 10 * 1024 * 1024)
        throw Error('File quá lớn. Vui lòng chọn file dưới 10 MB.');
      setPendingImport(parseBackup(await file.text()));
    } catch (e) {
      notify((e as Error).message);
    } finally {
      setBusy(false);
      if (inputFile.current) inputFile.current.value = '';
    }
  };

  const confirmImport = async () => {
    if (!pendingImport) return;
    setBusy(true);
    try {
      const result = await importLessons(pendingImport);
      setImportResult(result);
      setPendingImport(null);
      notify(
        `Đã thêm ${result.added} bài học · Bỏ qua ${result.skipped} bài trùng.`,
      );
    } catch (e) {
      notify((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const reviewLessons = all.filter((lesson) =>
    reviewMode === 'structure'
      ? lesson.type === 'structure'
      : lesson.type === 'phrase' || lesson.type === 'passage',
  );
  const reviewTopics = [
    ...new Set(reviewLessons.map((lesson) => lesson.topic).filter(Boolean)),
  ].sort((a, b) => a.localeCompare(b, 'vi'));
  const reviewPool = reviewLessons.filter(
    (lesson) =>
      isLessonDue(lesson) &&
      (reviewTopic === 'all' || lesson.topic === reviewTopic),
  );
  const current = reviewIds
    ? all.find((l) => l.id === reviewIds[reviewIndex])
    : null;
  const finished =
    reviewIds !== null && (reviewIndex >= reviewIds.length || !current);

  const grade = async (next: Status) => {
    if (!current || busy) return;
    setBusy(true);
    try {
      // Truyền current vào createReviewUpdate để tính toán thang ngày lũy tiến
      await db.lessons.update(current.id, {
        ...createReviewUpdate(next, current),
      });
      setReviewIndex((i) => i + 1);
      setFlipped(false);
    } catch {
      notify('Chưa lưu được tiến độ. Hãy thử lại.');
    } finally {
      setBusy(false);
    }
  };

  const nav = (v: typeof view) => {
    setView(v);
    setDetailId(null);
  };

  return (
    <div className={ui('app-shell')}>
      <Sidebar
        view={view}
        account={drive.account}
        nav={nav}
        all={all}
        counts={counts}
        topics={topics}
        topic={topic}
        setTopic={setTopic}
        setStatus={setStatus}
        setKind={setKind}
      />
      <main className={ui('main-content')}>
        <Topbar view={view} connected={!!drive.account} />
        <div className={ui('workspace')}>
          {dbError && (
            <div className={ui('error')} role="alert">
              {dbError}
            </div>
          )}
          {view === 'dashboard' && (
            <DashboardPage
              lessons={lessons}
              all={all}
              dueLessons={all.filter((lesson) => isLessonDue(lesson))}
              topics={topics}
              counts={counts}
              accountName={drive.account?.name}
              onOpenLessons={() => nav('lessons')}
              onOpenExamPractice={() => nav('exam-practice')}
              onAddLesson={() => setEditing(null)}
              onSelectLesson={setDetailId}
            />
          )}
          {view === 'lessons' && (
            <LibraryPage
              lessons={lessons}
              all={all}
              filtered={filtered}
              topics={topics}
              counts={counts}
              query={query}
              kind={kind}
              status={status}
              topic={topic}
              sort={sort}
              showIntroduction={showIntroduction}
              busy={busy}
              dbError={dbError}
              onAddLesson={() => setEditing(null)}
              onImportFile={() => inputFile.current?.click()}
              onAddExamples={() =>
                act(async () => {
                  await importLessons(exampleLessons());
                  setShowIntroduction(false);
                }, 'Đã thêm 3 bài mẫu. Bạn có thể sửa hoặc xóa tùy ý.')
              }
              onSelectLesson={setDetailId}
              onQueryChange={setQuery}
              onKindChange={setKind}
              onStatusChange={setStatus}
              onTopicChange={setTopic}
              onSortChange={setSort}
              onShowIntroductionChange={setShowIntroduction}
            />
          )}
          {view === 'exam-practice' && (
            <ReviewPage
              all={all}
              savedStructures={savedStructures}
              reviewPoolCount={reviewPool.length}
              reviewTopics={reviewTopics}
              reviewTopic={reviewTopic}
              reviewMode={reviewMode}
              reviewIds={reviewIds}
              reviewIndex={reviewIndex}
              current={current}
              finished={finished}
              flipped={flipped}
              busy={busy}
              onReviewTopicChange={setReviewTopic}
              onReviewModeChange={(mode) => {
                setReviewMode(mode);
                setReviewTopic('all');
              }}
              onStart={() => {
                setReviewIds(
                  buildReviewSession(
                    all,
                    reviewTopic,
                    new Date(),
                    Math.random,
                    reviewMode,
                  ).map((lesson) => lesson.id),
                );
                setReviewIndex(0);
                setFlipped(false);
              }}
              onRestart={() => setReviewIds(null)}
              onEnd={() => setReviewIds(null)}
              onOpenLibrary={() => nav('lessons')}
              onAddFirstLesson={() => {
                nav('lessons');
                setEditing(null);
              }}
              onReveal={() => setFlipped(true)}
              onGrade={grade}
            />
          )}
          {view === 'profile' && (
            <ProfilePage
              account={drive.account}
              total={all.length}
              review={counts.review}
              learned={counts.learned}
              onBack={() => nav('dashboard')}
              onBackup={() => nav('backup')}
            />
          )}
          {view === 'backup' && (
            <BackupPage
              drive={drive}
              lessons={lessons}
              all={all}
              busy={busy}
              dbError={dbError}
              importResult={importResult}
              onRestore={setPendingImport}
              onExport={exportFile}
              onChooseFile={() => inputFile.current?.click()}
              onReadFile={(file) => void readFile(file)}
            />
          )}
        </div>
      </main>

      <input
        ref={inputFile}
        type="file"
        accept=".json,application/json"
        hidden
        onChange={(e) => void readFile(e.target.files?.[0])}
      />

      <LessonForm
        lesson={editing}
        onClose={() => setEditing(undefined)}
        onSaved={() => setEditing(undefined)}
        notify={notify}
      />

      {/* Modal chi tiết bài học đã được tách riêng */}
      {editing === undefined && (
        <LessonDetailModal
          detail={detail}
          savedStructures={savedStructures}
          onClose={() => setDetailId(null)}
          onEdit={(item) => setEditing(item)}
          onDelete={(item) => {
            setDeleting(item);
            setDetailId(null);
          }}
        />
      )}

      {/* Modal xác nhận xóa */}
      <Modal
        open={!!deleting}
        label={t('detail.deleteLesson')}
        onClose={() => setDeleting(null)}
      >
        <div className={ui('confirm-content')}>
          <span className={ui('stat-icon red')}>
            <Trash2 />
          </span>
          <h2>{t('detail.deleteQuestion')}</h2>
          <p className="delete-preview">{deleting?.english}</p>
          <p>{t('detail.deleteDescription')}</p>
          <div className={ui('confirm-actions')}>
            <button
              className={ui('button secondary')}
              onClick={() => setDeleting(null)}
            >
              {t('detail.keep')}
            </button>
            <button
              className={ui('button danger-button')}
              onClick={() =>
                act(async () => {
                  if (deleting) await db.lessons.delete(deleting.id);
                  setDeleting(null);
                }, 'Đã xóa bài học.')
              }
            >
              {t('detail.deleteLesson')}
            </button>
          </div>
        </div>
      </Modal>

      {/* Modal xác nhận nhập */}
      <Modal
        open={pendingImport !== null}
        label={t('detail.importLabel')}
        onClose={() => {
          if (!busy) setPendingImport(null);
        }}
      >
        <div className={ui('confirm-content')}>
          <span className={ui('stat-icon blue')}>
            <ArrowUpFromLine />
          </span>
          <h2>{t('detail.importQuestion')}</h2>
          <p>
            {t('detail.validFile')}{' '}
            <strong>
              {pendingImport?.length ?? 0} {t('library.lessonCount')}
            </strong>
            . {t('detail.importDescription')}
          </p>
          <div className={ui('confirm-actions')}>
            <button
              className={ui('button secondary')}
              disabled={busy}
              onClick={() => setPendingImport(null)}
            >
              {t('common.cancel')}
            </button>
            <button
              className={ui('button primary')}
              disabled={busy}
              onClick={confirmImport}
            >
              {busy ? (
                <LoaderCircle className={ui('spin')} size={16} />
              ) : (
                <Check size={16} />
              )}{' '}
              {t('detail.confirmImport')}
            </button>
          </div>
        </div>
      </Modal>

      <Toast message={toast} onMessageChange={setToast} />
    </div>
  );
};

export default App;
