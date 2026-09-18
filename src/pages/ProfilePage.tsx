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
}: ProfilePageProps) => (
  <section aria-labelledby="profile-title">
    <button type="button" className={ui('text-button')} onClick={onBack}>
      <ArrowLeft size={17} /> Sổ bài học
    </button>
    <div className={ui('page-heading')}>
      <div>
        <span className={ui('eyebrow')}>HỌC MỘT CHÚT, MỖI NGÀY</span>
        <h1 id="profile-title">
          Hồ sơ cá nhân<span>.</span>
        </h1>
        <p>Thông tin tài khoản và hành trình học của bạn.</p>
      </div>
    </div>
    <div className="mb-6 flex min-w-0 flex-col gap-5 rounded-xl border border-line bg-white p-5 sm:flex-row sm:items-center sm:p-8">
      <span
        aria-hidden="true"
        className="grid size-16 shrink-0 place-items-center rounded-full bg-[#f0e9dc] text-3xl text-[#6a604b]"
      >
        {account
          ? Array.from(account.name || account.email)[0]?.toLocaleUpperCase(
              'vi',
            )
          : 'K'}
      </span>
      <div className="min-w-0 flex-1">
        <h2 className="text-xl font-semibold wrap-anywhere">
          {account?.name || 'Sổ tay cá nhân'}
        </h2>
        <p className="mt-2 text-sm text-[#75836f] wrap-anywhere">
          {account?.email || 'Bạn đang sử dụng sổ tay trên trình duyệt này.'}
        </p>
        <p className="mt-2 text-sm text-[#75836f]">
          {account
            ? 'Đã kết nối tài khoản Google.'
            : 'Kết nối Google trong mục sao lưu để lưu bản sao lên Drive.'}
        </p>
      </div>
      <button
        type="button"
        className={ui('button secondary')}
        onClick={onBackup}
      >
        <HardDrive size={18} /> {account ? 'Quản lý sao lưu' : 'Kết nối Google'}
      </button>
    </div>
    <div className={ui('stats')}>
      <StatCard
        label="Tổng bài học"
        value={total}
        icon={Layers}
        color="green"
        description="Trong sổ của bạn"
      />
      <StatCard
        label="Cần ôn tập"
        value={review}
        icon={Bookmark}
        color="amber"
        description="Thêm một lần để nhớ"
      />
      <StatCard
        label="Đã ghi nhớ"
        value={learned}
        icon={CheckCheck}
        color="blue"
        description="Từng chút tiến bộ"
      />
    </div>
    <p className="mt-5 text-sm leading-relaxed text-[#75836f]">
      Thống kê thuộc dữ liệu trên trình duyệt này. Bài học không tự đồng bộ với
      Google Drive.
    </p>
    <a
      href="/privacy"
      className="mt-6 flex items-center gap-3 rounded-xl border border-line bg-white p-5 text-forest transition-colors hover:bg-[#f0f4f1]"
    >
      <ShieldCheck size={22} aria-hidden="true" className="shrink-0" />
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold">
          Chính sách quyền riêng tư
        </span>
        <span className="mt-1 block text-sm leading-relaxed text-[#75836f]">
          Tìm hiểu cách Phrasebook lưu trữ và sử dụng dữ liệu của bạn.
        </span>
      </span>
      <ChevronRight size={18} aria-hidden="true" className="shrink-0" />
    </a>
  </section>
);

export default ProfilePage;
