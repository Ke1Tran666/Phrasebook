import ListenButton from '@/components/ListenButton';
import ProfilePage from '@/pages/ProfilePage';
import type { AppView } from '@/navigation';
import GoogleDriveBackup from '@/components/GoogleDriveBackup';
import { useGoogleDrive } from '@/hooks/useGoogleDrive';
import { ui } from '@/styles/ui';
import StructureSuggestions from '@/components/StructureSuggestions';
import { statusText } from '@/lesson-status';
import { useLiveQuery } from 'dexie-react-hooks';
import {
  ArrowDownToLine,
  ArrowLeft,
  ArrowRight,
  ArrowUpFromLine,
  BookOpen,
  Bookmark,
  Check,
  CheckCheck,
  FileText,
  GraduationCap,
  Layers,
  LoaderCircle,
  Pencil,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  Trash2,
  X,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import LessonForm from '@/components/LessonForm';
import Toast from '@/components/Toast';
import English from '@/components/English';
import LessonCard from '@/components/LessonCard';
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
import SearchInput from './components/SearchInput';
import FilterSelect from './components/FilterSelect';
import StatCard from './components/StatCard';
import WorkspaceFooter from './components/WorkspaceFooter';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';

const App = () => {
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
  const [view, setView] = useState<AppView>('library');
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
  const [reviewAll, setReviewAll] = useState(false);
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
    review: all.filter((l) => l.status === 'review').length,
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
  const reviewPool = all.filter((l) => reviewAll || l.status !== 'learned');
  const current = reviewIds
    ? all.find((l) => l.id === reviewIds[reviewIndex])
    : null;
  const finished =
    reviewIds !== null && (reviewIndex >= reviewIds.length || !current);
  const grade = async (next: Status) => {
    if (!current || busy) return;
    setBusy(true);
    try {
      await db.lessons.update(current.id, {
        status: next,
        updatedAt: new Date().toISOString(),
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
        <Topbar view={view} />
        <div className={ui('workspace')}>
          {dbError && (
            <div className={ui('error')} role="alert">
              {dbError}
            </div>
          )}
          {view === 'library' && (
            <>
              <div className={ui('page-heading')}>
                <div>
                  <span className={ui('eyebrow')}>YOUR WORDS, YOUR WORLD</span>
                  <h1>
                    Sổ bài học<span>.</span>
                  </h1>
                  <p>
                    Giữ lại những câu hay. Biến chúng thành tiếng Anh của bạn.
                  </p>
                </div>
                <button
                  className={ui('button primary')}
                  onClick={() => setEditing(null)}
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
                    setStatus('all');
                    setKind('all');
                    setTopic('all');
                  }}
                />

                <StatCard
                  label="Cần ôn tập"
                  value={counts.review}
                  icon={Bookmark}
                  color="amber"
                  description="Thêm một lần để nhớ"
                  onClick={() => setStatus('review')}
                />

                <StatCard
                  label="Đã ghi nhớ"
                  value={counts.learned}
                  icon={CheckCheck}
                  color="blue"
                  description="Từng chút tiến bộ"
                  onClick={() => setStatus('learned')}
                />
              </div>
              <div className={ui('library-toolbar')}>
                <div
                  className={ui('tab-group')}
                  role="group"
                  aria-label="Loại bài học"
                >
                  {[
                    ['all', 'Tất cả'],
                    ['phrase', 'Cụm từ / câu'],
                    ['passage', 'Đoạn văn'],
                    ['structure', 'Cấu trúc câu'],
                  ].map(([v, label]) => (
                    <button
                      key={v}
                      className={ui(kind === v ? 'active' : '')}
                      onClick={() => setKind(v)}
                    >
                      {label}
                      {v === 'all' && <span>{all.length}</span>}
                    </button>
                  ))}
                </div>
                <button
                  className={ui('text-button')}
                  onClick={() => inputFile.current?.click()}
                  disabled={busy}
                >
                  <ArrowUpFromLine size={16} /> Nhập file
                </button>
              </div>
              <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-3 xl:grid-cols-[minmax(0,1fr)_180px_180px_180px]">
                <div className="min-w-0 sm:col-span-3 xl:col-span-1">
                  <SearchInput value={query} onChange={setQuery} />
                </div>
                <FilterSelect
                  label="Lọc chủ đề"
                  value={topic}
                  onChange={setTopic}
                  options={[
                    { value: 'all', label: 'Tất cả chủ đề' },
                    ...topics.map((topic) => ({ value: topic, label: topic })),
                  ]}
                />

                <FilterSelect
                  label="Lọc trạng thái"
                  value={status}
                  onChange={setStatus}
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
                  onChange={setSort}
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
                    <span className={ui('eyebrow')}>
                      TRANG ĐẦU TIÊN CỦA BẠN
                    </span>
                    <h2>
                      Một câu mới.
                      <br />
                      Một bước tiến nhỏ.
                    </h2>
                    <p>
                      Bắt đầu với một cụm từ bạn vừa gặp, một câu trong bộ phim
                      yêu thích hoặc một đoạn văn muốn hiểu rõ hơn.
                    </p>
                    <button
                      className={ui('button primary')}
                      onClick={() => setEditing(null)}
                    >
                      <Plus size={18} />{' '}
                      {all.length
                        ? 'Viết bài học mới'
                        : 'Viết bài học đầu tiên'}
                    </button>
                    <button
                      className={ui('text-button examples-button')}
                      onClick={() =>
                        act(async () => {
                          await importLessons(exampleLessons());
                          setShowIntroduction(false);
                        }, 'Đã thêm 3 bài mẫu. Bạn có thể sửa hoặc xóa tùy ý.')
                      }
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
                  <button
                    className={ui('button secondary')}
                    onClick={() => {
                      setQuery('');
                      setKind('all');
                      setStatus('all');
                      setTopic('all');
                    }}
                  >
                    Xóa bộ lọc
                  </button>
                </div>
              ) : (
                <>
                  <div className={ui('results-caption')}>
                    {filtered.length} bài học{' '}
                    <span>Bấm vào bài để xem và ghi chú</span>
                  </div>
                  <div className={ui('lesson-grid')}>
                    {filtered.map((l) => (
                      <LessonCard
                        key={l.id}
                        lesson={l}
                        onSelect={setDetailId}
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
                    onClick={() => setShowIntroduction(true)}
                  >
                    <Sparkles size={16} /> Xem lại giới thiệu
                  </button>
                </div>
              )}
              <WorkspaceFooter />
            </>
          )}
          {view === 'review' && (
            <>
              <div className={ui('page-heading')}>
                <div>
                  <span className={ui('eyebrow')}>
                    A LITTLE PRACTICE, EVERY DAY
                  </span>
                  <h1>
                    Ôn tập<span>.</span>
                  </h1>
                  <p>Đọc tiếng Anh, thử nhớ nghĩa, rồi kiểm tra lại.</p>
                </div>
              </div>
              {reviewIds === null ? (
                <div className={ui('review-start')}>
                  <span className={ui('review-symbol')}>
                    <GraduationCap size={42} />
                  </span>
                  <h2>Một lần gặp lại, nhớ lâu hơn.</h2>
                  <p>
                    Bạn có <strong>{reviewPool.length} bài học</strong> trong
                    lượt ôn này.
                  </p>
                  <label className={ui('checkbox-label')}>
                    <input
                      type="checkbox"
                      checked={reviewAll}
                      onChange={(e) => setReviewAll(e.target.checked)}
                    />{' '}
                    Bao gồm cả bài đã nhớ
                  </label>
                  <button
                    className={ui('button primary')}
                    disabled={!reviewPool.length}
                    onClick={() => {
                      setReviewIds(
                        reviewPool
                          .sort(
                            (a, b) =>
                              (a.status === 'review' ? -1 : 1) -
                              (b.status === 'review' ? -1 : 1),
                          )
                          .map((l) => l.id),
                      );
                      setReviewIndex(0);
                      setFlipped(false);
                    }}
                  >
                    Bắt đầu ôn tập <ArrowRight size={18} />
                  </button>
                  {!all.length && (
                    <button
                      className={ui('text-button')}
                      onClick={() => {
                        nav('library');
                        setEditing(null);
                      }}
                    >
                      Thêm bài học đầu tiên
                    </button>
                  )}
                </div>
              ) : finished ? (
                <div className={ui('review-start')}>
                  <span className={ui('review-symbol')}>
                    <CheckCheck size={42} />
                  </span>
                  <h2>Bạn đã hoàn thành lượt ôn!</h2>
                  <p>Tiến độ đã được lưu. Hẹn gặp lại ở một lượt học mới.</p>
                  <button
                    className={ui('button primary')}
                    onClick={() => setReviewIds(null)}
                  >
                    Về trang ôn tập
                  </button>
                  <button
                    className={ui('text-button')}
                    onClick={() => nav('library')}
                  >
                    Mở sổ bài học <ArrowRight size={17} />
                  </button>
                </div>
              ) : (
                current && (
                  <div className={ui('review-session')}>
                    <div className={ui('review-progress')}>
                      <button
                        className={ui('text-button')}
                        onClick={() => setReviewIds(null)}
                      >
                        <ArrowLeft size={17} /> Kết thúc lượt ôn
                      </button>
                      <span>
                        Bài {reviewIndex + 1} / {reviewIds.length}
                      </span>
                    </div>
                    <progress max={reviewIds.length} value={reviewIndex} />
                    <div className={ui('flashcard')}>
                      <span className={ui('topic-chip')}>
                        {current.topic || 'Chưa phân loại'}
                      </span>
                      <h2>
                        <English lesson={current} />
                      </h2>
                      <ListenButton
                        key={current.id}
                        text={current.english}
                        accessToken={drive.accessToken}
                      />
                      {flipped ? (
                        <div className={ui('answer')}>
                          <span className={ui('eyebrow')}>
                            {current.type === 'structure'
                              ? 'CÁCH DÙNG / Ý NGHĨA'
                              : 'NGHĨA TIẾNG VIỆT'}
                          </span>
                          <p>
                            {current.meaning || 'Bài học chưa có bản dịch.'}
                          </p>
                          {current.notes && (
                            <div className={ui('review-notes')}>
                              {current.notes}
                            </div>
                          )}
                          {current.highlights.map((h, i) => (
                            <p className="review-phrase" key={i}>
                              <strong>{h.text}</strong> —{' '}
                              {h.meaning || 'Chưa có ghi chú'}
                            </p>
                          ))}
                        </div>
                      ) : (
                        <p className={ui('recall-hint')}>
                          Bạn có nhớ nghĩa và cách dùng của câu này?
                        </p>
                      )}
                    </div>
                    {flipped ? (
                      <div className={ui('grade-buttons')}>
                        <button
                          className={ui('button secondary')}
                          disabled={busy}
                          onClick={() => grade('review')}
                        >
                          <Bookmark size={18} /> Cần ôn lại
                        </button>
                        <button
                          className={ui('button primary')}
                          disabled={busy}
                          onClick={() => grade('learned')}
                        >
                          <Check size={18} /> Đã nhớ
                        </button>
                      </div>
                    ) : (
                      <button
                        className={ui('button primary reveal-button')}
                        onClick={() => setFlipped(true)}
                      >
                        Hiện đáp án <ArrowRight size={17} />
                      </button>
                    )}
                  </div>
                )
              )}
            </>
          )}
          {view === 'profile' && (
            <ProfilePage
              account={drive.account}
              total={all.length}
              review={counts.review}
              learned={counts.learned}
              onBack={() => nav('library')}
              onBackup={() => nav('backup')}
            />
          )}
          {view === 'backup' && (
            <>
              <div className={ui('page-heading')}>
                <div>
                  <span className={ui('eyebrow')}>KEEP YOUR WORDS SAFE</span>
                  <h1>
                    Sao lưu dữ liệu<span>.</span>
                  </h1>
                  <p>Mang theo những gì bạn học, theo cách của bạn.</p>
                </div>
              </div>
              <GoogleDriveBackup
                drive={drive}
                onRestore={setPendingImport}
                disabled={busy || !!dbError || !lessons}
              />
              <div className={ui('backup-banner')}>
                <ShieldCheck size={28} />
                <div>
                  <strong>Dữ liệu đang nằm trên trình duyệt này</strong>
                  <p>
                    Xóa dữ liệu trang web có thể làm mất bài học. Hãy xuất file
                    định kỳ; khi đổi máy hoặc trình duyệt, nhập file để học
                    tiếp.
                  </p>
                </div>
              </div>
              <div className={ui('backup-grid')}>
                <section className={ui('backup-card')}>
                  <span className={ui('stat-icon green')}>
                    <ArrowDownToLine size={25} />
                  </span>
                  <h2>Xuất bản sao lưu</h2>
                  <p>
                    Lưu toàn bộ bài học, bản dịch, cụm từ, ghi chú và tiến độ
                    vào một file JSON.
                  </p>
                  <div className={ui('backup-count')}>
                    <strong>{all.length}</strong> bài học sẵn sàng để xuất
                  </div>
                  <button
                    className={ui('button primary')}
                    onClick={exportFile}
                    disabled={!lessons || !!dbError}
                  >
                    <ArrowDownToLine size={17} /> Xuất file JSON
                  </button>
                </section>
                <section className={ui('backup-card')}>
                  <span className={ui('stat-icon blue')}>
                    <ArrowUpFromLine size={25} />
                  </span>
                  <h2>Nhập bài học</h2>
                  <p>
                    Chọn file sao lưu Phrasebook từ máy. Bạn sẽ được xem số bài
                    trước khi nhập.
                  </p>
                  <div
                    className={ui('import-drop')}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      if (!busy) void readFile(e.dataTransfer.files[0]);
                    }}
                  >
                    <FileText size={26} />
                    <span>Kéo file JSON vào đây</span>
                    <small>Tối đa 10 MB</small>
                  </div>
                  <button
                    className={ui('button secondary')}
                    disabled={busy || !!dbError}
                    onClick={() => inputFile.current?.click()}
                  >
                    <ArrowUpFromLine size={17} /> Chọn file JSON
                  </button>
                </section>
              </div>
              {importResult && (
                <div className={ui('success-result')}>
                  <CheckCheck size={20} /> Lần nhập vừa rồi: thêm{' '}
                  {importResult.added} bài học, bỏ qua {importResult.skipped}{' '}
                  bài trùng.
                </div>
              )}
              <div className={ui('backup-explanation')}>
                <h3>Bài trùng được xử lý thế nào?</h3>
                <p>
                  Bài có cùng loại và nội dung tiếng Anh được xem là trùng,
                  không phân biệt chữ hoa/thường và khoảng trắng thừa. Bài đã có
                  sẽ được giữ nguyên, gồm ghi chú và tiến độ. Dữ liệu không tự
                  đồng bộ giữa các máy.
                </p>
              </div>
            </>
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
      <Modal
        open={!!detail && editing === undefined}
        label="Chi tiết bài học"
        onClose={() => setDetailId(null)}
        wide
      >
        {detail && (
          <>
            <div className={ui('modal-heading')}>
              <div>
                <span className={ui('eyebrow')}>
                  {detail.type === 'structure'
                    ? 'CẤU TRÚC CÂU'
                    : detail.type === 'phrase'
                      ? 'CỤM TỪ / CÂU'
                      : 'ĐOẠN VĂN'}
                </span>
                <span className={ui('detail-topic')}>
                  {detail.topic || 'Chưa phân loại'}
                </span>
              </div>
              <button
                className={ui('icon-button')}
                aria-label="Đóng"
                onClick={() => setDetailId(null)}
              >
                <X />
              </button>
            </div>
            <div className={ui('detail-body')}>
              <h2 className={ui('detail-english')}>
                <English lesson={detail} />
              </h2>
              <ListenButton
                key={detail.id}
                text={detail.english}
                accessToken={drive.accessToken}
              />
              {detail.type !== 'structure' && (
                <StructureSuggestions english={detail.english} />
              )}
              <div className={ui('detail-section')}>
                <span className={ui('eyebrow')}>NGHĨA TIẾNG VIỆT</span>
                <p>
                  {detail.meaning ||
                    'Chưa có bản dịch. Chỉnh sửa bài để bổ sung.'}
                </p>
              </div>
              {detail.highlights.length > 0 && (
                <div className={ui('detail-section')}>
                  <span className={ui('eyebrow')}>CỤM TỪ ĐÃ ĐÁNH DẤU</span>
                  {detail.highlights.map((h, i) => (
                    <div className={ui('phrase-row')} key={i}>
                      <strong>{h.text}</strong>
                      <p>{h.meaning || 'Chưa có ghi chú'}</p>
                    </div>
                  ))}
                </div>
              )}
              {detail.notes && (
                <div className={ui('detail-section notes-box')}>
                  <span className={ui('eyebrow')}>GHI CHÚ & VÍ DỤ</span>
                  <p>{detail.notes}</p>
                </div>
              )}
              <label className={ui('status-select')}>
                Trạng thái học
                <select
                  value={detail.status}
                  onChange={(e) =>
                    act(
                      () =>
                        db.lessons.update(detail.id, {
                          status: e.target.value as Status,
                          updatedAt: new Date().toISOString(),
                        }),
                      'Đã cập nhật trạng thái.',
                    )
                  }
                >
                  <option value="new">Chưa học</option>
                  <option value="review">Cần ôn</option>
                  <option value="learned">Đã nhớ</option>
                </select>
              </label>
            </div>
            <footer className={ui('modal-footer')}>
              <button
                className={ui('text-button danger')}
                onClick={() => {
                  setDeleting(detail);
                  setDetailId(null);
                }}
              >
                <Trash2 size={17} /> Xóa bài học
              </button>
              <button
                className={ui('button primary')}
                onClick={() => setEditing(detail)}
              >
                <Pencil size={16} /> Chỉnh sửa
              </button>
            </footer>
          </>
        )}
      </Modal>
      <Modal
        open={!!deleting}
        label="Xóa bài học"
        onClose={() => setDeleting(null)}
      >
        <div className={ui('confirm-content')}>
          <span className={ui('stat-icon red')}>
            <Trash2 />
          </span>
          <h2>Xóa bài học này?</h2>
          <p className="delete-preview">{deleting?.english}</p>
          <p>
            Bài học và ghi chú sẽ được xóa khỏi trình duyệt này. Bạn chỉ có thể
            khôi phục nếu đã xuất bản sao lưu.
          </p>
          <div className={ui('confirm-actions')}>
            <button
              className={ui('button secondary')}
              onClick={() => setDeleting(null)}
            >
              Giữ lại
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
              Xóa bài học
            </button>
          </div>
        </div>
      </Modal>
      <Modal
        open={pendingImport !== null}
        label="Xác nhận nhập dữ liệu"
        onClose={() => {
          if (!busy) setPendingImport(null);
        }}
      >
        <div className={ui('confirm-content')}>
          <span className={ui('stat-icon blue')}>
            <ArrowUpFromLine />
          </span>
          <h2>Nhập bài học từ file?</h2>
          <p>
            File hợp lệ, gồm{' '}
            <strong>{pendingImport?.length ?? 0} bài học</strong>. Bài mới sẽ
            được thêm; bài trùng được bỏ qua và giữ nguyên dữ liệu hiện tại.
          </p>
          <div className={ui('confirm-actions')}>
            <button
              className={ui('button secondary')}
              disabled={busy}
              onClick={() => setPendingImport(null)}
            >
              Hủy
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
              Xác nhận nhập
            </button>
          </div>
        </div>
      </Modal>
      <Toast message={toast} onMessageChange={setToast} />
    </div>
  );
};

export default App;
