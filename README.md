# Phrasebook

Ứng dụng học tiếng Anh qua cụm từ, câu và đoạn văn. Bài học được lưu trong IndexedDB của trình duyệt; không có backend hoặc tài khoản ứng dụng.

## Chạy trên máy

Yêu cầu Node.js 22 LTS hoặc mới hơn và pnpm 12.4.1 (được ghim trong `package.json`). Nếu dùng Corepack, chạy `corepack enable` để bật pnpm.

```bash
pnpm install
pnpm dev
```

Mở địa chỉ Vite hiển thị trong terminal. Dùng cùng địa chỉ và cổng để truy cập đúng dữ liệu cũ. Khi chuyển từ bản được host sang localhost, hãy xuất và nhập file.

```bash
pnpm build
pnpm preview
pnpm test
```

## Công nghệ

React, TypeScript, Vite, Tailwind CSS, Dexie.js, IndexedDB và Lucide.

## Chức năng

- Thêm, xem, sửa và xóa bài học.
- Bôi chọn nội dung trong ô tiếng Anh để lưu cụm từ kèm nghĩa riêng. Sửa nội dung tiếng Anh sẽ xóa các đánh dấu cũ để tránh sai vị trí.
- Chủ đề, tìm kiếm, lọc trạng thái và sắp xếp.
- Ôn bằng thẻ: hiện đáp án, đánh dấu cần ôn hoặc đã nhớ.
- Xuất toàn bộ bài học và tiến độ sang JSON; kiểm tra định dạng trước khi nhập.
- Bỏ qua bài trùng theo loại và nội dung tiếng Anh đã chuẩn hóa Unicode, chữ hoa/thường, khoảng trắng. Giữ nguyên bài cũ, ghi chú và tiến độ.
- Dữ liệu khởi đầu trống; nút thêm 3 bài mẫu chỉ hoạt động khi người dùng chọn.

## Dữ liệu và sao lưu

Mỗi bài chứa ID, loại, nội dung tiếng Anh, nghĩa, ghi chú, chủ đề, trạng thái, cụm từ đánh dấu và thời gian tạo/cập nhật. File sao lưu có `app: "phrasebook"`, `version: 1`, `exportedAt` và `lessons`.

Nhập tối đa 10 MB / 10.000 bài mỗi lần. Toàn bộ file được kiểm tra trước khi ghi và thao tác nhập dùng một transaction. Nếu ID bị trùng nhưng nội dung khác, ứng dụng tạo ID mới.

IndexedDB gắn với trình duyệt và origin (giao thức, tên miền, cổng). Xóa dữ liệu trang web có thể mất bài học. JSON là bản sao thủ công, không tự đồng bộ. Bản web chưa có service worker để mở lại khi mất mạng; lưu trữ cục bộ không có nghĩa là mọi tài nguyên giao diện luôn có sẵn offline.

## Cấu trúc

- `src/App.tsx`: giao diện, editor, ôn tập và sao lưu.
- `src/db.ts`: database, kiểm tra dữ liệu, lưu bài, xuất/nhập.
- `src/styles.css`: giao diện responsive.
- `src/db.test.ts`: kiểm tra dữ liệu và các trường hợp nhập file.

Nếu trình duyệt hỗ trợ WebMCP, ứng dụng cung cấp công cụ chỉ đọc `list_phrasebook_lessons` dùng cùng database cục bộ.

## Kiểm tra

Build TypeScript/Vite và kiểm tra nghiệp vụ dữ liệu bằng IndexedDB mô phỏng đã chạy thành công. Chưa thực hiện kiểm tra trình duyệt trực tiếp. Không có môi trường WebMCP được phép sử dụng để xác minh công cụ chỉ đọc; đăng ký được bảo vệ bằng feature detection.
