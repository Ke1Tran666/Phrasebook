import { ui } from '@/styles/ui';
import { useMemo } from 'react';
import {
  detectStructures,
  type SavedStructure,
  type StructureSuggestion,
} from '@/structures';

type Props = {
  english: string;
  onAdd?: (text: string) => void;
  notes?: string;
  structures?: SavedStructure[];
};

const noteFor = (item: StructureSuggestion) =>
  `Cấu trúc: ${item.pattern}\n${item.meaning}\nVí dụ: ${item.sentence}`;

const StructureSuggestions = ({
  english,
  onAdd,
  notes = '',
  structures = [],
}: Props) => {
  const suggestions = useMemo(
    () => detectStructures(english, structures),
    [english, structures],
  );
  if (!english.trim()) return null;
  return (
    <section
      className="my-4 rounded-xl border border-[#dce4de] bg-[#f2f6f0] p-4"
      aria-label="Gợi ý cấu trúc"
    >
      <h3 className="text-sm font-semibold text-forest">Gợi ý cấu trúc</h3>
      <p className="mt-1 text-xs leading-relaxed text-[#65766b]">
        Đối chiếu với các cấu trúc bạn đã lưu. S = chủ ngữ; V = động từ nguyên
        mẫu.
      </p>
      {suggestions.length ? (
        <ul className="mt-3 space-y-3">
          {suggestions.map((item) => (
            <li key={item.id} className="rounded-lg bg-white p-3">
              <strong className="text-sm text-forest">{item.pattern}</strong>
              <p className="mt-1 text-sm leading-relaxed">{item.meaning}</p>
              <p className="mt-2 break-words text-sm text-[#65766b]">
                “{item.sentence}”
              </p>
              {onAdd && (
                <button
                  type="button"
                  className={ui('text-button')}
                  disabled={
                    notes.includes(noteFor(item)) ||
                    notes.length + noteFor(item).length + 2 > 50000
                  }
                  onClick={() => onAdd(noteFor(item))}
                >
                  {notes.includes(noteFor(item))
                    ? 'Đã thêm vào ghi chú'
                    : 'Thêm vào ghi chú'}
                </button>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 text-sm text-[#65766b]">
          {structures.length
            ? 'Chưa tìm thấy cấu trúc đã lưu phù hợp với nội dung này.'
            : 'Bạn chưa lưu cấu trúc câu nào để đối chiếu.'}
        </p>
      )}
    </section>
  );
};
export default StructureSuggestions;
