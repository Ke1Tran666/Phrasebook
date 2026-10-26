import { useEffect, useRef, useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';

export type FilterOption = { value: string; label: string };

export type FilterSelectProps = {
  label: string;
  value: string;
  options: FilterOption[];
  onChange: (value: string) => void;
  className?: string;
};

const FilterSelect = ({
  label,
  value,
  options,
  onChange,
  className = '',
}: FilterSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption =
    options.find((opt) => opt.value === value) || options[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleSelect = (val: string) => {
    onChange(val);
    setIsOpen(false);
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full min-w-0 select-none ${className}`}
    >
      <button
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={label}
        onClick={() => setIsOpen((prev) => !prev)}
        className={`flex w-full min-h-10 items-center justify-between rounded-xl border border-line bg-surface px-3.5 py-2 text-left text-xs sm:text-sm font-normal text-text transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest/20 ${
          isOpen
            ? 'border-forest ring-2 ring-forest/20 shadow-xs'
            : 'hover:border-line-hover'
        }`}
      >
        <span className="truncate pr-1">
          {selectedOption ? selectedOption.label : label}
        </span>
        <ChevronDown
          size={15}
          aria-hidden="true"
          className={`shrink-0 text-muted transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-forest' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div
          role="listbox"
          aria-label={label}
          className="absolute left-0 top-full z-50 mt-1.5 max-h-60 w-full min-w-36 overflow-auto rounded-2xl border border-line bg-surface-elevated p-1.5 shadow-dropdown backdrop-blur-md animate-in fade-in-0 zoom-in-95 duration-100"
        >
          {options.map((option) => {
            const isSelected = option.value === value;
            return (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => handleSelect(option.value)}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-xs sm:text-sm transition-colors ${
                  isSelected
                    ? 'bg-surface-soft font-semibold text-forest'
                    : 'text-text hover:bg-surface-soft'
                }`}
              >
                <span className="truncate">{option.label}</span>
                {isSelected && (
                  <Check
                    size={14}
                    aria-hidden="true"
                    className="ml-2 shrink-0 text-forest"
                  />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FilterSelect;
