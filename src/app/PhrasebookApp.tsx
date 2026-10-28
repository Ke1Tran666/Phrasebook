import AppOverlays from '@/app/AppOverlays';
import AppWorkspace from '@/app/AppWorkspace';
import { usePhrasebookApp } from '@/app/hooks/usePhrasebookApp';
import { ui } from '@/styles/ui';

const PhrasebookApp = () => {
  const controller = usePhrasebookApp();

  return (
    <div className={ui('app-shell')}>
      <AppWorkspace controller={controller} />
      <AppOverlays controller={controller} />
    </div>
  );
};

export default PhrasebookApp;
