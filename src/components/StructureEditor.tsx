import { ui } from '@/styles/ui';
import { useState } from 'react';
import { Plus } from 'lucide-react';

type Props = {
  notes: string;
  onChange: (notes: string) => void;
};

const StructureEditor = ({ notes, onChange }: Props) => {
  const [pattern, setPattern] = useState('');
  const [meaning, setMeaning] = useState('');
  const [example, setExample] = useState('');
  const [message, setMessage] = useState('');
  const text = [
    pattern.trim() ? `Cấu trúc: ${pattern.trim()}` : '',
    meaning.trim() ? `Cách dùng: ${meaning.trim()}` : '',
    example.trim() ? `Ví dụ: ${example.trim()}` : '',
  ]
    .filter(Boolean)
    .join('\n');
  const nextNotes = notes ? `${notes}\n\n${text}` : text;
  const duplicate = !!pattern.trim() && notes.includes(text);
  const tooLong = nextNotes.length > 50000;
  const addStructure = () => {
    if (!pattern.trim() || duplicate || tooLong) return;
    onChange(nextNotes);
    setPattern('');
    setMeaning('');
    setExample('');
    setMessage('Đã thêm cấu trúc vào ghi chú. Bấm Lưu bài học để lưu lại.');
  };

  return (
    <section
      className="my-4 rounded-xl border border-[#dce4de] bg-white p-4"
      aria-label="Thêm cấu trúc câu"
    >
      <h3 className="text-sm font-semibold text-forest">Thêm cấu trúc câu</h3>
      <p className="mt-1 mb-3 text-xs leading-relaxed text-[#65766b]">
        Nhập cấu trúc bạn muốn học. Sau khi thêm, bạn có thể sửa hoặc xóa trong
        phần Ghi chú & ví dụ.
      </p>
      <label>
        Mẫu cấu trúc
        <input
          value={pattern}
          maxLength={500}
          placeholder="Ví dụ: S + find + O + adjective"
          onChange={(e) => {
            setPattern(e.target.value);
            setMessage('');
          }}
        />
      </label>
      <label>
        Cách dùng / ý nghĩa
        <textarea
          rows={2}
          value={meaning}
          maxLength={5000}
          placeholder="Ví dụ: Diễn tả cảm nhận về người hoặc sự vật."
          onChange={(e) => setMeaning(e.target.value)}
        />
      </label>
      <label>
        Câu ví dụ
        <textarea
          rows={2}
          value={example}
          maxLength={5000}
          placeholder="Ví dụ: I find this book useful."
          onChange={(e) => setExample(e.target.value)}
        />
      </label>
      <button
        type="button"
        className={ui('button secondary')}
        disabled={!pattern.trim() || duplicate || tooLong}
        onClick={addStructure}
      >
        <Plus size={16} /> Thêm cấu trúc vào ghi chú
      </button>
      {duplicate && (
        <p className="mt-2 text-sm text-[#65766b]">
          Cấu trúc này đã có trong ghi chú.
        </p>
      )}
      {tooLong && (
        <p className={ui('error')} role="alert">
          Ghi chú vượt quá 50.000 ký tự. Hãy rút gọn nội dung trước khi thêm.
        </p>
      )}
      {message && (
        <p className="mt-2 text-sm text-forest" role="status">
          {message}
        </p>
      )}
    </section>
  );
};
export default StructureEditor;
