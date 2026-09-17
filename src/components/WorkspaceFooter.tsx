import { BookOpen } from 'lucide-react';

const WorkspaceFooter = () => (
  <footer className="workspace-foot mt-8 flex flex-wrap items-center justify-between gap-5 border-t border-line py-5 text-xs leading-relaxed text-[#96a198]">
    <span className="flex min-w-0 items-center gap-2">
      <BookOpen size={15} className="shrink-0" aria-hidden="true" />
      Mỗi câu bạn lưu là một bước tiến.
    </span>
    <span className="hidden min-[761px]:inline">
      Phrasebook · Sổ tiếng Anh cá nhân
    </span>
  </footer>
);
export default WorkspaceFooter;
