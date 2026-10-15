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
  <div className="search-field flex w-full min-w-0 items-center gap-2.5 rounded-[7px] border border-line bg-[var(--color-surface)] px-[13px] text-[#95a099] focus-within:border-[#a65bd0]">
    <Search size={19} className="shrink-0" aria-hidden="true" />
    <input
      className="min-w-0 flex-1 rounded-none border-0 bg-transparent px-0 py-3 text-base font-normal text-[#3b3340] shadow-none outline-none focus:shadow-none min-[761px]:text-sm"
      placeholder={placeholder}
      aria-label="Tìm bài học"
      value={value}
      onChange={(event) => onChange(event.target.value)}
    />
    {value && (
      <button
        type="button"
        className="inline-flex shrink-0 items-center justify-center rounded-md border-0 bg-transparent p-1.5 text-[#8a7e8f] hover:bg-[#f5edf9]"
        onClick={() => onChange('')}
        aria-label="Xóa tìm kiếm"
      >
        <X size={15} />
      </button>
    )}
  </div>
);
export default SearchInput;
