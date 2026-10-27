import GoogleDriveBackup from '@/components/GoogleDriveBackup';
import type { Lesson } from '@/db';
import type { useGoogleDrive } from '@/hooks/useGoogleDrive';
import { ui } from '@/styles/ui';
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  CheckCheck,
  CheckCircle2,
  FileText,
  FolderOpen,
  Info,
  ShieldCheck,
} from 'lucide-react';
import { useState, type DragEvent } from 'react';
import { useLanguage } from '@/language';

type BackupPageProps = {
  drive: ReturnType<typeof useGoogleDrive>;
  lessons?: Lesson[];
  all: Lesson[];
  busy: boolean;
  dbError: string;
  importResult: { added: number; skipped: number } | null;
  onRestore: (lessons: Lesson[]) => void;
  onExport: () => void;
  onChooseFile: () => void;
  onReadFile: (file?: File) => void;
};

const BackupPage = ({
  drive,
  lessons,
  all,
  busy,
  dbError,
  importResult,
  onRestore,
  onExport,
  onChooseFile,
  onReadFile,
}: BackupPageProps) => {
  const { t } = useLanguage();
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    if (!busy && event.dataTransfer.files?.[0]) {
      onReadFile(event.dataTransfer.files[0]);
    }
  };

  return (
    <>
      {/* Page Heading */}
      <div className={ui('page-heading')}>
        <div>
          <span className={ui('eyebrow')}>{t('backup.eyebrow')}</span>
          <h1>
            {t('backup.title')}
            <span>.</span>
          </h1>
          <p>{t('backup.subtitle')}</p>
        </div>
      </div>

      {/* Google Drive Card */}
      <GoogleDriveBackup
        drive={drive}
        onRestore={onRestore}
        disabled={busy || !!dbError || !lessons}
      />

      {/* Local Storage Privacy / Safety Notice */}
      <div className="mb-8 flex items-start gap-4 rounded-2xl border border-line bg-surface-soft p-5 sm:p-6 transition-colors shadow-xs">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-forest-soft text-forest">
          <ShieldCheck size={24} />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-sm sm:text-base font-bold text-text">
            {t('backup.localTitle')}
          </h2>
          <p className="mt-1 text-xs sm:text-sm leading-relaxed text-text-secondary">
            {t('backup.localDescription')}
          </p>
        </div>
      </div>

      {/* 2-Column Local Backup Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Export Card */}
        <section className="flex flex-col justify-between rounded-2xl border border-line bg-surface p-6 sm:p-7 shadow-xs hover:border-line-hover transition-colors">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-status-learned-bg text-status-learned border border-status-learned/20">
                <ArrowDownToLine size={24} />
              </div>
              <span className="rounded-full bg-surface-soft px-3 py-1 text-xs font-semibold text-text-secondary border border-line">
                Định dạng JSON
              </span>
            </div>

            <h2 className="mt-4 text-xl font-bold text-text">
              {t('backup.exportTitle')}
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-text-secondary leading-relaxed">
              {t('backup.exportDescription')}
            </p>

            <div className="my-6 rounded-xl border border-line bg-surface-soft p-4 sm:p-5 flex items-center gap-4">
              <div className="text-3xl sm:text-4xl font-extrabold text-forest tracking-tight">
                {all.length}
              </div>
              <div className="text-xs sm:text-sm text-text-secondary font-medium leading-tight">
                {t('backup.readyToExport')}
              </div>
            </div>
          </div>

          <button
            type="button"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-forest px-5 py-3 text-sm font-semibold text-white shadow-xs hover:bg-forest-hover active:scale-[0.99] transition-all disabled:cursor-not-allowed disabled:opacity-50"
            onClick={onExport}
            disabled={!lessons || !!dbError}
          >
            <ArrowDownToLine size={18} />
            <span>{t('backup.exportJson')}</span>
          </button>
        </section>

        {/* Import Card */}
        <section className="flex flex-col justify-between rounded-2xl border border-line bg-surface p-6 sm:p-7 shadow-xs hover:border-line-hover transition-colors">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-status-new-bg text-status-new border border-status-new/20">
                <ArrowUpFromLine size={24} />
              </div>
              <span className="rounded-full bg-surface-soft px-3 py-1 text-xs font-semibold text-text-secondary border border-line">
                {t('backup.maxSize')}
              </span>
            </div>

            <h2 className="mt-4 text-xl font-bold text-text">
              {t('backup.importTitle')}
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-text-secondary leading-relaxed">
              {t('backup.importDescription')}
            </p>

            {/* Drag & Drop Target Area */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={onChooseFile}
              className={`my-6 flex flex-col items-center justify-center gap-2.5 rounded-xl border-2 border-dashed p-6 text-center transition-all cursor-pointer ${
                isDragging
                  ? 'border-forest bg-forest-soft/30 scale-[1.01]'
                  : 'border-line bg-surface-soft hover:border-line-hover'
              }`}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onChooseFile();
                }
              }}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface text-forest shadow-xs">
                <FileText size={20} />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-semibold text-text">
                  {t('backup.drop')}
                </p>
                <p className="mt-0.5 text-[11px] text-muted">
                  Kéo thả vào đây hoặc bấm để duyệt file
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-line bg-surface hover:bg-surface-soft px-5 py-3 text-sm font-semibold text-text shadow-xs transition-colors disabled:cursor-not-allowed disabled:opacity-50"
            disabled={busy || !!dbError}
            onClick={onChooseFile}
          >
            <FolderOpen size={18} />
            <span>{t('backup.chooseJson')}</span>
          </button>
        </section>
      </div>

      {/* Import Result Notification */}
      {importResult && (
        <div
          className="mb-8 flex items-center gap-3.5 rounded-xl border border-status-learned/30 bg-status-learned-bg p-4 sm:p-5 text-status-learned"
          role="status"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-status-learned text-white">
            <CheckCheck size={18} />
          </div>
          <div className="text-xs sm:text-sm font-medium leading-relaxed">
            <span>{t('backup.lastImport')}{' '}</span>
            <span className="font-bold underline">+{importResult.added}</span>
            <span>{' '}{t('backup.skipped')}{' '}</span>
            <span className="font-bold">{importResult.skipped}</span>
            <span>{' '}{t('backup.duplicates')}</span>
          </div>
        </div>
      )}

      {/* Deduplication & Synchronization Guide */}
      <div className="rounded-2xl border border-line bg-surface p-5 sm:p-6 shadow-xs">
        <div className="flex items-start gap-3.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface-soft text-text-secondary border border-line">
            <Info size={18} />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-text">
              {t('backup.duplicateTitle')}
            </h3>
            <p className="mt-1.5 text-xs sm:text-sm leading-relaxed text-text-secondary">
              {t('backup.duplicateDescription')}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default BackupPage;
