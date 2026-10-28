import { useBackupTransfer } from '@/app/hooks/useBackupTransfer';
import { useLessonLibrary } from '@/app/hooks/useLessonLibrary';
import { usePhrasebookModelContext } from '@/app/hooks/usePhrasebookModelContext';
import { useReviewSession } from '@/app/hooks/useReviewSession';
import { db, type Lesson } from '@/db';
import { useGoogleDrive } from '@/hooks/useGoogleDrive';
import type { AppView } from '@/navigation';
import { isAdminAccount } from '@/services/admin-auth';
import { useState } from 'react';

export const usePhrasebookApp = () => {
  usePhrasebookModelContext();

  const drive = useGoogleDrive();
  const library = useLessonLibrary();
  const [view, setView] = useState<AppView>('dashboard');
  const [editing, setEditing] = useState<Lesson | null | undefined>(undefined);
  const [detailId, setDetailId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<Lesson | null>(null);
  const [toast, setToast] = useState('');
  const [busy, setBusy] = useState(false);

  const notify = (message: string) => setToast(message);
  const runAction = async (
    action: () => Promise<unknown>,
    success?: string,
  ) => {
    try {
      await action();
      if (success) notify(success);
    } catch (error) {
      notify(
        (error as Error).message || 'Không thể lưu thay đổi. Vui lòng thử lại.',
      );
    }
  };

  const backup = useBackupTransfer({ notify, setBusy });
  const review = useReviewSession({
    lessons: library.all,
    busy,
    setBusy,
    notify,
  });

  const navigate = (nextView: AppView) => {
    setView(nextView);
    setDetailId(null);
  };

  const updateLessonStatus = async (id: string, status: Lesson['status']) => {
    await runAction(async () => {
      await db.lessons.update(id, {
        status,
        updatedAt: new Date().toISOString(),
      });
    });
  };

  return {
    drive,
    isAdmin: isAdminAccount(drive.account),
    library,
    backup,
    review,
    view,
    editing,
    detailId,
    detail: library.all.find((lesson) => lesson.id === detailId),
    deleting,
    toast,
    busy,
    setView,
    setEditing,
    setDetailId,
    setDeleting,
    setToast,
    notify,
    runAction,
    navigate,
    updateLessonStatus,
  };
};

export type PhrasebookAppController = ReturnType<typeof usePhrasebookApp>;
