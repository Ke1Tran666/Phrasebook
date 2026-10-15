import type { AppView } from '@/navigation';
import { ui } from '@/styles/ui';
import { ChevronRight, Cloud, HardDrive } from 'lucide-react';
import HeaderPreferences from '@/components/HeaderPreferences';

const pageLabels: Record<AppView, string> = {
  dashboard: 'Dashboard',
  lessons: 'Lessons',
  'exam-practice': 'Exam Practice',
  backup: 'Sao lưu dữ liệu',
  profile: 'Hồ sơ cá nhân',
};

const Topbar = ({
  view,
  connected = false,
}: {
  view: AppView;
  connected?: boolean;
}) => {
  return (
    <header className={ui('topbar')}>
      <div className="min-w-0 max-[760px]:[&>span]:hidden max-[760px]:[&>svg]:hidden">
        <span>Không gian cá nhân</span>
        <ChevronRight size={14} />
        <strong>{pageLabels[view]}</strong>
      </div>
      <div className="shrink-0">
        <span className={`${ui('local-label')} max-[1100px]:hidden`}>
          {connected ? <Cloud size={15} /> : <HardDrive size={15} />}
          {connected ? 'Đã kết nối Drive' : 'Lưu cục bộ'}
        </span>
        <HeaderPreferences />
      </div>
    </header>
  );
};

export default Topbar;
