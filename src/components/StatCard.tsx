import type { LucideIcon } from 'lucide-react';

type StatCardProps = {
  label: string;
  value: number;
  icon: LucideIcon;
  color: 'green' | 'amber' | 'blue';
  description?: string;
  onClick?: () => void;
};

const iconColors = {
  green: 'bg-status-learned-bg text-status-learned',
  amber: 'bg-status-review-bg text-status-review',
  blue: 'bg-status-info-bg text-status-info',
};

const StatCard = ({
  label,
  value,
  icon: Icon,
  color,
  description,
  onClick,
}: StatCardProps) => {
  const Container = onClick ? 'button' : 'div';
  return (
    <Container
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      className="relative flex min-h-[110px] min-w-0 flex-col items-start gap-2 rounded-2xl border border-line bg-surface p-4 text-left shadow-xs transition-all duration-180 hover:border-line-hover hover:shadow-card hover:-translate-y-0.5 min-[761px]:flex-row min-[761px]:items-center min-[761px]:gap-3.5 min-[761px]:p-5 min-[1151px]:gap-4.5 min-[1151px]:p-6"
    >
      <span
        className={`grid size-10 shrink-0 place-items-center rounded-xl transition-colors min-[761px]:size-11 ${iconColors[color]}`}
      >
        <Icon
          size={20}
          className="size-5 min-[761px]:size-[22px]"
          aria-hidden="true"
        />
      </span>
      <div className="min-w-0">
        <span className="block text-xs font-medium text-muted min-[1151px]:text-sm truncate">
          {label}
        </span>
        <strong className="text-2xl font-bold tracking-tight text-text min-[761px]:text-3xl">
          {String(value).padStart(2, '0')}
        </strong>
      </div>
      {description && <small className="sr-only">{description}</small>}
    </Container>
  );
};

export default StatCard;
