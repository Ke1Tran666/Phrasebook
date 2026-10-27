import { ui } from '@/styles/ui';
import { BookOpen, Pencil, Plus, Trash2, X } from 'lucide-react';
import Modal from '@/components/Modal';

type HelpDialogProps = {
  open: boolean;
  onClose: () => void;
};

const HelpDialog = ({ open, onClose }: HelpDialogProps) => (
  <Modal open={open} onClose={onClose} label="Hướng dẫn sử dụng" wide>
    <div className={ui('modal-heading')}>
      <div>
        <span className={ui('eyebrow')}>BẮT ĐẦU VỚI PHRASEBOOK</span>
        <h2>Hướng dẫn sử dụng</h2>
      </div>
      <button
        type="button"
        className={ui('icon-button')}
        aria-label="Đóng hướng dẫn"
        onClick={onClose}
      >
        <X size={20} />
      </button>
    </div>
    <div className="space-y-6 p-5 text-xs sm:text-sm leading-relaxed sm:p-7 text-text-secondary">
      {/* Thêm bài học */}
      <section className="space-y-3">
        <h3 className="flex items-center gap-2 text-base font-bold text-forest">
          <Plus size={18} /> Thêm bài học mới
        </h3>
        <ol className="list-decimal space-y-2 pl-5">
          <li>
            Vào <strong>Sổ bài học</strong> và bấm <strong>Thêm bài học</strong>.
          </li>
          <li>
            Chọn loại nội dung: <strong>Cụm từ / câu</strong>, <strong>Đoạn văn</strong> hoặc{' '}
            <strong>Cấu trúc câu</strong>.
          </li>
          <li>
            Nhập nội dung tiếng Anh hoặc mẫu cấu trúc. Thêm nghĩa / cách dùng, chủ đề và ví dụ nếu có.
          </li>
          <li>
            Bôi chọn từ hoặc cụm từ trong ô tiếng Anh để lưu nghĩa riêng cho từng từ vựng.
          </li>
          <li>
            Bấm <strong>Lưu bài học</strong>. Bài vừa tạo sẽ xuất hiện ngay trong thư viện của bạn.
          </li>
        </ol>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="rounded-xl border border-line bg-surface-soft p-3.5">
            <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-forest">
              Ví dụ: Cụm từ / câu
            </h4>
            <dl className="space-y-1.5 text-xs">
              <div>
                <dt className="font-semibold text-text">Tiếng Anh</dt>
                <dd className="font-medium text-forest">Could you give me a hand?</dd>
              </div>
              <div>
                <dt className="font-semibold text-text">Nghĩa tiếng Việt</dt>
                <dd>Bạn có thể giúp tôi một tay không?</dd>
              </div>
              <div>
                <dt className="font-semibold text-text">Chủ đề</dt>
                <dd>Giao tiếp</dd>
              </div>
            </dl>
          </div>

          <div className="rounded-xl border border-line bg-surface-soft p-3.5">
            <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-forest">
              Ví dụ: Đoạn văn
            </h4>
            <dl className="space-y-1.5 text-xs">
              <div>
                <dt className="font-semibold text-text">Tiếng Anh</dt>
                <dd className="font-medium text-forest">
                  I read a little every day. When I find a useful phrase, I write it down.
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-text">Nghĩa tiếng Việt</dt>
                <dd>Tôi đọc một chút mỗi ngày. Khi gặp cụm từ hữu ích, tôi ghi lại.</dd>
              </div>
              <div>
                <dt className="font-semibold text-text">Chủ đề</dt>
                <dd>Học tập</dd>
              </div>
            </dl>
          </div>

          <div className="rounded-xl border border-line bg-surface-soft p-3.5">
            <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-forest">
              Ví dụ: Cấu trúc câu
            </h4>
            <dl className="space-y-1.5 text-xs">
              <div>
                <dt className="font-semibold text-text">Mẫu cấu trúc</dt>
                <dd className="font-mono font-medium text-forest">S + be going to + V</dd>
              </div>
              <div>
                <dt className="font-semibold text-text">Cách dùng</dt>
                <dd>Diễn tả dự định có kế hoạch trước.</dd>
              </div>
              <div>
                <dt className="font-semibold text-text">Ví dụ</dt>
                <dd>I am going to study tonight.</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      {/* Sửa bài học */}
      <section className="space-y-2 border-t border-line pt-5">
        <h3 className="flex items-center gap-2 text-base font-bold text-forest">
          <Pencil size={18} /> Chỉnh sửa bài học
        </h3>
        <ol className="list-decimal space-y-1.5 pl-5">
          <li>Bấm vào bài học trong thư viện để mở chi tiết hoặc bấm nút ba chấm (...).</li>
          <li>Chọn <strong>Chỉnh sửa</strong> và cập nhật thông tin bài học.</li>
          <li>Bấm <strong>Lưu bài học</strong> để hoàn tất thay đổi.</li>
        </ol>
        <p className="text-xs text-muted">
          Lưu ý: Khi sửa nội dung câu tiếng Anh gốc, các vị trí tô sáng cũ sẽ được làm mới để bảo đảm tính chính xác.
        </p>
      </section>

      {/* Xóa bài học */}
      <section className="space-y-2 border-t border-line pt-5">
        <h3 className="flex items-center gap-2 text-base font-bold text-status-danger">
          <Trash2 size={18} /> Xóa bài học
        </h3>
        <ol className="list-decimal space-y-1.5 pl-5">
          <li>Mở chi tiết bài học hoặc menu tùy chọn nhanh của bài đó.</li>
          <li>Chọn <strong>Xóa bài học</strong> và xác nhận để loại bỏ bài học khỏi sổ tay.</li>
        </ol>
      </section>

      {/* Ghi nhớ & sao lưu */}
      <section className="rounded-xl border border-line bg-forest-soft p-4 sm:p-5 flex items-start gap-3">
        <BookOpen size={20} className="shrink-0 text-forest mt-0.5" />
        <div>
          <h3 className="font-bold text-text">Lưu trữ an toàn</h3>
          <p className="mt-1 text-xs sm:text-sm text-text-secondary">
            Dữ liệu bài học được lưu an toàn trực tiếp trên trình duyệt của bạn (IndexedDB). Hãy sử dụng mục{' '}
            <strong className="text-forest">Sao lưu dữ liệu</strong> để xuất file JSON định kỳ hoặc đồng bộ lên Google Drive.
          </p>
        </div>
      </section>
    </div>

    <footer className={ui('modal-footer')}>
      <button
        type="button"
        className="inline-flex items-center justify-center rounded-xl bg-forest px-5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-xs hover:bg-forest-hover active:scale-[0.99] transition-all ml-auto"
        onClick={onClose}
      >
        Đã hiểu
      </button>
    </footer>
  </Modal>
);

export default HelpDialog;
