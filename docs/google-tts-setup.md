# Google Cloud Text-to-Speech

Nút **Nghe phát âm** nằm trong chi tiết bài học và thẻ ôn tập. Chọn giọng Anh–Mỹ/Anh–Anh, tốc độ 0.75×/1×/1.25×; bấm lần nữa để dừng hoặc hủy tải. Mỗi lần nghe tối đa 5.000 byte UTF-8, nội dung dài hơn sẽ được báo lỗi thay vì cắt mất câu. Mỗi lần bấm tạo yêu cầu mới, có thể tính phí.

## 1. Cấu hình Google Cloud

1. Chọn dự án Google Cloud, bật billing và **Cloud Text-to-Speech API**.
2. Cài Google Cloud CLI. Trên máy phát triển, chạy:

```sh
gcloud auth application-default login
gcloud auth application-default set-quota-project YOUR_PROJECT_ID
```

Tài khoản cần quyền sử dụng API trên dự án (bao gồm `serviceusage.services.use`). Backend dùng Application Default Credentials; không dùng token Drive của người dùng để thanh toán TTS.

Khi triển khai, dùng service account gắn với môi trường hosting và cấp quyền cần thiết. Nếu buộc dùng file credential JSON, để file ngoài repository và trỏ `GOOGLE_APPLICATION_CREDENTIALS` tới đó. Không đưa credential vào `VITE_*`, frontend hoặc Git.

## 2. Cấu hình backend

Sao chép `.env.server.example` thành `.env.server.local`:

```dotenv
GOOGLE_OAUTH_CLIENT_ID=your-client-id.apps.googleusercontent.com
TTS_ALLOWED_EMAILS=your-email@gmail.com
TTS_PORT=3001
```

`GOOGLE_OAUTH_CLIENT_ID` phải trùng `VITE_GOOGLE_CLIENT_ID` của frontend. Danh sách email cho phép phân cách bằng dấu phẩy; để trống sẽ từ chối sử dụng. File `.env.server.local` đã thuộc quy tắc Git ignore.

## 3. Chạy

Node 22.9+ hỗ trợ lệnh env-file đang dùng. Mở hai terminal tại thư mục dự án:

```sh
pnpm dev:tts
```

```sh
pnpm dev
```

Vite chuyển `/api/tts` sang `127.0.0.1:3001`. Nếu thay cổng backend, cập nhật proxy trong `vite.config.ts` tương ứng.

Trong ứng dụng: **Sao lưu dữ liệu → Kết nối Google**, sau đó mở bài học hoặc ôn tập và bấm **Nghe phát âm**. Dùng phiên đăng nhập hiện có nên hiện tại kết nối này vẫn yêu cầu quyền Drive. Không cần thêm quyền Cloud vào OAuth của người dùng.

## 4. Khi đưa lên hosting

Frontend tĩnh một mình không chạy được TTS. Chạy backend Node riêng, reverse proxy HTTPS `/api/tts` đến backend trên loopback. Không log header Authorization hoặc nội dung request. Không cho phép truy cập backend trực tiếp từ Internet.

Backend xác minh access token với Google, kiểm tra OAuth client, email đã xác minh và danh sách email được phép. Giới hạn mỗi email 10 yêu cầu/phút, tổng 100 yêu cầu/giờ và 3 yêu cầu đồng thời cho một tiến trình. Giới hạn nằm trong RAM, sẽ reset khi khởi động lại và không chia sẻ giữa nhiều instance. Khi mở rộng cần bộ giới hạn dùng chung; cấu hình thêm quota tại Google Cloud. Budget alert không thay thế giới hạn chi phí cứng.

Không lưu text hoặc âm thanh vào database backend. Các yêu cầu TTS được tắt retry tự động để tránh gọi lặp ngoài ý muốn. Dừng phía trình duyệt không đảm bảo hủy được yêu cầu Google đã nhận hoặc khoản phí của yêu cầu đó.

## 5. Kiểm tra và lỗi thường gặp

```sh
pnpm typecheck
pnpm typecheck:server
pnpm test:tts
pnpm build
```

- 401: kết nối lại Google; kiểm tra hai client ID trùng nhau.
- 403: thêm đúng email vào `TTS_ALLOWED_EMAILS`, khởi động lại backend.
- 429: đã đạt giới hạn lượt gọi hoặc số yêu cầu đồng thời.
- 502: kiểm tra ADC, API đã bật, billing và quota; thông tin lỗi Google không được trả nguyên văn ra frontend.
- 503: chưa cấu hình client ID hoặc danh sách email backend.

Test dùng mô phỏng Google, không xác nhận credential hay phát sinh yêu cầu trả phí thật.

Tài liệu: [Thiết lập TTS](https://docs.cloud.google.com/text-to-speech/docs/get-started), [Tạo âm thanh](https://docs.cloud.google.com/text-to-speech/docs/create-audio), [API synthesize](https://docs.cloud.google.com/text-to-speech/docs/reference/rest/v1/text/synthesize).
