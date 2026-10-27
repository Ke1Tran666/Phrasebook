import {
  Cloud,
  RefreshCw,
  Upload,
  Download,
  LogOut,
  AlertCircle,
  CheckCircle2,
  HardDrive,
  Clock,
  Info,
} from 'lucide-react';
import type { Lesson } from '@/db';
import type { useGoogleDrive } from '@/hooks/useGoogleDrive';
import { useLanguage } from '@/language';

type Props = {
  drive: ReturnType<typeof useGoogleDrive>;
  onRestore: (lessons: Lesson[]) => void;
  disabled?: boolean;
};

const formatFileSize = (bytes?: string | number): string => {
  if (!bytes) return '';
  const num = typeof bytes === 'string' ? parseInt(bytes, 10) : bytes;
  if (isNaN(num) || num <= 0) return '';
  if (num < 1024) return `${num} B`;
  if (num < 1024 * 1024) return `${(num / 1024).toFixed(1)} KB`;
  return `${(num / (1024 * 1024)).toFixed(1)} MB`;
};

const GoogleDriveBackup = ({ drive, onRestore, disabled = false }: Props) => {
  const { language, t } = useLanguage();

  return (
    <section
      className="mb-8 rounded-2xl border border-line bg-surface p-5 sm:p-7 shadow-xs transition-colors"
      aria-label={t('drive.label')}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-forest-soft text-forest">
            <Cloud size={24} />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h2 className="text-xl font-bold text-text">Google Drive</h2>
              {drive.configured ? (
                drive.account ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-status-learned-bg px-2.5 py-0.5 text-xs font-semibold text-status-learned border border-status-learned/20">
                    <span className="h-1.5 w-1.5 rounded-full bg-status-learned animate-pulse" />
                    {t('topbar.driveConnected')}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-surface-soft px-2.5 py-0.5 text-xs font-medium text-text-secondary border border-line">
                    Chưa kết nối
                  </span>
                )
              ) : (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-medium text-amber-600 dark:text-amber-400 border border-amber-500/20">
                  Chưa cấu hình API
                </span>
              )}
            </div>
            <p className="mt-1 text-xs sm:text-sm leading-relaxed text-text-secondary">
              {t('drive.description')}
            </p>
          </div>
        </div>
      </div>

      {!drive.configured ? (
        <div className="mt-5 flex items-start gap-3 rounded-xl border border-amber-500/20 bg-amber-500/10 p-4 text-xs sm:text-sm text-amber-800 dark:text-amber-300">
          <AlertCircle
            size={18}
            className="shrink-0 mt-0.5 text-amber-600 dark:text-amber-400"
          />
          <div>
            <p className="font-semibold">{t('drive.notConfigured')}</p>
            <p className="mt-1 text-xs text-amber-700/80 dark:text-amber-400/80">
              Bạn vẫn có thể sao lưu và phục hồi dữ liệu hoàn toàn an toàn bằng tính năng xuất/nhập file JSON cục bộ bên dưới.
            </p>
          </div>
        </div>
      ) : (
        <>
          {drive.account ? (
            <>
              {/* Connected Account Card */}
              <div className="mt-5 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-line bg-surface-soft p-4 sm:p-5">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-forest text-white font-bold text-base shadow-xs">
                    {(drive.account.name || drive.account.email || 'G')
                      .charAt(0)
                      .toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-text truncate text-sm sm:text-base">
                        {drive.account.name}
                      </p>
                      <span className="rounded bg-forest/10 px-1.5 py-0.5 text-[11px] font-medium text-forest">
                        Google
                      </span>
                    </div>
                    <p className="break-all text-xs text-text-secondary mt-0.5">
                      {drive.account.email}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-line bg-surface px-3.5 py-2 text-xs sm:text-sm font-semibold text-text-secondary hover:text-status-danger hover:border-status-danger/30 hover:bg-status-danger-bg transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={drive.busy}
                  onClick={drive.disconnect}
                >
                  <LogOut size={15} />
                  <span>{t('drive.signOut')}</span>
                </button>
              </div>

              {/* Actions row */}
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-forest px-4 sm:px-5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-xs hover:bg-forest-hover active:scale-[0.99] transition-all disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={drive.busy || disabled}
                  onClick={drive.backup}
                >
                  <Upload
                    size={16}
                    className={drive.busy ? 'animate-bounce' : ''}
                  />
                  <span>{t('drive.backup')}</span>
                </button>
                <button
                  type="button"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-line bg-surface hover:bg-surface-soft px-4 py-2.5 text-xs sm:text-sm font-semibold text-text shadow-xs transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={drive.busy}
                  onClick={drive.refresh}
                >
                  <RefreshCw
                    size={16}
                    className={drive.busy ? 'animate-spin' : ''}
                  />
                  <span>{t('drive.refresh')}</span>
                </button>
              </div>

              {/* Limits note */}
              <div className="mt-3 flex items-start gap-2 text-xs text-muted leading-relaxed">
                <Info size={14} className="shrink-0 mt-0.5" />
                <span>{t('drive.limits')}</span>
              </div>

              {/* Backup Snapshots List */}
              <div className="mt-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-muted">
                    Bản sao lưu trên Drive ({drive.backups.length})
                  </h3>
                </div>

                {drive.backups.length > 0 ? (
                  <ul className="space-y-2.5">
                    {drive.backups.map((file) => (
                      <li
                        key={file.id}
                        className="group flex flex-wrap items-center justify-between gap-3.5 rounded-xl border border-line bg-surface hover:border-line-hover hover:bg-surface-soft/60 p-3.5 sm:p-4 transition-all"
                      >
                        <div className="flex items-center gap-3.5 min-w-0 flex-1">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-surface-soft text-forest border border-line group-hover:scale-105 transition-transform">
                            <HardDrive size={18} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="break-all text-sm font-semibold text-text truncate">
                              {file.name}
                            </p>
                            <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted">
                              <span className="flex items-center gap-1">
                                <Clock size={12} />
                                {new Date(file.modifiedTime).toLocaleString(
                                  language === 'vi' ? 'vi-VN' : 'en-GB',
                                )}
                              </span>
                              {file.size && (
                                <>
                                  <span>•</span>
                                  <span className="font-medium text-text-secondary">
                                    {formatFileSize(file.size)}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        <button
                          type="button"
                          className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-line bg-surface px-3.5 py-2 text-xs sm:text-sm font-semibold text-text hover:bg-surface-soft hover:border-forest hover:text-forest transition-all shadow-xs disabled:cursor-not-allowed disabled:opacity-50"
                          disabled={drive.busy || disabled}
                          onClick={() => drive.restore(file, onRestore)}
                          aria-label={`${t('drive.restore')} ${file.name}`}
                        >
                          <Download size={15} />
                          <span>{t('drive.restore')}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="rounded-xl border border-dashed border-line p-6 text-center text-xs sm:text-sm text-muted">
                    <Cloud size={28} className="mx-auto mb-2 text-muted/60" />
                    <p>{t('drive.noBackups')}</p>
                  </div>
                )}

                <p className="mt-4 text-xs leading-relaxed text-muted">
                  {t('drive.restoreHint')}
                </p>
              </div>
            </>
          ) : (
            /* Disconnected / Connect Prompt */
            <div className="mt-6 rounded-xl border border-line bg-surface-soft p-5 sm:p-6 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-5">
              <div className="max-w-md">
                <h3 className="text-base font-semibold text-text">
                  Đồng bộ & Lưu trữ đám mây
                </h3>
                <p className="mt-1 text-xs sm:text-sm text-text-secondary leading-relaxed">
                  Đăng nhập tài khoản Google để tự động lưu các bản sao lên Google Drive và phục hồi khi đổi máy tính.
                </p>
                <p className="mt-2 text-[11px] text-muted">
                  {t('drive.sessionHint')}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                <button
                  type="button"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-forest px-5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-xs hover:bg-forest-hover active:scale-[0.99] transition-all disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={!drive.ready || drive.busy}
                  onClick={drive.connect}
                >
                  <Cloud size={16} />
                  <span>{t('drive.signIn')}</span>
                </button>
                {!drive.ready && (
                  <button
                    type="button"
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-line bg-surface px-4 py-2.5 text-xs sm:text-sm font-semibold text-text hover:bg-surface-soft transition-colors"
                    onClick={() => void drive.prepare()}
                  >
                    <RefreshCw size={15} />
                    <span>{t('drive.reload')}</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Status Notifications */}
          {drive.busy && (
            <div
              className="mt-4 flex items-center gap-2.5 rounded-xl border border-forest/20 bg-forest-soft p-3.5 text-xs sm:text-sm text-forest"
              role="status"
            >
              <RefreshCw size={16} className="animate-spin shrink-0" />
              <span>{t('drive.connecting')}</span>
            </div>
          )}
          {drive.error && (
            <div
              className="mt-4 flex items-start gap-2.5 rounded-xl border border-status-danger/25 bg-status-danger-bg p-3.5 text-xs sm:text-sm text-status-danger"
              role="alert"
            >
              <AlertCircle size={17} className="shrink-0 mt-0.5" />
              <div className="flex-1">{drive.error}</div>
            </div>
          )}
          {drive.message && (
            <div
              className="mt-4 flex items-start gap-2.5 rounded-xl border border-status-learned/25 bg-status-learned-bg p-3.5 text-xs sm:text-sm text-status-learned"
              role="status"
            >
              <CheckCircle2 size={17} className="shrink-0 mt-0.5" />
              <div className="flex-1">{drive.message}</div>
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default GoogleDriveBackup;
