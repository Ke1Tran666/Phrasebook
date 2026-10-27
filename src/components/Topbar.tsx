import type { AppView } from '@/navigation';
import { ui } from '@/styles/ui';
import { ChevronRight, Cloud, HardDrive } from 'lucide-react';
import HeaderPreferences from '@/components/HeaderPreferences';
import NotificationMenu from '@/components/NotificationMenu';
import { useLanguage, type MessageKey } from '@/language';

const pageLabelKeys: Record<AppView, MessageKey> = {
  dashboard: 'nav.dashboard',
  lessons: 'nav.lessons',
  'exam-practice': 'nav.examPractice',
  backup: 'nav.backup',
  profile: 'nav.profile',
};

const Topbar = ({
  view,
  connected = false,
  dueCount = 0,
  onNavigate,
}: {
  view: AppView;
  connected?: boolean;
  dueCount?: number;
  onNavigate?: (view: AppView) => void;
}) => {
  const { t } = useLanguage();

  return (
    <header className={ui('topbar')}>
      <div className="min-w-0 flex items-center gap-2 max-[760px]:[&>span]:hidden max-[760px]:[&>svg]:hidden">
        <span className="text-muted text-xs sm:text-sm">
          {t('topbar.workspace')}
        </span>
        <ChevronRight size={14} className="text-muted/60" />
        <strong className="text-text font-semibold text-xs sm:text-sm truncate">
          {t(pageLabelKeys[view])}
        </strong>
      </div>
      <div className="shrink-0 flex items-center gap-2.5 sm:gap-3">
        <span className={`${ui('local-label')} max-[1100px]:hidden`}>
          {connected ? <Cloud size={14} /> : <HardDrive size={14} />}
          {connected ? t('topbar.driveConnected') : t('topbar.local')}
        </span>
        <NotificationMenu
          dueCount={dueCount}
          connected={connected}
          onNavigate={onNavigate}
        />
        <HeaderPreferences />
      </div>
    </header>
  );
};

export default Topbar;
