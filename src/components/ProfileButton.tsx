import { ChevronRight } from 'lucide-react';
import type { GoogleAccount } from '@/services/google-drive';
import { useLanguage } from '@/language';

type ProfileButtonProps = {
  account?: GoogleAccount;
  active: boolean;
  onClick: () => void;
};

const ProfileButton = ({ account, active, onClick }: ProfileButtonProps) => {
  const { language, t } = useLanguage();
  const name = account?.name || t('profile.notSignedIn');
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`${t('common.open')} ${t('nav.profile')}`}
      aria-current={active ? 'page' : undefined}
      className={`mt-4 flex w-full min-w-0 items-center gap-3 rounded-xl border-t border-line px-2 py-3 text-left transition-colors hover:bg-surface-soft focus-visible:outline-2 focus-visible:outline-forest ${
        active ? 'bg-surface-soft' : 'bg-transparent'
      }`}
    >
      <span
        aria-hidden="true"
        className="grid size-9 shrink-0 place-items-center rounded-full bg-forest-soft text-forest text-sm font-bold shadow-xs"
      >
        {account
          ? Array.from(name)[0]?.toLocaleUpperCase(language)
          : language === 'vi'
            ? 'S'
            : 'P'}
      </span>
      <span className="min-w-0 flex-1">
        <span
          className="block truncate text-sm font-semibold text-text"
          title={name}
        >
          {name}
        </span>
        <span
          className="block truncate text-xs text-muted"
          title={account?.email}
        >
          {account?.email || t('profile.tagline')}
        </span>
      </span>
      <ChevronRight
        size={16}
        aria-hidden="true"
        className="shrink-0 text-muted"
      />
    </button>
  );
};

export default ProfileButton;
