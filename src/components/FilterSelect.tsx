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
    className="w-full min-w-0 rounded-[7px] border border-line bg-white px-2.5 py-3 text-base font-normal text-[#65766b] outline-none focus:border-[#56866b] focus:shadow-[0_0_0_3px_#234c3b12] min-[761px]:text-sm"
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
