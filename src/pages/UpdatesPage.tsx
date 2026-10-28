import { useEffect, useState } from 'react';
import {
  Calendar,
  Check,
  Copy,
  Pencil,
  Plus,
  Rocket,
  Search,
  Sparkles,
  Tag,
  Trash2,
  X,
} from 'lucide-react';
import { ui } from '@/styles/ui';
import { useLanguage } from '@/language';
import {
  CURRENT_VERSION,
  deleteCustomRelease,
  getAllReleases,
  saveCustomRelease,
  type ReleaseNote,
} from '@/data/changelog';
import Modal from '@/components/Modal';
import { ADMIN_EMAIL } from '@/services/admin-auth';

type UpdatesPageProps = {
  notify: (msg: string) => void;
  isAdmin?: boolean;
};

type DetailCategoryForm = {
  category: string;
  items: string[];
};

const UpdatesPage = ({ notify, isAdmin = false }: UpdatesPageProps) => {
  const { t } = useLanguage();
  const [releases, setReleases] = useState<ReleaseNote[]>(getAllReleases);
  const [search, setSearch] = useState('');
  const [editingRelease, setEditingRelease] = useState<
    ReleaseNote | null | 'new'
  >(null);
  const [copiedVersion, setCopiedVersion] = useState<string | null>(null);

  // Form states for authoring updates
  const [formVersion, setFormVersion] = useState('');
  const [formDisplayVersion, setFormDisplayVersion] = useState('');
  const [formDate, setFormDate] = useState('');
  const [formTitle, setFormTitle] = useState('');
  const [formSummary, setFormSummary] = useState('');
  const [formHighlights, setFormHighlights] = useState<string[]>(['']);
  const [formDetails, setFormDetails] = useState<DetailCategoryForm[]>([]);
  const [formIsNew, setFormIsNew] = useState(true);

  // Sync releases list when change event fires
  useEffect(() => {
    const handleUpdatesChange = () => {
      setReleases(getAllReleases());
    };
    window.addEventListener('phrasebook_updates_changed', handleUpdatesChange);
    return () => {
      window.removeEventListener(
        'phrasebook_updates_changed',
        handleUpdatesChange,
      );
    };
  }, []);

  const openNewReleaseModal = () => {
    if (!isAdmin) return;
    const now = new Date();
    const defaultDate = `Tháng ${now.getMonth() + 1}, ${now.getFullYear()}`;
    setFormVersion('');
    setFormDisplayVersion('');
    setFormDate(defaultDate);
    setFormTitle('');
    setFormSummary('');
    setFormHighlights(['']);
    setFormDetails([]);
    setFormIsNew(true);
    setEditingRelease('new');
  };

  const openEditReleaseModal = (release: ReleaseNote) => {
    if (!isAdmin) return;
    setFormVersion(release.version);
    setFormDisplayVersion(release.displayVersion);
    setFormDate(release.releaseDate);
    setFormTitle(release.title);
    setFormSummary(release.summary);
    setFormHighlights(
      release.highlights.length ? [...release.highlights] : [''],
    );
    setFormDetails(
      release.details && release.details.length > 0
        ? release.details.map((d) => ({
            category: d.category,
            items: d.items.length ? [...d.items] : [''],
          }))
        : [],
    );
    setFormIsNew(!!release.isNew);
    setEditingRelease(release);
  };

  const handleSaveRelease = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) return;
    if (!formTitle.trim() || !formVersion.trim()) return;

    const displayVer =
      formDisplayVersion.trim() ||
      (formVersion.startsWith('v') ? formVersion.trim() : `v${formVersion.trim()}`);

    const cleanHighlights = formHighlights
      .map((h) => h.trim())
      .filter((h) => h.length > 0);

    const cleanDetails = formDetails
      .map((g) => ({
        category: g.category.trim(),
        items: g.items.map((i) => i.trim()).filter((i) => i.length > 0),
      }))
      .filter((g) => g.category.length > 0 && g.items.length > 0);

    const newRelease: ReleaseNote = {
      version: formVersion.trim(),
      displayVersion: displayVer,
      releaseDate: formDate.trim() || 'Hôm nay',
      title: formTitle.trim(),
      summary: formSummary.trim(),
      isNew: formIsNew,
      isCustom: true,
      highlights: cleanHighlights,
      details: cleanDetails.length > 0 ? cleanDetails : undefined,
    };

    saveCustomRelease(newRelease);
    setReleases(getAllReleases());
    setEditingRelease(null);
    notify(`Đã lưu bản cập nhật ${displayVer}!`);
  };

  const handleDelete = (release: ReleaseNote) => {
    if (!isAdmin) return;
    if (
      window.confirm(
        `Bạn có chắc chắn muốn xóa bản cập nhật ${release.displayVersion}?`,
      )
    ) {
      deleteCustomRelease(release.version);
      setReleases(getAllReleases());
      notify(`Đã xóa bản cập nhật ${release.displayVersion}.`);
    }
  };

  const handleCopyCode = (release: ReleaseNote) => {
    const codeSnippet = JSON.stringify(
      {
        version: release.version,
        displayVersion: release.displayVersion,
        releaseDate: release.releaseDate,
        title: release.title,
        summary: release.summary,
        highlights: release.highlights,
        ...(release.details && release.details.length > 0
          ? { details: release.details }
          : {}),
      },
      null,
      2,
    );

    navigator.clipboard.writeText(codeSnippet).then(() => {
      setCopiedVersion(release.version);
      notify('Đã sao chép cấu trúc JSON của bản cập nhật.');
      setTimeout(() => setCopiedVersion(null), 3000);
    });
  };

  // Highlights handlers
  const handleAddHighlightLine = () => {
    setFormHighlights([...formHighlights, '']);
  };

  const handleUpdateHighlightLine = (index: number, value: string) => {
    const updated = [...formHighlights];
    updated[index] = value;
    setFormHighlights(updated);
  };

  const handleRemoveHighlightLine = (index: number) => {
    if (formHighlights.length <= 1) {
      setFormHighlights(['']);
      return;
    }
    setFormHighlights(formHighlights.filter((_, i) => i !== index));
  };

  // Category details handlers
  const handleAddDetailCategory = (categoryName = '') => {
    setFormDetails((prev) => [
      ...prev,
      { category: categoryName, items: [''] },
    ]);
  };

  const handleRemoveDetailCategory = (catIndex: number) => {
    setFormDetails((prev) => prev.filter((_, idx) => idx !== catIndex));
  };

  const handleUpdateCategoryName = (catIndex: number, name: string) => {
    setFormDetails((prev) =>
      prev.map((group, idx) =>
        idx === catIndex ? { ...group, category: name } : group,
      ),
    );
  };

  const handleAddItemToCategory = (catIndex: number) => {
    setFormDetails((prev) =>
      prev.map((group, idx) =>
        idx === catIndex ? { ...group, items: [...group.items, ''] } : group,
      ),
    );
  };

  const handleUpdateCategoryItem = (
    catIndex: number,
    itemIndex: number,
    value: string,
  ) => {
    setFormDetails((prev) =>
      prev.map((group, idx) => {
        if (idx !== catIndex) return group;
        const updated = [...group.items];
        updated[itemIndex] = value;
        return { ...group, items: updated };
      }),
    );
  };

  const handleRemoveCategoryItem = (catIndex: number, itemIndex: number) => {
    setFormDetails((prev) =>
      prev.map((group, idx) => {
        if (idx !== catIndex) return group;
        if (group.items.length <= 1) {
          return { ...group, items: [''] };
        }
        return {
          ...group,
          items: group.items.filter((_, i) => i !== itemIndex),
        };
      }),
    );
  };

  const filteredReleases = releases.filter((r) => {
    const query = search.trim().toLowerCase();
    if (!query) return true;
    return (
      r.title.toLowerCase().includes(query) ||
      r.summary.toLowerCase().includes(query) ||
      r.displayVersion.toLowerCase().includes(query) ||
      r.highlights.some((h) => h.toLowerCase().includes(query)) ||
      (r.details &&
        r.details.some(
          (d) =>
            d.category.toLowerCase().includes(query) ||
            d.items.some((item) => item.toLowerCase().includes(query)),
        ))
    );
  });

  return (
    <>
      {/* Header */}
      <div className={ui('page-heading')}>
        <div>
          <span className={ui('eyebrow')}>{t('updates.eyebrow')}</span>
          <h1>
            {t('updates.title')}
            <span>.</span>
          </h1>
          <p>{t('updates.subtitle')}</p>
        </div>

        {/* Nút Viết cập nhật mới: Chỉ Admin mới thấy */}
        {isAdmin && (
          <button
            type="button"
            onClick={openNewReleaseModal}
            className="inline-flex items-center gap-2 rounded-xl bg-forest px-4 sm:px-5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-xs hover:bg-forest-hover active:scale-[0.99] transition-all ml-auto self-start mt-2 sm:mt-0"
          >
            <Plus size={16} />
            <span>{t('updates.writeNew')}</span>
          </button>
        )}
      </div>

      {/* Overview & Quick Search Bar */}
      <div className="mb-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 rounded-2xl border border-line bg-surface p-4 sm:p-5 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-forest-soft text-forest">
            <Rocket size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-text">
                Phrasebook {CURRENT_VERSION}
              </span>
              <span className="rounded-full bg-status-learned-bg px-2 py-0.5 text-[10px] font-bold text-status-learned border border-status-learned/20">
                Đang chạy
              </span>
              {isAdmin && (
                <span className="rounded-full bg-forest-soft px-2 py-0.5 text-[10px] font-bold text-forest border border-forest/20">
                  Admin: {ADMIN_EMAIL}
                </span>
              )}
            </div>
            <p className="text-xs text-muted mt-0.5">
              Tổng số {releases.length} bản phát hành đã được ghi nhận.
            </p>
          </div>
        </div>

        {/* Search input */}
        <div className="relative min-w-0 sm:w-64">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
          />
          <input
            type="text"
            placeholder="Tìm tính năng hoặc phiên bản..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-line bg-surface-soft pl-9 pr-3 py-2 text-xs text-text placeholder:text-muted focus:border-forest"
          />
        </div>
      </div>

      {/* Release Timeline / List */}
      <div className="space-y-6">
        {filteredReleases.map((release) => (
          <article
            key={release.version}
            className={`rounded-2xl border p-5 sm:p-7 shadow-xs transition-all ${
              release.isNew
                ? 'border-forest/40 bg-surface ring-1 ring-forest/15'
                : 'border-line bg-surface'
            }`}
          >
            {/* Release Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-line">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="font-mono text-sm font-bold bg-forest text-white px-2.5 py-1 rounded-lg shadow-xs">
                  {release.displayVersion}
                </span>

                {release.isNew && (
                  <span className="rounded-full bg-status-learned-bg px-2.5 py-0.5 text-xs font-bold text-status-learned border border-status-learned/25">
                    Mới nhất
                  </span>
                )}

                {release.isCustom && (
                  <span className="rounded-full bg-status-info-bg px-2.5 py-0.5 text-xs font-bold text-status-info border border-status-info/25">
                    Tự tạo
                  </span>
                )}

                <span className="text-xs text-muted flex items-center gap-1.5 ml-1">
                  <Calendar size={13} />
                  <span>{release.releaseDate}</span>
                </span>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1.5 ml-auto">
                <button
                  type="button"
                  onClick={() => handleCopyCode(release)}
                  className="inline-flex items-center gap-1 rounded-lg border border-line bg-surface px-2.5 py-1 text-xs font-semibold text-text hover:bg-surface-soft transition-colors shadow-xs"
                  title="Sao chép JSON cấu trúc"
                >
                  {copiedVersion === release.version ? (
                    <Check size={13} className="text-status-learned" />
                  ) : (
                    <Copy size={13} />
                  )}
                  <span>
                    {copiedVersion === release.version ? 'Đã chép' : 'Sao chép'}
                  </span>
                </button>

                {/* Nút sửa/xóa bản tự tạo: Chỉ Admin mới có quyền thao tác */}
                {isAdmin && release.isCustom && (
                  <>
                    <button
                      type="button"
                      onClick={() => openEditReleaseModal(release)}
                      className="inline-flex items-center justify-center h-7 w-7 rounded-lg border border-line bg-surface text-text hover:bg-surface-soft transition-colors"
                      title="Chỉnh sửa bản cập nhật này"
                    >
                      <Pencil size={13} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(release)}
                      className="inline-flex items-center justify-center h-7 w-7 rounded-lg border border-line bg-surface text-muted hover:text-status-danger hover:bg-status-danger-bg transition-colors"
                      title="Xóa bản cập nhật này"
                    >
                      <Trash2 size={13} />
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Title & Summary */}
            <div className="mt-4">
              <h2 className="text-lg sm:text-xl font-bold text-text">
                {release.title}
              </h2>
              <p className="mt-1.5 text-xs sm:text-sm text-text-secondary leading-relaxed">
                {release.summary}
              </p>
            </div>

            {/* Highlights */}
            {release.highlights.length > 0 && (
              <div className="mt-4 rounded-xl border border-line bg-surface-soft p-4">
                <div className="flex items-center gap-1.5 text-forest font-bold text-xs uppercase tracking-wider mb-2.5">
                  <Sparkles size={14} />
                  <span>Điểm nổi bật & Cải tiến</span>
                </div>
                <ul className="space-y-2 text-xs sm:text-sm text-text-secondary">
                  {release.highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-2 leading-relaxed">
                      <span className="text-forest font-bold mt-0.5">•</span>
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Details by categories if present */}
            {release.details && release.details.length > 0 && (
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                {release.details.map((d, i) => (
                  <div
                    key={i}
                    className="rounded-xl border border-line bg-surface p-3.5"
                  >
                    <h3 className="text-xs font-bold uppercase tracking-wider text-text flex items-center gap-1.5 mb-2">
                      <Tag size={13} className="text-forest" />
                      <span>{d.category}</span>
                    </h3>
                    <ul className="space-y-1.5 text-xs text-text-secondary">
                      {d.items.map((item, j) => (
                        <li key={j} className="flex items-start gap-1.5 leading-snug">
                          <span className="text-forest mt-0.5">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </article>
        ))}

        {filteredReleases.length === 0 && (
          <div className="rounded-2xl border border-dashed border-line p-8 text-center text-muted">
            <Search size={32} className="mx-auto mb-2 text-muted/60" />
            <p className="text-sm font-medium">Không tìm thấy bản cập nhật nào.</p>
            <p className="text-xs mt-1">Thử tìm kiếm với từ khóa khác.</p>
          </div>
        )}
      </div>

      {/* Modal Soạn thảo bản cập nhật mới / Chỉnh sửa (Chỉ Admin) */}
      {isAdmin && (
        <Modal
          open={editingRelease !== null}
          label="Soạn nội dung cập nhật"
          onClose={() => setEditingRelease(null)}
          wide
        >
          <form onSubmit={handleSaveRelease} className="flex flex-col">
            {/* Header */}
            <div className={ui('modal-heading')}>
              <div>
                <span className={ui('eyebrow')}>QUẢN LÝ PHIÊN BẢN</span>
                <h2>
                  {editingRelease === 'new'
                    ? 'Viết bản cập nhật mới'
                    : 'Chỉnh sửa bản cập nhật'}
                </h2>
              </div>
              <button
                type="button"
                className={ui('icon-button')}
                onClick={() => setEditingRelease(null)}
                aria-label="Đóng"
              >
                <X size={20} />
              </button>
            </div>

            {/* Form Body */}
            <div className="p-6 space-y-5 text-sm max-h-[75vh] overflow-y-auto">
              {/* Version & Date */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-text mb-1 block">
                    Số phiên bản <span className="text-status-danger">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ví dụ: 2.2.0"
                    value={formVersion}
                    onChange={(e) => setFormVersion(e.target.value)}
                    className="w-full rounded-xl border border-line bg-surface p-2.5 text-xs text-text focus:border-forest"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-text mb-1 block">
                    Tên hiển thị
                  </label>
                  <input
                    type="text"
                    placeholder="Ví dụ: v2.2"
                    value={formDisplayVersion}
                    onChange={(e) => setFormDisplayVersion(e.target.value)}
                    className="w-full rounded-xl border border-line bg-surface p-2.5 text-xs text-text focus:border-forest"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-text mb-1 block">
                    Thời gian phát hành
                  </label>
                  <input
                    type="text"
                    placeholder="Ví dụ: Tháng 11, 2026"
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full rounded-xl border border-line bg-surface p-2.5 text-xs text-text focus:border-forest"
                  />
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="text-xs font-bold text-text mb-1 block">
                  Tiêu đề bản cập nhật <span className="text-status-danger">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Nâng cấp luyện phát âm & Giao diện tối ưu"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full rounded-xl border border-line bg-surface p-2.5 text-xs text-text focus:border-forest"
                />
              </div>

              {/* Summary */}
              <div>
                <label className="text-xs font-bold text-text mb-1 block">
                  Đoạn tóm tắt (1-2 câu ngắn gọn)
                </label>
                <textarea
                  rows={2}
                  placeholder="Tóm tắt những thay đổi quan trọng nhất của phiên bản này..."
                  value={formSummary}
                  onChange={(e) => setFormSummary(e.target.value)}
                  className="w-full rounded-xl border border-line bg-surface p-2.5 text-xs text-text focus:border-forest"
                />
              </div>

              {/* Highlights (Điểm nổi bật) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-xs font-bold text-text flex items-center gap-1.5">
                      <Sparkles size={13} className="text-forest" />
                      <span>Điểm nổi bật chính (Khung tím / Khung trên)</span>
                    </label>
                    <p className="text-[11px] text-muted">
                      Các cải tiến cốt lõi sẽ hiển thị gạch đầu dòng trong khung tổng quan.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddHighlightLine}
                    className="inline-flex items-center gap-1 text-xs font-bold text-forest hover:underline"
                  >
                    <Plus size={13} /> Thêm dòng
                  </button>
                </div>

                <div className="space-y-2">
                  {formHighlights.map((line, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="text-xs font-bold text-muted w-5 shrink-0 text-center">
                        {idx + 1}.
                      </span>
                      <input
                        type="text"
                        placeholder={`Nội dung tính năng mới ${idx + 1}...`}
                        value={line}
                        onChange={(e) =>
                          handleUpdateHighlightLine(idx, e.target.value)
                        }
                        className="w-full rounded-xl border border-line bg-surface p-2.5 text-xs text-text focus:border-forest"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveHighlightLine(idx)}
                        className="h-8 w-8 shrink-0 flex items-center justify-center rounded-lg text-muted hover:text-status-danger hover:bg-status-danger-bg transition-colors"
                        title="Xóa dòng này"
                      >
                        <X size={15} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Details by category (Phân loại chuyên mục 2 cột) */}
              <div className="space-y-3 pt-3 border-t border-line">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <label className="text-xs font-bold text-text flex items-center gap-1.5">
                      <Tag size={13} className="text-forest" />
                      <span>Phân loại chuyên mục chi tiết (Hiển thị lưới 2 cột)</span>
                    </label>
                    <p className="text-[11px] text-muted mt-0.5">
                      Chia nhỏ cập nhật thành các thẻ danh mục như Tính năng mới, Trải nghiệm UX, Sửa lỗi...
                    </p>
                  </div>

                  {/* Gợi ý thêm nhanh chuyên mục */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <button
                      type="button"
                      onClick={() => handleAddDetailCategory('TÍNH NĂNG MỚI')}
                      className="rounded-lg border border-line bg-surface-soft px-2 py-1 text-[11px] font-semibold text-text hover:border-forest hover:text-forest transition-colors shadow-2xs"
                    >
                      + Tính năng mới
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        handleAddDetailCategory('TRẢI NGHIỆM NGƯỜI DÙNG (UX)')
                      }
                      className="rounded-lg border border-line bg-surface-soft px-2 py-1 text-[11px] font-semibold text-text hover:border-forest hover:text-forest transition-colors shadow-2xs"
                    >
                      + Giao diện UX
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        handleAddDetailCategory('SỬA LỖI & TỐI ƯU HIỆU NĂNG')
                      }
                      className="rounded-lg border border-line bg-surface-soft px-2 py-1 text-[11px] font-semibold text-text hover:border-forest hover:text-forest transition-colors shadow-2xs"
                    >
                      + Sửa lỗi & Tối ưu
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAddDetailCategory('')}
                      className="inline-flex items-center gap-1 rounded-lg border border-forest/30 bg-forest-soft px-2.5 py-1 text-[11px] font-bold text-forest hover:bg-forest hover:text-white transition-colors shadow-2xs"
                    >
                      <Plus size={12} /> Nhóm mới
                    </button>
                  </div>
                </div>

                {formDetails.length > 0 ? (
                  <div className="space-y-3">
                    {formDetails.map((group, catIdx) => (
                      <div
                        key={catIdx}
                        className="rounded-xl border border-line bg-surface-soft p-3.5 space-y-2.5"
                      >
                        {/* Tên chuyên mục & Nút xóa nhóm */}
                        <div className="flex items-center gap-2">
                          <Tag size={13} className="text-forest shrink-0" />
                          <input
                            type="text"
                            placeholder="Tên nhóm (VD: TÍNH NĂNG MỚI, TRẢI NGHIỆM NGƯỜI DÙNG...)"
                            value={group.category}
                            onChange={(e) =>
                              handleUpdateCategoryName(catIdx, e.target.value)
                            }
                            className="w-full rounded-lg border border-line bg-surface px-2.5 py-1.5 text-xs font-bold text-text focus:border-forest uppercase"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveDetailCategory(catIdx)}
                            className="h-7 w-7 shrink-0 flex items-center justify-center rounded-lg text-muted hover:text-status-danger hover:bg-status-danger-bg transition-colors"
                            title="Xóa chuyên mục này"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>

                        {/* Các dòng trong chuyên mục */}
                        <div className="space-y-1.5 pl-2 sm:pl-3 border-l-2 border-forest/30">
                          {group.items.map((item, itemIdx) => (
                            <div key={itemIdx} className="flex items-center gap-1.5">
                              <span className="text-forest font-bold text-xs shrink-0">•</span>
                              <input
                                type="text"
                                placeholder={`Nội dung chi tiết ${itemIdx + 1}...`}
                                value={item}
                                onChange={(e) =>
                                  handleUpdateCategoryItem(
                                    catIdx,
                                    itemIdx,
                                    e.target.value,
                                  )
                                }
                                className="w-full rounded-lg border border-line bg-surface px-2.5 py-1 text-xs text-text focus:border-forest"
                              />
                              <button
                                type="button"
                                onClick={() =>
                                  handleRemoveCategoryItem(catIdx, itemIdx)
                                }
                                className="h-6 w-6 shrink-0 flex items-center justify-center rounded text-muted hover:text-status-danger hover:bg-status-danger-bg transition-colors"
                                title="Xóa dòng"
                              >
                                <X size={13} />
                              </button>
                            </div>
                          ))}

                          <button
                            type="button"
                            onClick={() => handleAddItemToCategory(catIdx)}
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-forest hover:underline pt-1"
                          >
                            <Plus size={12} /> Thêm gạch đầu dòng trong nhóm này
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-xl border border-dashed border-line p-3 text-center text-xs text-muted">
                    Chưa có nhóm chuyên mục chi tiết. Bấm các nút gợi ý phía trên nếu bạn muốn chia 2 cột như bản v2.1.
                  </div>
                )}
              </div>

              {/* Checkbox: isNew */}
              <div className="flex items-center gap-2 pt-2 border-t border-line">
                <input
                  type="checkbox"
                  id="isNewRelease"
                  checked={formIsNew}
                  onChange={(e) => setFormIsNew(e.target.checked)}
                  className="size-4 accent-forest rounded"
                />
                <label
                  htmlFor="isNewRelease"
                  className="text-xs font-medium text-text cursor-pointer select-none"
                >
                  Đánh dấu là phiên bản mới nhất (Hiển thị huy hiệu "Mới" trên chuông)
                </label>
              </div>
            </div>

            {/* Footer */}
            <footer className={ui('modal-footer')}>
              <button
                type="button"
                className={ui('button secondary')}
                onClick={() => setEditingRelease(null)}
              >
                Hủy
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-xl bg-forest px-5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-xs hover:bg-forest-hover active:scale-[0.99] transition-all ml-auto"
              >
                <Check size={16} />
                <span>Lưu & Xuất bản</span>
              </button>
            </footer>
          </form>
        </Modal>
      )}
    </>
  );
};

export default UpdatesPage;