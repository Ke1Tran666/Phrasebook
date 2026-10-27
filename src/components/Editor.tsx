import HelpDialog from '@/components/HelpDialog';
import StructureSuggestions from '@/components/StructureSuggestions';
import { useLiveQuery } from 'dexie-react-hooks';
import {
  AlignLeft,
  AlertCircle,
  Bookmark,
  Check,
  CircleHelp,
  Eye,
  HardDrive,
  Highlighter,
  LoaderCircle,
  Sparkles,
  Tag,
  Trash2,
  X,
} from 'lucide-react';
import { useRef, useState, type ReactNode } from 'react';
import { db, saveLesson, type Highlight, type Lesson } from '@/db';
import { useLanguage } from '@/language';

type EditorProps = {
  lesson: Lesson | null;
  onClose: () => void;
  onSaved: (lesson: Lesson) => void;
  notify: (message: string) => void;
};

const Editor = ({ lesson, onClose, onSaved, notify }: EditorProps) => {
  const { t } = useLanguage();
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
  const [showPreview, setShowPreview] = useState(true);

  const area = useRef<HTMLTextAreaElement>(null);

  const topics =
    useLiveQuery(() => db.lessons.orderBy('topic').uniqueKeys(), []) ?? [];
  const savedStructures =
    useLiveQuery(
      () => db.lessons.where('type').equals('structure').toArray(),
      [],
    ) ?? [];

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
        ...(lesson?.lastReviewedAt
          ? { lastReviewedAt: lesson.lastReviewedAt }
          : {}),
        ...(lesson?.nextReviewAt ? { nextReviewAt: lesson.nextReviewAt } : {}),
      };
      await saveLesson(l);
      onSaved(l);
      notify(lesson ? t('editor.updated') : t('editor.added'));
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
      setError(t('editor.overlap'));
      return;
    }
    const text = english.slice(start, end);
    if (!text.trim()) return;

    setHighlights([
      ...highlights,
      { start, end, text, meaning: '' },
    ]);
    setSelection(null);
    setError('');
  };

  const selectedText =
    selection && selection.end > selection.start
      ? english.slice(selection.start, selection.end).trim()
      : '';

  // Render live highlights preview
  const renderHighlightsPreview = () => {
    const spans = [...highlights].sort((a, b) => a.start - b.start);
    let pos = 0;
    const out: ReactNode[] = [];
    spans.forEach((h, i) => {
      if (h.start < pos) return;
      out.push(english.slice(pos, h.start));
      out.push(
        <mark
          key={i}
          className="bg-lime text-inherit px-1 py-0.5 rounded font-semibold cursor-help"
          title={h.meaning ? `${h.text}: ${h.meaning}` : h.text}
        >
          {english.slice(h.start, h.end)}
        </mark>,
      );
      pos = h.end;
    });
    out.push(english.slice(pos));
    return out;
  };

  return (
    <>
      <form onSubmit={submit} className="flex flex-col">
        {/* Sticky Header */}
        <div className="sticky top-0 z-20 flex items-center justify-between border-b border-line bg-surface/95 px-5 sm:px-7 py-4 backdrop-blur-md">
          <div>
            <span className="block text-[11px] font-bold uppercase tracking-wider text-muted">
              {t('editor.eyebrow')}
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-text mt-0.5">
              {lesson ? t('editor.editTitle') : t('editor.addHeading')}
            </h2>
          </div>
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-muted hover:bg-surface-soft hover:text-text transition-colors"
            onClick={onClose}
            aria-label={t('common.close')}
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-7 space-y-6">
          {/* Lesson Type Switcher & Help */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex rounded-xl border border-line bg-surface-soft p-1 shadow-xs">
              <button
                type="button"
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                  type === 'phrase'
                    ? 'bg-surface text-forest shadow-xs'
                    : 'text-muted hover:text-text'
                }`}
                onClick={() => setType('phrase')}
              >
                <Bookmark size={15} />
                <span>{t('lesson.phrase')}</span>
              </button>
              <button
                type="button"
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                  type === 'passage'
                    ? 'bg-surface text-forest shadow-xs'
                    : 'text-muted hover:text-text'
                }`}
                onClick={() => setType('passage')}
              >
                <AlignLeft size={15} />
                <span>{t('lesson.passage')}</span>
              </button>
              <button
                type="button"
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                  type === 'structure'
                    ? 'bg-surface text-forest shadow-xs'
                    : 'text-muted hover:text-text'
                }`}
                onClick={() => setType('structure')}
              >
                <Sparkles size={15} />
                <span>{t('lesson.structure')}</span>
              </button>
            </div>

            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-xl border border-line bg-surface px-3 py-1.5 text-xs font-semibold text-muted hover:text-text hover:bg-surface-soft transition-colors shadow-xs"
              aria-label={t('editor.helpLabel')}
              title={t('editor.helpTitle')}
              aria-haspopup="dialog"
              onClick={() => setHelpOpen(true)}
            >
              <CircleHelp size={16} />
              <span>{t('editor.helpTitle')}</span>
            </button>
          </div>

          {/* English / Pattern Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="english-input" className="text-sm font-bold text-text">
                {type === 'structure'
                  ? t('editor.structurePattern')
                  : t('editor.englishContent')}
                <span className="ml-1 text-status-danger">*</span>
              </label>
              <span className="text-xs text-muted font-medium">
                {english.length} ký tự
              </span>
            </div>

            <div className="relative">
              <textarea
                id="english-input"
                ref={area}
                autoFocus
                required
                maxLength={50000}
                rows={type === 'passage' ? 6 : 3}
                className={`w-full rounded-xl border border-line bg-surface p-3.5 text-sm sm:text-base leading-relaxed text-text placeholder:text-muted focus:border-forest transition-colors ${
                  type === 'structure' ? 'font-mono text-forest font-semibold' : 'font-medium'
                }`}
                placeholder={
                  type === 'structure'
                    ? t('editor.structurePlaceholder')
                    : type === 'phrase'
                      ? t('editor.phrasePlaceholder')
                      : t('editor.passagePlaceholder')
                }
                value={english}
                onChange={(e) => {
                  setEnglish(e.target.value);
                  setHighlights([]);
                  setSelection(null);
                }}
                onSelect={() => {
                  const el = area.current;
                  if (el && el.selectionEnd > el.selectionStart) {
                    setSelection({
                      start: el.selectionStart,
                      end: el.selectionEnd,
                    });
                  } else {
                    setSelection(null);
                  }
                }}
              />
            </div>

            {/* Selection Toolbar (for phrase & passage) */}
            {type !== 'structure' && (
              <div className="mt-1">
                {selectedText ? (
                  <div className="flex flex-wrap items-center justify-between gap-2.5 rounded-xl border border-forest/25 bg-forest-soft p-2.5 sm:px-3.5">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-xs font-semibold text-forest">Đang chọn:</span>
                      <span className="max-w-[200px] sm:max-w-xs truncate rounded bg-surface px-2 py-0.5 font-mono text-xs font-bold text-text border border-line">
                        "{selectedText}"
                      </span>
                    </div>
                    <button
                      type="button"
                      className="inline-flex items-center gap-1.5 rounded-lg bg-forest px-3 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-forest-hover active:scale-[0.99] transition-all"
                      onClick={addHighlight}
                    >
                      <Highlighter size={14} />
                      <span>{t('editor.savePhrase')}</span>
                    </button>
                  </div>
                ) : (
                  <p className="text-xs text-muted leading-relaxed">
                    {t('editor.selectionHint')}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Highlighted Phrases Manager & Live Preview */}
          {type !== 'structure' && highlights.length > 0 && (
            <div className="rounded-2xl border border-line bg-surface-soft p-4 sm:p-5 space-y-3.5 shadow-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-forest">
                  <Highlighter size={17} />
                  <h3 className="text-xs font-bold uppercase tracking-wider">
                    Cụm từ đã đánh dấu ({highlights.length})
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowPreview(!showPreview)}
                  className="inline-flex items-center gap-1 text-xs font-medium text-muted hover:text-text"
                >
                  <Eye size={14} />
                  <span>{showPreview ? 'Ẩn xem trước' : 'Xem trước'}</span>
                </button>
              </div>

              {/* Live Preview Box */}
              {showPreview && (
                <div className="rounded-xl border border-line bg-surface p-3.5 text-sm sm:text-base leading-relaxed text-text">
                  <div className="text-[11px] font-bold text-muted uppercase tracking-wider mb-1.5">
                    Hiển thị thực tế:
                  </div>
                  <div className="whitespace-pre-wrap">{renderHighlightsPreview()}</div>
                </div>
              )}

              {/* Highlights List */}
              <div className="space-y-2.5">
                {highlights.map((h, i) => (
                  <div
                    key={`${h.start}-${h.end}-${i}`}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 rounded-xl border border-line bg-surface p-3 shadow-xs"
                  >
                    <div className="flex items-center gap-2 min-w-0 sm:w-1/3">
                      <span className="shrink-0 flex h-6 w-6 items-center justify-center rounded-md bg-forest-soft text-forest text-xs font-bold">
                        {i + 1}
                      </span>
                      <strong className="truncate text-xs sm:text-sm font-bold text-forest">
                        {h.text}
                      </strong>
                    </div>

                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <input
                        aria-label={`Nghĩa của ${h.text}`}
                        placeholder={t('editor.phraseMeaning')}
                        maxLength={10000}
                        value={h.meaning}
                        onChange={(e) =>
                          setHighlights(
                            highlights.map((item, j) =>
                              i === j ? { ...item, meaning: e.target.value } : item,
                            ),
                          )
                        }
                        className="w-full rounded-lg border border-line bg-surface-soft px-3 py-1.5 text-xs text-text placeholder:text-muted focus:border-forest"
                      />
                      <button
                        type="button"
                        className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted hover:bg-status-danger-bg hover:text-status-danger transition-colors"
                        aria-label={`Bỏ đánh dấu ${h.text}`}
                        title="Xóa cụm từ này"
                        onClick={() =>
                          setHighlights(highlights.filter((_, j) => j !== i))
                        }
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Structure Suggestions (Only for phrase / passage) */}
          {type !== 'structure' && (
            <StructureSuggestions
              english={english}
              notes={notes}
              structures={savedStructures}
              onAdd={(text) =>
                setNotes((current) =>
                  current ? `${current}\n\n${text}` : text,
                )
              }
            />
          )}

          {/* Vietnamese Meaning Input */}
          <div className="space-y-1.5">
            <label htmlFor="meaning-input" className="text-sm font-bold text-text">
              {type === 'structure'
                ? t('editor.usageMeaning')
                : t('editor.vietnameseMeaning')}
            </label>
            <textarea
              id="meaning-input"
              rows={3}
              maxLength={50000}
              placeholder={t('editor.meaningPlaceholder')}
              value={meaning}
              onChange={(e) => setMeaning(e.target.value)}
              className="w-full rounded-xl border border-line bg-surface p-3.5 text-sm leading-relaxed text-text placeholder:text-muted focus:border-forest transition-colors"
            />
          </div>

          {/* Topic with Autocomplete & Quick Chips */}
          <div className="space-y-2">
            <label htmlFor="topic-input" className="text-sm font-bold text-text">
              {t('editor.topic')}
            </label>
            <div className="relative">
              <input
                id="topic-input"
                list="topics"
                maxLength={100}
                placeholder={t('editor.topicPlaceholder')}
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full rounded-xl border border-line bg-surface p-3 text-sm text-text placeholder:text-muted focus:border-forest transition-colors"
              />
              <datalist id="topics">
                {topics.filter(Boolean).map((t) => (
                  <option key={String(t)} value={String(t)} />
                ))}
              </datalist>
            </div>

            {/* Quick Topic Chips */}
            {topics.filter(Boolean).length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                <span className="text-[11px] font-semibold text-muted flex items-center gap-1">
                  <Tag size={12} /> Gợi ý:
                </span>
                {topics
                  .filter(Boolean)
                  .slice(0, 6)
                  .map((tName) => {
                    const name = String(tName);
                    const isSelected = topic.trim() === name;
                    return (
                      <button
                        key={name}
                        type="button"
                        onClick={() => setTopic(name)}
                        className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
                          isSelected
                            ? 'bg-forest text-white font-semibold shadow-xs'
                            : 'border border-line bg-surface text-text hover:border-forest hover:text-forest'
                        }`}
                      >
                        {name}
                      </button>
                    );
                  })}
              </div>
            )}
          </div>

          {/* Notes & Examples Input */}
          <div className="space-y-1.5">
            <label htmlFor="notes-input" className="text-sm font-bold text-text">
              {type === 'structure'
                ? t('editor.structureNotes')
                : t('editor.notes')}
            </label>
            <textarea
              id="notes-input"
              rows={4}
              maxLength={50000}
              placeholder={t('editor.notesPlaceholder')}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full rounded-xl border border-line bg-surface p-3.5 text-sm leading-relaxed text-text placeholder:text-muted focus:border-forest transition-colors"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div
              className="flex items-start gap-2.5 rounded-xl border border-status-danger/25 bg-status-danger-bg p-3.5 text-xs sm:text-sm text-status-danger"
              role="alert"
            >
              <AlertCircle size={17} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Sticky Footer */}
        <footer className="sticky bottom-0 z-20 flex flex-wrap items-center justify-between gap-3 border-t border-line bg-surface-soft/90 px-5 sm:px-7 py-4 backdrop-blur-md">
          <div className="flex items-center gap-2 text-xs text-muted">
            <HardDrive size={15} />
            <span>{t('editor.savedLocally')}</span>
          </div>

          <div className="flex items-center gap-2.5 ml-auto">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-xl border border-line bg-surface px-4 py-2.5 text-xs sm:text-sm font-semibold text-text hover:bg-surface-soft transition-colors shadow-xs"
              onClick={onClose}
            >
              {t('common.cancel')}
            </button>
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-forest px-5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-xs hover:bg-forest-hover active:scale-[0.99] transition-all disabled:cursor-not-allowed disabled:opacity-50"
              disabled={saving || !english.trim()}
            >
              {saving ? (
                <LoaderCircle className="animate-spin" size={16} />
              ) : (
                <Check size={16} />
              )}
              <span>{t('editor.saveLesson')}</span>
            </button>
          </div>
        </footer>
      </form>

      <HelpDialog open={helpOpen} onClose={() => setHelpOpen(false)} />
    </>
  );
};

export default Editor;
