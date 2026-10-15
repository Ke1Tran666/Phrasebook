import { BookOpen } from 'lucide-react';
import { useLanguage } from '@/language';

const WorkspaceFooter = () => {
  const { t } = useLanguage();
  return (
    <footer className="workspace-foot mt-8 flex flex-wrap items-center justify-between gap-5 border-t border-line py-5 text-xs leading-relaxed text-[#9a909f]">
      <span className="flex min-w-0 items-center gap-2">
        <BookOpen size={15} className="shrink-0" aria-hidden="true" />
        {t('footer.motto')}
      </span>
      <span className="hidden min-[761px]:inline">{t('footer.product')}</span>
    </footer>
  );
};
export default WorkspaceFooter;
