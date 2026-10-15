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
  return (
    <section aria-labelledby="profile-title">
      <button type="button" className={ui('text-button')} onClick={onBack}>
        <ArrowLeft size={17} /> {t('profile.back')}
      </button>
      <div className={ui('page-heading')}>
        <div>
          <span className={ui('eyebrow')}>{t('profile.eyebrow')}</span>
          <h1 id="profile-title">
            {t('profile.title')}
            <span>.</span>
          </h1>
          <p>{t('profile.description')}</p>
        </div>
      </div>
      <div className="mb-6 flex min-w-0 flex-col gap-5 rounded-xl border border-line bg-surface p-5 sm:flex-row sm:items-center sm:p-8">
        <span
          aria-hidden="true"
          className="grid size-16 shrink-0 place-items-center rounded-full bg-[#f0e9dc] text-3xl text-[#6a604b]"
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
          <h2 className="text-xl font-semibold wrap-anywhere">
            {account?.name || t('profile.notSignedIn')}
          </h2>
          <p className="mt-2 text-sm text-[#817486] wrap-anywhere">
            {account?.email || t('profile.localDescription')}
          </p>
          <p className="mt-2 text-sm text-[#817486]">
            {account ? t('profile.connected') : t('profile.connectHint')}
          </p>
        </div>
        <button
          type="button"
          className={ui('button secondary')}
          onClick={onBackup}
        >
          <HardDrive size={18} />{' '}
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
      <p className="mt-5 text-sm leading-relaxed text-[#817486]">
        {t('profile.statsHint')}
      </p>
      <a
        href="/privacy"
        className="mt-6 flex items-center gap-3 rounded-xl border border-line bg-surface p-5 text-forest transition-colors hover:bg-surface-soft"
      >
        <ShieldCheck size={22} aria-hidden="true" className="shrink-0" />
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-semibold">
            {t('profile.privacy')}
          </span>
          <span className="mt-1 block text-sm leading-relaxed text-[#817486]">
            {t('profile.privacyDescription')}
          </span>
        </span>
        <ChevronRight size={18} aria-hidden="true" className="shrink-0" />
      </a>
    </section>
  );
};

export default ProfilePage;
