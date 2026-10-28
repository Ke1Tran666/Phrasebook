import {
  db,
  importLessons,
  parseBackup,
  serializeBackup,
  type Lesson,
} from '@/db';
import { logActivity } from '@/services/activity-log';
import { useRef, useState, type Dispatch, type SetStateAction } from 'react';

type UseBackupTransferOptions = {
  notify: (message: string) => void;
  setBusy: Dispatch<SetStateAction<boolean>>;
};

export const useBackupTransfer = ({
  notify,
  setBusy,
}: UseBackupTransferOptions) => {
  const inputFile = useRef<HTMLInputElement>(null);
  const [pendingImport, setPendingImport] = useState<Lesson[] | null>(null);
  const [importResult, setImportResult] = useState<{
    added: number;
    skipped: number;
  } | null>(null);

  const exportFile = async () => {
    try {
      const records = await db.lessons.toArray();
      const url = URL.createObjectURL(
        new Blob([serializeBackup(records)], { type: 'application/json' }),
      );
      const link = document.createElement('a');
      link.href = url;
      link.download = `phrasebook-${new Date().toISOString().slice(0, 10)}.json`;
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 30000);
      notify('Đã tạo file sao lưu. Kiểm tra thư mục tải xuống.');
      logActivity({
        type: 'backup_exported',
        title: 'Xuất file sao lưu',
        description: `Đã xuất ${records.length} bài học ra file JSON.`,
        view: 'backup',
        linkText: 'Quản lý sao lưu',
      });
    } catch {
      notify('Không thể xuất dữ liệu. Vui lòng thử lại.');
    }
  };

  const readFile = async (file?: File) => {
    if (!file) return;
    setBusy(true);
    try {
      if (file.size > 10 * 1024 * 1024) {
        throw Error('File quá lớn. Vui lòng chọn file dưới 10 MB.');
      }
      setPendingImport(parseBackup(await file.text()));
    } catch (error) {
      notify((error as Error).message);
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
      logActivity({
        type: 'backup_imported',
        title: 'Nhập dữ liệu bài học',
        description: `Thêm ${result.added} bài học mới, bỏ qua ${result.skipped} bài trùng.`,
        view: 'lessons',
        linkText: 'Xem trong thư viện',
      });
      notify(
        `Đã thêm ${result.added} bài học · Bỏ qua ${result.skipped} bài trùng.`,
      );
    } catch (error) {
      notify((error as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return {
    inputFile,
    pendingImport,
    importResult,
    setPendingImport,
    exportFile,
    readFile,
    confirmImport,
  };
};
