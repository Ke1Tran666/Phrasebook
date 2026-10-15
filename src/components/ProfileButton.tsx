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
      className={`mt-5 flex w-full min-w-0 items-center gap-3 rounded-lg border-0 border-t border-solid border-t-line px-1 py-4 text-left transition-colors hover:bg-surface-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8b2bd1] ${active ? 'bg-surface-soft' : 'bg-transparent'}`}
    >
      <span
        aria-hidden="true"
        className="grid size-10 shrink-0 place-items-center rounded-full bg-[#f0e9dc] text-xl text-[#6a604b]"
      >
        {account
          ? Array.from(name)[0]?.toLocaleUpperCase(language)
          : language === 'vi'
            ? 'S'
            : 'P'}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm" title={name}>
          {name}
        </span>
        <span
          className="mt-1 block truncate text-xs text-[#8c948e]"
          title={account?.email}
        >
          {account?.email || t('profile.tagline')}
        </span>
      </span>
      <ChevronRight
        size={16}
        aria-hidden="true"
        className="shrink-0 text-[#8c948e]"
      />
    </button>
  );
};

export default ProfileButton;
