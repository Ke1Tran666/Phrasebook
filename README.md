# Phrasebook

Phrasebook là sổ học tiếng Anh cá nhân chạy trên trình duyệt. Người dùng có thể
lưu cụm từ, câu, đoạn văn và cấu trúc câu; nghe phát âm; ôn lại theo lịch; xuất
file JSON hoặc tạo bản sao thủ công trên Google Drive.

Dữ liệu học tập được lưu local trong IndexedDB. Ứng dụng không cần backend riêng
cho chức năng chính và không tự đồng bộ dữ liệu lên cloud.

## Chức năng

- Thêm, xem, sửa và xóa bài học.
- Ba loại bài: cụm từ/câu, đoạn văn và cấu trúc câu.
- Bôi chọn nội dung tiếng Anh để lưu cụm từ cùng nghĩa riêng.
- Tìm kiếm theo tiếng Anh, nghĩa, ghi chú hoặc chủ đề.
- Lọc theo loại, trạng thái, chủ đề và sắp xếp theo thời gian hoặc A–Z.
- Nghe phát âm bằng Web Speech API của trình duyệt.
- Mở nội dung trực tiếp trong Google Translate khi cần.
- Gợi ý cấu trúc dựa trên các cấu trúc do chính người dùng lưu.
- Ôn riêng nội dung hoặc cấu trúc theo chủ đề.
- Xuất/nhập bản sao JSON có validation và chống trùng.
- Đăng nhập Google để sao lưu và khôi phục thủ công từ Drive `appDataFolder`.
- Trang hồ sơ và chính sách quyền riêng tư.

## Cài đặt

Yêu cầu:

- Node.js 22 LTS hoặc mới hơn.
- pnpm 12.4.1, được khai báo trong `package.json`.

Nếu dùng Corepack:

```bash
corepack enable
```

Cài dependency và chạy dev server:

```bash
pnpm install
pnpm dev
```

Ứng dụng mặc định chạy tại `http://localhost:4000`. IndexedDB gắn với origin,
vì vậy nên dùng ổn định cùng giao thức, host và port để tiếp tục đọc dữ liệu cũ.

## Các lệnh

```bash
pnpm dev          # Chạy Vite dev server
pnpm build        # TypeScript build và Vite production build
pnpm preview      # Xem thử production build
pnpm typecheck    # Kiểm tra TypeScript
pnpm test         # Chạy test nghiệp vụ
pnpm format       # Định dạng mã nguồn
pnpm format:check # Kiểm tra định dạng
```

## Công nghệ

- React 19 và TypeScript.
- Vite 6.
- Tailwind CSS 4.
- Dexie.js và IndexedDB.
- dexie-react-hooks.
- Lucide React.
- DM Sans và Noto Sans.
- Node test runner, tsx và fake-indexeddb.

## Kiến trúc

```text
src/
├─ components/        Component giao diện tái sử dụng
├─ hooks/             Hook điều phối tích hợp bên ngoài
├─ pages/             Các màn hình chính
├─ services/          Google OAuth và Google Drive API
├─ styles/            Nhóm utility Tailwind dùng chung
├─ App.tsx            State chung, điều hướng và modal
├─ db.ts              Model, IndexedDB, validation và backup
├─ review-schedule.ts Lịch ôn và tạo phiên ôn
└─ structures.ts      Nhận diện cấu trúc người dùng đã lưu
```

Các page hiện có:

- `LibraryPage`: danh sách, thống kê, tìm kiếm và bộ lọc.
- `ReviewPage`: chọn chế độ ôn và thực hiện phiên ôn.
- `BackupPage`: Google Drive và file JSON.
- `ProfilePage`: tài khoản và thống kê cá nhân.
- `PrivacyPolicyPage`: chính sách tại `/privacy`.

`App.tsx` dùng `useLiveQuery` để đọc dữ liệu phản ứng từ IndexedDB, tính dữ liệu
dùng chung rồi truyền xuống page qua props. Logic có thể kiểm thử độc lập được
đặt trong `db.ts`, `review-schedule.ts`, `structures.ts` và các service.

## Mô hình bài học

Mỗi bài gồm:

- ID và loại `phrase`, `passage` hoặc `structure`.
- Nội dung tiếng Anh, nghĩa, ghi chú và chủ đề.
- Trạng thái `new`, `review` hoặc `learned`.
- Danh sách đoạn văn bản được đánh dấu cùng vị trí trong nội dung.
- Ngày tạo, ngày cập nhật, lần ôn gần nhất và ngày ôn tiếp theo.

Bài được xem là trùng khi có cùng loại và nội dung tiếng Anh sau khi chuẩn hóa
Unicode, chữ hoa/thường và khoảng trắng.

## Logic ôn tập

- Bài mới hoặc bài chưa có lịch ôn được xem là đến hạn ngay.
- Chọn **Đã ôn** sẽ hẹn lại ngẫu nhiên sau 1–3 ngày.
- Chọn **Đã nhớ** sẽ hẹn lại ngẫu nhiên sau 3–4 ngày.
- Mỗi phiên chọn ngẫu nhiên 10–15 bài đến hạn, hoặc toàn bộ nếu có dưới 10 bài.
- Phiên nội dung gồm cụm từ/câu và tối đa 3 đoạn văn.
- Phiên cấu trúc chỉ gồm các bài cấu trúc câu.
- Người dùng có thể giới hạn phiên theo chủ đề.

## Cấu trúc câu

Ứng dụng không dùng danh sách ngữ pháp tích hợp sẵn. Mọi gợi ý đều xuất phát từ
các bài cấu trúc mà người dùng đã lưu.

Khi hiển thị một cụm từ, câu hoặc đoạn văn, ứng dụng so khớp nội dung với các
mẫu đã lưu. Bộ nhận diện cục bộ hỗ trợ một số contraction, dạng phổ biến của
`be`/`have`/`do`, placeholder như `S`, `N`, `V`, `V-ing`, và lựa chọn dùng dấu
`/`. Đây là so khớp quy tắc, không phải AI hoặc parser ngữ pháp đầy đủ.

## Dữ liệu local và file JSON

Database IndexedDB có tên `phrasebook-local-v1`. Xóa dữ liệu trang web có thể
làm mất sổ bài học.

File sao lưu có dạng:

```json
{
  "app": "phrasebook",
  "version": 1,
  "exportedAt": "2026-09-28T00:00:00.000Z",
  "lessons": []
}
```

Giới hạn nhập là 10 MB và 10.000 bài. Toàn bộ nội dung được kiểm tra trước khi
ghi. Quá trình nhập chạy trong một transaction, bỏ qua bài trùng và tạo ID mới
nếu ID va chạm với một bài khác.

## Nghe phát âm

Nút nghe dùng Web Speech API có sẵn trong trình duyệt:

- Không cần API key, billing hoặc backend TTS.
- Giọng đọc phụ thuộc trình duyệt và hệ điều hành.
- Nút **Mở Google Translate** mở nội dung trong tab mới khi người dùng chủ động
  chọn.

## Google Drive

Google Drive là tùy chọn. Không cấu hình Google vẫn dùng được toàn bộ chức năng
local và file JSON.

Ứng dụng yêu cầu scope `drive.appdata`, chỉ truy cập vùng dữ liệu riêng của ứng
dụng. Mỗi lần sao lưu tạo một snapshot mới khi dữ liệu đã thay đổi; ứng dụng
không tự đồng bộ và không ghi đè bài hiện có khi khôi phục.

Tạo `.env.local`:

```env
VITE_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
```

Xem hướng dẫn cấu hình tại
[docs/google-drive-setup.md](docs/google-drive-setup.md).

## Style và responsive

- Component dùng utility Tailwind trực tiếp.
- Utility dùng chung được gom trong `src/styles/ui.ts` và truy cập qua `ui()`.
- `src/styles.css` giữ Tailwind import, font, theme và base style.
- Icon dùng SVG từ Lucide để hiển thị ổn định giữa các trình duyệt.
- Các mốc responsive chính gồm 760px, 1150px, 1550px cùng breakpoint `sm` và
  `xl` của Tailwind.

## Kiểm thử

Test hiện bao phủ:

- Validation, CRUD, duplicate key và transaction nhập dữ liệu.
- Serialize/parse backup.
- Google OAuth, Drive list/upload/download và giới hạn dung lượng.
- Lịch ôn và lựa chọn bài theo chế độ/chủ đề.
- Nhận diện cấu trúc do người dùng lưu.

Chưa có bộ test end-to-end điều khiển trình duyệt.

## Quyền riêng tư

Bài học mặc định chỉ nằm trong IndexedDB của trình duyệt. Access token Google
chỉ giữ trong bộ nhớ của phiên ứng dụng. Thao tác sao lưu chỉ chạy khi người
dùng yêu cầu. Nội dung chi tiết nằm tại trang `/privacy`.
