import GoogleDriveBackup from '@/components/GoogleDriveBackup';
import type { Lesson } from '@/db';
import type { useGoogleDrive } from '@/hooks/useGoogleDrive';
import { ui } from '@/styles/ui';
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  CheckCheck,
  FileText,
  ShieldCheck,
} from 'lucide-react';
import type { DragEvent } from 'react';
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
  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (!busy) onReadFile(event.dataTransfer.files[0]);
  };

  return (
    <>
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
      <GoogleDriveBackup
        drive={drive}
        onRestore={onRestore}
        disabled={busy || !!dbError || !lessons}
      />
      <div className={ui('backup-banner')}>
        <ShieldCheck size={28} />
        <div>
          <strong>{t('backup.localTitle')}</strong>
          <p>{t('backup.localDescription')}</p>
        </div>
      </div>
      <div className={ui('backup-grid')}>
        <section className={ui('backup-card')}>
          <span className={ui('stat-icon green')}>
            <ArrowDownToLine size={25} />
          </span>
          <h2>{t('backup.exportTitle')}</h2>
          <p>{t('backup.exportDescription')}</p>
          <div className={ui('backup-count')}>
            <strong>{all.length}</strong> {t('backup.readyToExport')}
          </div>
          <button
            className={ui('button primary')}
            onClick={onExport}
            disabled={!lessons || !!dbError}
          >
            <ArrowDownToLine size={17} /> {t('backup.exportJson')}
          </button>
        </section>
        <section className={ui('backup-card')}>
          <span className={ui('stat-icon blue')}>
            <ArrowUpFromLine size={25} />
          </span>
          <h2>{t('backup.importTitle')}</h2>
          <p>{t('backup.importDescription')}</p>
          <div
            className={ui('import-drop')}
            onDragOver={(event) => event.preventDefault()}
            onDrop={handleDrop}
          >
            <FileText size={26} />
            <span>{t('backup.drop')}</span>
            <small>{t('backup.maxSize')}</small>
          </div>
          <button
            className={ui('button secondary')}
            disabled={busy || !!dbError}
            onClick={onChooseFile}
          >
            <ArrowUpFromLine size={17} /> {t('backup.chooseJson')}
          </button>
        </section>
      </div>
      {importResult && (
        <div className={ui('success-result')}>
          <CheckCheck size={20} /> {t('backup.lastImport')} {importResult.added}{' '}
          {t('backup.skipped')} {importResult.skipped} {t('backup.duplicates')}
        </div>
      )}
      <div className={ui('backup-explanation')}>
        <h3>{t('backup.duplicateTitle')}</h3>
        <p>{t('backup.duplicateDescription')}</p>
      </div>
    </>
  );
};

export default BackupPage;
