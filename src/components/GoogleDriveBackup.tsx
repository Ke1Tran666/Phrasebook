import { Cloud, RefreshCw, Upload, Download, LogOut } from 'lucide-react';
import type { Lesson } from '@/db';
import type { useGoogleDrive } from '@/hooks/useGoogleDrive';
import { useLanguage } from '@/language';

type Props = {
  drive: ReturnType<typeof useGoogleDrive>;
  onRestore: (lessons: Lesson[]) => void;
  disabled?: boolean;
};
const button =
  'inline-flex items-center justify-center gap-2 rounded-lg border border-line px-4 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50';

const GoogleDriveBackup = ({ drive, onRestore, disabled = false }: Props) => {
  const { language, t } = useLanguage();
  return (
    <section
      className="mb-6 rounded-xl border border-line bg-surface p-5 sm:p-7"
      aria-label={t('drive.label')}
    >
      <h2 className="flex items-center gap-2 text-xl font-semibold text-forest">
        <Cloud size={24} /> Google Drive
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-[#756c7a]">
        {t('drive.description')}
      </p>
      {!drive.configured ? (
        <p className="mt-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-900">
          {t('drive.notConfigured')}
        </p>
      ) : (
        <>
          {drive.account ? (
            <>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-semibold">{drive.account.name}</p>
                  <p className="break-all text-sm text-[#756c7a]">
                    {drive.account.email}
                  </p>
                </div>
                <button
                  type="button"
                  className={button}
                  disabled={drive.busy}
                  onClick={drive.disconnect}
                >
                  <LogOut size={16} /> {t('drive.signOut')}
                </button>
              </div>
              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  type="button"
                  className={`${button} bg-forest text-white`}
                  disabled={drive.busy || disabled}
                  onClick={drive.backup}
                >
                  <Upload size={17} /> {t('drive.backup')}
                </button>
                <button
                  type="button"
                  className={button}
                  disabled={drive.busy}
                  onClick={drive.refresh}
                >
                  <RefreshCw size={17} /> {t('drive.refresh')}
                </button>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-[#756c7a]">
                {t('drive.limits')}
              </p>
              <ul className="mt-4 space-y-3">
                {drive.backups.map((file) => (
                  <li
                    key={file.id}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-line p-3"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="break-all text-sm font-medium">
                        {file.name}
                      </p>
                      <p className="mt-1 text-xs text-[#756c7a]">
                        {new Date(file.modifiedTime).toLocaleString(
                          language === 'vi' ? 'vi-VN' : 'en-GB',
                        )}
                      </p>
                    </div>
                    <button
                      type="button"
                      className={button}
                      disabled={drive.busy || disabled}
                      onClick={() => drive.restore(file, onRestore)}
                      aria-label={`${t('drive.restore')} ${file.name}`}
                    >
                      <Download size={16} /> {t('drive.restore')}
                    </button>
                  </li>
                ))}
              </ul>
              {!drive.backups.length && (
                <p className="mt-4 text-sm text-[#756c7a]">
                  {t('drive.noBackups')}
                </p>
              )}
              <p className="mt-4 text-xs leading-relaxed text-[#756c7a]">
                {t('drive.restoreHint')}
              </p>
            </>
          ) : (
            <div className="mt-4">
              <button
                type="button"
                className={`${button} bg-forest text-white`}
                disabled={!drive.ready || drive.busy}
                onClick={drive.connect}
              >
                {t('drive.signIn')}
              </button>
              {!drive.ready && (
                <button
                  type="button"
                  className={`${button} ml-2`}
                  onClick={() => void drive.prepare()}
                >
                  {t('drive.reload')}
                </button>
              )}
              <p className="mt-2 text-xs text-[#756c7a]">
                {t('drive.sessionHint')}
              </p>
            </div>
          )}
          {drive.busy && (
            <p className="mt-3 text-sm" role="status">
              {t('drive.connecting')}
            </p>
          )}
          {drive.error && (
            <p
              className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-800"
              role="alert"
            >
              {drive.error}
            </p>
          )}
          {drive.message && (
            <p
              className="mt-3 rounded-lg bg-green-50 p-3 text-sm text-green-800"
              role="status"
            >
              {drive.message}
            </p>
          )}
        </>
      )}
    </section>
  );
};
export default GoogleDriveBackup;
