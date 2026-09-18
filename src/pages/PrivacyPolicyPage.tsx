import {
  ArrowLeft,
  BookOpen,
  Cloud,
  HardDrive,
  Mail,
  ShieldCheck,
} from 'lucide-react';
import { useEffect } from 'react';

const sections = [
  {
    id: 'overview',
    title: 'Phạm vi chính sách',
    paragraphs: [
      'Phrasebook giúp bạn lưu cụm từ, câu, đoạn văn, cấu trúc tiếng Anh và theo dõi việc ôn tập. Chính sách này mô tả cách phiên bản hiện tại xử lý dữ liệu học tập và thông tin Google khi bạn sử dụng ứng dụng.',
      'Bạn có thể học và quản lý bài mà không kết nối Google. Kết nối Google là lựa chọn bổ sung để tạo và khôi phục bản sao trên Google Drive, đồng thời xác minh quyền dùng tính năng nghe phát âm.',
    ],
  },
  {
    id: 'learning-data',
    title: 'Dữ liệu học tập trên trình duyệt',
    paragraphs: [
      'Phrasebook lưu nội dung tiếng Anh, nghĩa, ghi chú, chủ đề, cụm từ được đánh dấu, trạng thái học, mã bài và thời gian tạo/cập nhật trong cơ sở dữ liệu của trình duyệt (IndexedDB). Ứng dụng hiện không có máy chủ riêng để lưu các bài học này.',
      'Dữ liệu gắn với trình duyệt và địa chỉ trang web bạn sử dụng. Đổi thiết bị, trình duyệt hoặc địa chỉ truy cập không tự chuyển bài học sang nơi mới. Xóa dữ liệu trang web có thể làm mất các bài đã lưu.',
      'Đăng xuất hoặc đổi tài khoản Google không xóa hay tách dữ liệu học tập trên trình duyệt. Người dùng chung cùng hồ sơ trình duyệt có thể truy cập sổ bài học này.',
    ],
  },
  {
    id: 'google-account',
    title: 'Thông tin tài khoản Google',
    paragraphs: [
      'Sau khi bạn cấp quyền, ứng dụng sử dụng tên hiển thị, địa chỉ email và mã định danh tài khoản Google để nhận diện tài khoản đang kết nối. Phiên bản hiện tại không sử dụng ảnh đại diện và không nhận mật khẩu Google của bạn.',
      'Thông tin tài khoản và mã truy cập Google chỉ được giữ trong bộ nhớ của phiên ứng dụng, không được ghi vào cơ sở dữ liệu bài học hoặc bộ nhớ lưu trữ lâu dài của ứng dụng. Khi tải lại trang, đăng xuất hoặc phiên hết hạn, bạn cần kết nối lại để thao tác với Drive.',
      'Khi tính năng Google được cấu hình, ứng dụng tải thư viện đăng nhập từ Google khi mở ứng dụng, kể cả trước khi bạn bấm đăng nhập. Google có thể nhận thông tin kết nối như địa chỉ IP và thông tin trình duyệt theo chính sách của Google.',
    ],
  },
  {
    id: 'drive-backup',
    title: 'Sao lưu và khôi phục trên Drive',
    paragraphs: [
      'Phrasebook yêu cầu quyền thông tin tài khoản cơ bản và quyền truy cập vùng dữ liệu riêng của ứng dụng trên Google Drive (drive.appdata). Quyền Drive này không cho phép ứng dụng đọc các tài liệu, ảnh hoặc thư mục thông thường khác trong Drive của bạn.',
      'Chỉ khi bạn chọn sao lưu, toàn bộ bài học và tiến độ trên trình duyệt mới được gửi trực tiếp đến Google Drive để tạo một bản sao mới. Ứng dụng đọc thông tin các bản sao để hiển thị danh sách và tải nội dung bản sao bạn chọn khi khôi phục.',
      'Bản sao nằm trong vùng dữ liệu ẩn dành cho Phrasebook, không xuất hiện trong danh sách tệp Drive thông thường. Ứng dụng không tự đồng bộ và không tự cập nhật hoặc xóa các bản sao cũ. Xóa một bài trên trình duyệt không xóa bài đó trong bản sao đã tạo.',
      'Khi nhập lại bản sao, ứng dụng yêu cầu xác nhận trước khi lưu bài vào trình duyệt. Bài trùng được bỏ qua và dữ liệu hiện có được giữ nguyên.',
    ],
  },
  {
    id: 'speech',
    title: 'Nghe phát âm bằng Google Cloud',
    paragraphs: [
      'Khi bấm Nghe phát âm, nội dung tiếng Anh đang chọn, giọng và tốc độ đọc được gửi qua backend Phrasebook đến Google Cloud Text-to-Speech để tạo âm thanh. Nội dung không tự gửi khi bạn mở bài học.',
      'Mã truy cập Google trong phiên được gửi đến backend để Google xác minh tài khoản. Backend kiểm tra email được phép sử dụng và giữ bộ đếm lượt gọi tạm thời để giới hạn chi phí. Thông tin xác thực Google Cloud của dịch vụ được giữ riêng trên backend.',
      'Mã ứng dụng không ghi nội dung bài, mã truy cập hoặc âm thanh vào log hay cơ sở dữ liệu backend. Âm thanh được giữ tạm trong trình duyệt để phát và được giải phóng khi dừng hoặc rời phần nghe. Hạ tầng hosting và Google có thể xử lý thông tin kết nối theo chính sách riêng.',
    ],
  },
  {
    id: 'data-use',
    title: 'Mục đích sử dụng và chia sẻ',
    paragraphs: [
      'Dữ liệu được dùng để hiển thị, tìm kiếm, chỉnh sửa, ôn tập và thực hiện thao tác sao lưu/khôi phục mà bạn yêu cầu. Ứng dụng hiện không tích hợp công cụ quảng cáo hoặc phân tích hành vi, không bán dữ liệu cá nhân và không gửi bài học đến dịch vụ huấn luyện AI.',
      'Các thao tác sao lưu Drive được thực hiện trực tiếp giữa trình duyệt và dịch vụ Google. Tính năng nghe phát âm đi qua backend của Phrasebook. File JSON bạn xuất được tải về thiết bị; người có file này có thể đọc nội dung bài học, vì ứng dụng không mã hóa file sao lưu bằng mật khẩu.',
      'Trên trình duyệt hỗ trợ WebMCP, ứng dụng cung cấp công cụ chỉ đọc danh sách bài học cho trợ lý tương thích. Khi công cụ được gọi, nội dung bài học có thể được trả về cho trợ lý theo cơ chế quyền của trình duyệt; việc sử dụng tiếp theo còn phụ thuộc vào dịch vụ trợ lý bạn chọn.',
    ],
  },
  {
    id: 'delete-data',
    title: 'Thời gian lưu giữ và cách xóa',
    paragraphs: [
      'Bài học cục bộ được giữ đến khi bạn xóa bài hoặc xóa dữ liệu của trang web trong cài đặt trình duyệt; trình duyệt cũng có thể dọn dữ liệu lưu trữ. Hãy xuất bản sao trước nếu bạn muốn giữ lại nội dung.',
      'Bản sao trên Drive được giữ cho đến khi bạn xóa dữ liệu ứng dụng tại Google Drive. Bạn có thể mở Cài đặt Drive → Quản lý ứng dụng → Phrasebook và dùng tùy chọn xóa dữ liệu ứng dụng ẩn nếu được hiển thị. Phrasebook hiện chưa có nút xóa từng bản sao trên Drive.',
      'File JSON đã tải về cần được xóa riêng trên thiết bị và ở những nơi bạn đã sao chép hoặc chia sẻ. Xóa dữ liệu trình duyệt không xóa bản sao Drive hoặc file JSON.',
    ],
  },
  {
    id: 'revoke-access',
    title: 'Đăng xuất và thu hồi quyền Google',
    paragraphs: [
      'Nút đăng xuất trong Phrasebook chỉ kết thúc kết nối trong phiên ứng dụng. Thao tác này không đăng xuất tài khoản Google trên trình duyệt, không thu hồi quyền đã cấp và không xóa các bản sao.',
      'Để thu hồi quyền, mở trang quản lý kết nối bên thứ ba của tài khoản Google, chọn Phrasebook rồi xóa kết nối. Thu hồi quyền truy cập là thao tác riêng với việc xóa dữ liệu sao lưu; hãy kiểm tra và xóa bản sao nếu đó là điều bạn muốn.',
    ],
  },
  {
    id: 'updates-contact',
    title: 'Cập nhật và liên hệ',
    paragraphs: [
      'Chính sách sẽ được cập nhật khi chức năng hoặc cách xử lý dữ liệu thay đổi. Ngày cập nhật được hiển thị ở đầu trang.',
      'Nếu có câu hỏi về quyền riêng tư hoặc cần hướng dẫn quản lý dữ liệu, hãy liên hệ qua email bên dưới. Nhà phát triển không có quyền truy cập trực tiếp để xóa cơ sở dữ liệu trên trình duyệt hoặc Drive cá nhân thay bạn.',
    ],
  },
];

const linkClass =
  'font-medium text-forest underline decoration-forest/30 underline-offset-4 hover:decoration-forest [overflow-wrap:anywhere]';

const PrivacyPolicyPage = () => {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = 'Chính sách quyền riêng tư — Phrasebook';
    return () => {
      document.title = previousTitle;
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#f6f7f9] text-[#26382f]">
      <header className="border-b border-line bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-5 sm:px-8">
          <a
            href="/"
            aria-label="Phrasebook — Trang chủ"
            className="flex items-center gap-2.5 text-xl font-bold tracking-tight"
          >
            <span className="grid size-9 place-items-center rounded-xl bg-forest text-lime">
              <BookOpen size={22} aria-hidden="true" />
            </span>
            phrasebook<span className="-ml-2 text-[#829d53]">.</span>
          </a>
          <a
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-forest hover:underline"
          >
            <ArrowLeft size={16} aria-hidden="true" /> Quay về ứng dụng
          </a>
        </div>
      </header>
      <main
        id="main-content"
        className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-14"
      >
        <div className="max-w-3xl">
          <span className="mb-5 inline-flex items-center gap-2 rounded-full bg-[#eaf0e7] px-3 py-1.5 text-xs font-semibold tracking-wide text-forest">
            <ShieldCheck size={16} aria-hidden="true" /> QUYỀN RIÊNG TƯ CỦA BẠN
          </span>
          <h1 className="text-3xl leading-tight font-medium tracking-tight sm:text-5xl">
            Chính sách quyền riêng tư<span className="text-[#829d53]">.</span>
          </h1>
          <p className="mt-5 text-base leading-7 text-[#65756b]">
            Hiểu dữ liệu nào được lưu, khi nào được gửi đến Google và cách bạn
            quản lý các bản sao của mình.
          </p>
          <p className="mt-4 text-sm text-[#65756b]">
            Cập nhật lần cuối: <time dateTime="2026-09-18">18/09/2026</time>
          </p>
        </div>
        <div className="my-8 grid gap-4 sm:grid-cols-2">
          <div className="flex items-start gap-3 rounded-xl border border-line bg-white p-5">
            <HardDrive
              size={22}
              aria-hidden="true"
              className="shrink-0 text-forest"
            />
            <div>
              <h2 className="font-semibold">Bài học lưu trên trình duyệt</h2>
              <p className="mt-1 text-sm leading-6 text-[#65756b]">
                Bạn có thể dùng sổ học mà không kết nối Google.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-xl border border-line bg-white p-5">
            <Cloud
              size={22}
              aria-hidden="true"
              className="shrink-0 text-forest"
            />
            <div>
              <h2 className="font-semibold">Sao lưu khi bạn chọn</h2>
              <p className="mt-1 text-sm leading-6 text-[#65756b]">
                Google Drive giữ bản sao thủ công, không tự đồng bộ.
              </p>
            </div>
          </div>
        </div>
        <div className="grid items-start gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-8">
          <nav
            aria-label="Mục lục chính sách"
            className="rounded-xl border border-line bg-white p-5 lg:sticky lg:top-6"
          >
            <h2 className="mb-3 text-xs font-semibold tracking-widest text-[#65756b]">
              NỘI DUNG
            </h2>
            <ol className="space-y-1">
              {sections.map((section, index) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    className="block rounded-md px-2 py-2 text-sm leading-5 text-[#53685b] hover:bg-[#f0f4f1]"
                  >
                    {index + 1}. {section.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
          <article
            aria-label="Nội dung chính sách quyền riêng tư"
            className="min-w-0 divide-y divide-line rounded-xl border border-line bg-white px-5 sm:px-8"
          >
            {sections.map((section, index) => (
              <section
                key={section.id}
                id={section.id}
                aria-labelledby={`${section.id}-title`}
                className="scroll-mt-6 py-7 sm:py-8"
              >
                <h2
                  id={`${section.id}-title`}
                  className="text-xl leading-7 font-semibold"
                >
                  {index + 1}. {section.title}
                </h2>
                <div className="mt-4 space-y-4 text-sm leading-7 text-[#53685b] sm:text-base">
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
                {section.id === 'google-account' && (
                  <p className="mt-4 text-sm leading-7">
                    <a
                      className={linkClass}
                      href="https://policies.google.com/privacy"
                    >
                      Chính sách quyền riêng tư của Google
                    </a>
                  </p>
                )}
                {section.id === 'data-use' && (
                  <p className="mt-4 text-sm leading-7 text-[#53685b]">
                    Việc sử dụng và chuyển giao thông tin nhận từ Google APIs
                    tuân theo{' '}
                    <a
                      className={linkClass}
                      href="https://developers.google.com/terms/api-services-user-data-policy"
                    >
                      Google API Services User Data Policy
                    </a>
                    , bao gồm các yêu cầu Limited Use (giới hạn sử dụng).
                  </p>
                )}
                {section.id === 'delete-data' && (
                  <p className="mt-4 text-sm">
                    <a
                      className={linkClass}
                      href="https://drive.google.com/drive/settings"
                    >
                      Mở cài đặt Google Drive
                    </a>
                  </p>
                )}
                {section.id === 'revoke-access' && (
                  <p className="mt-4 text-sm">
                    <a
                      className={linkClass}
                      href="https://myaccount.google.com/connections"
                    >
                      Quản lý kết nối tài khoản Google
                    </a>
                  </p>
                )}
                {section.id === 'updates-contact' && (
                  <a
                    className={`${linkClass} mt-4 inline-flex max-w-full items-center gap-2 text-sm`}
                    href="mailto:ke1tran666@gmail.com"
                  >
                    <Mail size={17} aria-hidden="true" className="shrink-0" />
                    ke1tran666@gmail.com
                  </a>
                )}
              </section>
            ))}
          </article>
        </div>
        <footer className="mt-10 border-t border-line pt-6 text-sm text-[#65756b]">
          Phrasebook · Sổ tiếng Anh cá nhân
        </footer>
      </main>
    </div>
  );
};

export default PrivacyPolicyPage;
