import { Search, X } from 'lucide-react';
import { useLanguage } from '@/language';

type SearchInputProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

const SearchInput = ({ value, onChange, placeholder }: SearchInputProps) => {
  const { t } = useLanguage();
  return (
    <div className="search-field flex w-full min-w-0 items-center gap-2.5 rounded-xl border border-line bg-surface px-3.5 text-muted transition-all duration-150 focus-within:border-forest focus-within:ring-2 focus-within:ring-forest/20">
      <Search size={18} className="shrink-0 text-muted" aria-hidden="true" />
      <input
        className="min-w-0 flex-1 rounded-none border-0 bg-transparent px-0 py-2.5 text-sm font-normal text-text placeholder:text-muted shadow-none outline-none focus:shadow-none"
        placeholder={placeholder ?? t('search.placeholder')}
        aria-label={t('search.label')}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
      {value && (
        <button
          type="button"
          className="inline-flex shrink-0 items-center justify-center rounded-lg border-0 bg-transparent p-1 text-muted transition-colors hover:bg-surface-soft hover:text-text"
          onClick={() => onChange('')}
          aria-label={t('search.clear')}
        >
          <X size={15} />
        </button>
      )}
    </div>
  );
};

export default SearchInput;
