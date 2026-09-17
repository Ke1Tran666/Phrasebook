import type { LucideIcon } from 'lucide-react';

type StatCardProps = {
  label: string;
  value: number;
  icon: LucideIcon;
  color: 'green' | 'amber' | 'blue';
  description?: string;
  onClick: () => void;
};
const iconColors = {
  green: 'bg-[#edf4eb] text-[#4f7757]',
  amber: 'bg-[#fbf2e3] text-[#b08137]',
  blue: 'bg-[#eaf1fa] text-[#5c81a1]',
};
const StatCard = ({
  label,
  value,
  icon: Icon,
  color,
  description,
  onClick,
}: StatCardProps) => (
  <button
    type="button"
    onClick={onClick}
    className="relative flex min-h-[130px] min-w-0 flex-col items-start gap-1.5 rounded-[10px] border border-line bg-white px-2.5 py-3.5 text-left hover:border-[#a8beae] min-[761px]:min-h-[124px] min-[761px]:flex-row min-[761px]:items-center min-[761px]:gap-3 min-[761px]:px-[15px] min-[761px]:py-5 min-[1151px]:gap-4 min-[1151px]:px-[22px] min-[1151px]:py-6"
  >
    <span
      className={`grid size-[34px] shrink-0 place-items-center rounded-[8px] min-[761px]:size-[43px] min-[761px]:rounded-[10px] ${iconColors[color]}`}
    >
      <Icon
        size={21}
        className="size-[18px] min-[761px]:size-[21px]"
        aria-hidden="true"
      />
    </span>
    <div className="min-w-0">
      <span className="block text-[11px] text-[#78877d] min-[761px]:text-xs min-[1151px]:text-sm">
        {label}
      </span>
      <strong className="text-[25px] leading-[1.4] font-medium tracking-[-1px] min-[761px]:text-[30px]">
        {String(value).padStart(2, '0')}
      </strong>
    </div>
    {description && <small className="sr-only">{description}</small>}
  </button>
);
export default StatCard;
