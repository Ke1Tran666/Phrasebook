import type { PhrasebookAppController } from '@/app/hooks/usePhrasebookApp';
import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';
import { exampleLessons, importLessons } from '@/db';
import BackupPage from '@/pages/BackupPage';
import DashboardPage from '@/pages/DashboardPage';
import LibraryPage from '@/pages/LibraryPage';
import ProfilePage from '@/pages/ProfilePage';
import ReviewPage from '@/pages/ReviewPage';
import UpdatesPage from '@/pages/UpdatesPage';
import { isLessonDue } from '@/review-schedule';
import { ui } from '@/styles/ui';

type AppWorkspaceProps = {
  controller: PhrasebookAppController;
};

const AppWorkspace = ({ controller }: AppWorkspaceProps) => {
  const {
    drive,
    isAdmin,
    library,
    backup,
    review,
    view,
    busy,
    setView,
    setEditing,
    setDetailId,
    setDeleting,
    navigate,
    notify,
    runAction,
    updateLessonStatus,
  } = controller;

  return (
    <>
      <Sidebar
        view={view}
        account={drive.account}
        nav={navigate}
        all={library.all}
        counts={library.counts}
        topics={library.topics}
        topic={library.topic}
        setTopic={library.setTopic}
        setStatus={library.setStatus}
        setKind={library.setKind}
      />
      <main className={ui('main-content')}>
        <Topbar
          view={view}
          connected={!!drive.account}
          dueCount={library.counts.review}
          isAdmin={isAdmin}
          onNavigate={setView}
        />
        <div className={ui('workspace')}>
          {library.dbError && (
            <div className={ui('error')} role="alert">
              {library.dbError}
            </div>
          )}

          {view === 'dashboard' && (
            <DashboardPage
              lessons={library.lessons}
              all={library.all}
              dueLessons={library.all.filter((lesson) => isLessonDue(lesson))}
              topics={library.topics}
              counts={library.counts}
              accountName={drive.account?.name}
              onOpenLessons={() => navigate('lessons')}
              onOpenExamPractice={() => navigate('exam-practice')}
              onAddLesson={() => setEditing(null)}
              onSelectLesson={setDetailId}
            />
          )}

          {view === 'lessons' && (
            <LibraryPage
              lessons={library.lessons}
              all={library.all}
              filtered={library.filtered}
              topics={library.topics}
              counts={library.counts}
              query={library.query}
              kind={library.kind}
              status={library.status}
              topic={library.topic}
              sort={library.sort}
              showIntroduction={library.showIntroduction}
              busy={busy}
              dbError={library.dbError}
              onAddLesson={() => setEditing(null)}
              onImportFile={() => backup.inputFile.current?.click()}
              onAddExamples={() =>
                runAction(async () => {
                  await importLessons(exampleLessons());
                  library.setShowIntroduction(false);
                }, 'Đã thêm 3 bài mẫu. Bạn có thể sửa hoặc xóa tùy ý.')
              }
              onSelectLesson={setDetailId}
              onEditLesson={setEditing}
              onDeleteLesson={setDeleting}
              onQuickStatusChange={updateLessonStatus}
              onQueryChange={library.setQuery}
              onKindChange={library.setKind}
              onStatusChange={library.setStatus}
              onTopicChange={library.setTopic}
              onSortChange={library.setSort}
              onShowIntroductionChange={library.setShowIntroduction}
            />
          )}

          {view === 'exam-practice' && (
            <ReviewPage
              all={library.all}
              savedStructures={library.savedStructures}
              reviewPoolCount={review.reviewPool.length}
              reviewTopics={review.reviewTopics}
              reviewTopic={review.reviewTopic}
              reviewMode={review.reviewMode}
              reviewIds={review.reviewIds}
              reviewIndex={review.reviewIndex}
              current={review.current}
              finished={review.finished}
              flipped={review.flipped}
              busy={busy}
              onReviewTopicChange={review.setReviewTopic}
              onReviewModeChange={review.changeMode}
              onStart={review.start}
              onRestart={review.reset}
              onEnd={review.reset}
              onOpenLibrary={() => navigate('lessons')}
              onAddFirstLesson={() => {
                navigate('lessons');
                setEditing(null);
              }}
              onReveal={() => review.setFlipped(true)}
              onGrade={review.grade}
            />
          )}

          {view === 'profile' && (
            <ProfilePage
              account={drive.account}
              total={library.all.length}
              review={library.counts.review}
              learned={library.counts.learned}
              onBack={() => navigate('dashboard')}
              onBackup={() => navigate('backup')}
            />
          )}

          {view === 'updates' && (
            <UpdatesPage notify={notify} isAdmin={isAdmin} />
          )}

          {view === 'backup' && (
            <BackupPage
              drive={drive}
              lessons={library.lessons}
              all={library.all}
              busy={busy}
              dbError={library.dbError}
              importResult={backup.importResult}
              onRestore={backup.setPendingImport}
              onExport={backup.exportFile}
              onChooseFile={() => backup.inputFile.current?.click()}
              onReadFile={(file) => void backup.readFile(file)}
            />
          )}
        </div>
      </main>
    </>
  );
};

export default AppWorkspace;
