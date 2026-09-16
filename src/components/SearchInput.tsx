import { Search, X } from 'lucide-react';

type SearchInputProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

const SearchInput = ({
  value,
  onChange,
  placeholder = 'Tìm cụm từ, nghĩa hoặc ghi chú…',
}: SearchInputProps) => (
  <div className="search-field">
    <Search size={19} aria-hidden="true" />
    <input
      placeholder={placeholder}
      aria-label="Tìm bài học"
      value={value}
      onChange={(event) => onChange(event.target.value)}
    />
    {value && (
      <button
        type="button"
        className="icon-button"
        onClick={() => onChange('')}
        aria-label="Xóa tìm kiếm"
      >
        <X size={15} />
      </button>
    )}
  </div>
);

export default SearchInput;
