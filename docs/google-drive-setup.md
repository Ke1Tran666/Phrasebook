# Kết nối Google và sao lưu Drive

## Cấu hình một lần

1. Tạo hoặc chọn project trong [Google Cloud Console](https://console.cloud.google.com/).
2. Bật **Google Drive API** cho project.
3. Trong **Google Auth Platform**, cấu hình Branding (tên ứng dụng, email hỗ trợ), Audience và Data Access. Khi ứng dụng đang Testing, thêm email dùng thử vào danh sách Test users.
4. Tạo OAuth Client ID, loại **Web application**.
5. Trong **Authorized JavaScript origins**, thêm đúng origin chạy ứng dụng, ví dụ `http://localhost:4000`, `http://localhost:5173` và tên miền HTTPS khi triển khai. `localhost` và `127.0.0.1` là hai origin khác nhau; cổng cũng phải khớp. Không thêm đường dẫn phía sau origin. Luồng popup token này không cần redirect URI hoặc Client Secret.
6. Sao chép `.env.example` thành `.env.local`, điền:

```dotenv
VITE_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
```

7. Khởi động lại `pnpm dev`. Vào **Sao lưu dữ liệu → Google Drive → Đăng nhập bằng Google**. Nếu cần cổng cố định, chạy `pnpm dev --port 4000 --strictPort`.

Client ID là thông tin công khai của frontend. Không đưa Client Secret, access token hoặc refresh token vào mã nguồn hay biến VITE. `.env.local` được bỏ qua bởi Git. Khi deploy, khai báo biến môi trường trước khi build lại.

## Cách hoạt động

- Google Identity Services mở cửa sổ chọn tài khoản và cấp quyền, sau đó lấy tên/email qua API userinfo. Đây là kết nối tài khoản cho bản web cục bộ, không có backend hay phiên đăng nhập server.
- Quyền yêu cầu: `openid`, `email`, `profile` và `https://www.googleapis.com/auth/drive.appdata`. Chỉ truy cập dữ liệu ứng dụng; không đọc toàn bộ Drive.
- Token chỉ giữ trong bộ nhớ. Tải lại trang, hết hạn hoặc đăng xuất cần kết nối lại. Đăng xuất xóa phiên trong ứng dụng, không đăng xuất Google toàn trình duyệt và không thu hồi quyền đã cấp. Có thể thu hồi quyền ở trang quản lý kết nối của tài khoản Google.
- Nút sao lưu tạo một file JSON mới trong `appDataFolder`. File không hiển thị trong My Drive thông thường; xem và nhập lại qua Phrasebook. Danh sách hiển thị 20 bản gần nhất.
- Giới hạn mỗi bản: 5 MB / 10.000 bài. Bản sao cũ không bị ghi đè hoặc tự xóa. Chưa có đồng bộ nền hay tự động sao lưu.
- Nhập bản sao sẽ kiểm tra dữ liệu rồi mở hộp xác nhận hiện có. Bài trùng bị bỏ qua, **không ghi đè ghi chú hoặc tiến độ đang có**. Muốn chuyển sang máy mới, đăng nhập cùng tài khoản Google trong cùng ứng dụng OAuth.
- Dữ liệu IndexedDB vẫn thuộc trình duyệt/origin, không tách riêng theo tài khoản Google. Đổi tài khoản không thay đổi bài đang lưu; chỉ thay đổi nơi lưu/đọc bản sao trên Drive.
- Nếu upload bị ngắt sau khi Google đã nhận file, hãy làm mới danh sách trước khi sao lưu lại để tránh tạo thêm bản giống nhau.

## Kiểm tra

`pnpm test` có test mock OAuth, quyền bị từ chối, token hết hạn, upload multipart, phạm vi appData, tải xuống có giới hạn và kiểm tra JSON.

Cần kiểm tra thật với OAuth Client ID đã cấu hình: đăng nhập, chọn tài khoản, tạo bản sao, tải lại danh sách, nhập trên trình duyệt khác, đăng xuất và từ chối quyền. Test mock không xác minh cấu hình Google Cloud thực tế.

## Tài liệu chính thức

- [Google token model](https://developers.google.com/identity/oauth2/web/guides/use-token-model)
- [Tạo OAuth Client ID](https://developers.google.com/identity/oauth2/web/guides/get-google-api-clientid)
- [Vùng dữ liệu ứng dụng Drive](https://developers.google.com/workspace/drive/api/guides/appdata)
