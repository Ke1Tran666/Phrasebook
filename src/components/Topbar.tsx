import { ui } from '@/styles/ui';
import { ChevronRight, HardDrive } from 'lucide-react';

const Topbar = ({ view }: { view: 'library' | 'review' | 'backup' }) => {
  return (
    <header className={ui('topbar')}>
      <div>
        <span>Không gian cá nhân</span>
        <ChevronRight size={14} />
        <strong>
          {view === 'library'
            ? 'Sổ bài học'
            : view === 'review'
              ? 'Ôn tập'
              : 'Sao lưu dữ liệu'}
        </strong>
      </div>
      <div>
        <span className={ui('local-label')}>
          <HardDrive size={15} /> Lưu cục bộ
        </span>
      </div>
    </header>
  );
};

export default Topbar;
