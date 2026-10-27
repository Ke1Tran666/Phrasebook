import { useMemo } from 'react';
import {
  detectStructures,
  type SavedStructure,
  type StructureSuggestion,
} from '@/structures';
import { useLanguage } from '@/language';
import { Check, Plus, Sparkles } from 'lucide-react';

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
  const { t } = useLanguage();
  const suggestions = useMemo(
    () => detectStructures(english, structures),
    [english, structures],
  );

  if (!english.trim()) return null;

  return (
    <section
      className="rounded-2xl border border-line bg-surface-soft p-4 sm:p-5 shadow-xs transition-colors"
      aria-label={t('suggestions.title')}
    >
      <div className="flex items-center gap-2 text-forest">
        <Sparkles size={18} />
        <h3 className="text-sm font-bold">{t('suggestions.title')}</h3>
      </div>
      <p className="mt-1 text-xs text-text-secondary leading-relaxed">
        {t('suggestions.description')}
      </p>

      {suggestions.length > 0 ? (
        <ul className="mt-3.5 space-y-2.5">
          {suggestions.map((item) => {
            const isAdded = notes.includes(noteFor(item));
            const isTooLong = notes.length + noteFor(item).length + 2 > 50000;

            return (
              <li
                key={item.id}
                className="group flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-line bg-surface p-3.5 shadow-xs hover:border-line-hover transition-all"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs font-bold text-forest bg-forest-soft px-2 py-0.5 rounded-md">
                      {item.pattern}
                    </span>
                  </div>
                  <p className="mt-1 text-xs sm:text-sm text-text font-medium leading-snug">
                    {item.meaning}
                  </p>
                  <p className="mt-1 text-xs text-muted italic break-words">
                    “{item.sentence}”
                  </p>
                </div>

                {onAdd && (
                  <button
                    type="button"
                    className={`inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold shrink-0 transition-all ${
                      isAdded
                        ? 'bg-status-learned-bg text-status-learned border border-status-learned/25 cursor-default'
                        : 'border border-line bg-surface hover:bg-forest hover:text-white hover:border-forest text-text shadow-xs disabled:cursor-not-allowed disabled:opacity-50'
                    }`}
                    disabled={isAdded || isTooLong}
                    onClick={() => onAdd(noteFor(item))}
                  >
                    {isAdded ? (
                      <>
                        <Check size={14} />
                        <span>{t('suggestions.added')}</span>
                      </>
                    ) : (
                      <>
                        <Plus size={14} />
                        <span>{t('suggestions.add')}</span>
                      </>
                    )}
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="mt-2.5 text-xs text-muted italic">
          {structures.length
            ? t('suggestions.noMatch')
            : t('suggestions.noStructures')}
        </p>
      )}
    </section>
  );
};

export default StructureSuggestions;
