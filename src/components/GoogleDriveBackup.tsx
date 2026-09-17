import { Cloud, RefreshCw, Upload, Download, LogOut } from 'lucide-react';
import type { Lesson } from '@/db';
import type { useGoogleDrive } from '@/hooks/useGoogleDrive';

type Props = {
  drive: ReturnType<typeof useGoogleDrive>;
  onRestore: (lessons: Lesson[]) => void;
  disabled?: boolean;
};
const button =
  'inline-flex items-center justify-center gap-2 rounded-lg border border-line px-4 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50';

const GoogleDriveBackup = ({ drive, onRestore, disabled = false }: Props) => (
  <section
    className="mb-6 rounded-xl border border-line bg-white p-5 sm:p-7"
    aria-label="Sao lưu Google Drive"
  >
    <h2 className="flex items-center gap-2 text-xl font-semibold text-forest">
      <Cloud size={24} /> Google Drive
    </h2>
    <p className="mt-2 text-sm leading-relaxed text-[#65766b]">
      Đăng nhập Google để tạo bản sao và lấy lại bài học trên thiết bị khác. Mỗi
      lần sao lưu tạo một bản mới; dữ liệu không tự đồng bộ.
    </p>
    {!drive.configured ? (
      <p className="mt-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-900">
        Kết nối Google chưa được thiết lập cho website này. Bạn vẫn có thể xuất
        và nhập file JSON bên dưới.
      </p>
    ) : (
      <>
        {drive.account ? (
          <>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="font-semibold">{drive.account.name}</p>
                <p className="break-all text-sm text-[#65766b]">
                  {drive.account.email}
                </p>
              </div>
              <button
                type="button"
                className={button}
                disabled={drive.busy}
                onClick={drive.disconnect}
              >
                <LogOut size={16} /> Đăng xuất
              </button>
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              <button
                type="button"
                className={`${button} bg-forest text-white`}
                disabled={drive.busy || disabled}
                onClick={drive.backup}
              >
                <Upload size={17} /> Sao lưu lên Drive
              </button>
              <button
                type="button"
                className={button}
                disabled={drive.busy}
                onClick={drive.refresh}
              >
                <RefreshCw size={17} /> Làm mới
              </button>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-[#65766b]">
              Hiển thị tối đa 20 bản gần nhất. Tối đa 5 MB / 10.000 bài mỗi bản.
              Bản sao nằm trong vùng dữ liệu riêng của ứng dụng, không hiện
              trong danh sách file thông thường của Drive.
            </p>
            <ul className="mt-4 space-y-3">
              {drive.backups.map((file) => (
                <li
                  key={file.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-line p-3"
                >
                  <div className="min-w-0 flex-1">
                    <p className="break-all text-sm font-medium">{file.name}</p>
                    <p className="mt-1 text-xs text-[#65766b]">
                      {new Date(file.modifiedTime).toLocaleString('vi-VN')}
                    </p>
                  </div>
                  <button
                    type="button"
                    className={button}
                    disabled={drive.busy || disabled}
                    onClick={() => drive.restore(file, onRestore)}
                    aria-label={`Nhập bản sao ${file.name}`}
                  >
                    <Download size={16} /> Nhập bản sao
                  </button>
                </li>
              ))}
            </ul>
            {!drive.backups.length && (
              <p className="mt-4 text-sm text-[#65766b]">
                Chưa có bản sao trong danh sách. Sau khi sao lưu, bấm Làm mới.
              </p>
            )}
            <p className="mt-4 text-xs leading-relaxed text-[#65766b]">
              Bạn sẽ xem số bài và xác nhận trước khi nhập. Bài trùng giữ nguyên
              ghi chú và tiến độ hiện tại. Đăng xuất hoặc đổi tài khoản Google
              không xóa hay tách dữ liệu đang lưu trên trình duyệt này.
            </p>
          </>
        ) : (
          <div className="mt-4">
            <button
              type="button"
              className={`${button} bg-forest text-white`}
              disabled={!drive.ready || drive.busy}
              onClick={drive.connect}
            >
              Đăng nhập bằng Google
            </button>
            {!drive.ready && (
              <button
                type="button"
                className={`${button} ml-2`}
                onClick={() => void drive.prepare()}
              >
                Tải lại kết nối
              </button>
            )}
            <p className="mt-2 text-xs text-[#65766b]">
              Khi tải lại trang hoặc hết phiên, bạn cần đăng nhập lại để truy
              cập Drive.
            </p>
          </div>
        )}
        {drive.busy && (
          <p className="mt-3 text-sm" role="status">
            Đang kết nối Google Drive…
          </p>
        )}
        {drive.error && (
          <p
            className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-800"
            role="alert"
          >
            {drive.error}
          </p>
        )}
        {drive.message && (
          <p
            className="mt-3 rounded-lg bg-green-50 p-3 text-sm text-green-800"
            role="status"
          >
            {drive.message}
          </p>
        )}
      </>
    )}
  </section>
);
export default GoogleDriveBackup;
