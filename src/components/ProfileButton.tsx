import { ChevronRight } from 'lucide-react';
import type { GoogleAccount } from '@/services/google-drive';

type ProfileButtonProps = {
  account?: GoogleAccount;
  active: boolean;
  onClick: () => void;
};

const ProfileButton = ({ account, active, onClick }: ProfileButtonProps) => {
  const name = account?.name || 'Sổ tay cá nhân';
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Mở trang profile"
      aria-current={active ? 'page' : undefined}
      className={`mt-5 flex w-full min-w-0 items-center gap-3 rounded-lg border-0 border-t border-solid border-t-[var(--color-line)] px-1 py-4 text-left transition-colors hover:bg-[#f0f4f1] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#214f3d] ${active ? 'bg-[#f0f4f1]' : 'bg-transparent'}`}
    >
      <span
        aria-hidden="true"
        className="grid size-10 shrink-0 place-items-center rounded-full bg-[#f0e9dc] text-xl text-[#6a604b]"
      >
        {account ? Array.from(name)[0]?.toLocaleUpperCase('vi') : 'K'}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm" title={name}>
          {name}
        </span>
        <span
          className="mt-1 block truncate text-xs text-[#8c948e]"
          title={account?.email}
        >
          {account?.email || 'Học một chút, mỗi ngày'}
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
