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
import { useLanguage } from '@/language';

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
            <span className={ui('eyebrow')}>{t('editor.eyebrow')}</span>
            <h2>{lesson ? t('editor.editTitle') : t('editor.addHeading')}</h2>
          </div>
          <button
            type="button"
            className={ui('icon-button')}
            onClick={onClose}
            aria-label={t('common.close')}
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
                <Bookmark size={17} /> {t('lesson.phrase')}
              </button>
              <button
                type="button"
                className={ui(type === 'passage' ? 'active' : '')}
                onClick={() => setType('passage')}
              >
                <FileText size={17} /> {t('lesson.passage')}
              </button>
              <button
                type="button"
                className={ui(type === 'structure' ? 'active' : '')}
                onClick={() => setType('structure')}
              >
                <FileText size={17} /> {t('lesson.structure')}
              </button>
            </div>
            <button
              type="button"
              className={ui('icon-button shrink-0')}
              aria-label={t('editor.helpLabel')}
              title={t('editor.helpTitle')}
              aria-haspopup="dialog"
              onClick={() => setHelpOpen(true)}
            >
              <CircleHelp size={22} />
            </button>
          </div>
          <label>
            {type === 'structure'
              ? t('editor.structurePattern')
              : t('editor.englishContent')}{' '}
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
              structures={savedStructures}
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
              <span>{t('editor.selectionHint')}</span>
              <button
                type="button"
                className={ui('text-button')}
                disabled={!selection}
                onClick={addHighlight}
              >
                <Highlighter size={16} /> {t('editor.savePhrase')}
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
                    placeholder={t('editor.phraseMeaning')}
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
            {type === 'structure'
              ? t('editor.usageMeaning')
              : t('editor.vietnameseMeaning')}
            <textarea
              rows={3}
              maxLength={50000}
              placeholder={t('editor.meaningPlaceholder')}
              value={meaning}
              onChange={(e) => setMeaning(e.target.value)}
            />
          </label>
          <label>
            {t('editor.topic')}
            <input
              list="topics"
              maxLength={100}
              placeholder={t('editor.topicPlaceholder')}
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
            {type === 'structure'
              ? t('editor.structureNotes')
              : t('editor.notes')}
            <textarea
              rows={4}
              maxLength={50000}
              placeholder={t('editor.notesPlaceholder')}
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
            <HardDrive size={15} /> {t('editor.savedLocally')}
          </span>
          <div>
            <button
              type="button"
              className={ui('button secondary')}
              onClick={onClose}
            >
              {t('common.cancel')}
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
              {t('editor.saveLesson')}
            </button>
          </div>
        </footer>
      </form>
      <HelpDialog open={helpOpen} onClose={() => setHelpOpen(false)} />
    </>
  );
};

export default Editor;
