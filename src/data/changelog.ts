export type ChangeCategory = 'feature' | 'improvement' | 'ui' | 'security';

export type ReleaseNote = {
  version: string;
  displayVersion: string;
  releaseDate: string;
  title: string;
  summary: string;
  isNew?: boolean;
  isCustom?: boolean;
  highlights: string[];
  details?: {
    category: string;
    items: string[];
  }[];
};

export const CURRENT_VERSION = 'v2.1.0';
const STORAGE_KEY = 'phrasebook_last_seen_version';
const CUSTOM_UPDATES_KEY = 'phrasebook_custom_updates';

export const RELEASES: ReleaseNote[] = [
  {
    version: '2.1.0',
    displayVersion: 'v2.1',
    releaseDate: 'Tháng 10, 2026',
    title: 'Hệ thống thông báo 2 làn & Toast thông minh',
    isNew: true,
    summary:
      'Đã bổ sung Trung tâm thông báo 2 luồng, Toast nổi đếm ngược thông minh và tự động đóng băng khi rê chuột.',
    highlights: [
      'Phân tách 2 luồng thông báo: Hoạt động học tập cá nhân & Bản cập nhật phần mềm.',
      'Toast thông báo nổi cao cấp với chế độ tạm dừng đếm ngược khi rê chuột (Hover-to-Pause).',
      'Tự động phân loại màu sắc và biểu tượng trực quan: Thành công, Lỗi và Thông tin.',
      'Ghi nhận nhật ký thời gian thực mỗi khi Thêm, Sửa, Xóa bài học hoặc hoàn thành Flashcard.',
    ],
    details: [
      {
        category: 'Tính năng mới',
        items: [
          'Trung tâm thông báo (Notification Center) trên thanh Topbar với chuông báo unread.',
          'Tab Hoạt động hiển thị các bài đến hạn, tình trạng sao lưu và nhật ký hoạt động vừa diễn ra.',
          'Tab Cập nhật phần mềm chuẩn hóa dạng thẻ trực quan và đồng bộ.',
        ],
      },
      {
        category: 'Trải nghiệm người dùng (UX)',
        items: [
          'Tính năng Hover-to-Pause trên Toast: rê chuột vào thông báo sẽ giữ nguyên để người dùng kịp đọc.',
          'Tự động xóa chấm đỏ thông báo khi người dùng đã xem bản cập nhật mới.',
        ],
      },
    ],
  },
  {
    version: '2.0.0',
    displayVersion: 'v2.0',
    releaseDate: 'Tháng 10, 2026',
    title: 'Đại tu giao diện & Trải nghiệm toàn diện',
    isNew: false,
    summary:
      'Nâng cấp 3 chủ đề giao diện, phòng Flashcard 3D với phím tắt nhanh và Thư viện hiển thị Lưới/Danh sách.',
    highlights: [
      'Chuẩn hóa Style System & Design Tokens với 3 chủ đề: Sáng, Tối và Lễ Độc lập.',
      'Phòng Flashcard 3D với bảng điểm trực tiếp, phím tắt nhanh và chúc mừng hoàn thành.',
      'Thư viện 2 chế độ hiển thị: Dạng lưới (Grid) & Danh sách (List) kèm phát âm 1-chạm.',
      'Hộp soạn thảo bài học với thanh công cụ tô sáng từ vựng động & xem trước trực tiếp.',
      'Trang Sao lưu Google Drive & vùng kéo thả JSON an toàn.',
    ],
    details: [
      {
        category: 'Giao diện & Theme',
        items: [
          'Hệ màu semantic Tailwind v4: Light (Tím SimEnglish), Dark (Tím than dịu mắt), Independence (Lễ Độc lập).',
          'Typography chuẩn hóa font DM Sans và Noto Sans tiếng Việt.',
        ],
      },
      {
        category: 'Học tập & Luyện tập',
        items: [
          'Chế độ thẻ Flashcard 3D lật mượt mà.',
          'Phím tắt: Space/Enter để lật thẻ, 1/2 để chấm điểm nhớ/quên, Esc để kết thúc phiên.',
        ],
      },
    ],
  },
  {
    version: '1.5.0',
    displayVersion: 'v1.5',
    releaseDate: 'Tháng 9, 2026',
    title: 'Gợi ý cấu trúc câu & Đám mây Google Drive',
    isNew: false,
    summary:
      'Tích hợp sao lưu Google Drive AppData bảo mật và tự động nhận diện mẫu cấu trúc ngữ pháp khi soạn câu.',
    highlights: [
      'Tự động nhận diện cấu trúc câu đã lưu trong đoạn văn khi nhập liệu.',
      'Sao lưu đa thiết bị qua Google Drive AppData Folder an toàn.',
      'Thêm tính năng tô sáng từ vựng trong câu và gán nghĩa riêng.',
    ],
    details: [
      {
        category: 'Đồng bộ đám mây',
        items: [
          'Kết nối Google OAuth trực tiếp trên trình duyệt, không thông qua server trung gian.',
          'Dữ liệu lưu vào thư mục appData riêng tư của tài khoản Google Drive cá nhân.',
        ],
      },
    ],
  },
  {
    version: '1.0.0',
    displayVersion: 'v1.0',
    releaseDate: 'Tháng 8, 2026',
    title: 'Khởi tạo Phrasebook — Sổ tay tiếng Anh cá nhân',
    isNew: false,
    summary:
      'Sổ tay cá nhân lưu trữ từ vựng, câu và đoạn văn ngoại tuyến (offline) trên trình duyệt với thuật toán Spaced Repetition.',
    highlights: [
      'Lưu trữ dữ liệu IndexedDB an toàn trực tiếp trên máy của người dùng.',
      'Thuật toán ôn tập ngắt quãng (Spaced Repetition) với thang ngày lũy tiến 1-3-7-14-30 ngày.',
      'Xuất và nhập file bản sao lưu JSON đầy đủ.',
    ],
  },
];

// Lấy danh sách các bản cập nhật do người dùng tự viết
export const getCustomReleases = (): ReleaseNote[] => {
  try {
    const raw = localStorage.getItem(CUSTOM_UPDATES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

// Lưu một bản cập nhật mới do người dùng tự viết
export const saveCustomRelease = (release: ReleaseNote): void => {
  try {
    const current = getCustomReleases();
    const existingIndex = current.findIndex(
      (r) => r.version === release.version,
    );
    let updated: ReleaseNote[];
    if (existingIndex >= 0) {
      updated = [...current];
      updated[existingIndex] = { ...release, isCustom: true };
    } else {
      updated = [{ ...release, isCustom: true }, ...current];
    }
    localStorage.setItem(CUSTOM_UPDATES_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('phrasebook_updates_changed'));
  } catch {
    // ignore
  }
};

// Xóa một bản cập nhật tự viết
export const deleteCustomRelease = (version: string): void => {
  try {
    const current = getCustomReleases();
    const updated = current.filter((r) => r.version !== version);
    localStorage.setItem(CUSTOM_UPDATES_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('phrasebook_updates_changed'));
  } catch {
    // ignore
  }
};

// Lấy tất cả bản cập nhật: gộp các bản tự viết và các bản mặc định
export const getAllReleases = (): ReleaseNote[] => {
  const custom = getCustomReleases();
  const customVersions = new Set(custom.map((r) => r.version));
  const base = RELEASES.filter((r) => !customVersions.has(r.version));
  return [...custom, ...base];
};

export const getLatestRelease = (): ReleaseNote => {
  const all = getAllReleases();
  return all[0] || RELEASES[0];
};

export const hasUnseenRelease = (): boolean => {
  try {
    const lastSeen = localStorage.getItem(STORAGE_KEY);
    const latest = getLatestRelease();
    return lastSeen !== latest.version;
  } catch {
    return false;
  }
};

export const markReleaseAsSeen = (version?: string): void => {
  try {
    const v = version || getLatestRelease().version;
    localStorage.setItem(STORAGE_KEY, v);
  } catch {
    // ignore
  }
};
