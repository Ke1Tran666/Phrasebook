import { ui } from '@/styles/ui';
import HelpDialog from '@/components/HelpDialog';
import StructureSuggestions from '@/components/StructureSuggestions';
import { useLiveQuery } from 'dexie-react-hooks';
import {
  Bookmark,
  CircleHelp,
  Check,
  FileText,
  HardDrive,
  Highlighter,
  LoaderCircle,
  X,
} from 'lucide-react';
import { useRef, useState } from 'react';
import { db, saveLesson, type Highlight, type Lesson } from '@/db';

const Editor = ({
  lesson,
  onClose,
  onSaved,
  notify,
}: {
  lesson: Lesson | null;
  onClose: () => void;
  onSaved: (l: Lesson) => void;
  notify: (m: string) => void;
}) => {
  const [helpOpen, setHelpOpen] = useState(false);
  const [english, setEnglish] = useState(lesson?.english ?? '');
  const [meaning, setMeaning] = useState(lesson?.meaning ?? '');
  const [notes, setNotes] = useState(lesson?.notes ?? '');
  const [topic, setTopic] = useState(lesson?.topic ?? '');
  const [type, setType] = useState<Lesson['type']>(lesson?.type ?? 'phrase');
  const [highlights, setHighlights] = useState<Highlight[]>(
    lesson?.highlights ?? [],
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [selection, setSelection] = useState<{
    start: number;
    end: number;
  } | null>(null);
  const area = useRef<HTMLTextAreaElement>(null);
  const topics =
    useLiveQuery(() => db.lessons.orderBy('topic').uniqueKeys(), []) ?? [];
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const now = new Date().toISOString();
      const l: Lesson = {
        id: lesson?.id ?? crypto.randomUUID(),
        type,
        english,
        meaning: meaning.trim(),
        notes: notes.trim(),
        topic: topic.trim(),
        status: lesson?.status ?? 'new',
        highlights: type === 'structure' ? [] : highlights,
        createdAt: lesson?.createdAt ?? now,
        updatedAt: now,
      };
      await saveLesson(l);
      onSaved(l);
      notify(lesson ? 'Đã cập nhật bài học.' : 'Đã thêm bài học vào sổ.');
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSaving(false);
    }
  };
  const addHighlight = () => {
    if (!selection) return;
    const { start, end } = selection;
    if (highlights.some((h) => start < h.end && end > h.start)) {
      setError('Phần này đã được đánh dấu. Hãy chọn một cụm từ khác.');
      return;
    }
    setHighlights([
      ...highlights,
      { start, end, text: english.slice(start, end), meaning: '' },
    ]);
    setSelection(null);
    setError('');
  };
  return (
    <>
      <form onSubmit={submit}>
        <div className={ui('modal-heading')}>
          <div>
            <span className={ui('eyebrow')}>SỔ TAY CỦA BẠN</span>
            <h2>{lesson ? 'Chỉnh sửa bài học' : 'Thêm một điều vừa học'}</h2>
          </div>
          <button
            type="button"
            className={ui('icon-button')}
            onClick={onClose}
            aria-label="Đóng"
          >
            <X />
          </button>
        </div>
        <div className={ui('editor-body')}>
          <div className="flex items-start justify-between gap-3">
            <div className={ui('segmented')}>
              <button
                type="button"
                className={ui(type === 'phrase' ? 'active' : '')}
                onClick={() => setType('phrase')}
              >
                <Bookmark size={17} /> Cụm từ / câu
              </button>
              <button
                type="button"
                className={ui(type === 'passage' ? 'active' : '')}
                onClick={() => setType('passage')}
              >
                <FileText size={17} /> Đoạn văn
              </button>
              <button
                type="button"
                className={ui(type === 'structure' ? 'active' : '')}
                onClick={() => setType('structure')}
              >
                <FileText size={17} /> Cấu trúc câu
              </button>
            </div>
            <button
              type="button"
              className={ui('icon-button shrink-0')}
              aria-label="Hướng dẫn thêm, sửa, xóa bài học"
              title="Hướng dẫn sử dụng"
              aria-haspopup="dialog"
              onClick={() => setHelpOpen(true)}
            >
              <CircleHelp size={22} />
            </button>
          </div>
          <label>
            {type === 'structure' ? 'Mẫu cấu trúc' : 'Nội dung tiếng Anh'}{' '}
            <span className={ui('required')}>*</span>
            <textarea
              ref={area}
              autoFocus
              required
              maxLength={50000}
              rows={type === 'passage' ? 6 : 3}
              className={ui('english-input')}
              placeholder={
                type === 'structure'
                  ? 'Ví dụ: S + be going to + V'
                  : type === 'phrase'
                    ? 'Ví dụ: I’m going to go home.'
                    : 'Dán hoặc viết đoạn tiếng Anh bạn muốn học…'
              }
              value={english}
              onChange={(e) => {
                setEnglish(e.target.value);
                setHighlights([]);
                setSelection(null);
              }}
              onSelect={() => {
                const el = area.current;
                if (el && el.selectionEnd > el.selectionStart)
                  setSelection({
                    start: el.selectionStart,
                    end: el.selectionEnd,
                  });
                else setSelection(null);
              }}
            />
          </label>
          {type !== 'structure' && (
            <StructureSuggestions
              english={english}
              notes={notes}
              onAdd={(text) =>
                setNotes((current) =>
                  current
                    ? `${current}

${text}`
                    : text,
                )
              }
            />
          )}

          {type !== 'structure' && (
            <div className={ui('selection-hint')}>
              <span>
                Bôi chọn trong nội dung để lưu cụm từ. Sửa nội dung sẽ xóa các
                đánh dấu.
              </span>
              <button
                type="button"
                className={ui('text-button')}
                disabled={!selection}
                onClick={addHighlight}
              >
                <Highlighter size={16} /> Lưu cụm từ
              </button>
            </div>
          )}
          {type !== 'structure' && highlights.length > 0 && (
            <div className={ui('highlights-editor')}>
              {highlights.map((h, i) => (
                <div key={i}>
                  <strong>{h.text}</strong>
                  <input
                    aria-label={'Nghĩa của ' + h.text}
                    placeholder="Nghĩa / cách dùng của cụm từ"
                    maxLength={10000}
                    value={h.meaning}
                    onChange={(e) =>
                      setHighlights(
                        highlights.map((a, j) =>
                          i === j ? { ...a, meaning: e.target.value } : a,
                        ),
                      )
                    }
                  />
                  <button
                    type="button"
                    className={ui('icon-button')}
                    aria-label={'Bỏ đánh dấu ' + h.text}
                    onClick={() =>
                      setHighlights(highlights.filter((_, j) => j !== i))
                    }
                  >
                    <X size={17} />
                  </button>
                </div>
              ))}
            </div>
          )}
          <label>
            {type === 'structure' ? 'Cách dùng / ý nghĩa' : 'Nghĩa tiếng Việt'}
            <textarea
              rows={3}
              maxLength={50000}
              placeholder="Viết cách hiểu của bạn…"
              value={meaning}
              onChange={(e) => setMeaning(e.target.value)}
            />
          </label>
          <label>
            Chủ đề
            <input
              list="topics"
              maxLength={100}
              placeholder="Ví dụ: Cuộc sống, Công việc, Giao tiếp"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
            <datalist id="topics">
              {topics.filter(Boolean).map((t) => (
                <option key={String(t)} value={String(t)} />
              ))}
            </datalist>
          </label>
          <label>
            {type === 'structure' ? 'Ví dụ & ghi chú' : 'Ghi chú & ví dụ'}
            <textarea
              rows={4}
              maxLength={50000}
              placeholder="Cấu trúc, cách dùng hoặc một câu bạn tự đặt…"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </label>
          {error && (
            <p className={ui('error')} role="alert">
              {error}
            </p>
          )}
        </div>
        <footer className={ui('modal-footer')}>
          <span>
            <HardDrive size={15} /> Lưu trên trình duyệt này
          </span>
          <div>
            <button
              type="button"
              className={ui('button secondary')}
              onClick={onClose}
            >
              Hủy
            </button>
            <button
              className={ui('button primary')}
              disabled={saving || !english.trim()}
            >
              {saving ? (
                <LoaderCircle className={ui('spin')} size={17} />
              ) : (
                <Check size={17} />
              )}{' '}
              Lưu bài học
            </button>
          </div>
        </footer>
      </form>
      <HelpDialog open={helpOpen} onClose={() => setHelpOpen(false)} />
    </>
  );
};

export default Editor;
