type FilterOption = { value: string; label: string };
type FilterSelectProps = {
  label: string;
  value: string;
  options: FilterOption[];
  onChange: (value: string) => void;
};

const FilterSelect = ({
  label,
  value,
  options,
  onChange,
}: FilterSelectProps) => (
  <select
    className="w-full min-w-0 rounded-[7px] border border-line bg-surface px-2.5 py-3 text-base font-normal text-[#706875] outline-none focus:border-[#9b4ed6] focus:shadow-[0_0_0_3px_#8b2bd11a] min-[761px]:text-sm"
    aria-label={label}
    value={value}
    onChange={(event) => onChange(event.target.value)}
  >
    {options.map((option) => (
      <option key={option.value} value={option.value}>
        {option.label}
      </option>
    ))}
  </select>
);
export default FilterSelect;
