import type { PhrasebookAppController } from '@/app/hooks/usePhrasebookApp';
import ConfirmDialog from '@/components/ConfirmDialog';
import LessonDetailModal from '@/components/LessonDetailModal';
import LessonForm from '@/components/LessonForm';
import Toast from '@/components/Toast';
import { db } from '@/db';
import { useLanguage } from '@/language';
import { logActivity } from '@/services/activity-log';
import { ArrowUpFromLine, Trash2 } from 'lucide-react';

type AppOverlaysProps = {
  controller: PhrasebookAppController;
};

const AppOverlays = ({ controller }: AppOverlaysProps) => {
  const { t } = useLanguage();
  const {
    library,
    backup,
    editing,
    detail,
    deleting,
    toast,
    busy,
    setEditing,
    setDetailId,
    setDeleting,
    setToast,
    notify,
    runAction,
  } = controller;

  return (
    <>
      <input
        ref={backup.inputFile}
        type="file"
        accept=".json,application/json"
        hidden
        onChange={(event) => void backup.readFile(event.target.files?.[0])}
      />

      <LessonForm
        lesson={editing}
        onClose={() => setEditing(undefined)}
        onSaved={(savedLesson) => {
          const isEdit = !!editing;
          logActivity({
            type: isEdit ? 'lesson_updated' : 'lesson_added',
            title: isEdit ? 'Cập nhật bài học' : 'Thêm bài học mới',
            description: `"${savedLesson.english.slice(0, 50)}${savedLesson.english.length > 50 ? '...' : ''}"`,
            view: 'lessons',
            linkText: 'Xem trong thư viện',
          });
          setEditing(undefined);
        }}
        notify={notify}
      />

      {editing === undefined && (
        <LessonDetailModal
          detail={detail}
          savedStructures={library.savedStructures}
          onClose={() => setDetailId(null)}
          onEdit={setEditing}
          onDelete={(lesson) => {
            setDeleting(lesson);
            setDetailId(null);
          }}
        />
      )}

      <ConfirmDialog
        open={!!deleting}
        label={t('detail.deleteLesson')}
        title={t('detail.deleteQuestion')}
        description={<p>{t('detail.deleteDescription')}</p>}
        preview={<p className="delete-preview">{deleting?.english}</p>}
        icon={Trash2}
        iconTone="red"
        cancelLabel={t('detail.keep')}
        confirmLabel={t('detail.deleteLesson')}
        destructive
        onClose={() => setDeleting(null)}
        onConfirm={() =>
          void runAction(async () => {
            if (deleting) {
              const deletedText = deleting.english;
              await db.lessons.delete(deleting.id);
              logActivity({
                type: 'lesson_deleted',
                title: 'Xóa bài học',
                description: `Đã xóa: "${deletedText.slice(0, 50)}${deletedText.length > 50 ? '...' : ''}"`,
              });
            }
            setDeleting(null);
          }, 'Đã xóa bài học.')
        }
      />

      <ConfirmDialog
        open={backup.pendingImport !== null}
        label={t('detail.importLabel')}
        title={t('detail.importQuestion')}
        description={
          <p>
            {t('detail.validFile')}{' '}
            <strong>
              {backup.pendingImport?.length ?? 0} {t('library.lessonCount')}
            </strong>
            . {t('detail.importDescription')}
          </p>
        }
        icon={ArrowUpFromLine}
        cancelLabel={t('common.cancel')}
        confirmLabel={t('detail.confirmImport')}
        pending={busy}
        onClose={() => {
          if (!busy) backup.setPendingImport(null);
        }}
        onConfirm={() => void backup.confirmImport()}
      />

      <Toast message={toast} onMessageChange={setToast} />
    </>
  );
};

export default AppOverlays;
