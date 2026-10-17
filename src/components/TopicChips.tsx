import { useRef } from 'react';
import { Tag } from 'lucide-react';

interface TopicChipsProps {
  topics: string[];
  selectedTopic: string;
  allLabel: string;
  onSelectTopic: (topic: string) => void;
  className?: string;
}

export const TopicChips = ({
  topics,
  selectedTopic,
  allLabel,
  onSelectTopic,
  className = '',
}: TopicChipsProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const allTopics = [
    { value: 'all', label: allLabel },
    ...topics.map((t) => ({ value: t, label: t })),
  ];

  return (
    <div className={`relative flex items-center min-w-0 ${className}`}>
      <div className="flex shrink-0 items-center gap-1.5 pr-2 text-muted">
        <Tag size={15} aria-hidden="true" />
      </div>

      <div
        ref={scrollRef}
        role="tablist"
        aria-label="Topics"
        className="flex min-w-0 flex-1 items-center gap-2 overflow-x-auto py-1 scrollbar-none [-ms-overflow-style:none]"
      >
        {allTopics.map((item) => {
          const isSelected = selectedTopic === item.value;
          return (
            <button
              key={item.value}
              type="button"
              role="tab"
              aria-selected={isSelected}
              onClick={() => onSelectTopic(item.value)}
              className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all duration-150 select-none ${
                isSelected
                  ? 'bg-forest text-white shadow-xs'
                  : 'border border-line bg-surface text-text hover:border-forest/40 hover:bg-surface-soft'
              }`}
            >
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TopicChips;
