import GoogleDriveBackup from '@/components/GoogleDriveBackup';
import type { Lesson } from '@/db';
import type { useGoogleDrive } from '@/hooks/useGoogleDrive';
import { ui } from '@/styles/ui';
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  CheckCheck,
  FileText,
  ShieldCheck,
} from 'lucide-react';
import type { DragEvent } from 'react';

type BackupPageProps = {
  drive: ReturnType<typeof useGoogleDrive>;
  lessons?: Lesson[];
  all: Lesson[];
  busy: boolean;
  dbError: string;
  importResult: { added: number; skipped: number } | null;
  onRestore: (lessons: Lesson[]) => void;
  onExport: () => void;
  onChooseFile: () => void;
  onReadFile: (file?: File) => void;
};

const BackupPage = ({
  drive,
  lessons,
  all,
  busy,
  dbError,
  importResult,
  onRestore,
  onExport,
  onChooseFile,
  onReadFile,
}: BackupPageProps) => {
  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (!busy) onReadFile(event.dataTransfer.files[0]);
  };

  return (
    <>
      <div className={ui('page-heading')}>
        <div>
          <span className={ui('eyebrow')}>KEEP YOUR WORDS SAFE</span>
          <h1>
            Sao lưu dữ liệu<span>.</span>
          </h1>
          <p>Mang theo những gì bạn học, theo cách của bạn.</p>
        </div>
      </div>
      <GoogleDriveBackup
        drive={drive}
        onRestore={onRestore}
        disabled={busy || !!dbError || !lessons}
      />
      <div className={ui('backup-banner')}>
        <ShieldCheck size={28} />
        <div>
          <strong>Dữ liệu đang nằm trên trình duyệt này</strong>
          <p>
            Xóa dữ liệu trang web có thể làm mất bài học. Hãy xuất file định kỳ;
            khi đổi máy hoặc trình duyệt, nhập file để học tiếp.
          </p>
        </div>
      </div>
      <div className={ui('backup-grid')}>
        <section className={ui('backup-card')}>
          <span className={ui('stat-icon green')}>
            <ArrowDownToLine size={25} />
          </span>
          <h2>Xuất bản sao lưu</h2>
          <p>
            Lưu toàn bộ bài học, bản dịch, cụm từ, ghi chú và tiến độ vào một
            file JSON.
          </p>
          <div className={ui('backup-count')}>
            <strong>{all.length}</strong> bài học sẵn sàng để xuất
          </div>
          <button
            className={ui('button primary')}
            onClick={onExport}
            disabled={!lessons || !!dbError}
          >
            <ArrowDownToLine size={17} /> Xuất file JSON
          </button>
        </section>
        <section className={ui('backup-card')}>
          <span className={ui('stat-icon blue')}>
            <ArrowUpFromLine size={25} />
          </span>
          <h2>Nhập bài học</h2>
          <p>
            Chọn file sao lưu Phrasebook từ máy. Bạn sẽ được xem số bài trước
            khi nhập.
          </p>
          <div
            className={ui('import-drop')}
            onDragOver={(event) => event.preventDefault()}
            onDrop={handleDrop}
          >
            <FileText size={26} />
            <span>Kéo file JSON vào đây</span>
            <small>Tối đa 10 MB</small>
          </div>
          <button
            className={ui('button secondary')}
            disabled={busy || !!dbError}
            onClick={onChooseFile}
          >
            <ArrowUpFromLine size={17} /> Chọn file JSON
          </button>
        </section>
      </div>
      {importResult && (
        <div className={ui('success-result')}>
          <CheckCheck size={20} /> Lần nhập vừa rồi: thêm {importResult.added}{' '}
          bài học, bỏ qua {importResult.skipped} bài trùng.
        </div>
      )}
      <div className={ui('backup-explanation')}>
        <h3>Bài trùng được xử lý thế nào?</h3>
        <p>
          Bài có cùng loại và nội dung tiếng Anh được xem là trùng, không phân
          biệt chữ hoa/thường và khoảng trắng thừa. Bài đã có sẽ được giữ
          nguyên, gồm ghi chú và tiến độ. Dữ liệu không tự đồng bộ giữa các máy.
        </p>
      </div>
    </>
  );
};

export default BackupPage;
