import type { LucideIcon } from 'lucide-react';

type StatCardProps = {
  label: string;
  value: number;
  icon: LucideIcon;
  color: 'green' | 'amber' | 'blue';
  description?: string;
  onClick: () => void;
};

const StatCard = ({
  label,
  value,
  icon: Icon,
  color,
  description,
  onClick,
}: StatCardProps) => (
  <button type="button" onClick={onClick}>
    <span className={`stat-icon ${color}`}>
      <Icon size={21} aria-hidden="true" />
    </span>
    <div>
      <span>{label}</span>
      <strong>{String(value).padStart(2, '0')}</strong>
    </div>
    {description && <small>{description}</small>}
  </button>
);

export default StatCard;
