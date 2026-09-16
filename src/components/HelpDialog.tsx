import { BookOpen, Pencil, Plus, Trash2, X } from 'lucide-react';
import Modal from '@/components/Modal';

type HelpDialogProps = {
  open: boolean;
  onClose: () => void;
};

const HelpDialog = ({ open, onClose }: HelpDialogProps) => (
  <Modal open={open} onClose={onClose} label="Hướng dẫn sử dụng" wide>
    <div className="modal-heading">
      <div>
        <span className="eyebrow">BẮT ĐẦU VỚI PHRASEBOOK</span>
        <h2>Hướng dẫn sử dụng</h2>
      </div>
      <button
        type="button"
        className="icon-button"
        aria-label="Đóng hướng dẫn"
        onClick={onClose}
      >
        <X />
      </button>
    </div>
    <div className="space-y-6 p-5 text-sm leading-relaxed sm:p-8">
      <section>
        <h3 className="mb-2 flex items-center gap-2 text-base font-semibold text-forest">
          <Plus size={20} /> Thêm bài học
        </h3>
        <ol className="list-decimal space-y-2 pl-5">
          <li>
            Vào <strong>Sổ bài học</strong> và bấm <strong>Thêm bài học</strong>
            .
          </li>
          <li>
            Chọn <strong>Cụm từ / câu</strong>, <strong>Đoạn văn</strong> hoặc{' '}
            <strong>Cấu trúc câu</strong>.
          </li>
          <li>
            Nhập nội dung tiếng Anh hoặc mẫu cấu trúc. Thêm nghĩa / cách dùng,
            chủ đề và ví dụ nếu có.
          </li>
          <li>
            Bấm <strong>Lưu bài học</strong>. Bài vừa tạo sẽ xuất hiện trong sổ.
          </li>
        </ol>
        <div className="mt-4 space-y-3">
          <div className="rounded-lg bg-[#f2f6f0] p-3">
            <h4 className="mb-2 font-semibold text-forest">
              Ví dụ: Cụm từ / câu
            </h4>
            <dl className="space-y-2">
              <div>
                <dt className="font-semibold">Nội dung tiếng Anh</dt>
                <dd>Could you give me a hand?</dd>
              </div>
              <div>
                <dt className="font-semibold">Nghĩa tiếng Việt</dt>
                <dd>Bạn có thể giúp tôi một tay không?</dd>
              </div>
              <div>
                <dt className="font-semibold">Chủ đề</dt>
                <dd>Giao tiếp</dd>
              </div>
              <div>
                <dt className="font-semibold">Ghi chú & ví dụ</dt>
                <dd>
                  “give someone a hand” nghĩa là giúp đỡ ai đó. Ví dụ: Could you
                  give me a hand with this bag?
                </dd>
              </div>
            </dl>
          </div>
          <div className="rounded-lg bg-[#f2f6f0] p-3">
            <h4 className="mb-2 font-semibold text-forest">Ví dụ: Đoạn văn</h4>
            <dl className="space-y-2">
              <div>
                <dt className="font-semibold">Nội dung tiếng Anh</dt>
                <dd>
                  I read a little every day. When I find a useful phrase, I
                  write it down and try to use it.
                </dd>
              </div>
              <div>
                <dt className="font-semibold">Nghĩa tiếng Việt</dt>
                <dd>
                  Tôi đọc một chút mỗi ngày. Khi gặp một cụm từ hữu ích, tôi ghi
                  lại và thử sử dụng nó.
                </dd>
              </div>
              <div>
                <dt className="font-semibold">Chủ đề</dt>
                <dd>Học tập</dd>
              </div>
              <div>
                <dt className="font-semibold">Ghi chú & ví dụ</dt>
                <dd>
                  “write it down” = ghi lại điều đó. Có thể bôi chọn cụm này
                  trong ô tiếng Anh rồi bấm Lưu cụm từ để thêm nghĩa riêng.
                </dd>
              </div>
            </dl>
          </div>
          <div className="rounded-lg bg-[#f2f6f0] p-3">
            <h4 className="mb-2 font-semibold text-forest">
              Ví dụ: Cấu trúc câu
            </h4>
            <dl className="space-y-2">
              <div>
                <dt className="font-semibold">Mẫu cấu trúc</dt>
                <dd>S + be going to + V</dd>
              </div>
              <div>
                <dt className="font-semibold">Cách dùng / ý nghĩa</dt>
                <dd>
                  Diễn tả dự định. S là chủ ngữ; be chia thành am/is/are theo
                  chủ ngữ; V là động từ nguyên mẫu.
                </dd>
              </div>
              <div>
                <dt className="font-semibold">Chủ đề</dt>
                <dd>Kế hoạch</dd>
              </div>
              <div>
                <dt className="font-semibold">Ví dụ & ghi chú</dt>
                <dd>I am going to study tonight. — Tôi định học tối nay.</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>
      <section>
        <h3 className="mb-2 flex items-center gap-2 text-base font-semibold text-forest">
          <Pencil size={20} /> Sửa bài học
        </h3>
        <ol className="list-decimal space-y-2 pl-5">
          <li>Bấm vào thẻ bài học để mở chi tiết.</li>
          <li>
            Bấm <strong>Chỉnh sửa</strong> và cập nhật nội dung.
          </li>
          <li>
            Bấm <strong>Lưu bài học</strong> để lưu thay đổi, hoặc{' '}
            <strong>Hủy</strong> để bỏ thay đổi chưa lưu.
          </li>
        </ol>
        <p className="mt-2 text-[#65766b]">
          Khi sửa nội dung tiếng Anh, các cụm từ đã đánh dấu sẽ được xóa để
          tránh sai vị trí. Bạn có thể bôi chọn và đánh dấu lại.
        </p>
      </section>
      <section>
        <h3 className="mb-2 flex items-center gap-2 text-base font-semibold text-forest">
          <Trash2 size={20} /> Xóa bài học
        </h3>
        <ol className="list-decimal space-y-2 pl-5">
          <li>Mở chi tiết bài học cần xóa.</li>
          <li>
            Bấm <strong>Xóa bài học</strong>.
          </li>
          <li>
            Kiểm tra nội dung rồi bấm <strong>Xóa bài học</strong> trong hộp xác
            nhận. Chọn <strong>Giữ lại</strong> nếu đổi ý.
          </li>
        </ol>
        <p className="mt-2 text-[#65766b]">
          Bài đã xóa chỉ có thể khôi phục từ file sao lưu đã xuất trước đó.
        </p>
      </section>
      <section className="rounded-lg border border-[#dce4de] p-4">
        <h3 className="mb-2 flex items-center gap-2 font-semibold text-forest">
          <BookOpen size={20} /> Ghi nhớ
        </h3>
        <p>
          Bài học lưu trên trình duyệt đang dùng. Vào{' '}
          <strong>Sao lưu dữ liệu</strong> → <strong>Xuất file JSON</strong> để
          giữ bản sao; dùng <strong>Chọn file JSON</strong> để nhập lại khi cần.
        </p>
      </section>
    </div>
    <footer className="modal-footer">
      <button
        type="button"
        className="button primary ml-auto"
        onClick={onClose}
      >
        Đã hiểu
      </button>
    </footer>
  </Modal>
);

export default HelpDialog;
