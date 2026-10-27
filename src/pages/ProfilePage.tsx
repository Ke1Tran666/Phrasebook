import {
  ArrowLeft,
  Bookmark,
  CheckCheck,
  HardDrive,
  Layers,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';
import StatCard from '@/components/StatCard';
import type { GoogleAccount } from '@/services/google-drive';
import { ui } from '@/styles/ui';
import { useLanguage } from '@/language';
import { isAdminAccount } from '@/services/admin-auth';

type ProfilePageProps = {
  account?: GoogleAccount;
  total: number;
  review: number;
  learned: number;
  onBack: () => void;
  onBackup: () => void;
};

const ProfilePage = ({
  account,
  total,
  review,
  learned,
  onBack,
  onBackup,
}: ProfilePageProps) => {
  const { language, t } = useLanguage();
  const isAdmin = isAdminAccount(account);

  return (
    <section aria-labelledby="profile-title">
      <button type="button" className={ui('text-button')} onClick={onBack}>
        <ArrowLeft size={16} /> {t('profile.back')}
      </button>
      <div className={ui('page-heading')}>
        <div>
          <span className={ui('eyebrow')}>
            {isAdmin ? 'TÀI KHOẢN QUẢN TRỊ VIÊN' : t('profile.eyebrow')}
          </span>
          <h1 id="profile-title">
            {t('profile.title')}
            <span>.</span>
          </h1>
          <p>{t('profile.description')}</p>
        </div>
      </div>
      <div className="mb-6 flex min-w-0 flex-col gap-5 rounded-2xl border border-line bg-surface p-5 shadow-xs sm:flex-row sm:items-center sm:p-7">
        <span
          aria-hidden="true"
          className="grid size-16 shrink-0 place-items-center rounded-2xl bg-forest-soft text-3xl font-bold text-forest shadow-xs"
        >
          {account
            ? Array.from(account.name || account.email)[0]?.toLocaleUpperCase(
                language,
              )
            : language === 'vi'
              ? 'S'
              : 'P'}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-xl font-bold text-text wrap-break-word">
              {account?.name || t('profile.notSignedIn')}
            </h2>
            {isAdmin && (
              <span className="inline-flex items-center gap-1 rounded-full bg-forest text-white text-[11px] font-bold px-2.5 py-0.5 shadow-xs">
                <ShieldCheck size={13} />
                <span>Quản trị viên</span>
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-muted wrap-break-word">
            {account?.email || t('profile.localDescription')}
          </p>
          <p className="mt-1 text-xs text-muted">
            {account ? t('profile.connected') : t('profile.connectHint')}
          </p>
        </div>
        <button
          type="button"
          className={ui('button secondary')}
          onClick={onBackup}
        >
          <HardDrive size={17} />{' '}
          {account ? t('profile.manageBackup') : t('profile.connectGoogle')}
        </button>
      </div>
      <div className={ui('stats')}>
        <StatCard
          label={t('dashboard.totalLessons')}
          value={total}
          icon={Layers}
          color="green"
          description={t('library.inNotebook')}
        />
        <StatCard
          label={t('status.review')}
          value={review}
          icon={Bookmark}
          color="amber"
          description={t('library.reviewHint')}
        />
        <StatCard
          label={t('status.learned')}
          value={learned}
          icon={CheckCheck}
          color="blue"
          description={t('library.progressHint')}
        />
      </div>
      <div className="mt-8 rounded-2xl border border-line bg-surface p-6 shadow-xs">
        <h3 className="text-base font-bold text-text">
          {t('profile.privacy')}
        </h3>
        <p className="mt-1 text-xs sm:text-sm text-muted">
          {t('profile.privacyDescription')}
        </p>
        <p className="mt-2 text-xs text-muted">{t('profile.statsHint')}</p>
        <div className="mt-5 flex flex-wrap gap-3">
          <button
            type="button"
            className={ui('button secondary')}
            onClick={onBackup}
          >
            {t('profile.manageBackup')} <ChevronRight size={15} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default ProfilePage;
