import React from 'react';
import type { Lesson } from '@/db';
import { useLanguage } from '@/language';
import { Trophy } from 'lucide-react';

interface LessonProgressSectionProps {
  all: Lesson[];
}

export const LessonProgressSection: React.FC<LessonProgressSectionProps> = ({
  all,
}) => {
  const { t } = useLanguage();

  const calcProgress = (items: Lesson[]) => {
    if (items.length === 0) return 0;
    const learnedCount = items.filter((l) => l.status === 'learned').length;
    return Math.round((learnedCount / items.length) * 100);
  };

  const overallProgress = calcProgress(all);
  const totalLearned = all.filter((l) => l.status === 'learned').length;

  return (
    <div className="mb-6">
      {/* Banner Tổng quan hoàn thành */}
      <div className="relative overflow-hidden rounded-xl border border-line bg-surface p-5 sm:p-6 transition-colors">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <span className="theme-fixed-color grid size-12 shrink-0 place-items-center rounded-xl bg-[#fbf2e3] text-[#b08137]">
              <Trophy size={24} aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-forest">
                  {t('progress.eyebrow')}
                </span>
                <span className="rounded-md border border-line bg-surface-soft px-2 py-0.5 text-[11px] font-medium text-muted">
                  {all.length} {t('progress.itemsSuffix')}
                </span>
              </div>
              <h2 className="mt-0.5 text-lg font-semibold text-text">
                {t('progress.overview')}
              </h2>
              <p className="text-xs text-muted">
                {t('progress.masteredSummary')
                  .replace('{learned}', String(totalLearned))
                  .replace('{total}', String(all.length))}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 md:w-64">
            <div className="flex-1">
              <div className="mb-1.5 flex justify-between text-xs font-medium text-muted">
                <span>{t('progress.label')}</span>
                <span className="font-semibold text-text">
                  {overallProgress}%
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-surface-soft border border-line">
                <div
                  className="h-full rounded-full bg-forest transition-all duration-500"
                  style={{ width: `${overallProgress}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonProgressSection;
